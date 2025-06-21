import { addToCart, cart, currUser } from './lib/auth.js'
import { addReview, products, starSVG } from './lib/inv.js'
import appendAlertPage from './utils/appendAlertPage.js'
import formatDate from './utils/formatDate.js'

document.addEventListener('DOMContentLoaded', function () {
  initProductData()
  initReviews()
  tabsControl()
  incCart()
  decCart()
})

const searchParams = new URLSearchParams(window.location.search)
const product = products.find((product) => product.id == searchParams.get('id'))

function initProductData() {
  if (!product || !searchParams.get('id'))
    return (document.getElementById('single-product-container').innerHTML =
      appendAlertPage(
        undefined,
        'Not Found Product',
        'You have catch a miss product or Broken link'
      ))
  const totalStock = product.variants.reduce(
    (pre, variant) => pre + variant.stock,
    0
  )
  const rate =
    product.reviews.reduce((pre, review) => review.rate + pre, 0) /
    product.reviews.length

  const stockContainer = document.getElementById('stock')
  const thumbnailContainer = document.getElementById('thumbnail-container')
  const mainTubmnail = document.getElementById('main-image-container')
  const titleCont = document.getElementById('product-title')
  const descriptionContainer = document.getElementById('description')
  const starsContainer = document.getElementById('rate-stars-container')
  const productCode = document.getElementById('code')
  const fullDescription = document.getElementById('full-desc')
  const addToCartBtn = document.getElementById('add-to-cart-btn')
  const buyNow = document.getElementById('buy-now-btn')
  const variantInput = document.getElementById('select-input')
  const priceContaienr = document.getElementById('price')
  const beforeDisContainer = document.getElementById('before-discount')

  beforeDisContainer.innerHTML = `${product.variants[0].price} LE`
  priceContaienr.innerHTML = `${
    product.variants[0].discountType === 'flat'
      ? product.variants[0].price - product.variants[0].discount
      : product.variants[0].price * ((100 - product.variants[0].discount) / 100)
  } LE`

  document.getElementById('quantity-input').value =
    cart.find((item) => item.product.id === product.id)?.quantity || 1

  buyNow.addEventListener('click', () => {
    if (!currUser?.id) return location.assign('login.html')
    const quantity = +document.getElementById('quantity-input').value
    const variantId = variantInput.value
    const targetVariant = product.variants.find(
      (variant) => variant.id === variantId
    )
    if (quantity < targetVariant.stock) {
      addToCart({
        quantity,
        product: {
          ...product,
          variantName: targetVariant.name,
          variantId,
          price: targetVariant.price,
          discount: targetVariant.discount,
          discountType: targetVariant.discountType,
        },
      })
      location.assign('checkout.html')
      addToCartBtn.classList.add('added')
      addToCartBtn.innerHTML = 'Added'
    } else {
      alert('There is no enough stock')
    }
  })

  addToCartBtn.addEventListener('click', () => {
    if (!currUser?.id) return location.assign('login.html')
    const quantity = +document.getElementById('quantity-input').value
    const variantId = variantInput.value
    const targetVariant = product.variants.find(
      (variant) => variant.id === variantId
    )
    if (quantity < targetVariant.stock) {
      addToCart({
        quantity,
        product: {
          ...product,
          variantName: targetVariant.name,
          variantId,
          price: targetVariant.price,
          discount: targetVariant.discount,
          discountType: targetVariant.discountType,
        },
      })

      addToCartBtn.classList.add('added')
      addToCartBtn.disabled = true
      addToCartBtn.innerHTML = 'Added'
    } else {
      alert('There is no enough stock')
    }
  })

  variantInput.value = product.variants[0]
  variantInput.innerHTML = product.variants.map(
    (variant) => `<option value="${variant.id}">${variant.name}</option>`
  )
  starsContainer.innerHTML = starSVG(rate == 1 && rate != 0)
  starsContainer.innerHTML += starSVG(rate <= 2 && rate != 0)
  starsContainer.innerHTML += starSVG(rate <= 3 && rate != 0)
  starsContainer.innerHTML += starSVG(rate <= 4 && rate != 0)
  starsContainer.innerHTML += starSVG(rate <= 5 && rate != 0)

  variantInput.addEventListener('change', (e) => {
    const targetVariant = product.variants.find(
      (variant) => variant.id === e.target.value
    )
    beforeDisContainer.innerHTML = `${targetVariant.price} LE`
    priceContaienr.innerHTML = `${
      targetVariant.discountType === 'flat'
        ? targetVariant.price - targetVariant.discount
        : targetVariant.price * ((100 - targetVariant.discount) / 100)
    } LE`
  })

  fullDescription.innerHTML = product.description
  productCode.innerHTML = product.id
  descriptionContainer.innerHTML = product.description
  if (totalStock < 10) stockContainer.style.color = 'var(--warning-color)'
  stockContainer.innerHTML = totalStock
  titleCont.innerHTML = product.title
  mainTubmnail.innerHTML = `<img
              class="main-image"
              src="${product.images[0]}"
              alt="${product.title}"
              width="200px"
            />`
  thumbnailContainer.innerHTML = product.images
    .map(
      (image, i) => `<div class="thumbnail">
              <img
                src="${image}"
                alt="${image}_${i}"
                width="200px"
              />
            </div>`
    )
    .join('')

  changeImage()
}

