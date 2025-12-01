#!/usr/bin/env node

/**
 * 构建后脚本：恢复 API 目录名称
 */

const fs = require('fs')
const path = require('path')

const apiDir = path.join(process.cwd(), 'app', 'api')
const apiDirBackup = path.join(process.cwd(), 'app', '_api_backup')

// 恢复 API 目录
if (fs.existsSync(apiDirBackup)) {
  console.log('🔄 恢复 API 目录...')

  // 如果 API 目录存在，先删除
  if (fs.existsSync(apiDir)) {
    try {
      fs.rmSync(apiDir, { recursive: true, force: true })
    } catch (e) {
      console.warn('⚠️  删除现有 API 目录失败:', e.message)
    }
  }

  try {
    fs.renameSync(apiDirBackup, apiDir)
    console.log('✅ API 目录已恢复')
  } catch (e) {
    console.error('❌ 恢复 API 目录失败:', e.message)
    process.exit(1)
  }
} else {
  console.log('⚠️  备份目录不存在，跳过恢复')
}
