const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const upload = require('../middleware/imageUploads')
const sharp = require('sharp')
const { sendWelcomeEmail } = require('../emails/account')
const { sendCancelEmail } = require('../emails/account')



// Endpoint to create user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    
    try {
        const token = await user.generateAuthToken()
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }


})

// Endpoint to get all users
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// Endpoint for updating users
router.patch('/users/me', auth, async (req, res) => {
    const _id = req.user._id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid operation' })
    }

    try {
        const user = await User.findById(_id)

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()


        if (!user) {
            return res.status(404).send()
        }

        res.send(user)


    } catch (e) {
        res.status(400).send()
    }

})

// Endpoint for deleting users
router.delete('/users/me', auth, async (req, res) => {
    try {
        user = req.user     
        sendCancelEmail(user.email, user.name)
        await user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }


})

// logging a user in
router.post('/users/login', async (req, res) => {
    try{
        
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token})
    } catch (e) {
        res.status(400).send()
    }
})

// logging out a user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})

// loggout all sessions
router.post('/users/logoutALL', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})


// endpoint to upload profile picture
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


module.exports = router