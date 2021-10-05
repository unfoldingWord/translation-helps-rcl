export default function getNoteLabel({ Annotation, Note, OccurrenceNote }) {
  if (Annotation) {
    return 'Annotation'
  } else if (Note) {
    return 'Note'
  } else if (OccurrenceNote) {
    return 'OccurrenceNote'
  } else {
    return null
  }
}
