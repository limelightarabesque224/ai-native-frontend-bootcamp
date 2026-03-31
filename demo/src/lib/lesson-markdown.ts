import { Children, type ReactNode, isValidElement } from 'react'

export interface TocItem {
  id: string
  text: string
  level: number
}

function normalizeHeadingText(text: string): string {
  return text.replace(/[`*_~]/g, '').trim()
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }

  if (Array.isArray(node)) {
    return node.map((child) => extractTextContent(child)).join('')
  }

  if (isValidElement(node)) {
    const children = (node.props as { children?: ReactNode }).children
    return extractTextContent(Children.toArray(children))
  }

  return ''
}

export function buildProcessedLessonContent(content: string): string {
  return content
    .replace(/^#\s+.+\n/, '')
    .replace(/^##\s+最终版演讲稿.+\n/, '')
    .replace(/^\*\*演讲时长\*\*:.+\n/m, '')
    .replace(/^\*\*风格\*\*:.+\n/m, '')
    .replace(/^>\s+.+\n/m, '')
    .trim()
}

export function generateToc(content: string): TocItem[] {
  const toc: TocItem[] = []
  const slugCounts = new Map<string, number>()
  const lines = content.split(/\r?\n/)
  let activeFence: { marker: '`' | '~'; length: number } | null = null

  for (const line of lines) {
    const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})/)
    if (fenceMatch) {
      const marker = fenceMatch[2][0] as '`' | '~'
      const length = fenceMatch[2].length

      if (!activeFence) {
        activeFence = { marker, length }
        continue
      }

      if (activeFence.marker === marker && length >= activeFence.length) {
        activeFence = null
        continue
      }
    }

    if (activeFence) {
      continue
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (!headingMatch) {
      continue
    }

    const level = headingMatch[1].length
    const text = normalizeHeadingText(headingMatch[2])

    if (level <= 3) {
      const baseId = slugifyHeading(text)
      const currentCount = slugCounts.get(baseId) ?? 0
      const nextCount = currentCount + 1

      slugCounts.set(baseId, nextCount)

      toc.push({
        id: nextCount === 1 ? baseId : `${baseId}-${nextCount}`,
        text,
        level,
      })
    }
  }

  return toc
}
