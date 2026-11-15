export const rs = (amount) => `Rs ${Number(amount).toFixed(2)}`

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })