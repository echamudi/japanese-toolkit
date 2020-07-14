import * as JMdict from './jmdict';
import * as JMnedict from './jmnedict';

interface NameValuePair {
  name: string,
  value: string
}

interface KanjiArrayPair {
  kanji: string,
  array: string[]
}

interface KanjivgTree {
  element?: string,
  g?: KanjivgTree[]
}

/**
 * Definitions for each row in the exported database
 */
export interface DictIndexRow {
  source: number,
  id: number,
  kanji: string | null,
  reading: string,
  pri_point: number | null,
  meaning: string
}

export interface JMdictEntitiesRow extends NameValuePair { }

export interface JMdictJsonsRow {
  ent_seq: number,
  json: JMdict.entry
}

export interface JMnedictEntitiesRow extends NameValuePair { }

export interface JMnedictJsonsRow {
  ent_seq: number,
  json: JMnedict.entry
}

export interface KanjiGroupsRow {
  kanji: string,
  kanken: number,
  jlptNew: 5|4|3|2|1|null
}

export interface KanjidicRow {
  sort: number,
  literal: string,
  jis208: string | null,
  jis212: string | null,
  jis213: string | null,
  ucs: string | null,
  rad_classical: number | null,
  rad_nelson_c: number | null,
  grade: number | null,
  stroke_count: number | null,
  variant: { [key: string]: string }[] | null,
  freq: number | null,
  rad_name: string | null,
  jlpt: number | null,
  dic_number: { [key: string]: string }[] | null,
  query_code: { [key: string]: string }[] | null,
  reading: { [key: string]: string }[] | null,
  meaning: string[] | null,
  nanori: string[] | null
}

export interface KanjivgTreeRow {
  kanji: number,
  tree_json: KanjivgTree
}

export interface MetadataRow {
  key: number,
  value: string
}

export interface MetadataRow {
  key: number,
  value: string
}

export interface RelatedAntonymsRow extends KanjiArrayPair { }
export interface RelatedLookalikesRow extends KanjiArrayPair { }
export interface RelatedSynonyms extends KanjiArrayPair { }
export interface RelatedVariants extends KanjiArrayPair { }

export interface WanikaniAudioRow {
  kanji: string,
  reading: string
}
