const express = require('express');
const  router = express.router;

router.post('/add');
router.put('/update/:id');
router.delete('/delete/:id');

module.exports = router;