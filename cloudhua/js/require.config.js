requirejs.config({
    baseUrl :'./js/app',
    paths : {
        jquery   : '../lib/jquery/jquery-1.7.2',
        css      : '../lib/css/css',
        'css-builder':"../lib/css/css-builder",
        normalize : "../lib/css/normalize",
        Dialog : '../lib/wind/Dialog',
    },
    shim : {
        Dialog : {deps : ['jquery', 'css!../static/res/style/wind/fx-dialog.css']},
    }
});
