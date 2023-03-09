/*
 * @Author: Arthur
 * @Date: 2023-02-17 14:15:57
 * @LastEditors: Arthur
 * @LastEditTime: 2023-03-09 11:47:55
 * @Description: file content
 */

import FileSaver from 'file-saver'
export default class fileSave {
  /**
   * 导出Excel文件
   * @param {*} res   文件流
   * @param {*} name  文件名
   */
  static getExcel(res, name) {
    let blob = new Blob([res], {
      type: 'application/vnd.ms-excel'
    })
    FileSaver.saveAs(blob, name + '.xlsx')
  }

  /**
   * 导出CSV文件
   * @param {*} res   文件流
   * @param {*} name  文件名
   */
  static getCsv(res, name) {
    let blob = new Blob([res], {
      type: 'application/vnd.ms-excel'
    })
    FileSaver.saveAs(blob, name + '.csv')
  }

  /**
   * 导出图片
   * @param {*} url 图片地址
   * @param {*} name  文件名
   */
  static getImgURLs(url, name) {
    let last = url.substring(url.lastIndexOf('.'), url.length)
    FileSaver.saveAs(url, `${name}${last}`)
  }

  static downLoadImg(res, filename) {
    let blob = new Blob([res], {
      type: 'image/jpeg'
    })
    FileSaver.saveAs(blob, `${filename}.jpg`)
  }
}
