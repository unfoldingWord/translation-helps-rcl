function arrayEquals(_a, _b) {
  const a = _a.sort()
  const b = _b.sort()

  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  )
}

export default function determineDiffTsvVersion(initialHeaders, headers) {
  return !arrayEquals(initialHeaders, headers)
}
