const Transaction = require("../../models/transaction.model");

/**
 * Controller to add a new transaction.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const addtransaction = async (req, res) => {
    const data = req.body;

    try {
        await Transaction.create({ ...data });
        res.send({ success: true,
            message: "Success"});
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
};

/**
 * Controller to get transactions by date.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const getTransactionbyDate = async (req, res) => {
    try {
      const { start_date, end_date, store_id } = req.body;
  
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
  
      endDate.setHours(23, 59, 59, 999);
  
      const transactions = await Transaction.find({
        store_id,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ date: -1 });
  
    
      return res.status(200).json({ success: true, message: "transactions get successfully by date and time", data: transactions });
   
    } catch (error) {
      console.error(error);
      res.status(500).json({success: false, message: "Internal server error"  });
    }
  };
  

module.exports = {
addtransaction,getTransactionbyDate
};