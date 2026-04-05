# AI-Native Java Backend Bootcamp Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建一个新的 `ai-native-java-backend-bootcamp` 仓库，形成“课程材料 + 真实 Java AI demo 项目”双轨一体结构，并落地一期最小可用课程骨架与企业知识助手主项目骨架。

**Architecture:** 先建立新仓库的顶层结构、课程主文档和工程约束，再搭建 `demo/` 的 Spring Boot 模块化单体骨架与本地基础设施，随后按“聊天 -> 知识入库 -> RAG -> Agent/Workflow -> 工程治理”的顺序逐步铺开能力。所有课程目录、练习目录和对比样例都围绕同一主线场景组织，避免多主线发散。执行假设为：在一个全新的 `ai-native-java-backend-bootcamp/` 仓库根目录内实施本计划。

**Tech Stack:** Markdown、Mermaid、Java 21、Spring Boot 3.x、Maven Wrapper、JUnit 5、Testcontainers、MySQL、Redis、Elasticsearch、RabbitMQ、Spring AI、LangChain4j、Docker Compose

---

> **Scope check:** 本计划覆盖 docs、课程内容、`demo/` 主项目、练习与对比样例，但它们共享同一个仓库根、同一主业务场景和同一交付目标，因此保留为一个实现计划，用 `Chunk` 做阶段隔离，而不是拆成多个独立计划。

## Chunk 1: 新仓库骨架与课程主文档

### Task 1: 初始化仓库顶层目录与基础文件

**Files:**
- Create: `README.md`
- Create: `课程设计文档.md`
- Create: `AI-Native-Java项目配置模板.md`
- Create: `演讲大纲.md`
- Create: `.gitignore`
- Create: `.editorconfig`
- Create: `.gitattributes`
- Create: `docs/diagrams/.gitkeep`
- Create: `docs/references/.gitkeep`
- Create: `docs/superpowers/specs/.gitkeep`
- Create: `docs/superpowers/plans/.gitkeep`
- Create: `compare/python-fastapi/.gitkeep`
- Create: `compare/go-gin/.gitkeep`
- Create: `compare/ts-nestjs/.gitkeep`
- Create: `课后练习/README.md`

- [ ] **Step 1: 创建顶层目录骨架**

Run: `mkdir -p docs/diagrams docs/references docs/superpowers/specs docs/superpowers/plans compare/python-fastapi compare/go-gin compare/ts-nestjs 课后练习`
Expected: 顶层目录存在，后续文档和代码有稳定落点

- [ ] **Step 2: 写入仓库基础约束文件**

Create:
- `.gitignore`
- `.editorconfig`
- `.gitattributes`

要求：
- 忽略 Java、IDE、Node、OS 和 demo 基础设施产生物
- 统一换行与 UTF-8 编码
- 为 markdown 和 shell 脚本约定基础格式

- [ ] **Step 3: 起草仓库主文档首版**

Create:
- `README.md`
- `课程设计文档.md`
- `AI-Native-Java项目配置模板.md`
- `演讲大纲.md`
- `课后练习/README.md`

要求：
- `README.md` 至少包含定位、课程目录、技术地图、快速开始、仓库结构
- `课程设计文档.md` 至少包含课程定位、教学方法、章节摘要、主项目主线
- `AI-Native-Java项目配置模板.md` 至少包含 `AGENTS.md`、Rules、Prompt、环境变量与提交规范建议
- `演讲大纲.md` 提供 12 节课的授课提纲
- `课后练习/README.md` 说明三档练习机制和与 `demo/` 的关系

- [ ] **Step 4: 验证顶层结构与入口文档完整性**

Run: `find . -maxdepth 2 | sort`
Expected: 顶层目录与主文档齐全，无错误路径或重复命名

- [ ] **Step 5: 运行轻量自查**

Run: `rg -n "TODO|TBD|待补充" README.md 课程设计文档.md AI-Native-Java项目配置模板.md 演讲大纲.md 课后练习/README.md`
Expected: 不残留占位文本；如有占位，必须明确标注后续 Chunk 填充责任

