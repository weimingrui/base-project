//点worker

// import BmapUtil from '@/utils/BmapUtil';
self.addEventListener('message', function (e) {
    let datas = e.data;
    // let len = 3000;
    // for (var i = 0; i < len; i++) {
    //     datas.push(datas[0]);
    // }
    var len = datas.length;
    datas.reverse();
    while (len >= 1) {
        len--;
        postMessage(datas[len]);
    }


}, false);