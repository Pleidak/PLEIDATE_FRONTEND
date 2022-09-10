import axios from 'axios';
import { SERVER_INFO } from '../constants/Server';

const BASE_URL = 'http://' + SERVER_INFO.HOST + ":" + SERVER_INFO.PORT.toString()

export default axios.create({ baseURL: BASE_URL });