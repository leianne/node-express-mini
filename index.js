// implement your API here
const express = require('express');

const db = require('./data/db');

const server = express();

const bodyParser = require('body-parser')
server.use(express.json());
server.use(bodyParser.json())

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({ 
                error: "The users information could not be retrieved." 
            })
            res.end()
        })
})

server.get('/api/users/:id', (req, res) => {
    const userId = req.params.id
    db.findById(userId)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(404).json({
                message: "The user with the specified ID does not exist." 
            })
        })
})

server.post('/api/users', (req, res) => {
    const user = req.body;
    console.log(req.body)
    db.insert(user)
        .then(user => {
            res.status(201).json({ success: true, user})
        })
        .catch(({ code, message }) => {
            res.status(code).json({ success: false, message })
        })
})

server.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id
    db.remove(userId)
        .then(deleted => {
            res.status(204).end()
        })
        .catch(err => {
            res.status(404).json({
                message: "The user with the specified ID does not exist."
            })
        })
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    if(changes.name === '' || changes.bio === '') {
        res.status(404).json({
            success: false,
            errorMessage: "Please provide name and bio for the user."   
        })
    } else {
        db.update(id, changes)
        .then(updated => {
            if(updated) {
                res.status(200).json({
                    success: true,
                    updated
                })
            } else {
                res.status(404).json({
                    success: false,
                    message: "The user with the specified ID does not exist." 
                })
            }
        })
    }
})


server.listen(4000, () => {
    console.log('It\'s worrking!!!')
})