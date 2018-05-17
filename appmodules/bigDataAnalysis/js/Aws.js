/**
 * Created by serendipity on 2017/9/4.
 */
void function (window,undefined) {
    var Aws = {
        Area:{
            national:"national",//国家站
            regional:"regional",//区域站
            all:"all",//所有站
            my:"my",
            sta631:"sta631",
            default:"national"
        },
        /**
         *
         * @param awsEleInfs [{stationId:*,time:"",value:*}] 或者{stationId:value}
         * @param area "national"|"sta631"|"my"|... 默认使用Aws.default
         */
        toGeoJSON:function (awsEleInfs,area) {
            var awsInfs = Aws._getAwsInfs(area);
            if(!Array.isArray(awsEleInfs)){
                awsEleInfs = this._hash2Array(awsEleInfs);
            }
            //todo awsEleInfs结合awsInfs转为GeoJSON
            var fc = {type:"FeatureCollection",features:[]};
            var features = fc.features;
            awsEleInfs.forEach(function (awsEleInf) {
                var properties = {};
                var awsInf=awsInfs[awsEleInf.stationId];
                for(var propName in awsEleInf)//拷贝要素信息
                    properties[propName]=awsEleInf[propName];
                for(var propName in awsInf){//拷贝站点元信息
                    if(propName!="longitude" || propName!="latitude"){
                        properties[propName]=awsInf[propName];
                    }
                }
                var geometry = {"type": "Point", "coordinates": [awsInf["longitude"],awsInf["latitude"]]};
                features.push({type:"Feature",geometry:geometry,properties:properties})
            });
            return fc;
        },
        _hash2Array:function (hash) {
            var arr = [];
            for(var id in hash){
                arr.push({stationId:id,value:hash[id]});
            }
            return arr;
        },
        attachAwsInfs:function (eleInfArr,area) {
            var awsInfs = Aws._getAwsInfs(area);
            for(var i=0;i<eleInfArr.length;i++){
                var eleInf = eleInfArr[i];
                var awsInf = awsInfs[eleInf.stationId];
                for(var propName in awsInf)
                    eleInf[propName] = awsInf[propName];
            }
            //eleInfArr.forEach(eleInf=>{
            //   var awsInf = awsInfs[eleInf.stationId];
            //   for(var propName in awsInf)
            //       eleInf[propName] = awsInf[propName];
            //});
            return eleInfArr;
        },
        _getAwsInfs:function (area) {
            area = area||Aws.Area.default;
            return Aws[area];
        }
    };
    window.Aws = Aws;
}(window);