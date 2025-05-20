import {useEffect, useState} from "react";
import {ChatMessage, IncomingMessage} from "../../types";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectUser} from "../Users/usersSlice.ts";
import {useWebSocket} from "../WebSocketContext/WebSocketContext.tsx";
import {useNavigate} from "react-router-dom";
import {addMessage, fetchMessages} from "./messagesThunk.ts";
import {selectMessages} from "./messagesSlice.ts";

const Chat = () => {
    const dispatch = useAppDispatch();
    const [message, setMessage] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [usersList, setUsersList] = useState<string[]>([]);
    const user = useAppSelector(selectUser);
    const ws = useWebSocket();
    const navigate = useNavigate();
    const messages = useAppSelector(selectMessages);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }

        dispatch(fetchMessages());

        if (!ws || !user) return;

        const handleMessage =  (event: MessageEvent) => {
            const decodedMessage = JSON.parse(event.data) as IncomingMessage;

            if (decodedMessage.type === 'NEW_MESSAGE') {
                setMessage(prev => [decodedMessage.payload, ...prev]);
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

        ws.send(JSON.stringify({
            type: "SEND_MESSAGE",
            payload: {
                username: user?.displayName,
                text: messageInput,
            },
        }));

        await dispatch(addMessage({displayName: user.displayName, text: messageInput}));

        setMessageInput('');
    };

    return (
        <>
            {usersList.map((user, index) => (
                <div key={index}>
                    <b>{user}</b>
                </div>
            ))}
            <div style={{textAlign: "center", marginTop: "200px"}}>
                {messages.map((message) => (
                    <div key={message.id}>
                        <b>{message.displayName}: {message.text}</b>
                    </div>
                ))}
                {message.map((msg, index) => (
                    <div key={index}>
                        <b>{msg.username}: {msg.text}</b>
                    </div>
                ))}
                <form style={{marginTop: "20px"}} onSubmit={sendMessage}>
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