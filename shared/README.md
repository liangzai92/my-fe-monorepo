# @liangzai/shared

这是一个**源码共享包**，包含项目通用的工具函数和组件。

**注意：** 本包只提供 TypeScript 源码，**不提供** 编译后的 JS 文件。因此，任何引用本包的应用（App）都必须在其构建配置中显式处理对本包的编译。

## 目录结构

```
shared/
├── nextjs/    # Next.js 专用组件
├── node/      # Node.js 专用工具 (后端通用)
├── react/     # React 通用组件
├── svelte/    # Svelte 通用组件
├── utils/     # 纯 JS/TS 工具函数
├── vue/       # Vue 通用组件
└── package.json
```

## 使用指南

### 1. 安装依赖

在你的 App 目录下运行：

```bash
pnpm add @liangzai/shared --workspace
```

### 2. 构建配置

由于本包是源码发布，你需要在宿主应用的构建工具中配置转译（Transpilation）。

#### Next.js (next.config.ts / next.config.mjs)

在 `next.config.ts` 中添加 `transpilePackages` 选项：

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 关键配置：告诉 Next.js 编译这个包
  transpilePackages: ['@liangzai/shared'],
};

export default nextConfig;
```

#### Vite (vite.config.ts)

Vite 通常会自动处理 workspace 中的源码依赖，但为了确保万无一失（特别是涉及 SSR 或特殊构建时），建议检查以下几点：

1.  **无需额外配置**（大多数情况）：
    Vite 的预构建（Pre-bundling）通常能自动识别 workspace 链接。直接 `import` 即可。

2.  **如果遇到排除问题**：
    如果 Vite 尝试将包作为外部依赖处理而不是源码编译，可以使用 `optimizeDeps.exclude`（开发环境）或 `build.commonjsOptions` 等配置，但在 Monorepo 源码引用模式下，通常**什么都不用做**就是最佳实践，因为 `pnpm` 的软链接机制会让 Vite 把它当作源码文件处理。

    如果你使用了 SSR 框架（如 Vike / Vite-SSR），可能需要将其加入 `noExternal`：

    ```typescript
    // vite.config.ts (SSR 场景示例)
    export default defineConfig({
      ssr: {
        // 强制在服务端构建时编译此包，而不是作为外部依赖
        noExternal: ['@liangzai/shared'],
      },
    });
    ```

### 3. 引入代码

支持按包名引入（推荐）：

```typescript
// 引入工具函数
import { chunkArray } from "@liangzai/shared";

// 引入特定模块（如果在 package.json exports 中配置了）
// import { Button } from "@liangzai/shared/react";
```
