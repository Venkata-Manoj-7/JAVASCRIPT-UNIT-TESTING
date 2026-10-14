export function calculateTotal(items = [], discountPercent = 0) {
  // Edge Case 1: Invalid array input
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }

  // Edge Case 2: Out of bounds discount percentage (0% to 100%)
  if (discountPercent < 0 || discountPercent > 100) {
    throw new RangeError('Discount percent must be between 0 and 100');
  }

  // Edge Case 3: Empty items array
  if (items.length === 0) {
    return 0;
  }

  // Boundary Case: Calculate total with price & quantity checks
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item?.price) || 0;
    const quantity = Number(item?.quantity) || 0;

    // Reject negative prices or quantities
    if (price < 0 || quantity < 0) 
      throw new Error('Price and quantity must be non-negative');
    

    return sum + price * quantity;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  return Number((subtotal - discountAmount).toFixed(2));
}