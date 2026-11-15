import { createBrowserRouter } from 'react-router'
import { MainLayout } from '@/components/layout/MainLayout'
import { CALCULATOR_ROUTE_PATTERN, ROUTE_PATHS } from '@/config/routePaths'
import { ErrorPage } from '@/pages/ErrorPage'
import { HomePage } from '@/pages/HomePage'

// Add new pages as lazy routes: { path, lazy: () => import('@/pages/XPage') }
export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.home,
    Component: MainLayout,
    children: [
      {
        ErrorBoundary: ErrorPage,
        children: [
          { index: true, Component: HomePage },
          {
            path: CALCULATOR_ROUTE_PATTERN,
            lazy: async () => ({
              Component: (await import('@/pages/CalculatorPage')).CalculatorPage,
            }),
          },
          {
            path: ROUTE_PATHS.aboutUs,
            lazy: async () => ({
              Component: (await import('@/pages/AboutPage')).AboutPage,
            }),
          },
          {
            path: ROUTE_PATHS.depotOpening,
            lazy: async () => ({
              Component: (await import('@/pages/DepotPage')).DepotPage,
            }),
          },
          { path: '*', Component: ErrorPage },
        ],
      },
    ],
  },
])
