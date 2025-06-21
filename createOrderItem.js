function createOrderItem(order) {
  console.log(order)
  return `<div class="order_box">
        <div class="first_line">
          <div class="first_left">
            <p class="order_id">
              Order: <span class="id">${order.id}</span>
            </p>
          </div>
          <div class="first_right">
            <p class="date">${order.createdAt}</p>
          </div>
        </div>
        <div class="second_line">
          <div class="second_left">
            <p class="total-items">
              Total items: <span class="items_num">${order?.items?.reduce(
                (pre, item) => pre + item.quantity,
                0
              )}</span>
            </p>
          </div>
          <div class="second_right">
            <p class="price">
              Total Price:<span class="price-number">${order.totalPrice}</span>
            </p>
          </div>
        </div>
        <div class="third_line">
          <div class="btn">
            <a class="button" href="order-details.html?id=${
              order.id
            }">Details</a>
          </div>
          <div class="state">
            <p>${order.status}</p>
          </div>
        </div>
      </div>`
}

export default createOrderItem
