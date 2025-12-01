import { API_PREFIX, API_KEY, API_URL, USE_DIRECT_API } from '@/config'
import { getUserIdentifier } from '@/utils/session'
import Toast from '@/app/components/base/toast'
import type { AnnotationReply, MessageEnd, MessageReplace, ThoughtItem } from '@/app/components/chat/type'
import type { VisionFile } from '@/types/app'

const TIME_OUT = 100000

const ContentType = {
  json: 'application/json',
  stream: 'text/event-stream',
  form: 'application/x-www-form-urlencoded; charset=UTF-8',
  download: 'application/octet-stream', // for download
}

// API 路径映射：从内部路径映射到 Dify API 路径
const API_PATH_MAP: Record<string, string> = {
  'chat-messages': 'chat-messages',
  'conversations': 'conversations',
  'messages': 'messages',
  'parameters': 'parameters',
  'file-upload': 'files/upload',
}

// 获取实际的 API 路径
const getApiPath = (url: string): string => {
  if (!USE_DIRECT_API || !API_URL) {
    return url // 使用本地 API routes
  }

  // 移除前导斜杠
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url
  // 映射到 Dify API 路径
  const mappedPath = API_PATH_MAP[cleanUrl] || cleanUrl

  // 如果 API_URL 以 /v1 结尾，不需要再加 /v1
  const baseUrl = API_URL.endsWith('/v1') ? API_URL : `${API_URL}/v1`
  return `${baseUrl}/${mappedPath}`
}

const getBaseHeaders = (): Headers => {
  const headers = new Headers({
    'Content-Type': ContentType.json,
  })

  // 如果使用直接 API，添加 Authorization header
  if (USE_DIRECT_API && API_KEY) {
    headers.set('Authorization', `Bearer ${API_KEY}`)
  }

  return headers
}

const baseOptions = {
  method: 'GET',
  mode: 'cors',
  credentials: USE_DIRECT_API ? 'omit' as RequestCredentials : 'include', // 直接 API 不需要 cookies
  headers: getBaseHeaders(),
  redirect: 'follow',
}

export interface WorkflowStartedResponse {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    workflow_id: string
    sequence_number: number
    created_at: number
  }
}

export interface WorkflowFinishedResponse {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    workflow_id: string
    status: string
    outputs: any
    error: string
    elapsed_time: number
    total_tokens: number
    total_steps: number
    created_at: number
    finished_at: number
  }
}

export interface NodeStartedResponse {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    node_id: string
    node_type: string
    index: number
    predecessor_node_id?: string
    inputs: any
    created_at: number
    extras?: any
  }
}

export interface NodeFinishedResponse {
  task_id: string
  workflow_run_id: string
  event: string
  data: {
    id: string
    node_id: string
    node_type: string
    index: number
    predecessor_node_id?: string
    inputs: any
    process_data: any
    outputs: any
    status: string
    error: string
    elapsed_time: number
    execution_metadata: {
      total_tokens: number
      total_price: number
      currency: string
    }
    created_at: number
  }
}

export interface IOnDataMoreInfo {
  conversationId?: string
  taskId?: string
  messageId: string
  errorMessage?: string
  errorCode?: string
}

export type IOnData = (message: string, isFirstMessage: boolean, moreInfo: IOnDataMoreInfo) => void
export type IOnThought = (though: ThoughtItem) => void
export type IOnFile = (file: VisionFile) => void
export type IOnMessageEnd = (messageEnd: MessageEnd) => void
export type IOnMessageReplace = (messageReplace: MessageReplace) => void
export type IOnAnnotationReply = (messageReplace: AnnotationReply) => void
export type IOnCompleted = (hasError?: boolean) => void
export type IOnError = (msg: string, code?: string) => void
export type IOnWorkflowStarted = (workflowStarted: WorkflowStartedResponse) => void
export type IOnWorkflowFinished = (workflowFinished: WorkflowFinishedResponse) => void
export type IOnNodeStarted = (nodeStarted: NodeStartedResponse) => void
export type IOnNodeFinished = (nodeFinished: NodeFinishedResponse) => void

