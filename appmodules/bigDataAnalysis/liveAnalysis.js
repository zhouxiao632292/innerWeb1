LiveAnalysis = L.Class.extend({
    initialize: function (options) {
        
        
    },
    show:function(){
				//显示模块对应的DIV
				
		},
		hide:function(){
				//隐藏模块对应的DIV
				
		},
		initUI:function(){
			this.selectDateHour = "";
				//初始化高度
			this.setHeight();
				//初始化模块界面UI
				this.createMapEchart();
				this.createCalendarEchart();
				this.createHistoryEchart();
				this.createClimateEchart();
				this.createSequenceEchart();
				
				this.show();
		},
	initDateHour:function(dateHourString){
		var year = dateHourString.substring(0,4);
		var month = dateHourString.substring(4,6);
		var day = dateHourString.substring(6,8);
		var hour = dateHourString.substring(8,10);
		var myDate=new Date();

		myDate.setFullYear(parseInt(year),parseInt(month)-1,parseInt(day));
	    $("#rainStartTimeInput").text(dateHourString.substring(0,8));
		//$("#hour").val(dateHourString.substring(8,10));
		$(".analogySelect span").text(dateHourString.substring(8,10));

		$("#rainStartTime").calendar({
			current: myDate,
			onSelect : function (date) {
				var year = date.getFullYear();
				var month = date.getMonth()+1;
				var day = date.getDate();
				var dateTime = year + (month<10?"0"+month:""+month) + (day<10?"0"+day:""+day);

				$("#rainStartTimeInput").html(dateTime);
				$(".ui-hover-panel").hide();

				//点击地图之后数据走向
				var dateHour = dateTime +$(".analogySelect span").text();
				liveAnalysis.updateLiveRankDate(dateHour,true);
			}
		});
		//var startTime = new Date(yesterday.getTime()-1000*60*60*24*9);
		//$("#rainStartTime").calendar('moveTo', startTime);
		//var year1 = startTime.getFullYear();
		//var month1 = startTime.getMonth();
		//var day1 = startTime.getDate();
		//$("#rainStartTimeInput").html(year1 + ((month1+1)<10?"0"+(month1+1):""+(month1+1)) + (day1<10?"0"+day1:""+day1));
		//点击出现日历
		$("#rainStartTimeInput").on("click", function () {
			$(this).parents(".nav1").css({height:357});
			//disastrousWeather.hideCalendar();
			$(this).siblings(".ui-hover-panel").show();
			$("#rainStartTime").show();
		});
		//日历的取消
		$(".ui-hover-panel").mouseout(function(){
			$(this).hide();
		})
		$(".ui-hover-panel").mouseover(function(){
			$(this).show();
		})

	},
	setHeight:function()
	{
		var bigDataShiKCenterHeight=$("body").height()-40;
		//console.log($("body").height())
		$(".bigDataShiKCenter").height(bigDataShiKCenterHeight);
		$(".bigDataShiKCenter").height(bigDataShiKCenterHeight);
		//console.log(bigDataShiKCenterHeight)
		//设置表格的高度
		var rainTable21Height = $(".bigDataRain").height()-76;
		var calendarChartHeight= $(".bigDataRain").height()-30;
		var bigMidMapHeight = $(".bigDataMid").height()*0.59+$(".bigDataMid").width()* 0.5*0.98*0.05+5;
		$(".rainTable21").height(rainTable21Height);
		$(".temperatureTable21").height(rainTable21Height);
		$(".windTable21").height(rainTable21Height);
		$("#calendarChart").height(calendarChartHeight);
		$("#historyChart").height(calendarChartHeight);
		$("#climateChart").height(calendarChartHeight);
		$("#sequenceChart").height(calendarChartHeight);
		$(".bigMidMap").height(bigMidMapHeight);
		var marginBottom=$(".bigDataMid").width()* 0.5*0.98*0.05-2;
		$(".bigMidMap").css({"marginBottom":marginBottom});
	},
	handler:function(){
		        var that = this;
				//处理操作逻辑
				this.createRanking();
				this.createProvinceList();

		//监听浏览器视图的大小变化
		$(window).resize(function(){
			location.reload();
			that.setHeight();
			//这里你可以尽情的写你的刷新代码！
		});
		},
		createRanking:function(){
				
				$("input[name='rainSelect']").change(function(){
			  		var type = $("input[name='rainSelect']:checked").val();
			  		liveAnalysis.getLiveRankData(type, true, true,false);
			  });
			  
			  $("input[name='temperatrueSelect']").change(function(){
			  		var type = $("input[name='temperatrueSelect']:checked").val();
			  		liveAnalysis.getLiveRankData(type, true, true,false);
			  });
			  
			  $("input[name='windSelect']").change(function(){
			  		var type = $("input[name='windSelect']:checked").val();
			  		liveAnalysis.getLiveRankData(type, true, true,false);
			  });

			//查询时间.width(50)
			$(".analogySelect").on("click",function(){
				if (!!window.ActiveXObject || "ActiveXObject" in window){
					$(".analogySelect div").width(45);
					$(".analogySelect div ul").css({'width':'45px','overflow':'none'});
					$(".analogySelect div ul li").width(26);
				}
				$(".analogySelect div").show();
			})
			$(".analogySelect ul li").live("click",function(event){
				var spanHtml = $(this).html();
				$(".analogySelect span").html(spanHtml);
				$(".analogySelect div").hide();
			}).mouseover(function(){
				$(".analogySelect div").show();
				$(this).addClass("liSelect");
			}).mouseout(function(){
				$(this).removeClass("liSelect");
			})
			$(".analogySelect div").mouseout(function(){
				$(this).hide();
			}).mouseover(function(){
								$(this).show()
							})
			$(document).click(function(e){
				//获取事件点击元素
				var targ = e.target;
				//获取元素名称
				var tname = targ.className;
				if(tname.indexOf("selectli0")==-1){
					$(".analogySelect div").hide();
				}


			})
			//改变小时的值切换图表
			$(".analogySelect ul li").live("click",function(){
				var dateHour = $("#rainStartTimeInput").text()+$(this).text();
				liveAnalysis.updateLiveRankDate(dateHour);
			})
			//$("#hour").change(function(){
			//	var dateHour = $("#rainStartTimeInput").text()+$(this).val();
			//	liveAnalysis.updateLiveRankDate(dateHour);
			//})
			  
			  //点击站点时出发的事件
				$("#rain tr").die().live("click",function(){
						$(this).siblings().css({background:"none"});
						$(this).css({background:"#39769E"});
						$("#temperature tr").css({background:"none"});
						$("#wind tr").css({background:"none"});
						
						var stationId = $(this).children("td:last").text();
						
						var echartMapData = liveAnalysis.echartMapData;
						var data = echartMapData.result.data;
						var type = $("input[name='rainSelect']:checked").val();
						if(type != echartMapData.type){
								var rainData = liveAnalysis.rainData;
								liveAnalysis.updateMapEchart(rainData, type);
								//data = rainData.data;
						}
						
						var convertData = function (data) {
						    var res = [];
						    for (var i = 0; i < data.length; i++) {
						        var aws = data[i];
						        if(aws.stName == undefined){
							  	  		continue;	
							  	  }
							  	  
							  	  if(aws.stationId == stationId){
							  	  		liveAnalysis.stationInfo = {name: aws.stName, value: [aws.longitude, aws.latitude, aws.province, aws.stName, aws.stationId, aws.value]};
							  	  		break;
							  	  }
							  	  
						    }
						    
						    return res;
						};
						
						convertData(data);
						liveAnalysis.updateStationChart(stationId);
						
				});
				
				$("#temperature tr").die().live("click",function(){
						$(this).siblings().css({background:"none"});
						$(this).css({background:"#39769E"});
						$("#rain tr").css({background:"none"});
						$("#wind tr").css({background:"none"});
						
						var stationId = $(this).children("td:last").text();
						var echartMapData = liveAnalysis.echartMapData;
						var data = echartMapData.result.data;
						var type = $("input[name='temperatrueSelect']:checked").val();
						if(type != echartMapData.type){
								var temperatureData = liveAnalysis.temperatureData;
								liveAnalysis.updateMapEchart(temperatureData, type);
								data = temperatureData.data;
						}
						
						var convertData = function (data) {
						    var res = [];
						    for (var i = 0; i < data.length; i++) {
						        var aws = data[i];
						        if(aws.stName == undefined){
							  	  		continue;	
							  	  }
							  	  
							  	  if(aws.stationId == stationId){
							  	  		liveAnalysis.stationInfo = {name: aws.stName, value: [aws.longitude, aws.latitude, aws.province, aws.stName, aws.stationId, aws.value]};
							  	  		break;
							  	  }
							  	  
						    }
						    
						    return res;
						};
						
						convertData(data);
						liveAnalysis.updateStationChart(stationId);
				});
				
				$("#wind tr").die().live("click",function(){
						$(this).siblings().css({background:"none"});
						$(this).css({background:"#39769E"});
						$("#rain tr").css({background:"none"});
						$("#temperature tr").css({background:"none"});
						
						var stationId = $(this).children("td:last").text();
						var echartMapData = liveAnalysis.echartMapData;
						var data = echartMapData.result.data;
						var type = $("input[name='windSelect']:checked").val();
						if(type != echartMapData.type){
								var windData = liveAnalysis.windData;
								liveAnalysis.updateMapEchart(windData, type);
								data = windData.data;
						}
						
						var convertData = function (data) {
						    var res = [];
						    for (var i = 0; i < data.length; i++) {
						        var aws = data[i];
						        if(aws.stName == undefined){
							  	  		continue;	
							  	  }
							  	  
							  	  if(aws.stationId == stationId){
							  	  		liveAnalysis.stationInfo = {name: aws.stName, value: [aws.longitude, aws.latitude, aws.province, aws.stName, aws.stationId, aws.value]};
							  	  		break;
							  	  }
							  	  
						    }
						    
						    return res;
						};
						
						convertData(data);
						liveAnalysis.updateStationChart(stationId);
				});
				
				//liveAnalysis.signalData = {};
			  
			  //获取24小时预警数据
			  $.ajax({
             cache:false,//禁用缓存
						 url: innerPath + "/WebHandler/MeteoHandler?method=xml",
					   dataType : 'xml',
					   data:{url:'http://10.0.64.216:8080/service/alert/alertsignal.do?method=xml&hour=24&stationregionalism=all'}
				}).then(function (xml) {
						 if(xml){
						 	  var cache = {};
						 		var alert = $.xml2json(xml);
 	   		    		var signal = alert.signal;
 	   		    		if(signal != null && signal.length > 0){
 	   		    				for(var i = 0,len=signal.length; i< len; i++){
 	   		    				 	  var sign = signal[i];
 	   		    				 		cache[sign.stationid] = sign;
 	   		    				}
 	   		    		}
 	   		    		liveAnalysis.signalData = cache;
 	   		    		
 	   		    		//降水排名默认显示1H
							 liveAnalysis.getLiveRankData("rain1", true, true,true);

							 //温度排名默认显示气温
							 liveAnalysis.getLiveRankData("temp", false, false,true);

							 //风排名默认显示风速风向
							 liveAnalysis.getLiveRankData("wind", false, false,true);

						}
				});
				
				//绑定输入即判断
				$("#search"). bind('input propertychange',function(){
						//var val=c(obj).value;
						var val=$(this).val();
						newStName=[];
						if(escape(val).indexOf("%u")>=0){
								//		包含文字  站名
								for(var i in Aws.national){
										if(Aws.national[i].stName!=undefined){
											if(Aws.national[i].stName.indexOf(val)>=0){
												var obj = Aws.national[i];
												newStName.push(obj);
											}
										}
								}
						}else{
								//		站号
								if(val.length>=5){
										for(var i in Aws.national){
											if(Aws.national[i].stationId==val){
												var obj = Aws.national[i];
												newStName.push(obj);
											}
										}
								}
						}
						if(newStName.length>0){
								//初始化级联下拉列表
								var html = "";
								for (var i = 0; i < newStName.length; i++) {
									html += "<span style=\"data-value=" + newStName[i].stationId + "\">" + newStName[i].stationId+" "+newStName[i].stName+ "</span>";
								}
								$(".bigDataText").html(html);
								$(".bigDataText").css({display:"block"});
						}else{
								$(".bigDataText").css({display:"none"});
						}
				});
				$("#search").trigger("input propertychange");
				
				//点击下拉列表  触发事件
				$(".bigDataText span").die().live("click",function(){
						$(".bigDataText span").css({background:"none"});
						$(this).css({background:"#39769E"})
						var val=$(this).text()
						$("#search").val(val);
						$(".bigDataText").css({display:"none"})
						//触发的事件
						var index=$(this).index();
						var valObj={}
						valObj.name=newStName[index].stName;
						valObj.value=[newStName[index].longitude,newStName[index].latitude,newStName[index].province,newStName[index].stName,newStName[index].stationId,null];
						
						liveAnalysis.stationInfo = valObj;
						var stationId = valObj.value[4];
						liveAnalysis.updateStationChart(stationId);
				});
						
			  
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
				    liveAnalysis.stationInfo = params.data;
				    
				    liveAnalysis.updateStationChart(stationId);
				    
				});
				
				//this.chartOption = option;
				this.echartMap = myChart;
				
		},
		createProvinceList:function(){
				$('.seriesProvinceBox li').click(function(){
					$('.seriesProvinceBox li').removeClass("provinceSelect")
					$(".province").removeClass("provinceSelectImg");
					$(this).addClass("provinceSelect").children("span").eq(0).addClass("provinceSelectImg");
					
					var province = $(this).children("span").eq(1).text();
			  	var myChart = liveAnalysis.echartMap;
					var option = myChart.getOption();
					var echartMapData = liveAnalysis.echartMapData;
					var data = echartMapData.result.data;
					var type = echartMapData.type;
					
					var convertData = function (data) {
						    var res = [];
						    for (var i = 0; i < data.length; i++) {
						        /*var geoCoord = geoCoordMap[data[i].name];
						        if (geoCoord) {
						            res.push({
						                name: data[i].name,
						                value: geoCoord.concat(data[i].value)
						            });
						        }*/
						        var aws = data[i];
						        if(aws.stName == undefined){
							  	  		continue;	
							  	  }
							  	  
							  	  if(aws.province == province){
							  	  		res.push({name: aws.stName, value: [aws.longitude, aws.latitude, aws.province, aws.stName, aws.stationId, aws.value]});
							  	  }else if(province == "全国"){
							  	  	  res.push({name: aws.stName, value: [aws.longitude, aws.latitude, aws.province, aws.stName, aws.stationId, aws.value]});
							  	  }
						        
						    }
						    
						    return res;
						};
						
						option.tooltip = {
						        trigger: 'item',
						        formatter: function (params) {
						        	  if(type == "rain1" || type == "rain6" || type == "rain12" 
								  	  		|| type == "rain24" || type == "rain48" || type == "rain72"){
									         return params.name + ' : ' + params.value[5] + "mm";
									      }else if(type == "temp"){
									      	 return params.name + ' : ' + params.value[5] + "℃";
									      }else if(type == "wind"){
									      	 return params.name + ' : ' + params.value[5] + "m/s";
									      }
									  }
						    };
						
						option.series = [
						        {
						            name: '',
						            type: 'scatter',
						            coordinateSystem: 'geo',
						            data: convertData(data),
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
						            data: convertData(data.sort(function (a, b) {
						                return b.value - a.value;
						            }).slice(0, 5)),
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
						    ];
						
						myChart.setOption(option);
			  		
			  });
		},
		createCalendarEchart:function(){
				var myChart = echarts.init(document.getElementById('calendarChart'));
				
				var data = [];
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
				    calendar: [{
				        top: 35,
				        left: 'center',
				        range: ['2017-05-01','2017-05-31'],
				        splitLine: {
				            show: true,
				            lineStyle: {
				                color: '#000',
				                width: 4,
				                type: 'solid'
				            }
				        },
				        /*yearLabel: {
				            //formatter: '{start}  1st',
				            formatter: '',
				            textStyle: {
				                color: '#fff'
				            }
				        },*/
				        itemStyle: {
				            normal: {
				                color: '#323c48',
				                borderWidth: 1,
				                borderColor: '#111'
				            }
				        }
				    }],
				    series : [
				        {
				            name: '',
				            type: 'scatter',
				            coordinateSystem: 'calendar',
				            data: data,
				            symbolSize: function (val) {
				                //return val[1] / 500;
				                return 5;
				            },
				            itemStyle: {
				                normal: {
				                    color: '#ddb926'
				                }
				            }
				        },
				        {
				            name: 'Top 12',
				            type: 'effectScatter',
				            coordinateSystem: 'calendar',
				            data: data.sort(function (a, b) {
				                return b[1] - a[1];
				            }).slice(0, 12),
				            symbolSize: function (val) {
				                //return val[1] / 500;
				                return 5;
				            },
				            showEffectOn: 'render',
				            rippleEffect: {
				                brushType: 'stroke'
				            },
				            hoverAnimation: true,
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

	if($("body").height()<780){
		option.calendar[0].cellSize=[20, 10];
	}
				myChart.setOption(option);
				this.echartCalendarChart = myChart;
				
				$("input[name='calendarSelect']").change(function(){
			  		var type = $("input[name='calendarSelect']:checked").val();
			  		
			  		var stationInfo = liveAnalysis.stationInfo;
			  		var len = stationInfo.value.length-2;
					  var stationId = stationInfo.value[len];
					  
			  		liveAnalysis.getCalendarEchartData(stationId, type);
			  });
			  
		},
		createHistoryEchart:function(){
				var myChart = echarts.init(document.getElementById('historyChart'));
				
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
				this.echartHistoryChart = myChart;
				
				$("input[name='historySelect']").change(function(){
			  		var type = $("input[name='historySelect']:checked").val();
			  		
			  		var stationInfo = liveAnalysis.stationInfo;
			  		var len = stationInfo.value.length-2;
					  var stationId = stationInfo.value[len];
					  
			  		liveAnalysis.getHistoryData(stationId, type);
			  });
			  
		},
		createClimateEchart:function(){
				var myChart = echarts.init(document.getElementById('climateChart'));
				
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
				        trigger: 'axis',
				        
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
				this.echartClimateChart = myChart;
				
				$("input[name='climateSelect']").change(function(){
			  		var type = $("input[name='climateSelect']:checked").val();
			  		
			  		var stationInfo = liveAnalysis.stationInfo;
			  		var len = stationInfo.value.length-2;
					  var stationId = stationInfo.value[len];
					  
			  		liveAnalysis.getClimateData(stationId, type);
			  });
			  
		},
		createSequenceEchart:function(){
				var myChart = echarts.init(document.getElementById('sequenceChart'));
				
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
				this.echartSequenceChart = myChart;
				
				$("input[name='sequenceSelect']").change(function(){
			  		var type = $("input[name='sequenceSelect']:checked").val();
			  		
			  		var stationInfo = liveAnalysis.stationInfo;
			  		var len = stationInfo.value.length-2;
					  var stationId = stationInfo.value[len];
					  
			  		liveAnalysis.getSequenceData(stationId, type);
			  });
		},
		getLiveRankData:function(type,isMapShow,isClickTable,isUpdateCaleder,isSelect,dateHour){
			  //设置Aws.default后，用到Aws.attachAwsInfs时就不必传第二个参数了
        Aws.default="national";
        //var url = "http://10.28.30.101:1024/live/national/"+type;
			var url = livePath + "/live/national/"+type;
			if(isSelect){
				if(type!="tmax"||type!="tmin"){
					url +="/" +dateHour;
				}
			}

        $.getJSON(url).then(function(json){
            Aws.attachAwsInfs(json.data);
            
            var result = json;
            var signalData = liveAnalysis.signalData;
			if(isUpdateCaleder){
				liveAnalysis.initDateHour(result.time.substring(0,10));
			}


			if(type == "rain1" || type == "rain6" || type == "rain12"
			  	  		|| type == "rain24" || type == "rain48" || type == "rain72"){
			  	  		var rainTable = "";
					  		$(".rainTable2").html("");
					  		var rain1Data = result.data;
							  var rain1Time = result.time;
							  liveAnalysis.rainData = result;
							  
							  var number = 1;
							  for(var i=0; i<rain1Data.length;i++){
							  	  var aws = rain1Data[i];
							  	  if(aws.stName == undefined){
							  	  		continue;	
							  	  }
							  	  
							  	  if(aws.value < 0.1){
							  	  		continue;	
							  	  }
							  	  
							  	  var signal = signalData[aws.stationId];
							  	  var signalMsg = "";
							  	  if(signal != null){
							  	  	  if(signal.level == "蓝色"){
							  	  	  		signalMsg = "<font color='#3CABE1'>" + signal.type + signal.level + "</font>";
							  	  	  }else if(signal.level == "黄色"){
							  	  	  		signalMsg = "<font color='yellow'>" + signal.type + signal.level + "</font>";
							  	  	  }else if(signal.level == "橙色"){
							  	  	  		signalMsg = "<font color='orange'>" + signal.type + signal.level + "</font>";
							  	  	  }else if(signal.level == "红色"){
							  	  	  		signalMsg = "<font color='red'>" + signal.type + signal.level + "</font>";
							  	  	  }
							  	  	  //signalMsg = signal.type + signal.level;
							  	  }
							  		rainTable += "<tr><td><font color='red' >"+number+"</font></td><td>"+aws.stName+"("+aws.province+")</td><td>"+aws.value+"mm</td><td>"+signalMsg+"</td><td>"+aws.stationId+"</td></tr>";
							  		number++;
							  }
							  $(".rainTable2").html(rainTable);
							  
							  var publishTime = rain1Time.substring(4,6) + "月" + rain1Time.substring(6,8) + "日" + rain1Time.substring(8,10) + "时";
				              $("#rainPublish").text(publishTime);
							  
							  //地图叠加显示
		            if(isMapShow){
		            		liveAnalysis.updateMapEchart(result,type);	
		            }
                
                if(isClickTable){
                	  $("#rain tr").eq(0).trigger("click");
                }
							  
			  	  }else if(type == "temp" || type == "tmax" || type == "tmin"){
			  	  		var temperatureTable = "";
					  		$(".temperatureTable2").html("");
					  		var temperatureData = result.data;
							  var temperatureTime = result.time;
							  liveAnalysis.temperatureData = result;
							  
							  var number = 1;
					  		for(var i=0; i<temperatureData.length;i++){
							  	  var aws = temperatureData[i];
							  	  if(aws.stName == undefined){
							  	  		continue;	
							  	  }
							  	  
							  	  var signal = signalData[aws.stationId];
							  	  var signalMsg = "";
							  	  if(signal != null){
							  	  	  if(signal.level == "蓝色"){
							  	  	  		signalMsg = "<font color='#3CABE1'>" + signal.type + signal.level + "</font>";
							  	  	  }else if(signal.level == "黄色"){
							  	  	  		signalMsg = "<font color='yellow'>" + signal.type + signal.level + "</font>";
							  	  	  }else if(signal.level == "橙色"){
							  	  	  		signalMsg = "<font color='orange'>" + signal.type + signal.level + "</font>";
							  	  	  }else if(signal.level == "红色"){
							  	  	  		signalMsg = "<font color='red'>" + signal.type + signal.level + "</font>";
							  	  	  }
							  	  	  //signalMsg = signal.type + signal.level;
							  	  }
							  		temperatureTable += "<tr><td><font color='red' >"+number+"</font></td><td>"+aws.stName+"("+aws.province+")</td><td>"+aws.value+"℃</td><td>"+signalMsg+"</td><td>"+aws.stationId+"</td></tr>";
							  		number++;
							  }
							  $(".temperatureTable2").html(temperatureTable);
							  
							  var publishTime = "";
							  if(type == "temp"){
							  		publishTime = temperatureTime.substring(4,6) + "月" + temperatureTime.substring(6,8) + "日" + temperatureTime.substring(8,10) + "时";
							  }else{
							  	  publishTime = temperatureTime.substring(4,6) + "月" + temperatureTime.substring(6,8) + "日";
							  }
							  $("#temperaturePublish").text(publishTime);	
			  	  		
			  	  		//地图叠加显示
		            if(isMapShow){
		            		liveAnalysis.updateMapEchart(result,type);	
		            }
		            
								if(isClickTable){
										$("#temperature tr").eq(0).trigger("click");
								}
								
			  	  }else if(type == "wind"){
			  	  	  var windTable = "";
					  		$(".windTable2").html("");
					  		var windData = result.data;
							  var windTime = result.time;
							  liveAnalysis.windData = result;
							  
							  var number = 1;
					  		for(var i=0; i<windData.length;i++){
							  	  var aws = windData[i];
							  	  if(aws.stName == undefined){
							  	  		continue;	
							  	  }
							  	  
							  	  if(aws.value < 0.1){
							  	  		continue;	
							  	  }
							  	  
							  	  var signal = signalData[aws.stationId];
							  	  var signalMsg = "";
							  	  if(signal != null){
							  	  	  if(signal.level == "蓝色"){
							  	  	  		signalMsg = "<font color='#3CABE1'>" + signal.type + signal.level + "</font>";
							  	  	  }else if(signal.level == "黄色"){
							  	  	  		signalMsg = "<font color='yellow'>" + signal.type + signal.level + "</font>";
							  	  	  }else if(signal.level == "橙色"){
							  	  	  		signalMsg = "<font color='orange'>" + signal.type + signal.level + "</font>";
							  	  	  }else if(signal.level == "红色"){
							  	  	  		signalMsg = "<font color='red'>" + signal.type + signal.level + "</font>";
							  	  	  }
							  	  	  //signalMsg = signal.type + signal.level;
							  	  }
							  		windTable += "<tr><td><font color='red' >"+number+"</font></td><td>"+aws.stName+"("+aws.province+")</td><td>"+aws.value+"m/s</td><td>"+signalMsg+"</td><td>"+aws.stationId+"</td></tr>";
							  		number++;
							  }
							  $(".windTable2").html(windTable);	
							  
							  var publishTime = windTime.substring(4,6) + "月" + windTime.substring(6,8) + "日" + windTime.substring(8,10) + "时";
							  $("#windPublish").text(publishTime);
							  
							  //地图叠加显示
		            if(isMapShow){
		            		liveAnalysis.updateMapEchart(result,type);	
		            }
		            
		            if(isClickTable){
										$("#wind tr").eq(0).trigger("click");
								}
																
			  	  }
            
        });
		},
		getCalendarEchartData:function(stationId, type){
			  var monthStr = "";
			  var dayStr = "";
			  var today = new Date();
			  var year = today.getFullYear();
 				var month = today.getMonth() + 1;
 				var day = today.getDate();
 				if(month < 10){
 						monthStr = "0" + month;
 				}else{
 					  monthStr = "" + month;
 				}
 				if(day < 10){
 						dayStr = "0" + day;
 				}else{
 					  dayStr = "" + day;
 				}
 				var endDate = year + monthStr + dayStr;
 				
 				function lastDate(year,month)        
				{        
					 var new_year = year;    //取当前的年份        
					 var new_month = month-1;//取下一个月的第一天，方便计算（最后一天不固定）        
					 if(new_month < 0)            //如果当前大于12月，则年份转到下一年        
					 {        
					  	new_month +=12;        //月份减        
					  	new_year--;            //年份增        
					 }        
					 return new Date(new_year,new_month,1);                //取当年上一个月中的第一天        
				}
 				var lastDate = lastDate(year, month-1, 1);
 				year = lastDate.getFullYear();
 				month = lastDate.getMonth() + 1;
 				day = lastDate.getDate();
 				if(month < 10){
 						monthStr = "0" + month;
 				}else{
 					  monthStr = "" + month;
 				}
 				if(day < 10){
 						dayStr = "0" + day;
 				}else{
 					  dayStr = "" + day;
 				}
 				var startDate = year + monthStr + dayStr;
			  
			  var url = livePath + "/history/series/"+stationId+"/"+type+"/"+startDate+"-"+endDate;
        $.getJSON(url).then(function(json){
        		/*if(type == "rain08"){
        				
        		}else if(type == "rain20"){
        				
        		}else if(type == "temp"){
        				
        		}*/
        		var data = json;
        		liveAnalysis.updateCalendarEchart(data, type, startDate, endDate);
      	});
		},
		getHistoryData:function(stationId, type){
			  var startDate = "";
			  var endDate = "";
			  var monthStr = "";
			  var dayStr = "";
			  var today = new Date();
			  var year = today.getFullYear();
 				var month = today.getMonth() + 1;
 				var day = today.getDate();
 				
 				if(month < 10){
 						monthStr = "0" + month;
 				}else{
 					  monthStr = "" + month;
 				}
 				
 				if(day < 11){
 						startDate = monthStr + "01";
 						endDate = monthStr + "10";
 				}else if(day > 10 && day < 21){
 					  startDate = monthStr + "11";
 						endDate = monthStr + "20";
 				}else{
 					  function getLastDay(year,month)        
						{        
							 var new_year = year;    //取当前的年份        
							 var new_month = month+1;//取下一个月的第一天，方便计算（最后一天不固定）        
							 if(new_month>12)            //如果当前大于12月，则年份转到下一年        
							 {        
							  	new_month -=12;        //月份减        
							  	new_year++;            //年份增        
							 }        
							 var newnew_date = new Date(new_year,new_month,1);                //取当年下一个月中的第一天        
							 return (new Date(newnew_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期        
						}
 						startDate = monthStr + "21";
 						var lastDay = getLastDay(year,month-1);
 						endDate = monthStr + lastDay;
 				}
			  var theYears = "1980-" + year;
				var url = livePath + "/history/stats/"+stationId+"/"+type+"/"+theYears+"/"+startDate+"-"+endDate;
				//var url = livePath + "/history/stats/"+stationId+"/"+type+"/"+startDate+"-"+endDate;
        $.getJSON(url).then(function(json){
        		/*if(type == "rain"){
        				
        		}else if(type == "tmax"){
        				
        		}else if(type == "tmin"){
        				
        		}*/
        		var data = json;
        		liveAnalysis.updateHistoryEchart(data, type, theYears, startDate, endDate);
      	});	
		},
		getClimateData:function(stationId, type){
			  var monthStr = "";
			  var dayStr = "";
			  var today = new Date();
			  var year = today.getFullYear();
 				var month = today.getMonth() + 1;
 				var day = today.getDate();
 				if(month < 10){
 						monthStr = "0" + month;
 				}else{
 					  monthStr = "" + month;
 				}
 				if(day < 10){
 						dayStr = "0" + day;
 				}else{
 					  dayStr = "" + day;
 				}
 				var endDate1 = monthStr + dayStr;
 				var endDate2 = year + monthStr + dayStr;
 				
 				function lastDate(year,month)        
				{        
					 var new_year = year;    //取当前的年份        
					 var new_month = month-1;//取下一个月的第一天，方便计算（最后一天不固定）        
					 if(new_month < 0)            //如果当前大于12月，则年份转到下一年        
					 {        
					  	new_month +=12;        //月份减        
					  	new_year--;            //年份增        
					 }        
					 return new Date(new_year,new_month,1);                //取当年上一个月中的第一天        
				}
 				var lastDate = lastDate(year, month-1, 1);
 				year = lastDate.getFullYear();
 				month = lastDate.getMonth() + 1;
 				day = lastDate.getDate();
 				if(month < 10){
 						monthStr = "0" + month;
 				}else{
 					  monthStr = "" + month;
 				}
 				if(day < 10){
 						dayStr = "0" + day;
 				}else{
 					  dayStr = "" + day;
 				}
 				var startDate1 = monthStr + dayStr;
 				var startDate2 = year + monthStr + dayStr;
 				
				var url1 = livePath + "/climate/series/"+stationId+"/"+type+"/"+startDate1+"-"+endDate1;
				var url2 = livePath + "/history/series/"+stationId+"/"+type+"/"+startDate2+"-"+endDate2;
        $.getJSON(url1).then(function(climateData){
        		$.getJSON(url2).then(function(calendarData){
        				liveAnalysis.updateClimateEchart(climateData, calendarData, type, startDate1, endDate1);
        		});
      	});	
		},
		getSequenceData:function(stationId, type){
			  var monthStr = "";
			  var dayStr = "";
			  var today = new Date();
			  var hour = today.getHours();
 				var stationInfo = liveAnalysis.stationInfo;
 				var lng = stationInfo.value[0];
 				var lat = stationInfo.value[1];
 				var publishDate = "";
 				if(hour >= 6 && hour< 20 ){
 					  var year = today.getFullYear();
		 				var month = today.getMonth() + 1;
		 				var day = today.getDate();
		 				if(month < 10){
		 						monthStr = "0" + month;
		 				}else{
		 					  monthStr = "" + month;
		 				}
		 				if(day < 10){
		 						dayStr = "0" + day;
		 				}else{
		 					  dayStr = "" + day;
		 				}
 						publishDate = year + monthStr + dayStr + "08";
 				}else if(hour >= 20 ){
 					  var year = today.getFullYear();
		 				var month = today.getMonth() + 1;
		 				var day = today.getDate();
		 				if(month < 10){
		 						monthStr = "0" + month;
		 				}else{
		 					  monthStr = "" + month;
		 				}
		 				if(day < 10){
		 						dayStr = "0" + day;
		 				}else{
		 					  dayStr = "" + day;
		 				}
 						publishDate = year + monthStr + dayStr + "20";
 				}else if(hour < 6 ){
 					  var yesterday = new Date(today.getTime()-1000*60*60*24);
 					  var year = yesterday.getFullYear();
		 				var month = yesterday.getMonth() + 1;
		 				var day = yesterday.getDate();
		 				if(month < 10){
		 						monthStr = "0" + month;
		 				}else{
		 					  monthStr = "" + month;
		 				}
		 				if(day < 10){
		 						dayStr = "0" + day;
		 				}else{
		 					  dayStr = "" + day;
		 				}
 						publishDate = year + monthStr + dayStr + "20";
 				}
		    var day = 10;
		    
				var url1 = "";
				var url2 = "";
				if(type == "rain1"){
						url1 = livePath + "/live/series/"+stationId+"/"+type+"/" + hour;
        		//3小时降水数据
        		url2 = innerPath + "/WebHandler/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/forecast/QPF_V2/gridrain03&format=grid03_{yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
				}else if(type == "temp"){
						url1 = livePath + "/live/series/"+stationId+"/"+type+"/" + hour;
						url2 = innerPath + "/WebHandler/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/ttt_05_1h&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
				}else if(type == "rh"){
						url1 = livePath + "/live/series/"+stationId+"/"+type+"/" + hour;
						url2 = innerPath + "/WebHandler/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/rrh_05_1h&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
				}else if(type == "wind"){
						url1 = livePath + "/live/series/"+stationId+"/"+type+"/" + hour;
						url2 = innerPath + "/WebHandler/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/wind_05_1h&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
				}
        $.getJSON(url1).then(function(liveData){
        		$.getJSON(url2).then(function(forecastData){
        				liveAnalysis.updateSequenceEchart(liveData, forecastData, type);
        		});
      	});	
		},
		updateMapEchart:function(result, type){
				var myChart = liveAnalysis.echartMap;
				var option = myChart.getOption();
				var data = result.data;
				var time = result.time;
				
				var province = $('.provinceSelect').children("span").eq(1).text();
				var convertData = function (data) {
				    var res = [];
				    for (var i = 0; i < data.length; i++) {
				        var aws = data[i];
				        if(aws.stName == undefined){
					  	  		continue;
					  	  }
					  	  
					  	  if(aws.province == province){
					  	  		res.push({name: aws.stName, value: [aws.longitude, aws.latitude, aws.province, aws.stName, aws.stationId, aws.value]});
					  	  }else if(province == "全国"){
					  	  	  res.push({name: aws.stName, value: [aws.longitude, aws.latitude, aws.province, aws.stName, aws.stationId, aws.value]});
					  	  }
				    }
				    
				    /*res.push({name: '海门', value: [121.15,31.89,9]});
				    res.push({name: '武汉', value: [114.31,30.52,20]});*/
				    
				    return res;
				};
				
				var title = ""
				var subTitle = "";
				if(type == "rain1"){
							title = "全国国家站1小时降水";
							subTitle = "实时发布: " + time.substring(4,6) + "月" + time.substring(6,8) + "日" + time.substring(8,10) + "时";
							
							option.visualMap = {
						        min: 0,
						        max: 50,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#BEE43D', '#EAA43E','#E97B48','#E15E5D','#D94272','#BE3066','#AF2E5A','#93174E','#721638','#541029']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain6"){
							title = "全国国家站逐6小时降水";
							subTitle = "实时发布: " + time.substring(4,6) + "月" + time.substring(6,8) + "日" + time.substring(8,10) + "时";
							
							option.visualMap = {
						        min: 0,
						        max: 50,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#BEE43D', '#EAA43E','#E97B48','#E15E5D','#D94272','#BE3066','#AF2E5A','#93174E','#721638','#541029']
						        },
						        textStyle: {
						            color: '#fff'
						        }
						    };
				}else if(type == "rain12"){
							title = "全国国家站逐12小时降水";
							subTitle = "实时发布: " + time.substring(4,6) + "月" + time.substring(6,8) + "日" + time.substring(8,10) + "时";
							
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
				}else if(type == "rain24"){
							title = "全国国家站逐24小时降水";
							subTitle = "实时发布: " + time.substring(4,6) + "月" + time.substring(6,8) + "日" + time.substring(8,10) + "时";
							
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
				}else if(type == "rain48"){
							title = "全国国家站逐48小时降水";
							subTitle = "实时发布: " + time.substring(4,6) + "月" + time.substring(6,8) + "日" + time.substring(8,10) + "时";
							
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
				}else if(type == "rain72"){
							title = "全国国家站逐72小时降水";
							subTitle = "实时发布: " + time.substring(4,6) + "月" + time.substring(6,8) + "日" + time.substring(8,10) + "时";
							
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
				}else if(type == "temp"){
							title = "全国国家站1小时温度";
							subTitle = "实时发布: " + time.substring(4,6) + "月" + time.substring(6,8) + "日" + time.substring(8,10) + "时";
							
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
				}else if(type == "tmax"){
							title = "全国国家站最高温度";
							subTitle = "实时发布: " + time.substring(4,6) + "月" + time.substring(6,8) + "日";
							
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
				}else if(type == "tmin"){
							title = "全国国家站最低温度";
							subTitle = "实时发布: " + time.substring(4,6) + "月" + time.substring(6,8) + "日";
							
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
				}else if(type == "wind"){
							title = "全国国家站1小时风速";
							subTitle = "实时发布: " + time.substring(4,6) + "月" + time.substring(6,8) + "日" + time.substring(8,10) + "时";
							
							option.visualMap = {
						        min: 0,
						        max: 24,
						        calculable: true,
						        inRange: {
						            color: ['#52478D', '#554EB1','#5057B8','#4369C4','#40A0B4','#4EC167','#68D14F','#9DDD44','#DCEA37','#EAA43E','#D94272','#93174E','#2B0001']
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
				        	  if(type == "rain1" || type == "rain6" || type == "rain12" 
						  	  		|| type == "rain24" || type == "rain48" || type == "rain72"){
							         return params.name + ' : ' + params.value[5] + "mm";
							      }else if(type == "temp" || type == "tmax" || type == "tmin"){
							      	 return params.name + ' : ' + params.value[5] + "℃";
							      }else if(type == "wind"){
							      	 return params.name + ' : ' + params.value[5] + "m/s";
							      }
							  }
				    };
				
				option.series = [
				        {
				            name: '',
				            type: 'scatter',
				            coordinateSystem: 'geo',
				            data: convertData(data),
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
				            data: convertData(data.sort(function (a, b) {
				                return b.value - a.value;
				            }).slice(0, 6)),
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
				    ];
				
				myChart.setOption(option);
				this.echartMapData = {"result":result, "type":type};
		},
		updateCalendarEchart:function(data, type, startDate, endDate){
			  var myChart = liveAnalysis.echartCalendarChart;
			  var option = myChart.getOption();
			  
			  startDate = startDate.substring(0,4) + "-" + startDate.substring(4,6) + "-" + startDate.substring(6,8);
			  endDate = endDate.substring(0,4) + "-" + endDate.substring(4,6) + "-" + endDate.substring(6,8);
			  function getVirtulData(data) {
				    //var start = +echarts.number.parseDate(startDate);
				    //var end = +echarts.number.parseDate(endDate);
				    //var dayTime = 3600 * 24 * 1000;
				    var res = [];
				    //for (var time = start; time < end; time += dayTime) {
				    for (var i = 0,len=data.length; i < len; i++) {
				    		var time = data[i].time;
				    		time = time.substring(0,4) + "-" + time.substring(4,6) + "-" + time.substring(6,8);
				    		var dateTime = +echarts.number.parseDate(time);
				        res.push([echarts.format.formatTime('yyyy-MM-dd', dateTime), data[i].value]);
				    }
				    return res;
				}
				
				var stationInfo = liveAnalysis.stationInfo;
				var title = "";
				if(type == "rain08"){
						title = "国家站08时降水日历图-" + "["+stationInfo.name+"]";
				}else if(type == "rain20"){
						title = "国家站20时降水日历图-" + "["+stationInfo.name+"]";
				}else if(type == "temp"){
						title = "国家站温度日历图-" + "["+stationInfo.name+"]";
				}
				option.title = {
				        top: 0,
				        text: title,
				        //subtext: '数据纯属虚构',
				        left: 'center',
				        textStyle: {
				        	  fontSize: 14,
            				fontWeight: 'bolder',
				            color: '#fff'
				        }
				    };
				    
				option.tooltip = {
				        trigger: 'item',
				        formatter: function (params) {
				        	  if(type == "rain08" || type == "rain20"){
							         return params.value[0] + ' : ' + params.value[1].toFixed(1) + "mm";
							      }else if(type == "temp"){
							      	 return params.value[0] + ' : ' + params.value[1].toFixed(1) + "℃";
							      }
							  }
				    };
				
			  option.calendar = [{
				        top: 42,
				        left: 'center',
				        range: [startDate, endDate],
				        splitLine: {
				            show: true,
				            lineStyle: {
				                color: '#000',
				                width: 4,
				                type: 'solid'
				            }
				        },
				        yearLabel: {
				            //formatter: '{start}  1st',
				            textStyle: {
				                color: '#fff'
				            }
				        },
				        monthLabel: {
				            //formatter: '{start}  1st',
				            textStyle: {
				                color: '#fff'
				            }
				        },
				        dayLabel:{
				            textStyle: {
				                color: '#fff'
				            }
				        },
				        itemStyle: {
				            normal: {
				                color: '#323c48',
				                borderWidth: 1,
				                borderColor: '#111'
				            }
				        }
				    }];
				    
				option.series = [
				        {
				            name: '',
				            type: 'scatter',
				            coordinateSystem: 'calendar',
				            data: getVirtulData(data),
				            symbolSize: function (val) {
				                //return val[1] / 500;
				                return 5;
				            },
				            itemStyle: {
				                normal: {
				                    color: '#ddb926'
				                }
				            }
				        },
				        {
				            name: 'Top 12',
				            type: 'effectScatter',
				            coordinateSystem: 'calendar',
				            data: getVirtulData(data).sort(function (a, b) {
				                return b[1] - a[1];
				            }).slice(0, 12),
				            symbolSize: function (val) {
				                //return val[1] / 500;
				                return 5;
				            },
				            showEffectOn: 'render',
				            rippleEffect: {
				                brushType: 'stroke'
				            },
				            hoverAnimation: true,
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
			  
			  myChart.setOption(option);
		},
		updateHistoryEchart:function(data, type, theYears, startDate, endDate){
				var myChart = liveAnalysis.echartHistoryChart;
			  var option = myChart.getOption();
			  
			  var categoryList = [];
			  var dataList = [];
			  for (var i = 0,len=data.length; i < len; i++) {
		    		categoryList.push(data[i].time);
		    		dataList.push(data[i].value);
		    }
				
				var stationInfo = liveAnalysis.stationInfo;
				var title = "";
				if(type == "rain"){
						title =  "历史同期降水("+startDate+"-"+endDate+")-" + "["+stationInfo.name+"]";
				}else if(type == "tmax"){
						title =  "历史同期最高温度("+startDate+"-"+endDate+")-" + "["+stationInfo.name+"]";
				}else if(type == "tmin"){
						title =  "历史同期最低温度("+startDate+"-"+endDate+")-" + "["+stationInfo.name+"]";
				}
				
				option.title = {
				        top: 0,
				        text: title,
				        //subtext: '数据纯属虚构',
				        left: 'center',
				        textStyle: {
				        		fontSize: 14,
            				fontWeight: 'bolder',
				            color: '#fff'
				        }
				    };
				    
				option.tooltip = {
				        trigger: 'item',
				        formatter: function (params) {
				        	  if(type == "tmax" || type == "tmin"){
							         return params.name + ' : ' + params.data.toFixed(1) + "℃";
							      }else if(type == "rain"){
							      	 return params.name + ' : ' + params.data.toFixed(1) + "mm";
							      }
							  }
				    };
				
				option.grid = {
                    x:30,
                    y:25,
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
				
				if(type == "rain"){
						option.series = [
				        {
				            name: '',
				            type: 'bar',
				            data: dataList,
				            itemStyle: {
				            		normal: {
                            color: function (params) {
		                            return "#0AC5F5";
                            }
                        }	
				            }
				        }
				    ];
				}else{
						option.series = [
				        {
				            name: '',
				            type: 'line',
				            data: dataList,
				            itemStyle: {
                        normal :{
				            			 lineStyle: {
				            			 		color: '#C23531',
				            			 		width: 3	
				            			 }	
				            		}		
				            }
				        }
				    ];	
				}       
				
			  
			  myChart.setOption(option);
		},
		updateClimateEchart:function(climateData, calendarData, type, startDate, endDate){
				var myChart = liveAnalysis.echartClimateChart;
			  var option = myChart.getOption();
			  
			  var categoryList = [];	
			  var dataList1 = [];
			  var dataList2 = [];
			  for (var i = 0,len=climateData.length; i < len; i++) {
		    		if(calendarData[i] != null && climateData[i].time == calendarData[i].time.substring(4)){
		    			  categoryList.push(climateData[i].time);
		    			  dataList2.push(climateData[i].value);
		    				dataList1.push(calendarData[i].value - climateData[i].value);
		    		}else{
			  				climateData.splice(i,1);
			  				i--;
			  				len--;	
			  		}
		    }
				
				var stationInfo = liveAnalysis.stationInfo;
				var title = "";
				if(type == "rain08"){
						title =  "国家站08时降水气候态及距平-" + "["+stationInfo.name+"]";
				}else if(type == "rain20"){
						title =  "国家站20时降水气候态及距平-" + "["+stationInfo.name+"]";
				}else if(type == "temp"){
						title =  "国家站温度气候态及距平-" + "["+stationInfo.name+"]";
				}
				
				option.title = {
				        top: 0,
				        text: title,
				        //subtext: '',
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
				        	  if(type == "rain08" || type == "rain20"){
				        	  	 var tip = "";
				        	  	 if(params.length == 1){
				        	  	 			tip = params[0].name 
							         				+ "</br>" + params[0].seriesName + ' : ' + params[0].value.toFixed(1) + "mm";
				        	  	 }else if(params.length == 2){
				        	  	 		  tip = params[0].name 
							         				+ "</br>" + params[0].seriesName + ' : ' + params[0].value.toFixed(1) + "mm" 
							         				+ "</br>" + params[1].seriesName + ' : ' + params[1].value.toFixed(1) + "mm";
				        	  	 }
				        	  	 
							         return tip;
							      }else if(type == "temp"){
							      	 var tip = "";
							      	 if(params.length == 1){
				        	  	 			tip = params[0].name 
							         				+ "</br>" + params[0].seriesName + ' : ' + params[0].value.toFixed(1) + "℃";
				        	  	 }else if(params.length == 2){
				        	  	 		  tip = params[0].name 
							         				+ "</br>" + params[0].seriesName + ' : ' + params[0].value.toFixed(1) + "℃" 
							         				+ "</br>" + params[1].seriesName + ' : ' + params[1].value.toFixed(1) + "℃";
				        	  	 }
							      	 return tip;
							      }
							  }
				    };
				    
				option.grid = {
                    x:30,
                    y:25,
                    x2:5,
                    y2:25,
                    borderWidth:1
                };
                
				option.xAxis = [
				        {
				            type: 'category',
				            data: categoryList,
				            axisLabel: { 
				            		show: true, 
				            		textStyle: { color: '#fff' } 
				            }
				        }
				    ];
				
				option.yAxis = [
				        {
				            type: 'value',
				            axisLabel: { 
				            		show: true, 
				            		textStyle: { color: '#fff' } 
				            }
				        }
				    ];
				       
				option.series = [
				        {
				            name: '距平',
				            type: 'bar',
				            data: dataList1,
				            itemStyle: {
				            		normal: {
                            color: function (params) {
                            		var colorList = ['#C23531', '#0AC5F5'];
		                            var index;
		                            if (params.value > 0) {
		                                index = 0;
		                            }else {
		                                index = 1;
		                            }
		                            return colorList[index];
                            }
                        }	
				            }
				            
				        },{
				            name: '气候态',
				            type: 'line',
				            smooth: true,
				            data: dataList2,
				            itemStyle: {
				            		normal :{
				            			 lineStyle: {
				            			 		color: '#6eaaee',
				            			 		width: 3	
				            			 }	
				            		}	
				            }
				        }
				    ];
			  
			  myChart.setOption(option);
		},
		updateSequenceEchart:function(liveData, forecastData, type){
				var myChart = liveAnalysis.echartSequenceChart;
			  var option = myChart.getOption();
			  
			  var categoryList = [];
			  var dataList = [];
			  var liveTime = "";
			  for (var i = 0,len=liveData.length; i < len; i++) {
			  	  var time = liveData[i].time;
			  	  liveTime = time.substring(0,4) + "-" + time.substring(4,6) + "-" + time.substring(6,8) + " " + time.substring(8,10) + ":" + time.substring(10,12);
		    		categoryList.push(liveTime);
		    		dataList.push(liveData[i].value);
		    }
		    
			  for (var i = 0,len=forecastData.category.length; i < len; i++) {
			  	  var forecastTime = forecastData.category[i];
			  	  //var forecastTime = time.substring(0,4) + time.substring(5,7) + time.substring(8,10) + time.substring(11,13) + time.substring(14,16) + "00";
			  	  if(forecastTime > liveTime){
			  	  		categoryList.push(forecastTime);
		    				dataList.push(forecastData.data[i]);
			  	  }
		    }
				
				var stationInfo = liveAnalysis.stationInfo;
				var title = "";
				if(type == "rain1"){
						title =  "国家站实况预报1小时降水-" + "["+stationInfo.name+"]";
				}else if(type == "temp"){
						title =  "国家站实况预报1小时温度-" + "["+stationInfo.name+"]";
				}else if(type == "rh"){
						title =  "国家站实况预报1小时相对湿度-" + "["+stationInfo.name+"]";
				}else if(type == "wind"){
						title =  "国家站实况预报1小时风速-" + "["+stationInfo.name+"]";
				}
				
				
			  option.title = {
				        top: 0,
				        text: title,
				        //subtext: '数据纯属虚构',
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
				        	  if(type == "rain1"){
							         return params[0].name + ' : ' + params[0].value.toFixed(1) + "mm";
							      }else if(type == "temp"){
							      	 return params[0].name + ' : ' + params[0].value.toFixed(1) + "℃";
							      }else if(type == "rh"){
							      	 return params[0].name + ' : ' + params[0].value.toFixed(1) + "%";
							      }else if(type == "wind"){
							      	 return params[0].name + ' : ' + params[0].value.toFixed(1) + "m/s";
							      }
							  }
				    };

	if($("body").height()<780){
		option.dataZoom = [
			{
				id: 'dataZoomX',
				type: 'slider',
				xAxisIndex: [0],
				filterMode: 'filter',
				start: 0,
				end: 30,
				//zoomLock: true,

				backgroundColor: 'rgba(0,0,0,0)',       // 背景颜色
				dataBackgroundColor: '#eee',            // 数据背景颜色
				fillerColor: 'rgba(144,197,237,0.2)',   // 填充颜色
				handleColor: 'rgba(70,130,180,0.8)',    // 手柄颜色
				textStyle:{color:"#fff"},
				top:'100',
				bottom: "0",
				left: "200",
				right: "200"
			}, {
				type: 'inside',
			}
		],
			option.grid = {
				x:30,
				y:25,
				x2:5,
				y2:42,
				borderWidth:1
			};

	}else{
		option.dataZoom = [
			{
				id: 'dataZoomX',
				type: 'slider',
				xAxisIndex: [0],
				filterMode: 'filter',
				start: 0,
				end: 30,
				//zoomLock: true,

				backgroundColor: 'rgba(0,0,0,0)',       // 背景颜色
				dataBackgroundColor: '#eee',            // 数据背景颜色
				fillerColor: 'rgba(144,197,237,0.2)',   // 填充颜色
				handleColor: 'rgba(70,130,180,0.8)',    // 手柄颜色
				textStyle:{color:"#fff"},
				bottom: "0",
				left: "200",
				right: "200"
			}, {
				type: 'inside',
			}
		],
			option.grid = {
				x:30,
				y:25,
				x2:5,
				y2:55,
				borderWidth:1
			};
	}

        

				option.xAxis = [
				        {
				            type: 'category',
				            data: categoryList,
				            axisLabel: { 
				            		show: true, 
				            		textStyle: { color: '#fff' },
				            		formatter: function (str) {
		                        var a = str.substring(5, 7) + "日/" + str.substring(8, 10);
		                        return a;
		                    } 
				            }
				        }
				    ];
				
				option.yAxis = [
				        {
				            type: 'value',
				            axisLabel: { 
				            		show: true, 
				            		textStyle: { color: '#fff' } 
				            }
				        }
				    ];
				
				if(type == "rain1"){
						option.series = [
				        {
				            name: '',
				            type: 'bar',
				            data: dataList,
				            itemStyle: {
		                    normal: {
		                        color: function (params) {
		                            var colorList = ['#0AC5F5', '#03AAFC', '#268FF5', '#0881F7'];
		                            var index;
		                            if (params.value > 1) {
		                                index = 3
		                            } else if (params.value <= 1 && params.value > 0.7) {
		                                index = 2
		                            } else if (params.value <= 0.7 && params.value > 0.3) {
		                                index = 1
		                            } else {
		                                index = 0
		                            }
		                            return colorList[index]
		                        }
		                    }
		                },
		                markLine:{
				                itemStyle : {
				                    normal: {
				                        /*borderWidth:1,*/
				                        lineStyle: {
				                            //type: 'solid',
				                            //shadowBlur: 1,
				                            color:'#FFFF00'
				                        },
				                        label:{
				                        		show:false,
				                        		position:'middle',
				                        		formatter: function (str) {
				                        			 return "实况预报分界线"
				                        		}
				                        }
				                    }
				                },
		                		data:[
										       {
						                    xAxis: liveTime
						               }
										   ]	
		               }
				        }
				    ];
				}else if(type == "temp"){
						option.series = [
								{
				            name: '',
				            type: 'line',
				            smooth: true,
				            data: dataList,
				            itemStyle: {
		                    normal: {
		                        color: "#C23531",
		                        lineStyle: {
		                            color: "#C23531"
		                        }
		                    },
		                    emphasis: {
		                        color: "#4ACC60"
		                    }
		
		                },
		                markLine:{
				                itemStyle : {
				                    normal: {
				                        borderWidth:1,
				                        lineStyle: {
				                            /*type: 'solid',
				                            shadowBlur: 1,*/
				                            color:'#FFFF00'
				                        },
				                        label:{
				                        		show:false,
				                        		position:'middle',
				                        		formatter: function (str) {
				                        			 return "实况预报分界线"
				                        		}
				                        }
				                    }
				                },
		                		data:[
										       {
						                    xAxis: liveTime
						               }
										   ]	
		               }
				        }
				    ];
				}else if(type == "rh"){
						option.series = [
								{
				            name: '',
				            type: 'line',
				            smooth: true,
				            data: dataList,
				            itemStyle: {
		                    normal: {
		                        color: "#4ACC60",
		                        lineStyle: {
		                            color: "#4ACC60"
		                        }
		                    },
		                    emphasis: {
		                        color: "#FF4500"
		                    }
		                },
		                markLine:{
				                itemStyle : {
				                    normal: {
				                        borderWidth:1,
				                        lineStyle: {
				                            /*type: 'solid',
				                            shadowBlur: 1,*/
				                            color:'#FFFF00'
				                        },
				                        label:{
				                        		show:false,
				                        		position:'middle',
				                        		formatter: function (str) {
				                        			 return "实况预报分界线"
				                        		}
				                        }
				                    }
				                },
		                		data:[
										       {
						                    xAxis: liveTime
						               }
										   ]	
		               }
						    }
				    ];
				}else if(type == "wind"){
						option.series = [
								{
				            name: '',
				            type: 'line',
				            smooth: true,
				            data: dataList,
				            itemStyle: {
		                    normal: {
		                        color: "#FF8C00",
		                        lineStyle: {
		                            color: "#FF8C00"
		                        }
		                    },
		                    emphasis: {
		                        color: "#4ACC60"
		                    }
		                },
		                markLine:{
				                itemStyle : {
				                    normal: {
				                        borderWidth:1,
				                        lineStyle: {
				                            /*type: 'solid',
				                            shadowBlur: 1,*/
				                            color:'#FFFF00'
				                        },
				                        label:{
				                        		show:false,
				                        		position:'middle',
				                        		formatter: function (str) {
				                        			 return "实况预报分界线"
				                        		}
				                        }
				                    }
				                },
		                		data:[
										       {
						                    xAxis: liveTime
						               }
										   ]	
		               }
				        }
				    ];
				}
			  
			  myChart.setOption(option);
			  
		},
		updateStationChart:function(stationId){
				//获取日历图数据
				var type1 = $("input[name='calendarSelect']:checked").val();
		    liveAnalysis.getCalendarEchartData(stationId, type1);
		    //获取历史同期数据
		    var type2 = $("input[name='historySelect']:checked").val();
		    liveAnalysis.getHistoryData(stationId, type2);
		    //获取气候距平数据
		    var type3 = $("input[name='climateSelect']:checked").val();
		    liveAnalysis.getClimateData(stationId, type3);
		    //获取时序图数据
		    var type4 = $("input[name='sequenceSelect']:checked").val();
		    liveAnalysis.getSequenceData(stationId, type4);
		    
		},
	updateLiveRankDate:function(dateHour,isTure){
		//点击选择日历后数据走势  isTrue  判断点击日期 温度 是否执行

		var typeRainSelect = $("input[name='rainSelect']:checked").val();
		liveAnalysis.getLiveRankData(typeRainSelect, true, true,true,true,dateHour);

		var typeTemperatrueSelect = $("input[name='temperatrueSelect']:checked").val();
		if(typeTemperatrueSelect=="temp"){
			liveAnalysis.getLiveRankData(typeTemperatrueSelect, false, false,true,true,dateHour);

		}else{
			if(isTure){
				//切换日期  最高温 最低温  更新
				liveAnalysis.getLiveRankData(typeTemperatrueSelect, false, false,false,true,dateHour);
}
		}


		var typewindSelect = $("input[name='windSelect']:checked").val();
		liveAnalysis.getLiveRankData(typewindSelect, false, false,true,true,dateHour);
	}
		
		
    
});