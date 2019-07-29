var express = require('express')
var router = express.Router()
var Item = require('./Item')

/**
|--------------------------------------------------
| Mobile: Add Items (POST)
|--------------------------------------------------
*/
router.post('/add', (req,res) => {
    let {
        business_id,
        name, 
        description,
        price
    } = req.body


    let newItem = {
        business_id,
        name, 
        description,
        price
    }

    Item.create(newItem, (err, item) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was an error adding the product"
            })
        else
            return res.status(200).send({
                success: true,
                item,
                message: "Success: Successfully added the item."
            })
    })
})

/**
|--------------------------------------------------
| Mobile: Remove Item (POST)
|--------------------------------------------------
*/
router.post('/remove', (req,res) => {
    let {
        _id,
    } = req.body

    Item.remove({_id}, (err, item) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was an error removing the Item."
            })
        
        else
            return res.status(200).send({
                success: true,
                message: "Success: Successfully removed the item."
            })
    })
})


/**
|--------------------------------------------------
| Mobile + Admin: View Items of a business (POST)
|--------------------------------------------------
*/
router.post('/business', (req,res) => {
    let {
        business_id,
    } = req.body

    Item.find({business_id}, (err, item) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was an error receiving items of the business."
            })
        
        else
            return res.status(200).send({
                success: true,
                item,
                message: "Success: Successfully received items of that business."
            })
    })
})


module.exports = router