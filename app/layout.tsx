import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <body className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="overflow-x-auto min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-[1400px] min-w-[320px]">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout
