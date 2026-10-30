import React from 'react';
import { 
  Music, 
  Heart, 
  Flame, 
  Radio, 
  Sparkles, 
  Disc3, 
  Sunset, 
  CloudRain, 
  Smile, 
  Volume2
} from 'lucide-react';
import { MusicGenre, NostalgiaPreset } from './types';

export const SUB_GENRES = Object.values(MusicGenre);

export const NOSTALGIA_PRESETS: NostalgiaPreset[] = [
  {
    id: 'nike_slowrock',
    name: 'Ratu Slow Rock 90s',
    decade: '90s',
    artistInspiration: 'Nike Ardilla, Inka Christie, Poppy Mercury',
    description: 'Slow rock dramatis dengan distorsi gitar melolong, vokal wanita bertenaga penuh luka cinta, dan ketukan drum megah.',
    genres: [MusicGenre.SLOW_ROCK_90S],
    tempo: 'slow_rock_80',
    mood: 'patah_hati',
    vocal: 'female',
    vocalCharacteristic: 'powerful_rock',
    instruments: ['crying_guitar', 'gated_reverb_drums', 'juno_synth', 'grand_piano'],
    vibe: 'cassette_tape',
    topicSample: 'Surat Terakhir di Balik Kabut Duka'
  },
  {
    id: 'pance_balada',
    name: 'Balada Kaset Pita 80s',
    decade: '80s',
    artistInspiration: 'Pance Pondaag, Dian Piesesha, Rinto Harahap',
    description: 'Balada syahdu dengan dentingan manis Yamaha DX7 e-piano, string hangat, melodi yang menyayat hati dan lirik puitis kental.',
    genres: [MusicGenre.POP_BALADA_80S, MusicGenre.POP_MELANKOLIS_80S],
    tempo: 'slow_ballad_70',
    mood: 'rindu_masa_lalu',
    vocal: 'male',
    vocalCharacteristic: 'melancholic',
    instruments: ['dx7_epiano', 'saxophone', 'juno_synth', 'slap_bass'],
    vibe: 'cassette_tape',
    topicSample: 'Jangan Salahkan Hati yang Terluka'
  },
  {
    id: 'fariz_citypop',
    name: 'Indonesian City Pop 80s',
    decade: '80s',
    artistInspiration: 'Fariz RM, Vina Panduwinata, Utha Likumahuwa',
    description: 'Nuansa malam kota gemerlap, funky slap bassline, synth brass ceria, melodi sophisticated ala Safari & Sakura.',
    genres: [MusicGenre.CITY_POP_80S, MusicGenre.DISCO_RETRO_80S],
    tempo: 'moderate_groove_106',
    mood: 'city_night_glow',
    vocal: 'male',
    vocalCharacteristic: 'smooth_elegant',
    instruments: ['slap_bass', 'dx7_epiano', 'juno_synth', 'linndrum'],
    vibe: 'city_night',
    topicSample: 'Langkah Dansa di Sudut Jakarta 1986'
  },
  {
    id: 'chrisye_kreatif',
    name: 'Pop Kreatif Legendaris',
    decade: '80s',
    artistInspiration: 'Chrisye, Guruh Soekarnoputra, Yockie Suryo Prayogo',
    description: 'Komposisi orkestra string megah dipadu petikan gitar akustik halus, lirik sastra mendalam, dan ketukan pop berkelas.',
    genres: [MusicGenre.POP_KREATIF_80S],
    tempo: 'moderate_ballad_92',
    mood: 'perenungan_syahdu',
    vocal: 'male',
    vocalCharacteristic: 'smooth_elegant',
    instruments: ['flute_strings', 'acoustic_guitar', 'grand_piano', 'slap_bass'],
    vibe: 'analog_studio',
    topicSample: 'Kala Angin Senja Membawa Pesan Cintamu'
  },
  {
    id: 'kla_dewa90',
    name: 'Pop Romantis Neo 90s',
    decade: '90s',
    artistInspiration: 'KLa Project, Dewa 19 (Era Ari Lasso), Java Jive',
    description: 'Petikan melodi gitar elektrik chorus, denting piano romantis, solo saxophone senja, dan lirik puitis ala kota tua Yogyakarta.',
    genres: [MusicGenre.POP_ROMANTIS_90S, MusicGenre.POP_ROCK_90S],
    tempo: 'slow_rock_80',
    mood: 'romantisme_remaja',
    vocal: 'male',
    vocalCharacteristic: 'smooth_elegant',
    instruments: ['grand_piano', 'crying_guitar', 'saxophone', 'juno_synth'],
    vibe: 'rainy_window',
    topicSample: 'Sebuah Catatan Kenangan di Sudut Kota'
  },
  {
    id: 'ebiet_akustik',
    name: 'Akustik Balada Renungan',
    decade: '80s',
    artistInspiration: 'Ebiet G. Ade, Iwan Fals, Franky & Jane',
    description: 'Petikan gitar akustik 12 senar, tiupan harmonika sendu, untaian lirik puitis renungan alam dan cinta yang tulus bersahaja.',
    genres: [MusicGenre.AKUSTIK_BALADA],
    tempo: 'slow_ballad_70',
    mood: 'perenungan_syahdu',
    vocal: 'male',
    vocalCharacteristic: 'husky_deep',
    instruments: ['acoustic_guitar', 'flute_strings', 'grand_piano'],
    vibe: 'cassette_tape',
    topicSample: 'Untuk Sebuah Nama yang Tertinggal di Lembah'
  },
  {
    id: 'iklim_melayu',
    name: 'Slow Rock Melayu 90s',
    decade: '90s',
    artistInspiration: 'Iklim (Saleem), Search, Wings, Exists',
    description: 'Vokal pria melengking tinggi penuh getaran duka asmara, lengkingan gitar solo bernada minor, dan echo reverb kaset 90-an.',
    genres: [MusicGenre.SLOW_ROCK_MELAYU],
    tempo: 'slow_rock_80',
    mood: 'patah_hati',
    vocal: 'male',
    vocalCharacteristic: 'powerful_rock',
    instruments: ['crying_guitar', 'gated_reverb_drums', 'grand_piano', 'juno_synth'],
    vibe: 'cassette_tape',
    topicSample: 'Hanya Debu di Telapak Tanganmu'
  },
  {
    id: 'abthree_manis',
    name: 'Pop Manis 90s Harmoni',
    decade: '90s',
    artistInspiration: 'AB Three, Trio Libels, Bening, ME',
    description: 'Harmoni vokal grup 3 suara yang padu, beat pop R&B 90-an yang manis, denting e-piano dan bass ceria masa remaja.',
    genres: [MusicGenre.POP_MANIS_90S],
    tempo: 'moderate_groove_106',
    mood: 'romantisme_remaja',
    vocal: 'vocal_group',
    vocalCharacteristic: 'sweet_vintage',
    instruments: ['dx7_epiano', 'slap_bass', 'linndrum', 'juno_synth'],
    vibe: 'high_school_prom',
    topicSample: 'Janji Berdua di Bawah Payung Hujan'
  }
];

