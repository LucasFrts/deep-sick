import { Router } from 'express';
import { ensureAuth } from '../middlewares/auth';
import UserController from '../controllers/user-controller';
import UserRepository from '../repository/user-repository';



const router = Router();

const userController = new UserController(UserRepository);

router.post('/', userController.insert);
router.get('/', ensureAuth, userController.getAll);
router.get('/:id', ensureAuth, userController.get);
router.put('/:id', ensureAuth, userController.update);
router.delete('/:id', ensureAuth, userController.delete);


export default router;
