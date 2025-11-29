import type { FC } from 'react'
import React from 'react'
import { MapPinIcon, CurrencyYenIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

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
  [key: string]: any
}

interface JobMatchingReportProps {
  data: JobMatchingData
  index?: number
}

const JobMatchingReport: FC<JobMatchingReportProps> = ({ data, index }) => {
  const matchReasonKey = Object.keys(data).find(key => key.startsWith('匹配理由'))
  const matchReason = matchReasonKey ? data[matchReasonKey] : ''

  const requirements = data['任职要求（权重40%）（你需要根据用户的经历和技能与岗位需求进行匹配）'] || data['任职要求']
  const tags = Array.isArray(requirements) ? requirements : (requirements as string)?.split(/[,，、\n]/).map(s => s.trim()).filter(Boolean) || []

  const score = data['匹配度评分（0-100）'] || data['匹配度评分'] || 0
  const positionName = data['岗位名称（权重15%）'] || data['岗位名称']
  const salary = data['薪资范围（权重15%）'] || data['薪资范围']
  const location = data['所在地（权重15%）'] || data['所在地']
  const education = data['学历（权重15%，高于也属于符合）'] || data['学历']
  const company = data['公司']
  const industry = data['所属行业']

  const getScoreConfig = (s: number) => {
    if (s >= 90) { return {
      label: 'S级匹配',
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      badgeGradient: 'from-emerald-500 to-teal-500',
    } }
    if (s >= 80) { return {
      label: 'A级匹配',
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      border: 'border-blue-300',
      text: 'text-blue-700',
      badgeGradient: 'from-blue-500 to-cyan-500',
    } }
    if (s >= 60) { return {
      label: 'B级匹配',
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-gradient-to-br from-amber-100 to-orange-100',
      border: 'border-amber-300',
      text: 'text-amber-700',
      badgeGradient: 'from-amber-500 to-orange-500',
    } }
    return {
      label: '匹配度低',
      gradient: 'from-red-500 to-pink-500',
      bg: 'bg-gradient-to-br from-red-100 to-pink-100',
      border: 'border-red-300',
      text: 'text-red-700',
      badgeGradient: 'from-red-500 to-pink-500',
    }
  }

  const scoreConfig = getScoreConfig(score)

  // Parse match reason into list items if possible (looking for "1) ... 2) ...")
  const reasonItems = matchReason.split(/\d+[.、)]\s*/).filter(item => item.trim().length > 0)
  // If parsing fails or results in one big chunk, fallback to just splitting by newline
  const displayItems = reasonItems.length > 1 ? reasonItems : matchReason.split('\n').filter(s => s.trim())

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border-2 border-purple-200/50 shadow-xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative group">
      {/* Top Gradient Line */}
      <div className={`h-2 w-full bg-gradient-to-r ${scoreConfig.badgeGradient}`}></div>

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{positionName}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-600 font-semibold">{company}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">{industry}</span>
            </div>
          </div>

          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl ${scoreConfig.bg} border-2 ${scoreConfig.border} shadow-lg`}>
            <div className={`text-3xl font-bold bg-gradient-to-r ${scoreConfig.badgeGradient} bg-clip-text text-transparent`}>{score}%</div>
            <div className={`text-xs font-bold uppercase tracking-wide ${scoreConfig.text}`}>{scoreConfig.label}</div>
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Location */}
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700 text-xs font-medium shadow-sm">
            <MapPinIcon className="w-4 h-4 text-purple-500" />
            {location}
          </div>
          {/* Salary */}
          <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 text-xs font-bold shadow-sm">
            <CurrencyYenIcon className="w-4 h-4 text-amber-600" />
            {salary}
          </div>
          {/* Tech Stack Tags */}
          {tags.slice(0, 5).map((tag, i) => (
            <div key={i} className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 text-cyan-700 text-xs font-medium shadow-sm">
              {tag}
            </div>
          ))}
          {tags.length > 5 && (
            <div className="px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium">
              +{tags.length - 5}
            </div>
          )}
        </div>

        {/* Analysis / Match Reason */}
        {displayItems.length > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl border-2 border-purple-100 p-6">
            <div className="space-y-4">
              {displayItems.map((item, i) => {
                // Try to determine sentiment or category based on content text (simple heuristic)
                const isNegative = item.includes('不匹配') || item.includes('差异') || item.includes('低于') || item.includes('挑战')
                const isPositive = !isNegative && (item.includes('符合') || item.includes('满足') || item.includes('一致') || item.includes('优势'))

                return (
                  <div key={i} className="flex gap-3 items-start bg-white/60 rounded-lg p-3 hover:bg-white/80 transition-colors">
                    <div className="mt-0.5 flex-shrink-0">
                      {isNegative
                        ? <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                        : (isPositive
                          ? <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                          : <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5"></div>
                        )
                      }
                    </div>
                    <div className={`text-sm leading-relaxed ${isNegative ? 'text-gray-700' : 'text-gray-800'}`}>
                      {item.trim()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default JobMatchingReport
