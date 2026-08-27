import React from 'react'
import { useAppContext } from '../App'
import { getProductBySlug } from '../data/products'

export default function BookingWidgetButton({
  eventSlug = 'mixed-flavours',
  buttonLabel = 'Buy Now',
  className,
}) {
  const { openCheckout } = useAppContext()

  const handleClick = (e) => {
    e.preventDefault()
    const product = getProductBySlug(eventSlug)
    openCheckout(product)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        'flex h-11 w-full items-center justify-center rounded-xl bg-[#153B75] px-4 text-center text-sm font-bold text-white shadow transition hover:bg-[#0F2C59]'
      }
    >
      {buttonLabel}
    </button>
  )
}