- [ ] **Step 6: 提交本任务**

```bash
git add README.md 课程设计文档.md AI-Native-Java项目配置模板.md 演讲大纲.md .gitignore .editorconfig .gitattributes docs compare 课后练习/README.md
git commit -m "feat: scaffold Java backend bootcamp repository docs"
```

### Task 2: 创建课程目录与每课讲稿占位

**Files:**
- Create: `第0课-认知重构/final-content.md`
- Create: `第1课-Spring-Boot-接入模型/final-content.md`
- Create: `第2课-对话接口与流式输出/final-content.md`
- Create: `第3课-Prompt-上下文与结构化输出/final-content.md`
- Create: `第4课-文件解析与知识入库/final-content.md`
- Create: `第5课-RAG-检索增强/final-content.md`
- Create: `第6课-Redis-ES-向量检索协同/final-content.md`
- Create: `第7课-Agent-Tools/final-content.md`
- Create: `第8课-Workflow-与-MQ/final-content.md`
- Create: `第9课-AI-工程化治理/final-content.md`
- Create: `第10课-业务融合与数据助手/final-content.md`
- Create: `第11课-全链路整合与生产化/final-content.md`

- [ ] **Step 1: 创建 12 个 lesson 目录**

Run: `mkdir -p 第0课-认知重构 第1课-Spring-Boot-接入模型 第2课-对话接口与流式输出 第3课-Prompt-上下文与结构化输出 第4课-文件解析与知识入库 第5课-RAG-检索增强 第6课-Redis-ES-向量检索协同 第7课-Agent-Tools 第8课-Workflow-与-MQ 第9课-AI-工程化治理 第10课-业务融合与数据助手 第11课-全链路整合与生产化`
Expected: 课程目录与设计文档中的命名保持一致

- [ ] **Step 2: 为每课创建讲稿骨架**

每个 `final-content.md` 必须先写入统一骨架：
- 课程定位
- 本课目标
- 本课在 `demo/` 中新增的能力
- 关键技术点
- 横向对比
- 课后练习
- 与上下节课衔接

- [ ] **Step 3: 抽样验证讲稿骨架一致性**

Run: `rg -n "本课在 .* 中新增的能力|课后练习|横向对比" 第*课-*/final-content.md`
Expected: 所有讲稿都具备同一组结构锚点

- [ ] **Step 4: 提交本任务**

```bash
git add 第0课-认知重构 第1课-Spring-Boot-接入模型 第2课-对话接口与流式输出 第3课-Prompt-上下文与结构化输出 第4课-文件解析与知识入库 第5课-RAG-检索增强 第6课-Redis-ES-向量检索协同 第7课-Agent-Tools 第8课-Workflow-与-MQ 第9课-AI-工程化治理 第10课-业务融合与数据助手 第11课-全链路整合与生产化
git commit -m "feat: add lesson manuscript skeletons"
```

## Chunk 2: `demo/` 工程骨架与本地基础设施

### Task 3: 初始化 `demo/` 的 Spring Boot 项目骨架

**Files:**
- Create: `demo/README.md`
- Create: `demo/pom.xml`
- Create: `demo/mvnw`
- Create: `demo/mvnw.cmd`
- Create: `demo/.mvn/wrapper/maven-wrapper.properties`
- Create: `demo/.gitignore`
- Create: `demo/src/main/java/com/example/ainative/AiNativeBackendApplication.java`
- Create: `demo/src/main/java/com/example/ainative/common/api/ApiResponse.java`
- Create: `demo/src/main/java/com/example/ainative/common/health/HealthController.java`
- Create: `demo/src/main/resources/application.yml`
- Create: `demo/src/test/java/com/example/ainative/common/health/HealthControllerTest.java`

- [ ] **Step 1: 生成 Maven Wrapper 与最小 Spring Boot 工程**

Run: `mkdir -p demo && cd demo && mvn -N wrapper:wrapper`
Expected: `demo/mvnw`、`demo/mvnw.cmd` 和 wrapper 配置生成成功

