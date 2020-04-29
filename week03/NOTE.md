# 每周总结可以写在这里

for (var i =0;i<10;i++){
  var button = document.createElement("button");
  document.body.appendChild(button);
  button.innerHTML = i;
  button.onclick = function(){
    console.log(i);
  }
}

为了解决 i 作用域问题通常

for (var i =0;i<10;i++){
  var button = document.createElement("button");
  document.body.appendChild(button);
  button.innerHTML = i;
  (function(i){
    button.onclick = function(){
      console.log(i);
    }
  })(i);
}

但是Winter 建议 使用void 来修饰 function 替代()

for (var i =0;i<10;i++){
  var button = document.createElement("button");
  document.body.appendChild(button);
  button.innerHTML = i;
  void function(i){
    button.onclick = function(){
      console.log(i);
    }
  }(i);
}


============================ 2020.04.25================================

for in

for of 对应 Iterator 机制 Generator/Array

for (let p of [1,2,3]){
  console.log(p)
}

for (let q of g()){
  console.log{g}
}

function *g(){
  yield 0;
  yield 1;
  yield 4;
}

============================ 2020.04.28================================
作业：
JavaScript 标准里所有的对象，分析有哪些对象是我们无法实现出来的，这些对象都有哪些特性？

JavaScript 对象
  Array 数组对象，数组下标无法指定。
    new Array(); // 默认 length = 0
    new Array(size);
    new Array(element0, element1, ..., elementn);

  Boolean
    new Boolean(value);
    当作为一个构造函数（带有运算符 new）调用时，Boolean() 将把它的参数转换成一个布尔值，并且返回一个包含该值的 Boolean 对象。
    Boolean(value);
    如果作为一个函数（不带有运算符 new）调用时，Boolean() 只将把它的参数转换成一个原始的布尔值，并且返回这个值。

  Date
      new Date()
      Date 对象会自动把当前日期和时间保存为其初始值。
  Math
      提供数学操作。
  Number
      提供数字对象。
      new Number(value);
      Number(value);
  String
  RegExp
      new RegExp(pattern, attributes);
  Global
    全局对象
    全局对象是预定义的对象，作为 JavaScript 的全局函数和全局属性的占位符。通过使用全局对象，可以访问所有其他所有预定义的对象、函数和属性。全局对象不是任何对象的属性，所以它没有名称。
    在顶层 JavaScript 代码中，可以用关键字 this 引用全局对象。但通常不必用这种方式引用全局对象，因为全局对象是作用域链的头，这意味着所有非限定性的变量和函数名都会作为该对象的属性来查询。例如，当JavaScript 代码引用 parseInt() 函数时，它引用的是全局对象的 parseInt 属性。全局对象是作用域链的头，还意味着在顶层 JavaScript 代码中声明的所有变量都将成为全局对象的属性。
    全局对象只是一个对象，而不是类。既没有构造函数，也无法实例化一个新的全局对象。
    提供全局函数：
      decodeURI()
      decodeURIComponent()
      encodeURI()
      encodeURIComponent()
      escape()
      eval()
      getClass()
      isFinite()
      isNaN()
      Number()
      parseInt()
      parseFloat()
      String()
      unescape()
