'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { JobMatchingData } from '@/app/components/chat/answer/job-matching-report'
import JobMatchingReport from '@/app/components/chat/answer/job-matching-report'
import Loading from '@/app/components/base/loading'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

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
    return <Loading type='app' />
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-gray-500 mb-4">找不到报告数据或已过期</div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回
        </button>
      </div>
    )
  }

  const reportList = Array.isArray(data) ? data : [data]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-white/50 text-gray-600 transition-colors"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">简历匹配分析报告</h1>
        </div>

        <div className="space-y-8">
          {reportList.map((jobData, index) => (
            <div key={index} className="relative">
              {reportList.length > 1 && (
                <div className="absolute -left-3 top-6 -ml-4 flex flex-col items-center h-full">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm z-10">
                    {index + 1}
                  </div>
                  {index < reportList.length - 1 && <div className="w-0.5 h-full bg-gray-200 -mt-2" />}
                </div>
              )}
              <div className={`${reportList.length > 1 ? 'ml-6' : ''}`}>
                <JobMatchingReport data={jobData} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
