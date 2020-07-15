const fs = require('fs');

const namesListRaw = fs.readFileSync(
    `${__dirname}/../raw-data/NamesList.txt`, {
        encoding: 'utf-8',
    },
).toString().split('\n');

/** @type {Map<{name: string, subname: string}, number>} */
const block2id = new Map();

/** @type {import('./../src/types/types').SubBlocksLibraryInterface} */
const SubBlocksLibrary = {
    subblocks: {},
    codePoints: {},
};

/** @type {import('./../src/types/types').BlockRange[]} */
const BlockRangesList = [];

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

let script = `
// Generated code, don't edit this file.

import { SubBlocksLibraryInterface, BlockRange, RangeTuple } from '../types/types';

export const SubBlocksLibrary: SubBlocksLibraryInterface = JSON.parse(\`
${JSON.stringify(SubBlocksLibrary)}
\`);

export const BlockRangesList: BlockRange[] = JSON.parse(\`
${JSON.stringify(BlockRangesList)}
\`);

`;

BlockRangesList.forEach((blockRange) => {
    if (blockRange.block !== 'Unassigned') {
        script += `export const BlockRange__${blockRange.block.replace(/\((.*?)\)/g, '').trim().replace(/ |-/g, '_')}: RangeTuple = [${blockRange.start}, ${blockRange.end}];
`;
    }
});

fs.mkdirSync(`${__dirname}/../src/gen`, { recursive: true });
fs.writeFileSync(`${__dirname}/../raw-data/SubBlocksLibrary.json`, JSON.stringify(SubBlocksLibrary, null, 2));
fs.writeFileSync(`${__dirname}/../raw-data/BlockRangesList.json`, JSON.stringify(BlockRangesList, null, 2));
fs.writeFileSync(`${__dirname}/../src/gen/blocks-library.ts`, script);
