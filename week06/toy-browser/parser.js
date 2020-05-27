// needs work continue \html-parse\5-attribute
let currentToken = null; // 全局变量结构体，记录当前Token
let currentAttribute = null;

// 发出一个Token结构体
function emit(token){
    if(token.type != "text"){
        console.log(token);
    }
}

const EOF = Symbol("EOF"); // means End of file

// 状态机逐层解析
// 三种情况：进入tagOpen状态； 文件结束；tag内容
function data(c){
    if(c == "<") {
        return tagOpen;
    } else if(c == EOF) {
        emit({
            type:"EOF"
        });
        return ;
    } else {
        emit({
            type:"text",
            content:c
        });
        return data;
    }
}

// 标签体内 分三种情况：endTagOpen状态; 标签名状态 ；其他情况
function tagOpen(c){
    if(c == "/"){
        return endTagOpen;
    } else if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type:"startTag",
            tagName:""
        }
        return tagName(c);
    } else {
        emit({
            type:"text",
            content:c
        });
        return ;
    }
}

// 标签内容 四种情况：属性内容解析状态；标签自结束状态；标签名；标签完结
function tagName(c) {
    if(c.match(/^[\t\n\f ]$/)){
        // 正则匹配出当前是 属性名部分
        return beforeAttributeName;
    } else if(c == "/"){
        // 标签自结束
        return selfClosingStartTag;
    } else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName += c; // 拼接Token中tagName属性
        return tagName;
    } else if(c == ">"){
        // 标签完结
        return data;
    } else {
        return tagName;
    }
}

// 属性内容解析状态
function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    } else if(c == ">"){
        return data;
    } else if(c == "="){
        return beforeAttributeName;
    } else {
        return beforeAttributeName;
    }
}

// 自结束状态 三种情况： 标签自结束 ； 文件结束 ； 其他
function selfClosingStartTag(c){
    if(c == ">"){
        // Token结构体设置自关闭属性为TRUE
        currentToken.isSelfClosing = true;
        return data;
    } else if(c == "EOF"){

    } else {

    }
}

// 标签结束 四种情况： 标签结束开始进入解析标签名状态； 标签结束； EOF文件结束； 其他情况
function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        // Token结构体创建
        currentToken = {
            type : "endTag",
            tagName : ""
        }
        return tagName(c);
    } else if(c == ">"){

    } else if(c == EOF) {

    } else {

    }
}

module.exports.parserHTML = function parserHTML(html){
    // console.log(html); // test 输出收到的 html
    let state = data;
    // 循环html，逐个字符判定当前状态
    for (let c of html){
        state = state(c);
    }
    // 循环结束后设定 End of file
    state = state(EOF);
}