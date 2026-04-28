import { useEffect, useState } from 'react'

const BOOKING_SCRIPT_SRC = 'https://logout.world/static/widget/logout-booking.js'

let bookingScriptPromise

function loadBookingScript() {
  if (window.logout?.widget) {
    return Promise.resolve()
  }

  if (bookingScriptPromise) {
    return bookingScriptPromise
  }

  bookingScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${BOOKING_SCRIPT_SRC}"]`)

    if (existingScript) {
      if (window.logout?.widget) {
        resolve()
        return
      }

      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Failed to load booking widget script')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = BOOKING_SCRIPT_SRC
    script.async = true
    script.dataset.logoutWidget = 'true'
    script.addEventListener('load', resolve, { once: true })
    script.addEventListener(
      'error',
      () => reject(new Error('Failed to load booking widget script')),
      { once: true },
    )
    document.body.appendChild(script)
  }).catch((error) => {
    bookingScriptPromise = undefined
    throw error
  })

  return bookingScriptPromise
}

function waitForWidgetMarkup(container) {
  if (container.innerHTML.trim()) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      if (!container.innerHTML.trim()) return

      observer.disconnect()
      window.clearTimeout(timeoutId)
      resolve()
    })

    const timeoutId = window.setTimeout(() => {
      observer.disconnect()
      reject(new Error('Booking widget did not render in time'))
    }, 12000)

    observer.observe(container, { childList: true, subtree: true })
  })
}

export default function EmbeddedBookingWidget({ eventSlug, productTitle }) {
  const [status, setStatus] = useState('loading')
  const containerId = `voltt-widget-${eventSlug}`

  useEffect(() => {
    let cancelled = false

    const initializeTimeout = window.setTimeout(async () => {
      const container = document.getElementById(containerId)
      if (!container) return

      container.innerHTML = ''
      setStatus('loading')

      try {
        await loadBookingScript()

        if (cancelled || !window.logout?.widget) {
          return
        }

        window.logout.widget.setConfig({
          eventSlug,
          placement: `#${containerId}`,
          customClass: 'voltt-widget-surface',
          btnId: `logout-bnb-${containerId}`,
          downloadBtnId: `logout-download-button-${containerId}`,
          enquiryBtnId: `logout-enquiry-button-${containerId}`,
          showEverything: true,
          onlyButton: false,
          showItineraryButton: true,
          showEnquiryButton: true,
          bookNowButtonColor: '#d4412f',
          itineraryButtonColor: '#1f2937',
          booknowButtonName: `Buy ${productTitle}`,
          itineraryButtonName: 'Itinerary',
        })
        window.logout.widget.init()

        await waitForWidgetMarkup(container)

        if (!cancelled) {
          setStatus('ready')
        }
      } catch {
        if (!cancelled) {
          setStatus('error')
        }
      }
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(initializeTimeout)

      const container = document.getElementById(containerId)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [containerId, eventSlug, productTitle])

  return (
    <div>
      <div
        id={containerId}
        className={`voltt-embedded-widget min-h-[420px] ${status === 'ready' ? '' : 'hidden'}`}
      />

      {status === 'loading' && (
        <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-earthx-border bg-earthx-bg/60 px-6 py-10 text-center text-sm text-earthx-muted">
          Loading the full order widget for {productTitle}...
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-3xl border border-brand-red/30 bg-brand-red/5 px-5 py-5 text-sm text-earthx-dark">
          <p className="font-semibold text-brand-red">The embedded order widget could not be loaded.</p>
          <p className="mt-2 text-earthx-muted">
            Please refresh and try again. We are only loading one widget on this page to keep the
            booking experience stable.
          </p>
        </div>
      )}
    </div>
  )
}
