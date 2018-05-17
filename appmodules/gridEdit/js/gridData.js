var gridData = [
    {
        "name":"日变温",
        "isflag":true,
          "latGap":"0.05","apiKey":"ttt_05_dif", "lonGap":"0.05", "imageLayerVisible":true, "vectorLayerVisible":true, "streamLayerVisible":false, bounds:[[0.0,70.0],[60.0,140.0]], "relativepath":"/fsol/ttt_05_dif", "fileFormat":"{yyyyMMddHH}.{XXX}", "liveVisible":false,  "style":"temperature", "palettes":"temperature",time:[48,72,96,120,144,168,192,216,240],unit:"°C"

    }, {
        "name":"累计降水",
        "isflag":true,
        "latGap":"0.05","apiKey":"gridrain24xn", "lonGap":"0.05",  "imageLayerVisible":true, "vectorLayerVisible":true, "streamLayerVisible":false, bounds:[[0.0,70.0],[60.0,140.0]], "relativepath":"/forecast/QPF_V2/gridrain24xn", "fileFormat":"{yyyyMMddHH}.{XXX}", "style":"precipitation24", "palettes":"precipitation24",time:[2,3,4,5,6,7,8,9,10],unit:"mm"

    }
];