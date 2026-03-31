import assert from 'node:assert/strict'
import test from 'node:test'
// @ts-expect-error Node test runner requires the explicit .ts extension for local ESM imports.
import { getHighlightParts, searchLessons } from './lesson-search.ts'
// @ts-expect-error Node test runner requires the explicit .ts extension for local ESM imports.
import { getLessonSearchEntries } from './lesson-search.server.ts'

test('searchLessons matches lesson content details beyond lesson metadata', () => {
  const results = searchLessons('JSON-RPC', getLessonSearchEntries())

  assert.equal(results.length > 0, true)
  assert.equal(results[0]?.id, 'lesson-7')
  assert.equal(results[0]?.matchType, 'content')
  assert.match(results[0]?.matchedText ?? '', /JSON-RPC/i)
})

test('getHighlightParts splits matched text with case-insensitive highlights', () => {
  const parts = getHighlightParts('MCP 使用 JSON-RPC 进行通信', 'json-rpc')

  assert.deepEqual(parts, [
    { text: 'MCP 使用 ', highlighted: false },
    { text: 'JSON-RPC', highlighted: true },
    { text: ' 进行通信', highlighted: false },
  ])
})
