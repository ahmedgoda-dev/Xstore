import { cart, currUser, decCart, incCart } from './lib/auth.js'
import appendAlertPage from './utils/appendAlertPage.js'
import createCartTable from './utils/createCartTable.js'
import generateRowCart from './utils/generateRowCart.js'

function renderTable() {
  const tableContainer = document.getElementById('table-cart')
  tableContainer.innerHTML = createCartTable(
    cart.map((item) => generateRowCart(item)).join(''),
    cart.reduce((pre, item) => item.quantity * item.product.price + pre, 0),
    cart.reduce((total, item) => {
      const { price, discount, discountType } = item.product
      let itemTotal = price * item.quantity

      if (discountType === 'flat') {
        itemTotal = Math.max(0, itemTotal - discount * item.quantity)
      } else if (discountType === 'percent') {
        const validDiscount = Math.min(100, Math.max(0, discount))
        itemTotal = itemTotal * ((100 - validDiscount) / 100)
      }

      return total + itemTotal
    }, 0)
  )
  const incBtns = document.querySelectorAll('.btn-inc')
  incBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      console.log('object')
      incCart(btn.dataset.productId, btn.dataset.variantId)
      renderTable()
    })
  })

  const decBtns = document.querySelectorAll('.btn-dec')
  decBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      console.log('object')
      decCart(btn.dataset.productId, btn.dataset.variantId)
      renderTable()
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  if (!currUser?.id) {
    const dataWrapper = document.getElementById('data-wrapper')
    dataWrapper.innerHTML = appendAlertPage(
      undefined,
      'Login First',
      'You need to login before you can proceed. Click the login button below to continue.'
    )
    return
  }

  renderTable()
})
