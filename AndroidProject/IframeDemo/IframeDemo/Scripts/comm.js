/*添加Form*/
function addForm() {
    $("#editForm").resetForm();
    $('#divEdit').dialog({
        title: '新增',
        modal: true,
        collapsible: false,
        resizable: true
    });
}
/*编辑Form*/
function editForm() {
    var rows = $('#tbGrid').datagrid('getSelections');
    if (rows.length == 0) {
        $.messager.alert("提示", "请选择要编辑的行！", "info");
        return;
    }
    if (rows.length > 1) {
        $.messager.alert("提示", "编辑只能选择一行！", "info");
        return;
    }
    $('#editForm').form('load', rows[0]);
    $('#divEdit').dialog({
        title: '编辑',
        modal: true,
        collapsible: false,
        resizable: true
    });
}

/*发布Form*/
function ReleaseForm() {
    var rows = $('#tbGrid').datagrid('getSelections');
    if (rows.length == 0) {
        $.messager.alert("提示", "请选择要编辑的行！", "info");
        return;
    }
    if (rows.length > 1) {
        $.messager.alert("提示", "编辑只能选择一行！", "info");
        return;
    }
    $('#releaseForm').form('load', rows[0]);
    $('#divRelease').dialog({
        title: '发布',
        modal: true,
        collapsible: false,
        resizable: true
    });
}

function submitForm(formId, divId, callBack) {
    var fId = formId || "editForm";
    if (callBack)
        callBack();
    $("#" + fId).form('submit', {
        success: function (data) {
            if (data > 0) {
                var id = $("#" + fId).find("input[name=" + _IdField + "]").val();
                console.log('fId=' + fId);
                console.log('_IdField=' + _IdField);
                console.log('id=' + id);
                clearForm(fId);
                closeForm(divId);
                if (id > 0) {
                    $.messager.show({ title: '提 示', msg: '数据更新成功！', showType: 'slide' });
                    $('#tbGrid').datagrid('reload');
                    $('#tbGrid').datagrid('clearSelections');//清除上一次操作的选中行，避免选中多行导致无法编辑
                }
                else {
                    $.messager.show({ title: '提 示', msg: '数据添加成功！', showType: 'slide' });
                    $('#tbGrid').datagrid('load');
                    $('#tbGrid').datagrid('clearSelections');//清除上一次操作的选中行，避免选中多行导致无法编辑
                }
                
            }
            else if (data == 0) {
                $.messager.alert("错误", "数据更新失败，请稍后重试！", "error");
            } else {
                $.messager.alert("错误", data, "error");
            }
        }
    });
}

/*表单提交*/
function submitGridForm(formId, divId, gridId, checkMsg, callBack) {
    var gid = gridId || "tbGrid";
    var fId = formId || "editForm";
    if (callBack)
        callBack();
    $("#" + fId).form('submit', {
        success: function (data) {
            if (data > 0) {
                var id = $("#" + fId).find("input[name=" + _IdField + "]").val();
                clearForm(fId);
                closeForm(divId);
                if (id > 0) {
                    $.messager.show({ title: '提 示', msg: '数据更新成功！', showType: 'slide' });
                    $("#" + gid).datagrid('reload');
                    $("#" + gid).datagrid('clearSelections');//清除上一次操作的选中行，避免选中多行导致无法编辑
                }
                else {
                    $.messager.show({ title: '提 示', msg: '数据添加成功！', showType: 'slide' });
                    $("#" + gid).datagrid('load');
                    $("#" + gid).datagrid('clearSelections');//清除上一次操作的选中行，避免选中多行导致无法编辑
                }

            }
            else if (data == 0) {
                $.messager.alert("错误", "数据更新失败，请稍后重试！", "error");
            }
            else if (data === "-2") {
                $.messager.alert("提 示", "提交失败：" + checkMsg, "info");
            }
            else {
                $.messager.alert("错误", data, "error");
            }
        }
    });
}

function submitFn(checkMsg) {
    $('#editForm').form('submit', {
        success: function (data) {
            if (data > 0) {
                var id = $("#editForm").find("input[name=" + _IdField + "]").val();
                closeForm();
                if (id > 0) {
                    $.messager.show({ title: '提 示', msg: '数据更新成功！', showType: 'slide' });
                    $('#tbGrid').datagrid('reload');
                    $('#tbGrid').datagrid('clearSelections');//清除上一次操作的选中行，避免选中多行导致无法编辑
                }
                else {
                    $.messager.show({ title: '提 示', msg: '数据添加成功！', showType: 'slide' });
                    $('#tbGrid').datagrid('load');
                    $('#tbGrid').datagrid('clearSelections');//清除上一次操作的选中行，避免选中多行导致无法编辑
                }
            }
            else if (data === "-2") {
                $.messager.alert("提 示", "提交失败：" + checkMsg, "info");
            }
            else {
                $.messager.alert("错误", data, "error");
            }
        }
    });
}

