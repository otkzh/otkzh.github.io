import type { MarkdownInstance } from 'astro'

interface NoteFrontmatter {
  title: string
  date: string | Date
  summary: string
  tags: string[]
  dateSource?: 'git-first-record'
}

const modules = import.meta.glob<MarkdownInstance<NoteFrontmatter>>(
  '../content/fragments/*.md',
  { eager: true },
)

export const FRAGMENTS_PAGE_SIZE = 10

export const notes = Object.entries(modules)
  .map(([path, post]) => {
    const { title, summary, date: rawDate, dateSource, tags } = post.frontmatter
    const date = rawDate instanceof Date ? rawDate.toISOString() : rawDate
    if (!title?.trim() || !summary?.trim() || !date || !Number.isFinite(Date.parse(date))) {
      throw new Error(`${path}: title, date, summary are required`)
    }
    if (!Array.isArray(tags) || tags.length === 0 || tags.some(tag => typeof tag !== 'string' || !tag.trim())) {
      throw new Error(`${path}: at least one non-empty tag is required`)
    }
    const slug = path.split('/').at(-1)!.replace(/\.md$/, '')
    return { slug, title, summary, date, dateSource, tags: [...new Set(tags.map(tag => tag.trim()))], post }
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

export const fragmentTags = [...new Set(notes.flatMap(note => note.tags))].sort((a, b) => a.localeCompare(b, 'ja'))
export const tagHref = (tag: string) => `/fragments/tag/${encodeURIComponent(tag)}/`
