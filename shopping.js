import { products } from './lib/inv.js'
import createProductCard, {
  initCardListeners,
} from './utils/createProductCard.js'

const limit = 10
let currentPage = 1,
  pages = Math.ceil(products.length / limit),
  filters = [],
  priceRange = [],
  priceGap = 200

const initCat = new URLSearchParams(window.location.search).get('category')
if (initCat) filters.push(initCat)

document.addEventListener('DOMContentLoaded', function () {
  const rangeInput = document.querySelectorAll('.range-input input')
  const priceInput = document.querySelectorAll('.price-input input')
  const progress = document.querySelector('.slider .progress')
  const applyBtn = document.querySelector('.apply-btn')

  // Init Search
  initSearch()
  // Init products
  appendOptimizedProducts()
  // Init filters
  initFilters()
  // Init the price range
  updateSlider()

  rangeInput.forEach((input) => {
    input.addEventListener('input', updateSlider)
  })

  priceInput.forEach((input) => {
    input.addEventListener('input', (e) => {
      let minVal = parseInt(priceInput[0].value)
      let maxVal = parseInt(priceInput[1].value)

      if (maxVal - minVal >= priceGap && maxVal <= 1000) {
        if (e.target.className === 'min-input') {
          rangeInput[0].value = minVal
          updateSlider()
        } else {
          rangeInput[1].value = maxVal
          updateSlider()
        }
      }
    })
  })

  applyBtn.addEventListener('click', () => {
    priceRange = [parseInt(priceInput[0].value), parseInt(priceInput[1].value)]
    const newFilters = [
      ...document.querySelectorAll('.filters-section .filter-item'),
    ]
      .filter((filter) => filter.classList.contains('active'))
      .map((filter) => filter.dataset.type)
    if (!filters.length && newFilters.length) currentPage = 1
    filters = newFilters

    appendOptimizedProducts()
  })

  function updateSlider() {
    let minVal = parseInt(rangeInput[0].value)
    let maxVal = parseInt(rangeInput[1].value)

    if (maxVal - minVal < priceGap) {
      if (event && event.target.className === 'min-range') {
        rangeInput[0].value = maxVal - priceGap
      } else {
        rangeInput[1].value = minVal + priceGap
      }
    } else {
      priceInput[0].value = minVal
      priceInput[1].value = maxVal

      let progressLeft = (minVal / rangeInput[0].max) * 100
      let progressRight = 100 - (maxVal / rangeInput[1].max) * 100

      progress.style.left = progressLeft + '%'
      progress.style.right = progressRight + '%'
    }
  }

  function initFilters() {
    const filterBtns = [
      ...document.querySelectorAll('.filters-section .filter-item'),
    ]

    for (const filter of filterBtns) {
      if (filters.includes(filter.dataset.type)) {
        filter.classList.add('active')
        filter.querySelector(
          '.checkbox'
        ).innerHTML = `<img src="./static/imgs/ok-svgrepo-com.svg" alt="Ok" />`
      }
      filter.addEventListener('click', () => {
        const checkbox = filter.querySelector('.checkbox')
        filter.classList.toggle('active')
        if (filter.classList.contains('active')) {
          checkbox.innerHTML = `<img src="./static/imgs/ok-svgrepo-com.svg" alt="Ok" />`
        } else checkbox.innerHTML = ''
      })
    }
  }

  function appendOptimizedProducts(searchText = '') {
    const productsContainer = document.getElementById('products-container')

    let filtered = JSON.parse(JSON.stringify(products))

    if (filters.length) {
      filtered = filtered.filter((product) =>
        filters.includes(product.category)
      )
    }

    if (priceRange.length === 2) {
      filtered = filtered.filter((product) =>
        product.variants.some(
          (variant) =>
            variant.price > priceRange[0] && variant.price < priceRange[1]
        )
      )
    }

    if (searchText) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    pages = Math.ceil(filtered.length / limit)

    const paginated = filtered.slice(
      (currentPage - 1) * limit,
      currentPage * limit
    )

    productsContainer.innerHTML = paginated
      .map((product) => createProductCard(product))
      .join('')
    initCardListeners('products-container')

    console.log(paginated)
    initPagination(pages)
  }

  function initPagination(totalPages) {
    const paginationContainer = document.querySelector('.pagination')
    paginationContainer.innerHTML = ''

    const createButton = (
      label,
      className = '',
      disabled = false,
      page = null
    ) => {
      const btn = document.createElement('button')
      btn.className = `pagination-btn ${className}`.trim()
      btn.textContent = label
      btn.disabled = disabled

      if (page !== null) {
        btn.addEventListener('click', () => {
          currentPage = page
          appendOptimizedProducts()
          scrollToTop()
        })
      }

      return btn
    }

    paginationContainer.appendChild(
      createButton('«', 'prev-btn', currentPage === 1, currentPage - 1)
    )

    paginationContainer.appendChild(
      createButton(
        '1',
        currentPage === 1 ? 'page-btn active' : 'page-btn',
        false,
        1
      )
    )

    if (currentPage > 4) {
      paginationContainer.appendChild(createButton('...', 'ellipsis', true))
    }

    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i++
    ) {
      paginationContainer.appendChild(
        createButton(
          i,
          currentPage === i ? 'page-btn active' : 'page-btn',
          false,
          i
        )
      )
    }

    if (currentPage < totalPages - 3) {
      paginationContainer.appendChild(createButton('...', 'ellipsis', true))
    }

    if (totalPages > 1) {
      paginationContainer.appendChild(
        createButton(
          totalPages,
          currentPage === totalPages ? 'page-btn active' : 'page-btn',
          false,
          totalPages
        )
      )
    }

    paginationContainer.appendChild(
      createButton('»', 'next-btn', currentPage === totalPages, currentPage + 1)
    )
  }

  function scrollToTop() {
    const productsWrapper = document.querySelector('.products-wrapper')
    productsWrapper.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    })
  }

  function initSearch() {
    const searchInput = document.getElementById('search')
    const searchBtn = document.getElementById('search-btn')

    searchBtn.addEventListener('click', () => {
      const value = searchInput.value
      appendOptimizedProducts(value)
    })
  }
})
