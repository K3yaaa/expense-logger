'use client'

import { useEffect, useState } from 'react'

const PAINTINGS = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg',
    alt: 'Claude Monet - Water Lilies (1906)',
    kenburns: 'kenburns-1',
    duration: 28,
    opacity: 0.12,
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Monet_-_Impression%2C_Sunrise.jpg',
    alt: 'Claude Monet - Impression, Sunrise',
    kenburns: 'kenburns-2',
    duration: 32,
    opacity: 0.10,
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    alt: 'Vincent van Gogh - Starry Night',
    kenburns: 'kenburns-3',
    duration: 26,
    opacity: 0.11,
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Claude_Monet_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg',
    alt: 'Pierre-Auguste Renoir - Luncheon of the Boating Party',
    kenburns: 'kenburns-4',
    duration: 35,
    opacity: 0.10,
  },
]

export default function ArtBackground() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setPrevIndex(currentIndex)
        setCurrentIndex((prev) => (prev + 1) % PAINTINGS.length)
        setIsTransitioning(false)
      }, 1500)
    }, 28000)
    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <>
      <style>{`
        @keyframes kenburns-1 {
          0% { transform: scale(1.0) translate(0%, 0%); }
          100% { transform: scale(1.14) translate(-2%, -1%); }
        }
        @keyframes kenburns-2 {
          0% { transform: scale(1.08) translate(0%, 0%); }
          100% { transform: scale(1.0) translate(2%, 1%); }
        }
        @keyframes kenburns-3 {
          0% { transform: scale(1.05) translate(-1%, 1%); }
          100% { transform: scale(1.16) translate(1%, -2%); }
        }
        @keyframes kenburns-4 {
          0% { transform: scale(1.1) translate(1%, 0%); }
          100% { transform: scale(1.05) translate(-1%, 1%); }
        }
        @keyframes crossfade {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Fixed dark overlay — sits above paintings, below content */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          background: 'rgba(10, 10, 15, 0.88)',
          pointerEvents: 'none',
        }}
      />

      {/* Painting layers — stacked with depth */}
      {PAINTINGS.map((painting, index) => {
        const isActive = index === currentIndex
        const isPrev = index === prevIndex
        const isVisible = isActive || isPrev

        if (!isVisible) return null

        return (
          <div
            key={painting.url}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1,
              opacity: isPrev ? (isTransitioning ? 0 : 0) : isActive ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              animation: isActive
                ? `${painting.kenburns} ${painting.duration}s ease-in-out infinite alternate`
                : 'none',
              animationDelay: `${(index * 7) % painting.duration}s`,
            }}
          >
            <img
              src={painting.url}
              alt={painting.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: painting.opacity,
                filter: 'saturate(0.5) brightness(0.65)',
                pointerEvents: 'none',
              }}
              loading="eager"
            />
          </div>
        )
      })}
    </>
  )
}
