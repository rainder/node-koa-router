'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  load
};

/**
 *
 * @param dir
 * @returns {{middleware: {}, endpoint: {}}}
 */
function load(dir) {
  const result = {
    middleware: {},
    endpoint: {}
  };
  const files = [dir];

  for (let file of files) {
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      const newFiles = fs.readdirSync(file);
      files.push(...newFiles.map(item => path.resolve(file, item)));
    } else {
      if (/\.js$/.test(file)) {
        const gen = require(file);

        if (/index\.js$/.test(file)) {
          const endpoint = file
            .replace(/\/index\.js$/, '')
            .replace(`${dir}`, '');

          result.middleware[endpoint] = gen;
        } else {

          const endpoint = file
            .replace(/\.js$/, '')
            .replace(`${dir}`, '');

          result.endpoint[endpoint] = gen;
        }

      }
    }
  }

  return result;
}
