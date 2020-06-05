# 每周总结可以写在这里

需要预习内容
《CSS 选择器：如何选中 svg 里的 a 元素？》
《CSS 选择器：伪元素是怎么回事儿？》
选择器语法
	*	所有元素
type selector:	div svg|a 	svg 是namespace
class selector:	.cls 	
	#id		id必须完全匹配
	[attr=value]	属性选择器，属性可以用空格分隔
	:hover		伪类选择器
	::before	伪元素选择器
	
复合选择器
<简单选择器><简单选择器><简单选择器>  &&的关系，必须同时match每个简单选择器
注意：复合选择器 *或者 div(type selector) 必须写在最前面；伪类和伪元素选择器必须写在最后面。

复杂选择器
<复合选择器><sp(空格表示子孙关系)><复合选择器>  例如： div .cls 表示选中所有是div子孙含有class的元素
<复合选择器>">"<复合选择器> 子选择器,只能选择子一级 例如：div>p 表示选择父元素为 <div> 元素的所有 <p> 元素。
<复合选择器>"~"<复合选择器>  例如：p~ul	表示选择前面有 <p> 元素的每个 <ul> 元素。
<复合选择器>"+"<复合选择器>	 例如：div+p 表示选择紧接在 <div> 元素之后的所有 <p> 元素。
<复合选择器>"||"<复合选择器> 表示table里选中一列

选择器列表： 以逗号分隔的多个选择器

选择器优先级：四级 ？ 需要补充 // todo
简单选择器计数 方式 // todo 需要补充

作业用一个包分析选择器
作业写出下面选择器的优先级
div#a.b .c[id=x]
#a:not(#b)
*.a
div.a

作业：编写一个match函数
function match(selector, element){
	return true;
}

match("div #id.class", document.getElementById("id"));

//////////////////////////////////////////////////////
CSS 排版
盒Box 概念领悟
源代码	标签	Tag
语义	元素	Element
表现	盒		Box

1.HTML代码中可以书写开始标签，结束标签，和自封闭标签。
2.一对起止标签，表示一个元素。
3.DOM树中存储的是元素和其他类型的节点(Node).
4.CSS选择器选中的是元素，在排版时可能产生多个盒。
5.排版和渲染的基本单位是盒。

盒模型分为四层，由外至内：
margin 留白
	boder 边框 border-box:width
		padding 边距
			content 内容 content-box:width

正常流 normal flow
收集盒进行
计算盒在行中的排布
计算行的排布

注意：一个linebox如果内容为空基线在底部。解决方法内容配合 vertical-align:bottom属性或者vertical-align:top属性解决空内容基线不同的问题。
行模型 以最高元素的height处理。

float与clear