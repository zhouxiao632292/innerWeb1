/**
 * Created by Administrator on 2018/4/12.
 */
Catalog.getMeta= function (ele) {
    if(ele.indexOf('ocean')!= -1){
        return {
            bounds: [[-10,95],[45,142]],//��������
            res: 0.1,//���ȷֱ��� ��/��
            dsi: "http://10.1.64.146/nwfddata/nwfd"
        }
    }
    if (ele.indexOf('aglb') != -1) {
        return {
            bounds: [[-90, 0], [90, 360]],//��������
            res: 0.1,//���ȷֱ��� ��/��
            dsi: "http://10.1.64.146/nwfddata/nwfd"
        }
    }
    if (ele.indexOf('live/rain_1h') != -1) {
        return {
            bounds: [[15.0,70.0],[55.0,140.0]],//��������
            res: 0.05,//���ȷֱ��� ��/��
            dsi: "http://10.1.64.146/nwfddata/nwfd"
        }
    }

    return {
        bounds: [[0, 70], [60, 140]],//��������
        res: 0.05,//���ȷֱ��� ��/��
        dsi: "http://10.1.64.146/nwfddata/nwfd"
    }
};