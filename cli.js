#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const console = require('console');
const {
  JapaneseDbMaker,
} = require('./index');

program
  .command('sqlite')
  .alias('toSQLite')
  .description('Export JMdict XML to SQLite database.')
  .option('-s, --source <source>', 'Destination folder')
  .option('-d, --destination <destination>', 'Destination folder')
  .action(async (args) => {
    console.log('Source: ', args.source);
    console.log('Destination: ', args.destination);

    if (!fs.existsSync(args.destination)) fs.mkdirSync(args.destination, { recursive: true });

    await JapaneseDbMaker.buildSqlite(
      // sources object
      {
        jmdict: `${args.source}/JMdict_e`,
        jmnedict: `${args.source}/JMnedict.xml`,
      },
      // destination file
      `${args.destination}/japanese.db`,
    );

    console.log('Completed!');
  });

program.parse(process.argv);
