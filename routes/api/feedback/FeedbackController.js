var express = require('express')
var router = express.Router()
var Feedback = require('./Feedback')

/**
|--------------------------------------------------
| Admin: Create (POST)
|--------------------------------------------------
*/
router.post('/', (req, res) => {
    let {
        user_id, 
        rating,
        description
    } = req.body

    let newFeedback = {
        user_id, 
        rating,
        description
    }

    Feedback.create(newFeedback, (err, feedback) => {
        if(err)
            return res.status(404).send({
                success: false,
                message: "Error: There was an error creating the feedback."
            })

        else
            return res.status(200).send({
                success: true,
                message: "Success: Successfully created the feedback."
            })
    })
})

/**
|--------------------------------------------------
| Admin: View All (Get)
|--------------------------------------------------
*/
router.get('/', (req,res) => {
    Feedback.find({}, (err, feedbacks) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else
            return res.status(200).send({
                success: true,
                feedbacks,
                message: "Success: Feedbacks received"
            })
    })
})




module.exports = router
