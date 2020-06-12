const css = require('css');
const EOF = Symbol("EOF"); // means End of file
const layout = require("./layout.js");

let currentToken = null; // 全局变量结构体，记录当前Token
let currentAttribute = null;
let stack = [{type:"document",children:[]}]; // 用来记录树形结构
let currentTextNode = null;

// addCSSRules, 把CSS规则暂存入数组
let rules = [];
function addCssRules(text){
    var ast = css.parse(text);
  //  console.log(JSON.stringify(ast, null, " "));
    rules.push(...ast.stylesheet.rules);
}

function match(element, selector){
    if(!selector || !element.attributes){
        return false;
    }

    if(selector.charAt(0) == "#"){
        var attr = element.attributes.filter(attr => attr.name === "id")[0];
        if(attr && attr.value === selector.replace("#",'')){
            return true;
        }
    } else if(selector.charAt(0) == "."){
        var attr = element.attributes.filter(attr => attr.name === "class")[0];
        if(attr && attr.value === selector.replace(".",'')){
            return true;
        }
    } else {
        if(element.tagName === selector){
            return true;
        }
    }
}

function specificity(selector){
    var p = [0,0,0,0];
    var selectorParts = selector.split(" ");
    for(var part of selectorParts){
        if(part.charAt(0) == "#"){
            p[1] += 1;
        } else if(part.charAt(0) == "."){
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }

    return p;
}

function compare(sp1, sp2){
    if(sp1[0] - sp2[0]){
        return sp1[0] - sp2[0];
    }
    if(sp1[1] - sp2[1]){
        return sp1[1] - sp2[1];
    }
    if(sp1[2] - sp2[2]){
        return sp1[2] - sp2[2];
    }

    return sp1[3] - sp2[3];
}

function computeCSS(element){
    var elements = stack.slice().reverse();
    
    if(!element.computedStyle){
        element.computedStyle = {};
    }

    for(let rule of rules){
        var selectorParts = rule.selectors[0].split(" ").reverse();

        if(!match(element, selectorParts[0])){
            continue;
        }

        let matched = false;

        var j = 1;
        for(var i = 0; i < elements.length; i++){
            if(match(elements[i], selectorParts[j])){
                j++;
            }
        }
        if(j >= selectorParts.length){
            matched = true;
        }
        if(matched){
            // 匹配
            // console.log("Element", element, "matched rule", rule);
            var sp = specificity(rule.selectors[0]);

            var computedStyle = element.computedStyle;
            for(var declaration of rule.declarations){
                if(!computedStyle[declaration.property]){
                    computedStyle[declaration.property] = {};
                }

                if(!computedStyle[declaration.property].specificity){
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                } else if(compare(computedStyle[(declaration.property)].specificity, sp) < 0){
                    for(var k=0; k<4; k++){
                        computedStyle[declaration.property][declaration.value][k] += sp[k];
                    }
                }
            }
            console.log(element.computedStyle);
        }
    }
}

// 发出一个Token结构体
function emit(token){
    let top = stack[stack.length -1]; // 初始化

    if(token.type == "startTag"){
        // 节点
        let element = {
            type:"element",
            children:[],
            attributes:[]
        };

        element.tagName = token.tagName;

        for(let p in token){
            if(p != "type" && p != "tagName"){
                element.attributes.push({
                    name : p,
                    value : token[p]
                });
            }
        }

        computeCSS(element);

        // 添加节点
        top.children.push(element);
        //element.parent = top;

        if(!token.isSelfClosing){
            stack.push(element);
        }

        currentTextNode = null;
    } else if(token.type == "endTag"){
        if(top.tagName != token.tagName){
            throw new Error("Tag start end doesn't match!");
        } else {
            // style标签，执行添加CSS规则操作
            if(top.tagName === "style"){
                addCssRules(top.children[0].content);
            }
            // todo：注意layout 时间点； 实验一下其他时机 layout
            layout(top);
            stack.pop();
        }
        currentTextNode = null;
    } else if(token.type == "text"){
        if(currentTextNode == null){
            currentTextNode = {
                type:"text",
                content:""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

// 状态机逐层解析 ：参照HTML官方文档，已经列出HTML的状态
// 三种情况：进入tagOpen状态； 文件结束；tag内容
function data(c){
    if(c == "<") {
        // 开始标签
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
        emit(currentToken);
        // 标签完结
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}

// 属性内容解析状态
function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    } else if(c == "/" || c == ">" || c == EOF){
        return afterAttributeName(c);
    } else if(c == "="){
        
    } else {
        currentAttribute =  {
            name : "",
            value : ""
        }
        return attributeName(c);
    }
}

function attributeName(c){
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
        return afterAttributeName(c);
    } else if(c == "="){
        return beforeAttributeValue;
    } else if(c == "\u0000"){

    } else if(c == "\"" || c == "'" || c == "<"){

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function afterAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return afterAttributeName;
    } else if(c == "/"){
        return selfClosingStartTag;
    } else if(c == "="){
        return beforeAttributeValue;
    } else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == EOF){

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name : "",
            value : ""
        };
        return attributeName(c);
    }
}

function beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
        return beforeAttributeValue;
    } else if(c == "\""){
        // 双引号属性值
        return doubleQuotedAttributeValue;
    } else if(c == "\'"){
        // 单引号属性值
        return singleQuotedAttributeValue;
    } else if(c == ">"){
        return data;
    } else {
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c){
    if(c == "\""){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c == "\u0000"){

    } else if(c == EOF){

    } else {
        currentAttribute.value += c; // 拼接属性值
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c){
    if(c == "\'"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c == "\u0000"){

    } else if(c == EOF){

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
       // return singleQuotedAttributeValue; // todo try again
    }
}

function afterQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    } else if(c == "/"){
        return selfClosingStartTag;
    } else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == EOF){

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if(c == "/"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == "\u0000"){

    } else if(c == "\"" || c == "'" || c == "<" || c == "=" || c == "`"){

    } else if(c == EOF){

    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

// 自结束状态 三种情况： 标签自结束 ； 文件结束 ； 其他
function selfClosingStartTag(c){
    if(c == ">"){
        // Token结构体设置自关闭属性为TRUE
        currentToken.isSelfClosing = true;
        emit(currentToken);
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

// parser接受HTML文本做为参数，返回一颗DOM树
module.exports.parserHTML = function parserHTML(html){
    // console.log(html); // test 输出收到的 html
    let state = data;
    // 循环html，逐个字符判定当前状态
    for (let c of html){
        state = state(c);
    }
    // 循环结束后设定 End of file
    state = state(EOF);
    // console.log(stack[0]);
    return stack[0];
}
