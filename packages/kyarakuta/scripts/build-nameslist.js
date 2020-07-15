// @ts-check

const fs = require('fs');

const namesListRaw = fs.readFileSync(
    `${__dirname}/../raw-data/NamesList.txt`, {
        encoding: 'utf-8',
    },
).toString().split('\n');

/** @type {Map<string, number>} */
const block2id = new Map();

/** @type {import('./../src/types/types').SubBlocksLibraryInterface} */
const SubBlocksLibrary = {
    subblocks: {},
    codePoints: {},
};

/** @type {import('./../src/types/types').BlockRange[]} */
const BlockRangesList = [];

/** @type {Record<string, import('./../src/types/types').BlockStat>} */
const BlockStats = {};

let currentBlock = '';
let currentSubBlock = '';
let currentId = 0;

for (let i = 0; i < namesListRaw.length; i += 1) {
    const matchBlock = namesListRaw[i].match(/^@@\t(.*?)\t(.*?)\t(.*?)$/);
    const matchSubBlock = namesListRaw[i].match(/^@\t\t(.*?)$/);
    const matchLetter = namesListRaw[i].match(/^([0-9a-fA-F]+)\t(.*?)$/);

    if (matchBlock) {
        currentBlock = matchBlock[2];

        BlockRangesList.push({
            block: currentBlock,
            start: parseInt(matchBlock[1], 16),
            end: parseInt(matchBlock[3], 16),
        });
    }

    if (matchSubBlock) {
        currentSubBlock = matchSubBlock[1];
        const name = currentSubBlock;

        if (!Object.values(SubBlocksLibrary.subblocks).some((el) => el === name)) {
            currentId += 1;
            SubBlocksLibrary.subblocks[currentId] = name;
            block2id.set(name, currentId);
        }
    }

    if (matchLetter) {
        const name = currentSubBlock;
        const letterId = parseInt(matchLetter[1], 16);

        if (block2id.get(name) === undefined) throw new Error(`Can't find name ${name}`);
        const nameId = block2id.get(name);

        SubBlocksLibrary.codePoints[letterId] = nameId;
    }
}

BlockRangesList.forEach((br) => {
    const name = br.block.toLowerCase();

    /** @type {import('./../src/types/types').BlockStat} */
    const stats = {
        bl: 1,
    };
    if (name.includes('letter')) stats.ltr = 1;
    if (name.includes('digit')) stats.dig = 1;
    if (name.includes('number') || name.includes('numeral') || name.includes('numeric')) stats.num = 1;

    if (name.includes('symbol')) stats.sym = 1;
    if (name.includes('punctuation')) stats.pun = 1;
    if (name.includes('mark')) stats.mrk = 1;
    if (name.includes('bracket')) stats.bra = 1;
    if (name.includes('annotation')) stats.ann = 1;
    if (name.includes('stroke')) stats.str = 1;

    if (name.includes('vowel')) stats.vow = 1;
    if (name.includes('consonant')) stats.con = 1;

    if (name.includes('sign')) stats.sig = 1;
    if (name.includes('syllable')) stats.syl = 1;

    stats.range = [br.start, br.end];
    BlockStats[name] = stats;
});

Object.values(SubBlocksLibrary.subblocks).forEach((sb) => {
    const name = sb.toLowerCase();

    /** @type {import('./../src/types/types').BlockStat} */
    const stats = {
        sb: 1,
    };

    // If it already exists, it means it is a block, generated from the previous looper.
    if (BlockStats[sb]) stats.bl = 1;

    if (name.includes('letter')) stats.ltr = 1;
    if (name.includes('digit')) stats.dig = 1;
    if (name.includes('number') || name.includes('numeral') || name.includes('numeric')) stats.num = 1;

    if (name.includes('symbol')) stats.sym = 1;
    if (name.includes('punctuation')) stats.pun = 1;
    if (name.includes('mark')) stats.mrk = 1;
    if (name.includes('bracket')) stats.bra = 1;
    if (name.includes('annotation')) stats.ann = 1;
    if (name.includes('stroke')) stats.str = 1;

    if (name.includes('vowel')) stats.vow = 1;
    if (name.includes('consonant')) stats.con = 1;

    if (name.includes('sign')) stats.sig = 1;
    if (name.includes('syllable')) stats.syl = 1;

    if (Object.keys(stats).length > 0) BlockStats[name] = stats;
});

const script = `
// Generated code, don't edit this file.

import { SubBlocksLibraryInterface, BlockRange, RangeTuple, BlockStat } from '../types/types';

export const SubBlocksLibrary: SubBlocksLibraryInterface = JSON.parse(\`
${JSON.stringify(SubBlocksLibrary)}
\`);

export const BlockRangesList: BlockRange[] = JSON.parse(\`
${JSON.stringify(BlockRangesList)}
\`);

export const BlockStats: Record<string, BlockStat> = JSON.parse(\`
${JSON.stringify(BlockStats)}
\`);

`;

fs.mkdirSync(`${__dirname}/../src/gen`, { recursive: true });
fs.writeFileSync(`${__dirname}/../raw-data/SubBlocksLibrary.json`, JSON.stringify(SubBlocksLibrary, null, 2));
fs.writeFileSync(`${__dirname}/../raw-data/BlockRangesList.json`, JSON.stringify(BlockRangesList, null, 2));
fs.writeFileSync(`${__dirname}/../raw-data/BlockStats.json`, JSON.stringify(BlockStats, null, 2));
fs.writeFileSync(`${__dirname}/../src/gen/blocks-library.ts`, script);
