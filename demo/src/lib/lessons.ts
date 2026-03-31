export interface Lesson {
  id: string
  number: number
  title: string
  subtitle: string
  duration: string
  tags: string[]
}

export const lessons: Lesson[] = [
  {
    id: 'lesson-0',
    number: 0,
    title: '认知重构',
    subtitle: 'AI 友好性是新的选型维度',
    duration: '2h',
    tags: ['认知', 'AI 友好性', 'Token 化'],
  },
  {
    id: 'lesson-1',
    number: 1,
    title: 'Tailwind CSS v4',
    subtitle: '样式方案革命',
    duration: '2.5h',
    tags: ['Tailwind', 'Utility-first', 'Oxide 引擎'],
  },
  {
    id: 'lesson-2',
    number: 2,
    title: 'shadcn/ui',
    subtitle: '组件库范式转移',
    duration: '2.5h',
    tags: ['shadcn/ui', '21st.dev', 'TweakCN', 'magic-ui'],
  },
  {
    id: 'lesson-3',
    number: 3,
    title: 'Radix UI',
    subtitle: '无头组件的底层逻辑',
    duration: '2.5h',
    tags: ['Radix', 'Headless', 'Composition'],
  },
  {
    id: 'lesson-4',
    number: 4,
    title: 'Design to Code（上）',
    subtitle: '设计工具的 AI 革命',
    duration: '2.5h',
    tags: ['Figma AI', 'Semi Design', 'Design Token', 'Penpot'],
  },
  {
    id: 'lesson-5',
    number: 5,
    title: 'Design to Code（下）',
    subtitle: 'AI 代码生成工具',
    duration: '2.5h',
    tags: ['v0.dev', 'Bolt.new', 'Lucide', 'Tabler Icons'],
  },
  {
    id: 'lesson-6',
    number: 6,
    title: 'Monorepo',
    subtitle: 'AI 友好的项目架构',
    duration: '2.5h',
    tags: ['Turborepo', 'pnpm', 'AGENTS.md'],
  },
  {
    id: 'lesson-7',
    number: 7,
    title: 'MCP Tools',
    subtitle: '浏览器自动化与测试',
    duration: '2.5h',
    tags: ['Playwright', 'MCP', '自动化测试'],
  },
  {
    id: 'lesson-8',
    number: 8,
    title: 'AI 编程工具',
    subtitle: 'Memory 管理',
    duration: '2.5h',
    tags: ['Cursor', 'Memory', 'Prompt'],
  },
  {
    id: 'lesson-9',
    number: 9,
    title: 'Vercel AI SDK',
    subtitle: '前端 AI 功能集成',
    duration: '2.5h',
    tags: ['useChat', '流式响应', 'AI Agent'],
  },
  {
    id: 'lesson-10',
    number: 10,
    title: '工程化与全栈化',
    subtitle: 'Biome + Server Actions',
    duration: '2.5h',
    tags: ['Biome', 'tRPC', 'Prisma'],
  },
  {
    id: 'lesson-11',
    number: 11,
    title: '全链路整合',
    subtitle: '未来展望',
    duration: '2.5h',
    tags: ['全链路', '职业发展', '未来趋势'],
  },
]
