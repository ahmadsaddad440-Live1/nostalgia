import { PromptConfig } from "../types";

export interface StylePromptResult {
  prompt: string;
  songTitle?: string;
  sunoTags?: string[];
  productionNotes?: string;
}

export const generateStylePrompt = async (config: PromptConfig): Promise<StylePromptResult> => {
  const response = await fetch('/api/gemini/style', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ config }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  return {
    prompt: data.prompt,
    songTitle: data.songTitle,
    sunoTags: data.sunoTags,
    productionNotes: data.productionNotes,
  };
};

export const generateLyrics = async (
  config: PromptConfig,
  onChunk?: (chunk: string) => void
): Promise<string> => {
  if (onChunk) {
    // Stream lyrics chunks from server via SSE
    const response = await fetch('/api/gemini/lyrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ config, stream: true }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("Gagal membaca stream dari server");

    const decoder = new TextDecoder();
    let accumulatedLyrics = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const rawText = decoder.decode(value, { stream: true });
      const lines = rawText.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            if (data.type === 'chunk' && data.text) {
              accumulatedLyrics += data.text;
              onChunk(accumulatedLyrics);
            } else if (data.type === 'done' && data.text) {
              return data.text.trim();
            } else if (data.type === 'error') {
              throw new Error(data.error || "Gagal streaming lirik");
            }
          } catch (e: any) {
            // Ignore parse errors on incomplete chunk splits
          }
        }
      }
    }

    return accumulatedLyrics.trim();
  }

  // Standard non-streaming fetch
  const response = await fetch('/api/gemini/lyrics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ config, stream: false }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  return data.lyrics || '';
};

export const generateMusicVideo = async (
  stylePrompt: string,
  config: PromptConfig,
  onStatusUpdate: (msg: string) => void
): Promise<string> => {
  onStatusUpdate("Menghubungkan ke server visualizer...");

  const response = await fetch('/api/gemini/video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ stylePrompt, config }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("Gagal menerima stream video dari server");

  const decoder = new TextDecoder();
  let finalVideoUrl = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const rawText = decoder.decode(value, { stream: true });
    const lines = rawText.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.substring(6));
          if (data.type === 'status' && data.message) {
            onStatusUpdate(data.message);
          } else if (data.type === 'complete' && data.videoUrl) {
            finalVideoUrl = data.videoUrl;
          } else if (data.type === 'error') {
            throw new Error(data.error || "Gagal merender video");
          }
        } catch (e: any) {
          if (e.message && e.message.includes("Gagal merender video")) {
            throw e;
          }
        }
      }
    }
  }

  if (!finalVideoUrl) {
    throw new Error("Video URL tidak diterima dari server");
  }

  return finalVideoUrl;
};
