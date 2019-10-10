const { execSync } = require('child_process');
const console = require('console');

console.log(`> japanese-db-maker sqlite -s ${__dirname}/fixtures -d ${__dirname}/result`);
execSync(`japanese-db-maker sqlite -s ${__dirname}/fixtures -d ${__dirname}/result`, {
  stdio: 'inherit',
});

console.log(`Please check the result at ${__dirname}/result`);
