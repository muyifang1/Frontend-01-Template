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
