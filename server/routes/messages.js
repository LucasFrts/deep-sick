import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Router } from 'express';
import { ensureAuth } from '../middlewares/auth.js';
import { SpeechClient } from '@google-cloud/speech';
import { deepseek, deepSick } from '../helpers/deepseek-sdk.js';
import multer from 'multer';
import path from 'path';
import message from '../models/message.js';
import MessageRepository from '../repository/message-repository.js';
import MessageService from '../services/message-service.js';
import AudioToTextService from '../services/audio-to-text-service.js';
import MessageController from '../controllers/message-controller.js';
import MessageValidatorService from '../services/message-validator-service.js';
import UserRepository from '../repository/user-repository.js';
import badwords from '../config/badwords.js';




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = Router();
const upload = multer({ dest: path.join(__dirname, '../../public/uploads') });

const repository = new MessageRepository(message);
const speechSdk = new SpeechClient();
const validatorService = new MessageValidatorService({ messageRepository: repository, forbiddenWords: badwords});
const messageService  = new MessageService({ messageRepository:repository, sdk:deepseek, sick: deepSick });
const audioToTextService = new AudioToTextService({ sdk: speechSdk });

const messageController = new MessageController(messageService, audioToTextService, validatorService, UserRepository);

router.post('/', ensureAuth, messageController.send);
router.get('/', ensureAuth, messageController.getAll);
router.get('/:id', ensureAuth, messageController.getMessageById);
router.post('/sick', ensureAuth, messageController.sendSick);

router.post('/from-audio', ensureAuth, upload.single('audio'), messageController.fromAudio);
// router.post('/to-audio', ensureAuth, messageController.toAudio);
// router.post('/from-audio/to-audio', ensureAuth, multer.single('audio'), messageController.sendAudioToAudio);

export default router;