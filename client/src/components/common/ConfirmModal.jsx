import React from 'react'

/**
 * ConfirmModal - A premium, global confirmation dialog replacement for window.confirm
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {string} props.title - Modal title (optional)
 * @param {string} props.message - Main message text
 * @param {function} props.onConfirm - Callback when user clicks 'Confirm'
 * @param {function} props.onCancel - Callback when user clicks 'Cancel'
 * @param {string} props.type - 'danger' (red) or 'info' (gold)
 */
export default function ConfirmModal({ 
  isOpen, 
  title = 'Xác nhận', 
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?', 
  onConfirm, 
  onCancel,
  type = 'danger' 
}) {
  if (!isOpen) return null

  // Prevent background clicks from closing if needed, but here we use a standard overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onCancel()
  }

  const accentColor = type === 'danger' ? 'var(--c-primary)' : 'var(--c-gold)'
  const accentShadow = type === 'danger' ? 'rgba(229,9,20,.3)' : 'rgba(245,197,24,.3)'

  return (
    <div 
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="card"
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--c-surface)',
          border: `1px solid ${accentShadow}`,
          boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 20px ${accentShadow}`,
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="card-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: 20,
            color: accentColor,
            filter: `drop-shadow(0 0 10px ${accentShadow})`
          }}>
            {type === 'danger' ? '⚠️' : '❓'}
          </div>
          
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 800, 
            marginBottom: 12,
            color: '#fff'
          }}>
            {title}
          </h2>
          
          <p style={{ 
            color: 'var(--c-text-muted)', 
            fontSize: '0.95rem',
            lineHeight: 1.6,
            marginBottom: 32
          }}>
            {message}
          </p>
          
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button 
              onClick={onCancel}
              className="btn btn-ghost" 
              style={{ flex: 1, height: 48 }}
            >
              Hủy bỏ
            </button>
            <button 
              onClick={onConfirm}
              className="btn" 
              style={{ 
                flex: 1, 
                height: 48,
                background: accentColor,
                color: '#fff',
                fontWeight: 700
              }}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}} />
    </div>
  )
}
