const iconClass = "sr-icon";

export function TicketIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      className={iconClass}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
      <path d="M13 5v2" />
      <path d="M13 11v2" />
      <path d="M13 17v2" />
    </svg>
  );
}

export function ClapperboardIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      className={iconClass}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" />
      <path d="m6.2 5.3 3.1 3.9" />
      <path d="m12.4 3.4 3.1 4" />
      <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    </svg>
  );
}

export function MicrophoneIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      className={iconClass}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

export function SparklesIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      className={iconClass}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3 4.5 4.5 3 5l1.5.5L5 7l.5-1.5L7 5l-1.5-.5L5 3Z" />
      <path d="M19 13l-.5 1.5-1.5.5 1.5.5.5 1.5.5-1.5 1.5-.5-1.5-.5L19 13Z" />
    </svg>
  );
}

export function ClipboardIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      className={iconClass}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="16" y2="16" />
      <line x1="8" y1="8" x2="12" y2="8" />
    </svg>
  );
}

export function UserBadgeIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      className={iconClass}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="10" cy="8" r="4" />
      <path d="M10.3 20H4a2 2 0 0 1-2-2c0-3.3 2.7-6 6-6h1.3" />
      <path d="m18 14.5.75 2.25L21 17.5l-2.25.75L18 20.5l-.75-2.25L15 17.5l2.25-.75L18 14.5Z" />
    </svg>
  );
}

export function VideoCameraIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      className={iconClass}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 8l6-3v14l-6-3" />
      <rect x="2" y="5" width="14" height="14" rx="2" />
    </svg>
  );
}
