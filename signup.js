import { createAccount } from './lib/auth.js'
import clearErrors from './utils/clearErrors.js'
import showError from './utils/showError.js'

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registration-form')

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    clearErrors()

    let isValid = true
    const errors = []

    const firstName = document.getElementById('first-name').value.trim()
    if (!firstName) {
      showError('first-name', 'First name is required')
      isValid = false
      errors.push('First name is required')
    } else if (firstName.length < 2) {
      showError('first-name', 'First name must be at least 2 characters')
      isValid = false
      errors.push('First name must be at least 2 characters')
    }

    const lastName = document.getElementById('last-name').value.trim()
    if (!lastName) {
      showError('last-name', 'Last name is required')
      isValid = false
      errors.push('Last name is required')
    } else if (lastName.length < 2) {
      showError('last-name', 'Last name must be at least 2 characters')
      isValid = false
      errors.push('Last name must be at least 2 characters')
    }

    const email = document.getElementById('email').value.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      showError('email', 'Email is required')
      isValid = false
      errors.push('Email is required')
    } else if (!emailRegex.test(email)) {
      showError('email', 'Please enter a valid email address')
      isValid = false
      errors.push('Please enter a valid email address')
    }

    const gender = document.getElementById('gender').value
    if (!gender) {
      showError('gender', 'Gender is required')
      isValid = false
      errors.push('Gender is required')
    }

    const password = document.getElementById('password').value
    if (!password) {
      showError('password', 'Password is required')
      isValid = false
      errors.push('Password is required')
    } else if (password.length < 8) {
      showError('password', 'Password must be at least 8 characters')
      isValid = false
      errors.push('Password must be at least 8 characters')
    }

    const confirmPassword = document.getElementById('confirm-password').value
    if (!confirmPassword) {
      showError('confirm-password', 'Please confirm your password')
      isValid = false
      errors.push('Please confirm your password')
    } else if (password !== confirmPassword) {
      showError('confirm-password', 'Passwords do not match')
      isValid = false
      errors.push('Passwords do not match')
    }

    if (isValid) {
      const formData = {
        fullName: (firstName + ' ' + lastName).trim(),
        email: email,
        gender: gender,
        password: password,
        cart: [],
        favs: [],
      }

      createAccount(formData)
      alert('Registration successful!')
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
