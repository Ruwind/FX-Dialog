/**
 * 该Dialog兼容AMD模块 requirejs可直接引用
 * @param options
 * @constructor $.Dialog
 * 2017年10月23日20:16:46
 */
/**
 * @note 2017年10月24日14:27:55
 * 还需要配置是否允许高度宽度溢出及处理
 * @note 2017年10月24日15:41:50
 * 设置内容参数可为函数
 */
;(function (factory) {
    if (typeof define === "function" && define.amd) {
        // AMD模式
        define([ "jquery" ], factory);
    } else {
        // 全局模式
        factory(jQuery);
    }
}(function ($) {
    var Dialog = function(options) {
        var settings = {
            width : 500,
            height: 300,
            sizeAuto : false,
            //样式
            skin : "",
            //容器
            container:$(document.body),
            title :"提示",
            scroll : false,
            windowScroll : true,
            //关闭按钮
            close : "关闭",
            content : "",
            //关闭按钮宽度
            closeBtnWidth :50,
            //主体部分内边距
            bodyPadding : 10,
            distance : 0,
            fixed : true,
            animate:false,
            offsetY : 0,
            display : {
                header : true,
                footer : true,
                ok : {
                    show : true,
                    text : "OK"
                },
                cancel : {
                    show : true,
                    text : "Cancel"
                }
            }
        };
        //合并默认参数
        if(options) {
            $.extend(settings.display, options.display || {});
            options.display = settings.display;
            $.extend(settings, options || {});
        }
        //初始化为options中内容
        this.content = $.isFunction(settings.content) ? settings.content(settings) : settings.content;
        //一个弹性值
        var BOTTOM_DISTANCE = settings.distance;
        //引用保存
        var _me = this;
        var $window = $(window), $document = $(document);
        //对话框状态 @未渲染状态
        var status = -1;
        var events = ['render', 'build', 'reBuild', 'beforeShow','show','beforeClose','closed','cancel','ok','destroy'];
        //handler
        //显示前
        this.onBeforeShow =null;
        //显示后
        this.onShow = null;
        //关闭前
        this.onBeforeClose = null;
        //关闭后
        this.onClosed = null;
        //渲染前
        this.onRender = null;
        //已生成
        this.onBuild = null;
        //重新生成
        this.onReBuild = null;
        //销毁
        this.onDestroy = null;
        //取消
        this.onCancel = null;
        //ok
        this.onOk = null;
        //绑定事件
        this.bind = function(type, handler) {
            if(typeof type === "string") {
                if ($.inArray(type, events) !== -1) {
                    type = upfirsrt(type);
                    this['on' + type] = handler;
                }
            } else if(typeof type === "object") {
                for(var item in type) {
                    this.bind(item, type[item]);
                }
            }
            return this;
        }
        //首字母大写
        function upfirsrt(str) {
            var str = str.split("");
            str[0] = str[0].toUpperCase();
            return str.join("");
        }
        //解绑事件
        this.unbind = function(type) {
            //以逗号分隔多个事件同时取消
            if($.isArray(type)) {
                for(var i=0; i<type.length; i++) {
                    this.unbind(type[i]);
                }
                return this;
            }
            if(typeof type == 'string') {
                if(type.indexOf(',') != -1) {
                    var es = type.split(',');
                    for(var i=0; i< es.length; i++) {
                        this.unbind(es[i]);
                    }
                } else {
                    if($.inArray(type, events) !== -1) {
                        type = upfirsrt(type);
                        this['on' + type] = null;
                    }
                }
            }
            return this;
        }
        //对话框
        this.dialog = $('<div class="fl-pop f-confirm fx-dh' + (settings.skin?" "+settings.skin:"") + '">');
        //据options是否渲染Header
        if(settings.display.header) {
            //头部
            this.header = $('<div class="pop-header">');
            //标题
            this.title = $('<span class="pop-title">');
            //关闭按钮
            this.closeBtn = $('<span class="pop-close-btn">');
        } else {
            //隐藏头部
            this.dialog.addClass("no-title");
        }
        //内容主体
        this.body = settings.body && settings.body instanceof jQuery ? settings.body : $('<div class="pop-content">');
        this.body.show();
        //据options是否渲染footer
        if(settings.display.footer) {
            //底部
            this.footer = $('<div class="pop-action">');
            //按钮检测是否渲染
            //内容组装
            if(settings.display.ok.show !== false) {
                //确认按钮
                this.okBtn = $('<a href="javascript:void(0);" class="pop-btn pop-ok-btn"></a>');
                this.okBtn.html(settings.display.ok.text || "OK");
                this.footer.append(this.okBtn)
            }
            if(settings.display.cancel.show !== false) {
                //取消按钮
                this.cancelBtn = $('<a href="javascript:void(0);" class="pop-btn pop-cancel-btn"></a>');
                this.cancelBtn.html(settings.display.cancel.text || 'Cancel');
                this.footer.append(this.cancelBtn);
            }
        } else {
            //隐藏按钮
            if(settings.display.header) {
                //检测是否渲染头部
                this.dialog.removeClass("no-title");
                this.dialog.addClass("no-title_button");
            } else {
                //仅渲染底部
                this.dialog.addClass("no-button");
            }
        }
        //遮罩层
        this.mask = $('<div class="fx-pop-mask fx-dh">');
        //设置配置项参数
        this.set = function(item,val){
            settings[item] = val;
        };
        //设置和获取内容
        this.val = function(content){
            if(content) {
                if($.isFunction(content)){
                    this.content = content();
                }else{
                    this.content = content;
                }
                return ;
            }
            return this.content;
        };
        //关闭对话框
        this.close = function(e) {
            var ret;
            if(status == 1){
                if($.isFunction(this.onBeforeClose)) {
                    ret = this.onBeforeClose(e);
                }
                //不关闭 强制返回false 中断关闭
                if(!(ret || ret === undefined)) {
                    return false;
                }
                this.dialog.add(this.mask).addClass("fx-dh");
                status = 0;
                if($.isFunction(this.onClosed)) {
                    ret = this.onClosed.call(this,e) || false;
                }
            }
            if(!settings.windowScroll) {
                fixWindow(false);
            }
            return this;
        };
        //OK
        var ok = function(e) {
            var ret;
            if($.isFunction(this.onOk)) {
                ret = this.onOk(e);
            } else {
                if($.isFunction(settings.ok)){
                    ret = settings.ok.call(this) || false;
                }
            }
            (ret || ret === undefined) && this.close(e);
        }
        //Cancel
        var cancel = function(e){
            var ret;
            if($.isFunction(this.onCancel)) {
                ret = this.onCancel(e);
            } else {
                if($.isFunction(settings.cancel)){
                    ret = settings.cancel.call(this);
                }
            }
            (ret || ret === undefined) && this.close(e);
        };
        /**
         * 显示对话框
         * @param content  正文 如果不改变内容请填入null|false|...
         * @param callback 显示完成执行，在onShow后响应
         * @param data 传入的参数
         * @returns {boolean}
         */
        this.show = function(content, callback, data){
            //未渲染状态
            if(status == -1){
                //执行渲染
                this.build();
                //初始内容填充
                if(content){
                    //检测content类型
                    var res = "";
                    if($.isFunction(content)) {
                       res = content.call(this,this.content);
                    } else {
                        res = content;
                    }
                    //总设置显示的是content属性值
                    this.val(content);
                    this.body.html(this.val());
                }
                //执行显示
                this.show(content, callback);
            }else if(status == 0){

                if($.isFunction(this.onBeforeShow)) {
                    this.onBeforeShow.call(this);
                }
                //检测是否带即时内容
                if(content){
                    this.val(content);
                    this.body.html(this.val());
                } else if(this.content!="" && this.body.html() == "") {
                    this.body.html(this.content);
                }
                //已渲染但未显示
                this.mask.removeClass("fx-dh");
                //是否显示过渡过程
                if(!settings.animate) {
                    this.dialog.removeClass("fx-dh");
                } else if($.isFunction(settings.animate)) {
                    //实现自定义效果
                    var dh = this.dialog.height();
                    var endTop = ($window.height() - dh)/2 + settings.offsetY;
                    settings.animate.apply(this,[dh, endTop ]);
                } else {
                    var dh = this.dialog.height();
                    var endTop = ($window.height() - dh)/2 + settings.offsetY;
                    this.dialog
                        .css({
                            marginTop:"0px",
                            top: -1 * dh - 10,
                            opacity : 0.4,
                        })
                        .removeClass("fx-dh")
                        .animate({
                            top: endTop,
                            opacity : 1,
                        }, 500);
                }
                if(!settings.windowScroll) {
                    fixWindow(true);
                }
                if($.isFunction(this.onShow)) {
                    this.onShow.call(this);
                }
                callback && callback.call(this,data);
                //已显示状态
                status = 1;
            }else if(status == 1){
                //已显示时不作动作
                return false;
            }
        };
        //标题
        this.setTitle = function (val) {
            this.title && this.title.text(val);
            return this;
        }
        //重置
        var _reset = function(e){
            if($.isFunction(_me.onReBuild)) {
                _me.onReBuild(e);
            }
            _me.dialog.empty();
            _me.header.empty();
            _me.body.empty();
            _me.dialog.remove();
            _me.mask.remove();
        };
        //初始UI
        function _initUI(){
            if(settings.fixed){
                this.dialog.css("position","fixed");
            }
            var dw = settings.width||this.dialog.width();
            var dh = settings.height||this.dialog.height();

            if(!settings.sizeAuto) {
                this.dialog.width(dw);
                this.dialog.height(dh);
            }

            var hh = 0,fh = 0;
            if(settings.display.header) {
                this.title.width(dw - settings.closeBtnWidth);
                hh = this.header.height();
            }
            if(settings.display.footer){
                fh = this.footer.height();
            }
            //处理高度自适应问题
            if(!settings.sizeAuto) {
                settings.bodyPaddingLeft = settings.bodyPadding || parseFloat(this.body.css("paddingLeft"));
                settings.bodyPaddingRight = settings.bodyPadding || parseFloat(this.body.css("paddingRight"));
                settings.bodyPaddingTop = settings.bodyPadding || parseFloat(this.body.css("paddingTop"));
                settings.bodyPaddingBottom = settings.bodyPadding || parseFloat(this.body.css("paddingBottom"));
                this.body.height(dh - hh - fh - settings.bodyPaddingTop - settings.bodyPaddingBottom - BOTTOM_DISTANCE);
                // 此处可由CSS3完成
                this.body.width(dw - settings.bodyPaddingLeft - settings.bodyPaddingRight);
            }
            //是否超出内容显示滚动条
            if(settings.scroll) {
                this.body.css("overflow-y", "auto");
            }
        };
        //生成-事件初始化
        this.build = function(flag){
            //检测是已生成
            if(status!=-1){
                //是否进行强制渲染
                if(flag){
                    _reset();
                    //强制重新渲染
                    _render.call(this,this.content);
                }else{
                    return;
                }
            }else{
                //渲染前
                this.onRender && this.onRender.call(this);
                //执行渲染
                _render.call(this,this.content);
                //已生成
                if($.isFunction(this.onBuild)) {
                    this.onBuild.call(this, {status:1});
                }
            }
            //首次居中
            _center();
            //窗口大小改变事件
            _winChange();
            //状态更新
            status = 0;
            //按钮事件绑定
            settings.display.header && this.closeBtn.bind("click",function(e){_me.close(e);});
            //ok cancel按钮事件绑定
            if(settings.display.footer ) {
                settings.display.ok.show !== false && this.okBtn.bind("click",function(e){ok.call(_me,e);});
                settings.display.cancel.show !== false && this.cancelBtn.bind("click",function(e){cancel.call(_me,e);});
            }
        };
        //执行居中
        this.center = function() {
            _center();
        };
        //销毁
        this.destroy = function () {
            _me.dialog.remove();
            _me.mask.remove();
            $document.off('wheel');
            this.onDestroy && this.onDestroy();
        }
        //处理窗口缩放事件
        function _winChange(){
            var timer = null;
            $window.resize(function(){
                clearTimeout(timer);
                timer = setTimeout(function(){
                    _center();
                },200);
            })
        };
        //居中
        function _center() {
            var winW = $window.width();
            var winH = $window.height();
            var w    = _me.dialog.width();
            var h    = _me.dialog.height();
            //检测宽度各高度是否超出屏幕，防止top或left为负值
            _me.dialog.css({left:winW/2,top:winH/2,marginLeft:(winW>w)?-w/2:(-winW/2)+20,marginTop:(winH>h)?-h/2:(-winH/2)+20});
        }
        //渲染DOM
        function _render(body){
            if(settings.display.header) {
                this.header.append(this.title, this.closeBtn);
                this.title.html(settings.title);
                this.closeBtn.html(settings.close);
                this.dialog.append(this.header);
            }
            body ? this.body.html(body) :0
            this.dialog.append(this.body);
            if(settings.display.footer){
                this.dialog.append(this.footer);
            }
            settings.container.append(this.dialog,this.mask);
            _initUI.call(this);
        };
        //固定window
        function fixWindow(flag) {
            if (flag)
                $(document).on('wheel', function () {
                    return false;
                })
            else
                $document.off('wheel');
        }

    }
    /**
     * 显示一个对话框
     * @param options
     * @param callback
     * @returns {Dialog}
     */
    Dialog.show = function (options,callback,data) {
        var dialog = null;
        if( typeof options == 'string') {
            dialog = new Dialog();
            dialog.show(options, callback,data);
        } else if(typeof options == 'object') {
            dialog = new this(options);
            dialog.show(null, callback,data);
        }
        return dialog;
    }
    /**
     * 只显示一交后销毁
     * @param options
     * @param callback
     * @param data
     * @returns {Dialog}
     */
    Dialog.once = function (options,callback,data) {
        Dialog.show(options,function () {
            callback && callback.call(this, data);
            this.onClosed = function () {
                this.destroy();
            }
        }, data);
        return Dialog;
    }
    /**
     * 从已有dom中渲染出弹窗
     * @param options
     * @returns {Dialog}
     */
    Dialog.create = function (options) {
        var settings = {
            body : options.wrapper,
            sizeAuto : true,
        };
        $.extend(settings, options || {});
        var dialog = new Dialog(settings);

        return dialog;
    }
    /**
     * 创建一个只有主体的弹窗
     * @param options
     * @returns {Dialog}
     */
    Dialog.wrap = function (options) {
        var settings = {
            display : {
                footer : false,
                header : false
            }
        };
        $.extend(settings, options || {});
        var dialog = new Dialog(settings);
        return dialog;
    }

    return $.Dialog = Dialog;
}));