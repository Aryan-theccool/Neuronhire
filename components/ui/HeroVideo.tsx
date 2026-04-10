'use client'

import { useRef, useEffect } from 'react'

interface HeroVideoProps {
  src: string
  poster?: string
  className?: string
}

export default function HeroVideo({ src, poster, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Explicitly set muted to true to allow autoplay in all browsers
    video.muted = true
    
    // Force start playback
    const playPromise = video.play()
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Autoplay was prevented. Browser may require user interaction.', error)
      })
    }
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
