/*
 * @Author: wyx 
 * @Date: 2019-04-30 09:31:04 
 * @Last Modified by: wyx
 * @Last Modified time: 2019-09-29 17:44:49
 */

import '@/utils/jquery-ui.js';
import echarts from 'echarts';
import mapicon from '@/assets/imgs/maps/mapicon.png';

/**
 * 地图拖拽画线
 */
let mapDrag = (function (window) {
    let mapDrag = function (options) {
        return new mapDrag.fn.Init(options);
    }
    mapDrag.fn = mapDrag.prototype = {
        constructor: mapDrag,
        defaults: {
            mapItem: null, //地图对象
            markerItem: null, //城市中心点marker对象
            dragModel: null, //dragModel 
            panelHtml: '', //拖拽窗口html
            positionx: null, //初始化拖拽div位置偏移x，使用isLocation(x坐标,y坐标).panelX 即可计算 例：positionx: isLocation(item.X,item.Y).panelX
            positiony: null, //初始化拖拽div位置偏移y，使用isLocation(x坐标,y坐标).panelX 即可计算
            linex: 0, //画线的偏移x
            liney: 0, //画线的偏移y
            currentItem: null,
            topDistance: 0, // 地图距离顶部的距离，用于补充地图坐标
            leftDistance: 134, // 地图距离左边的距离，用于补充地图坐标
            closeEvent: function () {}, //关闭事件
            dragEvent: function () {}, //拖动窗口事件
            removeMarker: true, //关闭弹窗时是否移除marker
            callBack: function () {}, //回调函数一
            clearInterval: function () {} //清除interval
        },
        Init(options) {
            //将调用时候传过来的参数和default参数合并
            options = $.extend({}, mapDrag.fn.defaults, options || {});
            //合并之后的参数添加到控件的属性中
            this.options = options;

            //创建窗口父级对象
            let parent = $('<div>', {
                "class": "mapdrag"
            }).html(options.panelHtml);
            let domContent = $(".mainContent");
            if (!domContent) {
                $("body").append(parent);
            } else {
                domContent.append(parent);
            }


            //获取窗口对象
            let target = parent.find('.draggable');
            if (target == null || target.length == 0) {
                return;
            }

            //获取chart
            let chartBox = parent.find('.jw-charts')[0];
            if (chartBox) {
                this.drawEcharts(chartBox)
            }
            //循环父级对象(除去刚刚加入的父级对象)
            $(".mapdrag:not(:last)").each(function () {
                //判断是否已经添加过相同id的窗口
                if ($(this).find('.draggable').attr('id') == target.attr('id')) {
                    //如果存在则删除
                    parent.remove();
                    options.mapItem.removeOverlay(options.markerItem);
                }
            });

            this.bindEvent(target); //绑定事件

            this.drawpanelLine(); //第一次画线

            this.closePanel = function () {
                let that = this;
                if (that.options.removeMarker) {
                    //关闭事件
                    that.options.mapItem.removeOverlay(that.options.markerItem);
                }
                that.target.parent().remove();
                that.options.closeEvent();
            }
        },
        bindEvent(target) { //绑定控件事件
            let that = this;
            //获取地图长宽
            let mapsize = that.options.mapItem.getSize();
            //获取div对象
            that.target = target;
            //设置初始div的top和left位置

            let left = that.options.positionx == null || that.options.positionx == undefined ? mapsize.width / 2 - target.width() / 2 : that.options.positionx;
            let top = that.options.positiony == null || that.options.positiony == undefined ? mapsize.height / 2 - target.height() / 2 : that.options.positiony;

            that.target.css("top", top);
            that.target.css("left", left);
            that.target.css("z-index", '499');
            //绑定jquery.draggable控件
            that.target.draggable({
                drag: function () {
                    $(".draggable.u-maptipbox").css('z-index', '499');
                    that.target.css('z-index', '500');
                    that.drawpanelLine();
                    that.options.dragEvent();
                },
                stop: function () {
                    that.drawpanelLine();
                    that.options.dragEvent();
                    that.options.dragModel.clearInterval();
                }
            });

            //关闭按钮事件
            that.target.find('.u-closepanel').click(function () {
                let _data = $(this).attr('query');

                let overlay = that.options.overlay;
                if (overlay && overlay.show) {
                    overlay.show()
                }
                that.options.dragEvent();
                that.closePanel();
                that.options.dragModel.clearInterval();
                that.options.callBack({
                    data: _data,
                    type: "close"
                });
            });

            //城市更多
            that.target.find('.queryBtn').click(function () {
                let _data = $(this).attr('query');
                let _type = $(this).attr('type');
                that.options.callBack({
                    data: _data,
                    type: _type
                });
            });

            //地图缩放事件
            that.options.mapItem.addEventListener("zoomend", function () {
                that.drawpanelLine();
                that.options.dragEvent();
            });
            //地图移动事件
            that.options.mapItem.addEventListener("moving", function () {
                that.drawpanelLine();
                that.options.dragEvent();
            });
        },
        /**
         * 画线
         */
        drawpanelLine() {
            let that = this;
            let pixel = that.options.mapItem.pointToPixel(new BMap.Point(that.options.markerItem.getPosition().lng, that.options.markerItem.getPosition().lat));

            that.options.linex = that.options.linex == 0 ? parseFloat(that.target.width()) / 2 : that.options.linex;
            that.options.liney = that.options.liney == 0 ? (parseFloat(that.target.height()) / 2) + 6 : that.options.liney;

            // marker 相对屏幕的绝对位置 xy
            let x = pixel.x + this.options.leftDistance - that.options.linex;
            let y = (pixel.y + that.options.topDistance) - that.options.liney;

            let cleft = that.target.position().left - x;
            let ctop = that.target.position().top - y;
            if (cleft > 0) {
                that.target.find(".u-panelineb").attr("style", "width:" + cleft + "px;right:0");
            } else {
                that.target.find(".u-panelineb").attr("style", "width:" + Math.abs(cleft) + "px;left:0");
            }
            if (ctop > 0) {
                that.target.find(".u-panelinea").attr("style", "height:" + ctop + "px;bottom:50%");
                that.target.find(".u-panelineb").css("bottom", "initial");
            } else {
                that.target.find(".u-panelinea").attr("style", "height:" + Math.abs(ctop) + "px;top:50%");
                that.target.find(".u-panelineb").css("bottom", "0");
            }
        },
        /**
         * 处理图表 
         * 备注 ： 这里的图标数据格式嵌套的没有耦合性 需要重新处理
         * @param {*} el 
         */
        drawEcharts(el) {
            let option = this.options.currentItem.chartOption;
            if (option) {
                let myChart = echarts.init(el);
                myChart.setOption(option);
            }
        }
    }

    mapDrag.fn.Init.prototype = mapDrag.fn;

    return mapDrag;
})();


