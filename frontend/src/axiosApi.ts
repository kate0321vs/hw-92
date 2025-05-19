import axios from "axios";
import {baseURL} from "./globalConstants.ts";

const axiosApi = axios.create({
  baseURL: baseURL,
});

export default axiosApi;