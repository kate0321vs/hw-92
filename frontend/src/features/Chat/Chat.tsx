import {useEffect, useState} from "react";
import {IncomingMessage, UserListPayload} from "../../types";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectUser} from "../Users/usersSlice.ts";
import {useWebSocket} from "../WebSocketContext/WebSocketContext.tsx";
import {useNavigate} from "react-router-dom";
import {fetchMessages} from "./messagesThunk.ts";
import {selectMessages} from "./messagesSlice.ts";

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

        dispatch(fetchMessages());
    }, [dispatch, user, navigate]);

    useEffect(() => {

        if (!ws || !user) return;

        const handleMessage = async  (event: MessageEvent) => {
            const decodedMessage = JSON.parse(event.data) as IncomingMessage;

            console.log(decodedMessage);

            if (decodedMessage.type === 'NEW_MESSAGE') {
                await dispatch(fetchMessages());
            } else if (decodedMessage.type === 'USERS_LIST') {
                setUsersList(decodedMessage.payload);
            }
        };

        ws.addEventListener("message", handleMessage);

        const handleOpen = () => {
            console.log("WebSocket opened");

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

    console.log(usersList)

    return (
        <>
            {usersList.map((user) => (
                <div key={user.username}>
                    <b>{user.displayName}</b>
                </div>
            ))}
            <div style={{textAlign: "center", marginTop: "200px"}}>
                {messages.map((message) => (
                    <div key={message._id}>
                        <b>{message.displayName}: {message.text}</b>
                    </div>
                ))}
                <form style={{marginTop: "20px", marginBottom: "100px"}} onSubmit={sendMessage}>
                    <input type="text"
                           name='messageText'
                           value={messageInput}
                           onChange={e => setMessageInput(e.target.value)}/>
                    <button style={{marginLeft: "10px"}} type='submit'>Send</button>
                </form>
            </div>
        </>


    );
};

export default Chat;