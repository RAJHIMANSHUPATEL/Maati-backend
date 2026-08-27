const express = require('express');
const router = express.Router();

const posConfigurationRoutes = require('./posConfiguration.routes');

router.use('/pos-configuration', posConfigurationRoutes);

module.exports = router;
