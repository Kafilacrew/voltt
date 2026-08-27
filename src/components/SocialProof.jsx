import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

// Inline SVG: Instagram icon
function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const INSTAGRAM_ACCOUNT_URL = 'https://www.instagram.com/eatvoltt/'

const reels = [
  {
    id: 1,
    username: '@eatvoltt',
    caption: 'Almond Crunch – Roasted almonds & slow-burning clean plant protein. ⚡ #eatvoltt',
    image: '/assets/almond-crunch.png',
    url: 'https://www.instagram.com/eatvoltt/',
  },
  {
    id: 2,
    username: '@eatvoltt',
    caption: 'Berry Rush – Smooth berry-forward fuel for recovery & stamina. 🫐 #eatvoltt',
    image: '/assets/berry-rush.png',
    url: 'https://www.instagram.com/eatvoltt/',
  },
  {
    id: 3,
    username: '@eatvoltt',
    caption: 'Choco Cranz – Decadent raw cocoa base meets sweet-tart cranberry. 🍫 #eatvoltt',
    image: '/assets/choco-cranz.png',
    url: 'https://www.instagram.com/eatvoltt/',
  },
  {
    id: 4,
    username: '@eatvoltt',
    caption: 'The Volt Mixed Box – All signature recipes in one box. 📦 #eatvoltt',
    image: '/assets/mix.png',
    url: 'https://www.instagram.com/eatvoltt/',
  },
]

export default function SocialProof() {
  const [hovered, setHovered] = useState(null)

  return (
    <section className="bg-[#F5F2EB] py-20 lg:py-28 text-[#2A1646] border-b border-[#E6DFD3]/50 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="font-mono font-bold text-[#F95738] text-xs tracking-widest uppercase mb-3">
            VOLT IN ACTION
          </p>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#2A1646] tracking-tight uppercase">
            AS SEEN ON SOCIALS
          </h2>
          <p className="mt-4 text-[#71717A] text-sm sm:text-base leading-relaxed font-medium max-w-2xl mx-auto">
            Real energy from our official @eatvoltt channel. Watch our signature protein bar recipes, daily refueling rituals, and behind-the-scenes creation.
          </p>
        </div>

        {/* Reel Cards Container:
            - Desktop / Tablet: 4-card / 2-card grid
            - Android / Mobile: Horizontal swipe carousel showing 1.2–1.5 cards at a time
        */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
          {reels.map((reel, idx) => (
            <motion.a
              key={reel.id}
              href={reel.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="relative rounded-[24px] overflow-hidden cursor-pointer group aspect-[9/15] w-[72vw] sm:w-auto shrink-0 snap-align-start sm:shrink shadow-md hover:shadow-xl transition-all duration-300 border border-[#E6DFD3]/60"
              onMouseEnter={() => setHovered(reel.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Background Cover Image */}
              <img
                src={reel.image}
                alt={`${reel.username} reel`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark gradient overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35" />

              {/* Top Row: Official Instagram Badge + Icon */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md rounded-full px-3 py-1 border border-white/20">
                  <InstagramIcon className="w-3 h-3 text-white" />
                  <span className="text-white text-[10px] font-bold tracking-wide">REEL</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
                  <InstagramIcon className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <motion.div
                  animate={hovered === reel.id ? { scale: 1.12 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/25 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-lg group-hover:bg-[#F95738] group-hover:border-[#F95738] transition-colors duration-300"
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-0.5" />
                </motion.div>
              </div>

              {/* Bottom Row: Official Account Badge + Real Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#F95738] flex items-center justify-center overflow-hidden border border-white/40 shadow-xs">
                    <span className="text-[9px] font-black text-white font-display">V</span>
                  </div>
                  <span className="text-white font-bold text-xs drop-shadow-[#2A1646] font-display">
                    {reel.username}
                  </span>
                </div>

                <p className="text-white/90 text-xs leading-snug font-normal line-clamp-2 drop-shadow-xs">
                  {reel.caption}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Official Follow CTA Button */}
        <div className="flex justify-center mt-12">
          <a
            href={INSTAGRAM_ACCOUNT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-[#2A1646]/30 bg-transparent hover:bg-[#2A1646] hover:text-white text-[#2A1646] font-display font-bold text-sm tracking-wider uppercase transition-all duration-200 group shadow-xs active:scale-95"
          >
            <InstagramIcon className="w-4 h-4 group-hover:text-white text-[#2A1646] transition-colors" />
            <span>Follow @eatvoltt on Instagram</span>
            <span className="text-base">→</span>
          </a>
        </div>

      </div>
    </section>
  )
}
