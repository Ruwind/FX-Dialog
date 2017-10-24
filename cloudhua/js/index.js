require(['Dialog'], function (Dialog) {
    // var dialog = new Dialog({
    //     title : 'Dialog Tip',
    //     close : 'CLOSE',
    //     skin : 'pop-op-title',
    //     content : '中科云华 - Web前端工程师',
    //     fixed : false,
    //     animate : true,
    //     offsetY : -20,
    // });

    // dialog.onOk = function () {
    //     console.log('ok');
    //     console.log(this);
    // }
    // dialog.onCancel = function () {
    //     console.log('cancel');
    //     console.log(this);
    // }

    // dialog.bind({
    //     render : function () {
    //         console.log('render');
    //     },
    //     build : function () {
    //         console.log('build');
    //     },
    //     reBuild : function () {
    //         console.log('reBuild');
    //     },
    //     show : function () {
    //         console.log('show');
    //     },
    //     beforeShow : function () {
    //         console.log('beforeShow');
    //     },
    //     closed : function () {
    //         console.log('closed');
    //     },
    //     beforeClosed : function () {
    //         console.log('beforeClosed');
    //     },
    //     ok : function () {
    //         console.log('ok');
    //     },
    //     cancel : function () {
    //         console.log('cancel');
    //     },
    //
    // })

    // setTimeout(function () {
    //     dialog.unbind('render,build,rebuild,show,beforeShow,beforeClose,ok,cancel,closed');
    // }, 10000);
    // dialog.onBeforeClose = function () {
    //
    //     //阻止关闭
    //     return true;
    // }
    //直接创建
    // $.Dialog.show('content', function () {
    //    console.log(this.content);
    // });

    $("#showDialog-animate").click(function () {
        $.Dialog.show({
            content: '这个弹窗带有动画过渡, 且显示时滚动被锁定！',
            animate: true,
            skin: 'pop-red',
            windowScroll: false,
            offsetY: -20
        }).bind('closed', function () {
            this.destroy();
        });

    });

    $("#showDialog-default").click(function () {
        $.Dialog.show({
            content: (function () {
                var codes = [
                    '   $.Dialog.show({',
                    '       content : (function () {',
                    '           var codes = [',
                    '               lines...',
                    '           ];',
                    '           return codes.jion(\'\\r\\n\');',
                    '       })(),',
                    '   }).bind(\'closed\', function () {',
                    '       this.destroy();',
                    '   });'
                ];
                return '<pre>' + codes.join('\r\n') + '</pre>';
            })(),
        }).bind('closed', function () {
            this.destroy();
        });
    });

    $("#showDialog-skin").click(function () {
        $.Dialog.show({
            content: '这个弹窗更改了默认样式',
            skin: 'pop-green'
        }).bind('closed', function () {
            console.log('关闭弹窗');
            this.destroy();
        });
    });

    $("#showDialog-no-footer").click(function () {
        $.Dialog.once({
            content: '这个弹窗没有footer',
            skin: 'pop-green',
            display: {
                footer: false
            }
        }, function (title) {
            this.setTitle(title);
        }, '华为高科');

    });
    var dialogFromDom = null;
    $("#showDialog-from-dom").click(function () {
        if(!dialogFromDom) {
            dialogFromDom = $.Dialog.create({
                wrapper: $('#popup'),
                width: 800,
                height: 400,
            })
        }
        dialogFromDom.show();
    });

    var dialogx = null;
    $("#showDialog-custom-anim").click(function () {
        if (!dialogx) {
            dialogx = $.Dialog.show({
                content: '这个弹窗自定义过渡效果',
                skin: 'pop-green',
                display: {
                    footer: false
                },
                offsetY: -40,
                animate: function (dh, enTop) {
                    this.dialog
                        .css({
                            height: 0,
                        })
                        .removeClass('fx-dh')
                        .animate({
                            height: dh,
                        }, 500);

                }
            });
        } else {
            dialogx.show(null);
        }
    });

    $("#showDialog-just-body").click(function () {
        $.Dialog.wrap({
            sizeAuto: true,
        })
            .bind('render', function () {
                var me = this;
                this.mask.bind('click', function (e) {
                    me.close(e);
                });
            })
            .bind('closed', function () {
                this.destroy();
            })
            .show(function (lastContent) {
                var arr = [
                    '<pre>Hello, this is a dialog without both header and </pre>',
                    '<pre>footer, here you can click the mask to close it!</pre>'
                ];
                return arr.join('');
            });
    })

});