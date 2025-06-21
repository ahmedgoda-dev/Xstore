function generateRowCheckout(item, data, transaction) {
  return `<tr>
          <td class="${transaction ? 'text-right totals' : ''}">
            ${
              transaction
                ? item
                : `<strong>${item.product.title}</strong><br />
            -${item.product.variantName}`
            }
          </td>
          <td>${transaction ? data : item.product.price * item.quantity}</td>
         </tr>`
}

export default generateRowCheckout
