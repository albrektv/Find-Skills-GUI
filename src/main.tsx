import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { applyTheme } from './lib/apply-theme'
import { appIconUrl } from './components/AppIcon'
import { useSettingsStore } from './stores/useSettingsStore'
import './index.css'

applyTheme(useSettingsStore.getState().theme)

const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
if (favicon) {
  favicon.href = appIconUrl
} else {
  const link = document.createElement('link')
  link.rel = 'icon'
  link.type = 'image/png'
  link.href = appIconUrl
  document.head.appendChild(link)
}

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element #root not found')
}

createRoot(root).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
