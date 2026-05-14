function BackToMenuButton({ onBack, variant = 'fixed' }) {
  const className =
    variant === 'embedded'
      ? 'back-to-menu back-to-menu--embedded'
      : variant === 'map-overlay'
        ? 'back-to-menu back-to-menu--map-overlay'
        : 'back-to-menu'

  return (
    <button
      type="button"
      className={className}
      onClick={onBack}
      aria-label="Retour au menu"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        />
      </svg>
    </button>
  )
}

export default BackToMenuButton
