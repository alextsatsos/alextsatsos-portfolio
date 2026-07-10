import styles from './LimeUnderline.module.css'

interface Props {
  children: React.ReactNode
  width?: number
}

export default function LimeUnderline({ children, width = 100 }: Props) {
  return (
    <span className={styles.wrap}>
      {children}
      <svg
        className={styles.svg}
        viewBox={`0 0 ${width} 10`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d={`M0 7 L${width} 4`}
          stroke="#D8FF76"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

interface TextWithKeyPhraseProps {
  text: string
  keyPhrase?: string | null
}

export function TextWithKeyPhrase({ text, keyPhrase }: TextWithKeyPhraseProps) {
  const index = keyPhrase ? text.indexOf(keyPhrase) : -1
  if (!keyPhrase || index === -1) return <>{text}</>

  const before = text.slice(0, index)
  const after = text.slice(index + keyPhrase.length)

  return (
    <>
      {before}
      <LimeUnderline width={Math.min(keyPhrase.length * 6.2, 420)}>{keyPhrase}</LimeUnderline>
      {after}
    </>
  )
}
