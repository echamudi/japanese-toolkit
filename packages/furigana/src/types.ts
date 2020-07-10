export interface Match {
    /**
     * Writing
     */
    w: string,

    /**
     * Reading
     */
    r: string,
}

export interface MatchDetailed extends Match {
    /**
     * 1 - matches according to kanjilib
     * 0 - doesn't match according to kanjilib
     */
    match: 0 | 1,

    /**
     * true writing contains kanji only
     * false writing contains writing only
     */
    isKanji: boolean,

    /**
     * return source (for debugging purpose)
     */
    returnId?: number
}

export interface FitConfig {
    type?: 'object' | 'string'
}
