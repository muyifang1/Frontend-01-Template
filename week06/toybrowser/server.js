const http = require('http');
const server = http.createServer((req, res) => {
  console.log('request received');
  console.log(req.headers);
  res.setHeader('Content-type', 'text/plain');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-type': 'text/plain' });
  // 测试，服务器返回一个 html页面，画面显示一个红色矩形
  res.end(`<html test=redrec >
<head>
    <style>
body div #myid{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
.img-test {
	height: 60px;
	width: 60px;
}
    </style>
</head>
<body>
    <div>
        <img id="myid"/>
        <img class="img-test"/>
    </div>
</body>
</html>
  `);
});

server.listen(8088);
