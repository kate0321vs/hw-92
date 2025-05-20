import {createAsyncThunk} from "@reduxjs/toolkit";
import {IMessage, IMessageMutation} from "../../types";
import axiosApi from "../../axiosApi.ts";

export const fetchMessages = createAsyncThunk<IMessage[]>(
    "messages/fetch",
    async () => {
        const messages = await axiosApi.get<IMessage[]>('/messages')
        return messages.data
    }
);

export const addMessage = createAsyncThunk<void,IMessageMutation>(
    "messages/add",
    async (message) => {
         await axiosApi.post<IMessageMutation>('/messages', message);
    }
);