/*
 * @Author: Jackie
 * @Date: 2023-07-25 17:33:35
 * @LastEditTime: 2023-07-25 18:01:47
 * @LastEditors: Jackie
 * @Description: socket.io
 * @FilePath: /websocker-demo/server/web06/server.js
 * @version:
 */
const websocket = require('websocket').server;

const http = require('http');

// 然后启动 http，开启服务器，进行监听 ws || wss
const httpServer = http.createServer().listen(8090, () => {
  console.log('socker:', 'ws://127.0.0.1:8090');
});
// 创建服务
const websocketServer = new websocket({
  httpServer: httpServer,
  autoAcceptConnections: false
});
const conArr = [];

websocketServer.on('request', function (request) {
  const connection = request.accept();
  conArr.push(connection);
  connection.on('message', function (message) {
    console.log(message);
    for (let i = 0; i < conArr.length; i++) {
      conArr[i].send(message.utf8Data);
    }
  });
});
