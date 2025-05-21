import {useEffect, useState} from "react";
import {IncomingMessage, UserListPayload} from "../../types";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectUser} from "../Users/usersSlice.ts";
import {useWebSocket} from "../WebSocketContext/WebSocketContext.tsx";
import {useNavigate} from "react-router-dom";
import {fetchMessages} from "./messagesThunk.ts";
import {selectMessages} from "./messagesSlice.ts";
import {Box, Button, Divider, List, ListItem, Paper, TextField, Typography} from "@mui/material";

const Chat = () => {
    const dispatch = useAppDispatch();
    const [messageInput, setMessageInput] = useState('');
    const [usersList, setUsersList] = useState<UserListPayload[]>([]);
    const user = useAppSelector(selectUser);
    const ws = useWebSocket();
    const navigate = useNavigate();
    const messages = useAppSelector(selectMessages);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        setUsersList(usersList);
        dispatch(fetchMessages());
    }, [dispatch, user, navigate]);

    useEffect(() => {

        if (!ws || !user) return;

        const handleMessage = async  (event: MessageEvent) => {
            const decodedMessage = JSON.parse(event.data) as IncomingMessage;

            if (decodedMessage.type === 'NEW_MESSAGE') {
                await dispatch(fetchMessages());
            } else if (decodedMessage.type === 'USERS_LIST') {
                setUsersList(decodedMessage.payload);
            }
        };

        ws.addEventListener("message", handleMessage);

        const handleOpen = () => {

            ws.send(JSON.stringify({
                type: "LOGIN",
                payload: {
                    username: user.username,
                    token: user.token,
                    displayName: user.displayName
                },
            }));
        };

        ws.addEventListener("open", handleOpen);

        if (ws.readyState === WebSocket.OPEN) {
            handleOpen();
        }

        return () => {
            ws.removeEventListener("open", handleOpen);
            ws.removeEventListener("message", handleMessage);
        };

    }, [ws, user]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ws || ws.readyState !== WebSocket.OPEN || !user) return;

        const messagePayload = {
            displayName: user.displayName,
            text: messageInput,
        };

        ws.send(JSON.stringify({
            type: "SEND_MESSAGE",
            payload: messagePayload,
        }));

        setMessageInput('');
    };

    return (
        <>
            <Box sx={{ display: 'flex', gap: 4, p: 4 }}>
                <Box sx={{ width: '200px' }}>
                    <Typography variant="h6" gutterBottom>
                        Online users
                    </Typography>
                    <List>
                        {usersList.map((user) => (
                            <ListItem key={user.username}>
                                <Typography variant="body1"><b>{user.displayName}</b></Typography>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Paper sx={{ p: 2, minHeight: '400px', maxHeight: '70vh', overflowY: 'auto' }}>
                        {messages.map((message) => (
                            <Box key={message._id} sx={{ mb: 1 }}>
                                <Typography variant="body2">
                                    <b>{message.displayName}:</b> {message.text}
                                </Typography>
                                <Divider sx={{ mt: 1 }} />
                            </Box>
                        ))}
                    </Paper>

                    <Box
                        component="form"
                        onSubmit={sendMessage}
                        sx={{ mt: 2, display: 'flex', gap: 2 }}
                    >
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Введите сообщение"
                            name="messageText"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <Button sx={{backgroundColor: "royalblue"}} variant="contained" type="submit">
                            Send
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>


    );
};

export default Chat;