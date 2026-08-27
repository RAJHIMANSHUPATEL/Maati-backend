// This is an in-memory store for order numbers.
// WARNING: This is not suitable for production environments.
// In a production environment with multiple server instances, this will lead to inconsistent order numbers.
// Consider using a distributed cache like Redis or a database to store order numbers.
const storeOrderNumbers = { storeId: null };
let currentDate = null;

// Reset the order numbers if the date has changed
const resetOrderNumbersIfNeeded = (gmtTime) => {
  if (!currentDate) {
    currentDate = new Date(gmtTime.time);
  } else {
    const today = new Date(gmtTime.time).toLocaleDateString("en-US", { timeZone: gmtTime.timeZone });
    const prev = currentDate.toLocaleDateString("en-US", { timeZone: gmtTime.timeZone });

    if (today !== prev) {
      currentDate = new Date(gmtTime.time);
      Object.keys(storeOrderNumbers).forEach(key => delete storeOrderNumbers[key]);
      storeOrderNumbers.storeId = null;
    }
  }
};

// Generate a unique ID for each order
// WARNING: This is not guaranteed to be unique under high load.
// Consider using a more robust method like UUIDs or database-generated IDs.
const generateUniqueId = () => {
  return Date.now();
};

const generateOrderNumber = (req, res) => {
  const { storeId, gmtTime } = req.body;

  // Reset order numbers if the date has changed according to GMT time
  resetOrderNumbersIfNeeded(gmtTime);

  // Initialize the order number for the store if not present
  if (!storeOrderNumbers[storeId]) {
    storeOrderNumbers[storeId] = 1;
  }

  // Format the order number with leading zeros
  const formattedOrderNumber = String(storeOrderNumbers[storeId]).padStart(4, '0');
  const uniqueId = generateUniqueId();

  // Increment the order number for the store
  storeOrderNumbers[storeId]++;

  res.json({ orderNumber: formattedOrderNumber, uniqueId });
};

module.exports = {
  generateOrderNumber,
};
