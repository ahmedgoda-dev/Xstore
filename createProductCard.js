import { addToFav, currUser, favs } from '../lib/auth.js'
import { starSVG } from '../lib/inv.js'
const wishlistIcon = `<svg fill="#ea1a1a" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ea1a1a"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.5,4.609A5.811,5.811,0,0,0,16,2.5a5.75,5.75,0,0,0-4,1.455A5.75,5.75,0,0,0,8,2.5,5.811,5.811,0,0,0,3.5,4.609c-.953,1.156-1.95,3.249-1.289,6.66,1.055,5.447,8.966,9.917,9.3,10.1a1,1,0,0,0,.974,0c.336-.187,8.247-4.657,9.3-10.1C22.45,7.858,21.453,5.765,20.5,4.609Zm-.674,6.28C19.08,14.74,13.658,18.322,12,19.34c-2.336-1.41-7.142-4.95-7.821-8.451-.513-2.646.189-4.183.869-5.007A3.819,3.819,0,0,1,8,4.5a3.493,3.493,0,0,1,3.115,1.469,1.005,1.005,0,0,0,1.76.011A3.489,3.489,0,0,1,16,4.5a3.819,3.819,0,0,1,2.959,1.382C19.637,6.706,20.339,8.243,19.826,10.889Z"></path></g></svg>`
const addedToFavSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="var(--error-color)" viewBox="0 0 24 24">
  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 
  8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 
  2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 
  5.42 22 8.5c0 3.78-3.4 6.86-8.55 
  11.54L12 21.35z"/>
</svg>`

export function initCardListeners(parentId, options = {}) {
  const { onFav } = options
  const container = document.getElementById(parentId)
  if (container) {
    const addCartBtns = [
      ...container.querySelectorAll('.product__card .add-to-cart-btn'),
    ]
    const addWishListBtns = [
      ...container.querySelectorAll('.product__card .add-to-wishlist-btn'),
    ]

    for (const cartBtn of addCartBtns) {
      cartBtn.addEventListener('click', () => {
        location.assign(`single-product.html?id=${cartBtn.dataset.productId}`)
      })
    }

    for (const wishlistBtn of addWishListBtns) {
      const productId = wishlistBtn.dataset.productId

      const targetFavItem = favs.find((product) => product.id === productId)
      if (targetFavItem) {
        wishlistBtn.innerHTML = addedToFavSVG
      }
      wishlistBtn.addEventListener('click', () => {
        if (!currUser?.id) {
          alert('Please Login first!')
          location.assign('login.html')
          return
        }
        const isExistBefore = addToFav(wishlistBtn.dataset.productId)
        wishlistBtn.innerHTML = isExistBefore ? wishlistIcon : addedToFavSVG
        if (onFav instanceof Function) onFav()
      })
    }
  }
}

export default function createProductCard(product, outMade = false) {
  const {
    id,
    title,
    description,
    category,
    images,
    rate: outRate,
    price: outPrice,
    discount: outDiscount,
    isFav,
    isCart,
  } = product

  const bestVariant = outMade
    ? []
    : product.variants.reduce(
        (best, variant) => {
          const discountPercent =
            variant.discountType === 'percent'
              ? variant.discount
              : (variant.discount / variant.price) * 100
          return discountPercent > best.discountPercent
            ? { ...variant, discountPercent }
            : best
        },
        { discountPercent: 0 }
      )

  const price = outMade
    ? outPrice
    : bestVariant.price -
      (bestVariant.discountType === 'percent'
        ? bestVariant.price * (bestVariant.discount / 100)
        : bestVariant.discount)
  const discount = outMade ? outDiscount : bestVariant.discountPercent
  const rate = outMade
    ? outRate
    : product.reviews.reduce((pre, curr) => pre + curr.rate, 0) /
      product.reviews.length
  const priceAfterDisc = (price * (1 - discount / 100) || 0).toFixed(2)
  const titleFallback = title.replaceAll(' ', '\\n')
  const fallback = `https://placehold.co/800?text=${titleFallback}`

  return `<div class="product__card">
              <div class="img-container">
                <div class="overlay"></div>
                <img src="${images[0]}" 
                onerror="this.onerror=null; this.src='${fallback}';" 
                alt="${title}" />
              </div>
              <a class="img-description" href="single-product.html?id=${id}">${title}</a>
              <div class="ratingStar">
                ${starSVG(rate == 1 && rate != 0)}
                ${starSVG(rate <= 2 && rate != 0)}
                ${starSVG(rate <= 3 && rate != 0)}
                ${starSVG(rate <= 4 && rate != 0)}
                ${starSVG(rate <= 5 && rate != 0)}
              </div>
              <p class="prices">${!discount ? price : priceAfterDisc} LE</p>
              ${discount ? `<p class="price-discount">${price} LE</p>` : ''}
              <div class="buttons">
                <button data-product-id="${
                  product.id
                }" class="add-to-cart-btn" title="Add to marketplace">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 
                    0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.16 14l-.94-2h11.45c.75 
                    0 1.41-.41 1.75-1.03l3.58-6.49-1.73-.99L17.06 10H6.42l-.94-2H1v2h3.58l3.6 
                    7.59-1.35 2.45C6.16 20.37 7.01 22 8.42 22h11.17v-2H8.42l1.1-2h7.45c.75 
                    0 1.41-.41 1.75-1.03l3.58-6.49-1.73-.99L17.06 14H7.16z"/>
                  </svg>
                </button>
                <button data-product-id="${
                  product.id
                }" class="add-to-wishlist-btn" title="Add to wish list">
                  ${wishlistIcon}
                </button>
              </div>
            </div>`
}
