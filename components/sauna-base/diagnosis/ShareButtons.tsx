'use client'

import { useState, useEffect } from 'react'
import { Share2, Check } from 'lucide-react'
import type { TotonoiProfile } from '@/types/sauna-base'

const SITE_URL = 'https://sauna-base.vercel.app'

export function ShareButtons({ profile }: { profile: TotonoiProfile }) {
  const [shared, setShared] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
  }, [])

  const shareUrl = `${SITE_URL}/share/${profile.code}`
  const shareText = `私のTOTONOI CODE は ${profile.code}（${profile.typeName}）${profile.emoji}\n\n#SAUNABASE #ととのい #サウナ`

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: `TOTONOI CODE: ${profile.code} — ${profile.typeName}`,
        text: shareText,
        url: shareUrl,
      })
      setShared(true)
      setTimeout(() => setShared(false), 3000)
    } catch {
      // user cancelled
    }
  }

  const encodedText = encodeURIComponent(`${shareText}\n${shareUrl}`)
  const xUrl       = `https://twitter.com/intent/tweet?text=${encodedText}`
  const lineUrl    = `https://line.me/R/share?text=${encodedText}`
  const threadsUrl = `https://www.threads.net/intent/post?text=${encodedText}`

  return (
    <div
      className="rounded-3xl p-5"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      <p className="text-[10px] tracking-widest uppercase mb-3 text-[#1a2a10]/40 lg:text-white/38 text-center">
        Share your result
      </p>

      {/* Web Share API ボタン */}
      {canNativeShare && (
        <button
          onClick={handleNativeShare}
          className="w-full py-3.5 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.97] mb-3"
          style={{
            background: shared
              ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
              : 'linear-gradient(135deg, #a5d63a 0%, #5a9e28 100%)',
            boxShadow: '0 4px 20px rgba(165,214,58,0.35)',
          }}
        >
          {shared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {shared ? 'シェアしました！' : '結果をシェアする'}
        </button>
      )}

      {/* X / LINE / Threads */}
      <div className="flex gap-2">
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
          style={{
            background: 'rgba(0,0,0,0.70)',
            border: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <span className="text-sm font-black leading-none">𝕏</span>
          <span>X</span>
        </a>

        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
          style={{ background: '#06C755' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.04 2 11c0 3.12 1.68 5.88 4.28 7.6L5.5 22l3.62-1.9c.9.25 1.86.4 2.88.4 5.52 0 10-4.04 10-9S17.52 2 12 2z"/>
          </svg>
          <span>LINE</span>
        </a>

        <a
          href={threadsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all active:scale-[0.97]"
          style={{
            background: 'rgba(20,20,20,0.85)',
            border: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <svg width="13" height="14" viewBox="0 0 192 192" fill="white">
            <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.724-10.548 21.348-10.548h.229c8.249.053 14.474 2.452 18.503 7.129 2.932 3.405 4.893 8.11 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.14-23.82 1.371-39.134 15.264-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.452-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.35-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 9.98 15.792 12.659 26.012l16.051-4.296c-3.308-12.458-8.73-23.322-16.254-32.405C147.036 9.972 125.049.424 97.07.2h-.113C69.019.424 47.257 9.994 32.8 28.413 19.894 45.051 13.187 68.703 12.937 96c.25 27.297 6.957 50.948 19.864 67.586C47.257 182.006 69.019 191.576 96.957 191.8h.113c24.96-.197 42.549-6.73 57.04-21.208 18.919-18.899 18.304-42.554 12.077-57.07-4.557-10.622-13.228-19.283-24.65-24.534z"/>
          </svg>
          <span>Threads</span>
        </a>
      </div>
    </div>
  )
}