interface IOtherOptions {
  isPublicAPI?: boolean
  bodyStringify?: boolean
  needAllResponseContent?: boolean
  deleteContentType?: boolean
  onData?: IOnData // for stream
  onThought?: IOnThought
  onFile?: IOnFile
  onMessageEnd?: IOnMessageEnd
  onMessageReplace?: IOnMessageReplace
  onError?: IOnError
  onCompleted?: IOnCompleted // for stream
  getAbortController?: (abortController: AbortController) => void
  onWorkflowStarted?: IOnWorkflowStarted
  onWorkflowFinished?: IOnWorkflowFinished
  onNodeStarted?: IOnNodeStarted
  onNodeFinished?: IOnNodeFinished
}

function unicodeToChar(text: string) {
  return text.replace(/\\u[0-9a-f]{4}/g, (_match, p1) => {
    return String.fromCharCode(parseInt(p1, 16))
  })
}

const handleStream = (
  response: Response,
  onData: IOnData,
  onCompleted?: IOnCompleted,
  onThought?: IOnThought,
  onMessageEnd?: IOnMessageEnd,
  onMessageReplace?: IOnMessageReplace,
  onFile?: IOnFile,
  onWorkflowStarted?: IOnWorkflowStarted,
  onWorkflowFinished?: IOnWorkflowFinished,
  onNodeStarted?: IOnNodeStarted,
  onNodeFinished?: IOnNodeFinished,
) => {
  if (!response.ok) { throw new Error('Network response was not ok') }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let bufferObj: Record<string, any>
  let isFirstMessage = true
  function read() {
    let hasError = false
    reader?.read().then((result: any) => {
      if (result.done) {
        onCompleted && onCompleted()
        return
      }
      buffer += decoder.decode(result.value, { stream: true })
      const lines = buffer.split('\n')
      try {
        lines.forEach((message) => {
          if (message.startsWith('data: ')) { // check if it starts with data:
            try {
              bufferObj = JSON.parse(message.substring(6)) as Record<string, any>// remove data: and parse as json
            }
            catch {
              // mute handle message cut off
              onData('', isFirstMessage, {
                conversationId: bufferObj?.conversation_id,
                messageId: bufferObj?.message_id,
              })
              return
            }
            if (bufferObj.status === 400 || !bufferObj.event) {
              onData('', false, {
                conversationId: undefined,
                messageId: '',
                errorMessage: bufferObj?.message,
                errorCode: bufferObj?.code,
              })
              hasError = true
              onCompleted?.(true)
              return
            }
            if (bufferObj.event === 'message' || bufferObj.event === 'agent_message') {
              // can not use format here. Because message is splited.
              onData(unicodeToChar(bufferObj.answer), isFirstMessage, {
                conversationId: bufferObj.conversation_id,
                taskId: bufferObj.task_id,
                messageId: bufferObj.id,
              })
              isFirstMessage = false
            }
            else if (bufferObj.event === 'agent_thought') {
              onThought?.(bufferObj as ThoughtItem)
            }
            else if (bufferObj.event === 'message_file') {
              onFile?.(bufferObj as VisionFile)
            }
            else if (bufferObj.event === 'message_end') {
              onMessageEnd?.(bufferObj as MessageEnd)
            }
            else if (bufferObj.event === 'message_replace') {
              onMessageReplace?.(bufferObj as MessageReplace)
            }
            else if (bufferObj.event === 'workflow_started') {
              onWorkflowStarted?.(bufferObj as WorkflowStartedResponse)
            }
            else if (bufferObj.event === 'workflow_finished') {
              onWorkflowFinished?.(bufferObj as WorkflowFinishedResponse)
            }
            else if (bufferObj.event === 'node_started') {
              onNodeStarted?.(bufferObj as NodeStartedResponse)
            }
            else if (bufferObj.event === 'node_finished') {
              onNodeFinished?.(bufferObj as NodeFinishedResponse)
            }
          }
        })
        buffer = lines[lines.length - 1]
      }
      catch (e) {
        onData('', false, {
          conversationId: undefined,
          messageId: '',
          errorMessage: `${e}`,
        })
        hasError = true
        onCompleted?.(true)
        return
      }
      if (!hasError) { read() }
    })
  }
  read()
}

