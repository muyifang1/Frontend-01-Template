const net = require("net");

class Request{
  // method, url = host + port + path
  // body: k/v
  // headers
  constructor(options){
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};

    if(!this.headers["Content-Type"]){
        this.headers["Content-Type"] = "application/x-www-form-urlencoded"
    }

    if(this.headers["Content-Type"] === "application/json"){
        this.bodyText = JSON.stringify(this.body);
    }else if(this.headers["Content-Type"] === "application/x-www-form-urlencoded"){
        this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        // 计算Content-Length
        this.headers["Content-Length"] = this.bodyText.length;
    }
  }

  toString(){
      return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
  }

  send(connection){

      return new Promise((resolve, reject) => {
          if(connection){
              connection.write(this.toString());
          } else {
              connection = net.createConnection({
                  host: this.host,
                  port: this.port
              }, () => {
                        connection.write(this.toString());
              })
          }
          // 可能会多个data
          connection.on('data', (data) => {
            resolve(data.toString());
            connection.end();
          });
          connection.on('error', (err) => {
            reject(err);
            connection.end();
          });
      });

    }
}

class Response{

}
// todo need work continue 01:30:04
class ResponseParser{
    constructor() {
        this.WATTING_STATUS_LINE = 0;
        this.WATTING_STATUS_LINE_END = 1;
        this.WATTING_HEAD_NAME = 2;
        this.WATTING_HEAD_SPACE = 3;
        this.WATTING_HEAD_VALUE = 4;
        this.WATTING_HEAD_LINE_END = 5;
        this.WATTING_HEAD_BLOCK_END = 6;
        this.WATTING_BODY = 7;

        this.current = this.this.WATTING_STATUS_LINE;
        this.statusLine = '';
        this.headers = {};
        this.headerName = '';
        this.headerValue = '';
        this.bodyParser = null;
    }

    get isFinished() {
        return this.bodyParser && this.bodyParser.isFinished;
    }

    get response() {
        //  用正则匹配
        this.statusLine.match(/HTTP\/1.1 ([0-9]+)([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }

    receive(string) {
        for (let i = 0; i < string.length; i++) {
            // 逐步解析直到结束
            if (!this.isFinished){
                // 根据每一个Char 解析
                this.receiveChar(string.charAt(i));
            }
        }
    }
    // 具体解析方法
    receiveChar(char) {
// todo need work continue
    }
}

// api 调用形式
void async function(){
    let request = new Request({
        method:"POST",
        host:"127.0.0.1",
        port:"8088",
        path:"/",
        headers: {
          ["X-Foo2"]:"customed"
        },
        body:{
            name:"yangqi"
        }
    });

    let response = await request.send();
    console.log(response);
}();

/*
const client = net.createConnection({
  host:"127.0.0.1",
  port: 8088 }, () => {
  // 'connect' listener.
  console.log('connected to server!');

  let request = new Request({
      method:"POST",
      host:"127.0.0.1",
      port:"8088",
      path:"/",
      headers: {
        ["X-Foo2"]:"customed"
      },
      body:{
          name:"yangqi"
      }
  })

  console.log(request.toString());
  client.write(request.toString());

  // 模拟post请求
//  client.write('POST /HTTP/1.1\r\n');
//  client.write('Content-Type: application/x-www-form-urlencoded\r\n');
//  client.write('Content-Length: 11\r\n');
//  client.write('\r\n');
//  client.write('name=yangqi');

//  client.write("POST /HTTP/1.1\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: 11\r\n\r\nname=winter");
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
*/
