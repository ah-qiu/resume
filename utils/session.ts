// 客户端会话管理工具
import Cookies from 'js-cookie'
import { v4 } from 'uuid'
import { APP_ID } from '@/config'

const SESSION_COOKIE_NAME = 'session_id'
const userPrefix = `user_${APP_ID}:`

/**
 * 获取或创建会话 ID
 */
export const getOrCreateSessionId = (): string => {
  let sessionId = Cookies.get(SESSION_COOKIE_NAME)
  if (!sessionId) {
    sessionId = v4()
    Cookies.set(SESSION_COOKIE_NAME, sessionId, {
      expires: 365, // 1 年
      sameSite: 'Lax',
    })
  }
  return sessionId
}

/**
 * 获取用户标识符（格式: user_${APP_ID}:${sessionId}）
 */
export const getUserIdentifier = (): string => {
  const sessionId = getOrCreateSessionId()
  return `${userPrefix}${sessionId}`
}

/**
 * 获取会话 ID
 */
export const getSessionId = (): string | undefined => {
  return Cookies.get(SESSION_COOKIE_NAME) || undefined
}
