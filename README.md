# amap-tool
高德地图工具库
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve or npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### 2.IDE 开发配置

jsconfig.js  定义路径索引提示
还需安装插件： 
- 安装vue-helper
- 安装Path Intellisense

settings.json文件中配置
```
{
  "vue-helper.componentIgnore": ["node_modules"],
  "vue-helper.alias": {
    "@": "src"
  },
  "vue-helper.componentPrefix": {
    "alias": "@",
    "path": "src"
  },
 "path-intellisense.extensionOnImport": true,
 "path-intellisense.mappings": {
    "@":"${workspaceRoot}/src"
  }
}
```