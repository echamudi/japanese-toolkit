const { execSync } = require('child_process');
const assert = require('assert');

describe('testing kanji-tree CLI', function() {
    it('shows correct kanji tree for 焼き鳥', function() {
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
