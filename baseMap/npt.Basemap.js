/**
 * Created by xumenglei on 2016/12/16.
 */
npt.Basemap = L.LayerGroup.extend({
    options: {
        resUrl:"../../shapefiles/",//如果指定了目录，必须用“/”结尾
        shps: [
            {
                url:"provinceBorders.shp.zip",
                options:{
                    color:"#F0954D",
                    weight:1
                }
            },
            //{
            //    url:"river1.shp.zip",
            //    options:{
            //        color:"#0EDD0E",
            //        weight:1
            //    }
            //},
            {
                url: "nationalBorder.shp.zip",
                options: {
                    color:"#F0954D",
                    weight:2
                }
            }
        ]
    },
    initialize:function (options) {
        L.setOptions(this,options);
        L.LayerGroup.prototype.initialize.call(this);
        this._renderer = L.canvas();
        this._renderer = L.canvas({padding:0});
        this._renderer.once('add',function(){
            L.DomUtil.addClass(this._container,'npt-basemap');
        });
        this._addShps();
    },
    _addShps:function () {
        var shp;
        for(var idx in this.options.shps){
            shp=this.options.shps[idx];
            this.addShp(shp);
        }
        return this;
    },
    addShp:function (shp) {
        shp.options.renderer = this._renderer;
        var layer=L.shapefile(this.options.resUrl+shp.url,shp.options);
        this.addLayer(layer);
        return layer;
    },
    bringToFront:function () {
        L.DomUtil.toFront(this._renderer._container);
        return this;
    }//,
    //绘制刷新时,会重置style,z-index被抹杀,因此setZIndex是无效的
    // setZIndex:function (zIndex) {
    //     this._renderer._container.style.zIndex=zIndex;
    //     return this;
    // }

    /**
     * backwards compatibility，打残放缩动画过程，以便和all.js 1.0表现一致。
     * 要求在addTo(map)之前调用
     */
    ,bc:function () {
        var getEvents=function () {
            //参考 webmicaps/canvasrender/canvasLayer#onAdd
            var events = {
                moveend: this._update,
                zoomstart: function () {
                    this._container.style.display='none';
                },
                zoomend: function () {
                    this._container.style.display='block';
                }
            };
            return events;
        }
        this._renderer.getEvents = getEvents;
        return this;
    }
});