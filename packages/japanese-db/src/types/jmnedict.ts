/* Copyright (c) 2020 Ezzat Chamudi
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/* eslint-disable camelcase */

// JMdict and JMnedict descriptions are taken from:
// https://www.edrdg.org/jmdict/edict_doc.html
// https://www.edrdg.org/enamdict/enamdict_doc.html
// Copyright (C) 2017 The Electronic Dictionary Research and Development Group.

import * as JMdict from './jmdict';

export interface JMnedict {
  JMnedict: [
    {
      /**
       * Array of entry
       *
       * Entries consist of kanji elements, reading elements
       * name translation elements. Each entry must have at
       * least one reading element and one sense element. Others are optional.
       */
      entry: entry[]
    }
  ]
}

/**
 * Entries consist of kanji elements, reading elements
 * name translation elements. Each entry must have at
 * least one reading element and one sense element. Others are optional.
 */
export interface entry {
  /**
   * A unique numeric sequence number for each entry
   */
  ent_seq: [number];

  /**
   * Array of k_ele
   *
   * The kanji element, or in its absence, the reading element, is
   * the defining component of each entry.
   * The overwhelming majority of entries will have a single kanji
   * element associated with an entity name in Japanese. Where there are
   * multiple kanji elements within an entry, they will be orthographical
   * variants of the same word, either using variations in okurigana, or
   * alternative and equivalent kanji. Common "mis-spellings" may be
   * included, provided they are associated with appropriate information
   * fields. Synonyms are not included; they may be indicated in the
   * cross-reference field associated with the sense element.
   */
  k_ele?: k_ele[];

  /**
   * Array of r_ele
   *
   * The reading element typically contains the valid readings
   * of the word(s) in the kanji element using modern kanadzukai.
   * Where there are multiple reading elements, they will typically be
   * alternative readings of the kanji element. In the absence of a
   * kanji element, i.e. in the case of a word or phrase written
   * entirely in kana, these elements will define the entry.
   */
  r_ele: r_ele[];

  /**
   * Array of trans
   *
   * The trans element will record the translational equivalent
   * of the Japanese name, plus other related information.
   */
  trans: trans[];
}

/**
 * The kanji element, or in its absence, the reading element, is
 * the defining component of each entry.
 * The overwhelming majority of entries will have a single kanji
 * element associated with an entity name in Japanese. Where there are
 * multiple kanji elements within an entry, they will be orthographical
 * variants of the same word, either using variations in okurigana, or
 * alternative and equivalent kanji. Common "mis-spellings" may be
 * included, provided they are associated with appropriate information
 * fields. Synonyms are not included; they may be indicated in the
 * cross-reference field associated with the sense element.
 */
export interface k_ele extends JMdict.k_ele {
  /**
   * This element will contain a word or short phrase in Japanese
   * which is written using at least one non-kana character (usually kanji,
   * but can be other characters). The valid characters are
   * kanji, kana, related characters such as chouon and kurikaeshi, and
   * in exceptional cases, letters from other alphabets.
   */
  keb: [string],

  /**
   * This is a coded information field related specifically to the
   * orthography of the keb, and will typically indicate some unusual
   * aspect, such as okurigana irregularity.
   */
  // Doesn't exist in the entries
  // ke_inf?: string[],

  /**
   * This and the equivalent re_pri field are provided to record
   * information about the relative priority of the entry,  and consist
   * of codes indicating the word appears in various references which
   * can be taken as an indication of the frequency with which the word
   * is used. This field is intended for use either by applications which
   * want to concentrate on entries of  a particular priority, or to
   * generate subset files.
   * The current values in this field are:
   * - news1/2: appears in the "wordfreq" file compiled by Alexandre Girardi
   * from the Mainichi Shimbun. (See the Monash ftp archive for a copy.)
   * Words in the first 12,000 in that file are marked "news1" and words
   * in the second 12,000 are marked "news2".
   * - ichi1/2: appears in the "Ichimango goi bunruishuu", Senmon Kyouiku
   * Publishing, Tokyo, 1998.  (The entries marked "ichi2" were
   * demoted from ichi1 because they were observed to have low
   * frequencies in the WWW and newspapers.)
   * - spec1 and spec2: a small number of words use this marker when they
   * are detected as being common, but are not included in other lists.
   * - gai1/2: common loanwords, based on the wordfreq file.
   * - nfxx: this is an indicator of frequency-of-use ranking in the
   * wordfreq file. "xx" is the number of the set of 500 words in which
   * the entry can be found, with "01" assigned to the first 500, "02"
   * to the second, and so on. (The entries with news1, ichi1, spec1, spec2
   * and gai1 values are marked with a "(P)" in the EDICT and EDICT2
   * files.)
   *
   * The reason both the kanji and reading elements are tagged is because
   * on occasions a priority is only associated with a particular
   * kanji/reading pair.
   */
  // Doesn't exist in the entries
  // ke_pri?: string[]
}