const baseFetch = (url: string, fetchOptions: any, { needAllResponseContent }: IOtherOptions) => {
  const options = Object.assign({}, baseOptions, fetchOptions)

  // 更新 headers（可能被 fetchOptions 覆盖）
  const headers = getBaseHeaders()
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => headers.set(key, value))
    } else {
      Object.keys(options.headers).forEach((key) => {
        headers.set(key, options.headers[key])
      })
    }
  }
  options.headers = headers

  // 构建 URL
  let urlWithPrefix: string
  if (USE_DIRECT_API && API_URL) {
    // 直接调用外部 API
    urlWithPrefix = getApiPath(url)
  } else {
    // 使用本地 API routes
    const urlPrefix = API_PREFIX
    urlWithPrefix = `${urlPrefix}${url.startsWith('/') ? url : `/${url}`}`
  }

  const { method, params, body } = options
  const queryParams: string[] = []

  // 添加用户标识符（如果使用直接 API）
  if (USE_DIRECT_API) {
    const user = getUserIdentifier()
    if (method === 'GET') {
      queryParams.push(`user=${encodeURIComponent(user)}`)
    }
  }

  // handle query
  if (method === 'GET' && params) {
    Object.keys(params).forEach(key =>
      queryParams.push(`${key}=${encodeURIComponent(params[key])}`),
    )
    delete options.params
  }

  // 添加查询参数
  if (queryParams.length > 0) {
    const separator = urlWithPrefix.includes('?') ? '&' : '?'
    urlWithPrefix += `${separator}${queryParams.join('&')}`
  }

  // 处理请求体，添加用户标识符（POST/PUT/DELETE）
  let requestBody = body
  if (USE_DIRECT_API && body && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
    try {
      const bodyObj = typeof body === 'string' ? JSON.parse(body) : body
      // 对于 DELETE，如果 body 为空对象，可以跳过
      if (bodyObj && typeof bodyObj === 'object' && Object.keys(bodyObj).length > 0) {
        if (!bodyObj.user) {
          bodyObj.user = getUserIdentifier()
        }
        requestBody = bodyObj
      }
    } catch {
      // 如果不是 JSON，保持原样
      requestBody = body
    }
  }

  if (requestBody && (!USE_DIRECT_API || (typeof requestBody === 'object' && Object.keys(requestBody).length > 0))) {
    options.body = JSON.stringify(requestBody)
  }

  // Handle timeout
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('request timeout'))
      }, TIME_OUT)
    }),
    new Promise((resolve, reject) => {
      globalThis.fetch(urlWithPrefix, options)
        .then((res: any) => {
          const resClone = res.clone()
          // Error handler
          if (!/^(2|3)\d{2}$/.test(res.status)) {
            try {
              const bodyJson = res.json()
              switch (res.status) {
                case 401: {
                  Toast.notify({ type: 'error', message: 'Invalid token' })
                  return
                }
                default:
                  // eslint-disable-next-line no-new
                  new Promise(() => {
                    bodyJson.then((data: any) => {
                      Toast.notify({ type: 'error', message: data.message })
                    })
                  })
              }
            }
            catch (e) {
              Toast.notify({ type: 'error', message: `${e}` })
            }

            return Promise.reject(resClone)
          }

          // handle delete api. Delete api not return content.
          if (res.status === 204) {
            resolve({ result: 'success' })
            return
          }

          // return data
          const data = options.headers.get('Content-type') === ContentType.download ? res.blob() : res.json()

          resolve(needAllResponseContent ? resClone : data)
        })
        .catch((err) => {
          Toast.notify({ type: 'error', message: err })
          reject(err)
        })
    }),
  ])
}

