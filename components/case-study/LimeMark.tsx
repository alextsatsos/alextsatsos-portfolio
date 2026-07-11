import styles from './LimeMark.module.css'

interface Props {
  children: React.ReactNode
}

// Same lime highlight as LimeUnderline, but painted with a background-image
// instead of an absolutely-positioned SVG overlay, so it stays correct when
// the marked phrase wraps across multiple lines (e.g. inside body prose).
export default function LimeMark({ children }: Props) {
  return <span className={styles.mark}>{children}</span>
}
