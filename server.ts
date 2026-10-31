import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { 
  generateStylePromptServer, 
  generateLyricsServer, 
  generateMusicVideoServer 
} from './server/geminiServer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Store generated videos in-memory with automatic cleanup
const videoStore = new Map<string, { buffer: Buffer; createdAt: number }>();

// Cleanup videos older than 1 hour
setInterval(() => {
  const now = Date.now();
  for (const [id, item] of videoStore.entries()) {
    if (now - item.createdAt > 60 * 60 * 1000) {
      videoStore.delete(id);
    }
  }
}, 10 * 60 * 1000);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Style Prompt Generation
app.post('/api/gemini/style', async (req: Request, res: Response) => {
  try {
    const { config } = req.body;
    if (!config) {
      return res.status(400).json({ error: 'Config object is required' });
    }

    const result = await generateStylePromptServer(config);
    return res.json(result);
  } catch (error: any) {
    console.error('Error generating style prompt:', error);
    return res.status(500).json({ 
      error: error.message || 'Gagal meracik komposisi musik pop nostalgia' 
    });
  }
});

// Lyrics Generation (Supports both standard JSON and Server-Sent Events streaming)
app.post('/api/gemini/lyrics', async (req: Request, res: Response) => {
  const { config, stream } = req.body;
  if (!config) {
    return res.status(400).json({ error: 'Config object is required' });
  }

  if (stream) {
    // SSE Streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      const fullLyrics = await generateLyricsServer(config, (chunk) => {
        res.write(`data: ${JSON.stringify({ type: 'chunk', text: chunk })}\n\n`);
      });
      res.write(`data: ${JSON.stringify({ type: 'done', text: fullLyrics })}\n\n`);
      return res.end();
    } catch (error: any) {
      console.error('Error streaming lyrics:', error);
      res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
      return res.end();
    }
  }

  // Standard JSON response
  try {
    const lyrics = await generateLyricsServer(config);
    return res.json({ lyrics });
  } catch (error: any) {
    console.error('Error generating lyrics:', error);
    return res.status(500).json({ 
      error: error.message || 'Gagal menulis lirik lagu' 
    });
  }
});

// Video Visualizer Generation via Server-Sent Events (SSE)
app.post('/api/gemini/video', async (req: Request, res: Response) => {
  const { stylePrompt, config } = req.body;
  if (!config) {
    return res.status(400).json({ error: 'Config object is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendSSE = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const videoBuffer = await generateMusicVideoServer(
      stylePrompt || '',
      config,
      (msg) => {
        sendSSE({ type: 'status', message: msg });
      }
    );

    const videoId = crypto.randomBytes(16).toString('hex');
    videoStore.set(videoId, { buffer: videoBuffer, createdAt: Date.now() });

    sendSSE({ 
      type: 'complete', 
      videoUrl: `/api/gemini/video-file/${videoId}`,
      message: 'Video visualizer berhasil di-render!'
    });
    return res.end();
  } catch (error: any) {
    console.error('Error generating video:', error);
    sendSSE({ 
      type: 'error', 
      error: error.message || 'Gagal memproses video visualizer' 
    });
    return res.end();
  }
});

// Stream/Download generated video file
app.get('/api/gemini/video-file/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const item = videoStore.get(id);

  if (!item) {
    return res.status(404).send('Video not found or expired');
  }

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Length', item.buffer.length);
  res.setHeader('Accept-Ranges', 'bytes');
  return res.send(item.buffer);
});

// Vite middleware or production static files
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.use((req: Request, res: Response) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  // Mount Vite development middlewares
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Full-Stack Server] running on http://0.0.0.0:${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
});
