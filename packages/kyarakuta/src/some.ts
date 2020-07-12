/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import getBlockNames from "./get-block-names";
import { BlockCondition } from "./types/types";

export default function some(string: string, conditions: BlockCondition[]): boolean {
    if (string.length === 0) return true;
    if (conditions.length === 0) return true;

    const stringBlocks = getBlockNames(string);

    const result = stringBlocks.some((stringBlock) =>
        conditions.some((condition) => {
            if (condition.block !== undefined && condition.block !== stringBlock.block)
                return false;
            if (condition.subblock !== undefined && condition.subblock !== stringBlock.subblock)
                return false;
            return true;
        })
    );

    return result;
};
