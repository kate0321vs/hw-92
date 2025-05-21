import {createAsyncThunk} from "@reduxjs/toolkit";
import {IMessage} from "../../types";
import axiosApi from "../../axiosApi.ts";

export const fetchMessages = createAsyncThunk<IMessage[]>(
    "messages/fetch",
    async () => {
        const messages = await axiosApi.get<IMessage[]>('/messages')
        return messages.data
    }
);

