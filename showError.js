export default function showError(fieldId, message) {
  const field = document.getElementById(fieldId)
  const errorMessage = field.nextElementSibling

  field.style.borderColor = 'red'
  errorMessage.textContent = message
  errorMessage.style.display = 'block'
}
