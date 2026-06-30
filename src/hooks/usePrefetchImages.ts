import { useEffect } from 'react'

// Warms the browser's HTTP cache for images that aren't on screen yet (eg. carousel
// items hidden behind display:none, which native loading="lazy" never starts fetching
// on its own). Waits for the page's critical content (hero, logo) to finish loading
// first via the window 'load' event, so this never competes with the first view.
export function usePrefetchImages(urls: Array<string | undefined>) {
  const key = urls.filter(Boolean).join(',')

  useEffect(() => {
    if (!key) return

    const prefetch = () => {
      key.split(',').forEach((url) => {
        const img = new Image()
        img.src = url
      })
    }

    const schedule = () => {
      if ('requestIdleCallback' in window) {
        ;(window as any).requestIdleCallback(prefetch, { timeout: 2000 })
      } else {
        setTimeout(prefetch, 300)
      }
    }

    if (document.readyState === 'complete') {
      schedule()
      return
    }
    window.addEventListener('load', schedule, { once: true })
    return () => window.removeEventListener('load', schedule)
  }, [key])
}
