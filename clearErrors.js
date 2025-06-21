export default function clearErrors() {
  const errorMessages = document.querySelectorAll('.error-message')
  errorMessages.forEach((msg) => {
    msg.textContent = ''
    msg.style.display = 'none'
  })

  const inputs = document.querySelectorAll('input, select')
  inputs.forEach((input) => {
    input.style.borderColor = ''
  })
}
