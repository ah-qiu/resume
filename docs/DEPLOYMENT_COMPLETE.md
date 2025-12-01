# GitHub Pages 部署完成指南

## ✅ 已完成的修改

所有必要的代码修改已完成，项目现在可以部署到 GitHub Pages。

### 1. 静态导出配置 ✅
- `next.config.js` 已启用 `output: 'export'`
- 配置了 `basePath` 和 `assetPrefix` 为 `/resume`
- 禁用了图片优化

### 2. 客户端布局 ✅
- `app/layout.tsx` 已改为客户端组件
- 使用客户端 locale 检测替代服务器端

### 3. 直接 API 调用支持 ✅
- `service/base.ts` 已支持直接调用外部 API
- 自动添加 API key 到请求头
- 自动添加用户标识符到请求
- 支持所有 API 端点（chat-messages, conversations, messages, parameters, file-upload）

### 4. 客户端会话管理 ✅
- `utils/session.ts` 提供客户端会话管理
- 自动生成和管理 session_id cookie
- 生成用户标识符格式：`user_${APP_ID}:${sessionId}`

### 5. GitHub Actions Workflow ✅
- `.github/workflows/deploy.yml` 已配置
- 自动构建和部署流程
- 环境变量支持

## 🚀 部署步骤

### 步骤 1：设置环境变量

在 GitHub 仓库中添加以下 Secrets：

1. 进入仓库 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**，添加：

   - **Name**: `NEXT_PUBLIC_APP_ID`
     **Value**: 您的应用 ID

   - **Name**: `NEXT_PUBLIC_APP_KEY`
     **Value**: 您的 API Key

   - **Name**: `NEXT_PUBLIC_API_URL`
     **Value**: 外部 API URL（例如：`https://api.dify.ai/v1`）

### 步骤 2：启用 GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. 在 **Source** 部分，选择 **GitHub Actions**
3. 保存设置

### 步骤 3：推送代码

```bash
git add .
git commit -m "配置 GitHub Pages 部署：支持直接 API 调用和静态导出"
git push origin main  # 或您的主分支名
```

### 步骤 4：查看部署

1. 进入仓库的 **Actions** 标签页
2. 查看部署 workflow 的状态
3. 等待构建完成（通常需要 2-5 分钟）

### 步骤 5：访问网站

部署成功后，访问：
```
https://ah-qiu.github.io/resume/
```

## 📝 重要说明

### API 调用方式

当设置了 `NEXT_PUBLIC_API_URL` 环境变量时，应用会**自动切换到直接 API 调用模式**，绕过 Next.js API routes。

- ✅ 直接调用外部 API（GitHub Pages 部署）
- ✅ 使用 API key 进行认证
- ✅ 客户端管理会话
- ✅ 支持所有功能（聊天、文件上传、会话管理等）

### 本地开发

如果您想在本地测试直接 API 调用，创建 `.env.local` 文件：

```env
NEXT_PUBLIC_APP_ID=your-app-id
NEXT_PUBLIC_APP_KEY=your-api-key
NEXT_PUBLIC_API_URL=https://api.dify.ai/v1
```

然后运行：
```bash
pnpm run build
pnpm run start
```

### 切换回本地 API Routes

如果需要切换回使用本地 API routes，只需：

1. 移除或注释掉 `.env.local` 中的 `NEXT_PUBLIC_API_URL`
2. 或者将其设置为空字符串

应用会自动切换回使用 `/api` 路径的本地 API routes。

## 🔧 故障排除

### 构建失败

1. **检查环境变量**：确保所有 Secrets 都已正确设置
2. **检查分支名**：确保 workflow 文件中的分支名与您的默认分支匹配
3. **查看构建日志**：在 Actions 标签页中查看详细的错误信息

### 页面显示 404

1. **检查 basePath**：确保 `next.config.js` 中的 `basePath` 与仓库名匹配
2. **检查部署状态**：确保 GitHub Pages 部署成功

### API 调用失败

1. **检查 CORS**：确保外部 API 支持跨域请求
2. **检查 API Key**：验证 API key 是否正确
3. **检查 API URL**：确保 `NEXT_PUBLIC_API_URL` 格式正确（应以 `/v1` 结尾）

### 会话管理问题

1. **检查 Cookie 设置**：确保浏览器允许第三方 Cookie（如果需要）
2. **检查域名**：GitHub Pages 域名可能会影响 Cookie 的设置

## 📚 相关文件

- 配置文件：`next.config.js`
- 服务层：`service/base.ts`
- 会话管理：`utils/session.ts`
- 部署流程：`.github/workflows/deploy.yml`
- 详细文档：`docs/GITHUB_PAGES_DEPLOYMENT.md`

## 🎉 完成

完成以上步骤后，您的应用应该已经成功部署到 GitHub Pages 了！

如果遇到任何问题，请检查：
1. GitHub Actions 日志
2. 浏览器控制台错误
3. 网络请求状态

