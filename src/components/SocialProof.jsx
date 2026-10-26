import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
  VolumeX,
  Sparkles,
} from 'lucide-react'

// Inline SVG: Instagram icon
function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const INSTAGRAM_ACCOUNT_URL = 'https://www.instagram.com/eatvoltt/'

// Verified public Instagram Reels published by or verifiably featured on the official @eatvoltt account
const REELS = [
  {
    id: 'DY4r-hXzGV0',
    shortcode: 'DY4r-hXzGV0',
    url: 'https://www.instagram.com/reel/DY4r-hXzGV0/',
    creator: '@eatvoltt',
    tag: 'R&D / Science',
    caption: 'POV: our R&D Head Sawani refused to make “just another protein bar” ⚡ Protein + Electrolytes + Midday crash ❌',
    coverImage: '/assets/reels/DY4r-hXzGV0.jpg',
    hasPlayableVideo: false,
    videoSource: null,
  },
  {
    id: 'DYPYfzTBV_g',
    shortcode: 'DYPYfzTBV_g',
    url: 'https://www.instagram.com/reel/DYPYfzTBV_g/',
    creator: '@eatvoltt',
    tag: 'Electrolytes',
    caption: 'Why does Voltt have Electrolytes?? Fuelled by clean protein, active hydration & competitive energy.',
    coverImage: '/assets/reels/DYPYfzTBV_g.jpg',
    hasPlayableVideo: false,
    videoSource: null,
  },
  {
    id: 'DX6yDQWzpeE',
    shortcode: 'DX6yDQWzpeE',
    url: 'https://www.instagram.com/reel/DX6yDQWzpeE/',
    creator: '@eatvoltt',
    tag: 'Built for Hustle',
    caption: 'Why are we building VOLTT? Hydration isn’t optional. 25% protein with added electrolytes.',
    coverImage: '/assets/reels/DX6yDQWzpeE.jpg',
    hasPlayableVideo: false,
    videoSource: null,
  },
  {
    id: 'DX5G4bjTVBW',
    shortcode: 'DX5G4bjTVBW',
    url: 'https://www.instagram.com/reel/DX5G4bjTVBW/',
    creator: '@eatvoltt',
    tag: 'Founder & CEO',
    caption: 'Kunj Bansal (Founder & CEO): Why settle for protein bars that don’t work for you? Redefining clean protein.',
    coverImage: '/assets/reels/DX5G4bjTVBW.jpg',
    hasPlayableVideo: false,
    videoSource: null,
  },
  {
    id: 'DZaF1icCqQy',
    shortcode: 'DZaF1icCqQy',
    url: 'https://www.instagram.com/reel/DZaF1icCqQy/',
    creator: '@eatvoltt',
    tag: 'Clean Fuel',
    caption: 'Other bars: “I have protein.” Voltt: “Cool. I brought electrolytes too.” Built different.',
    coverImage: '/assets/reels/DZaF1icCqQy.jpg',
    hasPlayableVideo: false,
    videoSource: null,
  },
  {
    id: 'DYkCNpoOCZE',
    shortcode: 'DYkCNpoOCZE',
    url: 'https://www.instagram.com/reel/DYkCNpoOCZE/',
    creator: '@eatvoltt',
    tag: 'Taste & Feel',
    caption: 'Tastes Good + Feels Good: Snacking just got an upgrade. Crunchy, addictive, clean.',
    coverImage: '/assets/reels/DYkCNpoOCZE.jpg',
    hasPlayableVideo: false,
    videoSource: null,
  },
  {
    id: 'DeBkue5Mn5s',
    shortcode: 'DeBkue5Mn5s',
    url: 'https://www.instagram.com/reel/DeBkue5Mn5s/',
    creator: '@kunjbansal04 (Founder)',
    tag: 'Founder Journey',
    caption: 'From being a student with ideas to actually getting the opportunity to talk about building them ⚡',
    coverImage: '/assets/reels/DeBkue5Mn5s.jpg',
    hasPlayableVideo: false,
    videoSource: null,
  },
  {
    id: 'DcaMD5nCh9J',
    shortcode: 'DcaMD5nCh9J',
    url: 'https://www.instagram.com/reel/DcaMD5nCh9J/',
    creator: '@kaustubh__choudhari × @eatvoltt',
    tag: 'Creator Collab',
    caption: 'India’s First Protein Bar with Added Electrolytes: High protein, added electrolytes, great taste.',
    coverImage: '/assets/reels/DcaMD5nCh9J.jpg',
    hasPlayableVideo: false,
    videoSource: null,
  },
]

