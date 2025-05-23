export class ForbiddenWordError extends Error {
  constructor(word) {
    super(`Conteúdo inválido: termo proibido encontrado: "${word}"`);
    this.name = 'ForbiddenWordError';
    this.statusCode = 400;
    this.word = word;
  }
}