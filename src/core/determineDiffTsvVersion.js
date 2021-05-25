export default function determineDiffTsvVersion(filters, headers) {
  const Annotation =
    (filters.includes('Annotation') && !headers.includes('Annotation')) ||
    (!filters.includes('Annotation') && headers.includes('Annotation'))

  const Note =
    (filters.includes('Note') && !headers.includes('Note')) ||
    (!filters.includes('Note') && headers.includes('Note'))

  const OccurrenceNote =
    (filters.includes('OccurrenceNote') &&
      !headers.includes('OccurrenceNote')) ||
    (!filters.includes('OccurrenceNote') && headers.includes('OccurrenceNote'))

  const Reference =
    (filters.includes('Reference') && !headers.includes('Reference')) ||
    (!filters.includes('Reference') && headers.includes('Reference'))

  return Annotation || Note || OccurrenceNote || Reference
}
