var express = require('express')
var router = express.Router()
var Static = require('./Static')


/**
|--------------------------------------------------
| GET: Static
|--------------------------------------------------
*/
router.get('/', (req, res) => {
    Static.find({}, (err, static) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
            
        return res.status(200).send({
                success: true,
                static,
                message: "Static Pages Received"
            })
    })
})


/**
|--------------------------------------------------
| POST: Edit FAQ
|--------------------------------------------------
*/
router.post('/faq', (req, res) => {
    let { faq } = req.body

    Static.find({}, (err, static) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })

        else if(static.length < 1){
            let staticPage = {
                faq, 
                policies: ''
            }

            Static.create(staticPage, (err, static) => {
                if(err)
                    return res.status(500).send({
                        success: false,
                        message: "Error: There was an error creating the FAQ Static Page. Please try again in a bit."
                    })
                else
                    return res.status(200).send({
                        success: true,
                        static,
                        message: "Success: Successfully created FAQ Static Page."
                    })
            })
        }

        else{
            let update = {
                faq
            }
    
            Static.updateOne({"_id": static[0]._id}, update, (err, static) => {
                if (err)
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    })
    
                return res.status(200).send({
                    success: true,
                    message: "Success: Successfully edited FAQ Static Page."
                })
            })
        }
    })
})



/**
|--------------------------------------------------
| POST: Edit Policies
|--------------------------------------------------
*/
router.post('/policies', (req, res) => {
    let { policies } = req.body

    Static.find({}, (err, static) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })

        else if(static.length < 1){
            let staticPage = {
                faq: '', 
                policies,
            }

            Static.create(staticPage, (err, static) => {
                if(err)
                    return res.status(500).send({
                        success: false,
                        message: "Error: There was an error creating the Policies Static Page. Please try again in a bit."
                    })
                else
                    return res.status(200).send({
                        success: true,
                        static,
                        message: "Success: Successfully created Policies Static Page."
                    })
            })
        }

        else{
            let update = {
                policies
            }
    
            Static.updateOne({"_id": static[0]._id}, update, (err, static) => {
                if (err)
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    })
    
                return res.status(200).send({
                    success: true,
                    message: "Success: Successfully edited Policies Static Page."
                })
            })
        }
    })
})


module.exports = router
