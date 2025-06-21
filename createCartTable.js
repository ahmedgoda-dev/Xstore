function createCartTable(rows = '', subtotal, total) {
  return `<table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Unit price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${
          !rows.length
            ? `<tr>
          <td colspan='5' style="text-align:center;">No Data in The Cart</td>
        </tr>`
            : rows
        }
      </tbody>
      <tfoot>
        <tr>
          <td colspan='4' class='text-right totals'>
            Sub-Total
          </td>
          <td>${subtotal} LE</td>
        </tr>
        <tr>
          <td colspan='4' class='text-right totals'>
            Total
          </td>
          <td>${total} LE</td>
        </tr>
      </tfoot>
    </table>`
}

export default createCartTable