function clearForm(frmId) {
    var id = frmId || "editForm";
    $('#' + id).form('clear');
}
function closeForm(divId) {
    var id = divId || "divEdit";
    $('#' + id).dialog('close');
}
function closeIframe() {
    parent.closeForm();
}
/*搜索*/
function searchGrid() {
    $('#tbGrid').datagrid('load', serializObject("formsearch"));
    $('#tbGrid').datagrid('clearSelections');//清除上一次操作的选中行，避免选中多行导致无法编辑
}
/*重置*/
function resetsForm() {
    $("#formsearch").form("clear");
    $("#formsearch [type=text]").val("");
    $("#formsearch select").prop('selectedIndex', 0);
    $("#formsearch [type=checkbox]").attr("checked", "");
    $('#formsearch').find('.combo-value[type="hidden"]').val("");
}
/*删除数据*/
function delAjax(url, id, dataGridId) {
    var rows = $('#tbGrid').datagrid('getSelections');
    if (rows.length == 0) {
        $.messager.alert("提示", "请选择要删除的行！", "info");
        return;
    }
    var idList = "";
    if (dataGridId) {
        idList = getGridSelect(dataGridId, id);
    }
    else {
        idList = getGridSelect("tbGrid", id);
    }
    if (url.indexOf("?") > 0) {
        url += "&id=" + idList;
    }
    else {
        url += "?id=" + idList;
    }
    $.messager.confirm("确 认", "您确定要删除吗？", function (r) {
        if (!r) return;
        var html = $.ajax({
            url: url,
            async: false
        }).responseText;
        if (html > 0) {
            if (dataGridId) {
                $('#' + dataGridId + '').datagrid('clearSelections');
                $('#' + dataGridId + '').datagrid('reload');
            }
            else {
                $('#tbGrid').datagrid('clearSelections');
                $('#tbGrid').datagrid('reload');
            }
            $.messager.show({ title: '提 示', msg: '您已成功删除' + html + '条数据！', showType: 'slide' });
        }
        else if (html == 0) {
            $.messager.show({ title: '提 示', msg: '删除数据失败，请稍后重试！', showType: 'slide' });
        }
        else { window.$.messager.alert('提 示', html, 'warning'); }
    });
}

/*删除数据*/
function setStatusAjax(operate, url, id) {
    var rows = $('#tbGrid').datagrid('getSelections');
    if (rows.length == 0) {
        $.messager.alert("提示", "请选择要" + operate + "的行！", "info");
        return;
    }
    url += "&id=" + getGridSelect("tbGrid", id);
    $.messager.confirm("确 认", "您确定要" + operate + "吗？", function (r) {
        if (!r) return;
        var html = $.ajax({
            url: url,
            async: false
        }).responseText;
        if (html > 0) {
            $('#tbGrid').datagrid('clearSelections');
            $('#tbGrid').datagrid('reload');
            $.messager.show({ title: '提 示', msg: '您已成功' + operate + html + '条数据！', showType: 'slide' });
        }
        else if (html == 0) {
            $.messager.show({ title: '提 示', msg: operate + '数据失败，请稍后重试！', showType: 'slide' });
        }
        else { $.messager.show({ title: '提 示', msg: html, showType: 'slide' }); }
    });
}
/*序列化form中的参数*/
function serializObject(name) {
    var o = {};
    $.each($("#" + name).serializeArray(), function (i) {
        if (o[this['name']]) {
            o[this['name']] = o[this['name']] + "," + this['value'];
        }
        else o[this['name']] = this['value'];
    });
    return o;
}
/*获取datagrid选中项*/
function getGridSelect(name, id) {
    var ids = [];
    var sr = $("#" + name).datagrid('getSelections');
    for (var i = 0; i < sr.length; i++) {
        for (var p in sr[i]) {
            if (p == id) {
                ids.push(sr[i][p]);
            }
        }
    }
    return ids.join(',');
}
/*设置url参数值，ref参数名,value新的参数值*/
function changeURLPar(url, ref, value) {
    var str = "";
    if (url.indexOf('?') != -1) str = url.substr(url.indexOf('?') + 1);
    else return url + "?" + ref + "=" + value;
    var returnurl = "";
    var setparam = "";
    var arr;
    var modify = "0";
    if (str.indexOf('&') != -1) {
        arr = str.split('&');
        for (i in arr) {
            if (arr[i].split('=')[0] == ref) {
                setparam = value;
                modify = "1";
            }
            else {
                setparam = arr[i].split('=')[1];
            }
            returnurl = returnurl + arr[i].split('=')[0] + "=" + setparam + "&";
        }
        returnurl = returnurl.substr(0, returnurl.length - 1);
        if (modify == "0")
            if (returnurl == str)
                returnurl = returnurl + "&" + ref + "=" + value;
    }
    else {
        if (str.indexOf('=') != -1) {
            arr = str.split('=');
            if (arr[0] == ref) {
                setparam = value;
                modify = "1";
            }
            else {
                setparam = arr[1];
            }
            returnurl = arr[0] + "=" + setparam;
            if (modify == "0")
                if (returnurl == str)
                    returnurl = returnurl + "&" + ref + "=" + value;
        }
        else
            returnurl = ref + "=" + value;
    }
    return url.substr(0, url.indexOf('?')) + "?" + returnurl;
}

