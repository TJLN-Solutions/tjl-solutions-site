import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import './styles.css'

const root = document.getElementById('root')
if (!root) throw new Error('Elemento raiz não encontrado.')
createRoot(root).render(<StrictMode><ErrorBoundary><App /></ErrorBoundary></StrictMode>)
