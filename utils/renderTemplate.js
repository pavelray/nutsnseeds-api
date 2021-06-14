const renderItems = (temp, item) => {
  let output = temp.replace(/{%ITEM_NAME%}/g, item.name);
  output = output.replace(/{%ITEM_QUANTITY%}/g, item.quantity);
  output = output.replace(/{%ITEM_COST%}/g, item.price);
  return output;
};

const renderInvoice = (temp, templateItems, invoiceData) => {
  const itemsHtml = invoiceData.items.map(el => renderItems(templateItems, el)).join('');
  let output = temp.replace(/{%ITEMS%}/g, itemsHtml);
  output = output.replace(/{%INVOICE_NUMBER%}/g, invoiceData.invoiceNumber);
  output = output.replace(/{%INVOICE_DATE%}/g, invoiceData.invoiceDate);
  output = output.replace(/{%ORDER_NUMBER%}/g, invoiceData.orderId);
  output = output.replace(/{%CUSTOMER_NAME%}/g, invoiceData.billingDetails.customerName);
  output = output.replace(/{%ADDRESS_LINE_1%}/g, invoiceData.billingDetails.addressLine1);
  output = output.replace(/{%ADDRESS_LINE_2%}/g, invoiceData.billingDetails.addressLine2);
  output = output.replace(/{%PHONE_NUMBER%}/g, invoiceData.billingDetails.phoneNumber);
  output = output.replace(/{%CITY%}/g, invoiceData.billingDetails.city);
  output = output.replace(/{%STATE%}/g, invoiceData.billingDetails.state);
  output = output.replace(/{%PIN_CODE%}/g, invoiceData.billingDetails.pincode);
  output = output.replace(/{%SUBTOTAL%}/g, invoiceData.orderSummary.subtotal);
  output = output.replace(/{%SHIPPING%}/g, invoiceData.orderSummary.deliveryCharge);
  output = output.replace(/{%TOTAL%}/g, invoiceData.orderSummary.total);
  return output;
};

module.exports = {
  renderItems,
  renderInvoice
};
