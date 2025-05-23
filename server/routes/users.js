import { Router } from 'express';
import { ensureAuth } from '../middlewares/auth.js';
import UserController from '../controllers/user-controller.js';
import UserRepository from '../repository/user-repository.js';



const router = Router();

const userController = new UserController(UserRepository);

router.post('/', userController.insert);
router.get('/', ensureAuth, userController.getAll);
router.get('/:id', ensureAuth, userController.get);
router.put('/:id', ensureAuth, userController.update);
router.delete('/:id', ensureAuth, userController.delete);


export default router;
