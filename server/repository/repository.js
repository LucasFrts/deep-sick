'use strict';
import mongoose from 'mongoose';
import autoBind from 'auto-bind';
import HttpResponse from '../helpers/http-response.js';

class Repository {

  constructor(model) {
    this.model = model;
    autoBind(this);
  }

  async getAll(query) {
    let { skip, limit, sortBy } = query;

    skip = skip ? Number(skip) : 0;
    limit = limit ? Number(limit) : 10;
    sortBy = sortBy ? sortBy : {createdAt: -1};

    delete query.skip;
    delete query.limit;
    delete query.sortBy;

    try {
      const items = await this.model
        .find(query)
        .sort(sortBy)
        .skip(skip)
        .limit(limit);

      const total = await this.model.countDocuments(query);

      return new HttpResponse(items, {totalCount: total});
    } catch (errors) {
      throw errors;
    }
  }


  async get(id) {
    try {
      const item = await this.model.findById(id);
      if (!item) {
        const error = new Error('Item not found');
        error.statusCode = 404;
        throw error;
      }

      return new HttpResponse(item);
    } catch (errors) {
     throw errors;
    }
  }

  async insert(data) {
    try {
      const item = await this.model.create(data);
      if (item) {
        return new HttpResponse(item, {created: true}, 201);
      } else {
        throw new Error('Something wrong happened');
      }
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const item = await this.model.findByIdAndUpdate(id, data, { new: true });
      return new HttpResponse(item);
    } catch (errors) {
      throw errors;
    }
  }

  async delete(id) {
    try {
      const item = await this.model.findByIdAndDelete(id);
      if (!item) {
        const error = new Error('Item not found');
        error.statusCode = 404;
        throw error;
      } else {
        return new HttpResponse(item, {deleted: true});
      }
    } catch (errors) {
      throw errors;
    }
  }
}

export default Repository;