import { RouterProvider } from 'react-router'
import { router } from '@/app/router'
import { I18nProvider } from '@/i18n/I18nProvider'

export function App() {
  return (
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  )
}
