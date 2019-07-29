var express = require('express')
var router = express.Router()

var Bank = require('./Bank')


/**
|--------------------------------------------------
| Admin: Create (POST)
|--------------------------------------------------
*/
router.post('/', (req, res) => {
    let {
        name, 
        description, 
    } = req.body

    let newBank = {
        name, 
        description, 
    }
    
    Bank.create(newBank, (err, bank) => {
        if(err)
            return res.status(404).send({
                success: false,
                message: "Error: There was an error creating the bank."
            })

        else
            return res.status(200).send({
                success: true,
                message: "Success: Successfully created the bank."
            })
    })
})

/**
|--------------------------------------------------
| Admin: View All (Get)
|--------------------------------------------------
*/
router.get('/', (req,res) => {
    Bank.find({}, (err, banks) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else
            return res.status(200).send({
                success: true,
                banks,
                message: "Success: Banks received"
            })
    })
})


/**
|--------------------------------------------------
| Admin: Toggle Active Status
|--------------------------------------------------
*/
router.post('/toggle', (req, res) => {
    let {
        _id,
        isActive 
    } = req.body


    let update = {
        isActive
    }

    Bank.updateOne({_id}, update, (err, bank) => {
        if(err)
            return res.status(404).send({
                success: false,
                message: "Error: There was an error updating the bank status."
            })

        else
            return res.status(200).send({
                success: true,
                message: "Success: Successfully toggled the bank status."
            })
    })
})

module.exports = router
