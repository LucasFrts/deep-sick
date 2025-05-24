import AuthController from '../controllers/auth-controller.js';
import userRepository from '../repository/user-repository.js';
import { Router } from 'express';

const router = Router();

const authController = new AuthController({ userRepository });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'World' });
});

router.post('/login', authController.login);

export default router;
