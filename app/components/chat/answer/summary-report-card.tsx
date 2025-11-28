import type { FC } from 'react'
import React from 'react'
import type { JobMatchingData } from './job-matching-report'
import { DocumentMagnifyingGlassIcon, BriefcaseIcon } from '@heroicons/react/24/outline'

interface SummaryReportCardProps {
  data: JobMatchingData[]
  onClick: () => void
}

const SummaryReportCard: FC<SummaryReportCardProps> = ({ data, onClick }) => {
  const count = data.length
  // Find highest score
  const highestScore = Math.max(...data.map(d => d['匹配度评分（0-100）'] || d['匹配度评分'] || 0))

  const getScoreColor = (s: number) => {
    if (s >= 80) { return 'text-green-600 bg-green-50 border-green-200' }
    if (s >= 60) { return 'text-yellow-600 bg-yellow-50 border-yellow-200' }
    return 'text-red-600 bg-red-50 border-red-200'
  }

  return (
    <div
      className="group cursor-pointer w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
      onClick={onClick}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-800">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <BriefcaseIcon className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-bold text-base">职位匹配报告</span>
          </div>
          <div className="flex items-center text-xs font-medium px-2.5 py-1 bg-white rounded-full text-blue-600 shadow-sm border border-blue-100">
            共推荐 {count} 个岗位
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">最高匹配度</div>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-bold leading-none ${getScoreColor(highestScore).split(' ')[0]}`}>
              {highestScore}
            </span>
            <span className="text-xs text-gray-400 mb-1">/ 100</span>
          </div>
        </div>

        <div className="space-y-3">
          {data.slice(0, 3).map((job, index) => {
            const score = job['匹配度评分（0-100）'] || job['匹配度评分'] || 0
            const position = job['岗位名称（权重15%）'] || job['岗位名称']
            const company = job['公司']

            return (
              <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="font-medium text-gray-900 truncate">{position}</div>
                  <div className="text-xs text-gray-500 truncate">{company}</div>
                </div>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${getScoreColor(score)}`}>
                  {score}
                </span>
              </div>
            )
          })}
          {count > 3 && (
            <div className="text-center text-xs text-gray-400 pt-1">
              还有 {count - 3} 个更多岗位...
            </div>
          )}
        </div>

        <div className="flex items-center justify-center mt-5 pt-3 border-t border-gray-50">
          <div className="flex items-center text-blue-600 text-sm font-medium group-hover:underline">
            查看完整分析
            <DocumentMagnifyingGlassIcon className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryReportCard
