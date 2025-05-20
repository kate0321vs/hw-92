import mongoose, {model} from "mongoose";

const MessageSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    }
});

const Message = model("Message", MessageSchema);
export default Message