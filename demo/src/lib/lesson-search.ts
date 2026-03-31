import type { Lesson } from './lessons'

export interface LessonSearchEntry extends Lesson {
  content: string
}

export interface LessonSearchResult extends Lesson {
  matchType: 'title' | 'subtitle' | 'tag' | 'content'
  matchedText: string
}

export interface HighlightPart {
  text: string
  highlighted: boolean
}

function buildContentExcerpt(content: string, query: string): string {
  const normalizedContent = content.replace(/\s+/g, ' ').trim()
  const lowerContent = normalizedContent.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const matchIndex = lowerContent.indexOf(lowerQuery)

  if (matchIndex === -1) {
    return normalizedContent.slice(0, 120)
  }

  const excerptStart = Math.max(0, matchIndex - 36)
  const excerptEnd = Math.min(
    normalizedContent.length,
    matchIndex + query.length + 48
  )
  const prefix = excerptStart > 0 ? '...' : ''
  const suffix = excerptEnd < normalizedContent.length ? '...' : ''

  return `${prefix}${normalizedContent.slice(excerptStart, excerptEnd)}${suffix}`
}

export function getHighlightParts(
  text: string,
  query: string
): HighlightPart[] {
  const normalizedQuery = query.trim()

  if (!text || !normalizedQuery) {
    return [{ text, highlighted: false }]
  }

  const lowerText = text.toLowerCase()
  const lowerQuery = normalizedQuery.toLowerCase()
  const parts: HighlightPart[] = []
  let startIndex = 0

  while (startIndex < text.length) {
    const matchIndex = lowerText.indexOf(lowerQuery, startIndex)

    if (matchIndex === -1) {
      const remainingText = text.slice(startIndex)
      if (remainingText) {
        parts.push({ text: remainingText, highlighted: false })
      }
      break
    }

    if (matchIndex > startIndex) {
      parts.push({
        text: text.slice(startIndex, matchIndex),
        highlighted: false,
      })
    }

    parts.push({
      text: text.slice(matchIndex, matchIndex + normalizedQuery.length),
      highlighted: true,
    })

    startIndex = matchIndex + normalizedQuery.length
  }

  return parts
}

export function searchLessons(
  query: string,
  entries: LessonSearchEntry[]
): LessonSearchResult[] {
  if (!query.trim()) {
    return []
  }

  const lowerQuery = query.toLowerCase()
  const results: LessonSearchResult[] = []

  for (const lesson of entries) {
    if (lesson.title.toLowerCase().includes(lowerQuery)) {
      results.push({ ...lesson, matchType: 'title', matchedText: lesson.title })
      continue
    }

    if (lesson.subtitle.toLowerCase().includes(lowerQuery)) {
      results.push({
        ...lesson,
        matchType: 'subtitle',
        matchedText: lesson.subtitle,
      })
      continue
    }

    const matchedTag = lesson.tags.find((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    )
    if (matchedTag) {
      results.push({ ...lesson, matchType: 'tag', matchedText: matchedTag })
      continue
    }

    if (lesson.content.toLowerCase().includes(lowerQuery)) {
      results.push({
        ...lesson,
        matchType: 'content',
        matchedText: buildContentExcerpt(lesson.content, query),
      })
    }
  }

  return results
}
