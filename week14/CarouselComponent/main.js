// require("./foo.js");
// import "./foo";
import { createElement, Text, Wrapper } from "./createElement";

class Carousel {
    constructor(config) {
        // console.log("config",config);
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
    }

    setAttribute(name, value) {
        // console.log(name, value);
        // this.attributes.set(name, value);
        this[name] = value;
    }

    appendChild(child) {
        // console.log("Parent::appendChild", child);
        this.children.push(child);
    }

    render() {

        let children = this.data.map(url => {
            let element = <img src={url} />;
            element.addEventListener("dragstart", event => event.preventDefault());
            return element;
        });

        let root = <div class="carousel">
            {children}
        </div>

        let position = 0;
        let nextPic = () => {
            // 轮播位移循环小技巧
            let nextPosition = (position + 1) % this.data.length;

            let current = children[position];
            let next = children[nextPosition];

            current.style.transition = "ease 0s";
            next.style.transition = "ease 0s";
            // 起始位置
            current.style.transform = `translateX(${-100 * position}%)`;
            next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

            setTimeout(function () {
                current.style.transition = ""; // ="" means use css rule
                next.style.transition = "";
                // 终止位置
                current.style.transform = `translateX(${-100 - 100 * position}%)`
                next.style.transform = `translateX(${-100 * nextPosition}%)`

                position = nextPosition;
            }, 16); // 两段动画用16毫秒setTimeout隔开，原因16毫秒约等于1帧

            setTimeout(nextPic, 3000); // 第一张图片停留3秒
        }
        setTimeout(nextPic, 3000);

        return root;
    }

    mountTo(parent) {
        this.render().mountTo(parent);
    }

}

let component = <Carousel data={[
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg"
]} />
console.log(component);
//component.class = "c";
component.mountTo(document.body);
// component.setAttribute("id","a");