function tabsControl() {
  const tabsBtns = document.querySelectorAll('.tab')
  const contents = document.querySelectorAll('.tab-content')

  tabsBtns.forEach((tabBtn, index) => {
    tabBtn.addEventListener('click', function () {
      tabsBtns.forEach((t) => t.classList.remove('active'))
      contents.forEach((c) => c.classList.remove('active'))

      tabBtn.classList.add('active')
      contents[index].classList.add('active')
    })
  })

  if (tabsBtns.length > 0) {
    tabsBtns[0].click()
  }
}

function decCart() {
  document.querySelector('.qty-minus').addEventListener('click', function () {
    const input = document.querySelector('.qty-input')
    let value = parseInt(input.value)
    if (value > 1) {
      input.value = value - 1
    }
  })
}

function incCart() {
  document.querySelector('.qty-plus').addEventListener('click', function () {
    const input = document.querySelector('.qty-input')
    let value = parseInt(input.value)
    input.value = value + 1
  })
}

function changeImage() {
  const mainImg = document.querySelector('img.main-image')

  const imagesContainers = document.querySelectorAll(
    '.thumbnail-container .thumbnail'
  )

  for (const imageContainer of imagesContainers) {
    const image = imageContainer.querySelector('img')
    image.addEventListener('click', function () {
      imagesContainers.forEach((container) =>
        container.classList.remove('active')
      )
      const src = image.getAttribute('src')
      mainImg.setAttribute('src', src)
      imageContainer.classList.add('active')
    })
  }
}

function initReviews() {
  const submitReviewBtn = document.getElementById('submit-review-btn')
  const reviewInput = document.getElementById('your-review')
  const reviewsContainer = document.getElementById('reviews-box')

  if (product.reviews.find((review) => review.userId === currUser.id)) {
    document.querySelector('.write-areview').style.display = 'none'
  }
  reviewsContainer.innerHTML = product.reviews
    .map(
      (review) => `<div class="review">
                  <div class="customer-name">${review.fullName}</div>
                  <div class="review-date">${formatDate(review.createdAt)}</div>
                  <div class="review-text">
                    ${review.comment}
                  </div>
                </div>`
    )
    .join('')

  submitReviewBtn.addEventListener('click', () => {
    if (!reviewInput.value.trim())
      return alert('Please provide me with a comment')
    const selectedRating = document.querySelector(
      'input[name="rating"]:checked'
    )
    if (!selectedRating) return alert('Please Rate the product')
    addReview(product.id, reviewInput.value, selectedRating?.value)
    initReviews()
  })
}
