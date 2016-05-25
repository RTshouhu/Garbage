function Do(method, vals, showAffirm) {
    if (showAffirm && !confirm(showAffirm)) return false;
    $.blockUI({ message: '<h3>操作中...</h3>', showOverlay: false, border: 'none' });
    $.post($("#myaction").val() + "Do", { method: method, vals: vals }, function (data) {
        $.unblockUI();
        GoToPage(this, 'data', pageCallback);
    });
    return false;
}
function DoAndShow(ctr, pName, id, vals, isSubmit) {
    $('#DoAndShow').css("top", $(ctr).offset().top + 0);
    $('#DoAndShow').css("left", $(ctr).offset().left - 355);
    $("#DoAndShow").show();
    $("#DoAndShow").load(pName + "?id=" + id + "&isSubmit=" + isSubmit + "&vals=" + vals);
    return false;
}
function myWebShow(ctr, url, subName) {
    $('#WebShow').css("top", $(ctr).offset().top + 0);
    $('#WebShow').css("left", $(ctr).offset().left - 555);
    $("#WebShow").show();
    $("#WebShowSub").load("LoadUrl?url=" + url + "&dd=" + Math.random() + " " + subName, function () {

    });
    return false;
}
function CheckAll(ctr, name) {
    if ($(ctr).attr('checked'))
        $("input[name=" + name + "]").attr('checked', true);
    else
        $("input[name=" + name + "]").attr('checked', false);
}
function GetCheckVales(name) {
    var values = '';
    $("input[name=" + name + "]").each(function (i, ctr) {
        if ($(ctr).attr('checked')) values += ',' + $(ctr).val();
    });
    return values;
}
function pageCallback() {
    $("a.iframe").each(function () {
        if (this.parentNode.tagName == "TD") {
            $(this).click(function () {
                $(this).parent().parent().addClass("checkRow");
            });
        }
    });
    $(".easyui-linkbutton").linkbutton();
}
function HightLight(hlType, ctrCssName) {
    if (hlType == 1) {
        var language = "";
        if (ctrCssName == "cs") language = "c";
        if (ctrCssName == "sql") language = "sql";
        if (ctrCssName == "htm") language = "html";
        if ($("textarea." + ctrCssName)) {
            $("textarea." + ctrCssName).each(function () {
                editAreaLoader.init({
                    id: this.id
            , start_highlight: true
            , toolbar: "search, go_to_line, |, undo, redo,|, help"
            , allow_resize: "both"
            , allow_toggle: false //显示不应用edit_area按钮
            , language: "zh"
            , syntax: language
            , show_line_colors: true//当前行也语法着色
            , min_height: 750
            , lineWrapping: true //是否自动换行
                });
            });
        }
    }
    else if (hlType == 2) {
        var language = "";
        if (ctrCssName == "cs") language = "text/x-java";
        if (ctrCssName == "sql") language = "text/x-plsql";
        if (ctrCssName == "htm") language = "text/html";
        if ($("textarea." + ctrCssName)) {
            $("textarea." + ctrCssName).each(function () {
                var editor = CodeMirror.fromTextArea(this, {
                    lineNumbers: true
                    , matchBrackets: true
                    , indentUnit: 4
                    , mode: language
                    , textWrapping: true
                    , height: '100%'
                    , lineWrapping: true //是否自动换行
                });
            });
        }
    }
}
$(function () {
    //日期控件
    $(".Wdate").each(function () {
        if (this.id.substr(this.id.length - 1, 1) == "<") {
            $(this).click(function () {
                WdatePicker({
                    skin: 'whyGreen'
                    , minDate: '#F{$dp.$D(\'' + this.id.substr(0, this.id.length - 1) + '>\')}'
                });
            });
        } else {
            $(this).click(function () { WdatePicker({ skin: 'whyGreen' }); });
        }
    });
    //选择行
    $("a.iframe").each(function () {
        if (this.parentNode.tagName == "TD") {
            $(this).click(function () {
                $(this).parent().parent().addClass("checkRow");
            });
        }
    });
    //弹出框
    /*$("a.iframe").fancybox({
        modal: false,
        //parent: "form:first",
        helpers: {
            title: { type: 'outside' },
            overlay: { closeClick: true, locked: false, showEarly: false }
        },
        type: 'iframe',
        afterShow: function () { },
        beforeClose: function () { GoToPage($(".PageNumHome"), 'data', pageCallback); }
    });*/
});
