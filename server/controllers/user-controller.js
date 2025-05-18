'use strict';

import Controller from './controller.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UserController extends Controller {
  constructor(repository) {
    super(repository);
  }

  /**
   * Override insert to hash the user password before creating the user
   */
  async insert(req, res, next) {
    try {
        console.log(req.body);
      const { password, ...userData } = req.body;
      

      const hashedPassword = await bcrypt.hash(password, 10);
      const payload = { ...userData, password: hashedPassword };
      const response = await this.repository.insert(payload);
      const user = response.data;

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      console.log(token, user)
      
      return res.status(response.statusCode).json({
        statusCode: response.statusCode,
        data: {
          user,
          token
        },
        metadata: response.metadata
      });
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    try {
     if(req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
     }
      const response = await this.repository.update(id, req.body);
      return res.status(response.statusCode).json(response);
    }
    catch (e) {
      next(e);
    }
  }
}

export default UserController;
