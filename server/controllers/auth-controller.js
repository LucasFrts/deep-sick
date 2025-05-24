import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import autoBind from 'auto-bind';
import { UnauthorizedErrorException } from '../exceptions/unauthorized-error-exception.js';

export default class AuthController {
  constructor({ userRepository }) {
    this.userRepository = userRepository;
    autoBind(this);
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ statusCode: 400, error: 'Email e password são obrigatórios.' });
      }

      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new UnauthorizedErrorException('Credenciais inválidas.');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedErrorException('Credenciais inválidas.');
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({
        statusCode: 200,
        data: {
          user: userWithoutPassword,
          token
        },
        metadata: { timestamp: new Date() }
      });
    } catch (err) {
      if (err instanceof UnauthorizedErrorException) {
        return res.status(err.statusCode).json({ statusCode: err.statusCode, error: err.message });
      }
      next(err);
    }
  }
}
