export const generateAccountNumber = (): string => {
  const prefix = '10'
  const random = Math.floor(100000000 + Math.random() * 900000000) // 9 dígitos
  return `${prefix}${random}` // 11 dígitos en total
}
