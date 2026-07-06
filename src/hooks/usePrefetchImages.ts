import { useEffect } from 'react'

function loadAll(urls: string[]): Promise<void> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()
          img.src = url
        })
    )
  ).then(() => undefined)
}

// Warms the browser's HTTP cache for images that aren't on screen yet (eg. carousel items
// hidden behind display:none, which native loading="lazy" never starts fetching on its own).
// Waits for the page's critical content (hero, logo) to finish loading first via the window
// 'load' event, so this never competes with the first view.
//
// `home` (everything the home page shows) is always warmed before `detail` (only reachable by
// navigating into a service/subservice/course/trajectory page) finishes loading - so a detail
// page's photos can never win the network race against a home section's own cover images.
export function usePrefetchImages({ home, detail }: { home: string[]; detail: string[] }) {
  const homeKey = home.join(',')
  const detailKey = detail.join(',')

  useEffect(() => {
    if (!homeKey && !detailKey) return
    let cancelled = false

    const run = () => {
      loadAll(homeKey ? homeKey.split(',') : []).then(() => {
        if (cancelled || !detailKey) return
        loadAll(detailKey.split(','))
      })
    }

    const schedule = () => {
      if ('requestIdleCallback' in window) {
        ;(window as any).requestIdleCallback(run, { timeout: 2000 })
      } else {
        setTimeout(run, 300)
      }
    }

    if (document.readyState === 'complete') {
      schedule()
    } else {
      window.addEventListener('load', schedule, { once: true })
    }

    return () => {
      cancelled = true
      window.removeEventListener('load', schedule)
    }
  }, [homeKey, detailKey])
}