export default function SocialProof() {
  const [hoveredId, setHoveredId] = useState(null)
  const [activeModalReel, setActiveModalReel] = useState(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const carouselRef = useRef(null)
  const videoRefs = useRef({})

  // Update carousel scroll navigation buttons
  const checkScrollLimits = useCallback(() => {
    if (!carouselRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
    setCanScrollLeft(scrollLeft > 8)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8)
  }, [])

  useEffect(() => {
    checkScrollLimits()
    const handleResize = () => checkScrollLimits()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [checkScrollLimits])

  const scroll = (direction) => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const cardWidth = container.querySelector('[data-reel-card]')?.clientWidth || 280
    const scrollAmount = cardWidth * (direction === 'left' ? -1 : 1) * 1.5

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    })
  }

  // Handle Desktop Hover-to-Play
  const handleMouseEnter = (reelId) => {
    setHoveredId(reelId)
    // Only attempt video playback if legitimate playable source exists
    const videoEl = videoRefs.current[reelId]
    if (videoEl) {
      videoEl.muted = true
      videoEl.currentTime = 0
      const playPromise = videoEl.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play was prevented by browser policy
        })
      }
    }
  }

  const handleMouseLeave = (reelId) => {
    setHoveredId(null)
    const videoEl = videoRefs.current[reelId]
    if (videoEl) {
      videoEl.pause()
      videoEl.currentTime = 0
    }
  }

  // Modal open & close
  const openReelModal = (reel) => {
    // Pause any active preview video before opening modal
    Object.values(videoRefs.current).forEach((vid) => {
      if (vid && !vid.paused) vid.pause()
    })
    setHoveredId(null)
    setActiveModalReel(reel)
  }

  const closeReelModal = useCallback(() => {
    setActiveModalReel(null)
  }, [])

  // Keyboard navigation & Escape key listener for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeModalReel) {
        closeReelModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModalReel, closeReelModal])

  // Pause hover preview when window is hidden or off-screen
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        Object.values(videoRefs.current).forEach((vid) => {
          if (vid && !vid.paused) vid.pause()
        })
        setHoveredId(null)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return (
    <section
      id="socials"
      className="bg-[#F5F2EB] py-20 lg:py-28 text-[#2A1646] border-b border-[#E6DFD3]/50 overflow-x-clip"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="font-mono font-bold text-[#F95738] text-xs tracking-widest uppercase mb-2">
              VOLTT IN ACTION
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#2A1646] tracking-tight uppercase">
              AS SEEN ON SOCIALS
            </h2>
            <p className="mt-4 text-[#71717A] text-sm sm:text-base leading-relaxed font-medium">
              Real energy from our official @eatvoltt channel. Watch our signature protein bar recipes, daily refueling rituals, and behind-the-scenes creation.
            </p>
          </div>

          {/* Desktop Carousel Controls */}
          <div className="hidden sm:flex items-center gap-2 self-end md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous Instagram reels"
              className="w-11 h-11 rounded-full border border-[#E6DFD3] bg-white flex items-center justify-center text-[#2A1646] hover:bg-[#FAF8F3] hover:border-[#2A1646]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next Instagram reels"
              className="w-11 h-11 rounded-full border border-[#E6DFD3] bg-white flex items-center justify-center text-[#2A1646] hover:bg-[#FAF8F3] hover:border-[#2A1646]/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Reel Cards Container */}
        <div
          ref={carouselRef}
          onScroll={checkScrollLimits}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 sm:gap-6 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {REELS.map((reel, idx) => {
            const isHovered = hoveredId === reel.id

            return (
              <div
                key={reel.id}
                data-reel-card
                role="button"
                tabIndex={0}
                aria-label={`Play Instagram reel: ${reel.caption}`}
                onClick={() => openReelModal(reel)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openReelModal(reel)
                  }
                }}
                onMouseEnter={() => handleMouseEnter(reel.id)}
                onMouseLeave={() => handleMouseLeave(reel.id)}
                className="relative rounded-[26px] overflow-hidden cursor-pointer group aspect-[9/16] w-[75vw] sm:w-[280px] lg:w-[calc(25%-18px)] shrink-0 snap-start shadow-md hover:shadow-2xl transition-all duration-300 border border-[#E6DFD3]/80 bg-[#2A1646] flex flex-col justify-between focus:outline-none focus-visible:ring-3 focus-visible:ring-[#F95738]"
              >
                {/* Background Cover Image */}
                <img
                  src={reel.coverImage}
                  alt={`${reel.creator} reel cover`}
                  loading="lazy"
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                    isHovered && reel.hasPlayableVideo ? 'opacity-0' : 'opacity-100'
                  }`}
                />

                {/* Hover Video Preview (Only when legitimate video source exists) */}
                {reel.hasPlayableVideo && reel.videoSource && (
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[reel.id] = el
                    }}
                    src={reel.videoSource}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}

                {/* Gradient Overlays for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

                {/* Top Badge Bar: Reel Tag + Instagram Icon */}
                <div className="relative z-10 p-4 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-wider uppercase">
                    <InstagramIcon className="w-3 h-3 text-[#F95738]" />
                    <span>{reel.tag}</span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 shadow-xs">
                    <InstagramIcon className="w-4 h-4" />
                  </div>
                </div>

                {/* Center: Interactive Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <motion.div
                    animate={isHovered ? { scale: 1.15 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-xl group-hover:bg-[#F95738] group-hover:border-[#F95738] transition-colors duration-300"
                  >
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </motion.div>
                </div>

                {/* Hover Muted Indicator (When playable video is running) */}
                {isHovered && reel.hasPlayableVideo && (
                  <div className="absolute top-16 right-4 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/20">
                    <VolumeX className="w-3 h-3" />
                    <span>Muted Preview</span>
                  </div>
                )}

                {/* Bottom Information: Handle & Caption */}
                <div className="relative z-10 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#F95738] flex items-center justify-center text-white text-[10px] font-black border border-white/40 shadow-xs">
                      V
                    </div>
                    <span className="text-white font-bold text-xs tracking-tight drop-shadow-sm font-display truncate">
                      {reel.creator}
                    </span>
                  </div>

                  <p className="text-white/85 text-xs leading-snug font-normal line-clamp-2 drop-shadow-sm">
                    {reel.caption}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-white/70 font-bold group-hover:text-white transition-colors">
                    <span className="uppercase tracking-wider text-[10px]">Watch on Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )
          })}
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
            <span className="text-base transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

      </div>

      {/* ── Click-to-Play Instagram Embed Modal ── */}
      <AnimatePresence>
        {activeModalReel && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Instagram Reel by ${activeModalReel.creator}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md"
          >
            {/* Backdrop Dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeReelModal}
              className="absolute inset-0"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.22 }}
              className="relative w-full max-w-md bg-[#FAF8F3] rounded-3xl border border-[#E6DFD3] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
            >
              {/* Modal Header */}
              <div className="px-5 py-3.5 bg-[#2A1646] text-white flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <InstagramIcon className="w-4 h-4 text-[#F95738] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-display font-bold text-xs uppercase tracking-wider truncate">
                      {activeModalReel.creator}
                    </p>
                    <p className="text-[10px] text-white/60 truncate">
                      Official Instagram Reel Player
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeReelModal}
                  aria-label="Close Instagram Reel player"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Official Instagram Reel Embed Iframe */}
              <div className="relative flex-1 min-h-[480px] sm:min-h-[540px] bg-black overflow-hidden flex items-center justify-center">
                <iframe
                  key={activeModalReel.shortcode}
                  src={`https://www.instagram.com/reel/${activeModalReel.shortcode}/embed/captioned/`}
                  className="w-full h-full min-h-[480px] sm:min-h-[540px] border-0"
                  scrolling="no"
                  allowTransparency="true"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title={`Instagram Reel: ${activeModalReel.caption}`}
                  loading="lazy"
                />
              </div>

              {/* Modal Footer with Direct Link Fallback */}
              <div className="p-4 bg-white border-t border-[#E6DFD3] flex items-center justify-between gap-3 text-xs">
                <p className="text-[11px] text-gray-500 line-clamp-1 flex-1">
                  {activeModalReel.caption}
                </p>

                <a
                  href={activeModalReel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#2A1646] hover:bg-[#1F0F36] text-white font-display font-bold text-[11px] uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                >
                  <span>Open on Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
