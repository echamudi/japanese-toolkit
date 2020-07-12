/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { CJKranges } from './ranges';

export default function isCJK(string: string): boolean {
    const cpArray: Readonly<number[]> = [...string].map((char) => {
        const cp = char.codePointAt(0);
        if (cp === undefined) throw new Error();
        return cp;
    });

    return cpArray.every((cp) => {
        return CJKranges.some((range) => range[0] <= cp && cp <= range[1]);
    });
}
