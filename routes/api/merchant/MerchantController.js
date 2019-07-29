var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var Merchant = require('./Merchant')
var config = require('../../../config')

/**
|--------------------------------------------------
| Mobile: REGISTRATION (POST)
|--------------------------------------------------
*/
router.post('/', (req, res) => {
    let { 
        contact,
        f_name, 
        l_name,
        email,
        password,
    } = req.body

    let newMerchant = {
        contact,
        f_name, 
        l_name,
        email
    }
    
    let hashedPassword = bcrypt.hashSync(password, 8);
    newMerchant.password = hashedPassword
    

    Merchant.create(newMerchant, (err, merchant) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was an error adding you. Please try again in a bit."
            })
        else
            return res.status(200).send({
                success: true,
                merchant,
                message: "Success: Successfully created your account."
            })
    })
})

/**
|--------------------------------------------------
| Mobile: Merchant Login (POST)
|--------------------------------------------------
*/
router.post('/login', (req, res) => {
    let { email, password } = req.body

    Merchant.findOne({ email }, (err, merchant) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was a server error, please try again in a bit."
            })

        else{
            var passwordIsValid = bcrypt.compareSync(password, merchant.password)
            if(!passwordIsValid)
                return res.status(401).send({
                    success: false,
                    message: "Error: Credentials are invalid."
                })
    
            var token = jwt.sign({ email }, config.secret, {
                expiresIn: 43200
            })
    
            return res.status(200).send({
                success: true,
                token: token,
                merchant,
                message: "Success: Successful login."
            })
        }
    })
})

/**
|--------------------------------------------------
| Mobile: Generate Temporary Password (POST)
|--------------------------------------------------
*/
router.post('/tempPassword', (req, res) => {
    let { email } = req.body

    Merchant.findOne({ email }, (err, merchant) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was a server error, please try again in a bit."
            })

        else{
            let uniqueKey = 'abcd1234'
            let password = uniqueKey
            let hashedPassword = bcrypt.hashSync(password, 8);

            let update = {}
            update.password = hashedPassword

        Merchant.updateOne({ email }, update, (err, updatedMerchant) => {
                if (err)
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    })
                
                else
                    return res.status(200).send({
                        success: true,
                        message: `Success: Password reset to abcd1234`
                    })
            })
        }
    })
})

/**
|--------------------------------------------------
| Mobile: Reset Password (POST)
|--------------------------------------------------
*/
router.post('/resetPassword', (req, res) => {
    let { email, temp_password, new_password } = req.body

    Merchant.findOne({ email }, (err, merchant) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was a server error, please try again in a bit."
            })

        else{
            var passwordIsValid = bcrypt.compareSync(temp_password, merchant.password)
            if(!passwordIsValid)
                return res.status(401).send({
                    success: false,
                    message: "Error: Credentials are invalid."
                })
    
            else{
                let hashedPassword = bcrypt.hashSync(new_password, 8);

                let reset = {
                    tempPassword: false,
                    password: hashedPassword
                }

                Merchant.update({ email }, reset, (err, merchant) => {
                    if (err)
                        return res.status(500).send({
                            success: false,
                            message: 'Error: Server error'
                        })
                    
                    else
                        return res.status(200).send({
                            success: true,
                            message: 'Success: Password has been successfully reset.'
                        })
                })
            }
        }
    })
})

/**
|--------------------------------------------------
| Mobile: Update Push Token (POST)
|--------------------------------------------------
*/
router.post('/updatePush', (req, res) => {
    let { email, token } = req.body

    Merchant.findOne({email}, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was an error finding the user with that email"
            })

        else{
            let update = {}
            update.push_token = token

            Merchant.updateOne({ email }, update, (err, user) => {
                if (err)
                    return res.status(500).send({
                        success: false,
                        message: 'Error: Server error'
                    })

                return res.status(200).send({
                    success: true,
                    message: "Success: User Push Token Successfully Updated."
                })
            })
        }
    })
})

/**
|--------------------------------------------------
| Mobile: Remove Push Token (POST)
|--------------------------------------------------
*/
router.post('/removePush', (req, res) => {
    let { email } = req.body

    Merchant.findOne({email}, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
    
        else{
            let update = {}
            update.push_token = ''
    
            Merchant.updateOne({ email }, update, (err, user) => {
                if (err)
                    return res.status(500).send({
                        success: false,
                        message: 'Error: Server error'
                    })
    
                return res.status(200).send({
                    success: true,
                    message: "Success: User Push Token Successfully Removed"
                })
            })
        }
    })
})

/**
|--------------------------------------------------
| Admin: User by User ID
|--------------------------------------------------
*/
router.post('/id', (req, res) => {
    let { _id } = req.body

    Merchant.findOne({_id}, (err, merchant) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
    
        else
            return res.status(200).send({
                success: true,
                merchant,
                message: "Success: Succesfully received user information"
            })
    })
})

/**
|--------------------------------------------------
| Admin: All Merchants (POST)
|--------------------------------------------------
*/
router.get('/', (req, res) => {
    Merchant.find({}, (err, merchants) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else
            return res.status(200).send({
                success: true,
                merchants,
                message: "Success: Merchants received"
            })
    })
})

module.exports = router
