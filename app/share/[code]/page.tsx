import type { Metadata } from 'next'
import Link from 'next/link'
import { buildProfile } from '@/lib/sauna-base/profileRecommendations'
import { TotonoiResultCard } from '@/components/sauna-base/totonoi/TotonoiResultCard'
import type { Heat, Water, Mind, Style, TotonoiProfile } from '@/types/sauna-base'

type Props = { params: Promise<{ code: string }> }

function parseProfile(raw: string): TotonoiProfile | null {
  const code = raw.toUpperCase()
  if (code.length !== 4) return null
  const [h, w, m, s] = code.split('')
  try {
    return buildProfile(h as Heat, w as Water, m as Mind, s as Style)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const profile = parseProfile(code)
  if (!profile) return { title: 'SAUNA BASE' }

  const title = `TOTONOI CODE: ${profile.code} — ${profile.typeName} | SAUNA BASE`
  const description = profile.description || `${profile.animalName}タイプのととのいスタイルを発見しました。`
  const ogImage = `/api/og/totonoi?code=${profile.code}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      siteName: 'SAUNA BASE',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function SharePage({ params }: Props) {
  const { code } = await params
  const profile = parseProfile(code)

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-[#1a2a10]/60 lg:text-white/60">無効なコードです</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-sm space-y-4">
        <TotonoiResultCard profile={profile} variant="full" />

        <Link
          href="/onboarding"
          className="block w-full py-4 rounded-2xl text-sm font-bold text-white text-center transition-all active:scale-[0.97]"
          style={{
            background: 'linear-gradient(135deg, #a5d63a 0%, #5a9e28 100%)',
            boxShadow: '0 4px 24px rgba(165,214,58,0.4), 0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          あなたも診断してみる →
        </Link>
      </div>
    </div>
  )
}
