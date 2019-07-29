var express = require('express')
var router = express.Router()
var Type = require('./BusinessType')


/**
|--------------------------------------------------
| Admin: Create Type (POST)
|--------------------------------------------------
*/
router.post('/', (req, res) => {
    let { 
        name
    } = req.body
    
    let newType = {
        name
    }

    Type.create(newType, (err, type) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was an error adding the type. Please try again in a bit."
            })
        else
            return res.status(200).send({
                success: true,
                message: `Success: Successfully created a new Type.`
            })
    })
})

/**
|--------------------------------------------------
| Admin: All Types (GET)
|--------------------------------------------------
*/
router.get('/', (req, res) => {
    Type.find({}, (err, types) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else
            return res.status(200).send({
                success: true,
                types,
                message: "Success: Types received"
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
    
    Type.updateOne({_id}, update, (err, currency) => {
        if(err)
            return res.status(404).send({
                success: false,
                message: "Error: There was an error updating the type status."
            })

        else
            return res.status(200).send({
                success: true,
                message: "Success: Successfully toggled the type status."
            })
    })
})


module.exports = router