'use client'

import { useEffect, useState } from 'react'
import styles from './TableOfContents.module.css'

export interface TocItem {
  id: string
  label: string
}

interface Props {
  items: TocItem[]
}

export default function TableOfContents({ items }: Props) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-96px 0px -70% 0px' }
    )

    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [items])

  return (
    <ol className={styles.list}>
      {items.map((item, i) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={item.id === activeId ? `${styles.link} ${styles.active}` : styles.link}
          >
            <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  )
}
