import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {persister, store} from "./app/store.ts";
import {PersistGate} from "redux-persist/integration/react";
import {ToastContainer} from "react-toastify";
import {CssBaseline} from "@mui/material";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <PersistGate persistor={persister}>
            <BrowserRouter>
                <ToastContainer autoClose={1000}/>
                <CssBaseline/>
                <App/>
            </BrowserRouter>
        </PersistGate>
    </Provider>
)
