/**
 * Copyright (c) 2020 Ezzat Chamudi
 * Copyright (c) 2020 Project Authors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 */

const { execSync } = require('child_process');
const assert = require('assert');

describe('testing kanji-tree CLI', () => {
    it('shows correct kanji tree for 焼き鳥', () => {
        const result = execSync('kanji-tree 焼き鳥').toString();
        assert.deepStrictEqual(result, `├─ 焼
│  ├─ 火
│  └─ 尭
│     ├─ 卉
│     │  ├─ 十
│     │  └─ 廾
│     │     ├─ 十
│     │     ├─ 丿
│     │     └─ 十
│     └─ ？
│        ├─ 兀
│        │  └─ 一
│        └─ 儿
│           └─ 丿
├─ ？
└─ 鳥
   └─ 灬
`);
    });
});
