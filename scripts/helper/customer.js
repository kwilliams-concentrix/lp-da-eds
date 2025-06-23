export function getCustomerType(debug = false) {
  const storageObject = JSON.parse(
    localStorage.getItem('mage-cache-storage'),
  );

  if (debug) {
    console.log('customerType', storageObject?.customer?.customer_type);
  }
  return storageObject?.customer?.customer_type;
}
