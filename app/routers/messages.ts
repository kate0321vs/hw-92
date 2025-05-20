import express from "express";
import mongoose from "mongoose";
import Message from "../models/Message";

const messagesRouter = express.Router();

messagesRouter.get('/', async (req, res) => {
    try {
        const messages = await Message.find().limit(30);
        res.send(messages);
    } catch (e) {
        res.status(500).send(e)
    }
});

messagesRouter.post("/", async (req, res, next) => {
    try {
        const newMessage = new Message({
            displayName: req.body.displayName,
            text: req.body.text,
        });
        await newMessage.save();
        res.send(newMessage)
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            res.status(400).send(e)
            return;
        }
        next(e)
    }
});

export default messagesRouter