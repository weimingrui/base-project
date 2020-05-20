/*
 * @Author: Arthur 高德地图工具分装
 * @Date: 2019-10-22 09:12:05 
 * @Last Modified by: Arthur
 * @Last Modified time: 2019-10-25 16:48:15
 */

const KEY = "ea0f1aa1d5ac2376b33df517a344d3cd";

const AMapUtil = function (Amap = window.Amap) {

    
    this._map = null; //地图对象
    this.currentOverlay = null; //当前对象  
    this.defaultRichTemps = [
    ]; //默认的模板集合,占位，
    this.defaultPitch = 75;
    this._3DLayerContainList = [];
    this._currentLayer = null;
    this._3DLayerList = []; //地图object3D实例对象集合
};

AMapUtil.prototype = {

    //加载高德地图
    loadAMap() {
        return new Promise((resolve, reject) => {
            var script = document.createElement('script');
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", `https://webapi.amap.com/maps?v=1.4.15&key=${KEY}`);
            document.body.appendChild(script);
            script.onload = () => {
                resolve(true);
            }
            script.onerror = () => {
                reject(false);
            }
        });

    },

    //拿到map
    getMap() {
        return this._map;
    },

    //获取所有的覆盖物
    getOverlays() {
        return this._3DLayerList;
    },

    //初始化地图
    async init(el, config = {}) {
        if (!el) {
            throw new Error('必须有点');
        }
        if (!window.AMap) {
            let hasLoad = await this.loadAMap();
            console.log(hasLoad);
            this.createMap(el, config);

        } else {
            this.createMap(el, config);
        }
    },

    //创建地图
    createMap(el, config = {}) {
        let pitch = this.defaultPitch;
        let defaultConfig = {
            pitch, // 地图俯仰角度，有效范围 0 度- 83 度
            center: [113.61161515108, 34.747428567948], //设置地图中心点坐标
            mapStyle: 'amap://styles/whitesmoke', //设置地图的显示样式
            viewMode: '3D', //设置地图模式
            lang: 'zh_cn', //设置地图语言类型
        }

        let cfg = {
            ...defaultConfig,
            ...config
        };

        this._map = new AMap.Map(el, cfg);
        this.create3DLayerContain();
        if (cfg.traffic) {
            this.doTraffic();
        }

    },
    /**
     * @description: Object3DLayer 为专门承载 Object3D对象的图层，
     * 一个 Object3DLayer 可以承载多个Object3D实例对象
     * ，绘制 Object3D 对象前先给地图添加一个 Object3DLayer图层
     * @param {type} 
     * @return: 
     */
    create3DLayerContain(){
        var object3Dlayer = new AMap.Object3DLayer();
        this.map.add(object3Dlayer);
        let layerObj = {
            '_3DLayer': object3Dlayer,
            'creatTime': Date.now().toString(),
            'prismList': [],           
        }
        this._3DLayerContainList.push(layerObj);
        this._currentLayer = object3Dlayer;
        this._3DLayerList = layerObj.prismList;
        return layerObj;
    },
    /**
     * @description: 设置当前3D图层
     * @param {type} 
     * @return: 
     */
    setCurrent3DLayerContain(creatTime) {
        if (this._3DLayerContainList.length  > 0) {
            let curLayer = this._3DLayerContainList.find(item=>{
                return item.creatTime == creatTime;
            });
            if (curLayer) {
                this._currentLayer = curLayer._3DLayer;
                this._3DLayerList = this._currentLayer.prismList;
                return curLayer
            }
        } else {
            return this.create3DLayerContain();
        }
    },
    /**
     * @description: 删除3D图层
     * @param {type} 
     * @return: 
     */
    remove3DLayerContain(creatTime){
        this._3DLayerContainList.forEach((_layer, index) => {
            if (_layer == creatTime) {
                this._map.remove(_layer['_3DLayer']);
                this._3DLayerContainList.splice(index, 1);
            }
        });
    },
    //清除覆盖物
    removeOverlay(overlay) {
        this._3DLayerList.forEach((_overlay, index) => {

            if (overlay == _overlay.item) {
                this._currentLayer.remove(overlay);
                this._3DLayerList.splice(index, 1);
            }
        });
    },


    //清除对应type的overlay
    /**
     * 
     * @param {string} type 'richMark|mark|polygon|stationPoint_richMark|station_richMark(地铁首末)|metro_polyline(地铁线)'
     */
    removeOverLaysByType(type) {
        let i = this._3DLayerList.length;
        while (i--) {
            if (this._3DLayerList[i].type == type) {
                this._currentLayer.remove(this._3DLayerList[i].item);
                this._3DLayerList.splice(i, 1);
            }
        }
    },

    //生成Amap点
    makeAMapPoint(pointArr) {
        return new AMap.LngLat(pointArr[0], pointArr[1]);
    },

    //绘制覆盖物
    drawMark(config) {
        let defaultConfig = {
            type: "mark",
            events: {},
            // position: new AMap.LngLat(116.39, 39.9),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            // title: '北京'
        };

        let cfg = {
            ...defaultConfig,
            ...config
        };
        let markObj = {
            type: cfg.type,
            item: new AMap.Marker(cfg),
            config: cfg,
            // new BMap.Polygon(aryP, styleConfig),
        };


        this._map.add(markObj.item);

        this._overlays.push(markObj);

        let eventsConfig = Object.assign({}, {
            click: null,
            mouseover: null,
            mouseout: null,
            dblclick: null,
        }, cfg.events);

        let keys = Object.keys(eventsConfig);
        //绑定事件
        keys.forEach(keyName => {
            let event = eventsConfig[keyName];
            if (event) {
                markObj.item.on(keyName, (e) => {
                    eventsConfig[keyName](markObj.item, cfg, e)
                });
            }
        });
        return {
            item: markObj.item,
            config: cfg,
        };

    },

    //自动缩放视野
    setFitView() {
        this._map.setFitView();
    },

    /**
     * 
     * @param {_MAP} map 
     * @param {string} boundary :'1223.2,32323.2;133232.4,3432432.6;'
     * @param {*Object} param2 选填  {styles:{...}||events:{...} }
     */
    drawPolygon(boundary, {
        styles,
        events,
        type = "polygon"
    } = {}, map = this._map, ) {
        // console.log('map',map);
        if (!boundary) return;

        let draw = (aryP) => {
            //样式
            let styleConfig = Object.assign({}, {
                fillColor: "#000",
                fillOpacity: 0.4,
                strokeOpacity: 0.6,
                strokeWeight: 1,
                strokeColor: "#000",
                draggable: false,
                height: 100, // 3d 默认高度
            }, styles);

            if (!styleConfig.color) {
                styleConfig.color = styleConfig.fillColor;
            }
            
            let eventsConfig = Object.assign({}, {
                click: null,
                mouseover: (overlay) => {
                    // overlay.setOptions({
                    //     ...styleConfig,
                    //     ...{
                    //         fillOpacity: 0.8
                    //     }
                    // });
                },
                mouseout: (overlay) => {
                    // overlay.setOptions({
                    //     ...styleConfig,
                    // });
                },
                dblclick: null

            }, events);
            // object3d 实例对象 prism
            let object3D = new AMap.Object3D.Prism({
                height,
                ...styleConfig,
                ...{
                    path: aryP
                }
            })
            let polygonObj = {
                type: type,
                item: object3D
            };

            this._3DLayerList.push(polygonObj);

            let keys = Object.keys(eventsConfig);
            //绑定事件

            keys.forEach(keyName => {
                let event = eventsConfig[keyName];
                if (event) {
                    polygonObj.item.on(keyName, (e) => {
                        eventsConfig[keyName](polygonObj.item, styleConfig, e)
                    });
                }
            });

            this._currentLayer.add(polygonObj.item);

            return {
                item: polygonObj.item,
                config: styleConfig,
                point: aryP,
            };

        }

        if (Array.isArray(boundary)) {
            let list = [];
            boundary.forEach((item, index) => {
                let aryPoint = item.split(';');
                let aryP = pointUtil(aryPoint)
                list.push(draw(aryP));
            });
            return list;
        } else if (typeof boundary == 'string') {
            let aryPoint = boundary.split(';');
            let aryP = pointUtil(aryPoint)
            return draw(aryP);
        }

        function pointUtil(points) {
            let aryP = [];

            points.forEach((item, index) => {
                let point = new AMap.LngLat(item.split(',')[0], item.split(',')[1]);
                aryP.push(point);
            });
            return aryP;

        }
    },

    // 经纬度坐标转成容器像素坐标
    lnglat2container(position) {
        // console.log(position)
        let lnglat = this.makeAMapPoint(position);
        let pixel = this._map.lnglatTocontainer(lnglat);
        return pixel.round();
    },
    // 容器像素坐标转成经纬度坐标
    container2lnglat(position) {
        let pixel = new AMap.Pixel(position[0], position[1]);
        let lnglat = this._map.containerToLngLat(pixel);
        let result = [lnglat.lng, lnglat.lat]
        return result;
    },

    //交通
    //实时路况图层
    doTraffic() {
        let defaultConfig = {
            zIndex: 9999,
            'autoRefresh': true, //是否自动刷新，默认为false
            'interval': 10,
        };
        setTimeout(() => {
            var trafficLayer = new AMap.TileLayer.Traffic(defaultConfig);
            trafficLayer.setMap(this._map);
        }, 200)

    },

    //根据类型获取overlays
    /**
     * 
     * @param {*} type 'richMark|mark|polygon|stationPoint_richMark|station_richMark(地铁首末)|metro_polyline(地铁线)'
     */
    getOverlaysByType(type) {
        let overLays = [];
        this._3DLayerList.forEach((_overLay, index) => {
            if (_overLay.type == type) {
                overLays.push(_overLay);
            }
        });
        return overLays;
    },

    //清除所有overlays
    clearAllOverlays() {
        this._3DLayerContainList.forEach(_overLay => {
            if (this._map && _overLay && _overLay._3DLayer) {
                this._map.remove(_overLay._3DLayer);
            }
        });
        this._3DLayerContainList = [];
        this._currentLayer = null;
        this._3DLayerList = [];
    },
}

export default AMapUtil;