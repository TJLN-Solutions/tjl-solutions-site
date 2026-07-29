import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

try {
  const storedTheme = localStorage.getItem("tjl-theme")
  const theme =
    storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark"
  document.documentElement.dataset.theme = theme
} catch {
  document.documentElement.dataset.theme = "dark"
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
