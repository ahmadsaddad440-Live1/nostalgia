import React, { useState } from 'react';
import { PromptConfig, MusicGenre, DecadeFilter, NostalgiaPreset, LyricLanguage } from '../types';
import { 
  SUB_GENRES, 
  NOSTALGIA_PRESETS,
  TEMPOS, 
  MOODS, 
  VOCALS, 
  VOCAL_CHARACTERISTICS,
  LANGUAGES,
  INSTRUMENTS,
  VIBES,
  POPULAR_TOPIC_SUGGESTIONS,
  GENRE_ICONS 
} from '../constants';
import { 
  Sparkles, 
  Loader2, 
  Music, 
  Settings2, 
  Languages, 
  User, 
  Mic2, 
  CheckCircle2, 
  Disc, 
  Sliders, 
  Clock, 
  Radio, 
  Flame, 
  Lightbulb,
  CassetteTape,
  Layers
} from 'lucide-react';

interface PromptFormProps {
  onGenerate: (config: PromptConfig) => Promise<void>;
  isLoading: boolean;
  statusMsg: string;
}

const PromptForm: React.FC<PromptFormProps> = ({ onGenerate, isLoading, statusMsg }) => {
  const [selectedDecade, setSelectedDecade] = useState<DecadeFilter>('all');
  const [activePresetId, setActivePresetId] = useState<string>('nike_slowrock');

  const [config, setConfig] = useState<PromptConfig>({
    subGenres: [MusicGenre.SLOW_ROCK_90S],
    decade: '90s',
    tempo: 'slow_rock_80',
    mood: 'patah_hati',
    instruments: ['crying_guitar', 'gated_reverb_drums', 'juno_synth', 'grand_piano'],
    vocal: 'female',
    vocalCharacteristic: 'powerful_rock',
    vibe: 'cassette_tape',
    generateLyrics: true,
    generateVideo: false,
    topic: 'Surat Terakhir di Balik Kabut Duka',
    lyricLanguage: 'indonesian',
    resolution: '720p',
    aspectRatio: '16:9',
    analogTapeWarmth: true
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Apply a famous preset
  const applyPreset = (preset: NostalgiaPreset) => {
    setActivePresetId(preset.id);
    setConfig(prev => ({
      ...prev,
      subGenres: [...preset.genres],
      decade: preset.decade,
      tempo: preset.tempo,
      mood: preset.mood,
      vocal: preset.vocal,
      vocalCharacteristic: preset.vocalCharacteristic,
      instruments: [...preset.instruments],
      vibe: preset.vibe,
      topic: preset.topicSample
    }));
  };

  const toggleGenre = (genre: MusicGenre) => {
    setConfig(prev => {
      const isSelected = prev.subGenres.includes(genre);
      let newGenres;
      if (isSelected) {
        if (prev.subGenres.length === 1) return prev;
        newGenres = prev.subGenres.filter(g => g !== genre);
      } else {
        newGenres = [...prev.subGenres, genre];
      }
      return { ...prev, subGenres: newGenres };
    });
  };

  const toggleInstrument = (instId: string) => {
    setConfig(prev => {
      const exists = prev.instruments.includes(instId);
      let nextInst: string[];
      if (exists) {
        if (prev.instruments.length === 1) return prev;
        nextInst = prev.instruments.filter(i => i !== instId);
      } else {
        nextInst = [...prev.instruments, instId];
      }
      return { ...prev, instruments: nextInst };
    });
  };

  const handleTopicChipClick = (suggestion: string) => {
    setConfig(prev => ({ ...prev, topic: suggestion }));
  };

  const filteredGenres = SUB_GENRES.filter(genre => {
    if (selectedDecade === '80s') {
      return genre.includes('80s') || genre.includes('80an') || genre.includes('Kreatif') || genre.includes('Akustik');
    }
    if (selectedDecade === '90s') {
      return genre.includes('90s') || genre.includes('90an') || genre.includes('Melayu') || genre.includes('Akustik');
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(config);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* 1-Click Nostalgia Presets Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 tracking-wider uppercase font-mono">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Preset Kaset Emas Pop Nostalgia (1-Klik)</span>
          </div>
          <span className="text-[11px] text-zinc-500">Pilih inspirasi musisi legendaris</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {NOSTALGIA_PRESETS.map((preset) => {
            const isCurrent = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between relative overflow-hidden group ${
                  isCurrent
                    ? 'bg-gradient-to-br from-rose-950/80 to-purple-950/60 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.25)] ring-1 ring-rose-400'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                      preset.decade === '80s' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {preset.decade}
                    </span>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,1)] animate-ping" />
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-zinc-100 group-hover:text-rose-300 transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1 italic">
                    {preset.artistInspiration}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Decade Filter & Genre Selection */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <Music className="w-4 h-4" /> Aliran Musik Pop Nostalgia 80 & 90-an
          </label>

          {/* Decade Switcher */}
          <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setSelectedDecade('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedDecade === 'all'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Semua Era
            </button>
            <button
              type="button"
              onClick={() => setSelectedDecade('80s')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedDecade === '80s'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Era 80-an (DX7 / Balada)
            </button>
            <button
              type="button"
              onClick={() => setSelectedDecade('90s')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedDecade === '90s'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Era 90-an (Slow Rock / Romantis)
            </button>
          </div>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredGenres.map((genre) => {
            const isSelected = config.subGenres.includes(genre as MusicGenre);
            return (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre as MusicGenre)}
                className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 text-left ${
                  isSelected
                    ? 'bg-rose-950/40 border-rose-500 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.18)]'
                    : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isSelected ? 'text-rose-400 scale-110 transition-transform' : 'text-zinc-500'}>
                    {GENRE_ICONS[genre] || <Music className="w-5 h-5" />}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold">{genre}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Instruments selection (Key for 80s/90s sound) */}
      <div className="space-y-3 pt-2">
        <label className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4" /> Instrumen Khas Era 80 & 90-an
          </div>
          <span className="text-[11px] text-zinc-500 lowercase">Kombinasikan karakter analog</span>
        </label>
        
        <div className="flex flex-wrap gap-2">
          {INSTRUMENTS.map((inst) => {
            const isSelected = config.instruments.includes(inst.id);
            return (
              <button
                key={inst.id}
                type="button"
                onClick={() => toggleInstrument(inst.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />}
                <span>{inst.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vocal Type and Vocal Characteristic */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-3">
          <label className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> Jenis Vokal Nostalgia
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {VOCALS.map(v => (
              <button
                key={v.value}
                type="button"
                onClick={() => setConfig({ ...config, vocal: v.value })}
                className={`py-2.5 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                  config.vocal === v.value
                    ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <Mic2 className="w-4 h-4" /> Karakter Vokal Khas
          </label>
          <select 
            value={config.vocalCharacteristic} 
            onChange={(e) => setConfig({ ...config, vocalCharacteristic: e.target.value })} 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer text-xs sm:text-sm font-medium"
          >
            {VOCAL_CHARACTERISTICS.map(vc => (
              <option key={vc.value} value={vc.value}>{vc.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Topic and Language */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-4 h-4" /> Tema & Inspirasi Lirik Nostalgia
          </label>
          <span className="text-[11px] text-zinc-500">Klik chip untuk ide instan</span>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_TOPIC_SUGGESTIONS.map((topicItem, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleTopicChipClick(topicItem)}
              className="text-[11px] bg-zinc-900/80 hover:bg-rose-950/50 hover:text-rose-300 text-zinc-400 border border-zinc-800 hover:border-rose-800/60 px-2.5 py-1 rounded-lg transition-colors"
            >
              "{topicItem}"
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <input 
              type="text"
              placeholder="Misal: Surat cinta di kotak kaset pita, mengenang asmara SMA..."
              value={config.topic}
              onChange={(e) => setConfig({...config, topic: e.target.value})}
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl p-3.5 text-zinc-200 placeholder-zinc-500 focus:ring-2 focus:ring-rose-500 outline-none text-sm"
            />
          </div>
          <div>
            <select 
              value={config.lyricLanguage} 
              onChange={(e) => setConfig({ ...config, lyricLanguage: e.target.value as LyricLanguage })} 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-zinc-200 focus:ring-2 focus:ring-rose-500 outline-none cursor-pointer text-sm"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Checkboxes: Lyrics & Video */}
      <div className="flex flex-wrap items-center gap-6 pt-2 pb-1 border-t border-zinc-800/80">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={config.generateLyrics}
            onChange={(e) => setConfig({...config, generateLyrics: e.target.checked})}
            className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-rose-500 transition-all cursor-pointer"
          />
          <span className="text-sm text-zinc-200 group-hover:text-rose-400 transition-colors font-medium">
            Tulis Lirik Puitis Era 80/90-an
          </span>
        </label>
        
        <label className="flex items-center gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            checked={config.generateVideo}
            onChange={(e) => setConfig({...config, generateVideo: e.target.checked})}
            className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-rose-500 focus:ring-rose-500 transition-all cursor-pointer"
          />
          <span className="text-sm text-zinc-200 group-hover:text-rose-400 transition-colors font-medium">
            Buat Video Visualizer VHS Retro (Veo AI)
          </span>
        </label>
      </div>

      {/* Advanced Drawer Toggle */}
      <button 
        type="button" 
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-2 transition-colors uppercase tracking-wider"
      >
        <Settings2 className="w-4 h-4" /> 
        {showAdvanced ? 'Tutup Pengaturan Lanjutan' : 'Pengaturan Lanjutan (Tempo, Mood & Vibe Mastering)'}
      </button>

      {showAdvanced && (
        <div className="p-5 bg-zinc-950/70 rounded-2xl border border-zinc-800 space-y-5 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tempo & Beat Kaset</label>
              <select 
                value={config.tempo} 
                onChange={(e) => setConfig({ ...config, tempo: e.target.value })} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-300 text-xs"
              >
                {TEMPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Suasana / Mood Nostalgia</label>
              <select 
                value={config.mood} 
                onChange={(e) => setConfig({ ...config, mood: e.target.value })} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-300 text-xs"
              >
                {MOODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Karakter Vibe Mastering</label>
              <select 
                value={config.vibe} 
                onChange={(e) => setConfig({ ...config, vibe: e.target.value })} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-300 text-xs"
              >
                {VIBES.map(vb => <option key={vb.value} value={vb.value}>{vb.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl shadow-[0_10px_30px_rgba(244,63,94,0.3)] flex flex-col items-center justify-center gap-1 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-white" />
            <span className="text-sm font-semibold animate-pulse">{statusMsg || 'Meramu aransemen pop nostalgia...'}</span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 text-base sm:text-lg">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Hasilkan Lagu Pop Nostalgia 80 & 90-an</span>
            </div>
            <span className="text-[11px] opacity-80 font-normal">
              Prompt Suno AI Siap Pakai • Lirik Puitis • Format Kaset Pita
            </span>
          </>
        )}
      </button>

    </form>
  );
};

export default PromptForm;
