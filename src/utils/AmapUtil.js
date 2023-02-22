/*
 * @Author: hp 高德地图工具分装
 * @Date: 2019-10-22 09:12:05
 * @Last Modified by: hp
 * @Last Modified time: 2019-10-25 16:48:15
 */

const KEY = 'ea0f1aa1d5ac2376b33df517a344d3cd'

const AMapUtil = function (Amap = window.Amap) {
    this._overlays = [] //地图覆盖物集合
    this._map = null //地图对象
    this.currentOverlay = null //当前对象
    this.defaultRichTemps = [] //默认的模板集合,占位，
}

AMapUtil.prototype = {
    //加载高德地图
    loadAMap() {
        return new Promise((resolve, reject) => {
            var script = document.createElement('script')
            script.setAttribute('type', 'text/javascript')
            script.setAttribute(
                'src',
                `https://webapi.amap.com/maps?v=1.4.15&key=${KEY}`
            )
            document.body.appendChild(script)
            script.onload = () => {
                resolve(true)
            }
            script.onerror = () => {
                reject(false)
            }
        })
    },

    //拿到map
    getMap() {
        return this._map
    },

    //获取所有的覆盖物
    getOverlays() {
        return this._overlays
    },

    //初始化地图
    async init(el, config = {}) {
        if (!el) {
            throw new Error('必须有点')
        }
        if (!window.AMap) {
            let hasLoad = await this.loadAMap()
            console.log(hasLoad)
            this.createMap(el, config)
        } else {
            this.createMap(el, config)
        }
    },

    //创建地图
    createMap(el, config = {}) {
        let defaultConfig = {
            zoom: 10, //设置地图显示的缩放级别
            center: [113.61161515108, 34.747428567948], //设置地图中心点坐标
            mapStyle: 'amap://styles/whitesmoke', //设置地图的显示样式
            viewMode: '2D', //设置地图模式
            lang: 'zh_cn' //设置地图语言类型
        }

        let cfg = {
            ...defaultConfig,
            ...config
        }

        this._map = new AMap.Map(el, cfg)
        if (cfg.traffic) {
            this.doTraffic()
        }
    },

    //清除覆盖物
    removeOverlay(overlay) {
        this._overlays.forEach((_overlay, index) => {
            if (overlay == _overlay.item) {
                this._map.remove(overlay)
                this._overlays.splice(index, 1)
            }
        })
    },

    //清除对应type的overlay
    /**
     *
     * @param {string} type 'richMark|mark|polygon|stationPoint_richMark|station_richMark(地铁首末)|metro_polyline(地铁线)'
     */
    removeOverLaysByType(type) {
        let i = this._overlays.length
        while (i--) {
            if (this._overlays[i].type == type) {
                this._map.remove(this._overlays[i].item)
                this._overlays.splice(i, 1)
            }
        }
    },

    //生成Amap点
    makeAMapPoint(pointArr) {
        return new AMap.LngLat(pointArr[0], pointArr[1])
    },

    //绘制覆盖物
    drawMark(config) {
        let defaultConfig = {
            type: 'mark',
            events: {}
            // position: new AMap.LngLat(116.39, 39.9),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            // title: '北京'
        }

        let cfg = {
            ...defaultConfig,
            ...config
        }
        let markObj = {
            type: cfg.type,
            item: new AMap.Marker(cfg),
            config: cfg
            // new BMap.Polygon(aryP, styleConfig),
        }

        this._map.add(markObj.item)

        this._overlays.push(markObj)

        let eventsConfig = Object.assign(
            {},
            {
                click: null,
                mouseover: null,
                mouseout: null,
                dblclick: null
            },
            cfg.events
        )

        let keys = Object.keys(eventsConfig)
        //绑定事件
        keys.forEach((keyName) => {
            let event = eventsConfig[keyName]
            if (event) {
                markObj.item.on(keyName, (e) => {
                    eventsConfig[keyName](markObj.item, cfg, e)
                })
            }
        })
        return {
            item: markObj.item,
            config: cfg
        }
    },

    //自动缩放视野
    setFitView() {
        this._map.setFitView()
    },

    /**
     *
     * @param {_MAP} map
     * @param {string} boundary :'1223.2,32323.2;133232.4,3432432.6;'
     * @param {*Object} param2 选填  {styles:{...}||events:{...} }
     */
    drawPolygon(
        boundary,
        { styles, events, type = 'polygon' } = {},
        map = this._map
    ) {
        // console.log('map',map);
        if (!boundary) return

        let draw = (aryP) => {
            //样式
            let styleConfig = Object.assign(
                {},
                {
                    fillColor: '#000',
                    fillOpacity: 0.4,
                    strokeOpacity: 0.6,
                    strokeWeight: 1,
                    strokeColor: '#000',
                    draggable: false
                },
                styles
            )

            let eventsConfig = Object.assign(
                {},
                {
                    click: null,
                    mouseover: (overlay) => {
                        overlay.setOptions({
                            ...styleConfig,
                            ...{
                                fillOpacity: 0.8
                            }
                        })
                    },
                    mouseout: (overlay) => {
                        overlay.setOptions({
                            ...styleConfig
                        })
                    },
                    dblclick: null
                },
                events
            )

            let polygonObj = {
                type: type,
                item: new AMap.Polygon({
                    ...styleConfig,
                    ...{
                        path: aryP
                    }
                })

                // new BMap.Polygon(aryP, styleConfig),
            }

            this._overlays.push(polygonObj)

            let keys = Object.keys(eventsConfig)
            //绑定事件

            keys.forEach((keyName) => {
                let event = eventsConfig[keyName]
                if (event) {
                    polygonObj.item.on(keyName, (e) => {
                        eventsConfig[keyName](polygonObj.item, styleConfig, e)
                    })
                }
            })

            map.add(polygonObj.item)

            return {
                item: polygonObj.item,
                config: styleConfig,
                point: aryP
            }
        }

        if (Array.isArray(boundary)) {
            let list = []
            boundary.forEach((item, index) => {
                let aryPoint = item.split(';')
                let aryP = pointUtil(aryPoint)
                list.push(draw(aryP))
            })
            return list
        } else if (typeof boundary == 'string') {
            let aryPoint = boundary.split(';')
            let aryP = pointUtil(aryPoint)
            return draw(aryP)
        }

        function pointUtil(points) {
            let aryP = []

            points.forEach((item, index) => {
                let point = new AMap.LngLat(item.split(',')[0], item.split(',')[1])
                aryP.push(point)
            })
            return aryP
        }
    },

    // 经纬度坐标转成容器像素坐标
    lnglat2container(position) {
        // console.log(position)
        let lnglat = this.makeAMapPoint(position)
        let pixel = this._map.lnglatTocontainer(lnglat)
        return pixel.round()
    },
    // 容器像素坐标转成经纬度坐标
    container2lnglat(position) {
        let pixel = new AMap.Pixel(position[0], position[1])
        let lnglat = this._map.containerToLngLat(pixel)
        let result = [lnglat.lng, lnglat.lat]
        return result
    },

    //设置面板xy
    setPanelXY(item, dom) {
        let _dom = $(dom)
        if (!item || !dom) {
            return
        }
        let top = 90
        let left = 35
        let right = 390
        let currentPoint = item.panelOverlay.getPosition()
        let currentXY = this.lnglat2container([currentPoint.lng, currentPoint.lat])

        if (_dom.position().top + _dom.height() > window.innerHeight - top) {
            currentXY.y = window.innerHeight - _dom.height() - top
            let newPoint = this.container2lnglat([currentXY.x, currentXY.y])
            item.panelOverlay.setPosition(newPoint)
        }
        if (_dom.position().top - _dom.height() < top) {
            currentXY.y = top
            let newPoint = this.container2lnglat([currentXY.x, currentXY.y])
            item.panelOverlay.setPosition(newPoint)
        }

        if (_dom.position().left - _dom.width() < left) {
            currentXY.x = left
            let newPoint = this.container2lnglat([currentXY.x, currentXY.y])
            item.panelOverlay.setPosition(newPoint)
        }

        if (_dom.position().left + _dom.width() > window.innerWidth - right) {
            currentXY.x = window.innerWidth - _dom.width() - right
            let newPoint = this.container2lnglat([currentXY.x, currentXY.y])
            item.panelOverlay.setPosition(newPoint)
        }
    },

    //panel线
    drawpanelLine(item, el) {
        let that = $(el)
        let pixel = this.lnglat2container(item.position)
        // console.log( that.position().left);
        // that.options.linex = that.options.linex == 0 ? parseFloat(that.width()) / 2 : that.options.linex;
        // that.options.liney = that.options.liney == 0 ? (parseFloat(that.height()) / 2) + 6 : that.options.liney;

        // marker 相对屏幕的绝对位置 xy
        let x = pixel.x - that.width() / 2 + 134
        let y = pixel.y - that.height() / 2 + 80

        let cleft = that.position().left - x
        let ctop = that.position().top - y
        if (cleft > 0) {
            that.find('.u-panelineb').attr('style', 'width:' + cleft + 'px;right:0')
        } else {
            that
                .find('.u-panelineb')
                .attr('style', 'width:' + Math.abs(cleft) + 'px;left:0')
        }
        if (ctop > 0) {
            that
                .find('.u-panelinea')
                .attr('style', 'height:' + ctop + 'px;bottom:50%')
            that.find('.u-panelineb').css('bottom', 'initial')
        } else {
            that
                .find('.u-panelinea')
                .attr('style', 'height:' + Math.abs(ctop) + 'px;top:50%')
            that.find('.u-panelineb').css('bottom', '0')
        }
    },
    //交通
    //实时路况图层

    doTraffic() {
        let defaultConfig = {
            zIndex: 9999,
            autoRefresh: true, //是否自动刷新，默认为false
            interval: 10
        }
        setTimeout(() => {
            var trafficLayer = new AMap.TileLayer.Traffic(defaultConfig)
            trafficLayer.setMap(this._map)
        }, 200)
    },
    //根据类型获取overlays
    /**
     *
     * @param {*} type 'richMark|mark|polygon|stationPoint_richMark|station_richMark(地铁首末)|metro_polyline(地铁线)'
     */
    getOverlaysByType(type) {
        let overLays = []
        this._overlays.forEach((_overLay, index) => {
            if (_overLay.type == type) {
                overLays.push(_overLay)
            }
        })
        return overLays
    },

    //清除所有overlays
    clearAllOverlays() {
        this._overlays.forEach((_overLay) => {
            if (this._map && _overLay && _overLay.item) {
                this._map.remove(_overLay.item)
            }
        })
    }
}

export default AMapUtil
