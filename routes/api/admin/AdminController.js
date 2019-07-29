var express = require('express')
var router = express.Router()
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var Admin = require('./Admin')
var config = require('../../../config')


/**
|--------------------------------------------------
| GET: All Admins
|--------------------------------------------------
*/
router.get('/', (req, res) => {
    Admin.find({}, (err, users) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })
            
        return res.status(200).send({
                success: true,
                users: users,
                message: "Success: Admins received"
            })
    })
})

/**
|--------------------------------------------------
| POST: Create Admin
|--------------------------------------------------
*/
router.post('/', (req, res) => {
    let { 
        email,
        password
    } = req.body

    let newUser = {}
    let hashedPassword = bcrypt.hashSync(password, 8);
    newUser.email = email
    newUser.password = hashedPassword

    Admin.create(newUser, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Erro: There was a problem adding the Admin"
            })
        else
            return res.status(200).send({
                success: true,
                message: `Success: Admin was successfully created`
            })
    })
})


/**
|--------------------------------------------------
| POST: Admin Login
|--------------------------------------------------
*/
router.post('/login', (req, res) => {
    let { email, password } = req.body

    Admin.findOne({ email }, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: Server Error"
            })

        else{
            var passwordIsValid = bcrypt.compareSync(password, user.password)
            if(!passwordIsValid)
                return res.status(401).send({
                    success: false,
                    message: "Error: Wrong Password Entered"
                })
    
            var token = jwt.sign({ email }, config.secret, {
                expiresIn: 43200
            })
    
            return res.status(200).send({
                success: true,
                token: token,
                user,
                message: "Success: Successful login"
            })
        }
    })
})

/**
|--------------------------------------------------
| POST: Verify User
|--------------------------------------------------
*/
router.post('/me', (req, res) => {

    let { email } = req.body

    Admin.findOne({email}, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Server Error"
            })

        else
            return res.status(200).send({
                success: true,
                user: user,
                message: "Success: User verified"
            })
    })
})

/**
|--------------------------------------------------
| POST: Forgot Password
|--------------------------------------------------
*/
router.post('/forgotPassword', (req, res) => {
    let { email } = req.body

    Admin.findOne({ email }, (err, user) => {
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

            Admin.updateOne({ email }, update, (err, updatedUser) => {
                if (err)
                    return res.send({
                        success: false,
                        message: 'Error: Server error'
                    })
                
                else
                    return res.status(200).send({
                        success: true,
                        message: `Success: Password reset to abcd1234`
                    });
                
            })
        }
    })
})

/**
|--------------------------------------------------
| POST: Change Password
|--------------------------------------------------
*/
router.post('/changePassword', (req, res) => {
    let { 
        email, 
        old_password, 
        new_password 
    } = req.body

    Admin.findOne({ email }, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was a server error, please try again in a bit."
            })

        else if(!user)
            return res.status(404).send({
                success: false,
                message: "Error: Credentials are invalid."
            })

        else{
            var passwordIsValid = bcrypt.compareSync(old_password, user.password)
            if(!passwordIsValid)
                return res.status(401).send({
                    success: false,
                    message: "Error: Credentials are invalid."
                })
    
            else{
                let hashedPassword = bcrypt.hashSync(new_password, 8);

                let reset = {
                    password: hashedPassword
                }

                Admin.update({ email }, reset, (err, user) => {
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
| POST: Change Email
|--------------------------------------------------
*/
router.post('/changeEmail', (req, res) => {
    let { _id, email } = req.body

    let update = {
        email
    }

    Admin.updateOne({ _id }, update, (err, user) => {
        if(err)
            return res.status(500).send({
                success: false,
                message: "Error: There was a server error, please try again in a bit."
            })

        else
            return res.status(200).send({
                success: true,
                message: 'Success: Email has been successfully changed.'
            })
    })
})

module.exports = router
