import { GoogleGenAI } from "@google/genai";
import { PromptConfig, MusicGenre, GeneratedContent } from "../types";

export const generateLyrics = async (config: PromptConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let languageInstruction = "";
  if (config.lyricLanguage === 'english') {
    languageInstruction = "WRITE IN ENGLISH in the style of 80s/90s power pop ballads (like Chicago, Air Supply, Michael Bolton, Roxette). Emotional metaphors, heartfelt chorus hook.";
  } else if (config.lyricLanguage === 'javanese') {
    languageInstruction = "GUNAKAN BAHASA JAWA PUITIS & HALUS bernuansa Campursari Balada Nostalgia era 80/90-an (seperti karya Didi Kempot awal atau Manthous). Penuh rasa rindu dan nelangsa.";
  } else {
    languageInstruction = "Gunakan Bahasa Indonesia sastra puitis era 80-an & 90-an (gaya Rinto Harahap, Pance Pondaag, Chrisye, Guruh Soekarnoputra, Ebiet G. Ade, atau slow rock Nike Ardilla). Hindari bahasa gaul modern slang/skibidi/gen-z.";
  }

  const genreList = config.subGenres.join(", ");
  const instrumentNames = config.instruments.join(", ");
  
  const prompt = `Anda adalah maestro penulis lirik lagu Pop Nostalgia legendaris era 1980-an dan 1990-an di Indonesia.
Buatkan lirik lagu yang sangat menyentuh jiwa dan kental dengan nuansa nostalgia era kaset pita.

Detail Konfigurasi:
- Aliran Musik: ${genreList} (Era ${config.decade.toUpperCase()})
- Karakter Vokal: ${config.vocal} (${config.vocalCharacteristic})
- Suasana / Mood: ${config.mood}
- Instrumen Utama: ${instrumentNames}
- Vibe Produksi: ${config.vibe}
- Bahasa: ${config.lyricLanguage} (${languageInstruction})
- Tema Khusus: ${config.topic || 'Kerinduan dan Kenangan Manis yang Tak Terlupakan di Masa Lalu'}

Panduan Penulisan Lirik Nostalgia 80-90an:
1. Diksi & Kosakata: Gunakan kata-kata puitis khas 80/90s (seperti: gerimis, rembulan, jendela, bayangmu, surat bertinta, jemari, janji setia, angin senja, kaset lagu kita, rel kereta, pelukan terakhir).
2. Chorus: Buat bagian Reff / Chorus memiliki "Hook" melodi yang sangat kuat, menyayat hati atau sangat mudah dinyanyikan bersama (sing-along karaoke).
3. Struktur:
   [Intro - Suasana Instrumen 80/90s]
   [Verse 1]
   [Verse 2]
   [Pre-Chorus]
   [Chorus / Reff - Puncak Emosi]
   [Interlude - Solo Gitar / Saxophone / Piano]
   [Verse 3 / Bridge]
   [Chorus / Reff]
   [Outro - Fade Out Lembut Khas Kaset Pita]

Sertakan Judul Lagu yang puitis di baris paling atas, contoh: "JUDUL: [Judul Lagu Nostalgia]".`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text ? response.text.trim() : '';
};

