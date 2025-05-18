// helpers/HttpResponse.js
'use strict';

class HttpResponse {
  /**
   * @param {*} data      
   * @param {Object} metadata
   * @param {number} statusCode
   */
  constructor(data, metadata = {}, statusCode = 200) {
    this.statusCode = statusCode;
    this.data       = data;
    this.metadata   = metadata;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      data:       this.data,
      metadata:   this.metadata
    };
  }
}

export default HttpResponse;
