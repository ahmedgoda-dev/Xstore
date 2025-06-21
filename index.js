import { products } from './lib/inv.js'
import createProductCard, {
  initCardListeners,
} from './utils/createProductCard.js'

function initNewArrivales() {
  const newArrivalescontainer = document.getElementById('new-arrivales')
  const recentProducts = products
    .filter((pr) => {
      const createdAt = new Date(pr.createdAt)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return createdAt >= thirtyDaysAgo
    })
    .map((pr) => ({
      ...pr,
      rate:
        pr.reviews.reduce((pre, curr) => pre + curr.rate, 0) /
        pr.reviews.length,
      price: Math.min(...pr.variants.map((v) => v.price)),
    }))
  newArrivalescontainer.innerHTML = recentProducts
    .map((pr) => createProductCard(pr))
    .join('')
  initCardListeners('new-arrivales')
}

function initBestDeals() {
  const bestDeals = products
    .map((product) => {
      const bestVariant = product.variants.reduce(
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

      return {
        id: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
        images: product.images,
        rate:
          product.reviews.reduce((pre, curr) => pre + curr.rate, 0) /
          product.reviews.length,
        price:
          bestVariant.price -
          (bestVariant.discountType === 'percent'
            ? bestVariant.price * (bestVariant.discount / 100)
            : bestVariant.discount),
        discount: bestVariant.discountPercent,
      }
    })
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 15)
  const bestDealsContainer = document.getElementById('best-deals')

  bestDealsContainer.innerHTML = bestDeals
    .map((product) => createProductCard(product, true))
    .join('')
  initCardListeners('best-deals')
}

const slider = document.querySelector('.card-slider')
const leftBtn = document.querySelector('.slider-btn.left')
const rightBtn = document.querySelector('.slider-btn.right')
const scrollAmount = 270
const originalCards = [...slider.children]
originalCards.forEach((card) => {
  const clone = card.cloneNode(true)
  clone.classList.add('cloned')
  slider.appendChild(clone)
})

rightBtn.addEventListener('click', () => {
  if (slider.scrollLeft >= slider.scrollWidth / 2) {
    slider.scrollLeft = 0
  }
  slider.scrollLeft += scrollAmount
})

leftBtn.addEventListener('click', () => {
  if (slider.scrollLeft <= 0) {
    slider.scrollLeft = slider.scrollWidth / 2
  }
  slider.scrollLeft -= scrollAmount
})

slider.addEventListener('scroll', () => {
  if (slider.scrollLeft >= slider.scrollWidth / 2) {
    slider.scrollLeft = 0
  } else if (slider.scrollLeft <= 0) {
    slider.scrollLeft = slider.scrollWidth / 2
  }
})

function initSlider(selector) {
  const slider = document.querySelector(selector)
  const track = slider.querySelector('.slider-track')
  const slides = slider.querySelectorAll('.slide')
  const prevBtn = slider.querySelector('.slider-prev')
  const nextBtn = slider.querySelector('.slider-next')
  let currentIndex = 0
  const totalSlides = slides.length

  function updateSlider() {
    const offset = -currentIndex * 100
    track.style.transform = `translateX(${offset}%)`
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides
    updateSlider()
  })

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides
    updateSlider()
  })

  updateSlider()
}

document.addEventListener('DOMContentLoaded', function () {
  initBestDeals()
  initNewArrivales()
  initSlider('.banner-slider')

  setInterval(updateCountdown, 1000)
  updateCountdown()
})

const targetDate = new Date('2025-06-03')

function updateCountdown() {
  const now = new Date()
  const diff = targetDate - now

  if (diff <= 0) return

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  document.getElementById('days').textContent = String(days).padStart(3, '0')
  document.getElementById('hours').textContent = String(hours).padStart(2, '0')
  document.getElementById('minutes').textContent = String(minutes).padStart(
    2,
    '0'
  )
  document.getElementById('seconds').textContent = String(seconds).padStart(
    2,
    '0'
  )
}

// const users = [
//   {
//     id: '',
//     name: '',
//     email: '',
//     password: '',
//     code: "",
//   },
// ]
