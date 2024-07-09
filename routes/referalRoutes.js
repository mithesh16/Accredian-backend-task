const express = require('express');
const router = express.Router();
const {getRefs,addRef,deleteRef,updateRefs} = require('../controllers/refController');

router.get('/getrefs', getRefs);
router.post('/addref',addRef)
router.delete('/deleteref',deleteRef)
router.patch('/updateref',updateRefs)
module.exports = router;