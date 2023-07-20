/*
 * @Author: Jackie
 * @Date: 2023-07-20 20:44:39
 * @LastEditTime: 2023-07-20 20:55:54
 * @LastEditors: Jackie
 * @Description: websocket
 * @FilePath: /server/server.js
 * @version:
 */
const websocket = require('websocket').server;

const http = require('http');

// 然后启动 http，开启服务器，进行监听 ws || wss
const httpServer = http.createServer().listen(8090, () => {
  console.log('nihao: ', 'ws://localhost:8090');
});
// 创建服务
const websocketServer = new websocket({
  httpServer: httpServer,
  autoAcceptConnections: false
});
// 创建通信线池，如果不适使用数据库的话，需要用数组来做一个虚拟的线池，因为 websocket 是一个实时通信的，服务器与客户端之间的通信是有来有回的，需要将这些通信的数据进行存储。一般使用 redis 来做线池，然后上限存储的数据数量一般是 1000 条
const conArr = [];

// 使用 websocket 来接受请求和发送消息，这里用到的是 websocket 的 npm 包中的 .on('requset', function(){}) 方法和 .on('message', function() {} 方法。这些方法的使用都可以从 websocket 的 npm 文档中查看
websocketServer.on('request', function (request) {
  // 这就是一次客户端发送的消息
  // websocket 需要将这个链接保存起来
  // 只要客户端和服务器没有断开，这个链接必须在
  // 客户端与服务端的通信都是从这个链接上通信
  const connection = request.accept();

  // 每次接收一个链接，将它存放在数组里面
  conArr.push(connection);

  // 监听客户端发送的消息
  connection.on('message', function (message) {
    console.log(message);
    // 发送消息给客户端（广播到各个客户端）
    // 后面加上 utf8Data 编码
    // 要将所有的链接全部发出去，才可以让每个客户端接收到其他传来的数据
    for (let i = 0; i < conArr.length; i++) {
      conArr[i].send(message.utf8Data);
    }
  });
});

// 启动服务
// node server.js

// 完整
// const  websocket = require('websocket').server

// const http = require('http')

// const httpServer = http.createServer().listen(8080, ()=>{
//   console.log('nihao: ','http://localhost:8080');
// })

// // 创建 websocket 服务器
// const websocketServer = new websocket({
//   httpServer: httpServer,
//   autoAcceptConnections: false
// })

// // 链接池，一般真实场景会用缓存做链接池 redis 一般一个链接池的上限是 1000
// // 存储链接
// // 但是有一个最大上限
// const conArr = []

// websocketServer.on('request', function(request) {
//   // 这就是一次客户端发送的消息
//   // websocket 需要将这个链接保存起来
//   // 只要客户端和服务器没有断开，这个链接必须在
//   // 客户端与服务端的通信都是从这个链接上通信
//   const connection = request.accept()

//   // 每次接收一个链接，将它存放在数组里面
//   conArr.push(connection)

//   // 监听客户端发送的消息
//   connection.on('message', function(message) {
//     console.log(message);
//     // 发送消息给客户端（广播到各个客户端）
//     // 后面加上 utf8Data 编码
//     // 要将所有的链接全部发出去，才可以让每个客户端接收到其他传来的数据
//     for(let i = 0; i < conArr.length; i++) {
//       conArr[i].send(message.utf8Data)
//     }
//   })

//   // 客户端断开连接，服务器会触发
//   // connection.on('close')
// })
