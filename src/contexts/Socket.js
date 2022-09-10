import React from "react";
import socketio from "socket.io-client";
import { SERVER_INFO } from '../constants/Server';

const SOCKET_URL = 'ws://' + SERVER_INFO.HOST + ":" + SERVER_INFO.SOCKET_PORT.toString()

const socket = socketio.connect(SOCKET_URL);
const SocketContext = React.createContext();

export {socket, SocketContext}