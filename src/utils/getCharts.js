/*
 * @Author: wyx 
 * @Date: 2019-01-22 16:26:48 
 * @Last Modified by: drss.dong
 * @Last Modified time: 2020-04-01 15:02:29
 */
import Util from '@/utils/tool';
import { set } from 'shelljs';
let colorArr = ['#C23431', '#2F4654', '#F7CB4A', '#61A0A8', '#D38266', '#749F83', '#CA8723', '#90C6AD', '#90C6AD', '#CD5E3C'];

export default {
    /**
     * 获取雷达地图默认
     * @param {*} indicator
     * @param {*} data
     */
    getRadar: (indicator, data, color = []) => {
        let _color = ['red'];
        if (color) {
            _color = color;
        }
        return {
            color: _color,
            tooltip: {
                trigger: 'axis'
            },
            radar: [{
                indicator: indicator,
                radius: 70,
                center: ['50%', '50%'],
            }],
            series: [{
                type: 'radar',
                tooltip: {
                    trigger: 'item'
                },
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: data
            }]
        }
    },
    /**
     * 配置折线图，point根据数据变色
     * @param {*} xAxis 
     * @param {*} data 
     * @param {*} title 
     */
    getLineSetPoint(xAxis, data, title, colors = [], toolbox, yAxis) {
        let _toolbox = '';
        let _gridTop = '';
        if (toolbox && toolbox == 1) {
            _toolbox = {
                feature: {
                    saveAsImage: {},
                },
                right: 0,
                top: 0,
                showTitle: false,
                itemSize: 12,
            };
            _gridTop = 50;

        } else {
            _toolbox = '';
            _gridTop = 10;
        }
        return {
            // title : {
            //     text: title,
            //     x: 'left',
            //     align: 'right',
            //     textStyle:{
            //         color:'#666',
            //         fontSize:14,
            //         verticalAlign:'top',
            //     }
            // },
            // toolbox:_toolbox,
            xAxis: {
                type: 'category',
                data: xAxis,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#E7E9ED'
                    }
                },
                axisLabel: {
                    color: '#999999'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    let _unit = '';
                    if (yAxis && yAxis.length > 0) {
                        _unit = yAxis[0].name;
                    }
                    var relVal = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + _unit;
                    }
                    return relVal;
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: ['rgba(197,208,222,0.3)']
                    }
                },
                axisLabel: {
                    color: '#999999'
                }
            },
            grid: {
                // top: _gridTop,
                top: 10,
                left: '3%',
                right: '5%',
                bottom: 10,
                containLabel: true
            },
            series: [{
                name: title,
                data: data,
                type: 'line',
                symbolSize: 10,
                itemStyle: {
                    color: function (param) {
                        let _index = param.dataIndex;
                        let _color = '';
                        _color = colors[_index];
                        return _color;
                        /**
                        let _val = param.value;
                        let color = '';
                        cityWarinColor.forEach(e => {
                        	if (e.level <= _val) {
                        		color = e.color
                        		return false;
                        	}
                        });
                        return color;*/
                    },
                    borderWidth: 2
                },
                lineStyle: {
                    color: '#BFBFBF'
                }
            }]
        }
    },

    /**
     * 配置折线图，多条折线图
     * @param {*} xAxis 
     * @param {*} series 
     */
    getLineSetSeries(xAxis, series, yAxis) {
        let _yName;
        if (yAxis && yAxis.length) {
            _yName = yAxis[0].name

        }
        return {
            color: ['#E70020', '#6699CC', '#F29E56', '#669966', '#62B9B3'],
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    let _unit = '';
                    if (yAxis && yAxis.length > 0) {
                        _unit = yAxis[0].name;
                    }
                    var relVal = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + _unit;
                    }
                    return relVal;
                }
            },
            legend: {
                show: true,
                orient: 'vertical',
                right: '3%',
                top: '16',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: {
                    color: '#000',
                    fontSize: 12
                }
            },
            grid: {
                top: '15%',
                left: '3%',
                right: '20%',
                bottom: 10,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxis,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#E7E9ED'
                    }
                },
                axisLabel: {
                    color: '#999999'
                }
            },
            yAxis: {
                type: 'value',
                name: _yName,
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: ['rgba(197,208,222,0.3)']
                    }
                },
                axisLabel: {
                    color: '#999999'
                },
                nameTextStyle: {
                    padding: [0, 0, 0, -20],
                    color: '#999'
                }
            },
            // yAxis:_yAxis,
            series: series
        }
    },

    /**
     * 配置柱状体
     * @param {*} xAxis 
     * @param {*} series 
     */
    getbarSetSeries(legend, xAxis, series, xName, yName, color) {
        return {
            color: color,
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                show: legend,
                orient: 'vertical',
                top: '8',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: {
                    color: '#999',
                    fontSize: 10
                }
            },
            grid: {
                top: '20%',
                left: '3%',
                right: '10%',
                bottom: 10,
                containLabel: true
            },
            xAxis: {
                type: 'category',
                // boundaryGap: false,
                name: xName,
                nameTextStyle: {
                    color: '#999',
                    fontSize: 10,
                },
                data: xAxis,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#E7E9ED'
                    }
                },
                axisLabel: {
                    color: '#999999',
                    fontSize: 8,
                    interval: 0,
                }
            },
            yAxis: {
                type: 'value',
                name: yName,
                nameTextStyle: {
                    color: '#999',
                    fontSize: 10,
                    padding: [0, 0, 0, -30],
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: ['rgba(197,208,222,0.3)']
                    }
                },
                axisLabel: {
                    margin: 10,
                    color: '#999999'
                }
            },
            series: series
        }
    },
    /**
     * 配置柱状图(basic)
     * @param {*} xAxis 
     * @param {*} series 
     */
    getBasicBarSetSeries(xAxis, series, obj, yAxis) {
        let leftArr = [];
        let rightArr = [];
        let _yAxis = null;
        if (yAxis && yAxis.length) {
            _yAxis = []
            // 设置左右y周刻度相同

            series.forEach(item => {
                if (item.type == 'bar') {
                    leftArr = leftArr.concat(item.data)
                } else if (item.type == 'line') {
                    rightArr = rightArr.concat(item.data)
                }

            })
            let yMax1 = Math.ceil(Math.max.apply(null, leftArr)); //左轴最大值
            let yMax2 = Math.ceil(Math.max.apply(null, rightArr)); //左轴最大值
            let interval_left = Math.ceil(yMax1 / 4); //左轴间隔
            let interval_right = Math.ceil(yMax2 / 4); //右轴间隔
            yAxis.forEach((item, index) => {

                let list = {
                    type: 'value',
                    name: item.name,
                    min: 0,
                    max: index == 0 ? yMax1 : yMax2,
                    interval: index == 0 ? interval_left : interval_right,
                    nameTextStyle: {
                        color: '#999',
                        padding: [0, 0, 0, -38]
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: '#999999',
                        formatter: '{value}'
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['rgba(197,208,222,0.3)']
                        }
                    }

                }
                _yAxis.push(list)
            })
            _yAxis[0].nameTextStyle.padding = [0, 0, 0, -38]
            if (_yAxis[1]) {
                _yAxis[1].nameTextStyle.padding = [0, -25, 0, 0]
                _yAxis[1].splitLine.show = false
            }
        } else {
            _yAxis = {
                type: 'value',
                nameTextStyle: {
                    color: '#999',
                    padding: [0, 0, 0, -38]
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#999999',
                    formatter: '{value}'
                },
                splitLine: {
                    lineStyle: {
                        color: ['rgba(197,208,222,0.3)']
                    }
                }
            }
        }

        return {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    let _unit = '';
                    var relVal = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        if (yAxis && yAxis.length > 1) {
                            if (params[i].seriesType == 'bar') {
                                _unit = yAxis[0].name
                            } else {
                                _unit = yAxis[1].name
                            }
                        } else {
                            _unit = yAxis[0].name
                        }
                        relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + _unit;
                    }
                    return relVal;
                }
            },
            legend: obj.legend,
            grid: obj.grid,
            xAxis: {
                type: 'category',
                data: xAxis,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#E7E9ED'
                    }
                },
                axisLabel: {
                    color: '#999999'
                }
            },
            yAxis: _yAxis,
            series: series,
        }
    },

    /**
     * 配置饼图
     * @param {*} xAxis 
     * @param {*} series 
     */
    getPieEchart(series, colorList, optConfig, radius = ['50%', '70%']) {
        let color = colorList || colorArr;
        // if(optConfig&optConfig.)
        //series.data = series.data.sort(function (a, b) { return a.value - b.value; });
        return {
            color: color,
            grid: {
                top: 0,
                containLabel: true
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {d}%" //"{a} <br/>{b} : {c} ({d}%)"
            },
            ...optConfig,
            series: [{
                name: '',
                type: 'pie',
                center: ['50%', '50%'],
                radius,

                // avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: true,
                        formatter: '{b} {d}%',
                        position: 'top'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '13',
                            // fontWeight: 'bold'
                        }
                    }
                },

                data: [],
                ...series
            }],
            deep: true
        }
    },


    /**
     * 配置旭日图
     * @param {*} xAxis 
     * @param {*} data 
     * @param {*} title 
     */
    getdrinkFlavorsEchart(data) {
        return {
            series: {
                type: 'sunburst',
                highlightPolicy: 'ancestor',
                nodeClick: 'false',
                label: {
                    show: true
                },
                data: data,
                radius: [0, '95%'],
                sort: null,
                levels: [{}, {
                    r0: '15%',
                    r: '35%',
                    itemStyle: {
                        borderWidth: 2
                    },
                    label: {
                        rotate: 'tangential',
                        fontSize: 10,
                        textBorderWidth: 0,
                        color: '#fff'
                    }
                }, {
                    r0: '35%',
                    r: '95%',
                    label: {
                        position: 'outside',
                        padding: -120,
                        // silent: false,
                        fontSize: 10,
                        textBorderWidth: 0,
                        color: '#fff'
                    },
                    // emphasis:{
                    //     label:{show:true},
                    //     itemStyle:{color:'#E50020'}
                    // }
                }],

            },
            emphasis: {
                itemStyle: {
                    color: '#E50020'
                }
            }

        }
    },

    /**
     * 配置折柱混合图
     * @param {*} xAxis 
     * @param {*} series 
     * @param {*} yAxis 
     * @param {*} hasIcon  标识x轴label下面是否有icon
     * @param {*} list     当hasIcon为true时才需要
     */
    getmixedEchart(xAxis, series, yAxis, hasIcon = false, list = {}, toolbox) {
        // 下载
        let _isTitle = '';
        if (toolbox && toolbox == 1) {
            _isTitle = false;
        } else {
            _isTitle = true;
        }

        if (!series) {
            return false;
        }
        let _legendAllStr = '';
        let leftArr = [];
        let rightArr = [];
        //查看legend总长度
        series.forEach(item => {
            _legendAllStr += item.name;
        })
        let _yAxis = null;
        if (yAxis && yAxis.length) {
            _yAxis = [];
            // 设置左右y周刻度相同
            if (yAxis.length > 1) {
                series.forEach(item => {
                    if (item.type == 'bar') {
                        leftArr = leftArr.concat(item.data)
                    } else if (item.type == 'line') {
                        rightArr = rightArr.concat(item.data)
                    }
                })
            } else {
                series.forEach(item => {
                    leftArr = leftArr.concat(item.data)
                })
            }
            let yMax1 = calMax(leftArr) //左轴最大值
            let yMax2 = calMax(rightArr) //右轴最大值
            let interval_left = Math.ceil(yMax1 / 4); //左轴间隔
            let interval_right = Math.ceil(yMax2 / 4); //右轴间隔
            // 设置y轴
            yAxis.forEach((item, index) => {
                let list = {
                    type: 'value',
                    name: item.name,
                    // min:0,
                    // max:index==0?yMax1:yMax2,
                    // interval:index==0?interval_left:interval_right,
                    nameTextStyle: {
                        color: '#999',
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: '#999999',
                        formatter: '{value}',
                        // align:'right',
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['rgba(197,208,222,0.3)']
                        }
                    },

                }
                _yAxis.push(list)
            })
        } else {
            _yAxis = {
                type: 'value',
                nameTextStyle: {
                    color: '#999',
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#999999',
                    formatter: '{value}',
                    align: 'right',
                },
                splitLine: {
                    lineStyle: {
                        color: ['rgba(197,208,222,0.3)']
                    }
                }
            }
        }
        _yAxis[0].nameTextStyle.padding = [0, 0, 0, -28]
        if (_yAxis[1]) {
            _yAxis[1].nameTextStyle.padding = [0, -25, 0, 0]
            _yAxis[1].splitLine.show = false;
        }
        return {
            title: {
                text: series[series.length - 1].name,
                x: 'left',
                align: 'right',
                top: 0,
                textStyle: {
                    color: '#666',
                    fontSize: 14,
                    verticalAlign: 'top',
                },
                show: _isTitle,
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    let _unit = '';
                    var relVal = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        if (yAxis && yAxis.length > 1) {
                            if (params[i].seriesType == 'bar') {
                                _unit = yAxis[0].name
                            } else {
                                _unit = yAxis[1].name
                            }
                        } else {
                            _unit = yAxis[0].name
                        }
                        relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + _unit;
                    }
                    return relVal;
                }
            },
            legend: {
                itemWidth: 8,
                itemHeight: 10,
                textStyle: {
                    color: '#999',
                    fontSize: 12,
                },
                show: series.length > 1 ? true : false,
                top: 0
            },
            grid: {
                top: _legendAllStr.length >= 18 ? 60 : 60,
                left: '3%',
                right: '5%',
                bottom: 10,
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#E7E9ED'
                    }
                },
                axisLabel: {
                    color: '#999999',
                    formatter: (value) => {
                        let label = null
                        if (hasIcon) {
                            if (list && Object.keys(list).length) {
                                if (list[value]) {
                                    label = [
                                        '{title|' + value + '}',
                                        '{circle2|}',
                                    ].join('\n')
                                } else {
                                    label = [
                                        '{title|' + value + '}',
                                        '{circle|}',
                                    ].join('\n')
                                }
                            }
                        } else {
                            label = value
                        }
                        return label
                    },
                    rich: {
                        title: {
                            color: '#999999',
                            align: 'center',
                            lineHeight: 24
                        },
                        circle: {
                            width: 6,
                            height: 6,
                            borderWidth: 1,
                            borderColor: '#E70020',
                            borderRadius: [4, 4, 4, 4],
                            align: 'center',
                        },
                        circle2: {
                            width: 6,
                            height: 6,
                            borderWidth: 1,
                            borderColor: '#E70020',
                            borderRadius: [4, 4, 4, 4],
                            align: 'center',
                            backgroundColor: '#E70020',
                        }
                    }
                },
                data: xAxis,
            }],
            yAxis: _yAxis,
            series: series
        }
    },

    // ======山东投策========

    /**
     * 配置折柱混合图 
     * @param {*} xAxis 
     * @param {*} series 
     * @param {*} yAxis 
     */
    geteditLBEchart(xAxis, yAxis, series, optConfig = {}) {
        // let colorArr =  ['#91C7AE','#417AA9', '#CA8722']
        let _colorArr = colorArr;
        if (optConfig && optConfig.color) {
            _colorArr = optConfig.color
        }
        let leftArr = [];
        let rightArr = [];
        let _yAxis = null;
        let flagL = false;
        let flag = false;
        if (yAxis && yAxis.length) {
            _yAxis = []
            // 设置左右y周刻度相同
            series.forEach(item => {
                if (item.type == 'bar') {
                    leftArr = leftArr.concat(item.data)
                    // rightArr=rightArr.concat(item.data)
                    item.barWidth = optConfig && optConfig.barWidth || '';
                    item.barMaxWidth = optConfig && optConfig.barMaxWidth || '10';
                    item.data.forEach(el => {
                        if (el != '0') {
                            flagL = true;
                            return;
                        }
                    })
                } else if (item.type == 'line') {
                    rightArr = rightArr.concat(item.data)

                    item.data.forEach(el => {
                        if (el != '0') {
                            flag = true;
                            return;
                        }
                    })
                }

            })
            let yMax1 = Math.ceil(Math.max.apply(null, leftArr)); //左轴最大值
            let yMax2 = Math.ceil(Math.max.apply(null, rightArr)); //右轴最大值
            let interval_left = Math.ceil(yMax1 / 4); //左轴间隔
            let interval_right = Math.ceil(yMax2 / 4); //右轴间隔
            yAxis.forEach((item, index) => {

                let list = {
                    type: 'value',
                    name: item.name,
                    min: 0,
                    max: index == 0 ? yMax1 : yMax2,
                    interval: index == 0 ? interval_left : interval_right,
                    nameTextStyle: {
                        color: '#999',
                        padding: [0, -25, 0, 0]
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisLabel: {
                        color: '#999999',
                        formatter: '{value}'
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['rgba(197,208,222,0.3)']
                        }
                    }

                }
                if (optConfig) {
                    let _insertYAxis = optConfig.yAxis;
                    if (_insertYAxis && Array.isArray(_insertYAxis) && _insertYAxis.length - 1 >= index) {
                        let opt = _insertYAxis[index]
                        list = {
                            ...list,
                            ...opt
                        }
                    }
                }
                _yAxis.push(list)
            })
            if (flagL) {
                _yAxis[0].nameTextStyle.padding = [0, 0, 0, -28]
            }
            if (_yAxis[1]) {
                if (flag) {
                    _yAxis[1].nameTextStyle.padding = [0, -25, 0, 0]
                } else {
                    _yAxis[1].nameTextStyle.padding = [0, 25, 0, 0]
                }
                _yAxis[1].splitLine.show = false
            }
        } else {
            _yAxis = {
                type: 'value',
                nameTextStyle: {
                    color: '#999',
                    // padding:[0,0,0,-38]
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color: '#999999',
                    formatter: '{value}'
                },
                splitLine: {
                    lineStyle: {
                        color: ['rgba(197,208,222,0.3)']
                    }
                }
            }
        }
        let option = {
            color: _colorArr,
            tooltip: {
                trigger: 'axis',
                position: function (pos, params, dom, rect, size) {
                    var obj = [];
                    if ((pos[0] < size.viewSize[0] / 2)) {
                        obj = [pos[0], '10%']
                    } else {
                        obj = [pos[0] - 180, '10%']
                    }
                    return obj;
                },
                formatter: function (params) {
                    let _unit = '';
                    var relVal = params[0].name;
                    for (var i = 0, l = params.length; i < l; i++) {
                        if (yAxis && yAxis.length > 1) {
                            if (params[i].seriesType == 'bar') {
                                _unit = yAxis[0].name
                            } else {
                                _unit = yAxis[1].name
                            }
                        } else {
                            _unit = yAxis[0].name
                        }
                        let fLen = 2;
                        if (_unit == '套') {
                            fLen = 0
                        }
                        relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + Util.thousandsFormat(params[i].value, fLen) + _unit;
                    }
                    return relVal;
                }
            },
            legend: {
                show: true,
                // orient:'vertical',
                align: 'left',
                bottom: '0%',
                itemWidth: 8,
                itemHeight: 8,
                textStyle: {
                    color: '#666',
                    fontSize: 12
                },
                ...optConfig.legend || {}
            },
            grid: {
                top: 30,
                left: '3%',
                right: '3%',
                bottom: '20%',
                containLabel: true
            },

            xAxis: [{
                type: 'category',
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#E7E9ED'
                    }
                },
                axisLabel: {
                    color: '#999999',
                },
                data: xAxis,
            }],
            yAxis: _yAxis,
            series: series
        }
        return option;

    },
    // 横向柱状图 - 基础
    getXbarEchart(yAxisData, seriesData, seriesStyleConfig, rightyAxis, tooltipConfig = {}, xAxisCon = {}, gridCon = {}, color) {
        let yAxis = [{
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                color: '#999',

            },
            data: yAxisData
            // data: ['巴西','印尼','美国','印度','中国','世界人口(万)']
        }]
        if (rightyAxis) {
            yAxis.push(JSON.parse(JSON.stringify(yAxis[0])));
            yAxis[1] = {
                ...yAxis[1],
                ...rightyAxis
            }
        }

        let _color = color || ['#749F83']
        let option = {
            color: _color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                ...tooltipConfig
            },
            grid: {
                top: 10,
                left: '3%',
                right: '15%',
                bottom: '0',
                containLabel: true,
                ...gridCon
            },
            xAxis: {
                type: 'value',
                show: false,
                boundaryGap: [0, 0.01],
                ...xAxisCon
            },
            yAxis,
            series: [{
                // name: '2011年',
                type: 'bar',
                stack: '总量',
                z: 3,
                barMaxWidth: 24,
                label: {
                    normal: {
                        position: 'right',
                        show: true
                    },
                    formatter: function (value) {
                        return value + '%'
                    }
                },
                itemStyle: {
                    normal: {
                        barBorderRadius: [0, 2, 2, 0],
                    },
                },
                ...seriesStyleConfig,
                data: seriesData,
                // data: [18203, 23489, 29034, 104970, 131744, 630230]
            }, ]
        }
        return option
    },
    // 尖峰状形象图
    getHillEchart(xAxisData, yAxisData, colorList) {
        let _color = colorList || colorArr;
        let options = {
            color: _color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                formatter: "{a} <br/>{b} : {c}%"
                // formatter: function (params) {
                //     return params[0].name + ': ' + params[0].value;
                // }
            },
            xAxis: {
                data: yAxisData,
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#666666'
                    }
                }
            },
            yAxis: {
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            series: [{
                name: '年龄结构分析',
                type: 'pictorialBar',
                barCategoryGap: '-130%',
                symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
                itemStyle: {
                    normal: {
                        opacity: 0.5
                    },
                    emphasis: {
                        opacity: 1
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        formatter: function (params) {
                            return params.value + '%';
                        }
                    }
                },
                data: xAxisData,
                z: 10
            }]
        }
        return options;
    },
    getBarLineEchart(xAxisconfig, yAxisconfig, seriesBar, seriesLine) {

        let xAxis = [{
            "type": "category",
            "boundaryGap": true,
            "axisTick": {
                show: false
            },
            "axisLine": {
                show: false
            },
            "axisLabel": {
                show: true
            },
            "data": [],
            ...xAxisconfig
        }];
        let yAxis = [];
        yAxisconfig.forEach(opt => {
            let defaulty = {
                "type": "value",
                "scale": true,
                "name": "",
                "axisTick": {
                    show: false
                },
                "axisLine": {
                    show: false
                },
                "axisLabel": {
                    show: true
                },
            }
            let newopt = {
                ...defaulty,
                ...opt
            }
            yAxis.push(newopt)
        })
        let defaultOpt = {
            // "title": {
            //     // "text": "动态数据",
            //     // "subtext": "纯属虚构"
            // },
            "tooltip": {
                "trigger": "axis",
                "axisPointer": {
                    "type": "cross",
                    "label": {
                        "backgroundColor": "#283b56"
                    }
                }
            },
            "legend": {
                "data": [yAxis[0].name, yAxis[1].name],
                "bottom": 0,
            },
            "toolbox": {
                "show": true,
                "feature": {
                    "dataView": {
                        "readOnly": false
                    },
                    "restore": {},
                    "saveAsImage": {}
                }
            },
            "dataZoom": {
                "show": false,
                "start": 0,
                "end": 100
            },
            xAxis,
            yAxis,
            "series": [{
                "name": yAxis[0].name,
                "type": "bar",
                "data": [],
                //"data": [76, 707, 157, 651, 538, 477, 85, 106, 549, 382],
                ...seriesBar,
            }, {
                "name": yAxis[1].name,
                "type": "line",
                "xAxisIndex": 0,
                "yAxisIndex": 1,
                //"data": [9, 10.2, 6.8, 9.6, 8.1, 10.9, 14.1, 12.5, 13.4, 12.7]
                "data": [],
                ...seriesLine
            }]
        }
        return defaultOpt;
    },
    // 矩形树图
    getTreeMapEchart(seriesData, otherConfig) {
        let _color = ['#FBD39C', '#E49371', '#D56954', '#C9483F'];

        if (otherConfig && otherConfig.color) {
            _color = otherConfig.color;
        }
        let sortColorList = Util.getlinearGradientColorList('#FDD69E','#C9483F',seriesData.length);
        let MaxNum = Math.max.apply(null,seriesData.map(i=>i.value));
        
        seriesData.forEach(item=>{
            let cInd = parseInt(sortColorList.length * (item.value / MaxNum)) - 1;
            if (cInd < 0) {
                cInd = 0;
            }
            let defColor = sortColorList[cInd];
            item.color = defColor;
            item.itemStyle = {
                color: defColor
            }
        }) 
        return {
            color: _color,
            tooltip: {
                formatter: '{b0}: {c0}'
            },
            series: [{
                type: 'treemap',
                roam: false,
                nodeClick: false,
                breadcrumb: {
                    show: false
                },
                data: seriesData,
            }]
        }
    },

    // 两个横向柱状图
    getDbXbarEchart(yAxisData, seriesData, optConfig) {
        let _colorArr = ['#CD5E3C', '#478384'];
        if (optConfig && optConfig.color) {
            _colorArr = optConfig.color
        }
        let _yAxis = [];
        if (yAxisData && yAxisData.length > 0) {
            yAxisData.forEach((e, i) => {
                _yAxis.push({
                    type: 'category',
                    gridIndex: i,
                    name: e.title,
                    nameTextStyle: {
                        padding: [0, 40, 0, 0],
                        fontSize: '10',
                    },
                    axisLabel: {
                        textStyle: {
                            fontSize: '10',
                            color:'#666666'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    data: e.data,
                })
            })
        }
        _yAxis[1].nameTextStyle.padding = [0, 0, 0, 310];
        _yAxis[1].nameLocation = 'end';
        _yAxis[1].position = 'right';

        let _legend = [];
        let _series = [];
        
        if (seriesData && seriesData.length > 0) {
            seriesData.forEach((e, i) => {
                let legconf = {};
                if (optConfig.legend) {
                    legconf = optConfig.legend;
                }
                _legend.push({
                    data: [seriesData[i]['title']],
                    left: '20%',
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        fontSize: '10'
                    },
                    selectedMode: false,
                    ...legconf
                });

                let MaxNum = Math.ceil(Math.max.apply(null, seriesData[i].data)) || 1;
                // let MaxNum = Math.ceil(Math.max.apply(null, seriesData[i].data));
                let __filterData = [];
                seriesData[i]['data'].forEach(element => {
                    __filterData.push({
                        value: element,
                        label: {
                            normal: {
                                show: true,
                                position: element < MaxNum / 3 ? 'right' : 'insideRight',
                                fontSize: '10',
                            }
                        }
                    })
                });
                
                _series.push({
                    name: seriesData[i]['title'],
                    type: 'bar',
                    // stack: seriesData[i]['title'],
                    xAxisIndex: i,
                    yAxisIndex: i,
                    z: 3,
                    // label: {
                    //     normal: {
                    //         show: true,
                    //         position:_position,
                    //         fontSize:'10',
                    //     }
                    // },
                    itemStyle: {
                        normal: {
                            barBorderRadius: [0, 2, 2, 0],
                        },
                    },
                    data: __filterData
                });
                _series.push({
                    type: 'bar',
                    // stack: seriesData[i]['title'],
                    xAxisIndex: i,
                    yAxisIndex: i,
                    barGap:'-100%',
                    // barCategoryGap:'20%',
                    itemStyle: {
                        normal: {
                            color: '#BCC5D0',
                            barBorderRadius: [0, 2, 2, 0],
                        }
                    },
                    data: seriesData[i]['data'].map(function (key) {
                        // var dataString = Math.ceil(Math.max.apply(null, seriesData[i]['data']));
                        var dataString = Math.ceil(Math.max.apply(null, seriesData[i]['data'].map(Number))) || 1;
                        return dataString// - key
                    })
                });
                

            });
        }
        _legend[1]['left'] = '55%';

        return {
            etype: 'doubleHbar',
            color: _colorArr,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                show: false,
            },
            legend: _legend,
            grid: [{
                show: false,
                left: '3%',
                top: '20%',
                bottom: '0',
                containLabel: true,
                width: '45%',
            }, {
                show: false,
                left: '52%',
                top: '20%',
                bottom: '0',
                containLabel: true,
                width: '45%',
            }, ],
            xAxis: [{
                gridIndex: 0,
                type: 'value',
                show: false,

            }, {
                gridIndex: 1,
                type: 'value',
                show: false,
            }],
            yAxis: _yAxis,
            series: _series,
        }
    },
    getBarListEchart(chartData) {
        let xAxisData = chartData.xAxis,
            seriesDataList = chartData.aSeries,
            aUnit = chartData.aUnit;
        let series = []
        let legend = []
        let tooltipFormatter = `{b}`
        let dataList = []
        let lengedInfoList = []
        chartData.aLegend.forEach((item, index) => {
            let unit = ''
            if (aUnit) {
                if (index < aUnit.length) {
                    unit = `(${aUnit[index]})`

                } else {
                    unit = `(${aUnit[aUnit.length - 1]})`
                }
            }
            tooltipFormatter += `<br/>{a${index}} : {c${index}}${unit}`
            let defaultSeriesItem = {
                name: item,
                type: 'bar',
                stack: '总量',
                barWidth: '20px',
                label: {
                    show: false,
                    normal: {
                        show: false,
                        position: 'insideRight'
                    }
                },
                data: seriesDataList[index] //[120, 132, 101, 134, 90, 230, 210]
            }
            seriesDataList[index].forEach((numVal, numind) => {
                if (typeof dataList[numind] == 'undefined') {
                    dataList[numind] = 0
                }
                dataList[numind] += Number(numVal)
            })
            series.push(defaultSeriesItem)
            legend.push(item)
            lengedInfoList.push({
                name: item,
                unit
            })
        })
        let yAxisMax = Math.max.apply(Math, dataList);
        if (yAxisMax / 1000 > 1) {
            yAxisMax = Math.ceil(yAxisMax / 1000) * 1000
        }

        let option = {
            color: ['#C23431', '#2F4654', '#91C7AE'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                },
                "textStyle": {
                    "fontSize": 12,
                    "color": "#fff"
                },
                formatter: tooltipFormatter, //`{a} <br/>{b0} : {c0}${chartData.aUnit[0]}<br/>{b1} : {c1}${chartData.aUnit[0]}`,
                formatter: function (tipLabel) {
                    let axisValue = ''
                    let contentHtml = ''
                    tipLabel.forEach((label, index) => {
                        //label.value = label.value +'万元'
                        axisValue = label.axisValue
                        let unit = '';
                        if (aUnit) {
                            if (index < aUnit.length) {
                                unit = aUnit[index] ? `(${aUnit[index]})` : ''

                            } else {
                                unit = `(${aUnit[aUnit.length - 1]})`
                            }
                        }
                        let fLen = 2;
                        if (unit=='(套)') {
                            fLen = 0
                        }
                        contentHtml += (label.seriesName + ' : ' + Util.thousandsFormat(label.value, fLen) + unit + '<br>')
                    })

                    return `<span>${axisValue}<br>${contentHtml}</span>`;
                }
            },
            legend: {
                "itemWidth": 8,
                "itemHeight": 8,
                "bottom": "0%",
                "textStyle": {
                    fontSize: 10
                },
                "data": legend, //['直接访问', '邮件营销','联盟广告','视频广告','搜索引擎']
                "formatter": function (name) {
                    let seriy = lengedInfoList.find(sery => {
                        return sery.name == name
                    })
                    let unit = ''
                    if (seriy) {
                        unit = `${seriy.unit}`
                    }
                    return name + unit
                }
            },
            grid: {
                "top": 30,
                "left": "3%",
                "right": "3%",
                "bottom": "20%",
                "containLabel": true
            },
            yAxis: {
                name: chartData.aUnit[0],
                nameTextStyle: {
                    fontSize: 10,
                    color: '#999',
                    padding: [0, 20, 0, 0],
                    align: 'left',
                },
                min: 0,
                // "max": yAxisMax,
                type: 'value',
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: ["rgba(197,208,222,0.3)"],
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 10,
                        color: '#999',
                        align: 'right'
                    }
                },
                "splitLine": {
                    //刻度对齐线
                    "lineStyle": {
                        "color": ["rgba(197,208,222,0.3)"]
                    }
                },
                // max: function(value) {
                //     return value.max + 10;
                // }
            },
            xAxis: {

                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        fontSize: 10,
                        color: '#999'
                    }
                },
                type: 'category',
                data: xAxisData //['周一','周二','周三','周四','周五','周六','周日']
            },
            series
        };

        return option
    },
    getLineBarEchart(colorList, xAxisData, yAxisOpt = [], seriesList = [], mainOption = {}, aUnit) {
        // 设置echart的默认颜色列表
        let color = colorList || ["#C23431", "#F7CB4A"];

        let yAxis = [];
        let series = [];
        let legend = [];
        let tooltipFormatter = `{b}`;
        // 默认折线图配置
        let defaultLineSeriesOpt = {
            "name": "",
            "type": "line",
            "yAxisIndex": 0,
            "data": [], //[5, 10, 15, 20],
            "symbolSize": 6,
            //"color": ["#F7CB4A"],
            "itemStyle": {
                "normal": {

                }
            }
        }
        let lengedInfoList = []
        // 默认柱状图配置
        let defaultBarSeriesOpt = {
            "name": "",
            "type": "bar",
            "data": [], //[500, 1000, 15000, 2000],
            "barMaxWidth": 20,
            //"color": ["#2F4654"],
            "itemStyle": {
                "normal": {
                    "barBorderRadius": [2, 2, 0, 0]
                }
            }
        }
        let rightYarr = []; // 右轴所有值的Y值
        let leftYarr = []; // 左轴所有值的Y值
       

        seriesList.forEach((charts, index) => {
            let opt;
            let unit = '';
            if (aUnit) {
                if (index < aUnit.length) {
                    unit = `(${aUnit[index]})`

                } else {
                    unit = `(${aUnit[aUnit.length - 1]})`
                }

            }
            tooltipFormatter += `<br/>{a${index}} : {c${index}}${unit}`
            legend.push(charts.name)
            lengedInfoList.push({
                name: charts.name,
                unit
            })
            if (charts.type == "line") {
                opt = {
                    ...defaultLineSeriesOpt,
                    ...charts,
                    unit
                };

            } else {
                opt = {
                    ...defaultBarSeriesOpt,
                    ...charts,
                    unit
                }
            }
            if (charts.yAxisIndex) {
                rightYarr = rightYarr.concat(charts.data)
            } else {
                leftYarr = leftYarr.concat(charts.data)
            }
            series.push(opt)
        })
        let MaxNumList = [];
        if (leftYarr.length > 0) {
            MaxNumList.push(Math.ceil(Math.max.apply(null, leftYarr))); // left轴最大值
        }
        if (rightYarr.length > 0) {
            MaxNumList.push(Math.ceil(Math.max.apply(null, rightYarr))); // right轴最大值
        }
        let intervalList = []
        MaxNumList.forEach(max => {
            if (max > 1) {
                let intMaxNum = parseInt(max)
                let maxintStr = (intMaxNum + '');
                let len = (intMaxNum + '').length
                let lastMax = 10;
                if (len == 1) {
                    lastMax = intMaxNum + 1
                } else {

                    lastMax = (+maxintStr[0] + 1) * Math.pow(10, len - 1)
                }
                //    console.log(lastMax)
                intervalList.push((Math.ceil(lastMax)));
            }

        })
        // console.log(MaxNumList, intervalList)
        // let interval_left =  (yMax1 / 5);//左轴间隔
        // let interval_right = (yMax2 / 5);//右轴间隔
        // yMax1/y =4= yMax2/x
        //配置Y轴的选项
        yAxisOpt.forEach((opt, index) => {
            let padding = [0, 38, 0, 0];
            if (index) {
                padding = [0, 0, 0, 0];
            }
            
            let defaultyAxisOpt = {
                "type": "value", //设置y轴为值
                "name": aUnit[index], //顶部名称 
                "min": 0,
                "max": intervalList[index],
                // "interval": intervalList[index],
                "nameTextStyle": {
                    fontSize: 10,
                    "color": "#999",
                    padding
                },
                //坐标轴上的刻度
                "axisTick": {
                    "show": false
                },
                //坐标轴线
                "axisLine": {
                    "show": false
                },
                //坐标轴上的标签
                "axisLabel": {
                    "show": false
                },
                "splitLine": {
                    //刻度对齐线
                    "lineStyle": {
                        fontSize: 10,
                        "color": ["rgba(197,208,222,0.3)"]
                    }
                },
                "color": "#999999"
            }
            yAxis.push({
                ...defaultyAxisOpt,
                ...opt,
            })
        })

        let option = {
            color,
            "tooltip": {
                "trigger": "axis",
                //"formatter":tooltipFormatter,
                formatter: function (tipLabel) {
                    let axisValue = ''
                    let contentHtml = ''
                    tipLabel.forEach(label => {
                        //label.value = label.value +'万元'
                        let seriy = lengedInfoList.find(sery => {
                            return sery.name == label.seriesName
                        })
                        let unit = ''
                        if (seriy) {
                            unit = `${seriy.unit}`
                        }
                        let fLen = 2;
                        if (unit == '套' || unit == '(套)') {
                            fLen = 0
                        }
                        
                        axisValue = label.axisValue
                        contentHtml += (label.seriesName + ' : ' + Util.thousandsFormat(label.value, fLen) + unit + '<br>')
                    })

                    return `<span>${axisValue}<br>${contentHtml}</span>`;
                },
                "textStyle": {
                    "fontSize": 12,
                    "color": "#fff"
                },
            },
            "legend": {
                "show": true,
                "align": "left",
                "bottom": "0%",
                "itemWidth": 8,
                "itemHeight": 8,
                "textStyle": {
                    "fontSize": 10,
                    "color": "#666"
                },
                "data": legend,
                // "formatter": function (name) {
                //     let seriy = series.find(sery => {
                //         return sery.name == name
                //     })
                //     let unit = ''
                //     if (seriy) {
                //         unit = `${seriy.unit}`
                //     }
                //     return name + unit
                // }
            },
            "grid": {
                "top": 30,
                "left": "3%",
                "right": "3%",
                "bottom": "20%",
                "containLabel": true
            },
            //x轴选项配置
            "xAxis": [{
                "type": "category", //设置X轴分类
                //
                "axisTick": {
                    "show": false
                },
                "axisLine": {
                    "lineStyle": {
                        "color": "#E7E9ED"
                    }
                },
                "axisLabel": {
                    fontSize: 10,
                    "color": "#999999"
                },
                "data": xAxisData //["2013", "2014", "2015", "2016", "2017"]
            }],
            yAxis,
            series,
            ...mainOption
        };
        return option
    },
    // 散点图 - 基础
    getScatterEchart(seriesData, unit, color, seriesStyleConfig) {
        let _color = color || ['#749F83', '#50A7EE'];
        let _series = [];
        let itemSeries = {};
        if (seriesData && seriesData.length > 1) {
            seriesData.forEach((item, index) => {
                itemSeries = {
                    type: 'scatter',
                    data: item,
                    // itemStyle: {
                    //     normal: {
                    //         color:_color[index]
                    //     }
                    // },
                    ...seriesStyleConfig,
                }
                _series.push(itemSeries);
            });
        } else {
            itemSeries = {
                type: 'scatter',
                data: seriesData[0],
                // itemStyle: {
                //     normal: {
                //         color:_color
                //     }
                // },
                ...seriesStyleConfig,
            }
            _series.push(itemSeries)
        }
        let option = {
            color: _color,
            grid: [{
                show: false,
                left: '10%',
                right: '3%',
                top: '15%',
                bottom: '15%',
                containLabel: true,
            }, ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                }
            },
            xAxis: {
                scale: true,
                name: unit ? unit[0] : '',
                "nameTextStyle": {
                    fontSize: 8,
                    "color": "#999",
                    "padding": [0, 0, -50, -20]
                },
                "axisLine": { //y轴
                    "show": false

                },
                "axisTick": { //y轴刻度线
                    "show": false
                },
                "splitLine": { //网格线
                    "show": false
                }
            },
            yAxis: {
                scale: true,
                name: unit ? unit[1] : '',
                "nameTextStyle": {
                    fontSize: 8,
                    "color": "#999",
                    "padding": [0, 0, 0, -38]
                },
                "axisLine": { //y轴
                    "show": false,
                },
                "axisTick": { //y轴刻度线
                    "show": false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ['#eaeaea'],
                    }
                }
            },
            series: _series,
        }
        return option
    },
    // 散点图 - 高级
    getWkScatterEchart(seriesData, schema, colors, effectData=[],seriesStyleConfig) {
        let _colors = colors || ['#0144CF', '#3C3386','#5F83CF'];
        let option = {
            backgroundColor: 'rgba(0, 0, 0, 0)',
            color: _colors,
            legend: {
                y: 'top',
               show: false,
                textStyle: {
                    color: '#fff',
                    fontSize: 16
                }
            },
            grid: {
                x: '10%',
                x2: 150,
                y: '18%',
                y2: '10%'
            },
            // tooltip: {
            //     show:true,
            //     padding: 10,
            //     backgroundColor: '#222',
            //     borderColor: '#777',
            //     borderWidth: 1,
            //     formatter: function (obj) {
            //         var value = obj.value;
            //         console.log(value,2)
            //         return '<div class="scatterTooltip" style="font-size:16px;">'+ value[2]+ '<div class="vk_colse_box"><i class="vk_colse iconfont iconguanbi"></i></div></div>'
            //             + schema[0].name + '：' + value[0] + schema[0].unit +'<br>'
            //             + schema[1].name + '：' + value[1] + schema[1].unit +'<br>'
            //     },
            //     triggerOn: 'click',
            //     enterable:'true'
            // },
            xAxis: {
                        name:schema[0].name,
                        nameTextStyle: {
                            color: '#fff',
                            fontSize: 14
                        },
                        axisLabel: {
                            // show: false,
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#848F9D'
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                type: 'dashed',
                                color: '#222'
                            }
                        }
                    },
                    yAxis: {
                        name: schema[1].name,
                        nameTextStyle: {
                            color: '#fff',
                            fontSize: 14
                        },
                        axisLabel: {
                            // show: false,
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#848F9D'
                            }
                        },
                        splitLine: {
                            show: false,
                            lineStyle: {
                                type: 'dashed',
                                color: '#222'
                            }
                        },
                        scale: true
                    },
            
            series: [
                {
                    type: 'scatter',
                    data: seriesData,
                  
                    label: {
                        emphasis: {
                            show: false,
                            formatter: function (param) {
                                return param.data[2];
                            },
                            position: 'top'
                        }
                    },
                    symbolSize: function (data) {
                        return 10;
                    },
                    itemStyle: {
                        normal: {
                            // shadowBlur: 30,
                            // shadowColor: 'rgba(25, 100, 150, 0.5)',
                            // shadowOffsetY: 30,
                            // color: (params) => {
                            //     return colors[params.value[3]] ? colors[params.value[3]] : colors[0];
                            // }
                        }
                    },
                   
                    ...seriesStyleConfig
                },
                {
                    type: 'effectScatter',
                    symbolSize: 10,
                    zIndex:1,
                    zlevel: 1,
                    data: effectData,
                    // data: [[2,5],[5,6]],
                    itemStyle: {
                        color: 'rgba(0,0,0,0)',
                    },
                    label: {
                        normal: {
                            show: true,
                            clickable:true,
                            formatter: function(params) {
                                let tooltipTitle  = seriesData.find((e)=>{
                                   return params.value[0]==e[0] && params.value[1]==e[1]
                                })
                                return tooltipTitle[2]+'\n'+schema[0].name+'：'+params.value[0]+'  '+schema[0].unit+'\n'+schema[1].name + '：' + params.value[1] + schema[1].unit
                            },
                            position:'left',
                            backgroundColor: 'rgba(49,51,61,0.9)',
                            padding: [10, 10],
                            borderRadius: 3,
                            lineHeight: 24,
                            shadowColor: 'rgba(0,0,0,0.9)',
                            shadowBlur:10,
                            shadowOffsetX:'5',
                            shadowOffsetY:'5',
                            color: '#f7fafb',
                            rich:{
                                fline:{
                                    padding: [0, 10, 10, 10],
                                    color:'#ffffff'
                                },
                                tline:{
                                    padding: [10, 10, 0, 10],
                                    color:'#ffffff'
                                }
                            }
                        },
                        emphasis: {
                            show: true
                        }
                    },
                   
                },
               
            ]
        }
        return option
    },
    // 各种图配置 堆叠图
    /**
     * data: 传入的数据
     * optConfig: 其他配置项
     * */
    getStackEchart(data, optConfig) {
        const series = data.series.map(item => {
            return {
                ...item,
                ...optConfig.series
            }
        })
        const option = {
            color: optConfig.color || colorArr,
            grid: optConfig.grid,
            legend: {
                data: data.legend,
                ...optConfig.legend
            },
            tooltip: optConfig.tooltip,
            xAxis: [{
                type: "category",
                axisTick: {
                    "alignWithLabel": true
                },
                data: data.xAxis,
                ...optConfig.xAxis
            }],
            yAxis: data.yAxis,
            series,
        }
        return option
    }
}