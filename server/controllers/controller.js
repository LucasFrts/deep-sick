'use strict';

import autoBind from 'auto-bind';

class Controller {

  constructor(repository) {
    this.repository = repository;
    autoBind(this);
  }

  async getAll(req, res, next) {
    try {
      const response = await this.repository.getAll(req.query);
      return res.status(response.statusCode).json(response);
    }
    catch (e) {
      next(e);
    }
  }

  async get(req, res, next) {
    const { id } = req.params;
    try {
      const response = await this.repository.get(id);
      return res.status(response.statusCode).json(response);
    }
    catch (e) {
      next(e);
    }
  }

  async insert(req, res, next) {
    try {
      const response = await this.repository.insert(req.body);
      return res.status(response.statusCode).json(response);
    }
    catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    try {
      const response = await this.repository.update(id, req.body);
      return res.status(response.statusCode).json(response);
    }
    catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;
    try {
      const response = await this.repository.delete(id);
      return res.status(response.statusCode).json(response);
    }
    catch (e) {
      next(e);
    }
  }

}

export default Controller;