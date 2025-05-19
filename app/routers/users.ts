import express from "express";
import mongoose from "mongoose";
import User from "../models/User";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
    try {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        displayName: req.body.displayName,
    });
    newUser.generateToken();
    await newUser.save();
    res.send(newUser)
    } catch (e) {
        if (e instanceof mongoose.Error.ValidationError) {
            res.status(400).send(e)
            return;
        }
        next(e)
    }
});

usersRouter.post("/sessions", async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (!user) {
            res.status(400).send({error: "Wrong username or password [username]"});
            return;
        }
        const isMatch = await user.checkPassword(req.body.password);
        if (!isMatch) {
            res.status(400).send({error: "Wrong username or password [password]"});
        }

        user.generateToken();
        await user.save();
        res.send({message: "Username and password correct", user});

    } catch (e) {
        next(e);
    }
});

usersRouter.delete('/sessions', async (req, res, next) => {

    try {
        const token = req.get('Authorization');
        const success = {message: 'Success'};
        if (!token) {
            res.send(success);
            return;
        }

        const user = await User.findOne({token});
        if (!user) {
            res.send(success);
            return;
        }

        user.generateToken();
        user.save();
        res.send(success);
        return;
    } catch (e) {
        return next(e);
    }
});



export default usersRouter