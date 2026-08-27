/**
 * Controller to verify the user's token.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 */
const verifyUser = async (req, res) => {
    res.status(200).send({ success: true, message: "Token verified" });
};

module.exports = {
    verifyUser
};