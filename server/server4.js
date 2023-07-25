/*
 * @Author: Jackie
 * @Date: 2023-07-25 16:51:36
 * @LastEditTime: 2023-07-25 16:59:42
 * @LastEditors: Jackie
 * @Description: socket.io 🙅不行
 * @FilePath: /server/server4.js
 * @version:
 */
const express = require('express');
const app = express();
// 在express应用上集成即时通信
const server = app.listen(5500);

// 1. 引入socket.io, 传入服务器对象, 让socket.io注入到web网页服务里
const io = require('socket.io')(server);
// 2. 监听浏览器端的连接事件 (是socket的连接, 而非地址的访问)
io.on('connect', (WebSocketObj) => {
  // connect是固定的, 叫连接的事件
  //1接收前端url传递过来的房间id
  let {
    query: { roomid }
  } = WebSocketObj.handshake;
  console.log(WebSocketObj.handshake['query']);
  // query: { roomid: '1111', EIO: '3', transport: 'polling', t: 'N9LoXzC' }
  WebSocketObj.join(roomid, () => {
    //2加入指定房间
    WebSocketObj.emit('send_to_client', `恭喜加入 ${roomid} 房间成功！`);
  });

  WebSocketObj.on('news', (data) => {
    //3监听前端发送消息, 前端需要传递roomId过来, 要广播给这个房间内所有的人
    console.log(data);
    io.to(data['roomid']).emit('client_message', {
      // io.to()里传入的是房间号, 代表只给这个房间号里的浏览器连接对象, 触发client_message事件
      nickName: data['userName'],
      message: data['msg']
    });
  });
});
