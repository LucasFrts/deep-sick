// src/controllers/ChatController.js
import autoBind from "auto-bind";
import { RateLimitExceededError } from "../exceptions/rate-limit-exceed-error.js";
import { ForbiddenWordError } from "../exceptions/forbidden-word-error.js";

export default class MessageController {

  constructor(messageService, messageValidatorService) {
    this.messageService = messageService;
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
      console.log(repply, "repply")
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
      const message = await this.messageService.getMessageById(
        userId,
        id
      );
      if (!message) {
        return res
          .status(404)
          .json({ statusCode: 404, error: "Mensagem não encontrada." });
      }
      return res.status(200).json({ statusCode: 200, data: message, metadata: { timestamp: new Date() }});
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      const messages = await this.messageService.getConversationHistory(
        userId
      );
      return res.status(200).json({ statusCode: 200, data: messages, metadata: { timestamp: new Date() }});
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
}
