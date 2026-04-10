export function ChatBubble({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.25 11.25H12C13.2428 11.25 14.25 10.2428 14.25 9V3C14.25 1.75725 13.2428 0.75 12 0.75H3C1.75725 0.75 0.75 1.75725 0.75 3V9C0.75 10.2428 1.75725 11.25 3 11.25H4.5V14.25L8.25 11.25"
        fill="currentColor"
      />
      <path
        d="M8.25 11.25H12C13.2428 11.25 14.25 10.2428 14.25 9V3C14.25 1.75725 13.2428 0.75 12 0.75H3C1.75725 0.75 0.75 1.75725 0.75 3V9C0.75 10.2428 1.75725 11.25 3 11.25H4.5V14.25L8.25 11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
