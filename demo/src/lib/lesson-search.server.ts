import fs from 'node:fs'
import path from 'node:path'
// @ts-expect-error Node test runner requires the explicit .ts extension for local ESM imports.
import { buildProcessedLessonContent } from './lesson-markdown.ts'
// @ts-expect-error Node test runner requires the explicit .ts extension for local ESM imports.
import { lessons } from './lessons.ts'
import type { LessonSearchEntry } from './lesson-search'

const lessonDirMap: Record<string, string> = {
  'lesson-0': '第0课-认知重构',
  'lesson-1': '第1课-Tailwind-CSS-v4',
  'lesson-2': '第2课-shadcn-ui',
  'lesson-3': '第3课-Radix-UI',
  'lesson-4': '第4课-Design-to-Code-上',
  'lesson-5': '第5课-Design-to-Code-下',
  'lesson-6': '第6课-Monorepo',
  'lesson-7': '第7课-MCP-Tools',
  'lesson-8': '第8课-AI编程工具',
  'lesson-9': '第9课-Vercel-AI-SDK',
  'lesson-10': '第10课-工程化与全栈化',
  'lesson-11': '第11课-全链路整合',
}

function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/[*_~]/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function readLessonContent(lessonId: string): string {
  const dirName = lessonDirMap[lessonId]
  if (!dirName) {
    return ''
  }

  const filePath = path.join(process.cwd(), '..', dirName, 'final-content.md')

  try {
    const rawContent = fs.readFileSync(filePath, 'utf8')
    return stripMarkdown(buildProcessedLessonContent(rawContent))
  } catch {
    return ''
  }
}

export function getLessonSearchEntries(): LessonSearchEntry[] {
  return lessons.map((lesson) => ({
    ...lesson,
    content: readLessonContent(lesson.id),
  }))
}
