import {Container} from "@mui/material";
import AppToolbar from "./components/UI/AppToolbar/AppToolbar.tsx";
import {Route, Routes} from "react-router-dom";
import Register from "./features/Users/Register.tsx";
import Login from "./features/Users/Login.tsx";
import Chat from "./features/Chat/Chat.tsx";
import {WebSocketProvider} from "./features/WebSocketContext/WebSocketContext.tsx";


const App = () => {
    return (
        <>
            <WebSocketProvider>
                <header>
                    <AppToolbar/>
                </header>
                <main>
                    <Container maxWidth="lg">
                        <Routes>
                            <Route path="/" element={<Chat/>}/>
                            <Route path="/chat" element={<Chat/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/login" element={<Login/>}/>
                        </Routes>
                    </Container>
                </main>
            </WebSocketProvider>
        </>
    );
};

export default App;