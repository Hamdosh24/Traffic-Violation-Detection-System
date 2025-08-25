export const generateCouponCode = (title = "", expiryDate = "") => {
  // Formate the title to uppercase and remove spaces
  const formattedTitle = title.toUpperCase().replace(/\s+/g, "");

  // Formate the expiry date to "DDMMYYYY"
  const formattedExpiryDate = expiryDate.split("-").reverse().join("");
  const couponCode = `${formattedTitle}-${formattedExpiryDate}`;
  return couponCode;
};
