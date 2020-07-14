// Type definitions for japanese-db
// Project: japanese-db
// Definitions by: Ezzat Chamudi <https://github.com/echamudi>

import * as JMdict from './types/jmdict';
import * as JMnedict from './types/jmnedict';
import * as JapaneseDB from './types/japanesedb';

export { JMdict };
export { JMnedict };
export { JapaneseDB };

export { default as JMdictUtil } from "./lib/JMdictUtil";
export { default as JapaneseDBTool } from "./lib/JapaneseDBTool";
export { default as JMnedictUtil } from "./lib/JMnedictUtil";
export { default as KanjidicUtil } from "./lib/KanjidicUtil";
