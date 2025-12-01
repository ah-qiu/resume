# GitHub Pages 部署指南

本指南将帮助您将此 Next.js 项目部署到 GitHub Pages。

## ⚠️ 重要限制说明

**GitHub Pages 只能托管静态网站**，不支持：
- Next.js API Routes（`app/api/**` 目录下的路由）
- 服务器端渲染（SSR）
- 服务器组件

当前项目使用了 API Routes 作为代理层调用外部 API，要部署到 GitHub Pages，您需要进行以下修改：

## 需要的修改

### 1. 移除或重构 API Routes

当前项目在 `app/api/` 目录下有多个 API routes：
- `/api/chat-messages`
- `/api/conversations`
- `/api/file-upload`
- `/api/messages`
- `/api/parameters`

**选项 A：直接调用外部 API（推荐）**
- 修改 `service/base.ts` 中的 `API_PREFIX`，直接指向外部 API（如 Dify API）
- 在前端处理会话管理（session_id cookie）
- 更新所有 API 调用以直接访问外部 API

**选项 B：使用外部 API 服务**
- 将 API routes 部署到其他服务（如 Vercel Functions、Netlify Functions、或独立的 Node.js 服务）
- 更新前端代码以调用新的 API 地址

### 2. 修改 Next.js 配置

已为您配置了基础设置，但需要启用静态导出：

在 `next.config.js` 中：
```javascript
// 取消注释以下行以启用静态导出
output: 'export',
// 注释掉或删除：
// output: 'standalone',
```

### 3. 修改 Layout 以支持客户端 Locale

`app/layout.tsx` 当前使用了服务器端函数 `getLocaleOnServer()`，需要改为客户端实现。

已为您创建了客户端版本示例（见下方）。

### 4. 处理环境变量

在 GitHub 仓库设置中添加 Secrets：
- `NEXT_PUBLIC_APP_ID`
- `NEXT_PUBLIC_APP_KEY`
- `NEXT_PUBLIC_API_URL`

**详细步骤请参考：`docs/GITHUB_SECRETS_SETUP.md`**

#### 快速操作步骤：

1. 进入 GitHub 仓库页面，点击顶部的 **Settings**（设置）
2. 在左侧边栏点击 **Secrets and variables** → **Actions**
3. 点击 **New repository secret** 按钮
4. 依次添加以下 3 个环境变量：

   **变量 1：NEXT_PUBLIC_APP_ID**
   - Name: `NEXT_PUBLIC_APP_ID`
   - Value: 您的应用 ID（例如：`app-xxxxxxxxxxxxx`）

   **变量 2：NEXT_PUBLIC_APP_KEY**
   - Name: `NEXT_PUBLIC_APP_KEY`
   - Value: 您的 API Key（例如：`app-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

   **变量 3：NEXT_PUBLIC_API_URL**
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: 外部 API URL（例如：`https://api.dify.ai/v1`）

5. 每个变量添加后点击 **Add secret** 保存

**重要提示**：
- 变量名称必须完全匹配（区分大小写）
- API URL 应该包含 `/v1` 路径
- 设置后无法再查看 Secret 的值，只能更新或删除

## 部署步骤

### 第一步：完成代码修改

1. **重构 API Routes**（选择选项 A 或 B）
2. **启用静态导出**：修改 `next.config.js`
3. **修改 Layout**：使用客户端 locale 检测

### 第二步：配置 GitHub Pages

1. 进入 GitHub 仓库的 **Settings** → **Pages**
2. 在 **Source** 部分，选择 **GitHub Actions**
3. 确保仓库已启用 GitHub Pages

### 第三步：设置环境变量

1. 进入仓库的 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret** 按钮
3. 添加以下 Repository secrets：
   - **Name**: `NEXT_PUBLIC_APP_ID`
     **Value**: 您的应用 ID（例如：`app-xxxxxxxxxxxxx`）
   
   - **Name**: `NEXT_PUBLIC_APP_KEY`
     **Value**: 您的 API Key（例如：`app-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
   
   - **Name**: `NEXT_PUBLIC_API_URL`
     **Value**: 外部 API URL（例如：`https://api.dify.ai/v1`）

**详细步骤和说明请参考：`docs/GITHUB_SECRETS_SETUP.md`**

**操作路径**：
```
GitHub 仓库主页
  ↓
点击 "Settings" 标签
  ↓
左侧边栏 → "Secrets and variables" → "Actions"
  ↓
点击 "New repository secret"
  ↓
填写 Name 和 Value
  ↓
点击 "Add secret"
  ↓
重复添加其他变量
```

### 第四步：推送到 GitHub

```bash
git add .
git commit -m "配置 GitHub Pages 部署"
git push origin main  # 或您的分支名
```

### 第五步：查看部署

1. 进入仓库的 **Actions** 标签页
2. 查看部署 workflow 的状态
3. 部署成功后，访问：`https://[您的用户名].github.io/resume/`

## 更新 basePath

如果您的仓库名不是 `resume`，需要更新 `next.config.js` 中的 `basePath`：

```javascript
// 如果仓库名是 'my-app'，则设置为：
basePath: process.env.NODE_ENV === 'production' ? '/my-app' : '',
assetPrefix: process.env.NODE_ENV === 'production' ? '/my-app' : '',
```

## 常见问题

### Q: 为什么需要移除 API Routes？
A: GitHub Pages 只能托管静态 HTML/CSS/JS 文件，不支持服务器端代码执行。

### Q: 如何直接调用外部 API？
A: 修改 `config/index.ts` 中的 `API_PREFIX`，将其从 `/api` 改为外部 API 的完整 URL。然后更新会话管理逻辑到客户端。

### Q: 部署后页面 404？
A: 检查 `basePath` 配置是否正确，确保与仓库名匹配。

### Q: 构建失败？
A: 检查是否已启用 `output: 'export'`，并确保没有使用服务器端功能。

## 快速开始（最小化修改方案）

如果您想快速测试部署，可以使用以下最小化修改方案：

### 步骤 1：启用静态导出

修改 `next.config.js`：

```javascript
// 注释掉或删除：
// output: 'standalone',

// 添加：
output: 'export',
```

### 步骤 2：暂时禁用 API Routes（测试用）

暂时将 `config/index.ts` 中的 `API_PREFIX` 改为直接指向外部 API：

```javascript
// 临时修改为直接调用外部 API（需要处理 CORS）
export const API_PREFIX = process.env.NEXT_PUBLIC_API_URL || 'https://api.dify.ai/v1'
```

**注意**：这需要外部 API 支持 CORS，否则会失败。

### 步骤 3：使用客户端 Layout

将 `app/layout.static.tsx.example` 复制为 `app/layout.tsx`（或手动应用其中的更改）。

### 步骤 4：本地测试

```bash
# 设置环境变量（或创建 .env.local）
export NEXT_PUBLIC_APP_ID="your-app-id"
export NEXT_PUBLIC_APP_KEY="your-api-key"
export NEXT_PUBLIC_API_URL="https://api.dify.ai/v1"

# 构建静态文件
pnpm run build

# 测试静态文件（静态文件将在 out 目录生成）
npx serve out

# 访问 http://localhost:3000/resume（根据您的 basePath 调整）
```

如果本地测试成功，可以继续部署到 GitHub Pages。

## 下一步

完成上述修改后，您可以使用以下命令本地测试静态导出：

```bash
# 确保已修改 next.config.js 启用 output: 'export'
pnpm run build
# 静态文件将在 out 目录生成
```

然后使用静态文件服务器测试：
```bash
npx serve out
```

访问 `http://localhost:3000/resume`（根据您的 basePath 调整）进行测试。

