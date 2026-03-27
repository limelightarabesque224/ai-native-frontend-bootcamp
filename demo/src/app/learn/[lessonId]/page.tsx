import fs from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { lessons } from '@/lib/lessons'
import { LessonContent } from '@/components/learn/lesson-content'

// 课程 ID 到文件目录的映射
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

function getLessonContent(lessonId: string): string | null {
  const dirName = lessonDirMap[lessonId]
  if (!dirName) return null

  // 在上级目录中查找演讲稿
  const filePath = path.join(process.cwd(), '..', dirName, 'final-content.md')
  try {
    return fs.readFileSync(filePath, 'utf-8')
  } catch {
    return null
  }
}

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id,
  }))
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const { lessonId } = await params
  const lesson = lessons.find((l) => l.id === lessonId)
  if (!lesson) notFound()

  const content = getLessonContent(lessonId)
  const currentIndex = lessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
      {/* 课程头部 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Link href="/learn" className="hover:text-primary transition-colors">
            课程
          </Link>
          <span>/</span>
          <span>第 {lesson.number} 课</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          第 {lesson.number} 课：{lesson.title}
        </h1>
        <p className="text-lg text-muted-foreground mb-4">{lesson.subtitle}</p>
        <div className="flex gap-2">
          {lesson.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          <span className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">
            {lesson.duration}
          </span>
        </div>
      </div>

      {/* 课程内容 */}
      {content ? (
        <LessonContent content={content} />
      ) : (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          <p className="text-lg mb-2">课程内容加载中...</p>
          <p className="text-sm">请确保演讲稿文件存在于项目根目录</p>
        </div>
      )}

      {/* 上一课 / 下一课 导航 */}
      <div className="flex justify-between mt-16 pt-8 border-t">
        {prevLesson ? (
          <Link
            href={`/learn/${prevLesson.id}`}
            className="group flex flex-col items-start"
          >
            <span className="text-xs text-muted-foreground mb-1">上一课</span>
            <span className="text-xs md:text-sm font-medium group-hover:text-primary transition-colors">
              ← 第 {prevLesson.number} 课：{prevLesson.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/learn/${nextLesson.id}`}
            className="group flex flex-col items-end"
          >
            <span className="text-xs text-muted-foreground mb-1">下一课</span>
            <span className="text-xs md:text-sm font-medium group-hover:text-primary transition-colors">
              第 {nextLesson.number} 课：{nextLesson.title} →
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
