import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import WebSocket from "ws";
import usersRouter from "./routers/users";
import mongoose from "mongoose";
import config from "./config";
import {LoginAndLogoutPayload, SendMessagePayload} from "./types";

const app = express();
const wsInstance = expressWs(app);

const port = 8000;
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const router = express.Router();
wsInstance.applyTo(router);

app.use('/users', usersRouter);

const run = async () => {
    await mongoose.connect(config.db);
};

run().catch((err) => console.error(err));

const connectedClient: WebSocket[] = [];
const authorizedUsers: string[] = [];

type Payload = {} | LoginAndLogoutPayload | SendMessagePayload;

interface IncomingMessage {
    type: string;
    payload: Payload;
}

router.ws('/chat', (ws, req) => {
    connectedClient.push(ws);

    console.log(connectedClient.length)
    ws.on('message', (message) => {
        try {
            const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

            if (decodedMessage.type === "LOGIN") {
                const { username, token } = decodedMessage.payload as LoginAndLogoutPayload;

                if (token) {
                    if (!authorizedUsers.includes(username)) {
                        authorizedUsers.push(username);
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
                const { username, token } = decodedMessage.payload as LoginAndLogoutPayload;

                if (!token || !username) {
                    ws.send(JSON.stringify({ error: "Token and username required for LOGOUT" }));
                    ws.close();
                    return;
                }
                    const index = authorizedUsers.indexOf(username);
                    if (index !== -1) authorizedUsers.splice(index, 1);
                    connectedClient.forEach(client => {
                        client.send(JSON.stringify({
                            type: "USERS_LIST",
                            payload: authorizedUsers
                        }));
                    });
            }

            if (decodedMessage.type === "SEND_MESSAGE") {
                connectedClient.forEach((clientWS) => {
                    clientWS.send(JSON.stringify({
                        type: "NEW_MESSAGE",
                        payload: {username: (decodedMessage.payload as SendMessagePayload).username,
                            text: (decodedMessage.payload as SendMessagePayload).text},
                    }));
                })
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

