export class NotProcessableAudioException extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotProcessableAudioException';
        this.statusCode = 422;
    }
}