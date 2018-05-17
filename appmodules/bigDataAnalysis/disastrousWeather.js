DisastrousWeather = L.Class.extend({
    initialize: function (options) {
        
        
    },
    show:function(){
				//显示模块对应的DIV
				
		},
		hide:function(){
				//隐藏模块对应的DIV
				
		},
		initUI:function(){
			this.setHeight();
				//初始化模块界面UI
				this.initMap();
			  
			  $(".navTitle li").die().live("click",function(){
				  	$(".navTitle li").removeClass("active");
				  	$(this).addClass("active");
				  	
				  	var i = $(this).index();//下标第一种写法
				  	$('.liPage').children("li").eq(i).show().siblings().hide();
				  	
				  	if(i == 0){
				  			var type = $("input[name='rainStatisticsSelect']:checked").val();
					  		var area = "sta631";
					  		var ele = "rain20";
					  		var compare = $("input[name='rainTypeSelect']:checked").val();
					  		var date = $("#rainStartTimeInput").html() + "-" + $("#rainEndTimeInput").html();
					  		
					  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
				  	}else if(i == 1){
				  			var type = $("input[name='maxTempStatisticsSelect']:checked").val();
					  		var area = "sta631";
					  		var ele = "tmax";
					  		var compare = $("input[name='maxTempTypeSelect']:checked").val();
					  		var date = $("#maxTempStartTimeInput").html() + "-" + $("#maxTempEndTimeInput").html();
					  		
					  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
				  	}else if(i == 2){
				  			var type = $("input[name='minTempStatisticsSelect']:checked").val();
					  		var area = "sta631";
					  		var ele = "tmin";
					  		var compare = $("input[name='minTempTypeSelect']:checked").val();
					  		var date = $("#minTempStartTimeInput").html() + "-" + $("#minTempEndTimeInput").html();
					  		
					  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
				  	}else if(i == 3){
				  			var type = $("input[name='aridStatisticsSelect']:checked").val();
					  		var area = "sta631";
					  		var ele = "rain20";
					  		var compare = "<0.1";
					  		var date = $("#aridStartTimeInput").html() + "-" + $("#aridEndTimeInput").html();
					  		
					  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
				  	}
			  });
			  
			  var today = new Date();
			  var yesterday = new Date(today.getTime()-1000*60*60*24);
			  var year = yesterday.getFullYear();
 				var month = yesterday.getMonth();
 				var day = yesterday.getDate();
			  $("#rainStartTime").calendar({
				    current: today,
				    onSelect : function (date) {
				    	  var year = date.getFullYear();
				    	  var month = date.getMonth()+1;
				    	  var day = date.getDate();
				    	  var dateTime = year + (month<10?"0"+month:""+month) + (day<10?"0"+day:""+day);
				    	  
				    	  $("#rainStartTimeInput").html(dateTime);
				    	  disastrousWeather.hideCalendar();
				    	  $("#rainStartTime").parents(".nav1").css({height:77});
				    }
				});
				var startTime = new Date(yesterday.getTime()-1000*60*60*24*9);
				$("#rainStartTime").calendar('moveTo', startTime);
				var year1 = startTime.getFullYear();
 				var month1 = startTime.getMonth();
 				var day1 = startTime.getDate();
				$("#rainStartTimeInput").html(year1 + ((month1+1)<10?"0"+(month1+1):""+(month1+1)) + (day1<10?"0"+day1:""+day1));
				////点击出现日历
				//$("#rainStartTimeInput").on("click", function () {
				//	  $(this).parents(".nav1").css({height:357});
				//	  disastrousWeather.hideCalendar();
				//	  $(this).siblings(".ui-hover-panel").show();
				//		$("#rainStartTime").show();
				//});
				
			  $("#rainEndTime").calendar({
				    current: today,
				    onSelect : function (date) {
						    var year = date.getFullYear();
				    	  var month = date.getMonth()+1;
				    	  var day = date.getDate();
				    	  var dateTime = year + (month<10?"0"+month:""+month)  + (day<10?"0"+day:""+day);
				    	  
				    	  $("#rainEndTimeInput").html(dateTime);
				    	  disastrousWeather.hideCalendar();
				    	  $("#rainEndTime").parents(".nav1").css({height:77});
				    }
				});
				$("#rainEndTimeInput").html(year + ((month+1)<10?"0"+(month+1):""+(month+1)) + (day<10?"0"+day:""+day));
				////点击出现日历
				//$("#rainEndTimeInput").on("click", function () {
				//	  $(this).parents(".nav1").css({height:357});
				//	  disastrousWeather.hideCalendar();
				//	  $(this).siblings(".ui-hover-panel").show();
				//		$("#rainEndTime").show();
				//});
				
				
			  $("#maxTempStartTime").calendar({
				    current: today,
				    onSelect : function (date) {
						    var year = date.getFullYear();
				    	  var month = date.getMonth()+1;
				    	  var day = date.getDate();
				    	  var dateTime = year + (month<10?"0"+month:""+month)  + (day<10?"0"+day:""+day);
				    	  
				    	  $("#maxTempStartTimeInput").html(dateTime);
				    	  disastrousWeather.hideCalendar();
				    	  $("#maxTempStartTime").parents(".nav1").css({height:77});
				    }
				});
				$("#maxTempStartTime").calendar('moveTo', startTime);
				$("#maxTempStartTimeInput").html(year1 + ((month1+1)<10?"0"+(month1+1):""+(month1+1)) + (day1<10?"0"+day1:""+day1));

				////点击出现日历
				//$("#maxTempStartTimeInput").on("click", function () {
				//	  $(this).parents(".nav1").css({height:357});
				//	  disastrousWeather.hideCalendar();
				//	  $(this).siblings(".ui-hover-panel").show();
				//		$("#maxTempStartTime").show();
				//});
				
				$("#maxTempEndTime").calendar({
				    current: today,
				    onSelect : function (date) {
						    var year = date.getFullYear();
				    	  var month = date.getMonth()+1;
				    	  var day = date.getDate();
				    	  var dateTime = year + (month<10?"0"+month:""+month)  + (day<10?"0"+day:""+day);
				    	  
				    	  $("#maxTempEndTimeInput").html(dateTime);
				    	  disastrousWeather.hideCalendar();
				    	  $("#maxTempEndTime").parents(".nav1").css({height:77});
				    }
				});
				$("#maxTempEndTimeInput").html(year + ((month+1)<10?"0"+(month+1):""+(month+1)) + (day<10?"0"+day:""+day));
				////点击出现日历
				//$("#maxTempEndTimeInput").on("click", function () {
				//	  $(this).parents(".nav1").css({height:357});
				//	  disastrousWeather.hideCalendar();
				//	  $(this).siblings(".ui-hover-panel").show();
				//		$("#maxTempEndTime").show();
				//});
				
				
				$("#minTempStartTime").calendar({
				    current: today,
				    onSelect : function (date) {
						    var year = date.getFullYear();
				    	  var month = date.getMonth()+1;
				    	  var day = date.getDate();
				    	  var dateTime = year + (month<10?"0"+month:""+month)  + (day<10?"0"+day:""+day);
				    	  
				    	  $("#minTempStartTimeInput").html(dateTime);
				    	  disastrousWeather.hideCalendar();
				    	  $("#minTempStartTime").parents(".nav1").css({height:77});
				    }
				});
				$("#minTempStartTime").calendar('moveTo', startTime);
				$("#minTempStartTimeInput").html(year1 + ((month1+1)<10?"0"+(month1+1):""+(month1+1)) + (day1<10?"0"+day1:""+day1));
				////点击出现日历
				//$("#minTempStartTimeInput").on("click", function () {
				//	  $(this).parents(".nav1").css({height:357});
				//	  disastrousWeather.hideCalendar();
				//	  $(this).siblings(".ui-hover-panel").show();
				//		$("#minTempStartTime").show();
				//});
				
			  $("#minTempEndTime").calendar({
				    current: today,
				    onSelect : function (date) {
						    var year = date.getFullYear();
				    	  var month = date.getMonth()+1;
				    	  var day = date.getDate();
				    	  var dateTime = year + (month<10?"0"+month:""+month)  + (day<10?"0"+day:""+day);
				    	  
				    	  $("#minTempEndTimeInput").html(dateTime);
				    	  disastrousWeather.hideCalendar();
				    	  $("#minTempEndTime").parents(".nav1").css({height:77});
				    }
				});
				$("#minTempEndTimeInput").html(year + ((month+1)<10?"0"+(month+1):""+(month+1)) + (day<10?"0"+day:""+day));
				////点击出现日历
				//$("#minTempEndTimeInput").on("click", function () {
				//	  $(this).parents(".nav1").css({height:357});
				//	  disastrousWeather.hideCalendar();
				//	  $(this).siblings(".ui-hover-panel").show();
				//		$("#minTempEndTime").show();
				//});
				
				
				
			  $("#aridStartTime").calendar({
				    current: today,
				    onSelect : function (date) {
						    var year = date.getFullYear();
				    	  var month = date.getMonth()+1;
				    	  var day = date.getDate();
				    	  var dateTime = year + (month<10?"0"+month:""+month)  + (day<10?"0"+day:""+day);
				    	  
				    	  $("#aridStartTimeInput").html(dateTime);
				    	  disastrousWeather.hideCalendar();
				    	  $("#aridStartTime").parents(".nav1").css({height:77});
				    }
				});
				$("#aridStartTime").calendar('moveTo', startTime);
				$("#aridStartTimeInput").html(year1 + ((month1+1)<10?"0"+(month1+1):""+(month1+1)) + (day1<10?"0"+day1:""+day1));
				////点击出现日历
				//$("#aridStartTimeInput").on("click", function () {
				//	  $(this).parents(".nav1").css({height:357});
				//	  disastrousWeather.hideCalendar();
				//	  $(this).siblings(".ui-hover-panel").show();
				//		$("#aridStartTime").show();
				//});
				//
			  $("#aridEndTime").calendar({
				    current: today,
				    onSelect : function (date) {
						    var year = date.getFullYear();
				    	  var month = date.getMonth()+1;
				    	  var day = date.getDate();
				    	  var dateTime = year + (month<10?"0"+month:""+month)  + (day<10?"0"+day:""+day);
				    	  
				    	  $("#aridEndTimeInput").html(dateTime);
				    	  disastrousWeather.hideCalendar();
				    	  $("#aridEndTime").parents(".nav1").css({height:77});
				    }
				});
				$("#aridEndTimeInput").html(year + ((month+1)<10?"0"+(month+1):""+(month+1)) + (day<10?"0"+day:""+day));
				//点击出现日历
				//$("#aridEndTimeInput").on("click", function () {
				//	  $(this).parents(".nav1").css({height:357});
				//	  disastrousWeather.hideCalendar();
				//	  $(this).siblings(".ui-hover-panel").show();
				//		$("#aridEndTime").show();
				//});
				
			   	//日历的取消
			$(".ui-hover-panel").mouseout(function(){
				$(this).hide();
			})
			$(".ui-hover-panel").mouseover(function(){
				$(this).show();
			})

				$("input[name='rainStatisticsSelect']").change(function(){
			  		var type = $("input[name='rainStatisticsSelect']:checked").val();
			  		var area = "sta631";
			  		var ele = "rain20";
			  		var compare = $("input[name='rainTypeSelect']:checked").val();
			  		var date = $("#rainStartTimeInput").html() + "-" + $("#rainEndTimeInput").html();
			  		
			  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
			  });
			  $("input[name='rainTypeSelect']").change(function(){
			  		var type = $("input[name='rainStatisticsSelect']:checked").val();
			  		var area = "sta631";
			  		var ele = "rain20";
			  		var compare = $("input[name='rainTypeSelect']:checked").val();
			  		var date = $("#rainStartTimeInput").html() + "-" + $("#rainEndTimeInput").html();
			  		
			  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
			  });
			  
			  
			  $("input[name='maxTempStatisticsSelect']").change(function(){
			  		var type = $("input[name='maxTempStatisticsSelect']:checked").val();
			  		var area = "sta631";
			  		var ele = "tmax";
			  		var compare = $("input[name='maxTempTypeSelect']:checked").val();
			  		var date = $("#maxTempStartTimeInput").html() + "-" + $("#maxTempEndTimeInput").html();
			  		
			  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
			  });
			  $("input[name='maxTempTypeSelect']").change(function(){
			  		var type = $("input[name='maxTempStatisticsSelect']:checked").val();
			  		var area = "sta631";
			  		var ele = "tmax";
			  		var compare = $("input[name='maxTempTypeSelect']:checked").val();
			  		var date = $("#maxTempStartTimeInput").html() + "-" + $("#maxTempEndTimeInput").html();
			  		
			  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
			  });
			  
			  
			  $("input[name='minTempStatisticsSelect']").change(function(){
			  		var type = $("input[name='minTempStatisticsSelect']:checked").val();
			  		var area = "sta631";
			  		var ele = "tmin";
			  		var compare = $("input[name='minTempTypeSelect']:checked").val();
			  		var date = $("#minTempStartTimeInput").html() + "-" + $("#minTempEndTimeInput").html();
			  		
			  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
			  });
			  $("input[name='minTempTypeSelect']").change(function(){
			  		var type = $("input[name='minTempStatisticsSelect']:checked").val();
			  		var area = "sta631";
			  		var ele = "tmin";
			  		var compare = $("input[name='minTempTypeSelect']:checked").val();
			  		var date = $("#minTempStartTimeInput").html() + "-" + $("#minTempEndTimeInput").html();
			  		
			  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
			  });
			  
			  
			  $("input[name='aridStatisticsSelect']").change(function(){
			  		var type = $("input[name='aridStatisticsSelect']:checked").val();
			  		var area = "sta631";
			  		var ele = "rain20";
			  		var compare = "<0.1";
			  		var date = $("#aridStartTimeInput").html() + "-" + $("#aridEndTimeInput").html();
			  		
			  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
			  });
				
				this.show();
				
		},
	    setHeight:function(){
		var heightBody=$("body").height()-20;
	  $(".disastrousWeather").height(heightBody);
//	  $(".disastrousWeatherCenter").css({top:(-(heightBody-heightCenter)/2)});
		//	设置宽度
		var width=$("body").width();
//		var height=$(".disastrousWeatherCenter").height();
		$(".disastrousWeatherCenter").width((width-2));

		//设置右侧地图的宽度与高度
		var leftWidth=$(".disastrousWeatherLeft").width();
		$(".disastrousWeatherRight").width((width-leftWidth-5-6));
		$(".disastrousWeatherRight").height((heightBody-3));
		$(".disastrousWeatherLeft").height((heightBody-3));
	},
		handler:function(){
			var that = this;
			$(window).resize(function(){
				location.reload();
				that.setHeight();
				//这里你可以尽情的写你的刷新代码！
			});
				//处理操作逻辑
        
				//默认显示降雨数据
				var type = $("input[name='rainStatisticsSelect']:checked").val();
	  		var area = "sta631";
	  		var ele = "rain20";
	  		var compare = $("input[name='rainTypeSelect']:checked").val();
	  		var date = $("#rainStartTimeInput").html() + "-" + $("#rainEndTimeInput").html();
	  		
	  		disastrousWeather.getDisastrousData(type, area, ele, compare, date);
		},
		initMap:function(){
				//var map = L.map("disastrousWeatherMap",{preferCanvas:true,crs:L.CRS.EPSG4326,minZoom:3,maxZoom:10,maxBounds:[[3,73],[54,135]]});
				var map = L.map("disastrousWeatherMap",{preferCanvas:true,crs:L.CRS.EPSG3857,minZoom:5});
    		map.setView([30,115], 6);
    		//map.setView([30,115],3);
    		//L.tileLayer('http://10.1.64.146/vec_c/{z}/{x}/{y}.png',{zoomOffset:1}).addTo(map);
    		//L.tileLayer('https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',{zoomOffset:1}).addTo(map);
    		L.tileLayer('https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}').addTo(map);
    		//L.control.zoom({zoomInTitle:'放大', zoomOutTitle:'缩小'}).addTo(map);
    		
    		this.map = map;
    		this.markerGroup = [];
    		
		},
		getDisastrousData:function(type, area, ele, compare, date){
			  /*
				//截至当前时间连续降雨日  rain20
				http://10.10.31.83:1024/history/uptonow/national/rain20>=10
				
				//降水日数  rain20
				http://10.10.31.83:1024/history/days/national/rain20>=10/20170901-20170918
				
				//最大连续降雨日数  rain20
				http://10.10.31.83:1024/history/days/longest/national/rain20>=10/20170901-20170918
				
				//最高气温及出现时间
				http://10.10.31.83:1024/history/top/national/tmax/max/20170901-20170918
				
				//日最高气温日数 tmax
				http://10.10.31.83:1024/history/days/national/tmax>=35/20170901-20170918
				
				//最大连续高温日数  tmax
				http://10.10.31.83:1024/history/days/longest/national/tmax>=35/20170901-20170918
				
				//日最低气温日数 tmin
				http://10.10.31.83:1024/history/days/national/tmin<=0/20170901-20170918
				
				//最大连续低温日数  tmin
				http://10.10.31.83:1024/history/days/longest/national/tmin<=0/20170901-20170918
				
				//日地表温度及出现时间  tmin
				http://10.10.31.83:1024/history/top/national/tmin/min/20170901-20170918
				
				//干旱 最大连续无降雨日  arid
				http://10.10.31.83:1024/history/days/longest/national/rain20<0.1/20170901-20170918
				
				//干旱 连续无降雨日 arid 
				http://10.10.31.83:1024/history/days/national/rain20<0.1/20170901-20170918	
				*/
				
				var url = "";
				if(type == "uptonow"){
						url = livePath + "/history/" + type + "/" + area + "/" + ele + compare;
				}else if(type == "days"){
						url = livePath + "/history/" + type + "/" + area + "/" + ele + compare + "/" + date;
				}else if(type == "days/longest"){
						url = livePath + "/history/" + type + "/" + area + "/" + ele + compare + "/" + date;
				}else if(type == "top" && ele == "tmax"){
						url = livePath + "/history/" + type + "/" + area + "/" + ele  + "/max/" + date;
				}else if(type == "top" && ele == "tmin"){
						url = livePath + "/history/" + type + "/" + area + "/" + ele  + "/min/" + date;
				}
				$.getJSON(url).then(function(json){
					    //极值及出现日期接口，还需根据降雨类型、高温类型、低温类型过滤数据
					    if(type == "top"){
					    	  var arrInfo = [];
					    	  if(compare.indexOf(">=") != -1){
					    	  		var typeValue = compare.replace(">=","");
					    	  		json.forEach(function (eleInf) {
							    	 			if(eleInf.value >= typeValue){
							    	 				 	arrInfo.push(eleInf);
							    	 			}
							    	 	});
					    	  }else if(compare.indexOf("<=") != -1){
					    	  		var typeValue = compare.replace("<=","");
					    	  		json.forEach(function (eleInf) {
							    	 			if(eleInf.value <= typeValue){
							    	 				 	arrInfo.push(eleInf);
							    	 			}
							    	 	});
					    	  }
					    	 	json = arrInfo;
					    }
							var result = Aws.toGeoJSON(json);
							
							//清理图层
            	var map = disastrousWeather.map;
            	var markerGroup = disastrousWeather.markerGroup;
            	if(markerGroup != null && markerGroup.length > 0){
            			for(var i=0; i<markerGroup.length;i++){
			            		var marker = markerGroup[i];
			            		map.removeLayer(marker);
			            }
			            disastrousWeather.markerGroup = [];
            	}
            	
							var geoJsonLayer = L.geoJSON(result,{
			            pointToLayer:function (feature,latlng) {
			                
			                var textMarker = L.textMarker(latlng,{
			                    text:feature.properties.value,
			                    font:"12px",
			                    offset:[5,0],
			                    bounds:[[-6,5],[6,30]],
			                    textBaseline:"middle",
			                    color:"#ff0000",
			                    stroke:true,
			                    weight:1
			                });
			                
			                var circleMarker = L.circleMarker(latlng,{radius:1,color:"#000000"});
			                disastrousWeather.markerGroup.push(circleMarker);
			                circleMarker.addTo(map);
			                
			                return textMarker;
			            }
			        }).bindPopup(function(layer){
				            var info = layer.feature.properties;
				            if(type == "uptonow" || type == "days" || type == "days/longest"){
				            			var html = "站号: " + info.stationId + "</br>";
							            		html += "站名: " + info.stName + "</br>";
							            		html += "省份: " + info.province + "</br>";
							            		html += "日数: " + info.value + "</br>";
							            return html;
				            }else if(type == "top"){
				            		 	var html = "站号: " + info.stationId + "</br>";
							            		html += "站名: " + info.stName + "</br>";
							            		html += "省份: " + info.province + "</br>";
							            		html += "时间: " + info.time + "</br>";
							            		html += "数值: " + info.value + "℃</br>";
							            return html;
				            }
				            
			        });
			        disastrousWeather.markerGroup.push(geoJsonLayer);
			        geoJsonLayer.addTo(map);
							
				});
				
		},
		hideCalendar:function(){
			$("#rainStartTime").hide();
    	  $("#rainEndTime").hide();
    	  $("#maxTempStartTime").hide();
    	  $("#maxTempEndTime").hide();
    	  $("#minTempStartTime").hide();
    	  $("#minTempEndTime").hide();
    	  $("#aridStartTime").hide();
    	  $("#aridEndTime").hide();	
		}
    
});