/*弹出模态窗口形式
*url 请求地址
*parms 附加参数，无请为null或空,example:  ?id=xx&name=xxx&date=xxx
*title 用在模态窗口上显示的标题
*width 模态窗口宽度
*height 模态窗口高度
*author 陆勇ly08205
*/
function openDialog(url, parms, title, width, height,callback) {
    var _html = [];
    if (width === null || typeof width === "undefined" || width === "") {
        width = 800;
    }
    if (height === null || typeof height === "undefined" || height === "") {
        height = 500;
    }
    _html.push('<div id="divEdit" class="easyui-window" style="width:' + width + 'px;height:' + height + 'px;overflow-y:hidden;">');
    _html.push('</div>');
    if ($('#divEdit').length > 0) {
        $('#divEdit').remove();
    }
    $('body').append(_html.join(""));
    if (parms !== null && parms !== "") {
        url = url + parms;
    }
    $('#divEdit').dialog({
        href: url,
        title: title,
        width: width,
        height: height,
        resizable: true,
        iconCls: 'icon-add',
        modal: true,
        onOpen: function () {
            if (callback) {
                callback();
            }
        },
        onClose: function () {
            //解决弹出窗口关闭后，验证消息还显示在最上面
            $('.tooltip').remove();
        }
    });
}

/*弹出模态窗口形式
*url 请求地址
*parms 附加参数，无请为null或空,example:  ?id=xx&name=xxx&date=xxx
*title 用在模态窗口上显示的标题
*width 模态窗口宽度
*height 模态窗口高度
*author 陆勇ly08205
*/
function openDetailDialog(url, parms, title, width, height) {
    var _html = [];
    if (width === null || typeof width === "undefined" || width === "") {
        width = 800;
    }
    if (height === null || typeof height === "undefined" || height === "") {
        height = 500;
    }
    var date = new Date();
    var htmlID = date.getFullYear() + date.getMonth() + date.getDate() + date.getHours() + date.getMinutes();
    _html.push('<div id="' + htmlID + '" class="easyui-window" style="width:' + width + 'px;height:' + height + 'px;">');
    _html.push('</div>');
    if ($('#' + htmlID).length > 0) {
        $('#' + htmlID).remove();
    }
    $('body').append(_html.join(""));
    if (parms !== null && parms !== "") {
        url = url + parms;
        console.log(url);
    }
    $('#' + htmlID).dialog({
        href: url,
        width: width,
        height: height,
        resizable: true,
        iconCls: 'icon-print',
        modal: true
    });
}
/*编辑*/
function editDialog(url, parms, width, height) {
    var rows = $('#tbGrid').datagrid('getSelections');
    if (rows.length == 0) {
        $.messager.alert("提示", "请选择要编辑的行！", "info");
        return;
    }
    if (rows.length > 1) {
        $.messager.alert("提示", "编辑只能选择一行！", "info");
        return;
    }
    if (parms == null || parms === "") {
        parms = rows[0].ID;
    }
    openDialog(url, parms, "编辑", width, height);
}

/*将表单转换为JSON字符串*/
function serializForm(formId) {
    var o = serializObject(formId);
    var json = JSON.stringify(o);
    return json;
}

/*自动完成*/
function autoComplete(url, target) {
    $.includePath = "/Cake/jquery-autocomplete/";
    $.include(['jquery.autocomplete.min.js', 'jquery.autocomplete.css']);
    $.each(target, function (i, item) {
        $('#' + item + '').autocomplete(url, {
            max: 12,                    //列表里的条目数
            minChars: 0,                //自动完成激活之前填入的最小字符
            width: 400,                 //提示的宽度，溢出隐藏
            scrollHeight: 300,          //提示的高度，溢出显示滚动条
            matchContains: true,        //包含匹配，就是data参数里的数据，是否只要包含文本框里的数据就显示
            autoFill: false,            //自动填充
            formatItem: function (row, i, max) {
                console.info(typeof row);
                return i + '/' + max + ':"' + row + '"';
            }
        }).result(function (event, row, formatted) {
            alert(row.ServerName);
        });
    });
}

function resetForm(frmId)
{
    var id = frmId || "editForm";
    $('#' + id).form('reset');
}
$.formatString = function (str) {
    for (var i = 0; i < arguments.length - 1; i++) {
        str = str.replace("{" + i + "}", arguments[i + 1]);
    }
    return str;
};