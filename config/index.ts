import type { AppInfo } from '@/types/app'
export const APP_ID = `${process.env.NEXT_PUBLIC_APP_ID}`
export const API_KEY = `${process.env.NEXT_PUBLIC_APP_KEY}`
export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`
export const APP_INFO: AppInfo = {
  title: '简历匹配助手',
  description: '简历匹配助手',
  copyright: '',
  privacy_policy: '',
  default_language: 'zh-Hans',
  disable_session_same_site: false, // set it to true if you want to embed the chatbot in an iframe
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a javascript console.'

// 如果设置了外部 API URL，直接使用；否则使用本地 API routes
// 对于 GitHub Pages 部署，需要设置为外部 API URL
export const API_PREFIX = API_URL || '/api'

// 是否使用直接 API 调用（绕过 Next.js API routes）
export const USE_DIRECT_API = !!API_URL

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
