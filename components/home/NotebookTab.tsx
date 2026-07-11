import styles from './NotebookTab.module.css'

interface Props {
  label: string
  variant?: 'navy' | 'pink'
}

export default function NotebookTab({ label, variant = 'navy' }: Props) {
  return (
    <h2 className={`${styles.tab} ${variant === 'pink' ? styles.pink : ''}`}>
      {label}
    </h2>
  )
}
