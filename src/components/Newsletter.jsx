export default function Newsletter() {
  return (
    <section className="bg-earthx-dark py-16 md:py-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
          Get 10% OFF + Fitness Tips
        </h2>
        <p className="text-white/70 mt-4">
          Join 20,000+ subscribers who get exclusive deals and health tips
        </p>
        <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 h-14 px-6 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
          />
          <button
            type="submit"
            className="h-14 px-8 rounded-xl bg-brand-red text-white font-semibold hover:opacity-90 transition"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-4 text-brand-yellow text-sm flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          Plus early access to new flavors
        </p>
      </div>
    </section>
  )
}
