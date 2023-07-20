/*
 * @Author: Jackie
 * @Date: 2023-07-20 21:23:23
 * @LastEditTime: 2023-07-20 21:26:53
 * @LastEditors: Jackie
 * @Description: ws
 * @FilePath: /server/server3.js
 * @version:
 */
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });
let group = {};
wss.on('connection', function connection(ws) {
  console.log('---------------------');
  ws.on('message', function (msg) {
    const msgobj = JSON.parse(msg);

    if (msgobj.event == 'enter') {
      ws.name = msgobj.name;
      ws.roomid = msgobj.roomid;
      if (typeof group[ws.roomid] === 'undefined') {
        group[ws.roomid] = 1;
      } else {
        group[ws.roomid]++;
      }
    }
    wss.clients.forEach((client) => {
      //判断非自己的客户端
      if (client.readyState === WebSocket.OPEN && client.roomid == ws.roomid) {
        msgobj.name = ws.name;
        msgobj.personnumber = group[ws.roomid];
        client.send(JSON.stringify(msgobj));
      }
    });
  });
  ws.on('close', function (msg) {
    if (ws.name) {
      group[ws.roomid]--;
    }
    msgobj = {};
    wss.clients.forEach((client) => {
      //判断非自己的客户端
      if (client.readyState === WebSocket.OPEN && client.roomid == ws.roomid) {
        msgobj.name = ws.name;
        msgobj.personnumber = group[ws.roomid];
        msgobj.event = 'out';
        client.send(JSON.stringify(msgobj));
      }
    });
  });
});

// 添加鉴权
// npm i jsonwebtoken
// const WebSocket=require('ws');
// const http=require('http');
// const wss=new WebSocket.Server({noServer:true});
// const server=http.createServer();
// const jwt=require('jsonwebtoken');
// const { log } = require('console');
// let group={}
// wss.on('connection',function connection(ws){
//     console.log("---------------------");
//     ws.on('message',function(msg){
//         const msgobj=JSON.parse(msg);
//         if(msgobj.event=='enter'){
//             ws.name=msgobj.name;
//             ws.roomid=msgobj.roomid;
//             if(typeof group[ws.roomid]==='undefined'){
//                 group[ws.roomid]=1;
//             }else{
//                 group[ws.roomid]++;
//             }
//         }
//         //鉴权：
//         if(msgobj.event==="auth"){
//             jwt.verify(msgobj.message,"wzz",(err,decode)=>{
//                 if(err){
//                     console.log("auth error");
//                     return
//                 }else{
//                     console.log(decode);
//                     ws.isAuth=true;
//                     return
//                 }
//             })
//         }
//         if(!ws.isAuth){
//             ws.send(JSON.stringify({
//                 event:"onauth",
//                 message:"please auth again"
//             }))
//         }
//         wss.clients.forEach((client) => {
//             //判断非自己的客户端
//             if (client.readyState === WebSocket.OPEN&&client.roomid==ws.roomid){
//                 msgobj.name=ws.name;
//                 msgobj.personnumber=group[ws.roomid];
//                 client.send(JSON.stringify(msgobj))
//             }
//         })
//     });
//     ws.on('close',function(msg){
//         if(ws.name){
//             group[ws.roomid]--;
//         }
//         msgobj={}
//         wss.clients.forEach((client) => {
//             //判断非自己的客户端
//             if (client.readyState === WebSocket.OPEN&&client.roomid==ws.roomid){
//                 msgobj.name=ws.name;
//                 msgobj.personnumber=group[ws.roomid];
//                 msgobj.event="out";
//                 client.send(JSON.stringify(msgobj))
//             }
//         })
//     })
// })
// server.on('upgrade' , function upgrade( request,socket,head){
//     console.log("request :  "+JSON.stringify(request.headers));
//     // authenticate(request, (err, client) => {
//     //     if (err||!client) {
//     //         socket.destroy();
//     //         return;
//     //     }
//         wss.handleUpgrade( request, socket, head,function done(ws){
//             wss.emit('connection',ws,request);
//         })
//     // })
// })
// server.listen(3000)

// -----

// 可直接传递token：
// const WebSocket=require('ws');
// const ws=new WebSocket('ws://127.0.0.1:3000',{
//     headers:{
//         token:'213'
//     }
// });
// -----
// 心跳检查断线重连
// const WebSocket=require('ws');
// const http=require('http');
// const wss=new WebSocket.Server({noServer:true});
// const server=http.createServer();
// const jwt=require('jsonwebtoken');
// const timeInterval=1000
// let group={}
// wss.on('connection',function connection(ws){
//     ws.isAlive=true;
//     ws.on('message',function(msg){
//         const msgobj=JSON.parse(msg);
//         if(msgobj.event=='enter'){
//             ws.name=msgobj.name;
//             ws.roomid=msgobj.roomid;
//             if(typeof group[ws.roomid]==='undefined'){
//                 group[ws.roomid]=1;
//             }else{
//                 group[ws.roomid]++;
//             }
//         }
//         //鉴权：
//         if(msgobj.event==="auth"){
//             jwt.verify(msgobj.msg,"wzz",(err,decode)=>{
//                 if(err){
//                     console.log("auth error");
//                     ws.send(JSON.stringify({
//                         event:"onauth",
//                         msg:"please auth again"
//                     }))
//                     return
//                 }else{
//                     console.log(decode);
//                     ws.isAuth=true;
//                     return
//                 }
//             })
//             return
//         }
//         if(!ws.isAuth){
//             return
//         }
//         //心跳监测：
//         if(msgobj.event=='heartbeat'&&msgobj.msg=="pong"){
//             ws.isAlive=true
//             return
//         }else{
//             // return
//         }

//         wss.clients.forEach((client) => {
//             //判断非自己的客户端
//             if (client.readyState === WebSocket.OPEN&&client.roomid==ws.roomid){
//                 msgobj.name=ws.name;
//                 msgobj.pnum=group[ws.roomid];
//                 client.send(JSON.stringify(msgobj))
//             }
//         })
//     });
//     ws.on('close',function(msg){
//         if(ws.name){
//             group[ws.roomid]--;
//         }
//         msgobj={}
//         wss.clients.forEach((client) => {
//             //判断非自己的客户端
//             if (client.readyState === WebSocket.OPEN&&client.roomid==ws.roomid){
//                 msgobj.name=ws.name;
//                 msgobj.pnum=group[ws.roomid];
//                 msgobj.event="out";
//                 client.send(JSON.stringify(msgobj))
//             }
//         })
//     })
// })
// server.on('upgrade' , function upgrade( request,socket,head){
//     wss.handleUpgrade( request, socket, head,function done(ws){
//         wss.emit('connection',ws,request);
//     })
// })
// setInterval(() => {
//     wss.clients.forEach((ws) => {
//         if(!ws.isAlive&&ws.roomid){
//             group[ws.roomid]--;
//             delete ws['roomid']
//             return  ws.terminate()
//         }
//         ws.isAlive=false;
//         ws.send(JSON.stringify({
//             event:'heartbeat',
//             pnum:group[ws.roomid],
//             msg:'ping',
//         }))
//     })
// },timeInterval);
// server.listen(3000)
