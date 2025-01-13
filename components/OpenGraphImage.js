import { ImageResponse } from 'next/server'

export const OpenGraphImage = async ({ title, description }) => {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#2F3136',
          padding: '48px 64px',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '600',
            color: '#00A8FC',
            marginBottom: '24px',
            lineHeight: 1.3,
            maxWidth: '850px',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: '24px',
            color: '#DCDDDE',
            lineHeight: 1.4,
            maxWidth: '800px',
          }}
        >
          {description}
        </p>
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            fontSize: '16px',
            color: '#72767D',
          }}
        >
          openalgo.in
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await fetch(
            new URL('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfAZ9hiA.woff2')
          ).then((res) => res.arrayBuffer()),
          weight: 600,
          style: 'normal',
        }
      ],
    }
  )
}
