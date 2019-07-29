var express = require('express')
var router = express.Router()
var PaymentMethod = require('./PaymentMethod')


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

    let newPaymentMethod = {
        name, 
        description,
    }

    PaymentMethod.create(newPaymentMethod, (err, payment_method) => {
        if(err)
            return res.status(404).send({
                success: false,
                message: "Error: There was an error creating the payment method."
            })

        else
            return res.status(200).send({
                success: true,
                message: "Success: Successfully created the payment method."
            })
    })
})

/**
|--------------------------------------------------
| Admin: View All (Get)
|--------------------------------------------------
*/
router.get('/', (req,res) => {
    PaymentMethod.find({}, (err, payment_methods) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else
            return res.status(200).send({
                success: true,
                payment_methods,
                message: "Success: Payment methods received"
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

    PaymentMethod.updateOne({_id}, update, (err, payment_method) => {
        if(err)
            return res.status(404).send({
                success: false,
                message: "Error: There was an error updating the payment method status."
            })

        else
            return res.status(200).send({
                success: true,
                message: "Success: Successfully toggled the payment method status."
            })
    })
})

module.exports = router
