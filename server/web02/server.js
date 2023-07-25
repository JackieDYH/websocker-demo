/*
 * @Author: Jackie
 * @Date: 2023-07-20 20:55:31
 * @LastEditTime: 2023-07-20 20:56:34
 * @LastEditors: Jackie
 * @Description: socket.io
 * @FilePath: /server/server2.js
 * @version:
 */
// socket.io 框架
// 引入 http 模块的 createServer 方法
const { createServer } = require('http');

// 引入 socket.io 的 Server 模块
const { Server } = require('socket.io');

// 实例化 httpServer
const httpServer = createServer();

// 初始化 socket.io
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 使用 socket.io 来建立连接
io.on('connection', (socket) => {
  socket.on('sendMsg', (data) => {
    io.emit('pushMsg', data);
    console.log(data);
  });
});

// 创建服务器，进行监听
httpServer.listen(8090, function () {
  console.log('ws://localhost:8090');
});
