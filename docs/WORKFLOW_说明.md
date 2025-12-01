# Workflow 说明 - 为什么看到 main 分支

## 🔍 问题分析

您看到的 **"pages build and deployment"** 是 GitHub Pages 的**默认自动 workflow**，它会：
- 自动在 main 分支上运行
- 使用 Jekyll 构建（如果检测到）
- 这是一个**旧的工作流**，不是我们新创建的

## ✅ 我们的 Workflow

我们创建的 workflow 名称是：**"Deploy to GitHub Pages"**

### 如何查看我们的 Workflow

1. **进入 Actions 页面**
   - 访问：`https://github.com/ah-qiu/resume/actions`

2. **查看左侧边栏**
   - 您应该能看到两个 workflow：
     - `pages build and deployment`（GitHub 默认）
     - `Deploy to GitHub Pages`（我们创建的）← **这个才是我们要看的**

3. **查看 Workflow 运行记录**
   - 点击 **"Deploy to GitHub Pages"**
   - 查看是否有来自 `feat/github-pages-deploy` 分支的运行记录

## 🔧 如果看不到我们的 Workflow

### 方法 1：检查 workflow 文件是否存在

确认 `.github/workflows/deploy.yml` 文件已经推送：

```bash
# 查看远程分支中的文件
git ls-tree -r origin/feat/github-pages-deploy --name-only | grep deploy.yml
```

应该看到：`.github/workflows/deploy.yml`

### 方法 2：手动触发 Workflow

如果推送后没有自动运行，可以手动触发：

1. 进入 Actions 页面
2. 点击左侧的 **"Deploy to GitHub Pages"**
3. 点击右上角的 **"Run workflow"** 按钮
4. 选择分支：`feat/github-pages-deploy`
5. 点击 **"Run workflow"**

### 方法 3：再次推送代码触发

如果 workflow 文件确实已经推送，但还没有运行：

```bash
# 做一个小的更改来触发 workflow
echo "" >> README.md
git add README.md
git commit -m "chore: trigger workflow"
git push origin feat/github-pages-deploy
```

## 📊 两个 Workflow 的区别

| 特性 | pages build and deployment (默认) | Deploy to GitHub Pages (我们的) |
|------|--------------------------------|---------------------------|
| 来源 | GitHub 自动创建 | 我们手动创建 |
| 构建方式 | Jekyll | Next.js 静态导出 |
| 配置文件 | 无 | `.github/workflows/deploy.yml` |
| 支持的构建 | 静态 HTML/Jekyll | Next.js 静态导出 |
| 分支触发 | main（自动） | main, feat/github-pages-deploy |

## ⚠️ 禁用默认 Workflow（可选）

如果您想禁用 GitHub 的默认 workflow：

1. 进入仓库 **Settings** → **Pages**
2. 在 **Build and deployment** 部分
3. **Source** 选择 **GitHub Actions**（使用我们自己的 workflow）
4. 这样默认的 "pages build and deployment" 就不会运行了

## ✅ 正确的检查步骤

1. **确认 workflow 文件已推送**
   ```bash
   git log origin/feat/github-pages-deploy --name-only | grep deploy.yml
   ```

2. **查看 Actions 页面**
   - 点击左侧的 **"Deploy to GitHub Pages"**（不是 "pages build and deployment"）

3. **查看运行记录**
   - 应该看到来自 `feat/github-pages-deploy` 分支的运行

4. **如果没有运行，手动触发**
   - Actions → Deploy to GitHub Pages → Run workflow

## 🎯 总结

- ❌ **"pages build and deployment"** = GitHub 默认 workflow（main 分支）
- ✅ **"Deploy to GitHub Pages"** = 我们创建的 workflow（支持测试分支）

请查看 **"Deploy to GitHub Pages"** workflow 来查看测试分支的部署状态！

