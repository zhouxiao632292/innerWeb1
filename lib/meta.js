/**
 * Created by Administrator on 2018/4/12.
 */
Catalog.getMeta= function (ele) {
    if(ele.indexOf('ocean')!= -1){
        return {
            bounds: [[-10,95],[45,142]],//下左上右
            res: 0.1,//经度分辨率 度/格
            dsi: "http://10.1.64.146/nwfddata/nwfd"
        }
    }
    if (ele.indexOf('aglb') != -1) {
        return {
            bounds: [[-90, 0], [90, 360]],//下左上右
            res: 0.1,//经度分辨率 度/格
            dsi: "http://10.1.64.146/nwfddata/nwfd"
        }
    }
    if (ele.indexOf('live/rain_1h') != -1) {
        return {
            bounds: [[15.0,70.0],[55.0,140.0]],//下左上右
            res: 0.05,//经度分辨率 度/格
            dsi: "http://10.1.64.146/nwfddata/nwfd"
        }
    }

    return {
        bounds: [[0, 70], [60, 140]],//下左上右
        res: 0.05,//经度分辨率 度/格
        dsi: "http://10.1.64.146/nwfddata/nwfd"
    }
};