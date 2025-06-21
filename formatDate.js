export default function formatDate(stringDate) {
  const date = new Date(stringDate)
  const pad = (n) => (n < 10 ? '0' + n : n)

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())

  let hours = date.getHours()
  const minutes = pad(date.getMinutes())
  const ampm = hours >= 12 ? 'AM' : 'PM'
  hours = hours % 12 || 12

  return `${year}-${month}-${day}, ${pad(hours)}:${minutes} ${ampm}`
}
