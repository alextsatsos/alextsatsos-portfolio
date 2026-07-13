import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt =
  "Alex Tsatsos — Senior UX & Product Designer. I design the software nobody brags about, but everybody depends on."

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Cloudinary headshot, thumb-cropped and centered on the face (z_0.7 pulls
// back so the face sits centered in the circle) and served as JPEG so satori
// can decode it (avoids f_auto handing back webp/avif).
const HEADSHOT =
  'https://res.cloudinary.com/dreujg6yv/image/upload/c_thumb,g_face,z_0.7,w_540,h_540,f_jpg,q_90/alex-tsatsos--headshot-hero'

// Tagline rendered word-by-word so it wraps at natural breakpoints; "everybody"
// carries the lime underline (absolutely positioned so it clears the letters).
const TAGLINE = 'I design the software nobody brags about — but everybody depends on.'

// Static single-weight slices — the OG font parser can't read the project's
// variable-font fvar tables, so these are pinned weights fetched from Google.
const FONT_DIR = join(process.cwd(), 'public', 'og-fonts')

export default async function Image() {
  const [bricolage800, bricolage600, architects, hanken] = await Promise.all([
    readFile(join(FONT_DIR, 'Bricolage-800.ttf')),
    readFile(join(FONT_DIR, 'Bricolage-600.ttf')),
    readFile(join(FONT_DIR, 'ArchitectsDaughter-400.ttf')),
    readFile(join(FONT_DIR, 'Hanken-500.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '72px 76px',
          backgroundColor: '#133464',
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.09) 1.5px, transparent 1.5px), linear-gradient(135deg, #133464, #1a4280)',
          backgroundSize: '24px 24px, 100% 100%',
          fontFamily: 'Hanken',
        }}
      >
        {/* Left: text block */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: 620,
          }}
        >
          <div
            style={{
              fontFamily: 'Architects',
              fontSize: 30,
              color: 'rgba(255,255,255,0.94)',
              marginBottom: 18,
            }}
          >
            → Senior UX &amp; Product Designer
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              fontFamily: 'Bricolage',
              fontWeight: 800,
              fontSize: 92,
              lineHeight: 1,
              color: '#ffffff',
              marginBottom: 28,
            }}
          >
            Hi! I&apos;m Alex<span style={{ color: '#FF2687' }}>.</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: 11,
              rowGap: 12,
              fontFamily: 'Bricolage',
              fontWeight: 600,
              fontSize: 33,
              lineHeight: 1.32,
              color: '#F7F6F2',
              maxWidth: 560,
            }}
          >
            {TAGLINE.split(' ').map((word, i) =>
              word === 'everybody' ? (
                <div key={i} style={{ display: 'flex', position: 'relative' }}>
                  <span style={{ display: 'flex' }}>everybody</span>
                  <svg
                    width="100%"
                    height="10"
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                    style={{ position: 'absolute', left: 0, bottom: -13, width: '100%' }}
                  >
                    <path
                      d="M3 8 L197 3"
                      stroke="#D8FF76"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
              ) : (
                <span key={i} style={{ display: 'flex' }}>
                  {word}
                </span>
              )
            )}
          </div>

          <div
            style={{
              fontFamily: 'Hanken',
              fontWeight: 500,
              fontSize: 23,
              color: 'rgba(255,255,255,0.6)',
              marginTop: 44,
              letterSpacing: 0.3,
            }}
          >
            alextsatsos.com
          </div>
        </div>

        {/* Right: circular headshot with white ring */}
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HEADSHOT}
            width={372}
            height={372}
            alt=""
            style={{
              borderRadius: '50%',
              border: '7px solid #ffffff',
              objectFit: 'cover',
              boxShadow: '0 18px 50px rgba(0,0,0,0.32)',
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Bricolage', data: bricolage800, style: 'normal', weight: 800 },
        { name: 'Bricolage', data: bricolage600, style: 'normal', weight: 600 },
        { name: 'Architects', data: architects, style: 'normal', weight: 400 },
        { name: 'Hanken', data: hanken, style: 'normal', weight: 500 },
      ],
    }
  )
}