- [ ] **Step 2: 写健康检查的失败测试**

Test: `demo/src/test/java/com/example/ainative/common/health/HealthControllerTest.java`

```java
@WebMvcTest(HealthController.class)
class HealthControllerTest {
    @Autowired private MockMvc mockMvc;

    @Test
    void shouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/health"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.status").value("UP"));
    }
}
```

- [ ] **Step 3: 运行测试确认失败**

Run: `cd demo && ./mvnw -q -Dtest=HealthControllerTest test`
Expected: FAIL，提示 `HealthController` 或 `ApiResponse` 不存在

- [ ] **Step 4: 编写最小实现使测试通过**

Create:
- `AiNativeBackendApplication.java`
- `ApiResponse.java`
- `HealthController.java`
- `application.yml`

要求：
- 暴露 `GET /api/health`
- 返回统一响应格式
- 应用能以 `demo/` 为独立 Spring Boot 服务启动

- [ ] **Step 5: 重新运行测试**

Run: `cd demo && ./mvnw -q -Dtest=HealthControllerTest test`
Expected: PASS

- [ ] **Step 6: 提交本任务**

```bash
git add demo
git commit -m "feat: bootstrap Spring Boot demo service"
```

### Task 4: 搭建 `demo/` 模块目录与基础设施编排

**Files:**
- Create: `demo/docker-compose.yml`
- Create: `demo/.env.example`
- Create: `demo/scripts/start-infra.sh`
- Create: `demo/scripts/stop-infra.sh`
- Create: `demo/scripts/load-sample-data.sh`
- Create: `demo/src/main/java/com/example/ainative/bootstrap/config/InfraProperties.java`
- Create: `demo/src/test/java/com/example/ainative/bootstrap/config/InfraPropertiesTest.java`
- Modify: `demo/README.md`
- Modify: `demo/pom.xml`

- [ ] **Step 1: 写配置绑定失败测试**

Test: `demo/src/test/java/com/example/ainative/bootstrap/config/InfraPropertiesTest.java`

```java
class InfraPropertiesTest {
    @Test
    void shouldBindAiAndDataInfraProperties() {
        var contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(TestConfig.class)
            .withPropertyValues(
                "app.ai.provider=openai",
                "app.redis.host=localhost",
                "app.mysql.host=localhost"
            );

        contextRunner.run(context ->
            assertThat(context).hasSingleBean(InfraProperties.class)
        );
    }
}
```

- [ ] **Step 2: 运行测试确认失败**

Run: `cd demo && ./mvnw -q -Dtest=InfraPropertiesTest test`
Expected: FAIL，提示配置类未定义或未绑定

- [ ] **Step 3: 创建基础设施与配置实现**

实现要求：
- `docker-compose.yml` 至少包含 MySQL、Redis、Elasticsearch、RabbitMQ
- `.env.example` 说明模型与基础设施的最小配置
- `start-infra.sh` / `stop-infra.sh` 能直接拉起和停止本地依赖
- `load-sample-data.sh` 预留样例数据导入入口
- `InfraProperties` 对常用配置进行集中绑定

- [ ] **Step 4: 重新运行测试**

Run: `cd demo && ./mvnw -q -Dtest=InfraPropertiesTest test`
Expected: PASS

- [ ] **Step 5: 手动验证基础设施脚本**

Run: `cd demo && bash scripts/start-infra.sh`
Expected: 依赖服务启动成功；若失败，使用 `@systematic-debugging` 排查后修正脚本

- [ ] **Step 6: 提交本任务**

```bash
git add demo
git commit -m "feat: add demo infrastructure scaffolding"
```

## Chunk 3: 聊天接口、知识入库与 RAG MVP

### Task 5: 实现聊天接口与流式响应最小闭环

