import {
  currUser,
  deleteAllFavs,
  editAccount,
  favs,
  orders,
  updatePassword,
} from './lib/auth.js'
import appendAlertPage from './utils/appendAlertPage.js'
import clearErrors from './utils/clearErrors.js'
import createOrderItem from './utils/createOrderItem.js'
import createProductCard, {
  initCardListeners,
} from './utils/createProductCard.js'
import showError from './utils/showError.js'

document.addEventListener('DOMContentLoaded', function () {
  if (!currUser?.id)
    return (document.querySelector('.split-screen').innerHTML = appendAlertPage(
      `
      <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="var(--warning-color)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css">  .st0{fill:var(--warning-color);}  </style> <g> <path class="st0" d="M497.612,134.031c0,0-30.453,30.438-96.391,30.438c-49.922,0-107.156,5.016-145.234,55.906 c-38.078-50.891-95.313-55.906-145.219-55.906c-65.953,0-96.391-30.438-96.391-30.438s-39.625,83.703,12.688,170.281 c41.078,67.953,121.75,83.688,175.016,68.156c26.359-7.688,47.672-27.375,53.906-33.563c6.234,6.188,27.563,25.875,53.922,33.563 c53.266,15.531,133.938-0.203,175.032-68.156C537.253,217.734,497.612,134.031,497.612,134.031z M142.221,292.063 c-30.313-6.75-48.5-30.688-45.594-46.234c2.328-12.375,48.844-15.234,69.031-7.609c20.219,7.625,36.391,18.125,36.563,30.016 C202.393,280.109,172.549,298.813,142.221,292.063z M369.752,292.063c-30.313,6.75-60.156-11.953-60-23.828 c0.172-11.891,16.375-22.391,36.563-30.016s66.703-4.766,69.047,7.609C418.268,261.375,400.081,285.313,369.752,292.063z"></path> </g> </g></svg>`,
      'Forbeddin --Anonymous User',
      `Please Login First to go your profile Page <a href="login.html">
       Login
      </a>`
    ))

  updatePasswordInfo()
  updateAccountInfo()
  initWishList()
  initInProgressOrders()
  initCancelledOrders()
  initCompletedOrders()

  function updatePasswordInfo() {
    const form = document.getElementById('update-password-form')

    const oldPasswordInput = document.getElementById('old-password')
    const newPasswordInput = document.getElementById('password')
    const confirmPasswordInput = document.getElementById('confirm-password')

    form.addEventListener('submit', function (e) {
      const oldPassword = oldPasswordInput.value.trim()
      const newPassword = newPasswordInput.value.trim()
      const confirmPassword = confirmPasswordInput.value.trim()

      e.preventDefault()
      clearErrors()

      let isValid = true

      if (!oldPassword) {
        showError('old-password', 'Current password is required')
        isValid = false
      } else if (oldPassword !== currUser.password) {
        showError('old-password', 'Current password is not correct')
        isValid = false
      }

      if (!newPassword) {
        showError('password', 'New password is required')
        isValid = false
      } else if (newPassword.length < 8) {
        showError('password', 'Password must be at least 8 characters')
        isValid = false
      }

      if (!confirmPassword) {
        showError('confirm-password', 'Please confirm your password')
        isValid = false
      } else if (confirmPassword !== newPassword) {
        showError('confirm-password', 'Passwords do not match')
        isValid = false
      }

      if (isValid) {
        updatePassword(oldPassword, newPassword)
        alert('Your password has been updated successfully!')
        form.reset()
      }
    })
  }

  function updateAccountInfo() {
    const form = document.getElementById('edit-info-form')

    // Init values
    const fullNameInput = document.getElementById('full-name')
    const emailInput = document.getElementById('email')
    const genderInput = document.getElementById('gender')

    fullNameInput.value = currUser.fullName
    genderInput.value = currUser.gender
    emailInput.value = currUser.email

    form.addEventListener('submit', function (e) {
      const fullName = fullNameInput.value.trim()
      const email = emailInput.value.trim()
      const gender = genderInput.value
      console.log('object')
      e.preventDefault()
      clearErrors()

      let isValid = true

      if (!fullName) {
        showError('full-name', 'Your name is required')
        isValid = false
      } else if (fullName.length < 2) {
        showError('full-name', 'Your name must be at least 2 characters')
        isValid = false
      } else if (fullName.length > 32) {
        showError('full-name', 'Your name must be at least 2 characters')
        isValid = false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email) {
        showError('email', 'Email is required')
        isValid = false
      } else if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address')
        isValid = false
      }

      if (!gender) {
        showError('gender', 'Gender is required')
        isValid = false
      }

      if (isValid) {
        editAccount({
          fullName,
          email,
          gender,
        })
        alert(`Your account info updated successful!
       Full name: ${fullName}
       Email: ${email}
       Gender: ${gender}
       `)
      }
    })
  }

  function initWishList() {
    const wishListContainer = document.getElementById('wish-list-data')
    const deleteAllBtn = document.getElementById('delete-all-fav')
    deleteAllBtn.addEventListener('click', () => {
      deleteAllFavs(initWishList)
    })

    if (favs.length) {
      wishListContainer.innerHTML = favs
        .map((fav) => createProductCard(fav, false))
        .join('')
      initCardListeners('wish-list-data', { onFav: initWishList })
    } else {
      wishListContainer.innerHTML = appendAlertPage(
        undefined,
        `Empty List`,
        `Go to <a href="shopping.html">Shopping Page</a> and Add Your Favourites.`
      )
      deleteAllBtn.remove()
    }

    console.log(wishListContainer)
  }

  function initInProgressOrders() {
    const ordersInProgressContainer = document.getElementById(
      'orders-in-progress-wrapper'
    )
    console.log(orders)
    for (const order of orders) {
      if (order.status === 'in-progress')
        ordersInProgressContainer.innerHTML += createOrderItem(order)
    }
  }

  function initCompletedOrders() {
    const ordersCompletedContainer = document.getElementById(
      'orders-completed-wrapper'
    )
    console.log(orders)
    for (const order of orders) {
      if (order.status === 'completed')
        ordersCompletedContainer.innerHTML += createOrderItem(order)
    }
  }

  function initCancelledOrders() {
    const ordersCancelledContainer = document.getElementById(
      'orders-cancelled-wrapper'
    )
    console.log(orders)
    for (const order of orders) {
      if (order.status === 'cancelled')
        ordersCancelledContainer.innerHTML += createOrderItem(order)
    }
  }

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
