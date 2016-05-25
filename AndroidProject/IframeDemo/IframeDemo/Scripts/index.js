$(document).ready(function () {
    /*初始化菜单的链接创建Tab*/
    var as = $(".easyui-accordion .tree-title").find("a");
    as.each(function () {
        var href = $(this).attr("href");
        var name = $(this).html();
        $(this).attr("href", "javascript:;");
        $(this).click(function () {
            addTab(name, href);
        });
    });
    tabClose();
    tabCloseEven();
    //$('#tabs').tabs('add', { title: '首页', content: createFrame((basePath && basePath != "/" ? basePath : "") + '') });
});
function addTab(title, url) {
    if (!$('#tabs').tabs('exists', title)) {
        $('#tabs').tabs('add', {
            title: title,
            content: createFrame(url),
            closable: true
        });
    } else {
        $('#tabs').tabs('select', title);
        closeTab('refresh');
    }
    tabClose();
}
function createFrame(url) {
    return '<iframe scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:99%;"></iframe>';
}
function closeTab(action) {
    var alltabs = $('#tabs').tabs('tabs');
    var currentTab = $('#tabs').tabs('getSelected');
    var allTabtitle = [];
    $.each(alltabs, function (i, n) {
        allTabtitle.push($(n).panel('options').title);
    });
    switch (action) {
        case "refresh":
            var iframe = $(currentTab.panel('options').content);
            var src = iframe.attr('src');
            if (src != undefined) {
                $('#tabs').tabs('update', {
                    tab: currentTab,
                    options: {
                        content: createFrame(src)
                    }
                });
            }
            break;
        case "close":
            var currtabTitle = currentTab.panel('options').title;
            $('#tabs').tabs('close', currtabTitle);
            break;
        case "closeall":
            $.each(allTabtitle, function (i, n) {
                $('#tabs').tabs('close', n);
            });
            break;
        case "exit":
            $('#closeMenu').menu('hide');
            break;
    }
}
function tabClose() {
    /*为选项卡绑定右键*/
    $(".tabs-inner").bind('contextmenu', function (e) {
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
        var subtitle = $(this).children(".tabs-closable").text();
        $('#mm').data("currtab", subtitle);
        $('#tabs').tabs('select', subtitle);
        return false;
    });
}
function tabCloseEven() {
    $('#mm').menu({
        onClick: function (item) {
            closeTab(item.id);
        }
    });
    return false;
}
