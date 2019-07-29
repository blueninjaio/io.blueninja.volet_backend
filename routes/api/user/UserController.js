var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var User = require('./User')
var config = require('../../../config')

/**
|--------------------------------------------------
| Mobile: REGISTRATION (POST)
|--------------------------------------------------
*/
router.post('/', (req, res) => {
    let { 
        contact, 
        facebook_id,
        google_id, 
        f_name, 
        l_name,
        email,
        password,
    } = req.body

    let newUser = {
        contact, 
        facebook_id,
        google_id, 
        f_name, 
        l_name,
        email
    }

    let hashedPassword = bcrypt.hashSync(password, 8);
    newUser.password = hashedPassword

    User.create(newUser, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was an error adding you. Please try again in a bit."
            })
        else
            return res.status(200).send({
                success: true,
                user: user,
                message: "Success: Successfully created your account."
            })
    })
})

/**
|--------------------------------------------------
| Mobile: User Login (POST)
|--------------------------------------------------
*/
router.post('/login', (req, res) => {
    let { email, password } = req.body

    User.findOne({ email }, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was a server error, please try again in a bit."
            })

        else{
            var passwordIsValid = bcrypt.compareSync(password, user.password)
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
                user: user,
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

    User.findOne({ email }, (err, user) => {
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

        User.updateOne({ email }, update, (err, updatedUser) => {
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

    User.findOne({ email }, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was a server error, please try again in a bit."
            })

        else{
            var passwordIsValid = bcrypt.compareSync(temp_password, user.password)
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

                User.update({ email }, reset, (err, user) => {
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
    let { 
        email, 
        token 
    } = req.body

    User.findOne({email}, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was an error finding the user with that email"
            })

        else{
            let update = {}
            update.push_token = token

            User.updateOne({ email }, update, (err, user) => {
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

    User.findOne({email}, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
    
        else{
            let update = {}
            update.push_token = ''
    
            User.updateOne({ email }, update, (err, user) => {
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

    User.findOne({_id}, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
    
        else
            return res.status(200).send({
                success: true,
                user,
                message: "Success: Succesfully received user information"
            })
    })
})

/**
|--------------------------------------------------
| Admin: All Users (GET)
|--------------------------------------------------
*/
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        else
            return res.status(200).send({
                success: true,
                users,
                message: "Success: Users received"
            })
    })
})

/**
|--------------------------------------------------
| POST: Verify User
|--------------------------------------------------
*/
router.post('/me', (req, res) => {
    let { email } = req.body

    User.findOne({email}, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
        
        return res.status(200).send({
            success: true,
            user: user,
            message: "Success: User successfully verified"
        })
    })
})


module.exports = router
