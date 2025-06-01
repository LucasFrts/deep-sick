import { Router } from 'express';
import { ensureAuth } from '../middlewares/auth.js';
import UserController from '../controllers/user-controller.js';
import UserRepository from '../repository/user-repository.js';
import UserService from '../services/user-service.js';


const router = Router();

const userService = new UserService();
const userController = new UserController(UserRepository, userService);

router.post('/', userController.insert);
router.get('/', ensureAuth, userController.getAll);
router.get('/:id', ensureAuth, userController.get);
router.put('/:id', ensureAuth, userController.update);
router.delete('/:id', ensureAuth, userController.delete);


export default router;
