HistoryExtreme = L.Class.extend({
    initialize: function (options) {
        
        
    },
    show:function(){
				//显示模块对应的DIV
				
		},
		hide:function(){
				//隐藏模块对应的DIV
				
		},
		initUI:function(){

			//初始化高度
			this.setHeight();
				//初始化模块界面UI
			  this.createMapEchart();
			  this.createBarEchart();
				
				this.show();
		},
	    setHeight:function(){
//设置表格的高度
			var bigDataShiKCenterHeight=$("body").height()-30;
			$(".bigDataShiKCenter").height(bigDataShiKCenterHeight);
			var temperatureTable = $(".bigDataMaxTemperature").height()-$(".bigDataMaxTemperature .selectLi").height()-47;
			var bigDataRainHeight=$(".bigDataRight").height()*0.95+$(".bigDataRight").width()*0.95*0.05;
			$(".bigDataRain").height(bigDataRainHeight);
			var tableHeight=bigDataRainHeight-$(".bigDataRight .selectLi").height()-50;
			$(".bigDataRight .rainTable21").height(tableHeight);
			$(".temperatureTable21").height(temperatureTable);
			var bigMidMapHeight = bigDataRainHeight - $(".bigMidShiXV").height()-20;
			$(".bigMidMap").height(bigMidMapHeight);
			var mapShiXvChart1Height=$(".bigMidShiXV").height()-8;
			$(".mapShiXvChart1").height(mapShiXvChart1Height)
		},
		handler:function(){
			var that = this;
			//监听浏览器视图的大小变化
			$(window).resize(function(){
				location.reload();
				that.setHeight();
				//这里你可以尽情的写你的刷新代码！
			});
				//处理操作逻辑
				
				$("input[name='maxTempSelect']").change(function(){
			  		var type = $("input[name='maxTempSelect']:checked").val();
			  		historyExtreme.getHistoryExtremeData(type,true);
			  });
			  
			  $("input[name='minTempSelect']").change(function(){
			  		var type = $("input[name='minTempSelect']:checked").val();
			  		historyExtreme.getHistoryExtremeData(type,true);
			  });
			  
			  $("input[name='rainSelect']").change(function(){
			  		var type = $("input[name='rainSelect']:checked").val();
			  		historyExtreme.getHistoryExtremeData(type,true);
			  });
			  
			  //点击站点时出发的事件
				$("#maxtemperature tr").die().live("click",function(){
						var type = $("input[name='maxTempSelect']:checked").val();
						var echartMapData = historyExtreme.echartMapData;
						
						if(echartMapData == null || type != echartMapData.type ){
									var maxTempData = historyExtreme.maxTempData;
									historyExtreme.updateMapEchart(maxTempData.result, maxTempData.publishTime, maxTempData.type);
									historyExtreme.updateBarEchart(maxTempData.result, maxTempData.publishTime, maxTempData.type);
						}
						
				});
				
				$("#mintemperature tr").die().live("click",function(){
						var type = $("input[name='minTempSelect']:checked").val();
						var echartMapData = historyExtreme.echartMapData;
						
						if(echartMapData == null || type != echartMapData.type ){
									var minTempData = historyExtreme.minTempData;
									historyExtreme.updateMapEchart(minTempData.result, minTempData.publishTime, minTempData.type);
									historyExtreme.updateBarEchart(minTempData.result, minTempData.publishTime, minTempData.type);
						}
						
				});
				
				$("#rain tr").die().live("click",function(){
						var type = $("input[name='rainSelect']:checked").val();
						var echartMapData = historyExtreme.echartMapData;
						
						if(echartMapData == null || type != echartMapData.type ){
									var rainData = historyExtreme.rainData;
									historyExtreme.updateMapEchart(rainData.result, rainData.publishTime, rainData.type);
									historyExtreme.updateBarEchart(rainData.result, rainData.publishTime, rainData.type);
						}
						
				});
				
				
				//默认显示高温数据
	  		var type = $("input[name='maxTempSelect']:checked").val();
	  		historyExtreme.getHistoryExtremeData(type,true);
	  		
	  		//默认显示低温数据
	  		var type = $("input[name='minTempSelect']:checked").val();
	  		historyExtreme.getHistoryExtremeData(type,false);
	  		
	  		//默认显示降水数据
	  		var type = $("input[name='rainSelect']:checked").val();
	  		historyExtreme.getHistoryExtremeData(type,false);
		},
		getHistoryExtremeData:function(type,isShow){
			  /*
			  
			  //最高气温前十名监测
				http://10.10.31.83:1024/live/today/national/temp/max
				
				//最低气温前十名监测
				http://10.10.31.83:1024/live/today/national/temp/min
				
				//最高气温前十名查询
				http://10.10.31.83:1024/live/national/tmax
				
				//最低气温前十名查询
				http://10.10.31.83:1024/live/national/tmin
				
				//高温今年以来前三位
				http://10.10.31.83:1024/history/top3/national/tmax/max/20170101-20170917
				
				//低温入秋以来前三位
				http://10.10.31.83:1024/history/top3/national/tmin/min/20170807-20170917
				
				//降水量突破历史极值_日值_今年以来
				http://10.10.31.83:1024/history/top1/national/rain08/max/20170101-20170917
				
				//建站以来前三位 （高温）
				http://10.10.31.83:1024/history/top3/sta631/tmax/max
				
				//建站以来前三位 （低温）
				http://10.10.31.83:1024/history/top3/sta631/tmin/min
				
				//建站以来前三位 （rain08）
				http://10.10.31.83:1024/history/top3/sta631/rain08/max
				
				//建站以来前三位 （rain20）
				http://10.10.31.83:1024/history/top3/sta631/rain20/max
				
				//达到历史同旬前三
				http://10.10.31.83:1024/history/top3/sta631/tmax/max/1951-2017/0911-0920
				//达到历史同月前三
				http://10.10.31.83:1024/history/top3/sta631/tmax/max/1951-2017/0901-0920
				
				//日降水突破历史同旬
				http://10.10.31.83:1024/history/top1/sta631/rain08/max/1951-2017/0911-0920
				//日降水突破历史同月
				http://10.10.31.83:1024/history/top1/sta631/rain08/max/1951-2017/0901-0930
				
				//降水量排名日值
				http://10.10.31.83:1024/history/last/national/rain20/20170917
				
				
				*/
				var dateTime = historyExtreme.getYesterday();
				var year = dateTime.substring(0,4);
				
				var url = "";
				if(type == "todayTmaxTop10"){   //最高气温前十名监测
						url = livePath + "/live/today/sta631/temp/max";
				}else if(type == "todayTminTop10"){   //最低气温前十名监测
						url = livePath + "/live/today/sta631/temp/min";
				}else if(type == "tmaxTop10"){  //最高气温前十名查询
						url = livePath + "/history/stats/sta631/tmax/" + dateTime;
				}else if(type == "tminTop10"){ //最低气温前十名查询
						url = livePath + "/history/stats/sta631/tmin/" + dateTime;
				}else if(type == "tmaxTop3SinceThisYear"){  //高温今年以来前三位
					  var sinceThisYear = historyExtreme.getSinceThisYear();
						url = livePath + "/history/top3/sta631/tmax/max/" + sinceThisYear;
				}else if(type == "tminTop3SinceThisYear"){  //低温入秋以来前三位
						url = livePath + "/history/top3/sta631/tmin/min/20170807-20171230";
				}else if(type == "rain20SinceThisYear"){  //20时降水量突破历史极值_日值_今年以来
					  var sinceThisYear = historyExtreme.getSinceThisYear();
						url = livePath + "/history/top1/sta631/rain20/max/" + sinceThisYear;
				}else if(type == "rain08SinceThisYear"){  //08时降水量突破历史极值_日值_今年以来
					  var sinceThisYear = historyExtreme.getSinceThisYear();
						url = livePath + "/history/top1/sta631/rain08/max/" + sinceThisYear;
				}else if(type == "tmaxTop3SinceTheStation"){  //建站以来前三位 （高温）
						url = livePath + "/history/top3/sta631/tmax/max";
				}else if(type == "tminTop3SinceTheStation"){  //建站以来前三位 （低温）
						url = livePath + "/history/top3/sta631/tmin/min";
				}else if(type == "rain20SinceTheStation"){  //20时降水量突破历史极值_日值_建站以来
						url = livePath + "/history/top1/sta631/rain20/max";
				}else if(type == "rain08SinceTheStation"){  //08时降水量突破历史极值_日值_建站以来
						url = livePath + "/history/top1/sta631/rain08/max";
				}else if(type == "tmaxTop3HistorySameDay"){  //高温达到历史同旬前三
						var sameDay = historyExtreme.getSameDay();
						//url = livePath + "/history/top3/sta631/tmax/max/1951-"+year+"/" + sameDay;
						url = livePath + "/history/same-period/top3/sta631/tmax/max/" + sameDay;
				}else if(type == "tminTop3HistorySameDay"){  //低温达到历史同旬前三
						var sameDay = historyExtreme.getSameDay();
						//url = livePath + "/history/top3/sta631/tmin/min/1951-"+year+"/" + sameDay;
						url = livePath + "/history/same-period/top3/sta631/tmin/min/" + sameDay;
				}else if(type == "tmaxTop3HistorySameMonth"){  //高温达到历史同月前三
						var sameMonth = historyExtreme.getSameMonth();
						//url = livePath + "/history/top3/sta631/tmax/max/1951-"+year+"/" + sameMonth;
						url = livePath + "/history/same-period/top3/sta631/tmax/max/" + sameMonth;
				}else if(type == "tminTop3HistorySameMonth"){  //低温达到历史同月前三
						var sameMonth = historyExtreme.getSameMonth();
						//url = livePath + "/history/top3/sta631/tmin/min/1951-"+year+"/" + sameMonth;
						url = livePath + "/history/same-period/top3/sta631/tmin/min/" + sameMonth;
				}else if(type == "rain20HistorySameDay"){  //20时日降水突破历史同旬
						var sameDay = historyExtreme.getSameDay();
						//url = livePath + "/history/top1/sta631/rain20/max/1951-"+year+"/" + sameDay;
						url = livePath + "/history/same-period/top1/sta631/rain20/max/" + sameDay;
				}else if(type == "rain08HistorySameDay"){  //08时日降水突破历史同旬
						var sameDay = historyExtreme.getSameDay();
						//url = livePath + "/history/top1/sta631/rain08/max/1951-"+year+"/" + sameDay;
						url = livePath + "/history/same-period/top1/sta631/rain08/max/" + sameDay;
				}else if(type == "rain20HistorySameMonth"){  //20时日降水突破历史同月
						var sameMonth = historyExtreme.getSameMonth();
						//url = livePath + "/history/top1/sta631/rain20/max/1951-"+year+"/" + sameMonth;
						url = livePath + "/history/same-period/top1/sta631/rain20/max/" + sameMonth;
				}else if(type == "rain08HistorySameMonth"){  //08时日降水突破历史同月
						var sameMonth = historyExtreme.getSameMonth();
						//url = livePath + "/history/top1/sta631/rain08/max/1951-"+year+"/" + sameMonth;
						url = livePath + "/history/same-period/top1/sta631/rain08/max/" + sameMonth;
				}else if(type == "rain20Top"){  //20时降水量排名日值
						url = livePath + "/history/stats/sta631/rain20/" + dateTime;
				}else if(type == "rain08Top"){  //08时降水量排名日值
						url = livePath + "/history/stats/sta631/rain08/" + dateTime;
				}
				
				$.getJSON(url).then(function(json){
            	if(type == "todayTmaxTop10"){
            			var url1 = livePath + "/history/top3/sta631/tmax/max";
            			$.getJSON(url1).then(function(json1){
            						for(var j=0,len=json.length; j < len; j++){
            								var stationId = json[j].stationId;
            								
            								var obj = json1[stationId];
            								if(obj != null){
            										var extremeValue = obj[0].value;
            										json[j].extremeValue = extremeValue;
            								}
            								
            						}
            						
            						Aws.attachAwsInfs(json);
												var result = json;
												
			            		  var maxTempTable = "";
								  			$("#maxtemperature").html("");
			            			var maxTempData = result;
										  	var maxTempTime = "";
										  	
										  	if(maxTempData != null && maxTempData.length > 10){
										  			var mapData = [];
										  			var number = 1;
												  	for(var i=0; i<10;i++){
													  	  var aws = maxTempData[i];
													  	  mapData.push(aws);
													  	  
													  	  maxTempTime = aws.time;
													  		maxTempTable += "<tr><td><font color='red' >"+number+"</font></td><td>"+aws.stName+"("+aws.province+")</td><td>"+aws.value+"℃</td><td><font color='red' >"+aws.extremeValue+"℃</font></td></tr>";
													  		number++;
													  }
													  $("#maxtemperature").html(maxTempTable);
													  
													  var publishTime = maxTempTime.substring(4,6) + "月" + maxTempTime.substring(6,8) + "日00时至现在";
													  $("#maxtemperaturePublish").text(publishTime);
													  
													  //地图叠加显示、时序图显示
								            if(isShow){
								            		historyExtreme.updateMapEchart(mapData,publishTime,type);
								            		historyExtreme.updateBarEchart(mapData,publishTime,type);	
								            }
								            
								            historyExtreme.maxTempData = {"result":mapData, "publishTime":publishTime, "type":type};
										  	}else{
			            					$("#maxtemperature").html("<tr><td cols='3'><font color='red' size='4' >无达标站点!</font></td></tr>");
			            					$("#maxtemperaturePublish").text("");
			            			}
            			});
            		  
							  	
            	}else if(type == "tmaxTop10"){
            			var url1 = livePath + "/history/top3/sta631/tmax/max";
            			$.getJSON(url1).then(function(json1){
            						for(var j=0,len=json.length; j < len; j++){
            								var stationId = json[j].stationId;
            								
            								var obj = json1[stationId];
            								if(obj != null){
            										var extremeValue = obj[0].value;
            										json[j].extremeValue = extremeValue;
            								}
            								
            						}
            						
            						Aws.attachAwsInfs(json);
			            			var result = json;
			            			
			            			var maxTempTable = "";
								  			$("#maxtemperature").html("");
			            			var maxTempData = result;
										  	var maxTempTime = dateTime;
										  	
										  	if(maxTempData != null && maxTempData.length > 10){
										  		  var mapData = [];
										  			var number = 1;
												  	for(var i=0; i<10;i++){
													  	  var aws = maxTempData[i];
													  	  mapData.push(aws);
													  	  
													  		maxTempTable += "<tr><td><font color='red' >"+number+"</font></td><td>"+aws.stName+"("+aws.province+")</td><td>"+aws.value+"℃</td><td><font color='red' >"+aws.extremeValue+"℃</font></td></tr>";
													  		number++;
													  }
													  $("#maxtemperature").html(maxTempTable);
													  
													  var publishTime = maxTempTime.substring(4,6) + "月" + maxTempTime.substring(6,8) + "日";
													  $("#maxtemperaturePublish").text(publishTime);
													  
													  //地图叠加显示、时序图显示
								            if(isShow){
								            		historyExtreme.updateMapEchart(mapData,publishTime,type);
								            		historyExtreme.updateBarEchart(mapData,publishTime,type);	
								            }
								            
								            historyExtreme.maxTempData = {"result":mapData, "publishTime":publishTime, "type":type};
										  	}else{
			            					$("#maxtemperature").html("<tr><td cols='3'><font color='red' size='4' >无达标站点!</font></td></tr>");
			            					$("#maxtemperaturePublish").text("");
			            			}
            			});
            			
							  	
            	}else if(type == "tmaxTop3SinceThisYear"
            			|| type == "tmaxTop3SinceTheStation"
            			|| type == "tmaxTop3HistorySameMonth"
            			|| type == "tmaxTop3HistorySameDay"){
            		  var result = historyExtreme.getConvertData(json);
            		  
            			if(result != null && result.length > 0){
            					var url1 = livePath + "/history/top3/sta631/tmax/max";
		            			$.getJSON(url1).then(function(json1){
		            						for(var j=0,len=result.length; j < len; j++){
		            								var stationId = result[j].stationId;
		            								
		            								var obj = json1[stationId];
		            								if(obj != null){
		            										var extremeValue = obj[0].value;
		            										result[j].extremeValue = extremeValue;
		            								}
		            								
		            						}
		            						
		            						var maxTempTable = "";
										  			$("#maxtemperature").html("");
					            			var maxTempData = result;
												  	var maxTempTime = "";
												  	
												  	var mapData = [];
												  	var number = 1;
												  	for(var i=0; i<10;i++){
													  	  var aws = maxTempData[i];
													  	  mapData.push(aws);
													  	  
													  	  maxTempTime = aws.time;
													  		maxTempTable += "<tr><td><font color='red' >"+number+"</font></td><td>"+aws.stName+"("+aws.province+")</td><td>"+aws.value+"℃</td><td><font color='red' >"+aws.extremeValue+"℃</font></td></tr>";
													  		number++;
													  }
													  $("#maxtemperature").html(maxTempTable);
													  
													  var publishTime = maxTempTime.substring(4,6) + "月" + maxTempTime.substring(6,8) + "日";
													  $("#maxtemperaturePublish").text(publishTime);
													  
													  //地图叠加显示、时序图显示
								            if(isShow){
								            		historyExtreme.updateMapEchart(mapData,publishTime,type);
								            		historyExtreme.updateBarEchart(mapData,publishTime,type);	
								            }
			            					
			            					historyExtreme.maxTempData = {"result":mapData, "publishTime":publishTime, "type":type};
		            			});
            					
            					
            			}else{
            					$("#maxtemperature").html("<tr><td cols='3'><font color='red' size='4' >无达标站点!</font></td></tr>");
            					$("#maxtemperaturePublish").text("");
            			}
							  	
            	}else if(type == "todayTminTop10"){
            			var url1 = livePath + "/history/top3/sta631/tmin/min";
            			$.getJSON(url1).then(function(json1){
            						for(var j=0,len=json.length; j < len; j++){
            								var stationId = json[j].stationId;
            								
            								var obj = json1[stationId];
            								if(obj != null){
            										var extremeValue = obj[0].value;
            										json[j].extremeValue = extremeValue;
            								}
            								
            						}
            						
            						Aws.attachAwsInfs(json);
												var result = json;
												
			            		  var minTempTable = "";
								  			$("#mintemperature").html("");
			            			var minTempData = result;
										  	var minTempTime = "";
										  	
										  	if(minTempData != null && minTempData.length > 10){
										  		  var mapData = [];
										  			var number = 1;
												  	for(var i=0; i<10;i++){
													  	  var aws = minTempData[i];
													  	  mapData.push(aws);
													  	  
													  	  minTempTime = aws.time;
													  		minTempTable += "<tr><td><font color='red' >"+number+"</font></td><td>"+aws.stName+"("+aws.province+")</td><td>"+aws.value+"℃</td><td><font color='red' >"+aws.extremeValue+"℃</font></td></tr>";
													  		number++;
													  }
													  $("#mintemperature").html(minTempTable);
													  
													  var publishTime = minTempTime.substring(4,6) + "月" + minTempTime.substring(6,8) + "日00时至现在";
													  $("#mintemperaturePublish").text(publishTime);
													  
													  //地图叠加显示、时序图显示
								            if(isShow){
								            		historyExtreme.updateMapEchart(mapData,publishTime,type);
								            		historyExtreme.updateBarEchart(mapData,publishTime,type);	
								            }
								            
								            historyExtreme.minTempData = {"result":mapData, "publishTime":publishTime, "type":type};
										  	}else{
										  			$("#mintemperature").html("<tr><td cols='3'><font color='red' size='4' >无达标站点!</font></td></tr>");
			            					$("#mintemperaturePublish").text("");
										  	}
            			});
							  	
							  	
            	}else if(type == "tminTop10"){
            			var url1 = livePath + "/history/top3/sta631/tmin/min";
            			$.getJSON(url1).then(function(json1){
            						for(var j=0,len=json.length; j < len; j++){
            								var stationId = json[j].stationId;
            								
            								var obj = json1[stationId];
            								if(obj != null){
            										var extremeValue = obj[0].value;
            										json[j].extremeValue = extremeValue;
            								}
            								
            						}
            						
            						Aws.attachAwsInfs(json);
			            			var result = json;
			            			
			            			var minTempTable = "";
								  			$("#mintemperature").html("");
			            			var minTempData = result;
										  	var minTempTime = dateTime;
										  	
										  	if(minTempData != null && minTempData.length > 10){
										  		  var mapData = [];
										  			var number = 1;
												  	for(var i=0; i<10;i++){
													  	  var aws = minTempData[i];
													  	  mapData.push(aws);
													  	  
													  		minTempTable += "<tr><td><font color='red' >"+number+"</font></td><td>"+aws.stName+"("+aws.province+")</td><td>"+aws.value+"℃</td><td><font color='red' >"+aws.extremeValue+"℃</font></td></tr>";
													  		number++;
													  }
													  $("#mintemperature").html(minTempTable);
													  
													  var publishTime = minTempTime.substring(4,6) + "月" + minTempTime.substring(6,8) + "日";
													  $("#mintemperaturePublish").text(publishTime);
													  
													  //地图叠加显示、时序图显示
								            if(isShow){
								            		historyExtreme.updateMapEchart(mapData,publishTime,type);
								            		historyExtreme.updateBarEchart(mapData,publishTime,type);	
								            }
								            
								            historyExtreme.minTempData = {"result":mapData, "publishTime":publishTime, "type":type};
										  	}else{
										  			$("#mintemperature").html("<tr><td cols='3'><font color='red' size='4' >无达标站点!</font></td></tr>");
			            					$("#mintemperaturePublish").text("");
										  	}
            			});
            			
							  	
            	}else if(type == "tminTop3SinceThisYear"
            			|| type == "tminTop3SinceTheStation"
            			|| type == "tminTop3HistorySameMonth"
            			|| type == "tminTop3HistorySameDay"){
            		  var result = historyExtreme.getConvertData(json);
            		  
            			if(result != null && result.length > 0){
            					var url1 = livePath + "/history/top3/sta631/tmin/min";
		            			$.getJSON(url1).then(function(json1){
		            						for(var j=0,len=result.length; j < len; j++){
		            								var stationId = result[j].stationId;
		            								
		            								var obj = json1[stationId];
		            								if(obj != null){
		            										var extremeValue = obj[0].value;
		            										result[j].extremeValue = extremeValue;
		            								}
		            								
		            						}
		            						
		            						var minTempTable = "";
										  			$("#mintemperature").html("");
					            			var minTempData = result;
												  	var minTempTime = "";
												  	
												  	var mapData = [];
												  	var number = 1;
												  	for(var i=0,len=minTempData.length; i<len;i++){
													  	  var aws = minTempData[i];
													  	  mapData.push(aws);
													  	  
													  	  minTempTime = aws.time;
													  		minTempTable += "<tr><td><font color='red' >"+number+"</font></td><td>"+aws.stName+"("+aws.province+")</td><td>"+aws.value+"℃</td><td><font color='red' >"+aws.extremeValue+"℃</font></td></tr>";
													  		number++;
													  }
													  $("#mintemperature").html(minTempTable);
													  
													  var publishTime = minTempTime.substring(4,6) + "月" + minTempTime.substring(6,8) + "日";
													  $("#mintemperaturePublish").text(publishTime);
													  
													  //地图叠加显示、时序图显示
								            if(isShow){
								            		historyExtreme.updateMapEchart(mapData,publishTime,type);
								            		historyExtreme.updateBarEchart(mapData,publishTime,type);	
								            }
			            					
			            					historyExtreme.minTempData = {"result":mapData, "publishTime":publishTime, "type":type};
            					});
            					
            			}else{
            					$("#mintemperature").html("<tr><td cols='3'><font color='red' size='4' >无达标站点!</font></td></tr>");
            					$("#mintemperaturePublish").text("");
            			}
							  	
            	}else if(type == "rain20Top" || type == "rain08Top"){
            			var url1 = livePath + "/history/top1/sta631/rain20/max";
            			if(type == "rain08Top"){
            					url1 = livePath + "/history/top1/sta631/rain08/max";	
            			}
            			$.getJSON(url1).then(function(json1){
            						for(var j=0,len=json.length; j < len; j++){
            								var stationId = json[j].stationId;
            								
            								var obj = json1[stationId];
            								if(obj != null){
            										var extremeValue = obj[0].value;
            										json[j].extremeValue = extremeValue;
            								}
            								
            						}
            						
            						Aws.attachAwsInfs(json);
			            			var result = json;
			            			
			            			if(result != null && result.length > 0){
			            				  var rainTable = "";
												    $("#rain").html("");
					            			var rainData = result;
												  	var rainTime = dateTime;
												  	
												  	var mapData = [];
												  	var number = 1;
												  	for(var i=0,len=rainData.length; i<len;i++){
													  	  var aws = rainData[i];
													  	  
													  	  if(aws.value < 0.1){
													  	  		continue;	
													  	  }
													  	  
													  	  mapData.push(aws);
													  		rainTable += "<tr><td><font color='red' >"+number+"</font></td><td>"+aws.stName+"("+aws.province+")</td><td>"+aws.value+"mm</td><td><font color='red' >"+aws.extremeValue+"mm</font></td></tr>";
													  		number++;
													  }
													  $("#rain").html(rainTable);
													  
													  var publishTime = rainTime.substring(4,6) + "月" + rainTime.substring(6,8) + "日";
													  $("#rainPublish").text(publishTime);
													  
													  //地图叠加显示、时序图显示
								            if(isShow){
								            		historyExtreme.updateMapEchart(mapData,publishTime,type);
								            		historyExtreme.updateBarEchart(mapData,publishTime,type);	
								            }
								            
								            historyExtreme.rainData = {"result":mapData, "publishTime":publishTime, "type":type};
			            			}else{
			            					$("#rain").html("<tr><td cols='3'><font color='red' size='4' >无达标站点!</font></td></tr>");
			            					$("#rainPublish").text("");
			            			}
            			});
            		  
							  	
            	}else if(type == "rain20SinceThisYear" || type == "rain08SinceThisYear"
            		|| type == "rain20SinceTheStation" || type == "rain08SinceTheStation"
            		|| type == "rain20HistorySameMonth" || type == "rain08HistorySameMonth"
            		|| type == "rain20HistorySameDay" || type == "rain08HistorySameDay"){ 
            			var result = historyExtreme.getConvertData(json);
            		  
            			if(result != null && result.length > 0){
            				  var url1 = livePath + "/history/top1/sta631/rain20/max";
            					if(type == "rain08SinceThisYear" || type == "rain08SinceTheStation"
            							|| type == "rain08HistorySameMonth" || type == "rain08HistorySameDay"){
		            					url1 = livePath + "/history/top1/sta631/rain08/max";	
		            			}
            					$.getJSON(url1).then(function(json1){
	            						for(var j=0,len=result.length; j < len; j++){
	            								var stationId = result[j].stationId;
	            								
	            								var obj = json1[stationId];
	            								if(obj != null){
	            										var extremeValue = obj[0].value;
	            										result[j].extremeValue = extremeValue;
	            								}
	            								
	            						}
	            						
	            						var rainTable = "";
									  			$("#rain").html("");
				            			var rainData = result;
											  	var rainTime = "";
											  	
											  	var mapData = [];
											  	var number = 1;
											  	for(var i=0,len=rainData.length; i<len;i++){
												  	  var aws = rainData[i];
												  	  mapData.push(aws);
												  	  
												  	  rainTime = aws.time;
												  		rainTable += "<tr><td><font color='red' >"+number+"</font></td><td>"+aws.stName+"("+aws.province+")</td><td>"+aws.value+"mm</td><td><font color='red' >"+aws.extremeValue+"mm</font></td></tr>";
												  		number++;
												  }
												  $("#rain").html(rainTable);
												  
												  var publishTime = rainTime.substring(4,6) + "月" + rainTime.substring(6,8) + "日";
												  $("#rainPublish").text(publishTime);
												  
												  //地图叠加显示、时序图显示
							            if(isShow){
							            		historyExtreme.updateMapEchart(mapData,publishTime,type);
							            		historyExtreme.updateBarEchart(mapData,publishTime,type);	
							            }
		            					
		            					historyExtreme.rainData = {"result":mapData, "publishTime":publishTime, "type":type};
            					});
            					
            			}else{
            					$("#rain").html("<tr><td cols='3'><font color='red' size='4' >无达标站点!</font></td></tr>");
            					$("#rainPublish").text("");
            			}	
            			
            	}
							
							
				});
				
		},
		getYesterday:function(){
				var today = new Date();
				var yesterday = new Date(today.getTime()-1000*60*60*24);
  		  var year = yesterday.getFullYear();
				var month = yesterday.getMonth() + 1;
				var day = yesterday.getDate();
				var dateTime = year + (month<10?"0"+month:""+month)  + (day<10?"0"+day:""+day);
				return dateTime;
		},
		getSinceThisYear:function(){
			  var today = new Date();
  		  var year = today.getFullYear();
  		  var startDate = year + "0101";
  		  var endDate = historyExtreme.getYesterday();
  		  return startDate + "-" + endDate;
		},
		getSameMonth:function(){
			  var today = new Date();
			  var year = today.getFullYear();
			  var month = today.getMonth() + 1;
			  var day = today.getDate();
  		  var startDate = (month<10?"0"+month:""+month) + "01";
  		  
  		  //var lastDay = new Date(new Date(year,month,1).getTime()-1000*60*60*24);
  		  var lastDay = new Date(year,month,0);
  		  year = lastDay.getFullYear();
  		  month = lastDay.getMonth() + 1;
  		  day = lastDay.getDate();
  		  var endDate = (month<10?"0"+month:""+month)  + (day<10?"0"+day:""+day);
  		  return startDate + "-" + endDate;
		},
		getSameDay:function(){
			 	var today = new Date();
			  var year = today.getFullYear();
			  var month = today.getMonth() + 1;
			  var day = today.getDate();
			  
			  var monthStr = (month<10?"0"+month:""+month);
			  var startDate = monthStr;
			  var endDate = monthStr;
			  if(day < 11){
			  		startDate += "01";
			  		endDate += "10";
			  }else if(day > 10 && day < 21){
			  		startDate += "11";
			  		endDate += "21";
			  }else{
			  		startDate += "21";
			  		
			  		var lastDay = new Date(year,month,0);
			  		day = lastDay.getDate();
			  		endDate += (day<10?"0"+day:""+day);
			  }
			  return startDate + "-" + endDate;
		},
		getConvertData:function(json){
				//用昨天的值判断突破历史极值
  		  var today = new Date();
  		  var yesterday = new Date(today.getTime()-1000*60*60*24);
  		  var year = yesterday.getFullYear();
				var month = yesterday.getMonth() + 1;
				var day = yesterday.getDate();
				var dateTime = year + (month<10?"0"+month:""+month)  + (day<10?"0"+day:""+day);
  		  
  		  var eleInfArr = [];
  		  var hash = json;
  		  for(var id in hash){
            //arr.push({stationId:id,value:hash[id]});
            var arr = hash[id];
            for(var i=0,len=arr.length;i<len;i++){
            		var info = arr[i];
            		if(info.time == dateTime){
            				info.rank = i;
            				eleInfArr.push(info);
            				break;				
            		}	
            }
        }
        
        Aws.attachAwsInfs(eleInfArr);
        return eleInfArr;
		},
		createMapEchart:function(){
				var myChart = echarts.init(document.getElementById('echartMap'));
				
				var data = [];
				var option = {
				    //backgroundColor: '#404a59',
				    
				    title: {
				        text: '',
				        subtext: '',
				        //sublink: '',
				        left: 'center',
				        textStyle: {
				            color: '#fff'
				        }
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: function (params) {
				        	  return params.name + ' : ' + params.value[2];
							  }
				    },
				    /*legend: {
				        orient: 'vertical',
				        y: 'bottom',
				        x:'right',
				        data:['pm2.5'],
				        textStyle: {
				            color: '#fff'
				        }
				    },*/
				    visualMap: {
				        min: 0,
				        max: 200,
				        calculable: true,
				        inRange: {
				            color: ['#50a3ba', '#eac736', '#d94e5d']
				        },
				        textStyle: {
				            color: '#fff'
				        }
				    },
				    geo: {
				        map: 'china',
				        label: {
				            emphasis: {
				                show: false
				            }
				        },
				        //roam: true,
				        itemStyle: {
				            normal: {
				                areaColor: '#323c48',
				                borderColor: '#111'
				            },
				            emphasis: {
				                areaColor: '#2a333d'
				            }
				        }
				    },
				    series : [
				        {
				            name: '',
				            type: 'scatter',
				            coordinateSystem: 'geo',
				            data: [],
				            symbolSize: function (val) {
				            	  var size = val[5] / 10;
				            	  if(size < 5){
				            	  		size = 5
				            		}
				                return size;
				                //return 5;
				            },
				            label: {
				                normal: {
				                    formatter: '{b}',
				                    position: 'right',
				                    show: false
				                },
				                emphasis: {
				                    show: true
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#ddb926'
				                }
				            }
				        },
				        {
				            name: 'Top 5',
				            type: 'effectScatter',
				            coordinateSystem: 'geo',
				            data: [],
				            symbolSize: function (val) {
				                var size = val[5] / 10;
				            	  if(size < 5){
				            	  		size = 5
				            		}
				                return size;
				                //return 5;
				            },
				            //showEffectOn: 'render',
				            rippleEffect: {
				                brushType: 'stroke'
				            },
				            //hoverAnimation: true,
				            label: {
				                normal: {
				                    formatter: '{b}',
				                    position: 'right',
				                    show: true
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#f4e925',
				                    shadowBlur: 10,
				                    shadowColor: '#333'
				                }
				            },
				            zlevel: 1
				        }
				    ]
				};
				
				myChart.setOption(option);
				myChart.on('click', function (params) {
						var data = params.data;
					  var stationId = data.value[4];
				    //alert( params.name );
				    //historyExtreme.stationInfo = params.data;
				    
				    //historyExtreme.updateStationChart(stationId);
				    
				});
				
				//this.chartOption = option;
				this.echartMap = myChart;
				
		},
		createBarEchart:function(){
				var myChart = echarts.init(document.getElementById('barChart'));
				
				var option = {
				    //backgroundColor: '#404a59',
						
				    title: {
				        top: 0,
				        text: '',
				        //subtext: '数据纯属虚构',
				        left: 'center',
				        textStyle: {
				            color: '#fff'
				        }
				    },
				    tooltip : {
				        trigger: 'item',
				        
				    },
				    /*legend: {
				        top: '25',
				        left: 'center',
				        //left: '100',
				        data:['步数', 'Top 12'],
				        textStyle: {
				            color: '#fff'
				        }
				    },*/
				    calculable : true,
				    xAxis : [
				        {
				            type : 'category',
				            data : []
				        }
				    ],
				    yAxis : [
				        {
				            type : 'value'
				        }
				    ],
				    series : [
				        {
				            name: '',
				            type: 'bar',
				            data: []
				        }
				    ]
				};
				
				myChart.setOption(option);
				this.echartBarChart = myChart;	
		},
		updateMapEchart:function(result, publishTime, type){
				var myChart = historyExtreme.echartMap;
				var option = myChart.getOption();
				var data = result;
				var time = publishTime;
				
				var convertData = function (data) {
				    var res = [];
				    for (var i = 0; i < data.length; i++) {
				        var aws = data[i];
				        if(aws.stName == undefined){
					  	  		continue;
					  	  }
					  	  
					  	  if(aws.rank == null){
					  	  		res.push({name: aws.stName, value: [aws.longitude, aws.latitude, aws.province, aws.stName, aws.stationId, null,     aws.extremeValue, aws.value]});	
					  	  }else{
					  	  		res.push({name: aws.stName, value: [aws.longitude, aws.latitude, aws.province, aws.stName, aws.stationId, aws.rank, aws.extremeValue, aws.value]});	
					  	  }
					  	  
				    }
				    
				    return res;
				};
				
				var title = ""
				var subTitle = "";
				if(type == "todayTmaxTop10"){
							title = "高温前十名监测";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "tmaxTop10"){
							title = "高温前十名查询";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "tmaxTop3SinceThisYear"){
							title =  "高温今年以来前三位";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "tmaxTop3SinceTheStation"){
							title =  "高温建站以来前三";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "tmaxTop3HistorySameMonth"){
							title =  "高温达到历史同月前三";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "tmaxTop3HistorySameDay"){
							title =  "高温达到历史同旬前三";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "todayTminTop10"){
							title = "低温前十名监测";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "tminTop10"){
							title = "低温前十名查询";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "tminTop3SinceThisYear"){
							title =  "低温入秋以来前三位";
							subtext = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "tminTop3SinceTheStation"){
							title =  "低温建站以来前三";
							subtext = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "tminTop3HistorySameMonth"){
							title =  "低温达到历史同月前三";
							subtext = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "tminTop3HistorySameDay"){
							title =  "低温达到历史同旬前三";
							subtext = publishTime;
							
							option.visualMap = {
						        min: -40,
						        max: 45,
						        calculable: true,
						        inRange: {
						            color: ['#0000FF', '#0000FF','#00A6FF','#00FFB5','#00FF08','#94FF00','#FFC300','#FF2C00','#FF0F00','#FF0A00']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain20Top"){
							title = "20时降水量排名日值";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: 0,
						        max: 250,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#72D663', '#3CBA3C','#60B8FF','#0000FF','#F901F7','#D101BA','#A9007D','#810040']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain08Top"){
							title = "08时降水量排名日值";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: 0,
						        max: 250,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#72D663', '#3CBA3C','#60B8FF','#0000FF','#F901F7','#D101BA','#A9007D','#810040']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain20SinceThisYear"){
							title = "20时降水量突破历史极值_日值_今年以来";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: 0,
						        max: 250,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#72D663', '#3CBA3C','#60B8FF','#0000FF','#F901F7','#D101BA','#A9007D','#810040']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain08SinceThisYear"){
							title = "08时降水量突破历史极值_日值_今年以来";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: 0,
						        max: 250,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#72D663', '#3CBA3C','#60B8FF','#0000FF','#F901F7','#D101BA','#A9007D','#810040']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain20SinceTheStation"){
							title = "20时降水量突破历史极值_日值_建站以来";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: 0,
						        max: 250,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#72D663', '#3CBA3C','#60B8FF','#0000FF','#F901F7','#D101BA','#A9007D','#810040']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain08SinceTheStation"){
							title = "08时降水量突破历史极值_日值_建站以来";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: 0,
						        max: 250,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#72D663', '#3CBA3C','#60B8FF','#0000FF','#F901F7','#D101BA','#A9007D','#810040']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain20HistorySameMonth"){
							title = "20时降水量突破历史极值_日值_历史同月";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: 0,
						        max: 250,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#72D663', '#3CBA3C','#60B8FF','#0000FF','#F901F7','#D101BA','#A9007D','#810040']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain08HistorySameMonth"){
							title = "08时降水量突破历史极值_日值_历史同月";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: 0,
						        max: 250,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#72D663', '#3CBA3C','#60B8FF','#0000FF','#F901F7','#D101BA','#A9007D','#810040']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain20HistorySameDay"){
							title = "20时降水量突破历史极值_日值_历史同旬";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: 0,
						        max: 250,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#72D663', '#3CBA3C','#60B8FF','#0000FF','#F901F7','#D101BA','#A9007D','#810040']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain08HistorySameDay"){
							title = "08时降水量突破历史极值_日值_历史同旬";
							subTitle = publishTime;
							
							option.visualMap = {
						        min: 0,
						        max: 250,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#72D663', '#3CBA3C','#60B8FF','#0000FF','#F901F7','#D101BA','#A9007D','#810040']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}
				
				option.title = {
				        top: 0,
				        text: title,
				        subtext: subTitle,
				        left: 'center',
				        textStyle: {
				        	  fontSize: 18,
            				fontWeight: 'bolder',
				            color: '#fff'
				        }
				    };
				
				option.tooltip = {
				        trigger: 'item',
				        formatter: function (params) {
				        	  if(type == "rain20Top" || type == "rain08Top"){
							         return params.name + ' : ' + params.value[7] + "mm" + "<br>极值 : " + params.value[6] + "mm";
							      }else if(type == "rain20SinceThisYear" || type == "rain08SinceThisYear"
							      		|| type == "rain20SinceTheStation" || type == "rain08SinceTheStation"
							      		|| type == "rain20HistorySameMonth" || type == "rain08HistorySameMonth"
							      		|| type == "rain20HistorySameDay" || type == "rain08HistorySameDay"){
							      	 return params.name + ' : ' + params.value[7] + "mm" + "<br>极值 : " + params.value[6] + "mm";
							      }else if(type == "todayTmaxTop10" || type == "tmaxTop10" || type == "todayTminTop10" || type == "tminTop10"){
							      	 return params.name + ' : ' + params.value[7] + "℃" + "<br>极值 : " + params.value[6] + "℃";
							      }else if(type == "tmaxTop3SinceThisYear" || type == "tminTop3SinceThisYear"
				        	  	|| type == "tmaxTop3SinceTheStation" || type == "tminTop3SinceTheStation"
				        	  	|| type == "tmaxTop3HistorySameMonth" || type == "tminTop3HistorySameMonth"
				        	  	|| type == "tmaxTop3HistorySameDay" || type == "tminTop3HistorySameDay"){
							      	 return params.name + ' : ' + params.value[7] + "℃" + "<br>极值 : " + params.value[6] + "℃";
							      }
							  }
				    };
				
				if(type == "todayTminTop10" || type == "tminTop10" 
					|| type == "tminTop3SinceThisYear" || type == "tminTop3SinceTheStation"
					|| type == "tminTop3HistorySameMonth" || type == "tminTop3HistorySameDay"){
							option.series = [
				        {
				            name: '',
				            type: 'scatter',
				            coordinateSystem: 'geo',
				            data: convertData(data),
				            symbolSize: function (val) {
				            	  var size = val[7] / 10;
				            	  if(size < 5){
				            	  		size = 5
				            		}
				                return size;
				                //return 5;
				            },
				            label: {
				                normal: {
				                    formatter: '{b}',
				                    position: 'right',
				                    show: false
				                },
				                emphasis: {
				                    show: true
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#ddb926'
				                }
				            }
				        },
				        {
				            name: 'Top 5',
				            type: 'effectScatter',
				            coordinateSystem: 'geo',
				            data: convertData(data.sort(function (a, b) {
				                return a.value - b.value;
				            }).slice(0, 5)),
				            symbolSize: function (val) {
				                var size = val[7] / 10;
				            	  if(size < 5){
				            	  		size = 5
				            		}
				                return size;
				                //return 5;
				            },
				            //showEffectOn: 'render',
				            rippleEffect: {
				                brushType: 'stroke'
				            },
				            //hoverAnimation: true,
				            label: {
				                normal: {
				                    formatter: '{b}',
				                    position: 'right',
				                    show: true
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#f4e925',
				                    shadowBlur: 10,
				                    shadowColor: '#333'
				                }
				            },
				            zlevel: 1
				        }
				    ];
				}else{
						option.series = [
				        {
				            name: '',
				            type: 'scatter',
				            coordinateSystem: 'geo',
				            data: convertData(data),
				            symbolSize: function (val) {
				            	  var size = val[7] / 10;
				            	  if(size < 5){
				            	  		size = 5
				            		}
				                return size;
				                //return 5;
				            },
				            label: {
				                normal: {
				                    formatter: '{b}',
				                    position: 'right',
				                    show: false
				                },
				                emphasis: {
				                    show: true
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#ddb926'
				                }
				            }
				        },
				        {
				            name: 'Top 5',
				            type: 'effectScatter',
				            coordinateSystem: 'geo',
				            data: convertData(data.sort(function (a, b) {
				                return b.value - a.value;
				            }).slice(0, 5)),
				            symbolSize: function (val) {
				                var size = val[7] / 10;
				            	  if(size < 5){
				            	  		size = 5
				            		}
				                return size;
				                //return 5;
				            },
				            //showEffectOn: 'render',
				            rippleEffect: {
				                brushType: 'stroke'
				            },
				            //hoverAnimation: true,
				            label: {
				                normal: {
				                    formatter: '{b}',
				                    position: 'right',
				                    show: true
				                }
				            },
				            itemStyle: {
				                normal: {
				                    color: '#f4e925',
				                    shadowBlur: 10,
				                    shadowColor: '#333'
				                }
				            },
				            zlevel: 1
				        }
				    ];
				}
				
				myChart.setOption(option);
				this.echartMapData = {"result":result, "publishTime":publishTime, "type":type};
		},
		updateBarEchart:function(result, publishTime, type){
				var myChart = historyExtreme.echartBarChart;
			  var option = myChart.getOption();
			  
			  var categoryList = [];
			  var dataList = [];
			  var extremeValueList = [];
			  var data = result;
			  var len = data.length;
			  if(len > 10){
			  	len = 10;	
			  }
			  for (var i = 0; i < len; i++) {
		    		categoryList.push(data[i].stName);
		    		dataList.push(data[i].value);
		    		extremeValueList.push(data[i].extremeValue);
		    }
				
				var title = "";
				var subtext = "";
				if(type == "todayTmaxTop10"){
					  title = "高温前十名监测";
						subtext = publishTime;
				}else if(type == "tmaxTop10"){
						title =  "高温前十名查询";
						subtext = publishTime;
				}else if(type == "tmaxTop3SinceThisYear"){
						title =  "高温今年以来前三位";
						subtext = publishTime;
				}else if(type == "tmaxTop3SinceTheStation"){
						title =  "高温建站以来前三";
						subtext = publishTime;
				}else if(type == "tmaxTop3HistorySameMonth"){
						title =  "高温达到历史同月前三";
						subtext = publishTime;
				}else if(type == "tmaxTop3HistorySameDay"){
						title =  "高温达到历史同旬前三";
						subtext = publishTime;
				}else if(type == "todayTminTop10"){
						title =  "低温前十名监测";
						subtext = publishTime;
				}else if(type == "tminTop10"){
						title =  "低温前十名查询";
						subtext = publishTime;
				}else if(type == "tminTop3SinceThisYear"){
						title =  "低温入秋以来前三位";
						subtext = publishTime;
				}else if(type == "tminTop3SinceTheStation"){
						title =  "低温建站以来前三";
						subtext = publishTime;
				}else if(type == "tminTop3HistorySameMonth"){
						title =  "低温达到历史同月前三";
						subtext = publishTime;
				}else if(type == "tminTop3HistorySameDay"){
						title =  "低温达到历史同旬前三";
						subtext = publishTime;
				}else if(type == "rain20Top"){
						title =  "20时降水量排名日值Top10";
						subtext = publishTime;
				}else if(type == "rain08Top"){
						title =  "08时降水量排名日值Top10";
						subtext = publishTime;
				}else if(type == "rain20SinceThisYear"){
						title = "20时降水量突破历史极值_日值_今年以来";
						subtext = publishTime;
				}else if(type == "rain08SinceThisYear"){
						title = "08时降水量突破历史极值_日值_今年以来";
						subtext = publishTime;
				}else if(type == "rain20SinceTheStation"){
						title = "20时降水量突破历史极值_日值_建站以来";
						subtext = publishTime;
				}else if(type == "rain08SinceTheStation"){
						title = "08时降水量突破历史极值_日值_建站以来";
						subtext = publishTime;
				}else if(type == "rain20HistorySameMonth"){
						title = "20时降水量突破历史极值_日值_历史同月";
						subtext = publishTime;
				}else if(type == "rain08HistorySameMonth"){
						title = "08时降水量突破历史极值_日值_历史同月";
						subtext = publishTime;
				}else if(type == "rain20HistorySameDay"){
						title = "20时降水量突破历史极值_日值_历史同旬";
						subtext = publishTime;
				}else if(type == "rain08HistorySameDay"){
						title = "08时降水量突破历史极值_日值_历史同旬";
						subtext = publishTime;
				}
				
				option.title = {
				        top: 0,
				        text: title,
				        subtext: subtext,
				        left: 'center',
				        textStyle: {
				        		fontSize: 14,
            				fontWeight: 'bolder',
				            color: '#fff'
				        }
				    };
				    
				option.tooltip = {
				        trigger: 'axis',
				        formatter: function (params) {
				        	  if(type == "todayTmaxTop10" || type == "tmaxTop10"
				        	  	|| type == "todayTminTop10" || type == "tminTop10"
				        	  	|| type == "tmaxTop3SinceThisYear" || type == "tminTop3SinceThisYear"
				        	  	|| type == "tmaxTop3SinceTheStation" || type == "tminTop3SinceTheStation"
				        	  	|| type == "tmaxTop3HistorySameMonth" || type == "tminTop3HistorySameMonth"
				        	  	|| type == "tmaxTop3HistorySameDay" || type == "tminTop3HistorySameDay"){
							         return params[0].name + ' : ' + params[0].data.toFixed(1) + "℃" + "<br>极值 : " + params[1].data.toFixed(1) + "℃";
							      }else if(type == "rain20Top" || type == "rain08Top"
							      		|| type == "rain20SinceThisYear" || type == "rain08SinceThisYear"
							      		|| type == "rain20SinceTheStation" || type == "rain08SinceTheStation"
							      		|| type == "rain20HistorySameMonth" || type == "rain08HistorySameMonth"
							      		|| type == "rain20HistorySameDay" || type == "rain08HistorySameDay"){
							      	 return params[0].name + ' : ' + params[0].data.toFixed(1) + "mm" + "<br>极值 : " + params[1].data.toFixed(1) + "mm";
							      }
							  }
				    };
				
				option.grid = {
                    x:30,
                    y:45,
                    x2:5,
                    y2:25,
                    borderWidth:1
                };
                
				option.xAxis = [
				        {
				            type : 'category',
				            data : categoryList,
				            axisLabel: { 
				            		show: true, 
				            		textStyle: { color: '#fff' } 
				            }
				        }
				    ];
				
				option.yAxis = [
				        {
				            type : 'value',
				            axisLabel: { 
				            		show: true, 
				            		textStyle: { color: '#fff' } 
				            }
				        }
				    ];
				
				if(type == "rain20Top" || type == "rain08Top"
							      		|| type == "rain20SinceThisYear" || type == "rain08SinceThisYear"
							      		|| type == "rain20SinceTheStation" || type == "rain08SinceTheStation"
							      		|| type == "rain20HistorySameMonth" || type == "rain08HistorySameMonth"
							      		|| type == "rain20HistorySameDay" || type == "rain08HistorySameDay"){
						 option.series = [
				        {
				            name: '',
				            type: 'bar',
				            barWidth: 15,
				            data: dataList,
				            itemStyle: {
				            		normal: {
                            color: function (params) {
		                            return "#0AC5F5";
                            }
                        }	
				            }
				        },
				        {
				            name: '',
				            type: 'bar',
				            barWidth: 15,
				            data: extremeValueList,
				            itemStyle: {
				            		normal: {
                            color: function (params) {
                            		return "#C23531";
                            }
                        }	
				            }
				        }
				    ]; 			
				}else{
						option.series = [
				        {
				            name: '',
				            type: 'bar',
				            barWidth: 15,
				            data: dataList,
				            itemStyle: {
				            		normal: {
                            color: function (params) {
		                            return "#0AC5F5";
                            }
                        }	
				            }
				        },
				        {
				            name: '',
				            type: 'bar',
				            barWidth: 15,
				            data: extremeValueList,
				            itemStyle: {
				            		normal: {
                            color: function (params) {
		                            return "#C23531";
                            }
                        }	
				            }
				        }
				    ];
				}
			  
			  myChart.setOption(option);
		}
    
});