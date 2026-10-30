export enum MusicGenre {
  POP_BALADA_80S = 'Pop Balada 80s (Pance / Rinto)',
  SLOW_ROCK_90S = 'Slow Rock 90s (Nike Ardilla / Inka)',
  CITY_POP_80S = 'Indonesian City Pop (Fariz RM / Vina)',
  POP_KREATIF_80S = 'Pop Kreatif (Chrisye / Guruh)',
  POP_ROMANTIS_90S = 'Pop Romantis 90s (KLa Project / Dewa)',
  SYNTH_POP_80S = 'Retro Synth-Pop 80s (Yamaha DX7 / Linn)',
  POP_MELANKOLIS_80S = 'Pop Melankolis Kaset (Obbie Messakh / Tommy J)',
  AKUSTIK_BALADA = 'Akustik Balada Syahdu (Ebiet G. Ade / Iwan Fals)',
  DISCO_RETRO_80S = 'Disko Nostalgia 80s (Upbeat Retro / Fariz)',
  POP_MANIS_90S = 'Pop Manis 90s (AB Three / Trio Libels)',
  SLOW_ROCK_MELAYU = 'Slow Rock Melayu 90s (Iklim / Search / Exists)',
  POP_ROCK_90S = 'Pop Rock Alternatif 90s (Sheila / Dewa / Slank)'
}

export type DecadeFilter = 'all' | '80s' | '90s';

export type VideoResolution = '720p' | '1080p';
export type AspectRatio = '16:9' | '9:16';
export type LyricLanguage = 'indonesian' | 'english' | 'javanese';

export interface PromptConfig {
  subGenres: MusicGenre[];
  decade: DecadeFilter;
  tempo: string;
  mood: string;
  instruments: string[];
  vocal: string;
  vocalCharacteristic: string;
  vibe: string;
  topic?: string;
  lyricLanguage: LyricLanguage;
  generateLyrics: boolean;
  generateVideo: boolean;
  resolution?: VideoResolution;
  aspectRatio?: AspectRatio;
  analogTapeWarmth?: boolean;
}

export interface GeneratedContent {
  prompt: string;
  lyrics?: string;
  videoUrl?: string;
  songTitle?: string;
  sunoTags?: string[];
  productionNotes?: string;
}

export interface NostalgiaPreset {
  id: string;
  name: string;
  decade: '80s' | '90s';
  artistInspiration: string;
  description: string;
  genres: MusicGenre[];
  tempo: string;
  mood: string;
  vocal: string;
  vocalCharacteristic: string;
  instruments: string[];
  vibe: string;
  topicSample: string;
}
