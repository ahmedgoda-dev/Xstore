function generateRowCart(obj) {
  const { quantity, product } = obj
  console.log(obj)
  return `<tr>
          <td>
            <div class='product-info'>
              <img
                src='${product.images[0]}'
                onerror="this.onerror=null; this.src='https://placehold.co/800?text=${product.title.replaceAll(
                  ' ',
                  '\\n'
                )}';"
                alt='${product.title}'
              />
            </div>
          </td>
          <td>
            ${product.title}<br/>
            -${product.variantName}
          </td>
          <td>
            <div class='quantity-controls'>
              <input disabled="true" type='number' min='1' value='${quantity}' />
              <button  class='btn btn-inc' data-variant-id="${
                product.variantId
              }" data-product-id="${product.id}">+</button>
              <button  class='btn btn-dec' data-variant-id="${
                product.variantId
              }" data-product-id="${product.id}">-</button>
            </div>
          </td>
          <td>${product.price} LE</td>
          <td>${product.price * quantity} LE</td>
        </tr>`
}

export default generateRowCart
