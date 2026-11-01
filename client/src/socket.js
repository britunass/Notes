import { io } from 'socket.io-client';

export const socket = io({
  autoConnect: false,                                  
  auth: (cb) => cb({ token: localStorage.getItem('token') })
});