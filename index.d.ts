// Type definitions for japanese-db-maker
// Project: japanese-db-maker
// Definitions by: Ezzat Chamudi <https://github.com/ezhmd>

import * as JMdict from './types/jmdict';
import * as JMnedict from './types/jmnedict';
import * as JapaneseDB from './types/japanesedb';

export { JMdict };
export { JMnedict };
export { JapaneseDB };

export { default as JMdictUtil } from "./lib/JMdictUtil";
export { default as JapaneseDbMaker } from "./lib/JapaneseDbMaker";
export { default as JMnedictUtil } from "./lib/JMnedictUtil";
export { default as KanjidicUtil } from "./lib/KanjidicUtil";
