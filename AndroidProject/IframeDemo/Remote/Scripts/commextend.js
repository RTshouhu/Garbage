/*
* add by czm07380 2014-4-3
*/
//返回日期格式 yyyy-mm-dd HH:mm:ss
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;

    var strDate = date.getDate();
    var strMin = date.getMinutes();
    var strSec = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strMin >= 0 && strMin <= 9) {
        strMin = "0" + strMin;
    }
    if (strSec >= 0 && strSec <= 9) {
        strSec = "0" + strSec;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + strMin
            + seperator2 + strSec;
    return currentdate;
}

//返回日期格式yyyy-mm-dd 00:00:00
function getNowZeroHourDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;

    var strDate = date.getDate();
    var strMin = date.getMinutes();
    var strSec = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " 00" + seperator2 + "00" + seperator2 + "00";
    return currentdate;
}

function getNowLastHourDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;

    var strDate = date.getDate();
    var strMin = date.getMinutes();
    var strSec = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " 23" + seperator2 + "59" + seperator2 + "59";
    return currentdate;
}
//重置统计日期区间，默认是当前日期0点0分0秒到当前时刻
function resetDateRange(id) {
    var fId = "#" + id;
    if (!$(fId).val()) {
        $(fId).val(getNowZeroHourDate());
    }
}

function resetDateRange2(id) {
    var fId = "#" + id;
    if (!$(fId).val()) {
        $(fId).val(getNowLastHourDate());
    }
}

//设置关联日期  最小两周前，最大明天
function setDoubleDate(id) {
    var fId = "#" + id;
    $(fId).focus(function () {
        WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss', minDate: '%y-%M-#{%d-14} 00:00:00', isShowClear: false, readOnly: true });
    }).blur(function () {
        resetDateRange(id);
    });
}

function setDate(id) {
    var fId = "#" + id;
    $(fId).focus(function () {
        WdatePicker({ dateFmt: 'yyyy-MM-dd', minDate: '1900-01-01', isShowClear: false, readOnly: true });
    }).blur(function () {
        resetDate(id);
    });


    $("#date").focus(function () {
        WdatePicker({ dateFmt: 'yyyy-MM-dd', maxDate: '%y-%M-#{%d+1}', isShowClear: false, readOnly: true });
    }).blur(function () {
        resetDate();
    });
}

function resetDate(id) {
    var fId = "#" + id;
    if (!$(fId).val()) {
        console.log($(fId).val());
        $(fId).val(getNowDate());
        console.log($(fId).val());
    }
    if (!$("#date").val()) {
        $("#date").val(getNowDate());
    }
}

//返回日期格式 yyyy-mm-dd
function getNowDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

/*
故障明细页面
url @(BasePath)FaultDetails/Index
faultId 故障id
*/
function openDetails(url, faultId) {
    openDetailDialog(url, '?id=' + faultId, '故障明细');
}

//字符串超出长度则使用...代替
//全部字符使用tip的形式展示
function omitted(source, maxL) {
    maxL = maxL || 30;
    source = source || "";
    if (source.constructor != String) {
        source = source.toString();
    }
    if (source && source.length > maxL) {
        return source.substring(0, maxL) + "...";
    }
    return source;
}