'use strict';

import Controller from './controller.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import autoBind from 'auto-bind';

class UserController extends Controller {
  constructor(repository, userService) {
    super(repository);
    this.userService = userService;
    autoBind(this);
  }

  /**
   * Override insert to hash the user password before creating the user
   */
  async insert(req, res, next) {
    try {
        console.log(req.body);
      
      if(req.body.role) {
        delete req.body.role;
      }

      const { password, ...userData } = req.body;
      

      const hashedPassword = await bcrypt.hash(password, 10);
      const payload = { ...userData, password: hashedPassword };
      const response = await this.repository.insert(payload);
      const user = response.data;

      const token = jwt.sign(
        { id: user._id, email: user.email, role:user.role },
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

      if(req.user.role != "admin" && id != req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      if(req.body.role) {
        delete req.body.role;
      }

     if(req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
     }
      const response = await this.repository.update(id, req.body);
      return res.status(500).json(response);
    }
    catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      if(req.user.role != "admin"){
        const { data, statusCode } = await this.repository.get(req.user.id);
        return res.status(statusCode).json({
          statusCode: statusCode,
          data: [data],
          metadata: { timestamp: new Date() }
        });
      }

      const response = await this.repository.getAll(req.query);
      return res.status(response.statusCode).json(response);
    }
    catch (e) {
      console.log(e);
      next(e);
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;
    try {
      
      if(req.user.role != "admin" && id != req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const response = await this.repository.delete(id);
      return res.status(response.statusCode).json(response);
    }
    catch (e) {
      next(e);
    }
  }
}

export default UserController;
