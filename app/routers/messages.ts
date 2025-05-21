import express from "express";
import Message from "../models/Message";

const messagesRouter = express.Router();

messagesRouter.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ _id: -1 }).limit(30);

        res.send(messages.reverse());
    } catch (e) {
        res.status(500).send(e)
    }
});

export default messagesRouter