export const generateStylePrompt = async (config: PromptConfig): Promise<{ prompt: string; songTitle?: string; sunoTags?: string[]; productionNotes?: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let genreDescription = config.subGenres.join(", ");
  
  const prompt = `You are an elite music producer specializing in 1980s and 1990s Nostalgic Pop, Indonesian 80s/90s City Pop, Slow Rock, and Romantic Cassette Ballads.
Generate an optimal, high-fidelity prompt for Suno AI (v3.5 / v4) and Udio to reproduce authentic 1980s - 1990s nostalgic pop sound.

User Preferences:
- Subgenres: ${genreDescription}
- Preferred Era: ${config.decade}
- Tempo: ${config.tempo}
- Mood: ${config.mood}
- Selected Instruments: ${config.instruments.join(", ")}
- Vocal style: ${config.vocal} with ${config.vocalCharacteristic}
- Production vibe: ${config.vibe}
- Theme: ${config.topic || '80s-90s timeless nostalgia'}

Guidelines for Suno AI Style Prompt:
1. Must include key era tags: e.g. "1980s Indonesian pop ballad", "1990s slow rock", "analog cassette tape mastering", "Yamaha DX7 electric piano chime", "Roland Juno-106 chorus pads", "gated reverb snare", "melodic screaming guitar solo Boss CE-2 chorus", "warm fretless bass", "sentimental passionate vocals".
2. Keep the main Style prompt compact, comma-separated, under 45 words, highly descriptive of timbre and recording equipment.
3. Also suggest a poetic song title suitable for 80s/90s pop and a short production tip.

Return your response strictly in the following JSON format without markdown code blocks if possible, or inside standard json:
{
  "stylePrompt": "Style: 1980s Indonesian pop ballad, ... (comma-separated tags under 45 words)",
  "songTitle": "A poetic Indonesian song title",
  "sunoTags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "productionNotes": "1-2 sentences in Indonesian explaining how this sound captures the 80s/90s era."
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    const text = response.text ? response.text.trim() : '';
    // Parse json
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        prompt: parsed.stylePrompt || text,
        songTitle: parsed.songTitle,
        sunoTags: Array.isArray(parsed.sunoTags) ? parsed.sunoTags : [],
        productionNotes: parsed.productionNotes
      };
    }

    return {
      prompt: text.startsWith("Style:") ? text : `Style: ${text}`,
      songTitle: config.topic || "Kenangan Indah Masa Lalu",
      sunoTags: ["1980s pop ballad", "analog cassette", "Yamaha DX7", "melodic guitar solo", "warm vocal"],
      productionNotes: "Gaya kaset nostalgia era 80-90an dengan perpaduan instrumen analog hangat."
    };
  } catch (err) {
    console.warn("Falling back to standard style prompt:", err);
    return {
      prompt: `Style: 1980s-1990s nostalgic pop ballad, Yamaha DX7 electric piano, lush synthesizer pads, gated reverb snare, emotional ${config.vocal} vocals, warm analog cassette tape mastering, ${config.mood}, melodic guitar solo`,
      songTitle: config.topic || "Sebuah Catatan Kenangan",
      sunoTags: ["1980s pop", "1990s slow rock", "DX7 epiano", "cassette tape vibe"],
      productionNotes: "Nuansa musik pop kaset pita klasik dengan instrumen analog vintage."
    };
  }
};

export const generateMusicVideo = async (
  stylePrompt: string, 
  config: PromptConfig,
  onStatusUpdate: (msg: string) => void
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  onStatusUpdate("Menyusun konsep visual kaset retro & VHS 80-90an...");
  
  let sceneContext = "Vintage 1980s 1990s nostalgic aesthetic music video clip. ";
  
  if (config.subGenres.some(g => g.includes('Slow Rock'))) {
    sceneContext += "A 90s Indonesian rock singer under dramatic soft stage spotlights, wind machine blowing hair, rainy window panes, vintage film grain, VHS camera timestamp overlay 1992. ";
  } else if (config.subGenres.some(g => g.includes('City Pop') || g.includes('Disko'))) {
    sceneContext += "1986 retro city night drive in a vintage coupe car, reflections of colorful neon lights on wet asphalt, warm pastel glow, nostalgic synthwave city horizon. ";
  } else {
    sceneContext += "A classic vintage audio cassette tape spinning gently in a retro tape deck, warm amber VU meter needle bouncing, cozy rainy afternoon in a 1980s living room, soft analog lens flare. ";
  }

  const videoPrompt = `${sceneContext} Mood: ${config.mood}. Authentic 35mm film grain, 4:3 or 16:9 vintage broadcast color grading, poetic and heartwarming nostalgia.`;

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: videoPrompt,
    config: {
      numberOfVideos: 1,
      resolution: config.resolution || '720p',
      aspectRatio: config.aspectRatio || '16:9'
    }
  });

  while (!operation.done) {
    onStatusUpdate("Me-render video visualizer nostalgia (1-2 menit)...");
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await videoResponse.blob();
  return URL.createObjectURL(blob);
};
