/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

const { execSync } = require('child_process');
const assert = require('assert');
const console = require('console');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

describe('japanese-db-maker', function () {
  it('exports database', async function () {
    this.timeout(60000);
    this.slow(30000);

    console.log(`> japanese-db-maker sqlite -s ${__dirname}/fixtures -d ${__dirname}/result`);

    // const os = process.platform;
    /** @type {any} */
    const execSyncProp = {
      timeout: 60000,
      stdio: 'inherit',
    };

    // TODO: doesn't work in ubuntu
    execSync(`japanese-db-maker sqlite -s ${__dirname}/fixtures -d ${__dirname}/result`, execSyncProp);

    console.log(`Please check the result at ${__dirname}/result`);
  });

  it('extracts correctly', async function () {
    this.timeout(60000);
    this.slow(30000);

    // Load rows
    const db = new sqlite3.Database(path.join(__dirname, 'result', 'japanese.db'));

    const dictIndexSelections = new Promise((resolve) => {
      db.all('SELECT * FROM dict_index', function (err, rows) {
        resolve(rows);
      });
    });

    const metadataSelections = new Promise((resolve) => {
      db.all('SELECT * FROM metadata', function (err, rows) {
        resolve(rows);
      });
    });

    const kanjivgTreeSelections = new Promise((resolve) => {
      db.all('SELECT * FROM kanjivg_tree WHERE kanji= \'圧\'', function (err, rows) {
        resolve(rows);
      });
    });

    const [dictIndexRows, metadataRows, kanjivgTreeRows] = await Promise.all([
      dictIndexSelections,
      metadataSelections,
      kanjivgTreeSelections,
    ]);

    // dict_index check
    assert.deepStrictEqual(dictIndexRows.length, 107);
    assert.deepStrictEqual(
      dictIndexRows.some((/** @type {Object} */ el) => el.id === 1290160),
      true,
    );
    assert.deepStrictEqual(
      dictIndexRows.some((/** @type {Object} */ el) => el.id === 5001664),
      true,
    );

    // metadata check
    assert.deepStrictEqual(
      metadataRows.find((/** @type {Object} */ el) => el.key === 'jmdict-date').value,
      '2019-08-16',
    );

    assert.deepStrictEqual(
      metadataRows.find((/** @type {Object} */ el) => el.key === 'jmnedict-date').value,
      '2019-09-20',
    );

    // kanjivg_tree check
    assert.deepStrictEqual(
      kanjivgTreeRows.some((/** @type {Object} */ el) => el.kanji === '圧'
        && el.tree_json === '{"element":"圧","g":[{"element":"厂"},{"element":"土"}]}'),
      true,
    );

    // TODO: Add more checks
  });
});
