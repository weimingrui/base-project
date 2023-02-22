/*
 * @Author: wyx huapeng Arthur
 * @Date: 2019-04-29 14:34:02
 * @Last Modified by: drss.dong
 * @Last Modified time: 2020-03-31 16:47:37
 */
import moment from 'moment'
export default class Util {
    /**
     * 数字加千位符
     * @param {*} num 数字
     * @param {*} precision 保留的小数位数
     *
     * 测试:
     * console.log(thousandsFormat(569875.206, 2))   // 569,875.21
     * console.log(thousandsFormat(569875.206, 0))   // 569,875
     * console.log(thousandsFormat('569875.206', 6))   // 569,875.206000
     * console.log(thousandsFormat('sd222', 2))   // sd222
     * console.log(thousandsFormat('', 2))   // ''
     * console.log(thousandsFormat('2019年')); // 2019年
     * console.log(thousandsFormat('2019-6-8')); //2019-6-8
     */
    static thousandsFormat(num, precision = 0) {
        if (typeof num == 'string' && !num.trim()) {
            return ''
        }
      num = isNaN(Number(num)) ? num : parseFloat(num)
    // num = isNaN(parseFloat(num)) ? num : parseFloat(num);
      num = (num.toFixed ? num.toFixed(precision) : num) + ''
      if (!num.includes('.')) num += '.'
      return num
          .replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
              return $1 + ','
          })
          .replace(/\.$/, '')
  }

    //是否mac系统
    static isMac() {
        return navigator.platform.includes('Mac')
    }
    /**
     * 手动触发页面resize
     */
    static dispatchDefine() {
        setTimeout(() => {
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            let resizeEvent = window.document.createEvent('UIEvents')
            resizeEvent.initUIEvent('resize', true, false, window, 0)
            window.dispatchEvent(resizeEvent)
        } else {
          window.dispatchEvent(new Event('resize'))
      }
    }, 0)
  }

    /**
     * color=>rgba
     */
    static colorToRGBA(color, opacity) {
      if (color.substr(0, 1) == '#') color = color.substring(1)
      if (color == 'transparent') {
          return 'rgba(0,0,0,0)'
      }
      if (color.length != 6) return ''

      color = color.toLowerCase()

      var rgb = new Array()
      for (var x = 0; x < 3; x++) {
          rgb[0] = color.substr(x * 2, 2)
        rgb[3] = '0123456789abcdef'
        rgb[1] = rgb[0].substr(0, 1)
        rgb[2] = rgb[0].substr(1, 1)
        rgb[20 + x] = rgb[3].indexOf(rgb[1]) * 16 + rgb[3].indexOf(rgb[2])
    }
      return (
          'rgba(' + rgb[20] + ',' + rgb[21] + ',' + rgb[22] + ',' + opacity + ')'
      )
  }

    //uuid
    static uuid() {
      var s = []
      var hexDigits = '0123456789abcdef'
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'

      var uuid = s.join('')
      return uuid
  }

    /**
     * 判断一个值是否有效，并返回相对应的值， 用于详情字段展示
     * @param {初始值} initialData
     * @param {判断类型：一般两种，String和Number} type
     */
    static finallyData(initialData, type, nodataShow = '-') {
        let _finallyData = ''
        if (initialData != null) {
            switch (type) {
                case 'String':
              _finallyData = initialData ? initialData : nodataShow
              break
          case 'Number':
                _finallyData =
                    Number(initialData.split(',').join('')) > 0
                        ? initialData
                        : nodataShow
                break
        }
    }
      return _finallyData
  }

    /**dom has class */
    static addClass(obj, cls) {
        var obj_class = obj.className, //获取 class 内容.
            blank = obj_class != '' ? ' ' : '' //判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
        var added = obj_class + blank + cls //组合原来的 class 和需要添加的 class.
        obj.className = added //替换原来的 class.
    }
    /** dom removeClass */
    static removeClass(obj, cls) {
      var obj_class = ' ' + obj.className + ' ' //获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
      obj_class = obj_class.replace(/(\s+)/gi, ' ') //将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
      var removed = obj_class.replace(' ' + cls + ' ', ' ') //在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
      removed = removed.replace(/(^\s+)|(\s+$)/g, '') //去掉首尾空格. ex) 'bcd ' -> 'bcd'
      obj.className = removed //替换原来的 class.
  }

    /** dom hasClass */
    static hasClass(obj, cls) {
        var obj_class = obj.className, //获取 class 内容.
          obj_class_lst = obj_class.split(/\s+/) //通过split空字符将cls转换成数组.
      var x = 0
      for (x in obj_class_lst) {
        if (obj_class_lst[x] == cls) {
            //循环数组, 判断是否包含cls
            return true
        }
    }
        return false
    }
    /**
     * @description: moment 自定义时间函数
     * @param {type}
     * @return:
     */
    static Moment() {
      let _ = function () { }
      _.prototype.getMoment = function () {
          return moment
      }
      _.prototype.getCurYear = function () {
          return moment().format('YYYY')
      }
      _.prototype.getCurMonth = function () {
          return moment().format('MM')
      }
      _.prototype.getBeforeYearsList = function (years = 0, format = 'YYYY') {
          let arr = new Array(+years + 1).fill('1')
          arr = arr.map(function (year, ind) {
              year = moment()
                  .subtract(ind, 'years')
                  .format(format)
              return year
          })

        return arr
    }
      _.prototype.getAfterYearsList = function (years = 0, format = 'YYYY') {
          let arr = new Array(+years + 1).fill('')
          arr.map((year, ind) => {
          return moment()
              .add(ind, 'years')
              .format(format)
      })
        return arr
    }

        return new _()
    }
    static copyObject(obj = {}) {
        try {
            return JSON.parse(JSON.stringify(obj))
        } catch (e) {
            console.error(e)
        }
    }
    /**
     * @description: 获取颜色渐变数值
     * @param {type}
     * @return:
     */
    static getlinearGradientColorList(start, end, steps, gamma) {
      var pad = function (s) {
          return s.length === 1 ? '0' + s : s
      }
      var parseColor = function (hexStr) {
          return hexStr.length === 4
              ? hexStr
                  .substr(1)
                  .split('')
                  .map(function (s) {
                      return 0x11 * parseInt(s, 16)
            })
              : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(
                  function (s) {
                      return parseInt(s, 16)
                  }
              )
      }
      var i,
          j,
          ms,
          me,
          output = [],
          so = []
      gamma = gamma || 1
      var normalize = function (channel) {
          return Math.pow(channel / 255, gamma)
      }
      start = parseColor(start).map(normalize)
      end = parseColor(end).map(normalize)
      for (i = 0; i < steps; i++) {
        ms = i / (steps - 1)
        me = 1 - ms
        for (j = 0; j < 3; j++) {
          so[j] = pad(
              Math.round(
                  Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255
              ).toString(16)
          )
      }
        output.push('#' + so.join(''))
    }
        return output
    }
    /**
     * @description: 新窗口开启新route
     * @param {type}
     * @return:
     */
    static openNewPageRouter(_this, config) {
        if (localStorage.getItem('powersign') == '1') {
        _this.$router.push(config)
    } else {
        const { href } = _this.$router.resolve({
            ...config,
            query: { ...config.query, isOpenNewPage: true }
        })

            window.open(href, '_blank')
        }
    }
    /**
     * @description: 获取账号是否有可以下载权限
     * @param {string} JG 机构名称 sz sd nj wanke
     * @return:
     */
    static getEnableExport(JG) {
      if (localStorage.getItem('tc_isEnableExport_' + JG) == '1') {
        return false
    } else {
          return true
      }
  }

    //hex转rgba
    static hexToRgba(hex, opacity = 1) {
      var RGBA =
          'rgba(' +
          parseInt('0x' + hex.slice(1, 3)) +
          ',' +
          parseInt('0x' + hex.slice(3, 5)) +
          ',' +
          parseInt('0x' + hex.slice(5, 7)) +
          ',' +
          opacity +
          ')'
      return {
          red: parseInt('0x' + hex.slice(1, 3)),
          green: parseInt('0x' + hex.slice(3, 5)),
          blue: parseInt('0x' + hex.slice(5, 7)),
          rgba: RGBA
      }
  }

  /*
      数字转成每三位，用逗号分隔
    */
    static formatNum(num = '') {
      if (typeof num === 'number') {
          num = String(num)
      }
      if (num && num.length < 4) {
          return num
      }
      if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(num)) {
          return num
      }
      var a = RegExp.$1,
          b = RegExp.$2,
            c = RegExp.$3
        var re = new RegExp().compile('(\\d)(\\d{3})(,|$)')
        while (re.test(b)) b = b.replace(re, '$1,$2$3')
        return a + '' + b + '' + c
    }
    /**
     * bgColorClass
     * 说明：设置标签颜色
     * 类名参考 map.scss  line356往后
     * base: 判断基准
     * type: 1: 土地类型 （默认） 2: 楼盘类型
     */
    static bgColorClass(base, type = 1) {
        let bgColorClass = ''

      if (type == 1) {
          switch (base) {
            case '人气盘':
                bgColorClass = 'bc_hot'
                break
            case '标杆盘':
                bgColorClass = 'bc_model'
                break
            case '大盘':
                bgColorClass = 'bc_big'
                break
            case '普通盘':
                bgColorClass = 'bc_normal'
                break
        }
    } else {
        switch (base) {
            case '纯住宅':
                bgColorClass = 'bc_house'
                break
            case '商住':
                bgColorClass = 'bc_businessHouse'
                break
            case '商办':
                bgColorClass = 'bc_businessOffice'
                break
            case '综合':
                bgColorClass = 'bc_complex'
                break
        }
    }

        return bgColorClass
    }
}
