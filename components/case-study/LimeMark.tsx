import styles from './LimeMark.module.css'

interface Props {
  children: React.ReactNode
}

// Lime highlight fill for light backgrounds (vs. LimeUnderline's SVG stroke,
// used on navy backgrounds). A background fill instead of an
// absolutely-positioned SVG overlay stays correct when the marked phrase
// wraps across multiple lines (e.g. inside body prose).
export default function LimeMark({ children }: Props) {
  return <span className={styles.mark}>{children}</span>
}
