'use strict';

const _ = require('lodash');

/**
 *
 * @returns {*}
 */
module.exports = function jsonRequest() {
  return function *(next) {
    this.request.body = _.extend({}, this.query, this.request.body || {});
    yield next;
  };
};
