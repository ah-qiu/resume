#!/usr/bin/env node

/**
 * 预构建脚本：在静态导出时临时重命名 API 目录
 * 这样可以避免 Next.js 尝试构建 API routes
 */

const fs = require('fs')
const path = require('path')

const apiDir = path.join(process.cwd(), 'app', 'api')
const apiDirBackup = path.join(process.cwd(), 'app', '_api_backup')

// 静态导出模式下，临时重命名 API 目录
if (fs.existsSync(apiDir)) {
  console.log('📦 静态导出模式：临时重命名 API 目录以避免构建错误...')

  // 如果备份目录已存在，先删除
  if (fs.existsSync(apiDirBackup)) {
    try {
      fs.rmSync(apiDirBackup, { recursive: true, force: true })
    } catch (e) {
      // 忽略错误
    }
  }

  try {
    // 重命名 API 目录
    fs.renameSync(apiDir, apiDirBackup)
    console.log('✅ API 目录已临时重命名为 _api_backup')
  } catch (e) {
    console.error('❌ 重命名 API 目录失败:', e.message)
    process.exit(1)
  }
} else {
  console.log('⚠️  API 目录不存在，跳过重命名')
}
