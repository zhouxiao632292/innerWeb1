GridEdit = L.Class.extend({
	initialize: function (options) {


	},
	show:function(){

	},
	hide:function(){

	},
	initUI:function(){
		$("#initSearch").hide();
	},
	handler:function(){
		//$("#search").blur();
		//处理操作逻辑
		//处理关闭按钮
		$(".picValueClick").die().live("mouseover",function(){
			pickFlag=false;
			$(".picValueClick").on("click",function(e){
				$(".picValueClick").css({display:"none"});
				if($(".zhankai").height()==0){
					if (isMobile()) {
						$("#changeTable").css({display:"none"});
						$("#changeTable1").css({display:"none"});
						$("#publishDate1").parents(".box").css({position:"absolute",top:0,right:0})
						$("#echartName1").next("div").css({width:"100%",height:"auto",float:"left"});
						$("#echartName1").next("div").children(".box").eq(0).css({marginLeft:0});
						$("#echartss").css({"height":265});
						$("#export").css({top:"284px",right:2});
						$("#echartss div").css({"height":265});
						$(".icon-yu").css({marginLeft:"15px"});
						//pickValue1(latlng);
						that.option.grid = [
							//{top:"19%",width: '83%', height: '22%'},
							{top: "17%", width: '83%', height: '45%'}
						];
						that.option.dataZoom = [
							{
								id: 'dataZoomX',
								type: 'slider',
								xAxisIndex: [0],
								filterMode: 'filter',
								start: 0,
								end: 30,
								zoomLock: true,

								backgroundColor: 'rgba(0,0,0,0)',       // 背景颜色
								dataBackgroundColor: '#eee',            // 数据背景颜色
								fillerColor: 'rgba(144,197,237,0.2)',   // 填充颜色
								handleColor: 'rgba(70,130,180,0.8)',    // 手柄颜色
								top:'72%',
								left: "200",
								right: "300"
							}, {
								type: 'inside',
							}
						];
						that.option.yAxis = [
							{
								gridIndex: 0,
								type: 'value',
								name: '降水(mm)',
								position: 'left',
								offset: 0
							},
							{
								gridIndex: 0,
								type: 'value',
								name: '温度(°C)',
								position: 'right',
								offset: 0,
								splitLine: {show: false}
							},
							{
								gridIndex: 0,
								type: 'value',
								name: '风速(m/s)',
								offset: 100,
								position: 'right',
								splitLine: {show: false}
							},
							{
								gridIndex: 0,
								type: 'value',
								//name : '百分比(%)',
								position: 'right',
								offset: 100,
								splitLine: {show: false},
								axisLabel: {
									formatter: '{value}%'
								}
							},
							{
								gridIndex: 0,
								type: 'value',
								name: '',
								position: 'right',
								offset: 150
							}
						];

					}
					if(currentLatLng!=null){
						that.showEchart(currentLatLng);
						that.myChart1.setOption(that.option);
					}
					that.show();
				}
			})
		});
		$(".picValueClick").live("mouseout",function(){
			pickFlag=true;
		});

		$(".pickValueClose").live("mouseover",function(){
			closeFlag=false;
			$(".pickValueClose").live("click",function(e){
				mouseFlag=true;
				$(".chartsClose").css({display:"block"});
				$("#pickValueMarker").css({display:"none"});
				currentLatLng=null;
			})
		});
		$(".picValueClick").live("mouseout",function(){
			closeFlag=true;
		});
		$(".pickValueClose").live("mouseout",function(){
			closeFlag=true;
		});


		//初始化option的值
		var option1 = '';
		var today=new Date();
		for (var i = 0; i < gridData[0].time.length; i++) {
			option1 += '<option value="' + gridData[0].time[i] + '">' + moment(today).subtract(-gridData[0].time[i]/24,"day").toDate().format("MM月dd日") + '</option>';
		}
		$("#prescription").html(option1);
		var option2 = '';
		for (var i = 0; i < gridData[1].time.length; i++) {
			option2+= '<option value="' + gridData[1].time[i] + '">' + gridData[1].time[i] + '</option>';
		}
		$("#prescription1").html(option2);


		//设置时间  日历
		var that=this;
		var dt = new Date();
		dt = dt.Format("yyyy-MM-dd");
		$(".uiMain").html(dt);
		$(".uiMain1").html(dt);
		$(".uiMain").on("click", function () {
			$(this).parent().siblings(".ui-hover-panel").show();
		});
		$(".uiMain1").on("click", function () {
			$(this).parent().siblings(".ui-hover-panel").show();

		});
		$(".ui-hover-panel").mouseout(function(){
			$(this).hide();
		})
		$(".ui-hover-panel").mouseover(function(){
			$(this).show();
		})
		//改变变温日历的值  切换变温图层
		$("#aridEndTime").calendar({
			current:  new Date(),
			onSelect : function (date) {
				var year = date.getFullYear();
				var month = date.getMonth()+1;
				var day = date.getDate();
				var option1="";
				var dateTime = year+"-" + (month<10?"0"+month:""+month)+"-" + (day<10?"0"+day:""+day);

				$(".uiMain").html(dateTime);
				for (var i = 0; i < gridData[0].time.length; i++) {
					option1 += '<option value="' + gridData[0].time[i] + '">' + moment(date).subtract(-gridData[0].time[i]/24,"day").toDate().format("MM月dd日") + '</option>';
				}
				$("#prescription").html(option1);
				$(".uiMain").parent().siblings(".ui-hover-panel").hide();
				var type = $("input[name='eleSelect']:checked").val();
				if(type=="temperature"){
					var name=$(this).parents("li").children("span").html();
					var yyyyMMdd=dateTime;
					var time=$(this).parents("li").children(".tool-ele").children("div").eq(2).children("select").children("option:selected").val();

					var featureData=that.getFeature(name);
					var fileName=that.getFileName(yyyyMMdd,parseInt(time),type);
					that.getUrl(featureData,fileName);
					if (currentLatLng != null && mapClickFlag) {
						//pickValue(currentLatLng);
						that.pickValue(currentLatLng);
					}
				}else{
					$(".warn").html("请勾选变温，再操作。");
					$(".warn").fadeIn(500);
					$(".warn").fadeOut(1500);
				}

			}
		});
		//改变累计降水日历的值   切换累计降水图层
		$("#aridEndTime1").calendar({
			current:  new Date(),
			onSelect : function (date) {
				var year = date.getFullYear();
				var month = date.getMonth()+1;
				var day = date.getDate();
				var dateTime = year+"-" + (month<10?"0"+month:""+month)+"-"  + (day<10?"0"+day:""+day);

				$(".uiMain1").html(dateTime);
				$(".uiMain1").parent().siblings(".ui-hover-panel").hide();
				var type = $("input[name='eleSelect']:checked").val();
				if(type=="rain24"){
					var name=$(this).parents("li").children("span").html();
					var yyyyMMdd=dateTime;
					var time=$(this).parents("li").children(".tool-ele").children("div").eq(2).children("select").children("option:selected").val();
					var featureData=that.getFeature(name);
					var fileName=that.getFileName(yyyyMMdd,parseInt(time),type);
					;				that.getUrl(featureData,fileName);;
					if (currentLatLng != null && mapClickFlag) {
						//pickValue(currentLatLng);
						that.pickValue(currentLatLng);
					}

				}else{
					$(".warn").html("请勾选累计降水，再操作。");
					$(".warn").fadeIn(500);
					$(".warn").fadeOut(1500);
				}

			}
		});


		//切换操作板要素   给地图贴对应要素的图片
		$("input[name='eleSelect']").change(function(){
			var type = $("input[name='eleSelect']:checked").val();
			if(type=="element"){
				//if(currentRainImageLayer!=null){
				//	map.removeLayer(currentRainImageLayer);
				//	currentRainImageLayer=null;
				//}
				//if(currentTemperatureImageLayer!=null){
				//	map.removeLayer(currentTemperatureImageLayer);
				//	currentTemperatureImageLayer=null;
				//}
				$(".select").siblings().find("input[name='radioButton']:checked").parents(".list_title").trigger("click");

			}else{
                var name=$(this).siblings("span").html();
				var yyyyMMdd=$(this).siblings(".tool-ele").children("div").eq(0).children("span").siblings().html();
				var time=$(this).siblings(".tool-ele").children("div").eq(2).children("select").children("option:selected").val();

				var featureData=that.getFeature(name);  //获取对应要素的对应的各个数据配置
				gridKey=featureData.apiKey;
				var fileName=that.getFileName(yyyyMMdd,parseInt(time),type);     //获取该要素下的文件名的拼接 yyyyMMdd08.048.2.png
;				that.getUrl(featureData,fileName);       //获取该要素下的对应的图片的路径名称以及贴图
				if (currentLatLng != null && mapClickFlag) {
					//pickValue(currentLatLng);
					that.pickValue(currentLatLng);
				}
			}
		});

        //改变 变温select的值  切换图层信息
		$("#prescription").change(function(){
			var type = $("input[name='eleSelect']:checked").val();
			if(type=="temperature"){
				var name=$(this).parents("li").children("span").html();
				var yyyyMMdd=$(this).parents("li").children(".tool-ele").children("div").eq(0).children("span").siblings().html();
				var time=$(this).parents("li").children(".tool-ele").children("div").eq(2).children("select").children("option:selected").val();

				var featureData=that.getFeature(name);
				var fileName=that.getFileName(yyyyMMdd,parseInt(time),type);
				;				that.getUrl(featureData,fileName);
				if (currentLatLng != null && mapClickFlag) {
					//pickValue(currentLatLng);
					that.pickValue(currentLatLng);
				}
			}else{
				$(".warn").html("请勾选变温，再操作。");
				$(".warn").fadeIn(500);
				$(".warn").fadeOut(1500);
			}
		});

		//改变 累计降水select的值  切换图层信息
		$("#prescription1").change(function(){
			var type = $("input[name='eleSelect']:checked").val();
			if(type=="rain24"){
				var name=$(this).parents("li").children("span").html();
				var yyyyMMdd=$(this).parents("li").children(".tool-ele").children("div").eq(0).children("span").siblings().html();
				var time=$(this).parents("li").children(".tool-ele").children("div").eq(2).children("select").children("option:selected").val();

				var featureData=that.getFeature(name);
				var fileName=that.getFileName(yyyyMMdd,parseInt(time),type);
				;				that.getUrl(featureData,fileName);
				if (currentLatLng != null && mapClickFlag) {
					//pickValue(currentLatLng);
					that.pickValue(currentLatLng);
				}
			}else{
				$(".warn").html("请勾选累计降水，再操作。");
				$(".warn").fadeIn(500);
				$(".warn").fadeOut(1500);
			}
		});

		//切换tab页
		$(".navTitle li").die().live("click",function(){
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			$(".liPageList").siblings().hide();
			$(".liPageList").eq($(this).index()).show();
			if($(this).index()==1){
				var deleted_layers={};
				deleted_layers._layers=panels.drawEdit.drawnItems._layers;
				if(deleted_layers._layers!=undefined){
					panels.drawEdit.drawnItems.eachLayer(function (layer) {
						map.removeLayer(layer);
					});
					map.fire(L.Draw.Event.DELETED,{layers:deleted_layers._layers});
				}
				$(".fenxi").html("");
				$(".leaflet-control-container").hide();
				toolFlag=true;

			}else{
				$(".leaflet-control-container").show();
				$("input[name='eleSelect']").eq(0).attr("checked",true);
				$(".select").siblings().find("input[name='radioButton']:checked").parents(".list_title").trigger("click");

				//$("input[name='eleSelect']").trigger("change")
			}


		})
		//默认选中第一个
		$(".navTitle li").eq(0).trigger("click")
	},
	//获取对应要素的对应的各个数据配置
	getFeature:function(name){ //列入 “变温”
		for(var i=0;i<gridData.length;i++){
			if(name==gridData[i].name){
				return gridData[i];
			}
		}
	},

	//获取该要素下的对应的图片的路径名称以及贴图
	getUrl1:function(featureData,fileName){
		//featureData为要素的配置参数    fileName：2017113008.048   201723008.24048
		var url=path + featureData.relativepath + "/" + fileName + ".2.png";
		gridMouseUrl=path + featureData.relativepath + "/" + fileName + ".1.png"
		var bounds = featureData.bounds;
		//取消网格要素图层
		if(currentLargeImageLayer!=null){
			map.removeLayer(currentLargeImageLayer);
			currentLargeImageLayer=null;
		}

		if(featureData.name=="日变温"){
			//取消累计降水图层
			if(currentRainImageLayer!=null){
				map.removeLayer(currentRainImageLayer);
				currentRainImageLayer=null;
			}
			//叠加变温图层
			if(currentTemperatureImageLayer==null){
				//初始化为空
				if(featureData.imageLayerVisible == true){
					currentTemperatureImageLayer = new shell.meteoNGLayer({"layerConfig":{"layerGroup":
						[
							{"url": url, "styleKey": "", "visible":true, "layerType":"overlayImage"}
						],"styleFile":featureData.style,"bounds":bounds,"opacity":0.5,"palette":featureData.palettes}});

					if(currentTemperatureImageLayer){
						currentTemperatureImageLayer.addTo(map);
						currentTemperatureImageLayer.on('added', function (layer) {
							//console.log('layerAdded');
							var drawStyle = layer.drawStyle;
							if (drawStyle && drawStyle.paletteEntries) {
								shell.application.paletteBar.updatePalette(layer);
							}
							shell.application.paletteBar.show();

						});
					}
				}

				if(featureData.vectorLayerVisible == false){
					if(currentVectorTileLayer != null){
						var layer1 = currentVectorTileLayer.layerConfig.layerGroup[0].layer;
						if(layer1 != null){
							map.removeLayer(layer1);
						}
						if(map.hasLayer(currentVectorTileLayer)){
							map.removeLayer(currentVectorTileLayer);
						}
						currentVectorTileLayer = null;
					}
				}

				if(featureData.streamLayerVisible == false){
					if(currentStreamLayer != null){
						var layer2 = currentStreamLayer.layerConfig.layerGroup[0].layer;
						if(layer2 != null){
							map.removeLayer(layer2);
						}
						if(map.hasLayer(currentStreamLayer)){
							map.removeLayer(currentStreamLayer);
						}
						currentStreamLayer = null;
					}
				}

			}else{
            //图层的更新
				if(featureData.imageLayerVisible == true){
					currentTemperatureImageLayer.updateLayeConfig({"layerConfig":{"layerGroup":
						[
							{"url": url, "styleKey": "", "visible":true, "layerType":"overlayImage"}
						],"styleFile":featureData.style,"bounds":bounds,"opacity":0.5,"palette":featureData.palettes}});
					if(currentTemperatureImageLayer){
						currentTemperatureImageLayer.addTo(map);
						currentTemperatureImageLayer.on('added', function (layer) {
							//console.log('layerAdded');
							var drawStyle = layer.drawStyle;
							if (drawStyle && drawStyle.paletteEntries) {
								shell.application.paletteBar.updatePalette(layer);
							}
							shell.application.paletteBar.show();

						});
					}
				}

				if(featureData.vectorLayerVisible == false){
					if(currentVectorTileLayer != null){
						var layer1 = currentVectorTileLayer.layerConfig.layerGroup[0].layer;
						if(layer1 != null){
							map.removeLayer(layer1);
						}
						if(map.hasLayer(currentVectorTileLayer)){
							map.removeLayer(currentVectorTileLayer);
						}
						currentVectorTileLayer = null;
					}
				}

				if(featureData.streamLayerVisible == false){
					if(currentStreamLayer != null){
						var layer2 = currentStreamLayer.layerConfig.layerGroup[0].layer;
						if(layer2 != null){
							map.removeLayer(layer2);
						}
						if(map.hasLayer(currentStreamLayer)){
							map.removeLayer(currentStreamLayer);
						}
						currentStreamLayer = null;
					}
				}

			}

		}else{
			//取消变温图层
			if(currentTemperatureImageLayer!=null){
				map.removeLayer(currentTemperatureImageLayer);
				currentTemperatureImageLayer=null;
			}
			//叠加累计降水图层
			if(currentRainImageLayer==null){
				currentRainImageLayer = new shell.meteoNGLayer({"layerConfig":{"layerGroup":
					[
						{"url": url, "styleKey": "", "visible":true, "layerType":"overlayImage"}
					],"styleFile":featureData.style,"bounds":bounds,"opacity":0.5,"palette":featureData.palettes}});

				if(currentRainImageLayer){
					currentRainImageLayer.addTo(map);
					currentRainImageLayer.on('added', function (layer) {
						//console.log('layerAdded');
						var drawStyle = layer.drawStyle;
						if (drawStyle && drawStyle.paletteEntries) {
							shell.application.paletteBar.updatePalette(layer);
						}
						shell.application.paletteBar.show();

					});
				}

			}else{
				currentRainImageLayer.updateLayeConfig({"layerConfig":{"layerGroup":
					[
						{"url": url, "styleKey": "", "visible":true, "layerType":"overlayImage"}
					],"styleFile":featureData.style,"bounds":bounds,"opacity":0.5,"palette":featureData.palettes}});
				if(currentRainImageLayer){
					currentRainImageLayer.addTo(map);
					currentRainImageLayer.on('added', function (layer) {
						//console.log('layerAdded');
						var drawStyle = layer.drawStyle;
						if (drawStyle && drawStyle.paletteEntries) {
							shell.application.paletteBar.updatePalette(layer);
						}
						shell.application.paletteBar.show();

					});
				}
			}

		}
	},
	getUrl:function(featureData,fileName){
		//featureData为要素的配置参数    fileName：2017113008.048   201723008.24048
		var url=path + featureData.relativepath + "/" + fileName + ".2.png";
		gridMouseUrl=path + featureData.relativepath + "/" + fileName + ".1.png"
		var bounds = featureData.bounds;

		if(currentLargeImageLayer == null){
			if(featureData.imageLayerVisible == true){
				var errorTileUrl="images/empty.png";
				var mapOptions = {title: "", opacity:0.5, fadeAnimation: false, bounds:bounds, assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
				var options = {url: url, styleKey: featureData.style, nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions};
				//currentLargeImageLayer = new shell.MeteoLayer(options);
				currentLargeImageLayer = new shell.meteoNGLayer({"layerConfig":{"layerGroup":
					[
						{"url": url, "styleKey": "", "visible":true, "layerType":"overlayImage"}
					],"styleFile":featureData.style,"bounds":bounds,"opacity":0.5,"palette":featureData.palettes}});

				if(currentLargeImageLayer){
					currentLargeImageLayer.addTo(map);
					currentLargeImageLayer.on('added', function (layer) {
						//console.log('layerAdded');
						var drawStyle = layer.drawStyle;
						if (drawStyle && drawStyle.paletteEntries) {
							shell.application.paletteBar.updatePalette(layer);
						}
						shell.application.paletteBar.show();
					});
				}
			}

			if(featureData.vectorLayerVisible == false){
				if(currentVectorTileLayer != null){
					var layer1 = currentVectorTileLayer.layerConfig.layerGroup[0].layer;
					if(layer1 != null){
						map.removeLayer(layer1);
					}
					if(map.hasLayer(currentVectorTileLayer)){
						map.removeLayer(currentVectorTileLayer);
					}
					currentVectorTileLayer = null;
				}
			}

			if(featureData.streamLayerVisible == false){
				if(currentStreamLayer != null){
					var layer2 = currentStreamLayer.layerConfig.layerGroup[0].layer;
					if(layer2 != null){
						map.removeLayer(layer2);
					}
					if(map.hasLayer(currentStreamLayer)){
						map.removeLayer(currentStreamLayer);
					}
					currentStreamLayer = null;
				}
			}

		}else{
			if(featureData.imageLayerVisible == true){
				var errorTileUrl="images/empty.png";
				var mapOptions = {title: "", opacity:0.5, fadeAnimation: false, bounds:bounds, assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
				var options = {url: url, styleKey: featureData.style, nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions};
				currentLargeImageLayer.options = options;
				//currentLargeImageLayer.setUrl(url);

				currentLargeImageLayer.updateLayeConfig({"layerConfig":{"layerGroup":
					[
						{"url": url, "styleKey": "", "visible":true, "layerType":"overlayImage"}
					],"styleFile":featureData.style,"bounds":bounds,"opacity":0.5,"palette":featureData.palettes}});
				currentLargeImageLayer.on('added', function (layer) {
					var drawStyle = layer.drawStyle;
					if (drawStyle && drawStyle.paletteEntries) {
						shell.application.paletteBar.updatePalette(layer);
					}
					shell.application.paletteBar.show();

				});
			}

			if(featureData.vectorLayerVisible == false){
				if(currentVectorTileLayer != null){
					var layer1 = currentVectorTileLayer.layerConfig.layerGroup[0].layer;
					if(layer1 != null){
						map.removeLayer(layer1);
					}
					if(map.hasLayer(currentVectorTileLayer)){
						map.removeLayer(currentVectorTileLayer);
					}
					currentVectorTileLayer = null;
				}
			}

			if(featureData.streamLayerVisible == false){
				if(currentStreamLayer != null){
					var layer2 = currentStreamLayer.layerConfig.layerGroup[0].layer;
					if(layer2 != null){
						map.removeLayer(layer2);
					}
					if(map.hasLayer(currentStreamLayer)){
						map.removeLayer(currentStreamLayer);
					}
					currentStreamLayer = null;
				}
			}
		}


		if(currentVectorTileLayer == null){
			if(featureData.vectorLayerVisible == true){
				var vectorUrl = "";

					vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";

				currentVectorTileLayer = new shell.meteoNGLayer({"layerConfig":{"layerGroup":
					[
						{"url": vectorUrl, "styleKey": "point", "visible":true, "layerType":"tileVector"}
					],"styleFile":featureData.style,"palette":featureData.palettes}});

				if(currentVectorTileLayer){
					currentVectorTileLayer.addTo(map);
					currentVectorTileLayer.on('added', function (layer) {
						var drawStyle = layer.drawStyle;
						if (drawStyle && drawStyle.paletteEntries) {
							shell.application.paletteBar.updatePalette(layer);
						}
						shell.application.paletteBar.show();

					});
				}
			}

			if(featureData.imageLayerVisible == false){
				if(currentLargeImageLayer != null){
					var layer = currentLargeImageLayer.layerConfig.layerGroup[0].layer;
					if(layer != null){
						map.removeLayer(layer);
					}
					if(map.hasLayer(currentLargeImageLayer)){
						map.removeLayer(currentLargeImageLayer);
					}
					currentLargeImageLayer = null;
				}
			}

			if(featureData.streamLayerVisible == false){
				if(currentStreamLayer != null){
					var layer2 = currentStreamLayer.layerConfig.layerGroup[0].layer;
					if(layer2 != null){
						map.removeLayer(layer2);
					}
					if(map.hasLayer(currentStreamLayer)){
						map.removeLayer(currentStreamLayer);
					}
					currentStreamLayer = null;
				}
			}

		}else{
			if(featureData.vectorLayerVisible == true){
				var vectorUrl = "";
					vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";


				currentVectorTileLayer.updateLayeConfig({"layerConfig":{"layerGroup":
					[
						{"url": vectorUrl, "styleKey": "point", "visible":true, "layerType":"tileVector"}
					],"styleFile":featureData.style,"palette":featureData.palettes}});

				currentVectorTileLayer.on('added', function (layer) {
					var drawStyle = layer.drawStyle;
					if (drawStyle && drawStyle.paletteEntries) {
						shell.application.paletteBar.updatePalette(layer);
					}
					shell.application.paletteBar.show();

				});
			}

			if(featureData.imageLayerVisible == false){
				if(currentLargeImageLayer != null){
					var layer = currentLargeImageLayer.layerConfig.layerGroup[0].layer;
					if(layer != null){
						map.removeLayer(layer);
					}
					if(map.hasLayer(currentLargeImageLayer)){
						map.removeLayer(currentLargeImageLayer);
					}
					currentLargeImageLayer = null;
				}
			}

			if(featureData.streamLayerVisible == false){
				if(currentStreamLayer != null){
					var layer2 = currentStreamLayer.layerConfig.layerGroup[0].layer;
					if(layer2 != null){
						map.removeLayer(layer2);
					}
					if(map.hasLayer(currentStreamLayer)){
						map.removeLayer(currentStreamLayer);
					}
					currentStreamLayer = null;
				}
			}

		}

		if(currentStreamLayer == null){
			if(featureData.streamLayerVisible == true){
				var vectorUrl = "";
					vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";

				currentStreamLayer = new shell.meteoNGLayer({"layerConfig":{"layerGroup":
					[
						{"url": vectorUrl, "styleKey": "point", "visible":true, "layerType":"tileVector"}
					],"styleFile":featureData.style,"palette":featureData.palettes}});

				if(currentStreamLayer){
					currentStreamLayer.addTo(map);
					currentStreamLayer.on('added', function (layer) {
						var drawStyle = layer.drawStyle;
						if (drawStyle && drawStyle.paletteEntries) {
							shell.application.paletteBar.updatePalette(layer);
						}
						shell.application.paletteBar.show();

					});
				}
			}

			if(featureData.imageLayerVisible == false){
				if(currentLargeImageLayer != null){
					var layer = currentLargeImageLayer.layerConfig.layerGroup[0].layer;
					if(layer != null){
						map.removeLayer(layer);
					}
					if(map.hasLayer(currentLargeImageLayer)){
						map.removeLayer(currentLargeImageLayer);
					}
					currentLargeImageLayer = null;
				}
			}

			if(featureData.vectorLayerVisible == false){
				if(currentVectorTileLayer != null){
					var layer1 = currentVectorTileLayer.layerConfig.layerGroup[0].layer;
					if(layer1 != null){
						map.removeLayer(layer1);
					}
					if(map.hasLayer(currentVectorTileLayer)){
						map.removeLayer(currentVectorTileLayer);
					}
					currentVectorTileLayer = null;
				}
			}

		}else{
			if(featureData.streamLayerVisible == true){
				var vectorUrl = "";

					vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";


				currentStreamLayer.updateLayeConfig({"layerConfig":{"layerGroup":
					[
						{"url": vectorUrl, "styleKey": "point", "visible":true, "layerType":"tileVector"}
					],"styleFile":featureData.style,"palette":featureData.palettes}});

				currentStreamLayer.on('added', function (layer) {
					var drawStyle = layer.drawStyle;
					if (drawStyle && drawStyle.paletteEntries) {
						shell.application.paletteBar.updatePalette(layer);
					}
					shell.application.paletteBar.show();

				});
			}

			if(featureData.imageLayerVisible == false){
				if(currentLargeImageLayer != null){
					var layer = currentLargeImageLayer.layerConfig.layerGroup[0].layer;
					if(layer != null){
						map.removeLayer(layer);
					}
					if(map.hasLayer(currentLargeImageLayer)){
						map.removeLayer(currentLargeImageLayer);
					}
					currentLargeImageLayer = null;
				}
			}

			if(featureData.vectorLayerVisible == false){
				if(currentVectorTileLayer != null){
					var layer1 = currentVectorTileLayer.layerConfig.layerGroup[0].layer;
					if(layer1 != null){
						map.removeLayer(layer1);
					}
					if(map.hasLayer(currentVectorTileLayer)){
						map.removeLayer(currentVectorTileLayer);
					}
					currentVectorTileLayer = null;
				}
			}

		}

},


//获取该要素下的文件名的拼接 yyyyMMdd08.048.2.png
	getFileName:function(yyyyMMdd,time,type){
		//yyyyMMdd:2017-11-30  time:48 或者1   type:选中那个的标志：element;
		var fileName="";
		if(Tm>=6&&Tm<18){
			fileName+=yyyyMMdd.replace(/-/g,"")+"08.";
		}else{
			fileName+=yyyyMMdd.replace(/-/g,"")+"20.";
		}
		if(type=="temperature"){
			//拼接 变温  文件名
			if(time<=100){
				fileName+="0"+time;
			}else{
				fileName+=time.toString();
			}
		}else{
			//拼接  累计降水文件名
			fileName+=1*24*1000+time*24;
		}
return fileName;
	},
	pickValue:function(latlng){
		var that=this;
	    mouseFlag=false;
	var type = $("input[name='eleSelect']:checked").val();
		if(type=="temperature"){
			var featureData = that.getFeature("日变温");
		}else{
			var featureData=that.getFeature("累计降水");
		}

	//var featureData = getCheckedFeatureData(obj);
	var labelName=featureData.name;
	var latlngBounds = L.latLngBounds(featureData.bounds);

	if(latlngBounds.contains(latlng)){
		currentLatLng = latlng;

		var image = new Image();
		image.crossOrigin = '*';

		var unit = featureData.unit;
		var contourUrl = "";

		contourUrl = gridMouseUrl;

		image.src = contourUrl;
		image.onload = function() {
			var canvas = document.createElement('canvas');
			var width = this.width;
			var height = this.height;
			canvas.width = width;
			canvas.height = height;
			var ctx = canvas.getContext('2d');

			ctx.drawImage(this,0,0,width,height);

			var x = Math.round((latlng.lng - latlngBounds.getWest())/featureData.lonGap);
			var y = Math.round((latlngBounds.getNorth() - latlng.lat)/featureData.latGap);
			var imageData = ctx.getImageData(x,y,1,1);
			var len = imageData.data.length;

			if(len == 4){ // 每四个元素为一个像素数据 r,g,b,alpha
				var rgba = imageData.data[0] + ',' + imageData.data[1] + ',' + imageData.data[2] + ',' + imageData.data[3];
				//console.log('px rgba(' + rgba + ')');

				var palettesUrl =styleRoot+ 'palettes/'+featureData.palettes+'.xml?v=1.0.8';
				if(Boolean(newMap.get(featureData.palettes))){
					var cache = newMap.get(featureData.palettes);
					var flag = false;
					var value = null;
					$(cache).find('entry').each(function(index, ele) {
						value = parseFloat($(ele).attr('value'));
						var color = $(ele).attr('rgba');
						if(color === rgba){
							//console.log('px 匹配图例值：(' + value + ')');
							flag = true;
							return false
						}
					});

					if(!flag){
						value = null;
						//console.log('px 匹配无效值：( 9999 )');
					}

					var label = "";
					if(value == null){
						label = "无";
					}else{
						label = value + " " + unit;
					}
					if(mapId==1){
						if(toolClick=="intelligentGridPrediction"){
							var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker'><span class=\"point\"></span><div class=\"pickValue_popup\" style=\"color:#fff\"><span class=\"line\"></span><span>"+labelName+"</span><span>"+label+"</span><span class=\"pickValueClose\"><p></p></span><span  class=\"picValueClick\">该地点的预报<span class=\"bgImage\"><p></p></span></span></div></div>"});
						}else{
							var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker'><span class=\"point\"></span><div class=\"pickValue_popup\" style=\"color:#fff\"><span class=\"line\"></span><span>"+labelName+"</span><span>"+label+"</span><span class=\"pickValueClose\"><p></p></span></div></div>"});
						}

					}else{
						if(toolClick=="intelligentGridPrediction"){
							var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker'><span class=\"point\"></span><div class=\"pickValue_popup\" style=\"color:#000\"><span class=\"line\"></span><span>"+labelName+"</span><span>"+label+"</span><span class=\"pickValueClose\"><p></p></span><span  class=\"picValueClick\">该地点的预报<span class=\"bgImage\"><p></p></span></span></div></div>"});
						}else{
							var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker'><span class=\"point\"></span><div class=\"pickValue_popup\" style=\"color:#000\"><span class=\"line\"></span><span>"+labelName+"</span><span>"+label+"</span><span class=\"pickValueClose\"><p></p></span></div></div>"});
						}

					}

					if(!pickValueMarkerFlag){
						pickValueMarker = L.marker(latlng, {icon: pickValueIcon}).addTo(map);
						pickValueMarkerFlag = true;
					}else{
						pickValueMarker.setIcon(pickValueIcon);
						pickValueMarker.setLatLng(latlng);
					}
					$("#pickValueMarker").show();
					$("#pickValueMarker").parent().css({width:"auto",height:"auto",border:"0px",background:"rgba(0,0,0,0)"});
					}else{
					var req = new XMLHttpRequest();
					req.open('GET', palettesUrl);
					req.onload = function() {
						if (req.status == 200) {
							var data = req.responseText;
							newMap.set(featureData.palettes,data);
							var flag = false;
							var value = null;
							$(data).find('entry').each(function(index, ele) {
								value = parseFloat($(ele).attr('value'));
								var color = $(ele).attr('rgba');
								if(color === rgba){
									//console.log('px 匹配图例值：(' + value + ')');
									flag = true;
									return false
								}
							});

							if(!flag){
								value = null;
								//console.log('px 匹配无效值：( 9999 )');
							}

							var label = "";
							if(value == null){
								label = "无";
							}else{
								label = value + " " + unit;
							}
							if(mapId==1){
								if(toolClick=="intelligentGridPrediction"){
									var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker'><span class=\"point\"></span><div class=\"pickValue_popup\" style=\"color:#fff\"><span class=\"line\"></span><span>"+labelName+"</span><span>"+label+"</span><span class=\"pickValueClose\"><p></p></span><span  class=\"picValueClick\">该地点的预报<span class=\"bgImage\"><p></p></span></span></div></div>"});
								}else{
									var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker'><span class=\"point\"></span><div class=\"pickValue_popup\" style=\"color:#fff\"><span class=\"line\"></span><span>"+labelName+"</span><span>"+label+"</span><span class=\"pickValueClose\"><p></p></span></div></div>"});
								}

							}else{
								if(toolClick=="intelligentGridPrediction"){
									var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker'><span class=\"point\"></span><div class=\"pickValue_popup\" style=\"color:#000\"><span class=\"line\"></span><span>"+labelName+"</span><span>"+label+"</span><span class=\"pickValueClose\"><p></p></span><span  class=\"picValueClick\">该地点的预报<span class=\"bgImage\"><p></p></span></span></div></div>"});
								}else{
									var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker'><span class=\"point\"></span><div class=\"pickValue_popup\" style=\"color:#000\"><span class=\"line\"></span><span>"+labelName+"</span><span>"+label+"</span><span class=\"pickValueClose\"><p></p></span></div></div>"});
								}

							}
							if(!pickValueMarkerFlag){
								pickValueMarker = L.marker(latlng, {icon: pickValueIcon}).addTo(map);
								pickValueMarkerFlag = true;
							}else{
								pickValueMarker.setIcon(pickValueIcon);
								pickValueMarker.setLatLng(latlng);
							}
							$("#pickValueMarker").show();
							$("#pickValueMarker").parent().css({width:"auto",height:"auto",border:"0px",background:"rgba(0,0,0,0)"});

						} else {
							console.log('getStyle file error!');
							return;
						}
					};
					req.send();
				}
			}
		}

	}else{
		//隐藏实时提示值标签
		//$("#tipMarker").hide();
		//currentLatLng = null;
	}

},

});