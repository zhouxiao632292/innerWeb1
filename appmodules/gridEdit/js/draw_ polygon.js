/*
 * @moudle Draw_polygon
 * @todo 分析生成
 */

ui.Draw_polygon= L.Class.extend({
	initialize: function (app, options) {	
		var that = this;
		var html = '<div id="drawpolygon">分析</div>';
	},
	addto:function(){
			
			// 包含 drawStyle  gerjson  以及map ..等等要素
			var layers = shell.application.meteoNGLayer.layerConfig.layerGroup[0].layer;
			
			// 获取所有点的集合
			var pointAll = layers.processedData;			
			
			// 点线面要素信息
			var drawAll = layers.drawStyle;		
			
			//起始点 结束点  经纬度     顺序（ 起始点经度，起始点纬度 ，结束点经度 ， 结束点纬度）
			var extent = [pointAll.startLon, pointAll.startLat, pointAll.endLon, pointAll.endLat];	
			
			//var extent = [pointAll.startLon, pointAll.startLat, 139.7, 38.2];	
			
			//格点间隔 0.5  0.05
			var cellWidth = pointAll.lonGap;	
			
			//var cellWidth = 0.5;
			var units = 'degrees';			
			
			var pointGrid = turf.pointGrid(extent, cellWidth, units);		
			
			// 数据列数
			var column = pointAll.column;			
			
			//数据行数
			var row = pointAll.row;			
			
			//数据
			var datas = pointAll.srcData;			
			
			var colArry = [];			

			var valueList = [];
			
			for(i=0;i<drawAll.paletteEntries.length;i++){
				valueList.push(drawAll.paletteEntries[i].value)
			}
			
			var breaks = valueList;		
			
			for(i=0;i<column;i++){
				
				var cum = i;
				
				for(k=0;k<row;k++){
					
					colArry.push(datas[cum]);	
					
					cum = cum + column;
				}
				
			}

			//  if haslayer → removelayer  panBy 产生位置 达到更新视图的目的
			if(shell.application.map.hasLayer(shell.application.geoLayer)){
				
				shell.application.map.removeLayer(shell.application.geoLayer)
				
				shell.application.map.fire("viewreset");
				
				shell.application.map.panBy([0,1]);
				
				shell.application.map.panBy([0,-1]);
			}
			
			
			//  线分析
			var LineGrid = turf.pointGrid(extent, cellWidth, units);
			
			for (var i = 0; i < LineGrid.features.length; i++) {
				
			    LineGrid.features[i].properties.temperature = colArry[i];
			    
			}
			var isolines = turf.isolines(LineGrid, breaks, 'temperature');


			for (var i = 0; i < pointGrid.features.length; i++) {
				
			    pointGrid.features[i].properties.elevation = colArry[i];
			    
			}
			
			
			
			// 面分析
			var isobands = turf.isobands(pointGrid, breaks);	
			
			var maps = shell.application.map;
			
			var oplys = [];
			
			
			//  转换层级关系  分离多边形组  拆成单一的多边形
			for(i=0;i<isobands.features.length;i++){
				var poly = [];
				if(isobands.features[i].geometry.coordinates.length == 0){
					oplys.push(poly);
					isobands.features[i].geometry.type = "Polygon";
				}else{
					for(k=0;k<isobands.features[i].geometry.coordinates.length;k++){						
						for(j=0;j<isobands.features[i].geometry.coordinates[k].length;j++){							
							poly.push(isobands.features[i].geometry.coordinates[k][j])							
						}						
					}
					
					oplys.push(poly);
					
					isobands.features[i].geometry.type = "Polygon";
					
				}								
			}
			
			for(i=0;i<oplys.length;i++){
				if(oplys[i].length == 0){
					
				}else{
					isobands.features[i].geometry.coordinates = [];
					for(k=0;k<oplys[i].length;k++){
						
						isobands.features[i].geometry.coordinates.push(oplys[i][k])
					}
				}
			}
			
			// 保存分析结果
			shell.application.iso = isobands;
			shell.application.line = isolines;
			
			// 保存面填充
			shell.application.geoLayer =   L.geoJson(isobands, {style: style});
			// 保存线分析
			shell.application.geoLayerLine =   L.geoJson(isolines, {style: styleLine,onEachFeature: onEachFeature});

			//   填充 
			var cut = shell.application.map.addLayer(shell.application.geoLayer);
			var geojson;
			geojson = shell.application.geoLayer.addTo(shell.application.map);
			
			//   等值线
			var geojsonLine;
			geojsonLine = shell.application.geoLayerLine.addTo(shell.application.map);
			
			// 选取等值线事件  
			// mouseover   mouseout   click
			function onEachFeature (feature, layer) {
				layer.on({
					//mouseover: highlightFeature,
					//mouseout: rest,
					click: highlightFeature 
				});
			}
			
			//  等值线的CLICK事件
			function highlightFeature(e) {
				var layer = e.target;
				
				console.log(layer)
				
//				var thisPoint = turf.featureCollection([
//				    turf.point([e.latlng.lng, e.latlng.lat])
//				]);
//				var allPy = e.target.feature.geometry.coordinates;
//				var col1 =[];
//				var col2 =[];
//				for(i=0;i<allPy.length;i++){
//					var py = allPy[i];
//					var searchWithin = turf.featureCollection([
//						    turf.polygon([py])
//					]);
//		
//					var ptsWithin = turf.within(thisPoint, searchWithin);
//					if(ptsWithin.features.length != 0){
//							col1.push(i);
//					}	
//				}
//				console.log(col1)
//				console.log(col2)
//				console.log(allPy[col1[0]])
//				
//				layer.feature.geometry.coordinates = [[ allPy[col1[0]][col2[0]] ]];
//				console.log(layer._latlngs[0][0][0].lat)
//				var latlngsPoint=[];
//				for(i=0;i<allPy[col1[0]][col2[0]].length;i++){
//					var ar = {"lat":"13","lng":"12"};
//					var ar = {"lat":allPy[col1[0]][col2[0]][i][1],"lng":allPy[col1[0]][col2[0]][i][0]};
//				
//					latlngsPoint.push(ar)
//				}
//				
//				console.log(latlngsPoint)
				
//				for(i=0;i<allPy.length;i++){
//					if(i == col1[0]){
//						var py = allPy[i];
//					
//						for(k=0;k<py.length;k++){
//							
//							if(k != col2[0]){
//								console.log(py)
//								py.remove(k);
//							}else{
//								
//							}
//						}
//					}else{
//						allPy.remove(i);
//					}
//						
//				}
				
				console.log(isolines)
				
				// 选中等值线之后的 线 的样式
				layer.setStyle({
					weight: 3,
					color: '#666',
					dashArray: '',
					fillOpacity: 0.7
				});
		
				if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
					layer.bringToFront();
				}		
			}
			
			
			//  清除等值线选中效果
			function rest(e) {
				var layer = e.target;				
				// 通过更新color为透明 达到隐藏目的
				layer.setStyle({
					weight: 5,
					color: 'transparent',
					dashArray: '',
					fillOpacity: 0.7
				});
		
				if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
					layer.bringToFront();
				}
			}
			
			// update
			function resetHighlight(e) {
				geojson.resetStyle(e.target);
				shell.application.map.panBy([0,1]);
				shell.application.map.panBy([0,-1]);
			}

			
			function zoomToFeature(e) {
				shell.application.map.fitBounds(e.target.getBounds());
			}
			
//			L.geoJson(isobands,{style:style}).addTo(maps);
			
			//  应用面样式
			function style(feature){				
			    return {
			        fillColor: getColor(feature.properties.elevation),
			        weight: 0,
			        opacity: 1,
			        color:'white',
			        dashArray: '3',
			        fillOpacity: 0.7
				};
			}
			
			// 应用线样式
			function styleLine(feature){				
			    return {
			        fillColor: getColor(feature.properties.temperature),
			        weight: 5,
			        opacity: 1,
			        color:'transparent',
			        dashArray: '3',
			        fillOpacity: 0.7
				};
			}
			
			
		// 对应数据的调色板颜色配置      ----  可以做   对应数据请求本地的对应调色板文件
		function getColor(s){
			
			s = s.toString();
			var d;		
			if(s.substr(0,1) === "-"){
				d = - Number( s.split("-")[1] );
			}else{
				d = Number( s.split("-")[0] );
			}
			
			//去全局变量调色板请求数据
			var dom = shell.application.getFactorData.getPaletteColor;
			
			var lens = $(dom).find("entry");
			
			var cols;
			
			//  当前 要素值 与调色板要素值一一匹配  相等时 取要素值对应的色值。 return
			for(i=0;i<lens.length;i++){
				
				if( d == lens.eq(i).attr("value")){
					cols = "rgba(" + lens.eq(i).attr("rgba") + ")";
					return cols
				}		
			}				           
		}
	}
});
