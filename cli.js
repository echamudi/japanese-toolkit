#!/usr/bin/env node --max_old_space_size=8192

const fs = require('fs');
const path = require('path');
const program = require('commander');
const console = require('console');
const {
  JapaneseDBMaker,
} = require('./index');

program
  .command('sqlite')
  .alias('toSQLite')
  .description('Export JMdict XML to SQLite database.')
  .option('-s, --source <source>', 'Destination folder')
  .option('-d, --destination <destination>', 'Destination folder')
  .action(async (args) => {
    try {
      console.log('Source: ', args.source);
      console.log('Destination: ', args.destination);

      if (!fs.existsSync(args.destination)) fs.mkdirSync(args.destination, { recursive: true });

      await JapaneseDBMaker.buildSqlite(
        // source objects
        {
          jmdict: path.join(args.source, 'JMdict_e'),
          jmnedict: path.join(args.source, 'JMnedict.xml'),
          kanjidic: path.join(args.source, 'kanjidic2.xml'),
        },
        // destination file
        `${args.destination}/japanese.db`,
      );

      console.log('');
      console.log('Completed!');
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program.parse(process.argv);
