import React, { useState } from 'react';
import { Copy, Check, FileText, Video, Music, Sparkles, ExternalLink, CassetteTape, Radio, Layers, Download } from 'lucide-react';
import RetroCassettePreview from './RetroCassettePreview';
import { GeneratedContent } from '../types';

interface PromptOutputProps {
  data: GeneratedContent;
}

const PromptOutput: React.FC<PromptOutputProps> = ({ data }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2500);
  };

  const convertLyricsToSrt = (lyricsText: string): string => {
    const lines = lyricsText.split('\n');
    const srtEntries: string[] = [];
    let currentTimeMs = 2000; // Mulai setelah jeda intro 2 detik
    let subtitleIndex = 1;

    const formatTime = (ms: number): string => {
      const totalSeconds = Math.floor(ms / 1000);
      const milliseconds = Math.floor(ms % 1000);
      const seconds = totalSeconds % 60;
      const minutes = Math.floor((totalSeconds / 60) % 60);
      const hours = Math.floor(totalSeconds / 3600);

      const pad = (num: number, size: number = 2) => String(num).padStart(size, '0');
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`;
    };

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i].trim();
      if (!rawLine) {
        currentTimeMs += 1000; // Jeda antar bait lagu
        continue;
      }

      let displayText = rawLine;
      if (rawLine.toUpperCase().startsWith('JUDUL:')) {
        displayText = rawLine.replace(/^JUDUL:\s*/i, '');
      }

      const wordCount = displayText.split(/\s+/).length;
      const isTag = displayText.startsWith('[') && displayText.endsWith(']');
      
      // Hitung durasi vokal proporsional dengan tempo balada/slow rock nostalgia
      const durationMs = isTag 
        ? 3500 
        : Math.max(3000, Math.min(6500, wordCount * 650 + 1200));

      const startTime = currentTimeMs;
      const endTime = startTime + durationMs;

      srtEntries.push(
        `${subtitleIndex}\n${formatTime(startTime)} --> ${formatTime(endTime)}\n${displayText}\n`
      );

      subtitleIndex++;
      currentTimeMs = endTime + 300;
    }

    return srtEntries.join('\n');
  };

  const downloadSrt = () => {
    if (!data.lyrics) return;
    const srtContent = convertLyricsToSrt(data.lyrics);
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const rawTitle = data.songTitle || 'lirik-pop-nostalgia';
    const safeTitle = rawTitle
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .toLowerCase();

    link.href = url;
    link.download = `${safeTitle || 'lirik-pop-nostalgia'}.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!data.prompt) return null;

  const combinedFullPrompt = `[STYLE]:\n${data.prompt}\n\n[LYRICS]:\n${data.lyrics || ''}`;

  return (
    <div className="mt-14 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Title & Cassette Ribbon */}
      <div className="text-center space-y-2 border-b border-rose-900/30 pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
          ★ Hasil Aransemen Pop Nostalgia 80-90an Siap Pakai ★
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {data.songTitle || "Lagu Nostalgia Pilihan"}
        </h2>
        {data.productionNotes && (
          <p className="text-xs text-zinc-400 max-w-xl mx-auto italic">
            "{data.productionNotes}"
          </p>
        )}
      </div>

      {/* Cassette Tape Visualizer */}
      <RetroCassettePreview 
        title={data.songTitle || "PITA KASET EMAS 80-90AN"}
        genreSubtitle="Remastered Analog Tape Series"
      />

      {/* Suno Style Prompt Section */}
      <section className="space-y-4 bg-zinc-900/80 p-6 rounded-3xl border border-rose-500/30 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs sm:text-sm font-mono">
            <Music className="w-5 h-5 text-rose-400" /> 
            <span>Suno AI Style Prompt (v3.5 / v4 & Udio)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(data.prompt, 'prompt')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              {copied === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'prompt' ? 'Tersalin!' : 'Salin Style Prompt'}
            </button>
            
            {data.lyrics && (
              <button
                onClick={() => copyToClipboard(combinedFullPrompt, 'all')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-semibold transition-all"
                title="Salin Style + Lirik sekaligus"
              >
                {copied === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Layers className="w-3.5 h-3.5 text-amber-400" />}
                {copied === 'all' ? 'Semua Tersalin!' : 'Salin Semua'}
              </button>
            )}
          </div>
        </div>

        {/* Prompt Content */}
        <div className="bg-black/80 border border-zinc-800 p-4 sm:p-5 rounded-2xl relative">
          <p className="text-sm sm:text-base text-rose-100 font-mono leading-relaxed select-all">
            {data.prompt}
          </p>
        </div>

        {/* Tag pills */}
        {data.sunoTags && data.sunoTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-zinc-500 uppercase font-mono mr-1 self-center">Kunci Suara:</span>
            {data.sunoTags.map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-rose-950/40 text-rose-300 border border-rose-800/40 px-2 py-0.5 rounded-md font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Lyrics Section with SRT Download */}
      {data.lyrics && (
        <section className="space-y-4 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800/80 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs sm:text-sm font-mono">
              <FileText className="w-5 h-5 text-rose-400" /> 
              <span>Lirik Lagu Puitis Nostalgia 80-90an</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* SRT Download Button */}
              <button
                type="button"
                onClick={downloadSrt}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-semibold transition-all shadow-sm"
                title="Download lirik dalam format subtitle SubRip (.srt)"
              >
                <Download className="w-3.5 h-3.5 text-cyan-300" />
                <span>Download Lirik (.srt)</span>
              </button>

              {/* Copy Lyrics Button */}
              <button
                type="button"
                onClick={() => copyToClipboard(data.lyrics!, 'lyrics')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-semibold transition-all shadow-sm"
              >
                {copied === 'lyrics' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'lyrics' ? 'Lirik Tersalin!' : 'Salin Lirik'}
              </button>
            </div>
          </div>

          <div className="bg-zinc-950/90 border border-zinc-800/80 p-6 sm:p-8 rounded-2xl whitespace-pre-line text-zinc-200 font-serif leading-loose shadow-inner max-h-[500px] overflow-y-auto custom-scrollbar text-sm sm:text-base">
            {data.lyrics}
          </div>
        </section>
      )}

      {/* Video Visualizer Section */}
      {data.videoUrl && (
        <section className="space-y-4 bg-zinc-900/60 p-6 rounded-3xl border border-zinc-800">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs sm:text-sm font-mono">
            <Video className="w-5 h-5 text-rose-400" /> 
            <span>Video Visualizer Retro VHS (Veo AI)</span>
          </div>
          
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl bg-black">
            <video 
              src={data.videoUrl} 
              controls 
              className="w-full h-full object-cover"
              autoPlay
              loop
            />
          </div>
          
          <div className="text-center">
            <a 
              href={data.videoUrl} 
              download="pop-nostalgia-video.mp4"
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
            >
              <span>Download Klip Video Nostalgia (.mp4)</span>
            </a>
          </div>
        </section>
      )}

      {/* Quick Guide to paste in Suno */}
      <div className="bg-gradient-to-r from-rose-950/30 via-purple-950/30 to-cyan-950/30 border border-rose-500/20 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start">
        <Sparkles className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 text-xs text-zinc-300 leading-relaxed">
          <p className="font-bold text-white uppercase font-mono tracking-wider">
            Panduan Cara Pakai di Suno AI (suno.com):
          </p>
          <ol className="list-decimal list-inside space-y-1 text-zinc-400">
            <li>Buka <strong className="text-rose-300">Suno AI</strong> dan aktifkan mode <strong className="text-rose-300">Custom Mode</strong>.</li>
            <li>Tempelkan <strong className="text-white">Suno AI Style Prompt</strong> ke kolom <em>"Style of Music"</em>.</li>
            <li>Tempelkan <strong className="text-white">Lirik Puitis</strong> ke kolom <em>"Lyrics"</em>.</li>
            <li>Klik tombol <strong className="text-rose-400 font-bold">Create</strong> untuk mendengarkan lagu nostalgia kaset pita Anda!</li>
          </ol>
        </div>
      </div>

    </div>
  );
};

export default PromptOutput;
