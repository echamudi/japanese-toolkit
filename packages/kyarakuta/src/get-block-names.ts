/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { SubBlocksLibrary, BlockRangesList } from './gen/blocks-library';
import { BlockRange } from './types/types';

export default function getBlockNames(string: string): Array<{
        char: string,
        block: string | undefined,
        subblock: string | undefined
    }> {
    const charArray = [...string];
    const result: ReturnType<typeof getBlockNames> = [];

    const blockRangesMemo: BlockRange[] = [];

    charArray.forEach((char) => {
        const codePoint = char.codePointAt(0);
        if (codePoint === undefined) throw new Error('Hmm, please open an issue in the github repo.');

        let block: string | undefined;

        // Get block name from memo
        for (let i = 0; i < blockRangesMemo.length; i += 1) {
            if (blockRangesMemo[i].start <= codePoint && codePoint <= blockRangesMemo[i].end) {
                block = blockRangesMemo[i].block;
                break;
            }
        }

        // If it's not memoized yet, get block name from the full list
        if (block === undefined) {
            for (let i = 0; i < BlockRangesList.length; i += 1) {
                if (BlockRangesList[i].start <= codePoint && codePoint <= BlockRangesList[i].end) {
                    block = BlockRangesList[i].block;
                    blockRangesMemo.push(BlockRangesList[i]);
                    break;
                }
            }
        }

        // Get subblock name
        const blockId = SubBlocksLibrary.codePoints[codePoint];
        const subblock = SubBlocksLibrary.subblocks[blockId];

        result.push({ char, block, subblock });
    });

    return result;
}
