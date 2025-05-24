import autoBind from "auto-bind";
import { RateLimitExceededError } from "../exceptions/rate-limit-exceed-error.js";
import { ForbiddenWordError } from "../exceptions/forbidden-word-error.js";

export default class MessageController {
  constructor(
    messageService,
    audioToTextService,
    textToAudioService,
    messageValidatorService
  ) {
    this.messageService = messageService;
    this.audioToTextService = audioToTextService;
    this.textToAudioService = textToAudioService;
    this.messageValidatorService = messageValidatorService;
    autoBind(this);
  }

  async send(req, res, next) {
    try {
      const userId = req.user.id;
      const { message } = req.body;

      if (!message) {
        return res
          .status(400)
          .json({ statusCode: 400, error: "message é obrigatório" });
      }

      await this.messageValidatorService.validate(userId, message);

      const { repply, messages } = await this.messageService.processMessage(
        userId,
        message
      );

      return res.status(200).json({
        statusCode: 200,
        data: { assistant: repply, history: messages },
        metadata: { timestamp: new Date() },
      });
    } catch (err) {
      if (err instanceof ForbiddenWordError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      if (err instanceof RateLimitExceededError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      next(err);
    }
  }

  async getMessageById(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const message = await this.messageService.getMessageById(userId, id);
      if (!message) {
        return res
          .status(404)
          .json({ statusCode: 404, error: "Mensagem não encontrada." });
      }
      return res
        .status(200)
        .json({
          statusCode: 200,
          data: message,
          metadata: { timestamp: new Date() },
        });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      const messages = await this.messageService.getConversationHistory(userId);
      return res
        .status(200)
        .json({
          statusCode: 200,
          data: messages,
          metadata: { timestamp: new Date() },
        });
    } catch (err) {
      next(err);
    }
  }

  async sendSick(req, res, next) {
    try {
      const userId = req.user.id;
      const { message } = req.body;

      if (!message) {
        return res
          .status(400)
          .json({ statusCode: 400, error: "message é obrigatório" });
      }

      await this.messageValidatorService.validate(userId, message);

      const { repply, messages } = await this.messageService.processMessageSick(
        userId,
        message
      );
      return res.status(200).json({
        statusCode: 200,
        data: { assistant: repply, history: messages },
        metadata: { timestamp: new Date() },
      });
    } catch (err) {
      if (err instanceof ForbiddenWordError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      if (err instanceof RateLimitExceededError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      next(err);
    }
  }

  async fromAudio(req, res, next) {
    try {
      const userId = req.user.id;
      const language = req.user.language;
      const filePath = req.file.path;

      const audioBytes = await this.audioToTextService.convert(filePath);
      const transcribed = await this.audioToTextService.transcribe(
        audioBytes,
        language
      );

      const { repply, messages } = await this.messageService.processMessage(
        userId,
        transcribed
      );

      return res.status(200).json({
        statusCode: 200,
        data: { assistant: repply, history: messages },
        metadata: { timestamp: new Date() },
      });
    } catch (err) {
      next(err);
    }
  }

  async toAudio(req, res, next) {
    try {
      const userId = req.user.id;
      const language = req.user.language;
      const { message } = req.body;

      if (!message) {
        return res
          .status(400)
          .json({ statusCode: 400, error: "message é obrigatório" });
      }

      await this.messageValidatorService.validate(userId, message);

      const { repply } = await this.messageService.processMessage(
        userId,
        message
      );

      const { filePath, fileName } = await this.textToAudioService.process(
        repply,
        language,
        userId
      );

      return res.download(filePath, fileName, (err) => {
        if (err) return next(err);
      });
    } catch (err) {
      if (err instanceof ForbiddenWordError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      if (err instanceof RateLimitExceededError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      next(err);
    }
  }

  async audioToAudio(req, res, next) {
    try {
      const userId = req.user.id;
      const language = req.user.language;
      const filePath = req.file.path;

      const audioBytes = await this.audioToTextService.convert(filePath);
      const transcribed = await this.audioToTextService.transcribe(
        audioBytes,
        language
      );

      const { repply } = await this.messageService.processMessage(
        userId,
        transcribed
      );

      const { filePath:filePathResponse, fileName } = await this.textToAudioService.process(
        repply,
        language,
        userId
      );

      return res.download(filePathResponse, fileName, (err) => {
        if (err) return next(err);
      });
    } catch (err) {
      next(err);
    }
  }
}
