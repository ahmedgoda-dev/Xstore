import { products } from './inv.js'

const currUserId = localStorage.getItem('currUserId')
export let users = JSON.parse(localStorage.getItem('users'))
export let currUser = {}
export let cart = []
export let favs = []
export let orders = []

try {
  currUser = users.find((user) => user.id == currUserId)
} catch (error) {
  localStorage.removeItem('currUserId')
  currUser = {}
}

if (currUser?.id) {
  cart = currUser?.cart || []
  favs = currUser?.favs || []
  orders = currUser?.orders || []
} else {
  localStorage.removeItem('currUserId')
}

export function createAccount(data) {
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2)
  users.push({ ...data, id })
  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('currUserId', id)
}

export function login(email, password) {
  const targetEmailUser = users.find((usr) => usr.email == email)
  if (!targetEmailUser) return 'Email not found.'
  if (targetEmailUser.password !== password) return "Password isn't correct"

  localStorage.setItem('currUserId', targetEmailUser.id)

  return true
}

export function logout() {
  localStorage.removeItem('currUserId')
  location.reload()
}

export function editAccount(newData) {
  currUser = { ...currUser, ...newData }
  const updatedUsers = users.map((usr) =>
    usr.id === currUserId ? { ...currUser } : usr
  )
  users = [...updatedUsers]
  localStorage.setItem('users', JSON.stringify(updatedUsers))
}

export function updatePassword(oldPassword, newPassword) {
  if (oldPassword !== currUser.password)
    return alert("Current Password isn't correct")

  currUser = { ...currUser, password: newPassword }
  const updatedUsers = users.map((usr) =>
    usr.id === currUserId ? { ...currUser } : usr
  )
  users = [...updatedUsers]
  localStorage.setItem('users', JSON.stringify(updatedUsers))
}

export function addToCart(product) {
  const existingItem = cart.find(
    (item) =>
      item.id === product.product.id &&
      item.variantId === product.product.variantId
  )

  if (existingItem) {
    existingItem.quantity =
      (+existingItem.quantity || 1) + (+product.quantity || 1)
    cart = cart.map((item) =>
      item.id === product.product.id &&
      item.variantId === product.product.variantId
        ? existingItem
        : item
    )
  } else {
    const newProduct = { ...product, quantity: product.quantity || 1 }
    cart.push(newProduct)
  }

  currUser.cart = [...cart]
  const dbUsers = users.map((usr) => (usr.id === currUser.id ? currUser : usr))
  users = [...dbUsers]
  localStorage.setItem('users', JSON.stringify(users))
}

export function addToFav(productId) {
  const targetProduct = products.find((product) => product.id === productId)
  const favItem = favs.find((product) => product.id == productId)

  if (favItem) {
    favs = favs.filter((product) => product.id !== productId)
  } else if (targetProduct) {
    favs.push(targetProduct)
  } else return alert('Not found Product!')

  currUser.favs = favs
  users = users.map((usr) => (usr.id === currUserId ? currUser : usr))
  localStorage.setItem('users', JSON.stringify(users))

  return !!favItem
}

export function deleteAllFavs(onDelete) {
  favs = []
  currUser.favs = []
  users = users.map((usr) => (usr.id === currUserId ? currUser : usr))
  localStorage.setItem('users', JSON.stringify(users))
  if (onDelete instanceof Function) onDelete()
}

export function decCart(id, variantId) {
  const targetItem = cart.find(
    (item) => item.product.id === id && item.product.variantId === variantId
  )

  if (targetItem) {
    if (targetItem.quantity == 1) {
      cart = cart.filter(
        (item) =>
          !(item.product.id === id && item.product.variantId === variantId)
      )
    } else {
      cart = cart.map((item) =>
        item.product.id === id && item.product.variantId === variantId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    }

    currUser.cart = [...cart]
    const dbUsers = users.map((usr) =>
      usr.id === currUser.id ? currUser : usr
    )
    users = [...dbUsers]
    localStorage.setItem('users', JSON.stringify(users))
  }
}

export function incCart(id, variantId) {
  const targetItem = cart.find(
    (item) => item.product.id === id && item.product.variantId === variantId
  )

  if (targetItem) {
    if (targetItem.quantity)
      cart = cart.map((item) =>
        item.product.id === id && item.product.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )

    currUser.cart = [...cart]
    const dbUsers = users.map((usr) =>
      usr.id === currUser.id ? currUser : usr
    )
    users = [...dbUsers]
    localStorage.setItem('users', JSON.stringify(users))
  }
}

export function submitOrder(newOrder) {
  const id = Date.now().toString(36) + Math.random().toString(36).substring(2)
  orders.push({ ...newOrder, id })
  cart = []
  currUser.orders = orders
  currUser.cart = cart
  users = users.map((usr) => (usr.id === currUserId ? currUser : usr))
  localStorage.setItem('users', JSON.stringify(users))
}
