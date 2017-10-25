
Dialog 是一个基于jQuery的对话框组件，简单易用

 + 多种方式创建
 + 组件化兼容AMD
 + 强化弹窗功能
 + 更灵活的定制样式
 + 多种事件绑定

 > Dialog是基于jQuery的对话框组件,使用RequireJS可直接引用 
 > 若使用<script>手动引入时，需要手动载入jquery.js 和 fx-dialog.css文件 


cloudhua  				     -测试目录
├─css           		    样式文件
│  ├─common             公共样式目录
│  ├─default            默认主题样式目录
│  └─...                其他主题样式目录
│
├─images                图片资源目录
│
├─js                    脚本文件
│  ├─app                当前应用所需要模块目录
│  ├─build              打包输出目录
│  │  ├─app.js          生成的打包文件
│  │  └─...             其他打包文件
│  │
│  ├─lib     
│  │  ├─jquery          存放jquery库
│  │  ├─wind            常用自定义组件
│  │  │  ├─Dialog.js    -Dialog组件
│  │  │  └─...          
│  │  └─...             其他组件库
│  │  
│  ├─static           	存放js依赖资源文件
│  │  ├─images          依赖图片资源
│  │  ├─style           依赖样式资源
│  │  │  ├─wind         自定义库wind的样式目录
│  │  │  │ 	├─fx-dialog.css	 -Dialog组件依赖样式表
│  │  │  │ 	└─...
│  │  │  └─...          其他组件库样式资源
│  │  │  
│  │  ├─build.js        打包主配置文件
│  │  ├─r.js            打包工具
│  │  └─...             其他资源
│  │  
│  ├─index.js        	入口文件(source)
│  └─require.config.js  框架入口文件
│
├─index.html            测试题 1 css兼容布局 html文件
├─dialog.html           测试题 2 Dialog组件入口 html入口文件
├─package.json          包描述文件
└─README.md             README文件

> dialog详细介绍与使用在dialog.html中
