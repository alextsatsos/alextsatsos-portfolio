import PrototypeEmbed from './PrototypeEmbed'
import styles from './PrototypePair.module.css'

export interface PairedEmbed {
  url: string | null
  label: string
  title: string
}

interface Props {
  embeds: PairedEmbed[]
}

// Two prototypes shown side by side (e.g. a mobile and a desktop direction),
// each in the same browser-chrome frame as a single PrototypeEmbed. Each gets
// its own label and a data-driven accessible title so screen readers can tell
// the two iframes apart. Stacks on narrow viewports.
export default function PrototypePair({ embeds }: Props) {
  return (
    <div className={styles.pair}>
      {embeds.map((embed, i) => (
        <PrototypeEmbed key={i} embedUrl={embed.url} label={embed.label} title={embed.title} />
      ))}
    </div>
  )
}
