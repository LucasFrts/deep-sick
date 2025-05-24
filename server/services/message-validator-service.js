import dayjs from 'dayjs';
import { ForbiddenWordError } from '../exceptions/forbidden-word-error.js';
import { RateLimitExceededError } from '../exceptions/rate-limit-exceed-error.js';

export default class MessageValidatorService {
  constructor({ messageRepository, forbiddenWords = [], rateLimitCount = 10, rateLimitWindow = 10 }) {
    this.messageRepository = messageRepository;
    this.forbiddenWords = forbiddenWords.map(w => w.toLowerCase());
    this.rateLimitCount = rateLimitCount;
    this.rateLimitWindow = rateLimitWindow;
  }


  containsForbiddenWords(message) {
    const normalized = message.toLowerCase();
    for (const word of this.forbiddenWords) {
      if (normalized.includes(word)) {
        return word;
      }
    }
    return null;
  }

  validateContent(message) {
    const found = this.containsForbiddenWords(message);
    if (found) {
      throw new ForbiddenWordError(found);
    }
  }

  async validateRateLimit(userId) {
    const since = dayjs().subtract(this.rateLimitWindow, 'minute').toDate();
    const count = await this.messageRepository.countUserMessagesSince(userId, since);
    if (count >= this.rateLimitCount) {
      throw new RateLimitExceededError(this.rateLimitCount, this.rateLimitWindow);
    }
  }

  async validate(userId, message) {
    this.validateContent(message);
    await this.validateRateLimit(userId);
  }
}
