import { Router } from 'express';
import message from '../models/message.js';
import MessageRepository from '../repository/message-repository.js';
import MessageService from '../services/message-service.js';
import { deepseek, deepSick } from '../helpers/deepseek-sdk.js';
import MessageController from '../controllers/message-controller.js';
import MessageValidatorService from '../services/message-validator-service.js';
import badwords from '../config/badwords.js';
import { ensureAuth } from '../middlewares/auth.js';

const router = Router();

const repository = new MessageRepository(message);

const validatorService = new MessageValidatorService({ messageRepository: repository, forbiddenWords: badwords});
const messageService  = new MessageService({ messageRepository:repository, sdk:deepseek, sick: deepSick });
const messageController = new MessageController(messageService, validatorService);

router.post('/', ensureAuth, messageController.send);

router.get('/', ensureAuth, messageController.getAll);
router.get('/:id', ensureAuth, messageController.getMessageById);

router.post('/sick', ensureAuth, messageController.sendSick);


export default router;