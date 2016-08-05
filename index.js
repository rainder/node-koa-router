'use strict';

const _ = require('lodash');
const path = require('path');
const koaJsonBody = require('koa-json-body');
const compose = require('koa-compose');

const routeLoader = require('./lib/route-loader');
const jsonRequest = require('./lib/json-request');
const jsonResponse = require('./lib/json-response');
const RouterError = require('./lib/router-error');

module.exports = function (options = {}) {
  options = _.merge({
    errors: {
      constructor: RouterError,
      not_found: RouterError.NOT_FOUND,
      internal: RouterError.INTERNAL
    }
  }, options);

  const DIR = path.resolve(options.dir);
  const routes = routeLoader.load(DIR);

  return compose([
    koaJsonBody({
      limit: 1024 * 1024 * 10
    }),
    jsonRequest(),
    jsonResponse(options.errors),
    router
  ]);

  function *router() {
    const url = this.url.split('?')[0];
    const urlParts = url.split('/');
    const ctx = { endpoint: url, headers: this.headers };

    const endpoint = routes.endpoint[url];
    if (!endpoint) {
      throw new options.errors.not_found();
    }

    for (let i = 0; i < urlParts.length; i++) {
      const part = urlParts.slice(0, i).join('/');
      const middleware = routes.middleware[part];
      if (middleware) {
        yield middleware.call(ctx);
      }
    }

    const result = yield endpoint.call(ctx, this.request.body);

    this.body = result || {};
  }
};
