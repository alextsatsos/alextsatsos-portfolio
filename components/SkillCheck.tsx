import styles from './SkillCheck.module.css'

interface Props {
  label: string
}

export default function SkillCheck({ label }: Props) {
  return (
    <div className={styles.item}>
      <span className={styles.box} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="13" height="13">
          <path
            d="M5 12l4 4 10-11"
            fill="none"
            stroke="var(--pink)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
