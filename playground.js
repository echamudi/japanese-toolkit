const fs = require('fs');
const { JMnedictUtil } = require('./index');

function objectToJson(object, path, beautify = true) {
  /** @type {number} */
  const space = beautify ? 2 : 0;

  fs.writeFileSync(
    path,
    JSON.stringify(object, null, space),
    'utf8',
  );
}

const jmnedict = new JMnedictUtil('./test/fixtures/JMnedict.xml');

objectToJson(jmnedict.getJMnedictEntries(), './jmnedict.json');
