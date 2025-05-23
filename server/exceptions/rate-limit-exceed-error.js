export class RateLimitExceededError extends Error {
  constructor(limit, windowMinutes) {
    super(`Limite de requisições excedido (${limit} em ${windowMinutes} minutos).`);
    this.name = 'RateLimitExceededError';
    this.statusCode = 429;
    this.limit = limit;
    this.window = windowMinutes;
  }
}