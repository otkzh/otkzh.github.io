import type { MarkdownInstance } from 'astro'

interface NoteFrontmatter {
  title: string
  date: string | Date
  summary: string
  tags: string[]
  dateSource?: 'git-first-record'
  /** 本文は本人が書き、要約だけAIで付けた記事 */
  summarySource?: 'ai'
}

/** 本人が書いた記事のタグ */
export const HUMAN_TAG = 'Human'
/** AIで生成した文章の記事のタグ */
export const AI_TAG = 'AI'
const PROVENANCE_TAGS = [HUMAN_TAG, AI_TAG]
export const isProvenanceTag = (tag: string) => PROVENANCE_TAGS.includes(tag)

const modules = import.meta.glob<MarkdownInstance<NoteFrontmatter>>(
  '../content/fragments/*.md',
  { eager: true },
)

export const FRAGMENTS_PAGE_SIZE = 10

export const notes = Object.entries(modules)
  .map(([path, post]) => {
    const { title, summary, date: rawDate, dateSource, summarySource, tags } = post.frontmatter
    const date = rawDate instanceof Date ? rawDate.toISOString() : rawDate
    if (!title?.trim() || !summary?.trim() || !date || !Number.isFinite(Date.parse(date))) {
      throw new Error(`${path}: title, date, summary are required`)
    }
    if (!Array.isArray(tags) || tags.length === 0 || tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
      throw new Error(`${path}: at least one non-empty tag is required`)
    }
    const uniqueTags = [...new Set(tags.map(tag => tag.trim()))]
    const provenance = uniqueTags.filter(isProvenanceTag)
    if (provenance.length !== 1) {
      throw new Error(`${path}: tags must include exactly one of ${PROVENANCE_TAGS.join(' / ')}`)
    }
    const slug = path.split('/').at(-1)!.replace(/\.md$/, '')
    // Humanは先頭に置いて目に留まりやすく、AIは末尾に控えめに置く
    const isHuman = provenance[0] === HUMAN_TAG
    const topicTags = uniqueTags.filter(tag => !isProvenanceTag(tag))
    const orderedTags = isHuman ? [...provenance, ...topicTags] : [...topicTags, ...provenance]
    return { slug, title, summary, date, dateSource, summarySource, isHuman, tags: orderedTags, post }
  })
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.slug.localeCompare(b.slug))

export function formatNoteDate(date: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(date.includes('T') ? { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' as const } : {}),
  }).format(new Date(date))
}

export const fragmentTags = [
  ...PROVENANCE_TAGS,
  ...[...new Set(notes.flatMap(note => note.tags))].filter(tag => !isProvenanceTag(tag)).sort((a, b) => a.localeCompare(b, 'ja')),
]

export const tagClass = (tag: string) =>
  tag === HUMAN_TAG ? 'tag-human' : tag === AI_TAG ? 'tag-ai' : undefined
export const tagHref = (tag: string) => `/fragments/tag/${encodeURIComponent(tag)}/`
