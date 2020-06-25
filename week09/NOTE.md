# 每周总结可以写在这里

Animation
@keyframes mykf{
	form {background:red;}
	to {background:yellow;}
}

div{
	animation:mykf 5s infinite;
}

animation-name 时间曲线
animation-duration 动画时长
animation-timing-function 动画的时间曲线
animation-delay 动画开始前的延迟
animation-iteration-count 动画的播放次数
animation-

@keyframes mykf{
	0%{top:0;transition:top ease}
	50%{top:30px;transition:top ease-in}
	75%{top:10px;transition:top ease-out}
	100%{top:0;transition:top linear}
}

了解贝塞尔曲线
https://cubic-bezier.com/
cubic-bezier(.75,.07,.46,1)

CSS颜色

作业：
blank html 其中body 中css属性脑图完成。