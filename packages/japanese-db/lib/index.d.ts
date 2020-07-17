/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

// Type definitions for japanese-db
// Project: japanese-db
// Definitions by: Ezzat Chamudi <https://github.com/echamudi>

import * as JMdict from './types/jmdict';
import * as JMnedict from './types/jmnedict';
import * as JapaneseDB from './types/japanesedb';

export { JMdict };
export { JMnedict };
export { JapaneseDB };

export { default as JMdictUtil } from './JMdictUtil';
export { default as JMnedictUtil } from './JMnedictUtil';
export { default as JapaneseDBTool } from './JapaneseDBTool';
export { default as KanjidicUtil } from './KanjidicUtil';
