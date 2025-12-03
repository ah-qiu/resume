import type { FC } from 'react'
import React from 'react'
import { MapPinIcon, CurrencyYenIcon, CheckCircleIcon, ExclamationTriangleIcon, AcademicCapIcon, BriefcaseIcon, SparklesIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export interface JobMatchingData {
  '匹配度评分（0-100）'?: number
  '匹配度评分': number
  '公司'?: string
  '公司名称'?: string
  '岗位名称（权重15%）'?: string
  '岗位名称': string
  '所属行业': string
  '任职要求（权重40%）（你需要根据用户的经历和技能与岗位需求进行匹配）'?: string | string[]
  '任职要求': string | string[]
  '其他需求'?: string[]
  '学历（权重15%，高于也属于符合）'?: string
  '学历'?: string
  '所在地（权重15%）'?: string
  '所在地'?: string
  '薪资范围（权重15%）'?: string
  '薪资范围'?: string
  '匹配理由'?: string | string[]
  [key: string]: any
}

interface JobMatchingReportProps {
  data: JobMatchingData
  index?: number
}

const JobMatchingReport: FC<JobMatchingReportProps> = ({ data, index }) => {
  // Handle match reason - can be string or array
  const matchReasonKey = Object.keys(data).find(key => key.startsWith('匹配理由'))
  const matchReasonRaw = matchReasonKey ? data[matchReasonKey] : null
  const matchReasonArray = Array.isArray(matchReasonRaw)
    ? matchReasonRaw
    : (typeof matchReasonRaw === 'string' ? [matchReasonRaw] : [])

  const requirements = data['任职要求（权重40%）（你需要根据用户的经历和技能与岗位需求进行匹配）'] || data['任职要求']
  const requirementList = Array.isArray(requirements)
    ? requirements.filter(item => item && item.trim().length > 0)
    : (requirements as string)?.split(/[,，、\n]/).map(s => s.trim()).filter(Boolean) || []

  // Handle other requirements
  const otherRequirements = Array.isArray(data['其他需求'])
    ? data['其他需求'].filter(item => item && item.trim().length > 0)
    : []

  const score = data['匹配度评分（0-100）'] || data['匹配度评分'] || 0
  const positionName = data['岗位名称（权重15%）'] || data['岗位名称'] || ''
  const salary = data['薪资范围（权重15%）'] || data['薪资范围'] || ''
  const location = data['所在地（权重15%）'] || data['所在地'] || ''
  const education = data['学历（权重15%，高于也属于符合）'] || data['学历'] || ''
  const company = data['公司名称'] || data['公司'] || ''
  const industry = data['所属行业'] || ''

  const getScoreConfig = (s: number) => {
    if (s >= 90) {
      return {
        label: 'S级匹配',
        gradient: 'from-emerald-500 to-teal-500',
        bg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
        border: 'border-emerald-300',
        text: 'text-emerald-700',
        badgeGradient: 'from-emerald-500 to-teal-500',
      }
    }
    if (s >= 80) {
      return {
        label: 'A级匹配',
        gradient: 'from-blue-500 to-cyan-500',
        bg: 'bg-gradient-to-br from-blue-100 to-cyan-100',
        border: 'border-blue-300',
        text: 'text-blue-700',
        badgeGradient: 'from-blue-500 to-cyan-500',
      }
    }
    if (s >= 60) {
      return {
        label: 'B级匹配',
        gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-gradient-to-br from-amber-100 to-orange-100',
        border: 'border-amber-300',
        text: 'text-amber-700',
        badgeGradient: 'from-amber-500 to-orange-500',
      }
    }
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

  // Use match reason array directly if available, otherwise parse from string
  const displayItems = matchReasonArray.length > 0
    ? matchReasonArray.filter(s => s && s.trim().length > 0)
    : []

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
          {/* Education */}
          {education && (
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 text-xs font-medium shadow-sm">
              <AcademicCapIcon className="w-4 h-4 text-green-600" />
              {education}
            </div>
          )}
        </div>

        {/* Requirements Section */}
        {requirementList.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-800 mb-4">任职要求</h4>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50/30 rounded-xl border-2 border-blue-100 p-6">
              <div className="space-y-3">
                {requirementList.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start bg-white/60 rounded-lg p-3 hover:bg-white/80 transition-colors">
                    <div className="mt-0.5 flex-shrink-0">
                      <BriefcaseIcon className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="text-sm leading-relaxed text-gray-800">
                      {item.trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other Requirements Section */}
        {otherRequirements.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-800 mb-4">其他需求</h4>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50/30 rounded-xl border-2 border-indigo-100 p-6">
              <div className="space-y-3">
                {otherRequirements.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start bg-white/60 rounded-lg p-3 hover:bg-white/80 transition-colors">
                    <div className="mt-0.5 flex-shrink-0">
                      <SparklesIcon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div className="text-sm leading-relaxed text-gray-800">
                      {item.trim()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analysis / Match Reason */}
        {displayItems.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-4">匹配分析</h4>
            <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-xl border-2 border-purple-100 p-6">
              <div className="space-y-4">
                {displayItems.map((item, i) => {
                  // Try to extract percentage from new format "[100] Reason..." or old format "Reason... 100%"
                  let percentage: number | null = null
                  let cleanText = item.trim()

                  // Check for new format: starts with [number]
                  const newFormatMatch = item.match(/^\[(\d+)\]\s*(.*)/)
                  if (newFormatMatch) {
                    percentage = parseInt(newFormatMatch[1], 10)
                    cleanText = newFormatMatch[2]
                  } else {
                    // Fallback to old format extraction
                    const percentageMatch = item.match(/(?:约)?(\d+)%/)
                    if (percentageMatch) {
                      percentage = parseInt(percentageMatch[1], 10)
                    }
                  }

                  // Determine icon based on percentage
                  let iconElement
                  let textColor = 'text-gray-800'

                  if (percentage !== null) {
                    if (percentage >= 80) {
                      // High match (>= 80%)
                      iconElement = <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                      textColor = 'text-gray-800'
                    } else if (percentage >= 50) {
                      // Medium match (50-79%)
                      iconElement = <InformationCircleIcon className="w-5 h-5 text-purple-500" />
                      textColor = 'text-gray-800'
                    } else {
                      // Low match (< 50%)
                      iconElement = <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                      textColor = 'text-gray-700'
                    }
                  } else {
                    // Fallback: if no percentage found, use neutral icon
                    iconElement = <InformationCircleIcon className="w-5 h-5 text-purple-500" />
                  }

                  return (
                    <div key={i} className="flex gap-3 items-start bg-white/60 rounded-lg p-3 hover:bg-white/80 transition-colors">
                      <div className="mt-0.5 flex-shrink-0">
                        {iconElement}
                      </div>
                      <div className={`text-sm leading-relaxed ${textColor}`}>
                        {cleanText}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default JobMatchingReport
