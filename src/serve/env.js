/*
 * @Author: your name
 * @Date: 2019-10-31 15:11:00
 * @LastEditTime: 2020-05-19 14:52:11
 * @LastEditors: Arthur
 * @Description: In User Settings Edit
 * @FilePath: /tzjc/src/serve/env.js
 */


let apiPath = ''; //api 
let fileUrl = ''; //文件系统
let jg = process.env.VUE_APP_JG;
if (process.env.NODE_ENV == 'development') {
    apiPath = 'http://api.cricyun.com/server/index.php?g=Web&c=Mock&o=simple&projectID=16&uri=';

    apiPath = 'http://decision.test.dev.cricyun.com';

  if (jg == 'fujian') {
        //福建模拟接口
        apiPath = 'http://api.cricwifi.com/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri=';
        apiPath = ' http://decision.youzhan.dev.cricwifi.com';
        apiPath = 'http://decision.zfx.dev.cricwifi.com'
        apiPath = 'http://decision.ddc.dev.cricwifi.com'
        // apiPath = 'http://dztzjc.cric.com/tzjcapi'

        apiPath = 'http://api.cricyun.com/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri='
        apiPath = 'http://decision.ddc.dev.cricwifi.com/';
        apiPath = 'http://decision.youzhan.dev.cricwifi.com';
        // apiPath = 'http://decision.zfx.dev.cricwifi.com';
        apiPath = 'http://decision.test.dev.cricwifi.com';
        apiPath = 'http://beta.dztzjc.cricbigdata.com/tzjcapi'
        // apiPath = 'http://dztzjc.cric.com/tzjcapi'
        // fileUrl = 'http://dfs.zfx.dev.cricwifi.com/'
        // fileUrl = "http://dfs.cricbigdata.com";

    } 
  
} else if (process.env.NODE_ENV == 'production') {
    // fileUrl = "http://file.cricbigdata.com";
    fileUrl = "http://dfs.cricbigdata.com";
    //beta
    if (process.env.VUE_APP_ENVS == 'beta') {
        apiPath = "http://beta.dztzjc.cricbigdata.com/tzjcapi";
    }
    //ga环境
    else {
        apiPath = "http://dztzjc.cric.com/tzjcapi";
        if (jg == 'wanke') {
            apiPath = "http://wkdz.dztzjc.cricbigdata.com/tzjcapi";
        }
    }

}
export default {
    apiPath,
    fileUrl
}