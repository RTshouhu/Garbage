function showEsChart(config) {
    $.ajax({
        type: 'POST',
        url: config.loadUrl,
        dataType: 'json',
        cache: false,
        data: config.requestData,
        complete: function (res) {
            if (!res.responseText || res.responseText == "[]") {
                $.messager.alert("提示", "对不起，未查询到历史记录！", "info");
                return;
            }
            var data = eval("(" + res.responseText + ")");
            if (data.length<=0) {
                $.messager.alert("提示", "对不起，未查询到历史记录！", "info");
                return;
            }
            if (config.showType == 0) {
                renderUsableCharts(config.container, data, config.titleExt);
            } else {
                renderPropertyCharts(config.container, data, config.titleExt);
            }

        },
        error: function (res) {
            $.messager.alert("提示", "加载历史记录失败：" + res.responseText, "info");
        }
    });
}

//可用行表格
function renderUsableCharts(container, data, titleExt,imageUrl) {
    $(container).highcharts({
        title: {
            text: "Es可用性监控"
        },
        subtitle: {
            text: titleExt
        },
        exporting: {
            enabled: false//去除打印按钮
        },
        credits: {
            text: '查看指标历史',
            href: 'http://www.baidu.com'
        },
        xAxis: {
            categories: getTimes(data), //加载监控时间段
            labels: {
                align: 'right',
                style: {
                    fontSize: '10px'
                },
                rotation: -20
            }
        },
        yAxis: {
            allowDecimals: true,
            labels: {
                align: 'right',
                rotation: -20,
                style: {
                    fontSize: '10px'
                }
            },
            title: {
                text: '可用性'
            },
            max: 1,
            startOnTick: false
        },
        plotOptions: {
            line: {
                threshold: data[0].FMDThresholdValue,
                color: "green"
            }
        },
        tooltip: {
            formatter: function () {
                if (this.series.name == "监控阀值") {
                    return $.formatString("阀值：{0}", this.y);
                } else {
                    return $.formatString("可用性：{0}<br />明细：{1}", this.y, this.point.fd);
                }
            }
        },
        series: [{
            name: "监控阀值",
            data: getUsableSeries(data, false, imageUrl),
            color: '#c1cdcd'
        }, {
            name: data[data.length - 1].FMDMonitorPointName,
            data: getUsableSeries(data, true, imageUrl),
        }]
    });
}
//性能表格
function renderPropertyCharts(container, data, titleExt, imageUrl) {
    $(container).highcharts({
        title: {
            text: "Es性能监控"
        },
        subtitle: {
            text: titleExt
        },
        exporting: {
            enabled: false//去除打印按钮
        },
        credits: {
            text: '查看指标历史',
            href: 'http://www.baidu.com'
        },
        xAxis: {
            categories: getTimes(data), //加载监控时间段
            labels: {
                align: 'right',
                style: {
                    fontSize: '10px'
                },
                rotation: -20
            }
        },
        yAxis: {
            allowDecimals: true,
            labels: {
                align: 'right',
                rotation: -20,
                style: {
                    fontSize: '10px'
                }
            },
            title: {
                text: '性能'
            },
            max: 1,
            startOnTick: false
        },
        plotOptions: {
            line: {
                threshold: data[0].FMDThresholdValue,
                color: "green"
            }
        },
        tooltip: {
            formatter: function () {
                if (this.series.name == "监控阀值") {
                    return $.formatString("阀值：{0}", this.y);
                } else {
                    return $.formatString("性能：{0}<br />明细：{1}", this.point.y, this.point.fd);
                }
            }
        },
        series: [{
            name: "监控阀值",
            data: getPropertySeries(data, false, imageUrl),
            color: '#c1cdcd'
        }, {
            name: data[data.length - 1].FMDMonitorPointName,
            data: getPropertySeries(data, true, imageUrl),
        }]
    });
}
//加载时间段
function getTimes(data) {
    var len = data.length;
    if (len <= 0)
        return [];
    var names = [];
    for (var i = 0; i < len; i++) {
        names.push(Date.parse(data[i].FMDStatTimeEnd).toString("HH:mm"));
    }
    return names;
}
//加载可用性监控结果
function getUsableSeries(data, stat, imageUrl) {
    var len = data.length;
    if (len <= 0)
        return [];
    var names = [];
    for (var i = 0; i < len; i++) {
        var row = data[i];
        var floatV = stat ? parseFloat(row.FMDStatValue) : parseFloat(row.FMDThresholdValue);
        if (isNaN(floatV)) {
            floatV = 0;
        }
        var markerConfig;//折线图上点的配置
        if (row.FMDMonitorResult == 0) {//监控结果为正常设置点的样式
            var marker = {
                fillColor: "green",
                lineColor: "green",
                states: {
                    hover: { fillColor: "green", lineColor: "green" }//鼠标经过时点的颜色
                }
            };
            markerConfig = marker;
        } else {//监控结果为异常设置点的样式
            var marker2 = {
                symbol: imageUrl,//使用图标替换点
                states: {
                    hover: { symbol: imageUrl }//鼠标经过时配置
                }
            };
            markerConfig = marker2;
        }
        if (stat) {//为监控数值线时
            names.push({ y: floatV, id: row.FMDId, fd: row.FMDComputeFormulaDetail, tb: row.FMDStatTimeBegin, te: row.FMDStatTimeEnd, marker: markerConfig });
        } else {//为阀值线时
            names.push({ y: floatV, id: row.FMDId, fd: row.FMDComputeFormula, tb: row.FMDStatTimeBegin, te: row.FMDStatTimeEnd });
        }
    }
    return names;
}
//加载性能监控结果
function getPropertySeries(data, stat, imageUrl) {
    var len = data.length;
    if (len <= 0)
        return [];
    var names = [];
    for (var i = 0; i < len; i++) {
        var row = data[i];
        var floatV = stat ? parseFloat(row.ESPMValue) : parseFloat(row.ESPMThreshold);
        if (isNaN(floatV)) {
            floatV = 0;
        }
        var markerConfig;//折线图上点的配置
        if (row.FMDMonitorResult == 0) {//监控结果为正常设置点的样式
            var marker = {
                fillColor: "green",
                lineColor: "green",
                states: {
                    hover: { fillColor: "green", lineColor: "green" }//鼠标经过时点的颜色
                }
            };
            markerConfig = marker;
        } else {//监控结果为异常设置点的样式
            var marker2 = {
                symbol: imageUrl,//使用图标替换点
                states: {
                    hover: { symbol: imageUrl }//鼠标经过时配置
                }
            };
            markerConfig = marker2;
        }
        if (stat) {//为监控数值线时
            names.push({ y: floatV, id: row.FMDId, fd: row.ESPMDetail, tb: row.FMDStatTimeBegin, te: row.FMDStatTimeEnd, marker: markerConfig });
        } else {//为阀值线时
            names.push({ y: floatV, id: row.FMDId, fd: row.FMDComputeFormula, tb: row.FMDStatTimeBegin, te: row.FMDStatTimeEnd });
        }
    }
    return names;
}