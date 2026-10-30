import React, { useState } from 'react';
import PromptForm from './components/PromptForm';
import PromptOutput from './components/PromptOutput';
import RetroCassettePreview from './components/RetroCassettePreview';
import { PromptConfig, GeneratedContent } from './types';
import { generateStylePrompt, generateLyrics, generateMusicVideo } from './services/geminiService';
import { Radio, Disc, Sparkles, Key, Music, Heart, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [generatedData, setGeneratedData] = useState<GeneratedContent>({
    prompt: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleGenerate = async (config: PromptConfig) => {
    if (config.generateVideo) {
      // @ts-ignore
      const hasKey = await window.aistudio?.hasSelectedApiKey?.();
      if (!hasKey && (window as any).aistudio?.openSelectKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
      }
    }

    setIsLoading(true);
    setStatusMsg('Meracik komposisi instrumen analog 80 & 90-an...');
    
    try {
      const styleResult = await generateStylePrompt(config);
      
      let lyrics = '';
      if (config.generateLyrics) {
        setStatusMsg('Menulis lirik puitis era kaset pita...');
        lyrics = await generateLyrics(config);
      }

      setGeneratedData({
        prompt: styleResult.prompt,
        songTitle: styleResult.songTitle,
        sunoTags: styleResult.sunoTags,
        productionNotes: styleResult.productionNotes,
        lyrics
      });

      if (config.generateVideo) {
        setStatusMsg('Memproses video visualizer VHS 80-90an (Veo AI)...');
        const videoUrl = await generateMusicVideo(styleResult.prompt, config, (msg) => setStatusMsg(msg));
        setGeneratedData(prev => ({ ...prev, videoUrl }));
      }

    } catch (error: any) {
      console.error("Failed to generate:", error);
      if (error.message?.includes("Requested entity was not found")) {
        alert("API Key error. Membuka pemilihan kunci AI Studio...");
        // @ts-ignore
        await window.aistudio?.openSelectKey?.();
      } else {
        alert("Terjadi kendala saat meracik musik. Silakan coba kembali.");
      }
    } finally {
      setIsLoading(false);
      setStatusMsg('');
    }
  };

  return (
    <div className="min-h-screen pb-24 selection:bg-rose-500/30 text-slate-100">
      
      {/* Ambient 80s/90s Synthwave & Tape Deck Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[550px] h-[550px] bg-rose-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-[35%] left-[20%] w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-10 sm:pt-14">
        
        {/* Header */}
        <header className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full mb-1">
            <Radio className="w-4 h-4 text-rose-400" />
            <span className="text-[11px] font-mono tracking-widest text-rose-300 uppercase font-bold">
              ★ KASET PITA STEREO • ERA 1980 & 1990-AN ★
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight font-retro-title">
            Pop Nostalgia <span className="gradient-retro">Studio 80 & 90-an</span>
          </h1>

          <p className="text-zinc-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Ciptakan kembali hits legendaris Pop Balada, Slow Rock 90s, Indonesian City Pop 80s, hingga Pop Melankolis. Hasilkan Prompt Suno AI berkarakter kaset pita, lirik puitis, dan video visualizer.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-zinc-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/80 rounded-lg border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Slow Rock Nike Ardilla / Inka
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/80 rounded-lg border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> City Pop Fariz RM / Chrisye
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/80 rounded-lg border border-zinc-800">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Balada Kaset Pance / Rinto
            </span>
          </div>
        </header>

        {/* Main Card */}
        <main className="nostalgia-card rounded-[2.5rem] p-6 sm:p-10 shadow-2xl transition-all duration-500 border-t-2 border-rose-500/40 relative">
          
          {/* Subtle retro label header stripe inside card */}
          <div className="absolute top-0 left-12 right-12 h-1 tape-stripes rounded-t-full opacity-60 pointer-events-none" />

          {/* Form */}
          <PromptForm onGenerate={handleGenerate} isLoading={isLoading} statusMsg={statusMsg} />
          
          {/* Output */}
          <PromptOutput data={generatedData} />

        </main>

        {/* Footer */}
        <footer className="mt-14 text-center space-y-3 pb-8">
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono">
            <Disc className="w-3.5 h-3.5 text-rose-500" />
            <span>STUDIO MUSIK POP NOSTALGIA INDONESIA 80-90AN</span>
          </div>
          <p className="text-zinc-600 text-[11px] max-w-md mx-auto">
            Ditenagai oleh Gemini AI untuk lirik puitis dan aransemen Suno AI, serta Veo untuk video visualizer bernuansa kaset klasik.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default App;
