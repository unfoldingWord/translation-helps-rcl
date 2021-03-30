/**
 * Strips bible reference links from markdown string.
 * @param {String} markdown
 * @returns
 */
export default function stripReferenceLinksFromMarkdown(markdown) {
  if (!markdown) {
    return markdown
  }
  // OBS tN: Convert all [<Title>](rc://<lang>/tn/help/obs/*) links to just show "Open Bible Stories - <Title>"
  markdown = markdown.replace(
    /\[([^\]]+)\]\(rc:\/\/[^/]+\/tn\/help\/obs[^)]+\)/g,
    'Open Bible Stories - $1'
  )
  // tN: Convert all [<Bible Ref>](rc://<lang>/tn/*) links to just show the <Bible ref> (no link)
  markdown = markdown.replace(/\[([^\]]+)\]\(rc:\/\/[^/]+\/tn\/[^)]+\)/g, '$1')

  return markdown
}
