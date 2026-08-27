const express = require("express");
const router = express.Router();
const { validate } = require("../../middlewares/validation.middleware");
const { getOrderNumberSchema } = require("../../utils/zod.schema");

let storeOrderNumbers = {storeId:null};
let currentDate = null;

// Reset the order numbers if the date has changed
const resetOrderNumbersIfNeeded = (gmtTime) => { 
  
if(!currentDate){
currentDate = new Date(gmtTime.time);
}else{
 const today = new Date(gmtTime.time).toLocaleDateString("en-US", { timeZone: gmtTime.timeZone });
const prev =   currentDate.toLocaleDateString("en-US", { timeZone: gmtTime.timeZone }); 

  if (today !== prev ) {
    currentDate = new Date(gmtTime.time);
    storeOrderNumbers = {storeId:null};
  }
}
};


// Generate a unique ID for each order
const generateUniqueId = () => {
  const d = new Date();
  return d.getTime();
};

router.post('/', validate(getOrderNumberSchema), (req, res) => {
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
});

module.exports = router;
