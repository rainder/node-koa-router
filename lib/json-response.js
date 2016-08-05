'use strict';

/**
 *
 * @param errors
 * @returns {Function}
 */
module.exports = function jsonResponse(errors) {
  return function *(next) {
    const result = {
      success: true,
      data: null
    };

    try {
      yield next;

      result.data = this.body;

    } catch (e) {
      if (!(e instanceof errors.constructor)) {
        console.error(e);
        e = new errors.internal();
      }

      result.success = false;
      result.data = e;
    }

    this.body = result;
  };
};
