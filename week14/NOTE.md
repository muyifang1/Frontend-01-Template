# 每周总结可以写在这里

webpack 可以把多个js组合压缩打包，最终放在dist文件夹下
    - 可以通过设置 mode:development 和 minimize 参数来改变打包结果是否可读。
@babel/plugin-transform-react-jsx 翻译jsx

jsx - 如果用小写则认为是字符串 <div>
    - 如果是大写则认为是类或者方法
    - jsx 中构建父子结构树树的顺序是 先子后父