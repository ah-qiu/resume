import type { FC } from 'react'
import React from 'react'

export interface JobMatchingData {
  '匹配度评分（0-100）': number
  '匹配度评分'?: number
  '公司': string
  '岗位名称（权重15%）': string
  '岗位名称'?: string
  '所属行业': string
  '任职要求（权重40%）（你需要根据用户的经历和技能与岗位需求进行匹配）': string | string[]
  '任职要求'?: string | string[]
  '学历（权重15%，高于也属于符合）': string
  '学历'?: string
  '所在地（权重15%）': string
  '所在地'?: string
  '薪资范围（权重15%）': string
  '薪资范围'?: string
  [key: string]: any // Handle dynamic keys like the long "匹配理由..."
}

interface JobMatchingReportProps {
  data: JobMatchingData
}

const JobMatchingReport: FC<JobMatchingReportProps> = ({ data }) => {
  // Extract the dynamic key for matching reason
  const matchReasonKey = Object.keys(data).find(key => key.startsWith('匹配理由'))
  const matchReason = matchReasonKey ? data[matchReasonKey] : ''

  // Handle different field names and types
  const requirements = data['任职要求（权重40%）（你需要根据用户的经历和技能与岗位需求进行匹配）'] || data['任职要求']
  const formattedRequirements = Array.isArray(requirements) ? requirements.join('\n') : requirements

  const score = data['匹配度评分（0-100）'] || data['匹配度评分'] || 0
  const positionName = data['岗位名称（权重15%）'] || data['岗位名称']
  const salary = data['薪资范围（权重15%）'] || data['薪资范围']
  const location = data['所在地（权重15%）'] || data['所在地']
  const education = data['学历（权重15%，高于也属于符合）'] || data['学历']

  const getScoreColor = (s: number) => {
    if (s >= 80) { return 'text-green-600 border-green-600' }
    if (s >= 60) { return 'text-yellow-600 border-yellow-600' }
    return 'text-red-600 border-red-600'
  }

  const getScoreBg = (s: number) => {
    if (s >= 80) { return 'bg-green-50' }
    if (s >= 60) { return 'bg-yellow-50' }
    return 'bg-red-50'
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden font-sans">
      {/* Header Section */}
      <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{positionName}</h2>
          <div className="text-blue-100 text-sm mt-1">{data['公司']} · {data['所属行业']}</div>
        </div>
        <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white border-4 ${getScoreColor(score)}`}>
          <span className={`text-xl font-bold ${getScoreColor(score).split(' ')[0]}`}>{score}</span>
          <span className="text-[10px] text-gray-400 uppercase">Score</span>
        </div>
      </div>

      {/* Key Info Grid */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        <div className="p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">薪资范围</div>
          <div className="font-semibold text-gray-800">{salary}</div>
        </div>
        <div className="p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">工作地点</div>
          <div className="font-semibold text-gray-800">{location}</div>
        </div>
        <div className="p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">学历要求</div>
          <div className="font-semibold text-gray-800">{education}</div>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="p-6 space-y-6">
        {/* Requirements Analysis */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
            <span className="w-1 h-4 bg-blue-600 rounded-full mr-2"></span>
            任职要求
          </h3>
          <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {formattedRequirements}
          </div>
        </div>

        {/* Match Reason */}
        {matchReason && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center">
              <span className="w-1 h-4 bg-purple-600 rounded-full mr-2"></span>
              匹配分析报告
            </h3>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {matchReason}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`px-6 py-3 ${getScoreBg(score)} border-t border-gray-100 flex justify-between items-center`}>
        <span className="text-xs text-gray-500">由 AI 智能招聘助手生成</span>
        <span className={`text-xs font-medium px-2 py-1 rounded ${score >= 60 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {score >= 60 ? '推荐尝试' : '匹配度较低'}
        </span>
      </div>
    </div>
  )
}

export default JobMatchingReport
