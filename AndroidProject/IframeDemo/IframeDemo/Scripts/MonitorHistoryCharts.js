(function () {
    MonitorHistoryCharts = {
        showCharts: showCharts,
        ShowCharts: showCharts
    };
    monitorHistoryCharts = {
        showCharts: showCharts,
        ShowCharts: showCharts
    };
    function showCharts(config) {
        $.ajax({
            type: 'POST',
            url: config.loadDataUrl,
            dataType: 'json',
            cache: false,
            data: config.requestData,
            complete: function (res) {
                if (!res.responseText || res.responseText == "[]") {
                    if (config.isCustom) {
                        fmpId != "";
                    } else {
                        $.messager.alert("提示", "对不起，未查询到历史记录！", "info");
                    }
                    return;
                }
                var data = eval("(" + res.responseText + ")");
                if (!data["total"] || data.total == 0) {
                    if (config.isCustom) {
                        fmpId != "";
                    } else {
                        $.messager.alert("提示", "对不起，未查询到历史记录！", "info");
                    }
                    return;
                }
                //显示监控历史图表
                renderCharts(config.container, data, config.abnormalDetailUrl, config.titleExt, config.imageUrl, config.requestData.monitorType);
            },
            error: function (res) {
                $.messager.alert("提示", "加载历史记录失败：" + res.responseText, "info");
            }
        });
    }
    function renderChartsByStyleZ(container, data, abnormalDetailUrl, titleExt, imageUrl, monitorType) {
        $(container).highcharts({
            title: {
                text: data.rows[0].FMDMonitorPointName
            },
            subtitle: {
                text: '最新时间：' + dateFormat(data.rows[data.rows.length - 1].FMDStatTimeEnd, "yyyy-MM-dd")
            },
            exporting: {
                enabled: false//去除打印按钮
            },
            //credits: {
            //    text: '查看指标历史',
            //    href: 'http://www.baidu.com'
            //},
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
                    text: '监控数据'
                },

                startOnTick: false
            },
            plotOptions: {
                line: {
                    events: {
                        click: function () {
                            if (monitorType == "应用") {
                                showAbnormalDetail(abnormalDetailUrl, data.rows[0].FMDMonitorPointId);
                            }
                        }
                    },
                    threshold: data.rows[0].FMDThresholdValue,
                    color: "green"
                }
            },
            tooltip: {
                formatter: function () {
                    if (this.series.name == "监控阀值") {
                        return $.formatString("阀值：{0}", statValueFormat(this.y, data.rows[0].FMPThresholdStyle));
                    } else {
                        return $.formatString("监控值：{0}<br />计算公式：{1}", statValueFormat(this.y, data.rows[0].FMPThresholdStyle), this.point.fd);
                    }
                }
            },
            series: [{
                name: "监控阀值",
                data: getSeries(data, false, imageUrl),
                color: '#c1cdcd'
            }, {
                name: data.rows[data.rows.length - 1].FMDMonitorPointName,
                data: getSeries(data, true, imageUrl),
            }]
        });
    }

    /*
监控数据格式化
*/
    function statValueFormat(statValue, tStyle) {
        statValue = statValue || 0;
        statValue = parseFloat(statValue);
        if (tStyle == "1") {
            statValue *= 100;
            return statValue.toFixed(2) + "%";
        } else {
            return statValue.toFixed(0);
        }
    }
    function renderChartsByStyleO(container, data, abnormalDetailUrl, titleExt, imageUrl, monitorType) {
        $(container).highcharts({
            title: {
                text: data.rows[0].FMDMonitorPointName
            },
            subtitle: {
                text: '最新时间：' + dateFormat(data.rows[data.rows.length - 1].FMDStatTimeEnd, "yyyy-MM-dd")
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
                    },
                    formatter: function () {//设置纵坐标值的样式  
                        return this.value * 100 + '%';
                    }
                },
                title: {
                    text: '监控数据'
                },
                max: 1,
                startOnTick: false
            },
            plotOptions: {
                line: {
                    events: {
                        click: function () {
                            if (monitorType == "应用") {
                                showAbnormalDetail(abnormalDetailUrl, data.rows[0].FMDMonitorPointId);
                            }
                        }
                    },
                    threshold: data.rows[0].FMDThresholdValue,
                    color: "green"
                }
            },
            tooltip: {
                formatter: function () {
                    if (this.series.name == "监控阀值") {
                        return $.formatString("阀值：{0}", statValueFormat(this.y, data.rows[0].FMPThresholdStyle));
                    } else {
                        return $.formatString("监控值：{0}<br />计算公式：{1}", statValueFormat(this.y, data.rows[0].FMPThresholdStyle), this.point.fd);
                    }
                }
            },
            series: [{
                name: "监控阀值",
                data: getSeries(data, false, imageUrl),
                color: '#c1cdcd'
            }, {
                name: data.rows[data.rows.length - 1].FMDMonitorPointName,
                data: getSeries(data, true, imageUrl),
            }]
        });
    }
    function renderCharts(container, data, abnormalDetailUrl, titleExt, imageUrl, monitorType) {
        //数字
        if (data.rows[0].FMPThresholdStyle == 0) {
            renderChartsByStyleZ(container, data, abnormalDetailUrl, titleExt, imageUrl, monitorType);
        }
            //占比
        else if (data.rows[0].FMPThresholdStyle == 1) {
            renderChartsByStyleO(container, data, abnormalDetailUrl, titleExt, imageUrl, monitorType);
        }

    }

    //加载时间段
    function getTimes(data) {
        var len = data.rows.length;
        if (len <= 0)
            return [];
        var names = [];
        for (var i = 0; i < len; i++) {
            names.push(Date.parse(data.rows[i].FMDStatTimeEnd).toString("HH:mm"));
        }
        return names;
    }

    //加载监控结果
    function getSeries(data, stat, imageUrl) {
        var len = data.rows.length;
        if (len <= 0)
            return [];
        var names = [];
        for (var i = 0; i < len; i++) {
            var row = data.rows[i];
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


    //异常明细
    function showAbnormalDetail(url, fMDId) {
        $.fancybox({
            width: '900px',
            height: '600px',
            type: 'iframe',
            openOpacity: false,
            closeOpacity: false,
            scrolling: 'no',
            href: url + '?fMDId=' + fMDId
        });
    }
})();