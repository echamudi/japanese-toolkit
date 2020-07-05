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

        assert.deepStrictEqual(furigana.fitObj('ひ', 'は'), null);
        assert.deepStrictEqual(furigana.fitObj('はは', 'は'), null);
        assert.deepStrictEqual(furigana.fitObj('は', 'はた'), null);

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

        // Long tests
        assert.deepStrictEqual(
            furigana.fitObj(
                '田中さんは安足間駅と風合瀬駅と小牛田駅に行ったことがある', 
                'たなかさんはあんたろまえきとかそせえきとこごたえきにいったことがある'
                ).map(filterFitObj), 
            [
                { w: '田', r: 'た' },
                { w: '中', r: 'なか' },
                { w: 'さんは', r: 'さんは' },
                { w: '安', r: 'あん' },
                { w: '足', r: 'た' },
                { w: '間', r: 'ろま' },
                { w: '駅', r: 'えき' },
                { w: 'と', r: 'と' },
                { w: '風合', r: 'かそ' },
                { w: '瀬', r: 'せ' },
                { w: '駅', r: 'えき' },
                { w: 'と', r: 'と' },
                { w: '小', r: 'こ' },
                { w: '牛', r: 'ご' },
                { w: '田', r: 'た' },
                { w: '駅', r: 'えき' },
                { w: 'に', r: 'に' },
                { w: '行', r: 'い' },
                { w: 'ったことがある', r: 'ったことがある' }
            ]
        );

        assert.deepStrictEqual(
            furigana.fitObj(
                '東江と審と安居院と生明と安栖と馬酔木と東奥と明父と旦来と流井と行町と雷と五百蔵', 
                'あがりえとあきらとあぐいとあざみとあずまいとあせびとあちおくとあぢちとあっそとあらいとあるきまちといかづちといおろい'
                ).map(filterFitObj), 
            [
                { w: '東', r: 'あがり' }, { w: '江', r: 'え' },
                { w: 'と', r: 'と' },   { w: '審', r: 'あきら' },
                { w: 'と', r: 'と' },   { w: '安', r: 'あ' },
                { w: '居', r: 'ぐ' },   { w: '院', r: 'い' },
                { w: 'と', r: 'と' },   { w: '生', r: 'あざ' },
                { w: '明', r: 'み' },   { w: 'と', r: 'と' },
                { w: '安', r: 'あ' },   { w: '栖', r: 'ずまい' },
                { w: 'と', r: 'と' },   { w: '馬酔木', r: 'あせび' },
                { w: 'と', r: 'と' },   { w: '東', r: 'あち' },
                { w: '奥', r: 'おく' },  { w: 'と', r: 'と' },
                { w: '明', r: 'あ' },   { w: '父', r: 'ちち' },
                { w: 'と', r: 'と' },   { w: '旦来', r: 'あっそ' },
                { w: 'と', r: 'と' },   { w: '流', r: 'あら' },
                { w: '井', r: 'い' },   { w: 'と', r: 'と' },
                { w: '行', r: 'あるき' }, { w: '町', r: 'まち' },
                { w: 'と', r: 'と' },   { w: '雷', r: 'いかづち' },
                { w: 'と', r: 'と' },   { w: '五', r: 'い' },
                { w: '百', r: 'お' },   { w: '蔵', r: 'ろい' }
            ]
        );

        assert.deepStrictEqual(
            furigana.fitObj(
                '十十です', 
                'かきくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこです'
                ).map(filterFitObj), 
            [
                { w: '十', r: 'か'},
                {
                    w: '十',
                    r: 'きくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこ',
                },
                { w: 'です', r: 'です' }
            ]
        );
    })
});
