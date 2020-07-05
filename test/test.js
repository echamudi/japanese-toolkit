const furigana = require('..');
const assert = require('assert');

function filterFitObj(obj) {
    // return obj;
    return { w: obj.w, r: obj.r };
}

describe('hoy', function () {
    it('test furigana', function () {
        assert.deepStrictEqual(furigana.fitObj('く', 'く').map(filterFitObj), [
            { w: 'く', r: 'く' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('コヤ', 'こや').map(filterFitObj), [
            { w: 'コヤ', r: 'こや' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('食', 'しょく').map(filterFitObj), [
            { w: '食', r: 'しょく' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('一', 'ひろし').map(filterFitObj), [
            { w: '一', r: 'ひろし' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('ひ', 'は'), undefined);
        assert.deepStrictEqual(furigana.fitObj('はは', 'は'), undefined);
        assert.deepStrictEqual(furigana.fitObj('は', 'はた'), undefined);

        assert.deepStrictEqual(furigana.fitObj('私は', 'わたしは').map(filterFitObj), [
            { w: '私', r: 'わたし' },
            { w: 'は', r: 'は' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('彼女は一番です', 'かのじょはいちばんです').map(filterFitObj), [
            { w: '彼', r: 'かの' },
            { w: '女', r: 'じょ' },
            { w: 'は', r: 'は' },
            { w: '一', r: 'いち' },
            { w: '番', r: 'ばん' },
            { w: 'です', r: 'です' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('一は一と行っています', 'よこいちはにのまえといっています').map(filterFitObj), [
            { w: '一', r: 'よこいち' },
            { w: 'は', r: 'は' },
            { w: '一', r: 'にのまえ' },
            { w: 'と', r: 'と' },
            { w: '行', r: 'い' },
            { w: 'っています', r: 'っています' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('軍畑駅', 'いくさばたえき').map(filterFitObj), [
            { w: '軍', r: 'いくさ' },
            { w: '畑', r: 'はた' },
            { w: '駅', r: 'えき' }
        ]);

        // Merge kana test
        assert.deepStrictEqual(furigana.fitObj('田中さんはすごいと思います', 'たなかさんはすごいとおもいます').map(filterFitObj), [
            { w: '田', r: 'た' },
            { w: '中', r: 'なか' },
            { w: 'さんはすごいと', r: 'さんはすごいと' },
            { w: '思', r: 'おも' },
            { w: 'います', r: 'います' }
        ]);

        // Merge unmatched kanji test
        assert.deepStrictEqual(furigana.fitObj('食一二三午後', 'しょくあいうえおごご').map(filterFitObj), [
            { w: '食', r: 'しょく' },
            { w: '一二三', r: 'あいうえお' },
            { w: '午', r: 'ご' },
            { w: '後', r: 'ご' }
        ]);

        assert.deepStrictEqual(furigana.fitObj('安足間駅と風合瀬駅はすごい', 'あんたろまえきとかそせえきはすごい').map(filterFitObj), [
            { w: '安', r: 'あん' },
            { w: '足', r: 'た' },
            { w: '間', r: 'ろま' },
            { w: '駅', r: 'えき' },
            { w: 'と', r: 'と' },
            { w: '風合', r: 'かそ' },
            { w: '瀬', r: 'せ' },
            { w: '駅', r: 'えき' },
            { w: 'はすごい', r: 'はすごい' }
        ]);
    })
})

// TODO

// console.log(fitObj('私はボーブさんと仕事が飛田給駅にしてます', 'あしはぼーぶさんとしごとがとびたきゅうえきにしてます'));
// console.log(fitObj(
//     '田中さんは安足間駅と風合瀬駅と小牛田駅に行ったことがある', 
//     'たなかさんはあんたろまえきとかそせえきとこごたえきにいったことがある'));
// console.log(fitObj('一二', 'あいうえお'));
// console.log(fitObj('安足間駅と風合瀬駅はすごい', 'あんたろまえきとかそせえきはすごい'));
// console.log(readingLib['食']);
// console.log(fitObj('安足間駅と風合瀬駅はすごい', 'あんたろまえきとかそせえきはすごい'));
// console.log(fitObj(
//     '田中さんは安足間駅と風合瀬駅と小牛田駅に行ったことがある', 
//     'たなかさんはあんたろまえきとかそせえきとこごたえきにいったことがある'));

// console.log(fitObj(
//     '東江と審と安居院と生明と安栖と馬酔木と東奥と明父と旦来と流井と行町と雷と五百蔵', 
//     'あがりえとあきらとあぐいとあざみとあずまいとあせびとあちおくとあぢちとあっそとあらいとあるきまちといかづちといおろい'));

// console.log(fitObj(
//     '東です', 
//     'かきくけこかきくけこかきくけこかきくけこです'));
