import type { FC } from 'react'
import React from 'react'
import type { JobMatchingData } from './job-matching-report'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface ReportCardProps {
  data: JobMatchingData
  onClick: () => void
}

const ReportCard: FC<ReportCardProps> = ({ data, onClick }) => {
  const score = data['匹配度评分（0-100）'] || data['匹配度评分'] || 0
  const company = data['公司名称'] || data['公司'] || ''
  const position = data['岗位名称（权重15%）'] || data['岗位名称'] || ''

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
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1 mr-3">
            <h3 className="font-bold text-gray-900 line-clamp-1">{position}</h3>
            <p className="text-sm text-gray-500 line-clamp-1">{company}</p>
          </div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${getScoreColor(score)}`}>
            <span className="font-bold text-sm">{score}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">点击查看详细分析报告</span>
          <div className="flex items-center text-blue-600 text-xs font-medium group-hover:underline">
            查看详情
            <DocumentMagnifyingGlassIcon className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportCard
