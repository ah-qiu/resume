'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { JobMatchingData } from '@/app/components/chat/answer/job-matching-report'
import JobMatchingReport from '@/app/components/chat/answer/job-matching-report'
import Loading from '@/app/components/base/loading'
import { ChevronLeftIcon, SparklesIcon, BoltIcon, TrophyIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function ReportPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [data, setData] = useState<JobMatchingData | JobMatchingData[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      try {
        const storedData = localStorage.getItem(`report_data_${id}`)
        if (storedData) {
          setData(JSON.parse(storedData))
        }
      } catch (e) {
        console.error('Failed to load report data', e)
      }
    }
    setLoading(false)
  }, [id])

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Loading type='app' />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex flex-col items-center justify-center p-4">
        <div className="text-gray-600 mb-4">找不到报告数据或已过期</div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
        >
          返回
        </button>
      </div>
    )
  }

  const reportList = Array.isArray(data) ? data : [data]

  // Simple calc for summary stats
  const avgScore = reportList.reduce((acc, curr) => {
    const score = curr['匹配度评分（0-100）'] || curr['匹配度评分'] || 0
    return acc + score
  }, 0) / (reportList.length || 1)

  const getCompetitiveness = (score: number) => {
    if (score >= 80) { return { level: 'T5 / P7+', gradient: 'from-purple-500 to-pink-500', iconBg: 'bg-gradient-to-br from-purple-100 to-pink-100' } }
    if (score >= 60) { return { level: 'T4 / P6', gradient: 'from-blue-500 to-cyan-500', iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-100' } }
    return { level: 'T3 / P5', gradient: 'from-gray-400 to-gray-500', iconBg: 'bg-gradient-to-br from-gray-100 to-gray-200' }
  }

  const comp = getCompetitiveness(avgScore)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 font-sans">
      {/* Navbar / Header Controls */}
      <div className="fixed top-0 left-0 w-full p-4 z-50 pointer-events-none">
        <button
          onClick={handleBack}
          className="pointer-events-auto p-2 rounded-full bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm text-gray-700 hover:text-purple-600 transition-all border border-white/50"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

        {/* Header Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium tracking-wider uppercase mb-4 shadow-lg">
            <SparklesIcon className="w-4 h-4" />
            AI Powered Analysis
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4 tracking-tight">
            人才 x 岗位深度匹配报告
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/60 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              候选人: 深度求职者
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/60 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span>
              生成日期: {new Date().toISOString().split('T')[0]}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/60 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              核心策略: 技能匹配 / 优势分析
            </div>
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 border-2 border-purple-200/50 relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <TrophyIcon className="w-20 h-20 text-purple-600" />
            </div>
            <div className="text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">当前竞争力</div>
            <div className={`text-3xl font-bold bg-gradient-to-r ${comp.gradient} bg-clip-text text-transparent flex items-center gap-2`}>
              {comp.level}
              <SparklesIcon className="w-6 h-6 text-purple-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl p-6 border-2 border-cyan-200/50 relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <BoltIcon className="w-20 h-20 text-cyan-600" />
            </div>
            <div className="text-cyan-700 text-xs font-bold uppercase tracking-wider mb-3">技术栈匹配度</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
              {avgScore > 70 ? 'High' : 'Medium'}
              <BoltIcon className="w-6 h-6 text-yellow-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-6 border-2 border-orange-200/50 relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
              <ChartBarIcon className="w-20 h-20 text-orange-600" />
            </div>
            <div className="text-orange-700 text-xs font-bold uppercase tracking-wider mb-3">市场稀缺性</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
              Top {Math.max(5, 100 - Math.round(avgScore))}%
              <ChartBarIcon className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Job Matches List */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6 pl-4">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">精选岗位推荐 (Top Matches)</h2>
          </div>

          <div className="space-y-6">
            {reportList.map((jobData, index) => (
              <JobMatchingReport key={index} data={jobData} index={index} />
            ))}
          </div>
        </div>

        {/* Action Plan */}
        <div>
          <div className="flex items-center gap-3 mb-6 pl-4">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">下一步行动建议 (Action Plan)</h2>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200/50 p-6 md:p-8 shadow-xl">
            <p className="text-gray-700 text-sm mb-6 font-medium">基于 AI 分析，建议您采取 "稳攻核心优势，针对性补齐短板" 的组合策略。</p>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 flex gap-4 items-start border border-purple-200/50 hover:shadow-lg transition-all">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">1</div>
                <div>
                  <div className="text-gray-800 font-bold text-sm mb-2">简历数据化微调</div>
                  <div className="text-gray-600 text-xs leading-relaxed">
                    针对高匹配度岗位，建议在简历中将项目成果进行量化（如：性能提升百分比、节省成本额度），增强说服力。
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 flex gap-4 items-start border border-cyan-200/50 hover:shadow-lg transition-all">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">2</div>
                <div>
                  <div className="text-gray-800 font-bold text-sm mb-2">技术栈查漏补缺</div>
                  <div className="text-gray-600 text-xs leading-relaxed">
                    花时间复习目标岗位JD中提及的高频技术关键词，准备1-2个相关的技术预研话题或过往解决案例。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
