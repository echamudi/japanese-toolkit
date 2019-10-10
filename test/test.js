/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const { execSync } = require('child_process');
const console = require('console');

describe('japanese-db-maker', function () {
  it('exports database', function () {
    console.log(`> japanese-db-maker sqlite -s ${__dirname}/fixtures -d ${__dirname}/result`);

    execSync(`japanese-db-maker sqlite -s ${__dirname}/fixtures -d ${__dirname}/result`, {
      stdio: 'inherit',
    });

    console.log(`Please check the result at ${__dirname}/result`);
  });
});