// 拖拽面板使用
let dragModel = () => {
    return {
        topDistance: 80, // 地图距离顶部的距离
        leftDistance: 240,
        limitXY: [140, 100], // 初始限制位置， 与domWH结合可动态设置到合适居中的位置
        mapObj: null, //地图对象
        interval: null, //
        intervalIndex: 0, //index
        domWH: [200, 200],
        loopList: [], //单次循环集合对象
        looplistPanel: [], //单次循环panel集合
        panelXY: [
            '',
            [355, 260]
        ], //初始化数组点集合
        carouselData: [], //参与轮播的数据
        callBackAction() {},
        setPanelXY() {
            if (!this.mapObj) {
                return false;
            }
            var size = this.mapObj.getSize();
            var sizeHeight = size.height;
            var sizeWidth = size.width;
            var bodyHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var bodyWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

            if (this.domWH && this.domWH.length == 2) {
                let top = (bodyHeight - this.domWH[1]) / 2;
                let left = (bodyWidth - this.domWH[0]) / 2;
                if (top < this.topDistance) {
                    top = this.topDistance
                }
                if (left < this.leftDistance) {
                    left = this.leftDistance
                }

                this.panelXY = [
                    '',
                    [left, top],
                ];
            } else {
                this.panelXY = [
                    [210, 140],
                    [355, 150],
                    [280, sizeHeight - 230],
                    [bodyWidth - 740, sizeHeight - 230],
                    [sizeWidth / 2 - 175, sizeHeight / 2 - 61]
                ];
            }

        },
        defaultLineX: 0,

        /*计算弹出面板位置1
            centerPointX：中心点或marker的x
            centerPointY：中心点或marker的y
            leftMenuWidth:左侧菜单树宽度
            rightMenuWidth:右侧菜单树宽度
        */
        calculatePanelPositionWithMenu: function (centerPointX, centerPointY, leftMenuWidth, rightMenuWidth) {

            let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth; //屏幕宽度
            let panelWidth = 350; //弹出面板的宽度
            let panelHeight = 300; //弹出面板的高度
            let offsetWidth = -200; //横向偏移量
            let offsetHeight = 50; //纵向偏移量

            let x = centerPointX + offsetWidth; //屏幕左侧
            if ((width - leftMenuWidth - rightMenuWidth) / 2 + leftMenuWidth < centerPointX) {
                x = centerPointX - panelWidth - offsetWidth; //屏幕右侧
            }

            let y = centerPointY - (panelHeight + offsetHeight);
            if (centerPointY < (panelHeight + offsetHeight)) {
                y = centerPointY + offsetHeight;
            }
            return {
                panelX: x,
                panelY: y
            };
        },
        /*计算弹出面板位置2,
        x,y 是点击的标注点坐标*/
        isLocation: function (x, y, map) {
            let _this = this;
            let pixel = map.pointToPixel(new BMap.Point(x, y));
            // 拖拽面板位置
            let panelPosition = _this.calculatePanelPositionWithMenu(pixel.x, pixel.y, 310, 400);
            return panelPosition;
        },
        //从数组中删除指定值元素
        removeByValue(arr, val) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        },
        /**
         * 
         * @param {*} item 
         * @param {*} map 
         * @param {*} panelHtml 
         * @param {坐标点} center 
         */
        SetShowPanel(item, map, panelHtml, center = [], overlay = null) {
            let _this = this;
            // 点击的marker对象
            let mapIcon = new BMap.Icon(mapicon, new BMap.Size(24, 24));
            let marker = new BMap.Marker(new BMap.Point(center[0], center[1]), {
                icon: mapIcon,

                offset: new BMap.Size(0, -6)
            }); // 创建标注
            marker.setZIndex(9999);
            map.addOverlay(marker);

            let pixel = map.pointToPixel(new BMap.Point(center[0], center[1]));
            //xy 的初始值。极大值
            let positionx = 500;
            let positiony = 400;
            //点位的初始值
            let pointX = Math.abs(_this.isLocation(center[0], center[1], map).panelX);
            let pointY = Math.abs(_this.isLocation(center[0], center[1], map).panelY);
            // 限制xy的极小值,只是限制左 上的边界

            if (pointX <= 500) {
                if (this.domWH && this.domWH.length == 2) {
                    // 限制x边界的极值+一半的容器宽度，极值为500
                    let limitX = this.limitXY[0] + this.domWH[0] / 2;
                    if (pointX < limitX && limitX <= 500) {
                        positionx = limitX
                    } else {
                        positionx = pointX
                    }
                }
            }
            if (pointY <= 400) {
                let limitY = this.limitXY[1]
                if (this.domWH && this.domWH.length > 1) {
                    limitY += this.domWH[1] / 2;
                }
                // 限制Y边界的极值+一半的容器宽度，极值为400
                if (pointY < limitY && limitY < 400) {
                    positiony = limitY
                } else {
                    positiony = pointY
                }
            }
            if (item.useMaxLimetXY) {
                positionx = item.panelX
                positiony = item.panelY
            }
            // console.log(positionx, 'x')
            // console.log(positiony, 'y')
            // // positionx = 300
            // // positiony = 300
            // // 去重重新定位
            
            // const pos = noRepeat(positionx, positiony);
            // positionx = pos.x;
            // positiony = pos.y;
            
            // 定位弹窗面板位置
            let drag = mapDrag({
                mapItem: map,
                markerItem: marker,
                topDistance: _this.topDistance,
                currentItem: item,
                dragModel: _this,
                panelHtml: panelHtml, //弹窗内容
                positionx,
                positiony,
                // positionx: Math.abs(_this.isLocation(center[0], center[1], map).panelX)>500?500:Math.abs(_this.isLocation(center[0], center[1], map).panelX), // 定位弹窗面板位置
                // positiony: Math.abs(_this.isLocation(center[0], center[1], map).panelY)>400?400:Math.abs(_this.isLocation(center[0], center[1], map).panelY),
                linex: this.defaultLineX, //画线的偏移x
                liney: 0, //画线的偏移y
                callBack: _this.callBackAction,
                clearInterval: _this.clearInterval,
                overlay: overlay
            });
            _this.looplistPanel.push(drag);
            return drag;
        },
        SetShowPanelNoMap(item, map, x, y, panelHtml, overlay = null) {
            let _this = this;
            // 点击的marker对象
            let mapIcon = new BMap.Icon(mapicon, new BMap.Size(24, 24));
            let marker = new BMap.Marker(new BMap.Point(item.X, item.Y), {
                icon: mapIcon,
                offset: new BMap.Size(0, -6)
            }); // 创建标注
            map.addOverlay(marker);
            // 定位弹窗面板位置
            let drag = mapDrag({
                mapItem: map,
                currentItem: item,
                markerItem: marker,
                topDistance: _this.topDistance,
                dragModel: _this,
                panelHtml: panelHtml, //弹窗内容
                positionx: x, // 定位弹窗面板位置
                positiony: y, // 定位弹窗面板位置
                linex: this.defaultLineX, //画线的偏移x
                liney: 0, //画线的偏移y
                callBack: _this.callBackAction,
                clearInterval: _this.clearInterval,
                overlay: overlay
            });
            _this.looplistPanel.push(drag);
            return drag;
        },
        //创建定时器
        createInterval() {
            let _this = this;
            _this.clearInterval();
            //轮询
            let iMax = _this.carouselData.length;

            _this.polygonInterval(iMax);
            _this.interval = setInterval(function () {
                _this.polygonInterval(iMax);
            }, 5000);
        },
        clearInterval() {
            let _this = this;
            if (_this.interval) {
                // this.clearmap();
                clearInterval(_this.interval);
                _this.interval = null;
            }
        },
        //循环板块
        polygonInterval(iMax) {
            let _this = this;

            _this.clearmap();
            let looplist = _this.getLoopList();
            if (_this.intervalIndex < iMax - 1) { //正常加载
                for (let i = 0; i < looplist.length; i++) {
                    _this.SetShowPanelNoMap(looplist[i], _this.mapObj, _this.panelXY[1][0], _this.panelXY[1][1], _this.modPanelInner(looplist[i]));
                    _this.intervalIndex = _this.intervalIndex + 1;
                }
            } else { //加载到最后一条数据
                for (let i = 0; i < looplist.length; i++) {
                    _this.SetShowPanelNoMap(looplist[i], _this.mapObj, _this.panelXY[1][0], _this.panelXY[1][1], _this.modPanelInner(looplist[i]));
                    _this.intervalIndex = 0;
                }
            }
        },
        //模板（需要被覆盖）
        modPanelInner(item) {
            return `<div class="u-maptipbox u-maptipboxul draggable" id="${item.listId}">
                        <div class="u-panelinea">
                            <div class="u-panelineb"></div>
                        </div>
                    </div>`;
        },
        //获取循环所用数组
        getLoopList() {
            let _this = this;
            let loop = 1;
            let list = [];
            let iMax = _this.carouselData.length;
            for (let i = 0; i < loop; i++) {
                if (_this.intervalIndex + i < iMax) {
                    list.push(_this.carouselData[_this.intervalIndex + i]);
                }
            }
            _this.loopList = list = _this.sortLoopList(list);
            return list;
        },
        //循环板块对象排序
        sortLoopList(list) {
            if (list.length > 1) {
                list.sort(compareArray("Y"));
                let half = list.slice(0, 2);
                half.sort(compareArray("X")).reverse();
                let behind = list.slice(2);
                behind.sort(compareArray("X")).reverse();
                return half.concat(behind);
            } else {
                return list;
            }
        },
        //对象数组排序
        compareArray(propertyName) {
            return function (object1, object2) {
                var value1 = object1[propertyName];
                var value2 = object2[propertyName];
                if (!isNaN(Number(value1)) && !isNaN(Number(value2))) {
                    value1 = Number(value1);
                    value2 = Number(value2);
                }
                if (value2 < value1) {
                    return -1;
                } else if (value2 > value1) {
                    return 1;
                } else {
                    return 0;
                }
            }
        },
        /**
         * 清理地图 
         */
        clearmap() {

            let _this = this;
            let list = _this.looplistPanel;
            for (let i = 0; i < list.length; i++) {
                list[i].closePanel();
                _this.removeByValue(_this.looplistPanel, list[i]);
            }
        },
        /**
         *  销毁地图 （vue跳转时候调用）
         */
        destoryed() {
            let _this = this;
            $('.mapdrag').remove();
            _this.clearnMapPannnel();
            _this.mapObj = null;
        },
        //清理
        clearMapPanel() {
            //console.log(this);
            let panels = this.looplistPanel;
            panels.forEach(item => {
                item.closePanel();
            });
        },
        clearnMapPannnel() {
            this.clearInterval();
            this.clearMapPanel();
            // if (this.mapObj) {
            //     this.mapObj.clearOverlays();
            // }
            this.carouselData = [];
            $('.mapdrag').remove();
        }
    }
}

function noRepeat(x, y) {
    if (!window.posArr) window.posArr = []; // 全局唯一
    console.log(111)
    const key = x + '-' + y;
    console.log(key)
    if (window.posArr.indexOf(key) > -1) {
        console.log(x, y)
        const rangex = Math.random()
        const rangey = Math.random()
        const fx = Math.random()
        const fy = Math.random()
        const disx = (fx > 0.5 ? rangex : rangex * -1)
        const disy = (fy > 0.5 ? rangey : rangey * -1)
        // const nx = Number(+x + disx).toFiexd(0);
        // const ny = Number(+y + disy).toFiexd(0);
        const nx = (+x + disx);
        const ny = (+y + disy);
        noRepeat(nx, ny);
    } else {
        window.posArr.push(key);
        return {x, y}
    }
}

export {
    mapDrag,
    dragModel
}