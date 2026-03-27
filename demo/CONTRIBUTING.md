# 贡献指南

感谢你对本项目的关注！我们欢迎任何形式的贡献。

## 开发流程

### 1. Fork 并克隆仓库

```bash
git clone https://github.com/your-username/ai-native-frontend-demo.git
cd ai-native-frontend-demo/demo
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 4. 开发

```bash
pnpm dev
```

### 5. 代码检查

在提交前，请确保代码通过所有检查：

```bash
# Lint 检查
pnpm lint

# 类型检查
pnpm type-check

# 格式化代码
pnpm format
```

### 6. 提交代码

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复某个 bug"
git commit -m "docs: 更新文档"
```

提交类型：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具变动

### 7. 推送并创建 PR

```bash
git push origin feature/your-feature-name
```

然后在 GitHub 上创建 Pull Request。

## PR 指南

### PR 标题

- 保持简洁（少于 70 字符）
- 使用清晰的描述性语言
- 遵循 Conventional Commits 格式

### PR 描述

请在 PR 中包含：

1. **变更摘要**：简要说明做了什么
2. **动机**：为什么需要这个变更
3. **测试计划**：如何验证这个变更
4. **截图**（如果是 UI 变更）

示例：

```markdown
## 摘要
- 添加了用户反馈列表组件
- 实现了按情感类型筛选功能

## 动机
用户需要能够快速查看和筛选反馈信息

## 测试计划
- [ ] 验证列表正确显示所有反馈
- [ ] 测试筛选功能
- [ ] 检查移动端响应式布局

## 截图
[添加截图]
```

## 代码规范

### TypeScript

- 使用严格模式
- 为所有函数参数和返回值添加类型
- 避免使用 `any`，优先使用 `unknown`
- 使用接口（interface）定义对象类型

### React

- 使用函数组件和 Hooks
- 组件文件使用 PascalCase 命名
- 自定义 Hook 以 `use` 开头
- 保持组件小而专注

### 样式

- 使用 Tailwind CSS 工具类
- 遵循移动优先原则
- 使用 shadcn/ui 组件作为基础

### 文件组织

```
src/
├── app/              # Next.js 页面
├── components/       # React 组件
│   ├── ui/          # 基础 UI 组件
│   └── ...          # 业务组件
├── lib/             # 工具函数
├── hooks/           # 自定义 Hooks
└── types/           # TypeScript 类型定义
```

## 问题反馈

如果你发现了 bug 或有功能建议，请：

1. 先搜索现有的 Issues，避免重复
2. 使用清晰的标题
3. 提供详细的描述和复现步骤
4. 如果是 bug，请提供：
   - 操作系统和浏览器版本
   - 错误信息和堆栈跟踪
   - 复现步骤

## 行为准则

- 尊重所有贡献者
- 保持友好和专业
- 接受建设性的批评
- 关注对项目最有利的事情

## 需要帮助？

如果你有任何问题，可以：

- 查看项目文档
- 在 Issues 中提问
- 联系维护者

再次感谢你的贡献！🎉
