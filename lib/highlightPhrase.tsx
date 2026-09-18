import type React from 'react'

// Wrap the FIRST case-sensitive occurrence of `phrase` inside `text` with a
// <span className={className}>, returning the surrounding text untouched. No
// regex, no dangerouslySetInnerHTML — plain string slicing keeps the match
// literal (no special characters to escape) and the output pure React nodes.
export function highlightPhrase(
  text: string,
  phrase: string,
  className: string
): React.ReactNode {
  if (!phrase) return text

  const start = text.indexOf(phrase)
  if (start === -1) return text

  const before = text.slice(0, start)
  const match = text.slice(start, start + phrase.length)
  const after = text.slice(start + phrase.length)

  return (
    <>
      {before}
      <span className={className}>{match}</span>
      {after}
    </>
  )
}
