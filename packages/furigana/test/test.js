/* eslint-disable @typescript-eslint/no-var-requires */
const { deepStrictEqual } = require('assert');
const { fit } = require('..');

const config = { type: 'object' };

describe('fitObj', () => {
    it('passes single letter tests', () => {
        deepStrictEqual(fit('く', 'く', config), [
            { w: 'く', r: 'く' },
        ]);

        deepStrictEqual(
            fit('く', 'く'),
            'く',
        );

        deepStrictEqual(fit('コヤ', 'こや', config), [
            { w: 'コヤ', r: 'こや' },
        ]);

        deepStrictEqual(
            fit('コヤ', 'こや'),
            'コヤ',
        );

        deepStrictEqual(fit('食', 'しょく', config), [
            { w: '食', r: 'しょく' },
        ]);

        deepStrictEqual(
            fit('食', 'しょく'),
            '食[しょく]',
        );

        deepStrictEqual(fit('裕', 'ひろし', config), [
            { w: '裕', r: 'ひろし' },
        ]);

        deepStrictEqual(
            fit('裕', 'ひろし'),
            '裕[ひろし]',
        );
    });

    it('passes null tests', () => {
        deepStrictEqual(fit('ひ', 'は', config), null);
        deepStrictEqual(fit('ひ', 'は'), null);
        deepStrictEqual(fit('はは', 'は', config), null);
        deepStrictEqual(fit('はは', 'は'), null);
        deepStrictEqual(fit('は', 'はた', config), null);
        deepStrictEqual(fit('は', 'はた'), null);
    });

    it('passes multi-letter kanji letters', () => {
        deepStrictEqual(fit('九段下', 'くだんした', config), [
            { w: '九', r: 'く' },
            { w: '段', r: 'だん' },
            { w: '下', r: 'した' },
        ]);

        deepStrictEqual(
            fit('九段下', 'くだんした'),
            '九[く] 段[だん] 下[した]',
        );

        deepStrictEqual(fit('軍畑駅', 'いくさばたえき', config), [
            { w: '軍', r: 'いくさ' },
            { w: '畑', r: 'ばた' },
            { w: '駅', r: 'えき' },
        ]);

        deepStrictEqual(
            fit('軍畑駅', 'いくさばたえき'),
            '軍[いくさ] 畑[ばた] 駅[えき]',
        );
    });

    it('passes merge kana tests', () => {
        deepStrictEqual(fit('田中さんとボーブさんはすごいと思います', 'たなかさんとぼーぶさんはすごいとおもいます', config), [
            { w: '田', r: 'た' },
            { w: '中', r: 'なか' },
            { w: 'さんとボーブさんはすごいと', r: 'さんとぼーぶさんはすごいと' },
            { w: '思', r: 'おも' },
            { w: 'います', r: 'います' },
        ]);

        deepStrictEqual(
            fit('田中さんとボーブさんはすごいと思います', 'たなかさんとぼーぶさんはすごいとおもいます'),
            '田[た] 中[なか]さんとボーブさんはすごいと 思[おも]います',
        );
    });

    it('passes some basic tests', () => {
        deepStrictEqual(fit('私は', 'わたしは', config), [
            { w: '私', r: 'わたし' },
            { w: 'は', r: 'は' },
        ]);

        deepStrictEqual(fit('彼女は一番です', 'かのじょはいちばんです', config), [
            { w: '彼', r: 'かの' },
            { w: '女', r: 'じょ' },
            { w: 'は', r: 'は' },
            { w: '一', r: 'いち' },
            { w: '番', r: 'ばん' },
            { w: 'です', r: 'です' },
        ]);

        deepStrictEqual(fit('一は一と行っています', 'よこいちはにのまえといっています', config), [
            { w: '一', r: 'よこいち' },
            { w: 'は', r: 'は' },
            { w: '一', r: 'にのまえ' },
            { w: 'と', r: 'と' },
            { w: '行', r: 'い' },
            { w: 'っています', r: 'っています' },
        ]);
    });

    it('passes unmatched kanji tests', () => {
        deepStrictEqual(fit('食一二三午後', 'しょくあいうえおごご', config), [
            { w: '食', r: 'しょく' },
            { w: '一二三', r: 'あいうえお' },
            { w: '午', r: 'ご' },
            { w: '後', r: 'ご' },
        ]);

        deepStrictEqual(
            fit('食一二三午後', 'しょくあいうえおごご'),
            '食[しょく] 一二三[あいうえお] 午[ご] 後[ご]',
        );

        deepStrictEqual(fit('高輪ゲートウェイ駅と風合瀬駅は大きい', 'たかなわゲートウェイえきとかそせえきはおおきい', config), [
            { w: '高', r: 'たか' },
            { w: '輪', r: 'なわ' },
            { w: 'ゲートウェイ', r: 'げえとうぇい' },
            { w: '駅', r: 'えき' },
            { w: 'と', r: 'と' },
            { w: '風合', r: 'かそ' },
            { w: '瀬', r: 'せ' },
            { w: '駅', r: 'えき' },
            { w: 'は', r: 'は' },
            { w: '大', r: 'おお' },
            { w: 'きい', r: 'きい' },
        ]);

        deepStrictEqual(
            fit('高輪ゲートウェイ駅と風合瀬駅は大きい', 'たかなわゲートウェイえきとかそせえきはおおきい'),
            '高[たか] 輪[なわ]ゲートウェイ 駅[えき]と 風合[かそ] 瀬[せ] 駅[えき]は 大[おお]きい',
        );
    });

    it('passes number tests', () => {
        deepStrictEqual(fit('５０人', 'ごじゅうにん', config), [
            { w: '５０', r: 'ごじゅう' },
            { w: '人', r: 'にん' },
        ]);

        deepStrictEqual(
            fit('５０人', 'ごじゅうにん'),
            '５０[ごじゅう] 人[にん]',
        );

        deepStrictEqual(fit('五十人', 'ごじゅうにん', config), [
            { w: '五', r: 'ご' },
            { w: '十', r: 'じゅう' },
            { w: '人', r: 'にん' },
        ]);

        deepStrictEqual(
            fit('五十人', 'ごじゅうにん', { type: 'string' }),
            '五[ご] 十[じゅう] 人[にん]',
        );

        deepStrictEqual(fit('50人', 'ごじゅうにん', config), [
            { w: '50', r: 'ごじゅう' },
            { w: '人', r: 'にん' },
        ]);

        deepStrictEqual(
            fit('50人', 'ごじゅうにん', { type: 'string' }),
            '50[ごじゅう] 人[にん]',
        );
    });

    it('passes reading text shorter than thw writing', () => {
        deepStrictEqual(
            fit('工場に１０００人がいます', 'こうじょうにせんにんがいます', config),
            [
                { w: '工', r: 'こう' },
                { w: '場', r: 'じょう' },
                { w: 'に', r: 'に' },
                { w: '１０００', r: 'せん' },
                { w: '人', r: 'にん' },
                { w: 'がいます', r: 'がいます' },
            ],
        );

        deepStrictEqual(
            fit('工場に１０００人がいます', 'こうじょうにせんにんがいます', { type: 'string' }),
            '工[こう] 場[じょう]に １０００[せん] 人[にん]がいます',
        );
    });

    it('passes long string tests', () => {
        expect();

        deepStrictEqual(
            fit(
                '田中さんは安足間駅と風合瀬駅と小牛田駅に行ったことがある',
                'たなかさんはあんたろまえきとかそせえきとこごたえきにいったことがある',
                config,
            ),
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
                { w: 'ったことがある', r: 'ったことがある' },
            ],
        );

        deepStrictEqual(
            fit(
                '東江と審と安居院と生明と安栖と馬酔木と東奥と明父と旦来と流井と行町と雷と五百蔵',
                'あがりえとあきらとあぐいとあざみとあずまいとあせびとあちおくとあぢちとあっそとあらいとあるきまちといかづちといおろい',
                config,
            ),
            [
                { w: '東', r: 'あがり' }, { w: '江', r: 'え' },
                { w: 'と', r: 'と' }, { w: '審', r: 'あきら' },
                { w: 'と', r: 'と' }, { w: '安', r: 'あ' },
                { w: '居', r: 'ぐ' }, { w: '院', r: 'い' },
                { w: 'と', r: 'と' }, { w: '生', r: 'あざ' },
                { w: '明', r: 'み' }, { w: 'と', r: 'と' },
                { w: '安', r: 'あ' }, { w: '栖', r: 'ずまい' },
                { w: 'と', r: 'と' }, { w: '馬酔木', r: 'あせび' },
                { w: 'と', r: 'と' }, { w: '東', r: 'あち' },
                { w: '奥', r: 'おく' }, { w: 'と', r: 'と' },
                { w: '明', r: 'あ' }, { w: '父', r: 'ぢち' },
                { w: 'と', r: 'と' }, { w: '旦来', r: 'あっそ' },
                { w: 'と', r: 'と' }, { w: '流', r: 'あら' },
                { w: '井', r: 'い' }, { w: 'と', r: 'と' },
                { w: '行', r: 'あるき' }, { w: '町', r: 'まち' },
                { w: 'と', r: 'と' }, { w: '雷', r: 'いかづち' },
                { w: 'と', r: 'と' }, { w: '五', r: 'い' },
                { w: '百', r: 'お' }, { w: '蔵', r: 'ろい' },
            ],
        );

        deepStrictEqual(
            fit(
                '東江と審と安居院と生明と安栖と馬酔木と東奥と明父と旦来と流井と行町と雷と五百蔵',
                'あがりえとあきらとあぐいとあざみとあずまいとあせびとあちおくとあぢちとあっそとあらいとあるきまちといかづちといおろい',
                { type: 'string' },
            ),
            '東[あがり] 江[え]と 審[あきら]と 安[あ] 居[ぐ] 院[い]と 生[あざ] 明[み]と 安[あ] 栖[ずまい]と 馬酔木[あせび]と 東[あち] 奥[おく]と 明[あ] 父[ぢち]と 旦来[あっそ]と 流[あら] 井[い]と 行[あるき] 町[まち]と 雷[いかづち]と 五[い] 百[お] 蔵[ろい]',
        );
    });

    it('passes long reading tests', () => {
        deepStrictEqual(
            fit(
                '十十です',
                'かきくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこです',
                config,
            ),
            [
                { w: '十', r: 'か' },
                {
                    w: '十',
                    r: 'きくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこかきくけこ',
                },
                { w: 'です', r: 'です' },
            ],
        );
    });

    it('passes iteration mark tests', () => {
        deepStrictEqual(
            fit(
                '人々',
                'ひとびと',
                config,
            ),
            [
                { w: '人', r: 'ひと' },
                { w: '々', r: 'びと' },
            ],
        );

        deepStrictEqual(
            fit(
                '最近の日々の中で',
                'さいきんのひびのなかで',
                config,
            ),
            [
                { w: '最', r: 'さい' },
                { w: '近', r: 'きん' },
                { w: 'の', r: 'の' },
                { w: '日', r: 'ひ' },
                { w: '々', r: 'び' },
                { w: 'の', r: 'の' },
                { w: '中', r: 'なか' },
                { w: 'で', r: 'で' },
            ],
        );
    });

    it('passes punctuation marks at the middle of writings', () => {
        deepStrictEqual(
            fit(
                '月曜日、、、楽しい',
                'げつようびたのしい',
                config,
            ),
            [
                { w: '月', r: 'げつ' },
                { w: '曜', r: 'よう' },
                { w: '日', r: 'び' },
                { w: '、、、', r: '' },
                { w: '楽', r: 'たの' },
                { w: 'しい', r: 'しい' },
            ],
        );

        deepStrictEqual(
            fit(
                '日曜日だ！すごい日だ',
                'にちようびだすごいひだ',
                config,
            ),
            [
                { w: '日', r: 'にち' },
                { w: '曜', r: 'よう' },
                { w: '日', r: 'び' },
                { w: 'だ', r: 'だ' },
                { w: '！', r: '' },
                { w: 'すごい', r: 'すごい' },
                { w: '日', r: 'ひ' },
                { w: 'だ', r: 'だ' },
            ],
        );

        deepStrictEqual(
            fit('田中、待って、忘れないで', 'たなかまってわすれないで', config),
            [
                { w: '田', r: 'た' },
                { w: '中', r: 'なか' },
                { w: '、', r: '' },
                { w: '待', r: 'ま' },
                { w: 'って', r: 'って' },
                { w: '、', r: '' },
                { w: '忘', r: 'わす' },
                { w: 'れないで', r: 'れないで' },
            ],
        );

        deepStrictEqual(
            fit('田、。、田。?.？・田', 'たでんた', config),
            [
                { w: '田', r: 'た' },
                { w: '、。、', r: '' },
                { w: '田', r: 'でん' },
                { w: '。?.？・', r: '' },
                { w: '田', r: 'た' },
            ],
        );
    });

    it('passes various length of unmatched kanji', () => {
        deepStrictEqual(fit('人は', 'あは', config), [{ w: '人', r: 'あ' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人は', 'あいは', config), [{ w: '人', r: 'あい' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人は', 'あいうは', config), [{ w: '人', r: 'あいう' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人は', 'あいうえは', config), [{ w: '人', r: 'あいうえ' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人は', 'あいうえおは', config), [{ w: '人', r: 'あいうえお' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人は', 'あいうえおあは', config), [{ w: '人', r: 'あいうえおあ' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人は', 'あは', config), [{ w: '人人', r: 'あ' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人は', 'あいは', config), [{ w: '人人', r: 'あい' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人は', 'あいうは', config), [{ w: '人人', r: 'あいう' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人は', 'あいうえは', config), [{ w: '人人', r: 'あいうえ' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人は', 'あいうえおは', config), [{ w: '人人', r: 'あいうえお' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人は', 'あいうえおあは', config), [{ w: '人人', r: 'あいうえおあ' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人人は', 'あは', config), [{ w: '人人人', r: 'あ' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人人は', 'あいは', config), [{ w: '人人人', r: 'あい' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人人は', 'あいうは', config), [{ w: '人人人', r: 'あいう' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人人は', 'あいうえは', config), [{ w: '人人人', r: 'あいうえ' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人人は', 'あいうえおは', config), [{ w: '人人人', r: 'あいうえお' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人人人は', 'あいうえおあは', config), [{ w: '人人人', r: 'あいうえおあ' }, { w: 'は', r: 'は' }]);
        deepStrictEqual(fit('人', 'あ', config), [{ w: '人', r: 'あ' }]);
        deepStrictEqual(fit('人', 'あい', config), [{ w: '人', r: 'あい' }]);
        deepStrictEqual(fit('人', 'あいう', config), [{ w: '人', r: 'あいう' }]);
        deepStrictEqual(fit('人', 'あいうえ', config), [{ w: '人', r: 'あいうえ' }]);
        deepStrictEqual(fit('人', 'あいうえお', config), [{ w: '人', r: 'あいうえお' }]);
        deepStrictEqual(fit('人', 'あいうえおあ', config), [{ w: '人', r: 'あいうえおあ' }]);
        deepStrictEqual(fit('人人', 'あ', config), [{ w: '人人', r: 'あ' }]);
        deepStrictEqual(fit('人人', 'あい', config), [{ w: '人人', r: 'あい' }]);
        deepStrictEqual(fit('人人', 'あいう', config), [{ w: '人人', r: 'あいう' }]);
        deepStrictEqual(fit('人人', 'あいうえ', config), [{ w: '人人', r: 'あいうえ' }]);
        deepStrictEqual(fit('人人', 'あいうえお', config), [{ w: '人人', r: 'あいうえお' }]);
        deepStrictEqual(fit('人人', 'あいうえおあ', config), [{ w: '人人', r: 'あいうえおあ' }]);
        deepStrictEqual(fit('人人人', 'あ', config), [{ w: '人人人', r: 'あ' }]);
        deepStrictEqual(fit('人人人', 'あい', config), [{ w: '人人人', r: 'あい' }]);
        deepStrictEqual(fit('人人人', 'あいう', config), [{ w: '人人人', r: 'あいう' }]);
        deepStrictEqual(fit('人人人', 'あいうえ', config), [{ w: '人人人', r: 'あいうえ' }]);
        deepStrictEqual(fit('人人人', 'あいうえお', config), [{ w: '人人人', r: 'あいうえお' }]);
        deepStrictEqual(fit('人人人', 'あいうえおあ', config), [{ w: '人人人', r: 'あいうえおあ' }]);
    });

    it('passes some examples from JMdict', () => {
        deepStrictEqual(
            fit('ＡＢＣ順', 'エービーシーじゅん', config),
            [{ w: 'ＡＢＣ', r: 'エービーシー' }, { w: '順', r: 'じゅん' }],
        );
        deepStrictEqual(
            fit('ＣＤプレイヤー', 'シーディープレイヤー', config),
            [{ w: 'ＣＤ', r: 'シーディー' }, { w: 'プレイヤー', r: 'ぷれいやあ' }],
        );

        deepStrictEqual(
            fit('いすゞ', 'いすず', config),
            [{ w: 'いす', r: 'いす' }, { w: 'ゞ', r: 'ず' }],
        );

        deepStrictEqual(
            fit('いすゞ自動車', 'いすずじどうしゃ', config),
            [
                { w: 'いす', r: 'いす' },
                { w: 'ゞ', r: 'ず' },
                { w: '自', r: 'じ' },
                { w: '動', r: 'どう' },
                { w: '車', r: 'しゃ' },
            ],
        );

        deepStrictEqual(fit('漢数字ゼロ', 'かんすうじゼロ', config), [
            { w: '漢', r: 'かん' },
            { w: '数', r: 'すう' },
            { w: '字', r: 'じ' },
            { w: 'ゼロ', r: 'ぜろ' },
        ]);
        deepStrictEqual(fit('虚々実々', 'きょきょじつじつ', config), [
            { w: '虚', r: 'きょ' },
            { w: '々', r: 'きょ' },
            { w: '実', r: 'じつ' },
            { w: '々', r: 'じつ' },
        ]);
        deepStrictEqual(fit('一昨々日', 'いっさくさくじつ', config), [
            { w: '一', r: 'いっ' },
            { w: '昨', r: 'さく' },
            { w: '々', r: 'さく' },
            { w: '日', r: 'じつ' },
        ]);
        deepStrictEqual(fit('一昨々日', 'さきおとつい', config), [{ w: '一昨々日', r: 'さきおとつい' }]);
        deepStrictEqual(fit('胴具足山', 'どうぐそくやま', config), [
            { w: '胴', r: 'どう' },
            { w: '具', r: 'ぐ' },
            { w: '足', r: 'そく' },
            { w: '山', r: 'やま' },
        ]);
        deepStrictEqual(fit('上篭上', 'あげろうかみ', config), [{ w: '上', r: 'あげ' }, { w: '篭', r: 'ろう' }, { w: '上', r: 'かみ' }]);
        deepStrictEqual(fit('胴技切戸', 'どうぬけきれっと', config), [{ w: '胴', r: 'どう' }, { w: '技切', r: 'ぬけきれっ' }, { w: '戸', r: 'と' }]);
        deepStrictEqual(fit('瞳智恵紀', 'ひとみちえき', config), [
            { w: '瞳', r: 'ひとみ' },
            { w: '智', r: 'ち' },
            { w: '恵', r: 'え' },
            { w: '紀', r: 'き' },
        ]);
        deepStrictEqual(fit('出来田', 'いずきた', config), [{ w: '出', r: 'いず' }, { w: '来', r: 'き' }, { w: '田', r: 'た' }]);
        deepStrictEqual(fit('亜米利加', 'あめりか', config), [
            { w: '亜', r: 'あ' },
            { w: '米', r: 'め' },
            { w: '利', r: 'り' },
            { w: '加', r: 'か' },
        ]);
        deepStrictEqual(fit('那賀郡那賀川町', 'なかぐんなかがわちょう', config), [
            { w: '那', r: 'な' },
            { w: '賀', r: 'か' },
            { w: '郡', r: 'ぐん' },
            { w: '那', r: 'な' },
            { w: '賀', r: 'か' },
            { w: '川', r: 'がわ' },
            { w: '町', r: 'ちょう' },
        ]);
    });

    it('passes some other tests', () => {
        deepStrictEqual(
            fit('勿来駅に', 'なこそえきに', config),
            [{ w: '勿来', r: 'なこそ' }, { w: '駅', r: 'えき' }, { w: 'に', r: 'に' }],
        );

        deepStrictEqual(
            fit('上上上上上上', 'かみらりるれろうえじょうばびぶべぼあ', config),
            [
                { w: '上', r: 'かみ' },
                { w: '上', r: 'らりるれろ' },
                { w: '上', r: 'うえ' },
                { w: '上', r: 'じょう' },
                { w: '上', r: 'ばびぶべぼ' },
                { w: '上', r: 'あ' },
            ],
        );
    });

    // Known issues
    // console.log(fit('今日50,000人がいます', 'きょうごじゅうまんにんがいます', config));
    // console.log(fit('Ｗ', 'ウェブ', config));
    // console.log(fit('上上上上上', 'かみあいうえおじょうばびぶべぼあがり', config));
});
