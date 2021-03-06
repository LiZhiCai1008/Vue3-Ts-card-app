export const NumberCut = (value?: string|number): string => {
  if (!value) return ""
  return value.toString().replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, '$1 ')
}