**Files:**
- Create: `demo/src/main/java/com/example/ainative/ai/model/ChatModelGateway.java`
- Create: `demo/src/main/java/com/example/ainative/chat/api/ChatRequest.java`
- Create: `demo/src/main/java/com/example/ainative/chat/api/ChatResponse.java`
- Create: `demo/src/main/java/com/example/ainative/chat/service/ChatService.java`
- Create: `demo/src/main/java/com/example/ainative/chat/controller/ChatController.java`
- Create: `demo/src/test/java/com/example/ainative/chat/controller/ChatControllerTest.java`
- Create: `demo/src/test/java/com/example/ainative/chat/service/ChatServiceTest.java`
- Modify: `demo/pom.xml`

- [ ] **Step 1: 写同步聊天接口的失败测试**

Test: `demo/src/test/java/com/example/ainative/chat/controller/ChatControllerTest.java`

```java
@WebMvcTest(ChatController.class)
class ChatControllerTest {
    @Autowired private MockMvc mockMvc;
    @MockBean private ChatService chatService;

    @Test
    void shouldReturnStructuredChatResponse() throws Exception {
        when(chatService.chat(any())).thenReturn(new ChatResponse("answer", "mock-model"));

        mockMvc.perform(post("/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"message\":\"hello\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.answer").value("answer"));
    }
}
```

- [ ] **Step 2: 写流式接口的失败测试**

Test: `demo/src/test/java/com/example/ainative/chat/service/ChatServiceTest.java`

要求：
- 使用 stub `ChatModelGateway`
- 验证服务层同时暴露同步和 SSE/Flux 流式能力

- [ ] **Step 3: 运行测试确认失败**

Run: `cd demo && ./mvnw -q -Dtest=ChatControllerTest,ChatServiceTest test`
Expected: FAIL，提示 `ChatController`、`ChatService`、`ChatResponse` 等不存在

- [ ] **Step 4: 实现最小聊天闭环**

要求：
- `/api/chat` 返回统一结构
- `/api/chat/stream` 提供最小流式输出
- `ChatModelGateway` 暂时可用 mock/stub 实现，先打通系统边界
- 为后续 `Spring AI` 或 `LangChain4j` 接入预留接口层

- [ ] **Step 5: 重新运行测试**

Run: `cd demo && ./mvnw -q -Dtest=ChatControllerTest,ChatServiceTest test`
Expected: PASS

- [ ] **Step 6: 提交本任务**

```bash
git add demo
git commit -m "feat: add chat API and streaming response skeleton"
```

### Task 6: 实现文档上传、切片与知识入库骨架

**Files:**
- Create: `demo/src/main/java/com/example/ainative/knowledge/document/api/UploadDocumentResponse.java`
- Create: `demo/src/main/java/com/example/ainative/knowledge/document/controller/DocumentController.java`
- Create: `demo/src/main/java/com/example/ainative/knowledge/document/service/DocumentIngestService.java`
- Create: `demo/src/main/java/com/example/ainative/knowledge/document/service/TextChunker.java`
- Create: `demo/src/main/java/com/example/ainative/knowledge/document/model/DocumentChunk.java`
- Create: `demo/src/test/java/com/example/ainative/knowledge/document/service/TextChunkerTest.java`
- Create: `demo/src/test/java/com/example/ainative/knowledge/document/controller/DocumentControllerTest.java`

- [ ] **Step 1: 写文本切片失败测试**

Test: `demo/src/test/java/com/example/ainative/knowledge/document/service/TextChunkerTest.java`

```java
class TextChunkerTest {
    @Test
    void shouldSplitLongTextIntoStableChunks() {
        var chunker = new TextChunker(50, 10);
        var chunks = chunker.split("...long sample text...");
        assertThat(chunks).hasSizeGreaterThan(1);
    }
}
```

- [ ] **Step 2: 写上传接口失败测试**

Test: `demo/src/test/java/com/example/ainative/knowledge/document/controller/DocumentControllerTest.java`

要求：
- 上传 markdown 或 txt 文件
- 返回 `documentId`
- 返回切片数或接收状态

- [ ] **Step 3: 运行测试确认失败**

