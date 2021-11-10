export default function getNoteLabel({ Annotation, Note, OccurrenceNote }) {
  if (Annotation || typeof Annotation == 'string') {
    return 'Annotation'
  } else if (Note || typeof Note == 'string') {
    return 'Note'
  } else if (OccurrenceNote || typeof OccurrenceNote == 'string') {
    return 'OccurrenceNote'
  } else {
    return null
  }
}
