'use strict';

class RouterError {
  static create(errno, status, message) {
    return class extends RouterError {
      constructor() {
        super();
        
        this.errno = errno;
        this.status = status;
        this.message = message;
      }
    }
  }
}

module.exports = RouterError;

RouterError.NOT_FOUND = RouterError.create(1, 400, 'Resource could not be found');
RouterError.INTERNAL = RouterError.create(2, 500, 'Internal server error');
