# GitHub Secrets 环境变量设置指南

本指南将详细说明如何在 GitHub 仓库中设置环境变量（Secrets）。

## 📍 在哪里设置

环境变量需要在 **GitHub 仓库的 Settings** 中设置，具体路径为：

**Settings** → **Secrets and variables** → **Actions** → **Repository secrets**

## 🚀 详细操作步骤

### 第一步：进入仓库设置页面

1. 打开您的 GitHub 仓库页面
   - 例如：`https://github.com/ah-qiu/resume`

2. 点击仓库页面顶部的 **Settings**（设置）标签
   - 如果没有看到 Settings，请确认您有仓库的管理权限

3. 在左侧边栏中找到并点击 **Secrets and variables**
   - 展开后点击 **Actions**

### 第二步：添加环境变量

您需要添加以下 3 个环境变量：

#### 1. 添加 `NEXT_PUBLIC_APP_ID`

1. 在 **Repository secrets** 页面，点击右上角的 **New repository secret** 按钮

2. 填写表单：
   - **Name**（名称）：输入 `NEXT_PUBLIC_APP_ID`
   - **Secret**（值）：输入您的应用 ID
     - 例如：`app-xxxxxxxxxxxxx`
     - 这是您在 Dify 或其他平台创建应用时获得的 ID

3. 点击 **Add secret** 按钮保存

#### 2. 添加 `NEXT_PUBLIC_APP_KEY`

1. 再次点击 **New repository secret** 按钮

2. 填写表单：
   - **Name**（名称）：输入 `NEXT_PUBLIC_APP_KEY`
   - **Secret**（值）：输入您的 API Key
     - 例如：`app-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
     - 这是您的 API 访问密钥，请妥善保管

3. 点击 **Add secret** 按钮保存

#### 3. 添加 `NEXT_PUBLIC_API_URL`

1. 再次点击 **New repository secret** 按钮

2. 填写表单：
   - **Name**（名称）：输入 `NEXT_PUBLIC_API_URL`
   - **Secret**（值）：输入外部 API 的基础 URL
     - 示例值：
       - Dify 云服务：`https://api.dify.ai/v1`
       - 自建服务：`https://your-domain.com/v1`
     - **注意**：URL 应该包含 `/v1` 路径，且**不要**以斜杠结尾

3. 点击 **Add secret** 按钮保存

### 第三步：验证设置

设置完成后，您应该能看到 3 个 secrets 列表：

```
Repository secrets (3)
  NEXT_PUBLIC_APP_ID      Updated 1 minute ago
  NEXT_PUBLIC_APP_KEY     Updated 1 minute ago
  NEXT_PUBLIC_API_URL     Updated 1 minute ago
```

## 📸 操作流程示意

```
GitHub 仓库主页
  ↓
点击 "Settings" 标签
  ↓
左侧边栏 → "Secrets and variables"
  ↓
展开并点击 "Actions"
  ↓
点击 "New repository secret"
  ↓
填写 Name 和 Secret 值
  ↓
点击 "Add secret"
  ↓
重复上述步骤添加其他变量
```

## ⚠️ 重要注意事项

### 1. 变量名称必须完全匹配

环境变量的名称必须**完全一致**（区分大小写）：
- ✅ `NEXT_PUBLIC_APP_ID`
- ❌ `NEXT_PUBLIC_APPID`
- ❌ `next_public_app_id`
- ❌ `NEXT_PUBLIC_APP_ID_`（末尾多了下划线）

### 2. API URL 格式

- ✅ **正确**：`https://api.dify.ai/v1`
- ✅ **正确**：`https://api.dify.ai/v1/`（有斜杠也可以）
- ❌ **错误**：`https://api.dify.ai`（缺少 `/v1` 路径）
- ❌ **错误**：`https://api.dify.ai/v1/`（注意不要有多余内容）

### 3. 安全性

- ⚠️ **API Key 是敏感信息**，请勿在代码中硬编码
- ⚠️ **不要**将包含 API Key 的 `.env.local` 文件提交到仓库
- ✅ Secrets 的值在 GitHub 中是加密存储的
- ✅ 一旦添加，您就无法再查看 Secrets 的值（只能更新或删除）

### 4. 权限要求

- 只有拥有仓库**管理员权限**的用户才能添加或修改 Secrets
- 如果您是协作者但没有管理员权限，请联系仓库所有者

## 🔄 如何更新或删除 Secrets

### 更新 Secret

1. 进入 **Settings** → **Secrets and variables** → **Actions**
2. 找到要更新的 Secret，点击右侧的 **Update** 按钮
3. 输入新值并保存

### 删除 Secret

1. 进入 **Settings** → **Secrets and variables** → **Actions**
2. 找到要删除的 Secret，点击右侧的 **Delete** 按钮
3. 确认删除

## 🔍 如何检查 Secrets 是否生效

设置完 Secrets 后，您可以通过以下方式验证：

### 方法 1：查看 GitHub Actions 日志

1. 推送代码后，进入仓库的 **Actions** 标签
2. 点击最新的 workflow 运行记录
3. 查看构建日志，应该能看到环境变量被正确使用

### 方法 2：在 workflow 中添加调试步骤（可选）

在 `.github/workflows/deploy.yml` 中添加一个临时步骤来检查：

```yaml
- name: Check environment variables
  run: |
    echo "APP_ID is set: ${{ secrets.NEXT_PUBLIC_APP_ID != '' }}"
    echo "API_URL is set: ${{ secrets.NEXT_PUBLIC_API_URL != '' }}"
```

**注意**：不要输出 Secrets 的实际值，只检查是否设置。

## 🐛 常见问题

### Q: 看不到 Settings 选项？

**A**: 请确认：
- 您已经登录 GitHub 账户
- 您有仓库的管理权限
- 仓库不是 fork 的（fork 的仓库某些设置受限）

### Q: 找不到 "Secrets and variables"？

**A**: 
- 确认您有仓库的管理员权限
- 某些组织可能有权限限制
- 尝试刷新页面

### Q: Secrets 设置后还是不生效？

**A**: 检查：
1. 变量名称是否正确（完全匹配，包括大小写）
2. 是否已经推送代码触发 workflow
3. 查看 Actions 日志中的错误信息

### Q: 如何获取 API Key？

**A**: 
- 对于 Dify：进入应用设置 → API Access → 创建新的 API Key
- 对于其他服务：参考相应服务的文档

## 📚 相关文档

- [GitHub 官方文档：加密的 Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- 部署完成指南：`docs/DEPLOYMENT_COMPLETE.md`
- 快速参考：`docs/GITHUB_PAGES_QUICK_START.md`

## ✅ 完成检查清单

设置完成后，请确认：

- [ ] `NEXT_PUBLIC_APP_ID` 已添加
- [ ] `NEXT_PUBLIC_APP_KEY` 已添加
- [ ] `NEXT_PUBLIC_API_URL` 已添加
- [ ] 所有变量名称拼写正确
- [ ] API URL 格式正确（包含 `/v1`）
- [ ] 已保存所有更改

完成以上步骤后，您的环境变量就设置好了！接下来可以继续部署流程。

