import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * CUSTOM VIDEO CONFIGURATION:
 * 1. Place your MP4 video file inside: `public/assets/voltt-hero-video.mp4`
 *    OR
 * 2. Update the CUSTOM_VIDEO_PATH string below to point to any video file path or URL.
 */
const CUSTOM_VIDEO_PATH = '/assets/voltt-hero-video.mp4'
const SAMPLE_FALLBACK_VIDEO = 'https://assets.mixkit.co/videos/preview/mixkit-healthy-snack-bar-being-prepared-42442-large.mp4'

export default function HeroCinematicMedia({
  selectedProduct,
  videoUrl = CUSTOM_VIDEO_PATH,
}) {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  const activeVideo = selectedProduct?.videoPath || videoUrl

  useEffect(() => {
    // Check OS reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true)
      return
    }

    const videoEl = videoRef.current
    if (!videoEl) return

    // IntersectionObserver to pause video when off-screen for performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoEl.play().catch(() => {})
          } else {
            videoEl.pause()
          }
        })
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
    >
      {/* Layer 1: Fallback High-Res Poster Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={selectedProduct?.id || 'default-img'}
          src={selectedProduct?.image || '/assets/hero.png'}
          alt="Voltt Product Background"
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded && !prefersReducedMotion ? 0 : 0.75 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover object-[85%_center] scale-115 transform-gpu"
          style={{
            filter: 'blur(0px) brightness(1.05) contrast(1.1) saturate(1.15)',
          }}
        />
      </AnimatePresence>

      {/* Layer 2: High-Visibility Crisp Background Video (Scale +15%, Opacity 0.75, 0px Blur) */}
      {!prefersReducedMotion && (
        <AnimatePresence mode="wait">
          <motion.video
            key={activeVideo}
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            initial={{ opacity: 0 }}
            animate={{ opacity: videoLoaded ? 0.75 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onLoadedData={() => setVideoLoaded(true)}
            onError={(e) => {
              if (e.currentTarget.src !== SAMPLE_FALLBACK_VIDEO) {
                e.currentTarget.src = SAMPLE_FALLBACK_VIDEO
                e.currentTarget.load()
              }
            }}
            className="absolute inset-0 w-full h-full object-cover object-[85%_center] scale-115 transform-gpu"
            style={{
              filter: 'blur(0px) brightness(1.05) contrast(1.1) saturate(1.15)',
              maskImage:
                'radial-gradient(circle at 75% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage:
                'radial-gradient(circle at 75% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0) 100%)',
            }}
          >
            <source src={activeVideo} type="video/mp4" />
            <source src={SAMPLE_FALLBACK_VIDEO} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
      )}

      {/* Layer 3: Subtle Cream Overlay (Allows High Video Visibility While Preserving Text Readability) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(247, 243, 232, 0.20) 0%,
            rgba(247, 243, 232, 0.10) 50%,
            rgba(247, 243, 232, 0.25) 100%
          )`,
        }}
      />

      {/* Text Legibility Gradient Fade on the Left Side */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(
            90deg,
            rgba(247, 244, 236, 0.85) 0%,
            rgba(247, 244, 236, 0.50) 45%,
            transparent 85%
          )`,
        }}
      />

      {/* Layer 4: Soft Support Spotlight */}
      <motion.div
        key={selectedProduct?.eventSlug || 'default-glow'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[450px] bg-gradient-to-r ${
          selectedProduct?.spotlightGlow || 'from-[#153B75]/15 via-[#D8A24A]/8 to-transparent'
        } blur-3xl rounded-full pointer-events-none`}
      />
    </div>
  )
}
