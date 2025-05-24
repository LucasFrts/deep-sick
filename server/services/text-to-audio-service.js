import autoBind from "auto-bind";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { NotProcessableAudioException } from "../exceptions/not-processable-audio-exception.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class TextToAudioService {
  constructor({ sdk }) {
    this.sdk = sdk;
    autoBind(this);
  }

  async synthesize(text, language) {
    try {
      const [response] = await this.sdk.synthesizeSpeech({
        input: { text },
        voice: { languageCode: language,name: `${language}-Wavenet-A` ,ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'MP3' },
      });

      const audioBuffer = Buffer.from(response.audioContent, 'base64');
      return audioBuffer;
    } catch (err) {
        console.log(err)
      throw new NotProcessableAudioException();
    }
  }

  save(audioBuffer, userId) {
    const timestamp = Date.now();
    const fileName = `tts_${userId}_${timestamp}.mp3`;
    const publicDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, fileName);
    fs.writeFileSync(filePath, audioBuffer);

    return { filePath, fileName };
  }

  async process(text, language, userId) {
    const audioBuffer = await this.synthesize(text, language);
    return this.save(audioBuffer, userId);
  }
}
