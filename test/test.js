/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const { execSync } = require('child_process');
const assert = require('assert');
const console = require('console');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

describe('japanese-db-maker', function () {
  it('exports database', function () {
    console.log(`> japanese-db-maker sqlite -s ${__dirname}/fixtures -d ${__dirname}/result`);

    execSync(`japanese-db-maker sqlite -s ${__dirname}/fixtures -d ${__dirname}/result`, {
      stdio: 'inherit',
    });

    console.log(`Please check the result at ${__dirname}/result`);
  });

  it('extracts correctly', async function () {
    // Random checks

    const db = new sqlite3.Database(path.join(__dirname, 'result', 'japanese.db'));

    const [metadataTest] = await Promise.all([
      new Promise((resolve) => {
        db.all('SELECT * FROM metadata', function (err, rows) {
          resolve(rows);
        });
      }),
    ]);

    assert.deepStrictEqual(
      metadataTest.find((/** @type {Object} */ el) => el.key === 'jmdict-date').value,
      '2019-08-16',
    );

    assert.deepStrictEqual(
      metadataTest.find((/** @type {Object} */ el) => el.key === 'jmnedict-date').value,
      '2019-09-20',
    );
  });
});
