const furigana = require('..');
const assert = require('assert');

describe('hoy', function () {
    it('test furigana', function () {
        assert.deepStrictEqual(furigana.fitObj('く', 'く'), [
            { k: 'く', r: 'く' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('コヤ', 'こや'), [
            { k: 'コ', r: 'こ' },
            { k: 'ヤ', r: 'や' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('食', 'しょく'), [
            { k: '食', r: 'しょく' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('一', 'ひろし'), [
            { k: '一', r: 'ひろし' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('ひ', 'は'), undefined);
        assert.deepStrictEqual(furigana.fitObj('はは', 'は'), undefined);
        assert.deepStrictEqual(furigana.fitObj('は', 'はた'), undefined);

        assert.deepStrictEqual(furigana.fitObj('私は', 'わたしは'), [
            { k: '私', r: 'わたし' },
            { k: 'は', r: 'は' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('彼女は一番です', 'かのじょはいちばんです'), [
            { k: '彼', r: 'かの' },
            { k: '女', r: 'じょ' },
            { k: 'は', r: 'は' },
            { k: '一', r: 'いち' },
            { k: '番', r: 'ばん' },
            { k: 'で', r: 'で' },
            { k: 'す', r: 'す' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('一は一と行っています', 'よこいちはにのまえといっています'), [
            { k: '一', r: 'よこいち' },
            { k: 'は', r: 'は' },
            { k: '一', r: 'にのまえ' },
            { k: 'と', r: 'と' },
            { k: '行', r: 'い' },
            { k: 'っ', r: 'っ' },
            { k: 'て', r: 'て' },
            { k: 'い', r: 'い' },
            { k: 'ま', r: 'ま' },
            { k: 'す', r: 'す' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('軍畑駅', 'いくさばたえき'), [
            { k: '軍', r: 'いくさ' },
            { k: '畑', r: 'はた' },
            { k: '駅', r: 'えき' }
        ]);
    })
})