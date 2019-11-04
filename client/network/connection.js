import io from 'socket.io-client';

const connection = new io('http://localhost:3001');

export default connection;