import { ImageResponse } from 'next/og'
import { buildProfile } from '@/lib/sauna-base/profileRecommendations'
import type { Heat, Water, Mind, Style } from '@/types/sauna-base'

export const runtime = 'edge'

async function loadJapaneseFont(): Promise<ArrayBuffer> {
  const css = await fetch(
    'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap',
    { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SaunaBase/1.0)' } }
  ).then(r => r.text())

  const fontUrl = css.match(/src: url\((.+?)\) format/)?.[1]
  if (!fontUrl) throw new Error('font URL not found')
  return fetch(fontUrl).then(r => r.arrayBuffer())
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = (searchParams.get('code') ?? 'BCFR').toUpperCase()

  if (code.length !== 4) {
    return new Response('Invalid code', { status: 400 })
  }

  const [h, w, m, s] = code.split('')
  const profile = buildProfile(h as Heat, w as Water, m as Mind, s as Style)
  const fontData = await loadJapaneseFont()

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#1a2a10',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Noto Sans JP"',
          position: 'relative',
        }}
      >
        {/* 背景グロー */}
        <div style={{
          position: 'absolute',
          width: 480, height: 480,
          borderRadius: '50%',
          background: 'rgba(165,214,58,0.08)',
          top: 75, left: 360,
          display: 'flex',
        }} />

        {/* ヘッダー */}
        <div style={{
          position: 'absolute', top: 42,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 22, color: '#a5d63a' }}>🌿</span>
          <span style={{ color: '#a5d63a', fontSize: 20, letterSpacing: 8, fontWeight: 700 }}>
            SAUNA BASE
          </span>
        </div>

        {/* サブテキスト */}
        <div style={{ color: 'rgba(255,255,255,0.40)', fontSize: 20, letterSpacing: 4, marginBottom: 22, display: 'flex' }}>
          あなたのととのいタイプ
        </div>

        {/* 動物絵文字 */}
        <div style={{ fontSize: 96, lineHeight: 1, marginBottom: 24, display: 'flex' }}>
          {profile.emoji}
        </div>

        {/* TOTONOI CODE ボックス */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
          {code.split('').map((letter, i) => (
            <div
              key={i}
              style={{
                width: 72, height: 72,
                background: 'rgba(165,214,58,0.14)',
                border: '2px solid rgba(165,214,58,0.40)',
                borderRadius: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                fontWeight: 700,
                color: '#a5d63a',
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* タイプ名 */}
        <div style={{ color: 'white', fontSize: 42, fontWeight: 700, marginBottom: 16, display: 'flex' }}>
          {profile.typeName}
        </div>

        {/* 動物バッジ */}
        <div style={{
          padding: '10px 30px',
          borderRadius: 99,
          background: 'rgba(165,214,58,0.12)',
          border: '1.5px solid rgba(165,214,58,0.35)',
          color: '#a5d63a',
          fontSize: 22,
          fontWeight: 600,
          display: 'flex',
        }}>
          {profile.animalName}タイプ
        </div>

        {/* フッター */}
        <div style={{
          position: 'absolute', bottom: 38,
          color: 'rgba(255,255,255,0.22)', fontSize: 17, display: 'flex',
          letterSpacing: 1,
        }}>
          sauna-base.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Noto Sans JP', data: fontData, style: 'normal', weight: 700 }],
    }
  )
}
