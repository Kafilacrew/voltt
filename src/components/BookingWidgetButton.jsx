import { useEffect } from 'react'

const BOOKING_SCRIPT_SRC = 'https://logout.world/static/widget/logout-booking.js'

export default function BookingWidgetButton({
  containerId,
  eventSlug = 'mixed-flavours',
  buttonLabel = 'Buy Now',
}) {
  useEffect(() => {
    let cancelled = false

    const initializeWidget = () => {
      if (cancelled || !window.logout?.widget) return

      const container = document.getElementById(containerId)
      if (!container) return

      container.innerHTML = ''

      window.logout.widget.setConfig({
        eventSlug,
        placement: `#${containerId}`,
        customClass: 'btn-custom',
        btnId: `logout-bnb-${containerId}`,
        downloadBtnId: `logout-download-button-${containerId}`,
        enquiryBtnId: `logout-enquiry-button-${containerId}`,
        showEverything: true,
        onlyButton: false,
        showItineraryButton: true,
        showEnquiryButton: true,
        bookNowButtonColor: '#28a745',
        itineraryButtonColor: '#dc3545',
        booknowButtonName: buttonLabel,
        itineraryButtonName: 'Itinerary',
      })
      window.logout.widget.init()
    }

    const existingScript = document.querySelector(`script[src="${BOOKING_SCRIPT_SRC}"]`)
    if (!existingScript) return undefined

    if (window.logout?.widget) {
      initializeWidget()
      return () => {
        cancelled = true
      }
    }

    existingScript.addEventListener('load', initializeWidget, { once: true })
    return () => {
      cancelled = true
      existingScript.removeEventListener('load', initializeWidget)
    }
  }, [buttonLabel, containerId, eventSlug])

  return <div id={containerId} />
}
