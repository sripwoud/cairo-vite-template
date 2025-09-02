export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function titleCase(str: string) {
  return str
    .split('-')
    .map((word) => capitalize(word))
    .join(' ')
}
