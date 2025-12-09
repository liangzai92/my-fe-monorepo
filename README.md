# 我的前端 Monorepo

一个使用**源码共享**模式（Internal Packages / JIT Transpilation）管理多个前端项目和共享包的现代化 monorepo 方案。

## 目录

- [概述](#概述)
- [架构设计](#架构设计)
- [优缺点分析](#优缺点分析)
- [快速开始](#快速开始)
- [使用指南](#使用指南)
- [重要注意事项](#重要注意事项)
- [技术栈](#技术栈)

## 概述

本 monorepo 使用 **pnpm workspaces** + **Turborepo** 管理多个独立应用和共享包。核心特点是**共享包以源码形式被消费**（而非构建产物），这带来了：

- 包零构建时间
- 开发时即时更新
- 调试更简单（无需 source maps）
- 每个应用自行编译所使用的包

## 架构设计

### 目录结构

```
my-fe/
├── apps/                    # 独立应用（每个应用在自己的目录下运行）
│   ├── example-react/      # Vite + React 应用
│   ├── example-nextjs/     # Next.js 15 应用
│   ├── vue-app/            # Vue 3 应用（模板）
│   └── svelte-app/         # Svelte 5 应用（模板）
├── packages/               # 共享源码包（不发布到 npm）
│   ├── utils/              # 纯 TypeScript 工具函数
│   ├── ui-react/           # React 组件（源码）
│   ├── ui-vue/             # Vue 3 组件（源码）
│   ├── ui-svelte/          # Svelte 5 组件（源码）
│   ├── ui-nextjs/          # Next.js 专用组件
│   ├── config-typescript/  # 共享 TypeScript 配置
│   └── config-eslint/      # 共享 ESLint 配置
├── pnpm-workspace.yaml     # pnpm 工作区配置
├── turbo.json              # Turborepo 任务编排配置
├── package.json            # 根 package.json 及工作区脚本
└── .gitignore
```

### 包命名规范

所有共享包使用 `@my-fe/` 作用域：
- `@my-fe/utils` - 纯 TypeScript 工具函数
- `@my-fe/ui-react` - React 组件
- `@my-fe/ui-vue` - Vue 组件
- `@my-fe/ui-svelte` - Svelte 组件
- `@my-fe/ui-nextjs` - Next.js 组件
- `@my-fe/config-typescript` - TypeScript 配置
- `@my-fe/config-eslint` - ESLint 配置

## 优缺点分析

### 优势

#### 1. **包零构建时间**
- 无需单独构建包
- 应用在自己的构建过程中编译包
- 开发时即时反馈

#### 2. **简化的开发工作流**
- 编辑包代码 → 所有应用中的改动立即生效
- 包无需 watch 模式
- 无需 link 或重新构建包

#### 3. **更容易调试**
- 直接访问源代码
- 不需要 source maps
- TypeScript 错误显示实际代码位置

#### 4. **更好的类型安全**
- 应用和包使用相同的 TypeScript 版本
- 没有类型定义同步问题
- 工作区范围内即时类型检查

#### 5. **独立的应用部署**
- 每个应用完全自包含
- 应用可以使用不同的框架版本
- 应用之间没有共享的运行时依赖

#### 6. **更简单的工具链**
- 不需要包版本管理工具（如 Changesets）
- 没有 npm 发布流程
- 更简单的 CI/CD 配置

### 劣势

#### 1. **编译开销**
- 每个应用都要编译它使用的所有包
- 应用构建时间稍慢
- 如果多个应用使用同一个包，包会被编译多次

#### 2. **框架特定的约束**
- 某些框架需要显式的编译配置（例如 Next.js 的 `transpilePackages`）
- 可能需要配置打包工具来处理工作区包
- 某些打包工具优化可能出现问题

#### 3. **不适合公开发布**
- 无法轻松发布包到 npm
- 只能在 monorepo 内部使用
- 外部项目无法使用你的包

#### 4. **生产环境的 node_modules 更大**
- 每个应用都包含编译后的包代码
- 生产环境中应用之间无法共享依赖
- 部署体积稍大

#### 5. **类型检查复杂度**
- 需要 TypeScript 项目引用才能正确类型检查
- IDE 可能在大型工作区中有性能问题
- 可能需要配置 IDE 以获得更好的性能

#### 6. **破坏性变更的影响**
- 包的改动立即影响所有使用它的应用
- 应用之间没有版本隔离
- 需要在所有应用中仔细测试

## 快速开始

### 前置要求

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0

全局安装 pnpm：
```bash
npm install -g pnpm@latest
# 或
corepack enable
```

### 初始化设置

1. 克隆或导航到仓库：
```bash
cd /path/to/my-fe
```

2. 安装所有依赖（根 + 所有应用 + 所有包）：
```bash
pnpm install
```

这将会：
- 安装根工作区的依赖
- 安装 `apps/` 下所有应用的依赖
- 安装 `packages/` 下所有包的依赖
- 为工作区依赖创建符号链接

3. 验证安装：
```bash
pnpm typecheck
```

## 使用指南

### 开发模式运行应用

**每个应用在自己的目录下独立运行：**

```bash
# React 应用（Vite）
cd apps/example-react
pnpm dev
# → http://localhost:3000

# Next.js 应用
cd apps/example-nextjs
pnpm dev
# → http://localhost:3000
```

**实时更新：**
- 编辑 `packages/utils/src/index.ts` 中的代码
- 改动立即反映在所有运行中的应用
- 无需重新构建或重启

### 生产环境构建应用

```bash
# 构建特定应用
cd apps/example-react
pnpm build

# 从根目录一次构建所有应用
cd /path/to/my-fe
pnpm build
```

### 运行工作区命令

从**根目录**，你可以在所有应用中运行命令：

```bash
# 类型检查所有应用和包
pnpm typecheck

# 检查所有应用和包的代码规范
pnpm lint

# 格式化所有文件
pnpm format

# 运行测试（如果配置了）
pnpm test

# 清理所有构建产物和 node_modules
pnpm clean
```

Turborepo 将会：
- 尽可能并行运行任务
- 缓存结果以加快后续运行
- 只对有变更的包运行任务

### 在应用中添加共享包

1. 在应用的 `package.json` 中添加包：

```json
{
  "name": "my-new-app",
  "dependencies": {
    "@my-fe/utils": "workspace:*",
    "@my-fe/ui-react": "workspace:*"
  }
}
```

2. 安装依赖：
```bash
pnpm install
```

3. 在代码中导入和使用：
```typescript
import { formatDate, debounce } from '@my-fe/utils';
import { Button, Input } from '@my-fe/ui-react';

const formatted = formatDate(new Date());
```

### 框架特定配置

#### Vite（React、Vue、Svelte）
无需特殊配置。Vite 自动编译工作区包。

#### Next.js
在 `next.config.ts` 中将工作区包添加到 `transpilePackages`：

```typescript
const nextConfig = {
  transpilePackages: ['@my-fe/utils', '@my-fe/ui-react', '@my-fe/ui-nextjs'],
};
```

#### Webpack（如果使用）
配置以解析工作区包：

```javascript
module.exports = {
  resolve: {
    alias: {
      '@my-fe/utils': path.resolve(__dirname, '../../packages/utils/src'),
    },
  },
};
```

## 创建新应用

### 方式 1：使用框架 CLI

1. 导航到 apps 目录：
```bash
cd apps
```

2. 使用框架官方 CLI：
```bash
# React（Vite）
pnpm create vite my-react-app --template react-ts

# Next.js
pnpm create next-app my-nextjs-app

# Vue
pnpm create vue my-vue-app

# Svelte
pnpm create svelte my-svelte-app
```

3. 在 `package.json` 中添加工作区包：
```json
{
  "dependencies": {
    "@my-fe/utils": "workspace:*",
    "@my-fe/ui-react": "workspace:*"
  }
}
```

4. 安装依赖：
```bash
cd my-react-app
pnpm install
```

5. 配置框架特定设置（见上文的框架特定配置）

### 方式 2：手动设置

1. 创建目录：
```bash
mkdir apps/my-custom-app
cd apps/my-custom-app
```

2. 创建 `package.json`：
```json
{
  "name": "my-custom-app",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@my-fe/utils": "workspace:*"
  }
}
```

3. 创建 `tsconfig.json`：
```json
{
  "extends": "@my-fe/config-typescript/react.json",
  "include": ["src"]
}
```

4. 添加到 Turborepo（可选，已通过 `apps/*` 通配符配置）

## 创建新包

### 分步指南

1. 创建包目录：
```bash
mkdir packages/my-new-package
cd packages/my-new-package
```

2. 创建 `package.json`：
```json
{
  "name": "@my-fe/my-new-package",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "devDependencies": {
    "@my-fe/config-typescript": "workspace:*",
    "typescript": "^5.7.2"
  }
}
```

3. 创建 `tsconfig.json`：
```json
{
  "extends": "@my-fe/config-typescript/base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

4. 创建源码目录和文件：
```bash
mkdir src
touch src/index.ts
```

5. 在 `src/index.ts` 中添加导出：
```typescript
export function myFunction() {
  return 'Hello from my package!';
}
```

6. 在应用中使用：
```json
{
  "dependencies": {
    "@my-fe/my-new-package": "workspace:*"
  }
}
```

## 重要注意事项

### 1. 源码导出模式

**始终从源文件导出，而非构建文件：**

```json
{
  "main": "./src/index.ts",    // ✅ 源文件
  "types": "./src/index.ts",   // ✅ 源文件
  "exports": {
    ".": "./src/index.ts"      // ✅ 源文件
  }
}
```

**不要这样：**
```json
{
  "main": "./dist/index.js",   // ❌ 构建文件
}
```

### 2. 框架编译配置

某些框架需要显式的编译配置：

**Next.js** - 必须配置 `transpilePackages`：
```typescript
// next.config.ts
transpilePackages: ['@my-fe/utils', '@my-fe/ui-react']
```

**Vite** - 自动工作，无需配置

**Create React App** - 不推荐，请使用 Vite

### 3. TypeScript 项目引用

为了更好的 IDE 性能和类型检查，使用项目引用：

```json
// apps/my-app/tsconfig.json
{
  "references": [
    { "path": "../../packages/utils" },
    { "path": "../../packages/ui-react" }
  ]
}
```

### 4. 依赖管理

**在正确的层级安装依赖：**

- **共享开发工具**（TypeScript、ESLint、Prettier）→ 根 `package.json`
- **应用特定依赖** → 应用的 `package.json`
- **包的依赖** → 包的 `package.json` 或 `peerDependencies`

**工作区协议：**
```json
{
  "dependencies": {
    "@my-fe/utils": "workspace:*"  // ✅ 始终使用 workspace:*
  }
}
```

### 5. Git 工作流

**提交策略：**
- 包和应用在原子提交中一起提交
- 在提交包变更前测试所有受影响的应用
- 使用约定式提交以获得更好的历史记录

**示例：**
```bash
# 编辑 packages/utils/src/index.ts 后
cd apps/example-react && pnpm dev  # 测试应用 1
cd apps/example-nextjs && pnpm dev # 测试应用 2
git add packages/utils apps/
git commit -m "feat(utils): 添加新的日期格式化函数"
```

### 6. 性能优化

**对于大型工作区：**

1. **使用 pnpm 过滤：**
```bash
# 只对特定包运行命令
pnpm --filter example-react dev
pnpm --filter @my-fe/utils typecheck
```

2. **配置 IDE：**
```json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "search.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true
  }
}
```

3. **使用 Turborepo 缓存：**
```bash
# Turborepo 自动缓存任务结果
pnpm build  # 首次运行：慢
pnpm build  # 第二次运行：即时（已缓存）
```

### 7. 常见问题及解决方案

**问题："Cannot find module '@my-fe/utils'"**
- 解决：从根目录运行 `pnpm install` 以创建符号链接

**问题：Next.js 不编译工作区包**
- 解决：在 `next.config.ts` 中将包添加到 `transpilePackages`

**问题：IDE 中有 TypeScript 错误但构建正常**
- 解决：在 IDE 中重新加载 TypeScript 服务器或添加项目引用

**问题：包变更时热重载不工作**
- 解决：重启开发服务器（这是源码共享的限制）

**问题：不同 React 版本导致错误**
- 解决：使用 pnpm 的 `overrides` 强制使用单一 React 版本：
```json
{
  "pnpm": {
    "overrides": {
      "react": "^19.0.0",
      "react-dom": "^19.0.0"
    }
  }
}
```

### 8. 从现有项目迁移

将现有应用迁移到此 monorepo：

1. 复制应用到 `apps/my-app`
2. 更新 `package.json` name 为有作用域或唯一的名称
3. 用工作区包替换共享代码：
   ```bash
   pnpm add @my-fe/utils@workspace:*
   ```
4. 更新导入：
   ```typescript
   // 之前
   import { formatDate } from '../../../utils/date';

   // 之后
   import { formatDate } from '@my-fe/utils';
   ```
5. 配置框架编译（如果需要）
6. 从根目录运行 `pnpm install`

### 9. 部署考虑

**每个应用独立部署：**

- 构建应用：`cd apps/my-app && pnpm build`
- 部署 `dist/` 或 `.next/` 文件夹
- 无需单独部署包
- 每个应用包含自己编译后的包代码

**CI/CD 流水线示例：**
```yaml
# .github/workflows/deploy.yml
- name: 安装依赖
  run: pnpm install

- name: 构建应用
  run: pnpm --filter my-app build

- name: 部署
  run: # 你的部署命令
```

### 10. 何时不应使用此方案

如果满足以下情况，请考虑其他方案：

- 需要将包发布到 npm
- 有大量应用和包（>50 个）- 考虑使用构建后的包
- 需要应用之间的版本隔离
- 你的包非常大（每个 >10MB 源代码）
- 你正在构建供外部使用的库

## 技术栈

### 核心工具

- **包管理器**：[pnpm](https://pnpm.io/) v9+（工作区模式）
  - 快速、高效、严格
  - 使用内容寻址存储节省磁盘空间
  - 比 npm/yarn 更好的工作区支持

- **构建系统**：[Turborepo](https://turbo.build/) v2+
  - 并行任务执行
  - 智能缓存
  - 增量构建
  - 远程缓存支持（可选）

- **语言**：[TypeScript](https://www.typescriptlang.org/) 5.7+
  - 启用严格模式
  - 共享配置
  - 项目引用以获得更好的性能

- **代码质量**：
  - [ESLint](https://eslint.org/) 8+ with TypeScript 支持
  - [Prettier](https://prettier.io/) 3+ 代码格式化
  - 工作区范围内的共享配置

### 支持的框架

所有框架使用最新稳定版本：

- **React** 19+（Vite 6，废弃 Create React App）
- **Next.js** 15+（App Router）
- **Vue** 3.5+（Composition API）
- **Svelte** 5+（Runes API）

### 包架构

此 monorepo 使用 **"Internal Packages"** 或 **"JIT（即时编译）"** 模式：

```
┌─────────────┐
│   应用 1     │ ──┐
└─────────────┘   │
                  ├──> 编译 ──> @my-fe/utils（源码）
┌─────────────┐   │
│   应用 2     │ ──┘
└─────────────┘
```

每个应用在自己的构建过程中编译共享包，而不是使用预构建的产物。

## 快速参考

### 常用命令

```bash
# 根级别（工作区）
pnpm install              # 安装所有依赖
pnpm build                # 构建所有应用
pnpm dev                  # 运行所有应用（不推荐，建议单独运行）
pnpm typecheck            # 类型检查所有包
pnpm lint                 # 检查所有包
pnpm format               # 格式化所有文件
pnpm clean                # 清理所有构建产物

# 应用级别（单个应用）
cd apps/example-react
pnpm dev                  # 启动开发服务器
pnpm build                # 生产构建
pnpm preview              # 预览生产构建
pnpm typecheck            # 类型检查此应用
pnpm lint                 # 检查此应用

# 包级别
cd packages/utils
pnpm typecheck            # 类型检查此包
pnpm lint                 # 检查此包
```

### 文件结构快速指南

```
my-fe/
├── apps/                           # 所有应用
│   └── my-app/
│       ├── src/                    # 应用源代码
│       ├── package.json            # 应用依赖
│       ├── tsconfig.json           # 继承共享配置
│       └── vite.config.ts          # 框架配置
│
├── packages/                       # 所有共享包
│   └── my-package/
│       ├── src/
│       │   └── index.ts            # ⚠️ 导出源文件
│       ├── package.json            # main: "./src/index.ts"
│       └── tsconfig.json           # 继承共享配置
│
├── pnpm-workspace.yaml             # 工作区定义
├── turbo.json                      # 任务配置
├── package.json                    # 根依赖和脚本
├── .prettierrc                     # Prettier 配置
└── README.md                       # 本文件
```

## 资源

### 官方文档

- [pnpm Workspace](https://pnpm.io/workspaces)
- [Turborepo 手册](https://turbo.build/repo/docs)
- [TypeScript 项目引用](https://www.typescriptlang.org/docs/handbook/project-references.html)

### 框架特定指南

- [Vite](https://vite.dev/)
- [Next.js](https://nextjs.org/docs)
- [Vue 3](https://vuejs.org/)
- [Svelte 5](https://svelte.dev/)

### 相关模式

- [Monorepo 工具](https://monorepo.tools/) - Monorepo 工具对比
- [Vercel Monorepo 指南](https://vercel.com/docs/monorepos)

## 许可证

这是一个个人 monorepo 模板。可随意使用。

## 支持

如有问题或疑问：
1. 查看[重要注意事项](#重要注意事项)章节
2. 查看[常见问题](#7-常见问题及解决方案)
3. 阅读框架的官方文档
4. 在 Turborepo/pnpm 仓库中搜索类似问题

---

**最后更新**：2025 年 12 月
**维护者**：使用 Claude Code 构建
