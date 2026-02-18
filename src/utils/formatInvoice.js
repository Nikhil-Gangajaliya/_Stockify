export const formatInvoiceResponse = (invoice) => {
  return {
    invoiceNumber: invoice.invoiceNumber,

    storeId: invoice.storeId?.storeId,
    storeName: invoice.storeId?.storeName,

    custName: invoice.custName,
    custContact: invoice.custContact,

    totalAmount: invoice.totalAmount,
    createdAt: invoice.createdAt,

    items: invoice.items.map(item => ({
      productId: item.productId?.productId,
      productName: item.productId?.productName,
      qty: item.qty,
      unitPrice: item.unitPrice,
      total: item.total
    }))
  };
};