export const TEMPOS = [
  { label: 'Very Slow (65-72 BPM) • Balada Sendu Menyayat', value: 'slow_ballad_70' },
  { label: 'Slow Rock (75-84 BPM) • Slow Rock Khas Nike/Inka', value: 'slow_rock_80' },
  { label: 'Moderate Ballad (88-96 BPM) • Pop Romantis KLa/Chrisye', value: 'moderate_ballad_92' },
  { label: 'Groovy Mid-Tempo (100-112 BPM) • Indonesian City Pop', value: 'moderate_groove_106' },
  { label: 'Upbeat Disco 80s (118-128 BPM) • Disko Pesta Retro', value: 'fast_disco_122' }
];

export const MOODS = [
  { label: 'Rindu & Mengenang Masa Lalu (Nostalgia Asmara)', value: 'rindu_masa_lalu' },
  { label: 'Patah Hati & Tangisan Hati (Lirik Melankolis Cengeng)', value: 'patah_hati' },
  { label: 'Romantisme Kasih di Sekolah / Masa Muda', value: 'romantisme_remaja' },
  { label: 'Gemerlap Malam Kota & Romantisme Senja (City Pop)', value: 'city_night_glow' },
  { label: 'Perenungan Hidup, Puitis & Teduh Syahdu', value: 'perenungan_syahdu' },
  { label: 'Ceria Dansa Disko 80s Penuh Semangat', value: 'dansa_ceria_80s' }
];

export const LANGUAGES = [
  { label: 'Bahasa Indonesia (Puitis Klasik 80/90s)', value: 'indonesian' },
  { label: 'English (80s Power Ballad / Synth-pop)', value: 'english' },
  { label: 'Basa Jawa (Campursari Balada Nostalgia)', value: 'javanese' }
];

