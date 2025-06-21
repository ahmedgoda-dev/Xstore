import { cart, submitOrder } from './lib/auth.js'
import appendAlertPage from './utils/appendAlertPage.js'
import createCheckoutTable from './utils/createCheckoutTable.js'
import generateRowCheckout from './utils/generateRowCheckout.js'

document.addEventListener('DOMContentLoaded', () => {
  if (!cart.length) {
    document.querySelector('.data-wrapper').innerHTML = appendAlertPage(
      undefined,
      'Empty Cart',
      'You have no items in the cart go to the <a href="shopping.html">shopping page</a> and Add items!'
    )
    return
  }

  const shipping = document.getElementById('shipping')
  console.log(shipping.value)
  const payment = document.getElementById('payment')
  const paymentDetails = document.getElementById('paymentDetails')
  const checkoutForm = document.getElementById('checkoutForm')
  const cardNumber = document.getElementById('cardNumber')
  const cardName = document.getElementById('cardName')
  const cardCVV = document.getElementById('cardCVV')

  payment.addEventListener('change', () => {
    if (payment.value === 'card') {
      paymentDetails.classList.remove('hidden')
      paymentDetails.querySelectorAll('input').forEach((input) => {
        input.required = true
      })
    } else {
      paymentDetails.classList.add('hidden')
      paymentDetails.querySelectorAll('input').forEach((input) => {
        input.required = false
        input.value = ''
      })
    }
  })

  shipping.addEventListener('change', renderCheckoutTable)

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault()

    if (!checkoutForm.checkValidity()) {
      alert('Please fill out all required fields.')
      form.reportValidity()
      return
    }

    if (payment.value === 'card') {
      if (cardNumber.value.trim().length < 12 || isNaN(cardNumber.value)) {
        alert('Invalid card number.')
        return
      }

      if (cardCVV.value.trim().length !== 3 || isNaN(cardCVV.value)) {
        alert('Invalid CVV.')
        return
      }
    }

    const data = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      address1: document.getElementById('address1').value.trim(),
      address2: document.getElementById('address2').value.trim(),
      country: document.getElementById('country').value.trim(),
      city: document.getElementById('city').value,
      notes: document.getElementById('notes').value.trim(),
      shipping: document.getElementById('shipping').value,
      payment: payment.value,
      paymentDetails:
        payment.value === 'card'
          ? {
              cardNumber: cardNumber.value.trim(),
              cardName: cardName.value.trim(),
              cardCVV: cardCVV.value.trim(),
            }
          : null,
    }

    //   {
    //     "firstName": "Ram",
    //     "lastName": "Farid",
    //     "address1": "12",
    //     "address2": "asas",
    //     "country": "Egypt",
    //     "city": "1018",
    //     "notes": "asdas",
    //     "shipping": "standard",
    //     "payment": "card",
    //     "paymentDetails": {
    //         "cardNumber": "123123123123",
    //         "cardName": "as",
    //         "cardCVV": "121",
    //     }
    //     items: []
    //     fees: 2132,
    //     status: "in-progress" | "completed" | "cancelled",
    //     totalPrice: ,
    //     subtotalPrice: ,
    //     discountsAmount:
    //   }
    const subtotal = cart.reduce(
      (pre, item) => item.quantity * item.product.price + pre,
      0
    )
    const total = cart.reduce(
      (total, item) => {
        const { price, discount, discountType } = item.product
        let itemTotal = price * item.quantity

        if (discountType === 'flat') {
          itemTotal = Math.max(0, itemTotal - discount * item.quantity)
        } else if (discountType === 'percent') {
          const validDiscount = Math.min(100, Math.max(0, discount))
          itemTotal = itemTotal * ((100 - validDiscount) / 100)
        }

        return total + itemTotal
      },
      shipping.value === 'delivery' ? 50 : 0
    )
    const discountsAmount = Math.max(subtotal - total, 0)

    submitOrder({
      ...data,
      items: cart,
      fees: shipping.value === 'delivery' ? 50 : 0,
      status: 'in-progress',
      totalPrice: total,
      subtotalPrice: subtotal,
      discountsAmount,
      createdAt: new Date(),
    })
    alert('Congrats! ordered your first order')
    location.assign('shopping.html')
  })

  renderCheckoutTable()

  function renderCheckoutTable() {
    const subtotal = cart.reduce(
      (pre, item) => item.quantity * item.product.price + pre,
      0
    )
    const total = cart.reduce(
      (total, item) => {
        const { price, discount, discountType } = item.product
        let itemTotal = price * item.quantity

        if (discountType === 'flat') {
          itemTotal = Math.max(0, itemTotal - discount * item.quantity)
        } else if (discountType === 'percent') {
          const validDiscount = Math.min(100, Math.max(0, discount))
          itemTotal = itemTotal * ((100 - validDiscount) / 100)
        }

        return total + itemTotal
      },
      shipping.value === 'delivery' ? 50 : 0
    )
    const tableContainer = document.getElementById('table-container')
    tableContainer.innerHTML = createCheckoutTable(
      cart.map((item) => generateRowCheckout(item)).join(''),
      subtotal,
      total,
      (shipping.value === 'delivery'
        ? generateRowCheckout('Delivery Fee', '+50 LE', true)
        : '') +
        generateRowCheckout(
          'Discount',
          `-${Math.max(subtotal - total, 0)} LE`,
          true
        )
    )
  }
})
