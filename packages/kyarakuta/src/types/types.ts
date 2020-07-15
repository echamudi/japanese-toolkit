/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export interface SubBlocksLibraryInterface {
    readonly subblocks: Record<number, string>;
    readonly codePoints: Record<number, number>;
}

export interface BlockRange {
    readonly block: string,
    readonly start: number,
    readonly end: number
}

/**
 * [start, end]
 */
export type RangeTuple = [number, number];
export type Ranges = RangeTuple[];

export interface BlockCondition {
    block?: string | undefined,
    subblock?: string | undefined
}
