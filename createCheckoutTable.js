function createCheckoutTable(rows, subTotal, total, anotherTransactions) {
  return `<table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr>
              <td class="text-right totals">Sub-Total</td>
              <td>${subTotal} LE</td>
            </tr>
            ${anotherTransactions}
            <tr>
              <td class="text-right totals">Total</td>
              <td>${total} LE</td>
            </tr>
          </tfoot>
        </table>`
}

export default createCheckoutTable
