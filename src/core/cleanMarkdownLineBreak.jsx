export default function cleanMarkdownLineBreak(markdown) {
  return markdown.replace(/\n/g, '<br>')
}