/**
 * The reading element typically contains the valid readings
 * of the word(s) in the kanji element using modern kanadzukai.
 * Where there are multiple reading elements, they will typically be
 * alternative readings of the kanji element. In the absence of a
 * kanji element, i.e. in the case of a word or phrase written
 * entirely in kana, these elements will define the entry.
 */
export interface r_ele {
  /**
   * this element content is restricted to kana and related
   * characters such as chouon and kurikaeshi. Kana usage will be
   * consistent between the keb and reb elements; e.g. if the keb
   * contains katakana, so too will the reb.
   */
  reb: [string],

  /**
   * This element is used to indicate when the reading only applies
   * to a subset of the keb elements in the entry. In its absence, all
   * readings apply to all kanji elements. The contents of this element
   * must exactly match those of one of the keb elements.
   */
  // Doesn't exist in the entries
  // re_restr?: string[],

  /**
   * General coded information pertaining to the specific reading.
   * Typically it will be used to indicate some unusual aspect of
   * the reading.
   */
  // Doesn't exist in the entries
  // re_inf?: string[],

  /**
   * (Note from JMdict docs: See the comment on ke_pri above.)
   *
   * This and the equivalent re_pri field are provided to record
   * information about the relative priority of the entry,  and consist
   * of codes indicating the word appears in various references which
   * can be taken as an indication of the frequency with which the word
   * is used. This field is intended for use either by applications which
   * want to concentrate on entries of  a particular priority, or to
   * generate subset files.
   * The current values in this field are:
   * - news1/2: appears in the "wordfreq" file compiled by Alexandre Girardi
   * from the Mainichi Shimbun. (See the Monash ftp archive for a copy.)
   * Words in the first 12,000 in that file are marked "news1" and words
   * in the second 12,000 are marked "news2".
   * - ichi1/2: appears in the "Ichimango goi bunruishuu", Senmon Kyouiku
   * Publishing, Tokyo, 1998.  (The entries marked "ichi2" were
   * demoted from ichi1 because they were observed to have low
   * frequencies in the WWW and newspapers.)
   * - spec1 and spec2: a small number of words use this marker when they
   * are detected as being common, but are not included in other lists.
   * - gai1/2: common loanwords, based on the wordfreq file.
   * - nfxx: this is an indicator of frequency-of-use ranking in the
   * wordfreq file. "xx" is the number of the set of 500 words in which
   * the entry can be found, with "01" assigned to the first 500, "02"
   * to the second, and so on. (The entries with news1, ichi1, spec1, spec2
   * and gai1 values are marked with a "(P)" in the EDICT and EDICT2
   * files.)
   *
   * The reason both the kanji and reading elements are tagged is because
   * on occasions a priority is only associated with a particular
   * kanji/reading pair.
   */
  // Doesn't exist in the entries
  // re_pri: string[]
}

/**
 * The trans element will record the translational equivalent
 * of the Japanese name, plus other related information.
 */
export interface trans {

  /**
   * The type of name, recorded in the appropriate entity codes.
   */
  name_type?: string[],

  /**
   * This element is used to indicate a cross-reference to another
   * entry with a similar or related meaning or sense. The content of
   * this element is typically a keb or reb element in another entry. In some
   * cases a keb will be followed by a reb and/or a sense number to provide
   * a precise target for the cross-reference. Where this happens, a JIS
   * "centre-dot" (0x2126) is placed between the components of the
   * cross-reference.
   */
  xref?: string[],

  /**
   * The actual translations of the name, usually as a transcription
   * into the target language.
   */
  trans_det?: string[]
}