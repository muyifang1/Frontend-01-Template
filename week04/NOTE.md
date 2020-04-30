# 每周总结可以写在这里
// 20200430
JS 引擎工作原理 事件循环概念

宏任务 ：浏览器读取多个<script>标签，一个<script>就是一个宏任务。
微任务 ：单一的script代码片段就是一个微任务，可以理解为一个<script>。

// 一个宏任务中，只存在一个微任务队列，根据入队时间决定个微任务执行顺序
// 当前宏任务内微任务执行完之后才会执行下个宏任务，是这样吗？
///////////////////////////////////////////////////////
async function afoo(){
    console.log("-2")


    await new Promise(resolve => resolve());
    console.log("-1")
}


new Promise(resolve => (console.log("0"), resolve()))
    .then(()=>(
        console.log("1"),
        new Promise(resolve => resolve())
            .then(() => console.log("1.5")) ));


setTimeout(function(){
    console.log("2");

    new Promise(resolve => resolve()) .then(console.log("3"))


}, 0)
console.log("4");
console.log("5");
afoo();
///////////////////////////////////////////////////////
