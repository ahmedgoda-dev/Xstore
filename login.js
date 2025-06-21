import { login } from './lib/auth.js'

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('login-form')
  const errorBox = document.getElementById('error-box')
  console.log(errorBox)
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const email = document.getElementById('email').value.trim()

    const password = document.getElementById('password').value

    const valid = login(email, password)
    if (valid !== true) {
      errorBox.style.display = 'block'
      errorBox.innerHTML = `<strong>Error while login:</strong><p>${valid}</p>`
    } else {
      alert('Loggedin successfully!')
      location.assign('/')
      form.reset()
    }
  })

  const inputs = document.querySelectorAll('input, select')
  inputs.forEach((input) => {
    input.addEventListener('input', function () {
      this.style.borderColor = ''
      const errorMessage = this.nextElementSibling
      if (errorMessage && errorMessage.classList.contains('error-message')) {
        errorMessage.textContent = ''
        errorMessage.style.display = 'none'
      }
    })
  })
})
