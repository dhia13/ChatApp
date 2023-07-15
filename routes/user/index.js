const router = require('express').Router()
//register
router.post('/user', (req,res)=>{
    console.log('user route')
    res.status(200).json({success:true})
})

module.exports = router