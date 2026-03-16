import { useCart } from '../App'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart()

  const hasItems = cart.length > 0
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <section id="cart" className="bg-white py-16 md:py-24 border-t border-earthx-border/60">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-earthx-dark text-center">
          Your Cart
        </h2>
        {!hasItems && (
          <p className="mt-6 text-center text-earthx-muted">
            Your cart is empty. Add a Voltt bar from &quot;Choose Your Power&quot; to get started.
          </p>
        )}
        {hasItems && (
          <div className="mt-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-earthx-border px-4 py-3"
              >
                <div>
                  <p className="font-display font-semibold text-earthx-dark">{item.name}</p>
                  <p className="text-sm text-earthx-muted">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full border border-earthx-border flex items-center justify-center text-earthx-dark hover:bg-earthx-bg"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-earthx-dark">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full border border-earthx-border flex items-center justify-center text-earthx-dark hover:bg-earthx-bg"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-earthx-dark min-w-[64px] text-right">
                      ₹{item.price * item.qty}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-earthx-muted hover:text-brand-red underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-earthx-border">
              <p className="font-semibold text-earthx-dark">Total</p>
              <p className="font-display font-bold text-xl text-earthx-dark">₹{total}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="h-11 px-6 rounded-xl bg-earthx-dark text-white text-sm font-semibold hover:bg-black transition"
                onClick={() => {
                  const phone = '917378370160' // WhatsApp expects country code without +
                  const lines = cart.map(
                    (item) =>
                      `- ${item.name} x${item.qty} (₹${item.price} each, ₹${
                        item.price * item.qty
                      } total)`,
                  )
                  const message = `Hi, I am interested to buy the following items:\n\n${lines.join(
                    '\n',
                  )}\n\nCart total: ₹${total}`
                  const url = `https://wa.me/${phone}?text=${encodeURIComponent(
                    message,
                  )}`
                  window.open(url, '_blank')
                }}
              >
                Proceed to Order
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

