# 测试分支运行指南

## ✅ 已完成的操作

1. ✅ 创建了测试分支：`feat/github-pages-deploy`
2. ✅ 配置了 workflow 支持此分支
3. ✅ 提交了所有部署相关的更改
4. ✅ 推送代码到远程分支

## 🚀 下一步：测试部署

### 步骤 1：启用 GitHub Pages（如果还没启用）

1. 打开 GitHub 仓库：`https://github.com/ah-qiu/resume`
2. 点击 **Settings** → **Pages**
3. 在 **Source** 部分，选择 **GitHub Actions**
4. 保存设置

### 步骤 2：查看 GitHub Actions 运行状态

1. 在仓库页面，点击顶部的 **Actions** 标签
2. 您应该能看到一个新的 workflow 运行记录：
   - 名称：**Deploy to GitHub Pages**
   - 触发：由 `feat/github-pages-deploy` 分支的推送触发

3. **点击进入查看详细信息**
   - 查看构建日志
   - 等待构建完成（通常 2-5 分钟）

### 步骤 3：查看构建日志

在 Actions 页面中，点击 workflow 运行记录，您应该看到：

```
✓ Checkout
✓ Setup Node.js
✓ Setup pnpm
✓ Install dependencies
✓ Setup Pages
✓ Build with Next.js
✓ Check for static export
  → 应该看到：✓ 检测到静态导出输出目录 (out/)
✓ Upload artifact
✓ Deploy to GitHub Pages
```

### 步骤 4：访问测试网站

部署成功后，访问：
```
https://ah-qiu.github.io/resume/
```

**注意**：GitHub Pages 通常需要几分钟时间来更新，如果立即访问看不到，请等待几分钟后刷新。

## 🔍 如何验证部署成功

### 验证方法 1：检查 Actions 状态
- ✅ 所有步骤都显示绿色勾号
- ✅ 看到 "Deploy to GitHub Pages" 完成

### 验证方法 2：检查网站
- 访问 `https://ah-qiu.github.io/resume/`
- 能看到应用页面（不是 404）

### 验证方法 3：检查构建日志
在 Actions 日志中查找：
- ✅ "检测到静态导出输出目录 (out/)"
- ✅ "Upload artifact" 成功
- ✅ "Deploy to GitHub Pages" 成功

## 🐛 如果构建失败

### 常见错误 1：未找到 out 目录

**错误信息**：
```
✗ 未找到静态导出输出目录 (out/)
```

**解决方法**：
- 检查 `next.config.js` 中是否启用了 `output: 'export'`
- 查看构建日志中的错误信息

### 常见错误 2：环境变量未设置

**错误信息**：
- 构建成功但网站无法正常工作
- API 调用失败

**解决方法**：
- 确认已在 GitHub Secrets 中设置了所有环境变量
- 检查 Secrets 名称是否正确（区分大小写）

### 常见错误 3：分支不匹配

**错误信息**：
- Workflow 没有运行

**解决方法**：
- 确认 workflow 配置中包含了 `feat/github-pages-deploy` 分支
- 检查是否正确推送了代码

## 📝 手动触发 workflow（可选）

如果推送后 workflow 没有自动运行，可以手动触发：

1. 进入仓库的 **Actions** 标签页
2. 点击左侧的 **Deploy to GitHub Pages** workflow
3. 点击右上角的 **Run workflow** 按钮
4. 选择分支 `feat/github-pages-deploy`
5. 点击 **Run workflow** 执行

## 🎯 测试检查清单

- [ ] GitHub Pages 已启用（Settings → Pages → Source: GitHub Actions）
- [ ] 代码已推送到 `feat/github-pages-deploy` 分支
- [ ] Actions 中能看到 workflow 运行记录
- [ ] 构建成功（所有步骤都是绿色 ✅）
- [ ] 可以访问网站：`https://ah-qiu.github.io/resume/`
- [ ] 网站功能正常（API 调用、会话管理等）

## 🔄 测试完成后

如果测试成功，您可以：

1. **合并到主分支**
   ```bash
   git checkout main
   git merge feat/github-pages-deploy
   git push origin main
   ```

2. **或者继续在测试分支上开发**
   - 可以继续在此分支上测试和修复问题

3. **删除测试分支**（如果不再需要）
   ```bash
   git checkout main
   git branch -d feat/github-pages-deploy
   git push origin --delete feat/github-pages-deploy
   ```

## 📊 监控部署

### 查看部署历史
- 进入 **Settings** → **Pages**
- 查看 **Deployment history** 部分
- 可以看到所有部署记录和状态

### 查看部署日志
- 进入 **Actions** 标签页
- 点击任意一次运行记录
- 查看详细的构建和部署日志

## ⚡ 快速命令

```bash
# 查看当前分支
git branch

# 查看 workflow 状态（需要手动到 GitHub 查看）
# 或者使用 GitHub CLI（如果已安装）：
# gh run list

# 查看远程分支
git branch -r
```

## 🎉 完成测试

测试成功后，您的应用就已经成功部署到 GitHub Pages 了！

**访问地址**：`https://ah-qiu.github.io/resume/`

如果遇到任何问题，请查看：
- Actions 日志中的错误信息
- 浏览器控制台的错误
- 网络请求状态

