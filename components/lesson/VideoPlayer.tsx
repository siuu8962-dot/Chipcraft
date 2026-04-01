'use client'
import { Play, SpeakerHigh, ArrowsOut, Spinner } from '@/lib/icons'
import { useState } from 'react'

export function VideoPlayer({ url, title }: { url: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-3xl border border-border overflow-hidden shadow-2xl group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Real Video Integration (Placeholder for simulation) */}
      <div className="absolute inset-0 flex items-center justify-center">
        {url ? (
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img 
              src={`https://img.youtube.com/vi/${url.split('v=')[1]}/maxresdefault.jpg`} 
              alt={title}
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        ) : (
          <div className="text-center">
            <Spinner size={32} className="animate-spin text-teal mb-4 mx-auto" />
            <p className="text-sm text-text-muted">Đang tải video...</p>
          </div>
        )}
      </div>

      {/* Custom Controls Overlay */}
      <div className={`absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex justify-between items-start">
          <h3 className="text-white text-sm font-bold truncate max-w-[80%]">{title}</h3>
        </div>

        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="self-center w-20 h-20 bg-teal text-bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
        >
          <Play size={40} weight="fill" className={isPlaying ? 'hidden' : 'block'} />
          <div className={isPlaying ? 'block' : 'hidden'}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <rect x="6" y="6" width="6" height="20" fill="currentColor" rx="2" />
              <rect x="20" y="6" width="6" height="20" fill="currentColor" rx="2" />
            </svg>
          </div>
        </button>

        <div className="space-y-4">
          <div className="h-1.5 w-full bg-white/20 rounded-full cursor-pointer relative group/progress">
            <div className="h-full bg-teal w-1/3 rounded-full relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform" />
            </div>
          </div>
          <div className="flex items-center justify-between text-white text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-6">
              <span>04:12 / 12:45</span>
              <button><SpeakerHigh size={18} /></button>
            </div>
            <button><ArrowsOut size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}
