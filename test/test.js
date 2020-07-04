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

        assert.deepStrictEqual(furigana.fitObj('一は', 'よこいちは'), [
            { k: '一', r: 'よこいち' },
            { k: 'は', r: 'は' }
        ]);
    })
})