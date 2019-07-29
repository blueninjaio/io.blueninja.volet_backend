var express = require('express')
var router = express.Router()

var Category = require('./BusinessCategory')
var Business = require('../business/Business')


/**
|--------------------------------------------------
| Admin: Create Category (POST)
|--------------------------------------------------
*/
router.post('/', (req, res) => {
    let { 
        name
    } = req.body

    let newCategory = {
        name,
        isActive: true
    }

    Category.create(newCategory, (err, category) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was an error adding the category. Please try again in a bit."
            })
        else
            return res.status(200).send({
                success: true,
                message: `Success: Successfully created new category.`
            })
    })
})

/**
|--------------------------------------------------
| POST: Businesses under that Category
|--------------------------------------------------
*/
router.post('/business', (req, res) => {
    let { name } = req.body

    Category.find({name}, (err, category) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was an error check if the category exists."
            })

        else{
            Business.find({type_of_business: name}, (err, business) => {
                if(err)
                    return res.status(500).send({
                        success: false,
                        message: "Error: There was an error matching the business with type."
                    })

                else
                    return res.status(200).send({
                        success: true,
                        business,
                        message: "Success: Retrieved Businesses with that Category"
                    })
            })
        }
    })
})

/**
|--------------------------------------------------
| Admin: All Categories (GET)
|--------------------------------------------------
*/
router.get('/', (req, res) => {
    Category.find({}, (err, categories) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else
            return res.status(200).send({
                success: true,
                categories,
                message: "Success: Categories received"
            })
    })
})

/**
|--------------------------------------------------
| Admin: Toggle Active Status (POST)
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
    
    Category.updateOne({_id}, update, (err, currency) => {
        if(err)
            return res.status(404).send({
                success: false,
                message: "Error: There was an error updating the category status."
            })

        else
            return res.status(200).send({
                success: true,
                message: "Success: Successfully toggled the category status."
            })
    })
})


module.exports = router