export const upload = (fetchOptions: any): Promise<any> => {
  let urlWithPrefix: string
  if (USE_DIRECT_API && API_URL) {
    urlWithPrefix = getApiPath('file-upload')
  } else {
    const urlPrefix = API_PREFIX
    urlWithPrefix = `${urlPrefix}/file-upload`
  }

  const defaultOptions = {
    method: 'POST',
    url: `${urlWithPrefix}`,
    data: {},
    headers: {} as Record<string, string>,
  }
  const options = {
    ...defaultOptions,
    ...fetchOptions,
  }

  // 添加用户标识符到 FormData
  if (USE_DIRECT_API && options.data instanceof FormData) {
    const user = getUserIdentifier()
    if (!options.data.has('user')) {
      options.data.append('user', user)
    }
  }

  // 添加 Authorization header（如果使用直接 API）
  if (USE_DIRECT_API && API_KEY) {
    options.headers.Authorization = `Bearer ${API_KEY}`
  }

  return new Promise((resolve, reject) => {
    const xhr = options.xhr
    xhr.open(options.method, options.url)
    for (const key in options.headers) { xhr.setRequestHeader(key, options.headers[key]) }

    xhr.withCredentials = !USE_DIRECT_API
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) { resolve({ id: xhr.response }) }
        else { reject(xhr) }
      }
    }
    xhr.upload.onprogress = options.onprogress
    xhr.send(options.data)
  })
}

export const ssePost = (
  url: string,
  fetchOptions: any,
  {
    onData,
    onCompleted,
    onThought,
    onFile,
    onMessageEnd,
    onMessageReplace,
    onWorkflowStarted,
    onWorkflowFinished,
    onNodeStarted,
    onNodeFinished,
    onError,
  }: IOtherOptions,
) => {
  const options = Object.assign({}, baseOptions, {
    method: 'POST',
  }, fetchOptions)

  // 更新 headers
  const headers = getBaseHeaders()
  headers.set('Content-Type', ContentType.stream)
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'content-type') {
          headers.set(key, value)
        }
      })
    } else {
      Object.keys(options.headers).forEach((key) => {
        if (key.toLowerCase() !== 'content-type') {
          headers.set(key, options.headers[key])
        }
      })
    }
  }
  options.headers = headers

  // 构建 URL
  let urlWithPrefix: string
  if (USE_DIRECT_API && API_URL) {
    urlWithPrefix = getApiPath(url)
  } else {
    const urlPrefix = API_PREFIX
    urlWithPrefix = `${urlPrefix}${url.startsWith('/') ? url : `/${url}`}`
  }

  // 处理请求体，添加用户标识符
  let requestBody = fetchOptions.body
  if (USE_DIRECT_API && requestBody) {
    const bodyObj = typeof requestBody === 'string' ? JSON.parse(requestBody) : requestBody
    if (!bodyObj.user) {
      bodyObj.user = getUserIdentifier()
    }
    requestBody = bodyObj
  }

  if (requestBody) { options.body = JSON.stringify(requestBody) }

  globalThis.fetch(urlWithPrefix, options)
    .then((res: any) => {
      if (!/^(2|3)\d{2}$/.test(res.status)) {
        // eslint-disable-next-line no-new
        new Promise(() => {
          res.json().then((data: any) => {
            Toast.notify({ type: 'error', message: data.message || 'Server Error' })
          })
        })
        onError?.('Server Error')
        return
      }
      return handleStream(res, (str: string, isFirstMessage: boolean, moreInfo: IOnDataMoreInfo) => {
        if (moreInfo.errorMessage) {
          Toast.notify({ type: 'error', message: moreInfo.errorMessage })
          return
        }
        onData?.(str, isFirstMessage, moreInfo)
      }, () => {
        onCompleted?.()
      }, onThought, onMessageEnd, onMessageReplace, onFile, onWorkflowStarted, onWorkflowFinished, onNodeStarted, onNodeFinished)
    })
    .catch((e) => {
      Toast.notify({ type: 'error', message: e })
      onError?.(e)
    })
}

export const request = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return baseFetch(url, options, otherOptions || {})
}

export const get = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'GET' }), otherOptions)
}

export const post = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'POST' }), otherOptions)
}

export const put = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'PUT' }), otherOptions)
}

export const del = (url: string, options = {}, otherOptions?: IOtherOptions) => {
  return request(url, Object.assign({}, options, { method: 'DELETE' }), otherOptions)
}
