/*
 * @Author: wyx 
 * @Date: 2019-05-07 10:29:05 
 * @Last Modified by: wyx
 * @Last Modified time: 2019-05-07 13:52:01
 * @descript 自定义webpack扩展
 * 
 */
const shell = require("shelljs");

if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

module.exports = class copyDist {
    constructor(config) {
        this.fromDist = config.fromDist;
        this.toDist = config.toDist;
    }
    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync("copyDist", () => {
            if (Array.isArray(this.toDist)) {
                this.toDist.forEach(e => {
                    shell.rm("-rf", e);
                    shell.cp("-R", this.fromDist, e);
                });
            }else if(this.toDist.trim()){
                shell.rm("-rf", this.toDist);
                shell.cp("-R", this.fromDist, this.toDist);
            }
        });
    }
}
