import { useCurrentFrame, interpolate } from 'remotion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceRemotionProps {
  messages: Message[]
  showThinking?: boolean
  typingProgress?: number // 0 to 1 for typing animation
  messageDelayFrames?: number
}

export function ChatInterfaceRemotion({
  messages,
  showThinking = false,
  typingProgress = 1,
  messageDelayFrames = 15,
}: ChatInterfaceRemotionProps) {
  const frame = useCurrentFrame()

  // Container entry animation
  const containerOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'white',
        opacity: containerOpacity,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
          }}
        />
        <span
          style={{
            fontSize: '18px',
            fontWeight: 500,
            color: '#111827',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Chat
        </span>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          backgroundColor: '#f9fafb',
        }}
      >
        {messages.map((message, i) => {
          const messageFrame = frame - i * messageDelayFrames
          const opacity = interpolate(messageFrame, [0, 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
          const y = interpolate(messageFrame, [0, 10], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })

          // For last message, apply typing progress
          const isLastMessage = i === messages.length - 1
          const displayContent =
            isLastMessage && typingProgress < 1
              ? message.content.slice(0, Math.floor(message.content.length * typingProgress))
              : message.content

          const isUser = message.role === 'user'

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                opacity,
                transform: `translateY(${y}px)`,
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                    <path d="M12 8V4H8" />
                    <rect x="4" y="8" width="16" height="12" rx="2" />
                    <path d="M2 14h2" />
                    <path d="M20 14h2" />
                    <path d="M15 13v2" />
                    <path d="M9 13v2" />
                  </svg>
                </div>
              )}

              <div
                style={{
                  maxWidth: '75%',
                  padding: '14px 20px',
                  borderRadius: '20px',
                  borderBottomRightRadius: isUser ? '6px' : '20px',
                  borderBottomLeftRadius: isUser ? '20px' : '6px',
                  backgroundColor: isUser ? '#3b82f6' : 'white',
                  color: isUser ? 'white' : '#111827',
                  fontSize: '18px',
                  lineHeight: 1.5,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: isUser ? 'none' : '1px solid #e5e7eb',
                }}
              >
                {displayContent}
                {isLastMessage && typingProgress < 1 && (
                  <span style={{ opacity: 0.5 }}>|</span>
                )}
              </div>

              {isUser && (
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
          )
        })}

        {/* Thinking indicator */}
        {showThinking && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              opacity: interpolate(frame % 60, [0, 30, 60], [0.5, 1, 0.5]),
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <path d="M12 8V4H8" />
                <rect x="4" y="8" width="16" height="12" rx="2" />
              </svg>
            </div>
            <div
              style={{
                padding: '16px 24px',
                borderRadius: '20px',
                borderBottomLeftRadius: '6px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#9ca3af',
                      opacity: interpolate((frame + i * 10) % 30, [0, 15, 30], [0.3, 1, 0.3]),
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: '16px', color: '#6b7280', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Claude is thinking...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          padding: '20px',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            backgroundColor: '#f3f4f6',
            borderRadius: '16px',
            padding: '16px 20px',
            color: '#9ca3af',
            fontSize: '16px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Type a message...
        </div>
      </div>
    </div>
  )
}