Run: `cd demo && ./mvnw -q -Dtest=TextChunkerTest,DocumentControllerTest test`
Expected: FAIL，提示上传控制器、切片器等不存在

- [ ] **Step 4: 实现最小知识入库链路**

要求：
- `/api/documents/upload` 接收文件
- 初期支持 `txt` / `md`
- `TextChunker` 以稳定规则切片
- `DocumentIngestService` 先把切片落到内存或占位存储层，为后续向量入库铺路

- [ ] **Step 5: 重新运行测试**

Run: `cd demo && ./mvnw -q -Dtest=TextChunkerTest,DocumentControllerTest test`
Expected: PASS

- [ ] **Step 6: 提交本任务**

```bash
git add demo
git commit -m "feat: add document ingest and chunking skeleton"
```

### Task 7: 实现 RAG 检索与带引用回答的 MVP

**Files:**
- Create: `demo/src/main/java/com/example/ainative/knowledge/retrieve/Retriever.java`
- Create: `demo/src/main/java/com/example/ainative/knowledge/rag/RagService.java`
- Create: `demo/src/main/java/com/example/ainative/knowledge/citation/Citation.java`
- Create: `demo/src/main/java/com/example/ainative/knowledge/rag/api/RagAnswerResponse.java`
- Create: `demo/src/main/java/com/example/ainative/knowledge/rag/controller/RagController.java`
- Create: `demo/src/test/java/com/example/ainative/knowledge/rag/RagServiceTest.java`
- Create: `demo/src/test/java/com/example/ainative/knowledge/rag/RagControllerTest.java`

- [ ] **Step 1: 写 RAG 服务失败测试**

Test: `demo/src/test/java/com/example/ainative/knowledge/rag/RagServiceTest.java`

```java
class RagServiceTest {
    @Test
    void shouldReturnAnswerWithCitations() {
        Retriever retriever = question -> List.of(new RetrievedChunk("c1", "source.md", "chunk text"));
        ChatModelGateway model = prompt -> "grounded answer";
        var service = new RagService(retriever, model);

        var response = service.answer("What is this?");
        assertThat(response.citations()).hasSize(1);
    }
}
```

- [ ] **Step 2: 写 RAG 接口失败测试**

Test: `demo/src/test/java/com/example/ainative/knowledge/rag/RagControllerTest.java`

要求：
- `/api/knowledge/ask` 接收用户问题
- 返回 `answer`、`citations`、`mode`

- [ ] **Step 3: 运行测试确认失败**

Run: `cd demo && ./mvnw -q -Dtest=RagServiceTest,RagControllerTest test`
Expected: FAIL，提示 `RagService`、`Citation`、`RagController` 等不存在

- [ ] **Step 4: 实现最小 RAG 回答链路**

要求：
- 通过 `Retriever` 取回切片
- 把切片拼入受控 prompt
- 返回带引用的结构化响应
- 检索为空时走显式降级分支，而不是静默返回幻觉答案

- [ ] **Step 5: 重新运行测试**

Run: `cd demo && ./mvnw -q -Dtest=RagServiceTest,RagControllerTest test`
Expected: PASS

- [ ] **Step 6: 提交本任务**

```bash
git add demo
git commit -m "feat: add rag answer flow with citations"
```

## Chunk 4: 检索协同、Agent/Workflow 与业务扩展

### Task 8: 补齐 Redis、ES、向量检索的适配边界

**Files:**
- Create: `demo/src/main/java/com/example/ainative/cache/SessionMemoryStore.java`
- Create: `demo/src/main/java/com/example/ainative/search/KeywordSearchService.java`
- Create: `demo/src/main/java/com/example/ainative/vector/VectorStoreGateway.java`
- Create: `demo/src/main/java/com/example/ainative/knowledge/retrieve/HybridRetriever.java`
- Create: `demo/src/test/java/com/example/ainative/knowledge/retrieve/HybridRetrieverTest.java`
- Modify: `demo/src/main/resources/application.yml`

- [ ] **Step 1: 写混合检索失败测试**

