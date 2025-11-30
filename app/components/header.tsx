import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'
export interface IHeaderProps {
  title: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}
const Header: FC<IHeaderProps> = ({
  title,
  isMobile,
  onShowSideBar,
  onCreateNewChat,
}) => {
  return (
    <div className="shrink-0 flex items-center justify-between h-14 px-4 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200/50">
      {isMobile
        ? (
          <div
            className='flex items-center justify-center h-9 w-9 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors'
            onClick={() => onShowSideBar?.()}
          >
            <Bars3Icon className="h-5 w-5 text-gray-600" />
          </div>
        )
        : <div></div>}
      <div className='flex items-center space-x-3'>
        <AppIcon size="small" />
        <div className="text-sm text-gray-800 font-semibold">{title}</div>
      </div>
      {isMobile
        ? (
          <div className='flex items-center justify-center h-9 w-9 cursor-pointer rounded-lg hover:bg-gray-100 transition-colors' onClick={() => onCreateNewChat?.()} >
            <PencilSquareIcon className="h-5 w-5 text-gray-600" />
          </div>)
        : <div></div>}
    </div>
  )
}

export default React.memo(Header)
