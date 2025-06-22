import axios from "axios";
import { API_ENDPOINT } from "./appHelper";

const request = axios.create({
   baseURL: API_ENDPOINT,
});

export { request };
