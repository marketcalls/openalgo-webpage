import { ImageResponse } from 'next/og'

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
          backgroundColor: '#031B4E',
          backgroundImage: 'linear-gradient(135deg, #031B4E 0%, #1e3a8a 100%)',
          padding: '48px 64px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#00A8FC',
              borderRadius: '12px',
              marginRight: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            OA
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            OpenAlgo
          </div>
        </div>
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px',
            lineHeight: 1.2,
            maxWidth: '900px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: '24px',
            color: '#E5E8ED',
            lineHeight: 1.4,
            maxWidth: '800px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {description}
        </p>
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '64px',
            fontSize: '18px',
            color: '#94A3B8',
            fontFamily: 'system-ui, -apple-system, sans-serif',
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