Test: `demo/src/test/java/com/example/ainative/knowledge/retrieve/HybridRetrieverTest.java`

要求：
- 验证关键词与向量结果可汇总
- 验证关键词失败时可降级到向量召回，反之亦然

- [ ] **Step 2: 运行测试确认失败**

Run: `cd demo && ./mvnw -q -Dtest=HybridRetrieverTest test`
Expected: FAIL，提示检索适配器尚未实现

- [ ] **Step 3: 实现缓存、搜索与向量边界层**

要求：
- `SessionMemoryStore` 先定义接口和最小 Redis 实现
- `KeywordSearchService` 封装 ES 关键词查询
- `VectorStoreGateway` 封装向量写入与召回
- `HybridRetriever` 负责组合与降级逻辑

- [ ] **Step 4: 重新运行测试**

Run: `cd demo && ./mvnw -q -Dtest=HybridRetrieverTest test`
Expected: PASS

- [ ] **Step 5: 提交本任务**

```bash
git add demo
git commit -m "feat: add hybrid retrieval boundaries"
```

### Task 9: 实现 Tool Calling、Workflow 与异步任务骨架

**Files:**
- Create: `demo/src/main/java/com/example/ainative/agent/tool/ToolDefinition.java`
- Create: `demo/src/main/java/com/example/ainative/agent/tool/ToolRegistry.java`
- Create: `demo/src/main/java/com/example/ainative/agent/executor/ToolExecutionResult.java`
- Create: `demo/src/main/java/com/example/ainative/workflow/KnowledgeWorkflowService.java`
- Create: `demo/src/main/java/com/example/ainative/task/KnowledgeIngestTaskPublisher.java`
- Create: `demo/src/main/java/com/example/ainative/task/KnowledgeIngestTaskConsumer.java`
- Create: `demo/src/test/java/com/example/ainative/agent/tool/ToolRegistryTest.java`
- Create: `demo/src/test/java/com/example/ainative/workflow/KnowledgeWorkflowServiceTest.java`

- [ ] **Step 1: 写 Tool Registry 失败测试**

Test: `demo/src/test/java/com/example/ainative/agent/tool/ToolRegistryTest.java`

要求：
- 工具必须通过唯一名称注册
- 不允许重复注册
- 未注册工具调用必须返回显式错误

- [ ] **Step 2: 写 Workflow 失败测试**

Test: `demo/src/test/java/com/example/ainative/workflow/KnowledgeWorkflowServiceTest.java`

要求：
- 固定流程至少覆盖“上传 -> 解析 -> 切片 -> 入库 -> 通知”
- 任一节点失败时返回可观察状态

- [ ] **Step 3: 运行测试确认失败**

Run: `cd demo && ./mvnw -q -Dtest=ToolRegistryTest,KnowledgeWorkflowServiceTest test`
Expected: FAIL，提示 registry、workflow、task 相关类型不存在

- [ ] **Step 4: 实现最小 Tool/Workflow/Task 编排**

要求：
- Tool 访问受 allowlist 约束
- Workflow 与 Agent 分层，不混成一个万能服务
- MQ 发布和消费链路先用最小消息体跑通
- 失败路径写日志和状态，而不是吞错

- [ ] **Step 5: 重新运行测试**

Run: `cd demo && ./mvnw -q -Dtest=ToolRegistryTest,KnowledgeWorkflowServiceTest test`
Expected: PASS

- [ ] **Step 6: 提交本任务**

```bash
git add demo
git commit -m "feat: add tool registry workflow and async task skeleton"
```

### Task 10: 增加业务扩展样例与跨语言对比样例

**Files:**
- Create: `demo/src/main/java/com/example/ainative/dataassistant/controller/SqlAssistantController.java`
- Create: `demo/src/test/java/com/example/ainative/dataassistant/controller/SqlAssistantControllerTest.java`
- Create: `compare/python-fastapi/chat_stream_example/README.md`
- Create: `compare/python-fastapi/chat_stream_example/main.py`
- Create: `compare/go-gin/chat_stream_example/README.md`
- Create: `compare/go-gin/chat_stream_example/main.go`
- Create: `compare/ts-nestjs/chat_stream_example/README.md`
- Create: `compare/ts-nestjs/chat_stream_example/src/main.ts`

