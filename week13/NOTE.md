# 每周总结可以写在这里

Attribute vs Property
    - Attribute:
        <my-component attribute="v"/>
        myComponent.getAttribute("a");
        myComponent.setAttribute("a","value");

    - Property:
        myComponent.a = "value";

组件生命周期
    Created -> mount ->mount -> unmount     -> destoryed
            -> JS change/set -> render/update 
            -> User Input
            
作业设计淘宝轮播组件----描述一个组件的需求，不论什么框架创建一个组件前先考虑这个问题！
Carousel
    - state     
        activeIndex
    - property
        loop time imglist autoplay color forward
    - attribute
        startIndex loop time imglist autoplay colcor forward
    - children
        2
        append remove add
    - event
        change click hover swipe resize
    - method
        next() prev() goto()
        play() stop()
    - config
        mode: "useRAF","useTimeout"
CarouseView