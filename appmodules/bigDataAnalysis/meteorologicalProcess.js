MeteorologicalProcess = L.Class.extend({
    initialize: function (options) {
        
        
    },
    show:function(){
				//显示模块对应的DIV
				
		},
		hide:function(){
				//隐藏模块对应的DIV
				
		},
		initUI:function(){
				//初始化模块界面UI
				this.initMap();
				
				this.show();
		},
		handler:function(){
				//处理操作逻辑
				
				this.createUIHandler();
				
		},
		initMap:function(){
				/*var normalArgs=this.getTianDiTu(4326,'normal');
      	    var normalLayer = L.tileLayer(normalArgs.map,normalArgs.options);
      	    var map = L.map('meteorologicalProcessMap',
            {
                crs: L.CRS.EPSG4326,
                continuousWorld: true,
                worldCopyJump: false,
                center: [40, 117],
                zoom: 4,
                minZoom:2,
                maxZoom:13,
                attributionControl: false
                // layers: baseLayers[1]
            });
            
      	    map.setView([25.5, 116.2], 4);
      	    map.addLayer(normalLayer);*/
				
				/*L.geoJSON("js/china.json", {
				    style: function (feature) {
				        return {color: feature.properties.color};
				    }
				}).addTo(map);*/
				
				var map = L.map("meteorologicalProcessMap",{preferCanvas:true,crs:L.CRS.EPSG4326,minZoom:3,maxZoom:10,maxBounds:[[25,105],[35,125]]});
    		map.setView([30,115],7);
    		L.tileLayer('http://10.1.64.146/vec_c/{z}/{x}/{y}.png',{zoomOffset:1}).addTo(map);
    		
    		this.map = map;
    		this.circleMarkerGroup = [];
		},
		getTianDiTu:function(epsg, type) {
	        var code;
	        if (epsg === 4326)code = 'c';
	        else if (epsg === 900913)code = 'w';
	        var map, annotation;
	        if (type === 'normal') {
	            map = 'vec';
	            annotation = 'v';
	        } else if (type === 'satellite') {
	            map = 'img';
	            annotation = 'i';
	        } else if (type === 'terrain') {
	            map = 'ter';
	            annotation = 't';
	        }
	        if (code && map && annotation) {
	            return {
			            map:"http://t{s}.tianditu.com/DataServer?T=" + map + "_" + code + "&X={x}&Y={y}&L={z}",
			                annotation:"http://t{s}.tianditu.com/DataServer?T=c" + annotation + "a_" + code + "&X={x}&Y={y}&L={z}",
			                options:{subdomains:['0', '1', '2', '3', '4', '5', '6', '7'], zoomOffset:epsg === 4326 ? 1 : 0}
			        }
			    }
		},
		createUIHandler:function(){
				$(".rainTable2 tr").die().live("click",function(){
						$(".rainTable2 tr").css({background:"none"});
						$(this).css({background:"#39769E"});
						
						var date = $(this).children("td").eq(1).text().split("-");
						var startDate = date[0];
						var endDate = date[1];
						meteorologicalProcess.getMyMapData(startDate,endDate);
				});
			  
			  this.getMyTableData();
		},
		getMyTableData:function(){
				var url = livePath + "/case/inf/my/rain";
        $.getJSON(url).then(function(json){
        		var rainTable = "";
					  $(".rainTable2").html("");
        		
        		var rainData = json;
        		var number = 1;
					  for(var i=0; i<rainData.length;i++){
					  	  var rain = rainData[i];
					  	  var startDate = rain.startDate;
					  	  var endDate = rain.endDate;
					  	  
					  	  var gte50StnCnt = rain.gte50StnCnt;
					  	  var gte100StnCnt = rain.gte100StnCnt;
					  	  var gte250StnCnt = rain.gte250StnCnt;
					  	  var psStnTms = rain.psStnTms;
					  	  var psAvgStnCnt = rain.psAvgStnCnt;
					  	  
					  	  var sglDayMaxStnCntMsg = "";
					  	  var sglDayMaxStnCnt = rain.sglDayMaxStnCnt;
					  	  for (var prop in sglDayMaxStnCnt) {  
									  if (sglDayMaxStnCnt.hasOwnProperty(prop)) {
									    sglDayMaxStnCntMsg += sglDayMaxStnCnt[prop] + "(" + prop + ")</br> ";
									  }  
								}
								
					  	  var psAvgI = rain.psAvgI;
					  	  
					  	  var psMaxAvgIMsg = "";
					  	  var psMaxAvgI = rain.psMaxAvgI;
					  	  for (var prop in psMaxAvgI) {  
									  if (psMaxAvgI.hasOwnProperty(prop)) {
									    psMaxAvgIMsg += psMaxAvgI[prop] + "(" + prop + ")";  
									  }  
								}
								
								var psSglStnMaxSumRnflMsg = "";
								var psSglStnMaxSumRnfl = rain.psSglStnMaxSumRnfl;
								for (var prop in psSglStnMaxSumRnfl) {  
									  if (psSglStnMaxSumRnfl.hasOwnProperty(prop)) {
									  		var stationId = prop;
									  		var stationName = Aws.national[stationId].stName;
									    	psSglStnMaxSumRnflMsg += psSglStnMaxSumRnfl[prop] + "(" + stationName + ")";
									  }  
								}
								
								var sglDaySglStnMaxRnflMsg = "";
								var awsEleInf = rain.sglDaySglStnMaxRnfl[0];
								var stationId = awsEleInf.stationId;
								var stationName = Aws.national[stationId].stName;
								sglDaySglStnMaxRnflMsg += awsEleInf.value + "(日:" + awsEleInf.time + ",站名:" + stationName + ")";
								/*var sglDaySglStnMaxRnfl = rain.sglDaySglStnMaxRnfl;
								for (var i=0; i<sglDaySglStnMaxRnfl.length;i++ ) {
									  	var awsEleInf = sglDaySglStnMaxRnfl[i];
									  	var stationId = awsEleInf.stationId;
									  	//var stationName = Aws.national[stationId].stName;
									  	sglDaySglStnMaxRnflMsg += awsEleInf.value + "(日:" + awsEleInf.time + ",站名:" + stationId + ")";
								}*/
								
								var psXtrmStnCnt = rain.psXtrmStnCnt.length;
					  		rainTable += "<tr><td><font color='red' >"+number+"</font></td>"+"<td>"+startDate+"-"+endDate+"</td><td>"+gte50StnCnt+"</td><td>"+gte100StnCnt+"</td><td>"+gte250StnCnt+"</td><td>"+psStnTms+"</td><td>"+psAvgStnCnt+"</td><td>"+sglDayMaxStnCntMsg+"</td><td>"+psAvgI+"</td><td>"+psMaxAvgIMsg+"</td><td>"+psSglStnMaxSumRnflMsg+"</td><td>"+sglDaySglStnMaxRnflMsg+"</td><td>"+psXtrmStnCnt+"</td></tr>";
					  		number++;
					  }
					  $(".rainTable2").html(rainTable);
        		$(".rainTable2 tr").eq(0).trigger("click");
        		
				});
    },
    getMyMapData:function(startDate,endDate){
    		var url = livePath + "/case/stats/my/rain/" + startDate+"-" + endDate;
        $.getJSON(url).then(function(json){
        		Aws.attachAwsInfs(json);
        		//Aws.toGeoJSON(json);
            var result = json;
            
            //清理图层
            var map = meteorologicalProcess.map;
            var circleMarkerGroup = meteorologicalProcess.circleMarkerGroup;
            for(var i=0; i<circleMarkerGroup.length;i++){
            		var circleMarker = circleMarkerGroup[i];
            		map.removeLayer(circleMarker);
            }
            meteorologicalProcess.circleMarkerGroup = [];
            
            for(var i=0; i<result.length;i++){
            	  var info = result[i]
            		var rainfall = info.value;
            		var color;
                if(rainfall>=0&&rainfall<10){
                    color="rgb(165,243,141)";
                }else if(rainfall>=10&&rainfall<25){
                    color="rgb(61,185,63)";
                }else if(rainfall>=25&&rainfall<50){
                    color="rgb(99,184,249)";
                }else if(rainfall>=50&&rainfall<100){
                    color="rgb(0,0,254)";
                }else if(rainfall>=100&&rainfall<250){
                    color="rgb(243,5,238)";
                }else if(rainfall>=250&&rainfall<500){
                    color="rgb(129,0,64)";
                }else if(rainfall>=500&&rainfall<800){
                    color="rgb(127,0,85)";
                }else if(rainfall>=800&&rainfall<1200){
                    color="rgb(221,143,0)";
                }else{
                    color="rgb(205,133,63)";
                }
                
                var latlng = L.latLng(info.latitude, info.longitude);
                var circleMarker = L.circleMarker(latlng,{radius:3,color:color});
                circleMarker.info = info;
                circleMarker.bindPopup(function(layer){
                	  var info = layer.info;
				            var html = "站号: " + info.stationId + "</br>";
				            		html += "站名: " + info.stName + "</br>";
				            		html += "省份: " + info.province + "</br>";
				            		html += "雨量: " + info.value + "mm</br>";
				            return html;
				        });
                circleMarker.addTo(map);
                meteorologicalProcess.circleMarkerGroup.push(circleMarker);
            }
        		
        });
    }
    
    
    
});