- [ ] **Step 1: 写 SQL 助手接口失败测试**

Test: `demo/src/test/java/com/example/ainative/dataassistant/controller/SqlAssistantControllerTest.java`

要求：
- 接口仅接受只读问题
- 响应中显式返回 `sqlPreview`、`safe` 和 `summary`

- [ ] **Step 2: 运行测试确认失败**

Run: `cd demo && ./mvnw -q -Dtest=SqlAssistantControllerTest test`
Expected: FAIL，提示数据助手控制器不存在

- [ ] **Step 3: 实现最小业务扩展示例**

要求：
- `SqlAssistantController` 只提供占位级 Text-to-SQL 入口，不做完整 BI 平台
- 返回“只读、预览、需审核”的安全语义

- [ ] **Step 4: 创建三种语言的流式对比样例**

要求：
- 三个样例都只做“最小流式聊天接口”
- README 说明各自框架思路、启动方式和与 Java 主项目的差异
- 不复制 `demo/` 的完整能力链

- [ ] **Step 5: 提交本任务**

```bash
git add demo compare
git commit -m "feat: add business extension and compare samples"
```

## Chunk 5: 课程填充、练习体系与工程治理

### Task 11: 回填每课正文与课后练习目录

**Files:**
- Modify: `第0课-认知重构/final-content.md`
- Modify: `第1课-Spring-Boot-接入模型/final-content.md`
- Modify: `第2课-对话接口与流式输出/final-content.md`
- Modify: `第3课-Prompt-上下文与结构化输出/final-content.md`
- Modify: `第4课-文件解析与知识入库/final-content.md`
- Modify: `第5课-RAG-检索增强/final-content.md`
- Modify: `第6课-Redis-ES-向量检索协同/final-content.md`
- Modify: `第7课-Agent-Tools/final-content.md`
- Modify: `第8课-Workflow-与-MQ/final-content.md`
- Modify: `第9课-AI-工程化治理/final-content.md`
- Modify: `第10课-业务融合与数据助手/final-content.md`
- Modify: `第11课-全链路整合与生产化/final-content.md`
- Create: `课后练习/第1课/练习.md`
- Create: `课后练习/第2课/练习.md`
- Create: `课后练习/第3课/练习.md`
- Create: `课后练习/第4课/练习.md`
- Create: `课后练习/第5课/练习.md`
- Create: `课后练习/第6课/练习.md`
- Create: `课后练习/第7课/练习.md`
- Create: `课后练习/第8课/练习.md`
- Create: `课后练习/第9课/练习.md`
- Create: `课后练习/第10课/练习.md`
- Create: `课后练习/第11课/练习.md`

- [ ] **Step 1: 先完成第0课到第3课正文**

要求：
- 把 AI-Native 后端认知、模型接入、聊天接口、Prompt/Context 讲清
- 每课明确对应 `demo/` 的代码模块

- [ ] **Step 2: 完成第4课到第8课正文**

要求：
- 重点围绕企业知识助手主线
- 明确文件解析、RAG、Redis/ES/向量、Agent、Workflow 的边界

- [ ] **Step 3: 完成第9课到第11课正文**

要求：
- 工程治理、业务融合、生产化必须形成完整收束
- 第11课要汇总成本、安全、评测与交付

- [ ] **Step 4: 为每课创建练习**

每个 `练习.md` 至少包含：
- 基础题
- 进阶题
- 挑战题
- 验收标准

- [ ] **Step 5: 验证课文与练习映射**

Run: `rg -n "基础题|进阶题|挑战题|验收标准" 课后练习/第*/练习.md`
Expected: 所有练习目录都具备统一骨架

- [ ] **Step 6: 提交本任务**

```bash
git add 第*课-* 课后练习
git commit -m "feat: add lesson content and exercises"
```

