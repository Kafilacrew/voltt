export default function AnnouncementBar() {
  return (
    <div className="bg-brand-red text-white h-14 flex items-center justify-center gap-4 px-4 text-sm md:text-base">
      <span className="font-semibold">Limited Time: Buy 2 Get 1 FREE</span>
      <span className="opacity-80">|</span>
      <span>Only 47 boxes left</span>
      <div className="flex items-center gap-1 ml-2 font-mono font-bold bg-white/20 rounded px-2 py-1">
        <span>02</span>:<span>47</span>:<span>26</span>
      </div>
      <a
        href="#shop"
        className="ml-4 bg-brand-yellow text-earthx-dark font-bold px-4 py-2 rounded-xl hover:opacity-90 transition"
      >
        Grab Deal
      </a>
    </div>
  )
}
