import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
// @ts-expect-error Node test runner requires the explicit .ts extension for local ESM imports.
import { buildProcessedLessonContent, generateToc, slugifyHeading } from './lesson-markdown.ts'

const sampleMarkdown = `# 组件库范式转移：shadcn/ui 的 Open Code 哲学

> **课程时长**: 2.5-3 小时 | **难度**: 中级 | **风格**: 故事开场 + 技术深度 + 实践指导

## 📋 本课概览

### 课程结构导航

## 📖 Section 1：传统组件库的 AI 困境

## 📖 Section 2：shadcn/ui 的 Open Code 哲学
`

test('buildProcessedLessonContent removes the page title block before TOC generation', () => {
  const processed = buildProcessedLessonContent(sampleMarkdown)

  assert.doesNotMatch(processed, /^#\s+组件库范式转移：shadcn\/ui 的 Open Code 哲学/m)

  const toc = generateToc(processed)

  assert.deepEqual(
    toc.map((item) => item.text),
    [
      '📋 本课概览',
      '课程结构导航',
      '📖 Section 1：传统组件库的 AI 困境',
      '📖 Section 2：shadcn/ui 的 Open Code 哲学',
    ]
  )
})

test('generateToc uses the same heading ids as the rendered markdown headings', () => {
  const processed = buildProcessedLessonContent(sampleMarkdown)
  const toc = generateToc(processed)

  assert.equal(toc.at(-1)?.id, slugifyHeading('📖 Section 2：shadcn/ui 的 Open Code 哲学'))
  assert.equal(toc.at(-1)?.id, 'section-2-shadcn-ui-的-open-code-哲学')
})

test('generateToc assigns unique ids to duplicate headings', () => {
  const toc = generateToc(`
## 技术栈
## 技术栈
### 技术栈
`)

  assert.deepEqual(
    toc.map((item) => item.id),
    ['技术栈', '技术栈-2', '技术栈-3']
  )
})

test('generateToc ignores heading-like lines inside fenced code blocks', () => {
  const toc = generateToc(`
## 真实标题

\`\`\`bash
# 伪标题
## 也不应该进入目录
\`\`\`

### 真实小节

\`\`\`
# .cursorrules
## 技术栈
\`\`\`
`)

  assert.deepEqual(
    toc.map((item) => item.text),
    ['真实标题', '真实小节']
  )
})

test('all lesson markdown files generate unique toc ids', () => {
  const workspaceRoot = path.resolve(process.cwd(), '..')
  const lessonDirs = fs.readdirSync(workspaceRoot).filter((name) => /^第\d+课-/.test(name))

  for (const lessonDir of lessonDirs) {
    const markdownPath = path.join(workspaceRoot, lessonDir, 'final-content.md')
    if (!fs.existsSync(markdownPath)) continue

    const content = fs.readFileSync(markdownPath, 'utf8')
    const toc = generateToc(buildProcessedLessonContent(content))
    const ids = toc.map((item) => item.id)
    const uniqueIds = new Set(ids)

    assert.equal(
      uniqueIds.size,
      ids.length,
      `${lessonDir} still contains duplicate toc ids: ${ids.join(', ')}`
    )
  }
})
