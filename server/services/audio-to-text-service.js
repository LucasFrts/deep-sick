import autoBind from "auto-bind";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { NotProcessableAudioException } from "../exceptions/not-processable-audio-exception.js";

ffmpeg.setFfmpegPath(ffmpegPath);

export default class AudioToTextService {
  constructor({ sdk }) {
    this.sdk = sdk;
    autoBind(this);
  }

  async transcribe(audioBytes, language) {
    try {
      const [response] = await this.sdk.recognize({
        audio: { content: audioBytes },
        config: {
          encoding: "LINEAR16",
          sampleRateHertz: 16000,
          languageCode: language,
        },
      });

      return response.results.map((r) => r.alternatives[0].transcript).join("\n");
    } catch (err) {
      console.error("ERRO transcribe", err);
      throw new NotProcessableAudioException();
    }
  }

  async convert(inputPath) {
    const wavPath = `${inputPath}.wav`;
    try {
      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .audioChannels(1)
          .audioFrequency(16000)
          .audioCodec("pcm_s16le")
          .format("wav")
          .save(wavPath)
          .on("end", resolve)
          .on("error", reject);
      });

      return fs.readFileSync(wavPath).toString("base64");
    } finally {
      try {
        fs.unlinkSync(inputPath);
      } catch {}
      try {
        fs.unlinkSync(wavPath);
      } catch {}
    }
  }
}