export const INSTRUMENTS = [
  { id: 'dx7_epiano', name: 'Yamaha DX7 E-Piano (Chime Bell 80s)' },
  { id: 'crying_guitar', name: 'Melodic Crying Guitar Solo (Chorus + Delay)' },
  { id: 'juno_synth', name: 'Roland Juno / D-50 Warm Synth Pads' },
  { id: 'gated_reverb_drums', name: 'Gated Reverb Snare & Power Drums' },
  { id: 'slap_bass', name: 'Groovy Slap Bass & Fretless Bassline' },
  { id: 'saxophone', name: 'Romantic Alto/Soprano Saxophone Solo' },
  { id: 'acoustic_guitar', name: 'Acoustic Steel & Nylon String Guitar' },
  { id: 'grand_piano', name: 'Acoustic Grand Piano Melankolis' },
  { id: 'linndrum', name: 'LinnDrum / Vintage 80s Beat Machine' },
  { id: 'flute_strings', name: 'Orchestral Strings & Mellotron Flute' }
];

export const VOCALS = [
  { label: 'Pria (Melankolis Kaset / Rocker)', value: 'male' },
  { label: 'Wanita (Merdu Sendu / Lady Rocker)', value: 'female' },
  { label: 'Duet Romantis (Broery & Dewi Yull)', value: 'duet' },
  { label: 'Grup Harmoni 90s (Trio / Boyband)', value: 'vocal_group' }
];

export const VOCAL_CHARACTERISTICS = [
  { label: 'Melankolis dengan Vibrato Lembut (Khas Balada 80an)', value: 'melancholic' },
  { label: 'Power Rock Melengking Emosional (Khas Nike Ardilla)', value: 'powerful_rock' },
  { label: 'Vokal Bariton Bersih, Teduh & Berwibawa (Khas Chrisye)', value: 'smooth_elegant' },
  { label: 'Serak Basah Penuh Jiwa & Romantisme (Husky Soul)', value: 'husky_deep' },
  { label: 'Vokal Manis Merdu Remaja 90s (Harmoni Catchy)', value: 'sweet_vintage' }
];

export const VIBES = [
  { label: 'Pita Kaset Tape Recorder (Warm Analog Saturation)', value: 'cassette_tape' },
  { label: 'City Light Senja & Mobil Klasik Retro', value: 'city_night' },
  { label: 'Gerimis Hujan di Jendela Kamar', value: 'rainy_window' },
  { label: 'Pensi SMA & Nostalgia Sahabat Remaja', value: 'high_school_prom' },
  { label: 'Studio Analog Aquarius / Musica Vintage Tape', value: 'analog_studio' }
];

export const POPULAR_TOPIC_SUGGESTIONS = [
  'Surat Berdebu di Kotak Kaset',
  'Gerimis Senja di Kaca Jendela',
  'Kisah Kasih Masa SMA Tahun 1989',
  'Telepon Koin Pukul Satu Malam',
  'Jangan Kau Ucap Janji Palsu',
  'Langkah Sunyi di Bawah Gerimis Jakarta',
  'Kaset Lagu Kesayangan Berdua',
  'Antara Benci dan Rindu Terlarang'
];

export const GENRE_ICONS: Record<string, React.ReactNode> = {
  [MusicGenre.POP_BALADA_80S]: <Heart className="w-5 h-5 text-rose-400" />,
  [MusicGenre.SLOW_ROCK_90S]: <Flame className="w-5 h-5 text-amber-500" />,
  [MusicGenre.CITY_POP_80S]: <Sunset className="w-5 h-5 text-cyan-400" />,
  [MusicGenre.POP_KREATIF_80S]: <Sparkles className="w-5 h-5 text-purple-400" />,
  [MusicGenre.POP_ROMANTIS_90S]: <Heart className="w-5 h-5 text-pink-400" />,
  [MusicGenre.SYNTH_POP_80S]: <Disc3 className="w-5 h-5 text-teal-400" />,
  [MusicGenre.POP_MELANKOLIS_80S]: <CloudRain className="w-5 h-5 text-indigo-400" />,
  [MusicGenre.AKUSTIK_BALADA]: <Radio className="w-5 h-5 text-yellow-500" />,
  [MusicGenre.DISCO_RETRO_80S]: <Volume2 className="w-5 h-5 text-fuchsia-400" />,
  [MusicGenre.POP_MANIS_90S]: <Smile className="w-5 h-5 text-emerald-400" />,
  [MusicGenre.SLOW_ROCK_MELAYU]: <Flame className="w-5 h-5 text-red-500" />,
  [MusicGenre.POP_ROCK_90S]: <Music className="w-5 h-5 text-sky-400" />
};
