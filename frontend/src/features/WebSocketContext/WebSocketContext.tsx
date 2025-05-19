import React, {createContext, useContext, useEffect, useState} from 'react';

export const WebSocketContext = createContext<WebSocket | null>(null);

export const WebSocketProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/chat');
        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);