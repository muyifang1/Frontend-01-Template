// require("./foo.js");
// import "./foo";

// 这是组建体系对外的接口，方法名与webpack.config.js中pragma属性设置相同
function createElement(Cls, attributes, ...children){
    let o = new Cls({
        timer:{}
    });

    for(let name in attributes){
        // o[name] = attributes[name];
        o.setAttribute(name, attributes[name]);
    }

    console.log(children);

    for(let child of children){
        o.children.push(child);
    }

    return o;
}

class Parent{
    constructor(config){
       // console.log("config",config);
       this.children = [];
    }

    set class(v){ // property
        console.log("Parent::class",v);
    }

    setAttribute(name, value){
        console.log(name,value);
    }
/*
    appendChild(child){
        console.log("Parent::appendChild",child);
    }
*/
}
class Child{

}

let component = <Parent id="a" class="b">
        <Child></Child>
        <Child></Child>
        <Child></Child>
    </Parent>
console.log(component);
component.class = "c";
// component.setAttribute("id","a");