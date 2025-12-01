# GitHub Pages 部署 - 快速参考

## ✅ 已完成的配置

1. ✅ **Next.js 配置** (`next.config.js`)
   - 已添加 `basePath` 和 `assetPrefix` 配置
   - 已配置图片优化设置
   - 需要手动启用 `output: 'export'`

2. ✅ **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
   - 自动构建和部署流程
   - 环境变量支持
   - 静态导出检查

3. ✅ **客户端 Layout 示例** (`app/layout.static.tsx.example`)
   - 支持静态导出的 layout 版本
   - 客户端 locale 检测

4. ✅ **部署文档** (`docs/GITHUB_PAGES_DEPLOYMENT.md`)
   - 完整的部署指南
   - 限制说明
   - 修改步骤

## 🚀 部署前必做事项

### 1. 启用静态导出

编辑 `next.config.js`，找到：
```javascript
output: 'standalone',
```

改为：
```javascript
output: 'export',
```

### 2. 修改 Layout（支持静态导出）

选择以下方式之一：

**方式 A：使用示例文件**
```bash
cp app/layout.static.tsx.example app/layout.tsx
```

**方式 B：手动修改 `app/layout.tsx`**
- 将服务器组件改为客户端组件（添加 `'use client'`）
- 使用 `getLocaleOnClient()` 替代 `getLocaleOnServer()`

### 3. 处理 API Routes

当前项目使用 Next.js API Routes，GitHub Pages 不支持。

**选项 1：直接调用外部 API**
- 修改 `config/index.ts` 中的 `API_PREFIX`
- 直接指向外部 API URL
- 需要处理 CORS 和会话管理

**选项 2：使用外部 API 代理服务**
- 将 API routes 部署到 Vercel/Netlify
- 更新前端代码调用新地址

### 4. 配置 GitHub Secrets

在仓库 Settings → Secrets and variables → Actions 添加：
- `NEXT_PUBLIC_APP_ID`
- `NEXT_PUBLIC_APP_KEY`
- `NEXT_PUBLIC_API_URL`

### 5. 启用 GitHub Pages

在仓库 Settings → Pages：
- Source: 选择 **GitHub Actions**

### 6. 更新 basePath（如需要）

如果仓库名不是 `resume`，修改 `next.config.js`：
```javascript
basePath: process.env.NODE_ENV === 'production' ? '/您的仓库名' : '',
```

## 📝 部署命令

```bash
# 1. 提交更改
git add .
git commit -m "配置 GitHub Pages 部署"

# 2. 推送到 GitHub
git push origin main

# 3. 查看部署状态
# 进入仓库的 Actions 标签页
```

## 🔗 访问地址

部署成功后，访问：
```
https://[您的用户名].github.io/resume/
```

## ⚠️ 注意事项

1. **API Routes 限制**：GitHub Pages 不支持服务器端功能，必须移除或重构 API routes
2. **静态导出**：所有页面必须可以静态生成，不能使用 SSR
3. **环境变量**：需要在 GitHub Secrets 中配置，且必须以 `NEXT_PUBLIC_` 开头才能在客户端使用
4. **Base Path**：确保与仓库名匹配

## 📚 详细文档

查看 `docs/GITHUB_PAGES_DEPLOYMENT.md` 获取完整部署指南。