### Task 12: 增加评测、治理与交付脚手架

**Files:**
- Create: `demo/evals/chat/basic.yaml`
- Create: `demo/evals/rag/grounded-answer.yaml`
- Create: `demo/evals/tools/sql-preview.yaml`
- Create: `demo/evals/regression/README.md`
- Create: `demo/src/main/java/com/example/ainative/ops/logging/RequestLogFilter.java`
- Create: `demo/src/main/java/com/example/ainative/ops/metrics/AiMetricsFacade.java`
- Create: `demo/src/main/java/com/example/ainative/ai/safety/SafetyPolicy.java`
- Create: `demo/src/test/java/com/example/ainative/ai/safety/SafetyPolicyTest.java`
- Create: `.github/workflows/docs-check.yml`
- Create: `.github/workflows/demo-ci.yml`
- Modify: `demo/README.md`

- [ ] **Step 1: 写 SafetyPolicy 失败测试**

Test: `demo/src/test/java/com/example/ainative/ai/safety/SafetyPolicyTest.java`

要求：
- 拦截高风险 SQL 指令
- 拒绝未授权工具名
- 允许显式白名单工具

- [ ] **Step 2: 运行测试确认失败**

Run: `cd demo && ./mvnw -q -Dtest=SafetyPolicyTest test`
Expected: FAIL，提示安全策略尚未实现

- [ ] **Step 3: 实现最小治理层**

要求：
- `RequestLogFilter` 记录基础请求链路
- `AiMetricsFacade` 预留 token、耗时、缓存命中等指标入口
- `SafetyPolicy` 提供只读 SQL 与工具 allowlist 判断
- `demo/evals/` 提供最小回归样例

- [ ] **Step 4: 添加最小 CI**

要求：
- `docs-check.yml` 至少检查 Markdown 文件存在性和基础结构
- `demo-ci.yml` 至少运行 `./mvnw test`
- CI 名称和路径保持清晰，便于后续扩展

- [ ] **Step 5: 运行最终验证**

Run:
- `cd demo && ./mvnw test`
- `cd demo && bash scripts/start-infra.sh`
- `rg -n "^# " README.md 课程设计文档.md 演讲大纲.md`

Expected:
- 单元与最小集成测试通过
- 基础设施脚本可启动
- 主文档标题结构正常

- [ ] **Step 6: 使用 `@verification-before-completion` 做交付前复核**

检查：
- 课程目录、练习目录、compare 样例、demo 工程是否全部落位
- 文档、代码、脚本与 CI 是否形成闭环
- 仍未实现的点是否有明确注释和后续计划，而不是静默缺失

- [ ] **Step 7: 提交本任务**

```bash
git add .github demo README.md 课程设计文档.md 演讲大纲.md
git commit -m "feat: add governance evals and CI scaffolding"
```

## 实施注意事项

1. 文档与代码要同步推进，避免先写大量正文再回头硬贴代码路径
2. `demo/` 先做模块化单体，不要提前拆微服务
3. `Spring AI` 与 `LangChain4j` 需要明确职责边界，避免一个能力写两套
4. `compare/` 永远只做聚焦样例，不升级为第二主项目
5. Text-to-SQL、Tool Calling、Workflow 相关能力默认从安全边界开始设计
6. 遇到基础设施故障，先用 `@systematic-debugging`
7. 完成每个 Chunk 后，先做自审，再做 `@code-review`

## 计划完成定义

当以下条件同时成立时，本计划可以视为完成：

1. 新仓库骨架、课程主文档、lesson 目录和练习目录都已经建立
2. `demo/` 能本地启动，并通过最小测试集
3. 聊天、上传、切片、RAG、Tool/Workflow 主链路都有最小实现
4. `compare/` 的三种语言样例已经具备最小可运行形态
5. `evals/`、安全策略、日志指标接口和 CI 已具备最小闭环

Plan complete and saved to `docs/superpowers/plans/2026-04-05-ai-native-java-backend-bootcamp-implementation.md`. Ready to execute?
