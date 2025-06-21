import { products } from '../../data/products.js'

// Init Database
;(() => {
  try {
    const productsAsString = localStorage.getItem('products')
    const productsParsed = JSON.parse(productsAsString)

    if (productsParsed.length <= 0)
      localStorage.setItem('products', JSON.stringify(products))
  } catch (error) {
    console.log(error)
    localStorage.setItem('products', JSON.stringify(products))
  }

  try {
    const usersString = localStorage.getItem('users')
    const usersParsed = JSON.parse(usersString)

    if (usersParsed.length <= 0)
      localStorage.setItem('users', JSON.stringify([]))
  } catch (error) {
    console.log(error)
    localStorage.setItem('users', JSON.stringify([]))
  }
})()

// Init Header & Footer and Append Scripts
;(async function () {
  await loadComponent(
    'header',
    `<header class="header">
  <div class="header-left">
    <a href="/" title="Your Store" class="logo">
      <img src="./static/imgs/logo.png" alt="X Store Logo" class="logo-img" />
    </a>
  </div>

  <div class="header-center">
    <nav class="nav-links">
      <a href="index.html" class="active"> Home </a>
      <div class="nav-item home-dropdown">
        <a href="shopping.html">Shopping <span class="arrow">▼</span> </a>
        <div class="home-submenu">
          <a href="shopping.html?category=techs">Electronics</a>
          <a href="shopping.html?category=clothes">Clothes</a>
          <a href="shopping.html?category=shoes">Shoes</a>
          <a href="shopping.html?category=accs">Accessories</a>
          <a href="shopping.html?category=furn">Furniture</a>
        </div>
      </div>
      <a href="about.html">About</a>
      <a href="services.html">Services</a>
      <a href="FAQ.html">FAQ</a>
    </nav>
  </div>

  <div class="header-right">
    <div class="icon user-icon home-dropdown">
      <a href="profile.html#account-info" id="profile-icon">
        <img
          src="./static/imgs/user.png"
          alt="User"
          class="icon-img"
          title="My Account"
        />
      </a>
      <div class="home-submenu">
        <a href="login.html">Login</a>
        <a href="signup.html">Register</a>
      </div>
    </div>
    <a href="profile.html#favourites" class="icon" id="fav-icon">
      <img src="./static/imgs/fav.png" alt="Fav icon" class="icon-img" />
      <span class="fav-text"
        >Favourites (<span class="fav-text-no">0</span>)</span
      >
    </a>
    <a href="cart.html" class="icon" id="cart-icon">
      <img src="./static/imgs/cart.png" alt="Cart" class="icon-img" />
      <span class="badge">0</span>
      <span class="tooltip"> Your shopping cart is empty! </span>
    </a>
    <div class="icon header__menu home-dropdown">
      <img src="./static/imgs/burger-menu.png" alt="Menu" class="icon-img" />
      <div class="home-submenu menu-list">
        <a href="index.html" class="active"> Home </a>

        <div class="home-dropdown">
          <a href="shopping.html">Shopping <span class="arrow">▶</span></a>
          <div class="home-submenu">
            <a href="shopping.html?category=techs">Electronics</a>
            <a href="shopping.html?category=clothes">Clothes</a>
            <a href="shopping.html?category=shoes">Shoes</a>
            <a href="shopping.html?category=accs">Accessories</a>
            <a href="shopping.html?category=furn">Furniture</a>
          </div>
        </div>

        <a href="about.html">About</a>
        <a href="services.html">Services</a>
        <a href="FAQ.html">FAQ</a>
      </div>
    </div>

    <div id="theme-toggle" class="icon">
      <button aria-label="Toggle theme" class="theme-toggle">
        <span id="theme-icon"
          ><svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </span>
      </button>
    </div>
  </div>
</header>`
  )
  await loadComponent(
    'footer',
    `<footer class="footer">
  <div class="footer-container">
    <div class="footer-contact">
      <img src="./static/imgs/icon-support.png" />
      <h3>Got questions? Call us 24/7!</h3>
      <p class="phone"><b> 28162061 , 28162062 </b></p>
      <p>Helwan Sharkeya, Helwan, Cairo Governorate</p>

      <p>support@example.com</p>
    </div>
    <div class="footer-links">
      <div class="column-1">
        <ul>
          <li><a href="shopping.html">Shopping</a></li>
          <li><a href="shopping.html?category=techs">Electronics</a></li>
          <li><a href="shopping.html?category=furn">Furniture</a></li>
          <li><a href="shopping.html?category=clothes">Clothes</a></li>
          <li><a href="shopping.html?category=shoes">Shoes</a></li>
          <li><a href="shopping.html?category=accs">Accessories</a></li>
        </ul>
      </div>
      <div class="column-2">
        <ul>
          <li><a href="about.html">About Us</a></li>
          <li><a href="">Contact Us</a></li>
          <li><a href="privacy-policy.html">Privacy Policy</a></li>
          <li><a href="terms-and-conditions.html">Terms & Conditions</a></li>
        </ul>
      </div>
      <div class="column-3">
        <ul>
          <li><a href="shopping.html">Contact Us</a></li>
          <li><a href="profile.html#favourites">Wishlist</a></li>
          <li><a href="cart.html">Shopping Cart</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="FAQ.html">FAQs</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>So Xtore © 2025. All Rights Reserved. Designed by XStore</p>
  </div>
</footer>`
  )

  loadScript('./static/js/header.js', true)
})()

async function loadComponent(id, file) {
  try {
    const element = document.getElementById(id)
    element.innerHTML = file
  } catch (error) {
    console.error(`Error while getting Component of ${id} in path "${file}"`)
  }
}

function loadScript(src, module = false) {
  const script = document.createElement('script')
  script.defer = true
  if (module) script.type = 'module'
  script.src = src
  document.head.appendChild(script)
}
