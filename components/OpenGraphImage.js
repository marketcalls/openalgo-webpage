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
          backgroundColor: '#ffffff',
          padding: '48px 64px',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: '600',
            color: '#000000',
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
            color: '#666666',
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
            color: '#888888',
          }}
        >
          openalgo.in
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
