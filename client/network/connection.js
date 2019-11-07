import Io from 'socket.io-client'

const connection = new Io('http://localhost:3001')

export default connection
