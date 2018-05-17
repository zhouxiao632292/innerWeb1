ui.ToolPanel_draw_edit= L.Class.extend({
    initialize: function (app, options) {
        this.application = app;
		this.latlngColletions=[];
		this.layerLatlng=[];
		this.indexs=[];
		this.circlePoint=[];
		var  that=this;
		//var tool='<a class="leaflet-draw-edit-analysis leaflet-disabled" href="#" title="分析"><span class="sr-only">Delete layers</span></a>';
		var tool='';
		var map = shell.application.map,//new L.Map('map', { center: new L.LatLng(51.505, -0.04), zoom: 13 }),
			drawnItems = L.featureGroup().addTo(map);
		this.drawnItems = drawnItems;
		/*L.control.layers(
			{'drawlayer': drawnItems},
			{position: 'topright', collapsed: false,hideSingleBase: true}
		).addTo(map);*/
		map.addControl(new L.Control.Draw({
			edit: {
				featureGroup: drawnItems,
				poly: {
					allowIntersection: false
				}
			},
			draw: {
				/*polygon: {
					allowIntersection: false,
					showArea: true
				},*/
				polygon:true,
	polyline:false,
	circle:false,
				marker: false,//屏蔽marker
				circlemarker:false  //屏蔽marker
			}
		}));
		$(".leaflet-control-container").children().eq(1).hide();
		//$(".leaflet-draw").children(".leaflet-draw-section").eq(1).children(".leaflet-draw-toolbar").append(tool);
		//$(".leaflet-control-container").children(".leaflet-left").children(".leaflet-control-zoom ").after(div);
		$(".leaflet-control-container").children().eq(0).removeClass("leaflet-left").addClass("leaflet-right");
		$(".leaflet-control-container").children(".leaflet-right").children(".leaflet-control").eq(1).css({"right":'40px',"margin-top":'-30px'});

		this.deleteTool = new L.EditToolbar.Delete(map, {
			featureGroup: drawnItems
		});

        $("#mbtn").live("click",function(){
			var value=$("#modifyValue").val();
			that.reDraw(that.indexs,value);
		});
		shell.application.map.on('draw:drawfinish', function (event) {

				that.getPolygonAllData(event);
		});
		shell.application.map.on('draw:edited', function (event) {
			//that.getPolygonAllData(event);
				      var layers =event.layers;
				          layers.eachLayer(function (layer) {
					            //do whatever you want; most likely save back to db
							  map.fire('draw:drawfinish',{layer:layer});
					         });

		});


		shell.application.map.on(L.Draw.Event.CREATED, function (event) {

			var layer=event.layer;
			var layerType = event.layerType;
			if (layerType === 'polyline' || layerType === 'polygon') {
				var latlngs = event.layer._latlngs;
				console.log(event.layer._latlngs);

				that.layerLatlng=event.layer._latlngs;
				var points = [];
				var p0;
				if(layerType=='polygon'){
					for (var i = 0; i < latlngs[0].length; i++) {

						var p = map.latLngToLayerPoint(latlngs[0][i]);
						if (i == 0) {
							p0 = map.latLngToLayerPoint(latlngs[0][i]);
						}
						points.push([p.x, p.y]);
					}
				}else{
					for (var i = 0; i < latlngs.length; i++) {

						var p = map.latLngToLayerPoint(latlngs[i]);
						if (i == 0) {
							p0 = map.latLngToLayerPoint(latlngs[i]);
						}
						points.push([p.x, p.y]);
					}
				}

				if (layerType === 'polygon')
					points.push([p0.x, p0.y]);
				var dotsPerSeg = 20;
				var spline = $.crSpline.buildSequence(points);
				var numPoints = latlngs.length;

				var points1 = [];
				for (var i = 0; i < numPoints; i++) {
					for (var j = 0; j < dotsPerSeg; j++) {
						var t = (i + j / dotsPerSeg) / numPoints;
						var pos = spline.getPos(t);
						var p = L.point(pos.left, pos.top);
						var latlng = map.layerPointToLatLng(p)
						points1.push(latlng);
					}

				}

				layer.setLatLngs(points1);

				if (that.centerIcon) {
					var center = layer.getCenter();
					var marker = new L.Marker(layer.getCenter(), {
						icon: new L.Icon({
							iconUrl: that.centerIcon
						})
					});
					layer.childLayer = marker;
					marker.parentLayer = layer;
					drawnItems.addLayer(marker);
				}

			}else if(layerType=="rectangle"){
				console.log(event.layer._latlngs);
				that.layerLatlng=event.layer._latlngs;
	}else if(layerType=="circle"){
				//console.log(event.layer._latlngs);
				//that.layerLatlng=event.layer._latlngs;
			}
			drawnItems.addLayer(layer);

			if (layer.lineType === 'line')
				map.fire('draw:layerAdded', layer);
			that.centerIcon = undefined;
			map.fire('draw:drawfinish', event);

		});
		
    },

    preShow: function () {

    },
    show: function () {
        this.preShow();
        $(".sx_change_all").show();
        $("#micaps_draw_edit").show();
    },
    hide: function () {
        $(".sx_change_all").hide();
        $("#micaps_draw_edit").hide();
    },
	polygonLatLng:function(latlngs){
		var latlngColletion=[];
	var startLng = latlngs[0].lng;
			var endLng = latlngs[0].lng;
			var startLat = latlngs[0].lat;
			var endLat = latlngs[0].lat;
		for(var i=0;i<latlngs.length;i++){
			var lat=latlngs[i].lat;
			var lng=latlngs[i].lng;
	if(startLng > lng){
					 startLng = lng;
				}
				if(endLng < lng){
					 endLng = lng;
				}
				if(startLat > lat){
					 startLat = lat;
				}
				if(endLat < lat){
					 endLng = lat;
				}
			var point=[lat,lng];
			latlngColletion.push(point);
		}
		return latlngColletion;
	},
	/*获取选中区域点的经纬度*/
	getPolygonPoint:function(polygonLatLng){
		/*多边形的经纬度*/
		//console.log(polygonLatLng.length);
		var latlngCollection=[];var collections=[];var latlngs=[];

		latlngCollection.push(polygonLatLng);

		var firstNode = latlngCollection[0][0];

		var lastNodes = latlngCollection[0][latlngCollection[0].length-1];

		latlngCollection[0].push(firstNode);

		var polygon=turf.polygon(latlngCollection);
		//console.log(latlngCollection);
		collections.push(polygon);
		var searchWithin = turf.featureCollection(collections);
		var layer=shell.application.meteoNGLayer;
		var layerGroup=layer.layerConfig.layerGroup;
		var latlon;var featureCollection=[];
		var coor_value=[];
		/*拿到所有的格点*/
		for(var i=0;i<layerGroup.length;i++){
			if(layerGroup[i].styleKey=="grid"){
				var processData=layerGroup[i].layer.processedData;
				latlon=processData.latlon;
				coor_value=processData.gridDatas[0];
				break;
			}
		}
		for(var j=0;j<latlon.length;j++){
			var lat=latlon[j][0];
			var lng=latlon[j][1];
			var point=[lat,lng];
			//if(j==10000) break;
			featureCollection.push(turf.point(point));
		}
		//var points = turf.helpers.featureCollection([turf.helpers.point([20.45, 79.3])]);
		var points = turf.featureCollection(featureCollection);
		var ptsWithin = turf.within(points, searchWithin);
		//console.log(ptsWithin);
		for(var k=0;k<ptsWithin.features.length;k++){
			var  coordinates=ptsWithin.features[k].geometry.coordinates;
			latlngs.push(coordinates);
		}
		var pointIndexArr=this.getPolygonPointIndex(latlon,latlngs);
	//	this.getPolygonPointIndex(latlon,latlngs);
        this.matchValue(coor_value,pointIndexArr,polygon.geometry.coordinates[0]);
	},
	/*获取选中点的下标*/
	getPolygonPointIndex:function(points,selectPoint){
		this.indexs=[];
		for(var i=0;i<selectPoint.length;i++){
			for(var j=0;j<points.length;j++){
				if(points[j][0]==selectPoint[i][0]&&selectPoint[i][1]==points[j][1]){
					this.indexs.push(j);
				}
			}
		}

		console.log(this.indexs);
		return this.indexs;
	},
	//获取所绘制区域内的所有格点
	getPolygonAllData:function(event){
		var that=this;
		var resultEvent=event;
		$(".fenxiBox").css({"display":"block"});
		var layerType=resultEvent.layerType;
		var pointCollection=[];
		if(layerType=='polyline'){
			for(var j=0;j<resultEvent.layer._latlngs.length;j++){
				var lat=resultEvent.layer._latlngs[j].lat;
				var lng=resultEvent.layer._latlngs[j].lng;
				var point=[lng,lat];
				//if(j==10000) break;
				pointCollection.push(turf.point(point));
			}
			//var points=turf.featureCollection(pointCollection);
			//var buffered = turf.buffer(points, 50, 'miles');
		}else{
			//that.latlngColletions=that.polygonLatLng(event.layer._latlngs[0]);//获取多边形经纬度
			//获取站点、格点数据
			var latlngColletion=[];
			var latLngs = resultEvent.layer._latlngs[0];
			var index="0";
			var startLng = latLngs[index].lng;
			var endLng = latLngs[index].lng;
			var startLat = latLngs[index].lat;
			var endLat = latLngs[index].lat;


			for(var i in latLngs){
				var lat=latLngs[i].lat;
				var lng=latLngs[i].lng;

				if(startLng > lng){
					startLng = lng;
				}
				if(endLng < lng){
					endLng = lng;
				}
				if(startLat > lat){
					startLat = lat;
				}
				if(endLat < lat){
					endLat = lat;
				}

				var point=[lat,lng];
				latlngColletion.push(point);
			}
			var pts=[];  //存储多边形的几个点
			for(var i=0;i<latlngColletion.length;i++){
				var pt1 = new BMap.Point(latlngColletion[i][1], latlngColletion[i][0]);
				pts.push(pt1);
			}
			var ply = new BMap.Polygon(pts); //形成符合格式的面数据
			var str=$(".leaflet-pane .leaflet-overlay-pane").children("img").attr("src");

			var type = $("input[name='eleSelect']:checked").val();
			//if(type=="temperature"){
			//   str=str.substring(str.length-6,str.length-20);
			//   var eleDate=str.slice(0,10);
			//   var eleTime=str.slice(11,14);
			//
			//}else if(type=="rain24"){
			//   str=str.substring(str.length-6,str.length-22);
			//   var eleDate=str.slice(0,10);
			//   var eleTime=str.slice(11,16);
			//}else{
			
			//str=str.substring(str.length-6,str.length-20);
			//var eleDate=str.slice(0,10);
			//var eleTime=str.slice(11,14);
			//var eleDate="2018042008";
			//var eleTime="024";
			var eleDate=gridEleFileName.split(".")[0];
			var eleTime = gridEleFileName.split(".")[1];
			gridKey=eleKey;

			var apiUrl=apiPath+"/getClippingGridData/"+gridKey+"/"+eleDate+"/"+eleTime+"/"+startLng+"/"+endLng+"/"+startLat+"/"+endLat;
			console.log(apiUrl);
			var piontSelect=[];
			//fetch(apiUrl).then(function(responese){
			//	return responese.json().then(function(result){
			//		if (result) {
			//			if (result.status == 0) {
			//				$(".fenxi").html(result.data);
			//				return;
			//			}
			//			var properties = result.data.grids[0].properties;
			//			var column = properties.column;
			//			var row = properties.row;
			//			var startLon = properties.startLon;
			//			//var row = properties.row;
			//			var lonGap = properties.lonGap;
			//			var latGap = properties.latGap;
			//			var startLat = properties.startLat;
			//			var endLat = properties.endLat;
			//			var gridDatas = properties.gridDatas[0];
            //
			//			//提取格点值   所有格点值{lat lng value}
			//			var pickData = [];
			//			var allData=[];
			//			var pointIndexArr=[];
			//			for(var i = 0; i < row; i++){
			//				for(var j = 0; j < column; j++){
			//					pickData.push({lng:startLon+j*lonGap,lat:startLat+i*latGap,value:gridDatas[j+column*i]});
			//					allData.push(gridDatas[j+column*i]);
			//				}
			//			}
			//			for(var i=0;i<pickData.length;i++){
			//				var pt =new BMap.Point(pickData[i].lng, pickData[i].lat);
            //
			//				var resultflag =BMapLib.GeoUtils.isPointInPolygon(pt, ply);
			//				if(resultflag){
			//					piontSelect.push(pickData[i]);
			//					pointIndexArr.push(i)
			//				}
			//			}
			//			latlngColletion.push(latlngColletion[0]);
            //
			//			that.matchValue(allData,pointIndexArr,latlngColletion);
            //
            //
			//		}
			//	})
			//}).catch(function(reject){
			//	console.error("加载数据失败");
			//})
			$.ajax({
				type: 'get',
				url: apiUrl,
				dataType: 'json',
				success: function (result) {
					if (result) {
						if (result.status == 0) {
							$(".fenxi").html(result.data);
							return;
						}
						var properties = result.data.grids[0].properties;
						var column = properties.column;
						var row = properties.row;
						var startLon = properties.startLon;
						//var row = properties.row;
						var lonGap = properties.lonGap;
						var latGap = properties.latGap;
						var startLat = properties.startLat;
						var endLat = properties.endLat;
						var gridDatas = properties.gridDatas[0];

						//提取格点值   所有格点值{lat lng value}
						var pickData = [];
						var allData=[];
						var pointIndexArr=[];
						for(var i = 0; i < row; i++){
							for(var j = 0; j < column; j++){
								pickData.push({lng:startLon+j*lonGap,lat:startLat+i*latGap,value:gridDatas[j+column*i]});
								allData.push(gridDatas[j+column*i]);
							}
						}
						for(var i=0;i<pickData.length;i++){
							var pt =new BMap.Point(pickData[i].lng, pickData[i].lat);

							var resultflag =BMapLib.GeoUtils.isPointInPolygon(pt, ply);
							if(resultflag){
								piontSelect.push(pickData[i]);
								pointIndexArr.push(i)
							}
						}
						latlngColletion.push(latlngColletion[0]);

						that.matchValue(allData,pointIndexArr,latlngColletion);


					}
				},
				error: function (errMsg) {
					console.error("加载数据失败");
				}
			});

			//that.latlngColletions = that.polygonLatLng(latlngColletion);
			//that.getPolygonPoint(that.latlngColletions);//获取在多边形内部的点

		}
	},
	//在所选中的落区内格点的匹配值
	matchValue:function(allData,pointIndexArr,latlngs){
		if(pointIndexArr.length==0){
			$(".fenxi").html("所选区域内无数据，请重新选择区域");
		}else{
			var max=allData[pointIndexArr[0]];
			var min=max;
			var sum=0;
			for(var i=0;i<pointIndexArr.length-1;i++){
				sum+=allData[pointIndexArr[i]];
				for(var j=i+1;j<pointIndexArr.length;j++){
					if(max<=allData[pointIndexArr[j]]){
						max=allData[pointIndexArr[j]]
					}
					if(min>allData[pointIndexArr[j]]){
						min=allData[pointIndexArr[j]]
					}
				}
			}
			sum+=allData[pointIndexArr[pointIndexArr.length-1]];
			var str='';
			for(var i=0;i<latlngs.length-1;i++){
				if(i<latlngs.length-2){
					str+='new BMap.Point('+latlngs[i][1]+','+latlngs[i][0]+'),';
				}else{
					str+='new BMap.Point('+latlngs[i][1]+','+latlngs[i][0]+')';
				}

			}

			var acreage1=this.fun(1,str);
			//var acreage1=this.fun(1, "new BMap.Point(112.247737,32.087975),new BMap.Point(112.248442,32.089149),new BMap.Point(112.248536,32.089149),new BMap.Point(112.248572,32.088036)");
			var html='所选落区内格点值：</br><span style=\"text-indent: 4px;\">最大值为：'+max+'</span>；<span>最小值为：'+min+"；</span></br><span>平均值为："+parseFloat(sum/pointIndexArr.length).toFixed(1)+'；</span><span>面积为：'+parseFloat((Math.abs(acreage1))/1000000).toFixed(1)+"k㎡。</span>";
			$(".fenxi").html(html);
		}

	},
	//该函数中  arr为polygon的边界上的点  返回值为面积
	fun:function(i,arr){

		eval("var secRing"+i+" =["+arr+']');
		//创建多边形
		eval("var secRingPolygon" + i + "= new BMap.Polygon(secRing" + i + ")");
//计算多边形的面积（单位米）
		var resultArea = BMapLib.GeoUtils.getPolygonArea(eval("secRingPolygon" + i));
	return resultArea;
	},
	changeData:function(index,value,color){
		var layerIndex;
		var processData;var paletteEntries=[];
		var layer=shell.application.meteoNGLayer;
		var layerGroup=layer.layerConfig.layerGroup;
		for(var i=0;i<layerGroup.length;i++){
			if(layerGroup[i].styleKey=="grid"){
				layerIndex=i;
				processData=layerGroup[i].layer.processedData;
				paletteEntries=layerGroup[i].layer.drawStyle.paletteEntries;
			}
		}
		if(color==undefined || color==""){
			color=this.changeColor(paletteEntries,parseFloat(value));
		}

		for(var j=0;j<index.length;j++){
			var jk=index[j];
			processData.srcData[jk]=parseFloat(value);
			processData.palColors[jk]=color;
		}
		layerGroup[layerIndex].layer.update();
//		layerGroup[layerIndex].layer._redraw();

		
		shell.application.drawPolygon.addto();
		
			

			
	},
	/*改变对应的填充色*/
	changeColor:function(paletteEntries,value){
		var color;
		for(var i=0;i<paletteEntries.length;i++){
			if(paletteEntries[i].value>value){
				if(i==0){color=paletteEntries[0].color;}else{color=paletteEntries[i-1].color;}
				break;
			}else{
				color=paletteEntries[paletteEntries.length-1].color;
			}
		}
		return color;
	},
	reDraw:function(index,value,color){
		this.changeData(index,value,color);
		this.deleteTool.enable();
		this.deleteTool.removeAllLayers();
		this.deleteTool.disable();
	}
});
