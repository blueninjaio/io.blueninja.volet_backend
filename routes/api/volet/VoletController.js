var express = require('express')
var router = express.Router()
var Volet = require('./Volet')



/**
|--------------------------------------------------
| Admin: Create (POST)
|--------------------------------------------------
*/
router.post('/', (req, res) => {
    let {
        persona_id, 
        persona_model,
        amount, 
    } = req.body


    let newVolet = {
        persona_id, 
        persona_model,
        amount
    }
    
    Volet.create(newVolet, (err, volet) => {
        if(err)
            return res.status(404).send({
                success: false,
                message: "Error: There was an error creating the volet."
            })

        else
            return res.status(200).send({
                success: true,
                message: "Success: Successfully created the volet."
            })
    })
})

/**
|--------------------------------------------------
| Admin: Calulate per _id (POST)
|--------------------------------------------------
*/
router.post('/id', (req, res) => {
    let {
        persona_id,
    } = req.body

    Volet.find({persona_id}, (err, volet) => {
        if(err)
            return res.status(404).send({
                success: false,
                message: "Error: There was an error creating the volet."
            })

        else             
            return res.status(200).send({
                success: true,
                volet,
                message: "Success: Successfully received volet of Persona."
            })
    })
})

/**
|--------------------------------------------------
| Admin: View All (Get)
|--------------------------------------------------
*/
router.get('/', (req,res) => {
    Volet.find({}, (err, volets) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else
            return res.status(200).send({
                success: true,
                volets,
                message: "Success: Volets received"
            })
    })
})


module.exports = router
