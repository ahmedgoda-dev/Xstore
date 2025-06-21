import { orders } from './lib/auth.js'
import appendAlertPage from './utils/appendAlertPage.js'
import formatDate from './utils/formatDate.js'

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search)
  const targetOrder = orders.find((order) => order.id === params.get('id'))
  const dataWrapper = document.getElementById('warpper')

  if (!targetOrder)
    dataWrapper.innerHTML = appendAlertPage(
      undefined,
      'Not Found Order',
      'Double-Check the order you hit bec. not found order with id: ' +
        params.get('id')
    )

  const orderKey = document.querySelector('.order_key')
  const date = document.querySelector('.Date')
  const statusText = document.querySelector('.status-text')
  const numberItems = document.querySelector('.number-items')
  const itemsWrapper = document.querySelector('.items-wrapper')
  const addressWrapper = document.querySelector('.Address_info')
  const paymentWrapper = document.querySelector('.Payment_info')
  const discountWrapper = document.querySelector('.Discount_info')
  const orderAmountWrapper = document.querySelector('.Order_Amount_info')
  const totalPriceWrapper = document.querySelector('.Total_Amount_Price_info')
  orderKey.innerHTML = targetOrder.id
  date.innerHTML = formatDate(targetOrder.createdAt)
  statusText.innerHTML = targetOrder.status
  numberItems.innerHTML = targetOrder?.items?.length

  addressWrapper.innerHTML = targetOrder.address1
  addressWrapper.innerHTML += ' ' + targetOrder.address2
  paymentWrapper.innerHTML =
    targetOrder.payment === 'cash'
      ? 'Cash'
      : '**** **** ***** ' + targetOrder?.paymentDetails?.cardNumber?.slice(-4)
  orderAmountWrapper.innerHTML = `${targetOrder.subtotalPrice} LE`
  totalPriceWrapper.innerHTML = `${targetOrder.totalPrice} LE`
  discountWrapper.innerHTML = `${targetOrder.discountsAmount} LE`

  if (targetOrder?.items)
    for (const item of targetOrder?.items) {
      itemsWrapper.innerHTML += `<a href="single-product.html?id=${item.product.id}"  class="order_box">
            <div class="order_image">
              <img src="${item.product.images[0]}" alt="${item.product.title}" class="product_image" />
            </div>
            <div class="order_text">
              <h3>${item.product.title}</h3>
              <p class="category">Category: ${item.product.category}</p>
              <p class="price">${item.product.price} LE</p>
              <p class="quantatiy">Quantatiy: ${item.quantity}</p>
            </div>
          </a>`
    }
})
