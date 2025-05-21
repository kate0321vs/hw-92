import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import WebSocket from "ws";
import usersRouter from "./routers/users";
import mongoose from "mongoose";
import config from "./config";
import {LoginAndLogoutPayload, SendMessagePayload} from "./types";
import messagesRouter from "./routers/messages";
import Message from "./models/Message";

const app = express();
const wsInstance = expressWs(app);

const port = 8000;
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const router = express.Router();
wsInstance.applyTo(router);

app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

const run = async () => {
    await mongoose.connect(config.db);
};

run().catch((err) => console.error(err));

const connectedClient: WebSocket[] = [];
const authorizedUsers: {}[] = [];

type Payload = {} | LoginAndLogoutPayload | SendMessagePayload;

interface IncomingMessage {
    type: string;
    payload: Payload;
}

router.ws('/chat', (ws, req) => {
    connectedClient.push(ws);

    ws.on('message', async (message) => {
        try {
            const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

            if (decodedMessage.type === "LOGIN") {
                const {username, token, displayName} = decodedMessage.payload as LoginAndLogoutPayload;

                if (token) {
                    const existingUser = authorizedUsers.find(user => (user as LoginAndLogoutPayload).username === username);
                    if (!existingUser) {
                        authorizedUsers.push({username, displayName});
                        console.log("Client authorized");
                    }

                    connectedClient.forEach(clientWS => {
                        clientWS.send(JSON.stringify({
                            type: "USERS_LIST",
                            payload: authorizedUsers
                        }));
                    });
                } else {
                    ws.send(JSON.stringify({ error: "Token required for LOGIN" }));
                    ws.close();
                    return;
                }
            }

            if (decodedMessage.type === "LOGOUT") {
                const { username, token, displayName} = decodedMessage.payload as LoginAndLogoutPayload;

                if (!token || !username) {
                    ws.send(JSON.stringify({ error: "Token and username required for LOGOUT" }));
                    ws.close();
                    return;
                }

                const existingUser = authorizedUsers.find(user => (user as LoginAndLogoutPayload).username === username);
                if (!existingUser) {
                    authorizedUsers.push({ username, displayName });
                }
                    connectedClient.forEach(client => {
                        client.send(JSON.stringify({
                            type: "USERS_LIST",
                            payload: authorizedUsers
                        }));
                    });
            }

            if (decodedMessage.type === "SEND_MESSAGE") {
                const { displayName, text } = decodedMessage.payload as SendMessagePayload;

                const message = new Message({
                    displayName,
                    text,
                });
                await message.save();

                connectedClient.forEach((clientWS) => {

                    clientWS.send(JSON.stringify({
                        type: "NEW_MESSAGE",
                        payload: {displayName: (decodedMessage.payload as SendMessagePayload).displayName,
                            text: (decodedMessage.payload as SendMessagePayload).text},
                    }));
                });
            }
        } catch (e) {
            ws.send(JSON.stringify({error: "Invalid message format"}));
        }
    })

    ws.on('close', (socket) => {
        console.log('Client Disconnected');
        const index = connectedClient.indexOf(ws);
        connectedClient.splice(index, 1);
        console.log(`Total connections: ${connectedClient.length}`);
    })
});

app.use(router);

app.listen(port, () => console.log(`Listening on port ${port}`));

