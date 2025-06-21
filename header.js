import { cart, currUser, favs, logout } from './lib/auth.js'

const links = [
  ...document.querySelectorAll(
    'nav.nav-links > a, nav.nav-links .nav-item > a'
  ),
]

const moon = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

const sun = `
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 3V0H9V3H7Z" fill="#fff"></path> <path d="M9 13V16H7V13H9Z" fill="#fff"></path> <path d="M11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z" fill="#fff"></path> <path d="M0 9H3V7H0V9Z" fill="#fff"></path> <path d="M16 7H13V9H16V7Z" fill="#fff"></path> <path d="M3.75735 5.17157L1.63603 3.05025L3.05025 1.63603L5.17157 3.75735L3.75735 5.17157Z" fill="#fff"></path> <path d="M12.2426 10.8284L14.364 12.9497L12.9497 14.364L10.8284 12.2426L12.2426 10.8284Z" fill="#fff"></path> <path d="M3.05025 14.364L5.17157 12.2426L3.75735 10.8284L1.63603 12.9498L3.05025 14.364Z" fill="#fff"></path> <path d="M12.9497 1.63604L10.8284 3.75736L12.2426 5.17158L14.364 3.05026L12.9497 1.63604Z" fill="#fff"></path> </g></svg>
  `

const toggleButton = document.getElementById('theme-toggle')
const icon = document.getElementById('theme-icon')

const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.dataset.theme = 'dark'
  icon.innerHTML = sun
} else {
  document.documentElement.dataset.theme = 'light'
  icon.innerHTML = moon
}

toggleButton.addEventListener('click', () => {
  console.log('SS')
  const isDark = document.documentElement.dataset.theme === 'dark'
  const newTheme = isDark ? 'light' : 'dark'

  document.documentElement.dataset.theme = newTheme
  localStorage.setItem('theme', newTheme)
  icon.innerHTML = newTheme === 'dark' ? sun : moon
})

for (const link of links) {
  link.classList.remove('active')
  const pathname = window.location.pathname
  const href = link.getAttribute('href')

  if ('/' + href == pathname) link.classList.add('active')

  if (pathname === '/' && href === 'index.html') link.classList.add('active')
}

const cartIconContainer = document.getElementById('cart-icon')
const badge = cartIconContainer.querySelector('.badge')
const tooltip = cartIconContainer.querySelector('.tooltip')

const favIconContainer = document.getElementById('fav-icon')
const favTextNo = favIconContainer.querySelector('.fav-text-no')

const profileIconContainer = document.getElementById('profile-icon')
const profileMenu = document.querySelector('#profile-icon + .home-submenu')

if (!currUser?.id) {
  profileIconContainer.setAttribute('href', 'login.html')
  cartIconContainer.setAttribute('href', 'login.html')
  favIconContainer.setAttribute('href', 'login.html')
} else {
  profileMenu.innerHTML = `<a href="profile.html#account-info">Profile</a>
  <a href="#" id="logout-btn">Logout</a>
  `

  document.getElementById('logout-btn').addEventListener('click', () => {
    logout()
  })

  badge.innerHTML = cart.length
  favTextNo.innerHTML = favs.length
}
