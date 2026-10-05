import type { MarkdownInstance } from 'astro'

interface NoteFrontmatter {
  title: string
  date: string | Date
  summary: string
  dateSource?: 'git-first-record'
}

const modules = import.meta.glob<MarkdownInstance<NoteFrontmatter>>(
  '../content/note/*.md',
  { eager: true },
)

export const notes = Object.entries(modules)
  .map(([path, post]) => {
    const { title, summary, date: rawDate, dateSource } = post.frontmatter
    const date = rawDate instanceof Date ? rawDate.toISOString() : rawDate
    if (!title?.trim() || !summary?.trim() || !date || !Number.isFinite(Date.parse(date))) {
      throw new Error(`${path}: title, date, summary are required`)
    }
    const slug = path.split('/').at(-1)!.replace(/\.md$/, '')
    return { slug, title, summary, date, dateSource, post }
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
