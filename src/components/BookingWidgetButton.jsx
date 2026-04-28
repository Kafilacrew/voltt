export default function BookingWidgetButton({
  eventSlug = 'mixed-flavours',
  buttonLabel = 'Buy Now',
}) {
  const productPageUrl = `#/product/${eventSlug}`

  return (
    <a
      href={productPageUrl}
      className="flex h-11 w-full items-center justify-center rounded-xl bg-brand-red px-4 text-center text-sm font-semibold text-white shadow-card transition hover:bg-brand-red/90"
    >
      {buttonLabel}
    </a>
  )
}
