/**
 * @module application
 * (入口文件)
 */	

shell.Application = L.Evented.extend({
		/**
		 * @function initialize 
		 * @param {Object} options  传入必要参数
		 * @todo	根据传入的参数  初始化。
		 */
    initialize: function (options) {
        this.options = options;
        this._handlers = [];
        this.StyleRoot="";
        this.dataRootUrl = options.dataRootUrl;
        this.detailUrl=options.detailUrl;
        this.imageUrl = options.imageUrl;
        
	      this.defaultLayer = options.defaultLayer;
				
        canvasrender.CanvasLayer.include(canvasrender.CanvasRenders);
        canvasrender.FeatureCanvasDraw.include(canvasrender.FeatureCanvasRenderers);
        canvasrender.CanvasTileLayer.include(canvasrender.CanvasRenders);
        
        this._initMap();
        this._initUI();
				
        this.mapEnhance = new shell.MapEnhance(this.map);

    },
	
		/**
		 * @function addHandler
		 * @param {Object} name
		 * @param {Object} HandlerClass
		 * @return {obj} this
		 * @todo 处理fire 发出事件的 ，添加handler处理
		 */
    addHandler: function (name, HandlerClass) {
        if (!HandlerClass) { return this; }
        var handler = this[name] = new HandlerClass(this);
        this._handlers.push(handler);
        if (this.options[name]) {
            handler.enable();
        }
        
        return this;
    },
    
    /**
     * @function _initMap
     * @todo 初始化地图
     */
    _initMap: function () {
        
        var crs = new L.Proj.CRS('EPSG:4326', '', {
            origin: [-180, 90],
            resolutions: [0.47919505937250795, 0.23959752968625397, 0.11979876484312699, 0.05989938242156349, 0.029949691210781747, 0.014974845605390873, 0.007487422802695437, 0.0037437114013477183, 0.0018718557006738592]
        });
				
        var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
				
        var normalArgs=getTianDiTu(4326,'normal');
        var satelliteArgs=getTianDiTu(4326,'satellite');
        var terrainArgs=getTianDiTu(4326,'terrain');
				
        var normalLayer = L.tileLayer(normalArgs.map,normalArgs.options);
        var satelliteLayer = L.tileLayer(satelliteArgs.map,satelliteArgs.options);
        var terrainLayer = L.tileLayer(terrainArgs.map,terrainArgs.options);
		
				var vecUrl = "http://t1.tianditu.com/DataServer?T=vec_c&x={x}&y={y}&l={z}";
				vecUrl = "http://10.1.64.146/vec_c/{z}/{x}/{y}.png?v=1.0.1086";
        var vecLayer = L.tileLayer(vecUrl, {maxZoom: 14, minZoom: 1, attribution: 'nmc'});
        vecLayer = L.tileLayer(vecUrl, {subdomains:['0', '1', '2', '3', '4', '5', '6', '7'], zoomOffset:1, crossOrigin:true});
				
				
        var baseLayers = [satelliteLayer,normalLayer,terrainLayer,vecLayer];
        this.baseLayers = baseLayers;
		
        var map = L.map('map',
        {
            crs: L.CRS.EPSG4326,
            continuousWorld: true,
            worldCopyJump: false,
            center: [40, 117],
            //zoom: 3,
            minZoom:1,
            maxZoom:13,
            attributionControl: false
            // layers: baseLayers[1]
        });
	    	
		    var mobile = isMobile();
		    if(mobile){
		    	map.fitBounds([
		            [-18.184, 71.543],
	        		[75.078, 137.461]
		        ]);
		    }else{
		    	map.fitBounds([
		            [13.754, 68.027],
	                [55.239, 141.855]
		        ]);
		    }
	    	
        map.addLayer(satelliteLayer);
        
        this.map = map;
    },
    
    /**
	   * @function _initUI
	   * @todo application 私有的初始化UI组件。     UI组件开启受控 ： mian.lib 配置组件开启的传递参数。 true 开启
	   */
    _initUI: function () {
         //this.paletteBar = new ui.PaletteBar(this);
         this.universal_tool = new ui.Universal_tool(this);
    },
		
		//获取选中模块项 （默认显示智能网格预报）
		getModule: function (moduleId){
			 //intelligentGridPrediction
			 //impactForecast
			 //bigDataAnalysis
			 //monitorAnalysis
			 //gridEdit
			 
			 this.hideModuleUI();
			 this.initModuleUI(moduleId);
		},
		
		//初始化界面
		initModuleUI: function (moduleId){
			 
			 if(moduleId == "intelligentGridPrediction"){
			 		 if(this.intelligentGridPrediction == null){
			 		 		this.intelligentGridPrediction = new IntelligentGridPrediction();
			 		 }
			 		 this.intelligentGridPrediction.initUI();
			 		 this.intelligentGridPrediction.handler();
			 		 
			 }else if(moduleId == "impactForecast"){
			 		 if(this.impactForecast == null){
			 		 		this.impactForecast = new ImpactForecast();
			 		 }
			 		 this.impactForecast.initUI();
			 		 this.impactForecast.handler();
			 		 
			 }else if(moduleId == "bigDataAnalysis"){
			 		 if(this.bigDataAnalysis == null){
			 		 		this.bigDataAnalysis = new BigDataAnalysis();
			 		 }
			 		 this.bigDataAnalysis.initUI();
			 		 this.bigDataAnalysis.handler();
			 		 
			 }else if(moduleId == "monitorAnalysis"){
			 		 if(this.monitorAnalysis == null){
			 		 		this.monitorAnalysis = new MonitorAnalysis();
			 		 }
			 		 this.monitorAnalysis.initUI();
			 		 this.monitorAnalysis.handler();
			 		 
			 }else if(moduleId == "gridEdit"){
			 		 if(this.gridEdit == null){
			 		 		this.gridEdit = new GridEdit();
			 		 }
			 		 this.gridEdit.initUI();
			 		 this.gridEdit.handler();
			 		 
			 }
			 
		},
		
		//隐藏界面DIV
		hideModuleUI: function (){
			 
			 
		}

});

//判断移动端还是PC端
function isMobile(){
    var sUserAgent= navigator.userAgent.toLowerCase(),
        bIsIpad= sUserAgent.match(/ipad/i) == "ipad",
        bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os",
        bIsMidp= sUserAgent.match(/midp/i) == "midp",
        bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
        bIsUc= sUserAgent.match(/ucweb/i) == "ucweb",
        bIsAndroid= sUserAgent.match(/android/i) == "android",
        bIsCE= sUserAgent.match(/windows ce/i) == "windows ce",
        bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile",
        bIsWebview = sUserAgent.match(/webview/i) == "webview";
    return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM);
}