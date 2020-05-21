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
            // rotateEnable:false, 固定视角
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
        this._NormalLayerList = []; //不挂在3DObject上的layers
        return layerObj;
    },
    /**
     * @description: 设置当前3D图层
     * @param {type} 
     * @return: 
     */
    setCurrent3DLayerContain(layer) {
        if (this._3DLayerContainList.length  > 0) {
            // let curLayer = this._3DLayerContainList.find(_layer=>{
            //     return item._3DLayer == layer;
            // });
            if (layer) {
                this._currentLayer = layer._3DLayer;
                this._3DLayerList = this._currentLayer.prismList;
                return layer
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
    remove3DLayerContain(layer){
        this._3DLayerContainList.forEach((_layer, index) => {
            if (_layer == layer) {
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
     * @param {_MAP} map 画立体物体
     * @param {string} boundary :'1223.2,32323.2;133232.4,3432432.6;'
     * @param {*Object} param2 选填  {styles:{...}||events:{...} }
     */
    draw3DSolid(boundary, {
        styles,
        events,
        type = "solid"
    } = {}, ) {
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
            
            
            // object3d 实例对象 prism
            let prismConf = {
                ...styleConfig,
                ...{
                    path: aryP
                }
            }
            let object3D = new AMap.Object3D.Prism()
            this._currentLayer.add(object3D);

            let solidObj = {
                type: type,
                item: object3D
            };

            this._3DLayerList.push(solidObj);

            this.addEventListen(object3D, events, prismConf);
            return {
                item: object3D,
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

    //根据类型获取overlays
    /**
     * 
     * @param {*} type 'richMark|mark|polygon|stationPoint_richMark|station_richMark(地铁首末)|metro_polyline(地铁线)'
     */
    getOverlaysByType(type, conf = {is3D = false}) {
        let overLays = [];
        if (conf&&conf.is3D) {
            this._3DLayerList.forEach((_overLay, index) => {
                if (_overLay.type == type) {
                    overLays.push(_overLay);
                }
            });
        } else {
            this._NormalLayerList.forEach((_overLay, index) => {
                if (_overLay.type == type) {
                    overLays.push(_overLay);
                }
            });
        }

        
        return overLays;
    },

    //清除所有overlays
    clearAllOverlays() {
        this._NormalLayerList.forEach(_overLay=>{
            if (this._map && _overLay){
                this._map.remove(_overLay.item);
            }
        })
        this._3DLayerContainList.forEach(_overLay => {
            if (this._map && _overLay && _overLay._3DLayer) {
                this._map.remove(_overLay._3DLayer);
            }
        });
        this._NormalLayerList = [];
        this._3DLayerContainList = [];
        this._currentLayer = null;
        this._3DLayerList = [];
    },
    drawTextLabel(config={}) {
        let defaultConf = {
            text:'',
            verticalAlign:'bottom',
            position: [116.47286,39.992178],
            height: 10,
            style:{
                'background-color':'#e1e1e1',
                'border-color':'white',
                'font-size':'12px'
            }
        }
        defaultConf = Object.assign(defaultConf,config)
        let textLayer  = new AMap.Text({
            map:this._map,
            ...defaultConf
        })
        let obj = {
            type: 'text',
            item: textLayer,
        }
        this._NormalLayerList.push(obj);
    },
    
    /**
     * @description: 画圆
     * @param {type} 
     * @return: 
     */
    drawCircle(config = {}) {
        let defaultConf = {
            center:[116.47246,39.992133],
            radius:300,
            fillColor:'blue',
            strokeWeight: 0,
            strokeColor:'white',
            fillOpacity:0.05
        }
        defaultConf = Object.assign(defaultConf,config); 
        let {events = {}} = defaultConf
        let circleLayer = new AMap.Circle({
            map:this_map,
            ...defaultConf,
        });
        this.addEventListen(circleLayer, events, defaultConf);
        let obj = {
            type: 'circle',
            item: circleLayer,
        }
        this._NormalLayerList.push(obj);
    },
    addEventListen(layer, events = {},otherData = {}) {
        if (layer) {
            let eventsConfig = Object.assign({}, {
                click: null,
                mouseover: (overlay) => {
                },
                mouseout: (overlay) => {
    
                },
                dblclick: null
    
            }, events);
            let keys = Object.keys(eventsConfig);
            //绑定事件
    
            keys.forEach(keyName => {
                let event = eventsConfig[keyName];
                if (event) {
                    layer.on(keyName, (e) => {
                        eventsConfig[keyName](layer, otherData, e)
                    });
                }
            });
        }
    },
    /**
     * @description: 富文本集合
     * @param {type} 
     * @return: 
     */
    drawRichMarker(config={}) {
        let {
            html = '<div></div>',
            position,
            offset = [0,0],
            
            events = {},
            type = 'richMarker'
        } = config;
        if (offset) {

        }
        var marker = new AMap.Marker({
            position: [...position],
            // 将 html 传给 content
            content: html,
            // 以 icon 的 [center bottom] 为原点
            offset: new AMap.Pixel(...offset),
        });
        this.addEventListen(marker,events, config);
        // 将 markers 添加到地图
        this._map.add(marker);
        let markerObj = {
            item: marker,
            type,
        }
        this._NormalLayerList.push(markerObj);
        return markerObj;
    },
}

export default AMapUtil;