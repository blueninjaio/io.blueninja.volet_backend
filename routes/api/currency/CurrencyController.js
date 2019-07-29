var express = require('express')
var router = express.Router()
var Currency = require('./Currency')


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

    let newCurrency = {
        name, 
        description
    }
    
    Currency.create(newCurrency, (err, currency) => {
        if(err)
            return res.status(404).send({
                success: false,
                message: "Error: There was an error creating the currency."
            })

        else
            return res.status(200).send({
                success: true,
                message: "Success: Successfully created the currency."
            })
    })
})

/**
|--------------------------------------------------
| Admin: View All (Get)
|--------------------------------------------------
*/
router.get('/', (req,res) => {
    Currency.find({}, (err, currency) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else
            return res.status(200).send({
                success: true,
                currency,
                message: "Success: Currency received"
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

    Currency.updateOne({_id}, update, (err, currency) => {
        if(err)
            return res.status(404).send({
                success: false,
                message: "Error: There was an error updating the currency status."
            })

        else
            return res.status(200).send({
                success: true,
                message: "Success: Successfully toggled the currency status."
            })
    })
})

module.exports = router
