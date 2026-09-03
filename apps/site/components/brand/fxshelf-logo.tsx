import styles from './fxshelf-logo.module.css'

type FxshelfLogoProps = {
  className?: string
  /** Show wordmark next to the mark. Default true. */
  withWordmark?: boolean
  /** Mark size in CSS pixels. Default 22. */
  size?: number
}

/**
 * Brand mark: two shelf planks + an accent motion trail.
 * Wordmark uses currentColor; trail uses --fx-accent.
 */
export function FxshelfLogo({
  className,
  withWordmark = true,
  size = 22,
}: FxshelfLogoProps) {
  return (
    <span
      className={['inline-flex items-center gap-2', className].filter(Boolean).join(' ')}
    >
      <svg
        className={styles.mark}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
      >
        <rect
          x="1.5"
          y="1.5"
          width="29"
          height="29"
          rx="7.5"
          fill="currentColor"
          opacity="0.1"
        />
        {/* upper shelf */}
        <rect
          className={`${styles.shelf} ${styles.shelfTop}`}
          x="6.5"
          y="10"
          width="19"
          height="2.75"
          rx="1.35"
          fill="currentColor"
        />
        {/* lower shelf — shorter, like a packed shelf */}
        <rect
          className={`${styles.shelf} ${styles.shelfBottom}`}
          x="6.5"
          y="17.5"
          width="13.5"
          height="2.75"
          rx="1.35"
          fill="currentColor"
        />
        {/* motion trail: rising streak + tip */}
        <path
          className={styles.trail}
          d="M12.2 23.2 C16.8 19.4 20.2 16.6 24.8 13.2"
          stroke="var(--fx-accent)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle
          className={styles.trail}
          cx="24.8"
          cy="13.2"
          r="2.15"
          fill="var(--fx-accent)"
        />
      </svg>
      {withWordmark ? (
        <span className="font-semibold tracking-tight">fxshelf</span>
      ) : null}
    </span>
  )
}
