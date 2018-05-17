IntelligentGridPrediction = L.Class.extend({
	initialize: function (options) {


	},
	show:function(){
		//显示模块对应的DIV
		$(".apiBox .close").on("click",function(){
			$(".apiBox").hide();
			map.removeLayer(reRectangle);
		});
		if (reRectangle != null) {
			$(".apiBox .close").trigger("click");
		}
		if(isMobile()){
			$("#hoverPic").animate({height: 332}, 500);
			$(".footer").animate({bottom: 0}, 500, function () {
			});
		}else{
			$(".zhankai").animate({height: 336}, 500, function () {
			});
			$(".footer").animate({bottom: 336}, 500, function () {
			});
		}
		
		$(".picValueClick").css({display:"none"})
		$(".chartsClose").css({display:"block"});
		this.showFlag=true;
	},
	hide:function(){
		//隐藏模块对应的DIV
		if(isMobile()){
			$("#hoverPic").animate({height: 0}, 500);
			//$("#web").animate({bottom: 40}, 500, function () {
            //
			//});
		}else{
			$(".zhankai").animate({height: 0}, 500, function () {
				//$(".quX1").addClass("flodSx").removeClass("quX1");
			});
			$(".footer").animate({bottom: 0}, 500, function () {

			});
		}


		this.showFlag=false;
		$(".picValueClick").css({display:"block"});
		$(".chartsClose").css({display:"none"})
	},
	initUI:function(){
		$("#initSearch").hide();
		//初始化模块界面UI
		if(latCan!=""&&lngCan!==""){
		//表示有参数
			shiXvFlag=false;
			//if($(".zhankai").height()>0){
			//
			//}
			//$(".zhankai").animate({height: 0}, 500, function () {
			//	$(".flodSx").addClass("quX1").removeClass("flodSx");
			//});
			$(".footer").animate({bottom: 0}, 500, function () {

			});

		 }else{
			if(currentLatLng!=null){
				shiXvFlag=true;
			}else{
				$(".zhankai").animate({height: 0}, 500, function () {
					//$(".flodSx").addClass("quX1").removeClass("flodSx");
				});
				$(".footer").animate({bottom: 0}, 500, function () {

				});
			}
      }
		if(geojsonLayer!=null){
			map.removeLayer(geojsonLayer);
		}

		//如果截图选框存在  使之消失
		//关闭截图界面
		$(".apiBox .close").on("click",function(){
			$(".apiBox").hide();
			map.removeLayer(reRectangle);
		});
		if (reRectangle != null) {
			$(".apiBox .close").trigger("click");
		}

// 加载时序图
//		this.showFlag=true;  //表示时序图是否展开 true:展开   false:收缩
		this.tuClick=true;//表示当前展示的是图还是表  TRUE：图   false:表
		this.inputVal="";  //表示与地理坐标匹配后  写入到  搜索框中
		this.option = {
			background:'#2B3439',
			dataZoom: [
				{
					id: 'dataZoomX',
					type: 'slider',
					xAxisIndex: [0],
					filterMode: 'filter',
					start: 0,
					end: 100,
					//zoomLock: true,

					backgroundColor: 'rgba(0,0,0,0)',       // 背景颜色
					dataBackgroundColor: '#eee',            // 数据背景颜色
					fillerColor: 'rgba(144,197,237,0.2)',   // 填充颜色
					handleColor: 'rgba(70,130,180,0.8)',    // 手柄颜色
					bottom: "10",
					left: "180",
					right: "300"
				}, {
					type: 'inside',
				}
			],
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					animation: true
				}, position: function (pos, params, dom, rect, size) {
					// 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
					if (pos[0] > 252) {
						var top = pos[0] - 120
					} else {
						var top = pos[0] + 10
					}

					return [top, pos[1] - 20];
				}

			},
			grid: [
				{top: "17%", width: '80%', height: '60%'}
				/*{top:"58%", width: '83%', height: '25%'}*/
			],
			toolbox: {
				feature: {
					//dataView: {show: true, readOnly: false},
					//restore: {show: true},
					saveAsImage: {show: true}
				}
			},
			legend: {
				x: 'top',
				data: ['降水', '温度', '风速', '相对湿度', '云量'],
				selected: {
					'相对湿度': false,
					'云量': false
				},
				backgroundColor: '#eee',
				//borderColor: 'rgba(178,34,34,0.8)',
				borderWidth: 1,
				padding: 5,    // [5, 10, 15, 20]
				itemGap: 5,
				//textStyle: {color: 'red'},
				left:'center',
				top:'0'
			},
			xAxis: [
				{
					gridIndex: 0,
					type: 'category',
					boundaryGap: true,
					//axisLine: {onZero: true},
					data: [],
					axisLabel: {
						/*interval:0,
						 formatter:function(str){
						 var a = str.substring(5);
						 return a;
						 }*/
						//interval:3,
						formatter: function (str) {
							var a = str.substring(10, 13);
							a = str.substring(8, 10) + "日/" + str.substring(11, 13);
							return a;
						}
					}
				}
				/*,
				 { gridIndex: 1,
				 type : 'category',
				 boundaryGap : true,
				 //axisLine: {onZero: true},
				 data: [],
				 //position: 'top',
				 axisLabel:{
				 //interval:3,
				 formatter:function(str){
				 var a = str.substring(10,13);
				 a=str.substring(8,10)+"日/"+str.substring(11,13);
				 return a;
				 }
				 }
				 }*/
			],
			yAxis: [
				{
					gridIndex: 0,
					type: 'value',
					name: '降水(mm)',
					offset: 0
				},
				{
					gridIndex: 0,
					type: 'value',
					//name : '温度(°C)',
					position: 'left',
					offset: 32,
					splitLine: {show: false},
					axisLabel: {
						formatter: '{value}°C'
					}
				},
				{
					gridIndex: 0,
					type: 'value',
					name: '风速(m/s)',
					offset: 0,
					position: 'right',
					splitLine: {show: false}

				},
				{
					gridIndex: 0,
					type: 'value',
					//name : '百分比(%)',
					position: 'right',
					offset: 32,
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
					offset: 32
				}
			],
			series: [
				{
					name: '降水',
					type: 'bar',
					barWidth: '5',
					xAxisIndex: 0,
					yAxisIndex: 0,
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
					data: []
				},
				{
					name: '温度',
					type: 'line',
					symbolSize: 8,
					smooth: true,
					hoverAnimation: false,
					xAxisIndex: 0,
					yAxisIndex: 1,
					data: [],
					symbol: 'circle',
					itemStyle: {
						normal: {
							//color:function(params){
							//	var colorList = ['#F1CB38', '#f43c55'];
							//	var index;
							//	if(params.value<=90){
							//		index=1
							//	}else{
							//		index=0
							//	}
							//	return colorList[index]
							//},
							color: "#FF0000",
							lineStyle: {
								color: "#FF0000"
							}
						},
						emphasis: {
							color: "#4ACC60"
						}

					}
				},
				{
					name: '风速',
					type: 'line',
					symbolSize: 8,
					smooth: true,
					hoverAnimation: false,
					xAxisIndex: 0,
					yAxisIndex: 2,
					data: [],
					symbol: 'circle',
					itemStyle: {
						normal: {
							//color:function(params){
							//	var colorList = ['#F1CB38', '#f43c55'];
							//	var index;
							//	if(params.value<=90){
							//		index=1
							//	}else{
							//		index=0
							//	}
							//	return colorList[index]
							//},
							color: "#FF8C00",
							lineStyle: {
								color: "#FF8C00"
							}
						},
						emphasis: {
							color: "#4ACC60"
						}
					}
				},
				{
					name: '相对湿度',
					type: 'line',
					symbolSize: 8,
					smooth: true,
					hoverAnimation: false,
					xAxisIndex: 0,
					yAxisIndex: 3,
					data: [],
					symbol: 'circle',
					itemStyle: {
						normal: {
							//color:function(params){
							//	var colorList = ['#F1CB38', '#f43c55'];
							//	var index;
							//	if(params.value<=90){
							//		index=1
							//	}else{
							//		index=0
							//	}
							//	return colorList[index]
							//},
							color: "#4ACC60",
							lineStyle: {
								color: "#4ACC60"
							}
						},
						emphasis: {
							color: "#FF4500"
						}
					}
				},
				{
					name: '云量',
					type: 'line',
					symbolSize: 8,
					smooth: true,
					hoverAnimation: false,
					xAxisIndex: 0,
					yAxisIndex: 3,
					data: [],
					symbol: 'circle',
					itemStyle: {
						normal: {
							color: "#A9A9A9",
							lineStyle: {
								color: "#A9A9A9"
							}
						},
						emphasis: {
							color: "#4ACC60"
						}
					}
				}
			]
		};
		this.chart = "";
		this.chart += "<div class=\"chartsClose\" style=\"z-index:2000;\"><div></div></div><div class=\"detail\"><span class=\"button\" id=\"export\" style=\"position:absolute;right:40px;top:300px;z-index: 2000;cursor: pointer\">导出Excel</span><span class=\"button\" id=\"changeTable\" style=\"position:absolute;right:70px;top:0;z-index: 1000;cursor: pointer\">时序图</span><span class=\"button\" id=\"changeTable1\" style=\"position:absolute;right:0px;top:0px;z-index: 1000;cursor: pointer\">表格</span><span class=\"iconfont icon-yu\" style=\"float:left;margin-left: 40px;margin-right:3px;margin-top:5px;line-height: 20px\"></span><span id=\"echartName1\" class=\"box\" style=\"color:#fff;float:left;\">智能网格预报</span><span class=\"box\"style=\"margin-left: 15px;float:left;\">临近站：<span id=\"stNum\"></span></span><div class=\"span-box\" style=\"height:25px;width:45%;margin: 0 auto;\"><span class=\"box\"style=\"\">省：<span id=\"province\"></span></span><span class=\"box\">市：<span id=\"city\"></span></span><span class=\"box\" style=\"padding-right:0px;\">区：<span id=\"area\"></span></span></div><span class=\"box\" style=\"padding-right: 15px;float: right;color:#fff;position: absolute;top:0;right:135px;\">发布时间：<span id=\"publishDate1\"></span></span>"
		this.chart += '<div class=\"det\" style=\"position:relative;padding-top:5px\"><table id="rainTable" class="table2" border="0" cellspacing="0" cellpadding="0"">\
		<tr style=\"display:none\">\
		<td style="background-color: rgb(41,50,55)">\
		<div>\
		</div>\
		</td>\
		</tr>\
		<tr class="tr2">\
		<td id="echarts1"  valign="top">\
		    <div id="echartss" style="height:305px;"></div></div>\
		</td>\
		<td id="echarts11"  valign="top">\
		    <div id="echartss11" style="width:100%;height:304px;">\
		      <div><table class="shixvTable" border="0" cellspacing="0" cellpadding="0"></table></div>\
		      <div><div style="margin:0;padding:0;width:604px;height:245px;    overflow-x: scroll;overflow-y: hidden;"><table class="shixvTable1" border="0" cellspacing="0" cellpadding="0"></table></div></div>\
		    </div></div>\
		</td>\
		</tr>\
		</table>\
        </div></div>';
		$(".chart").html(this.chart);
		if(shiXvFlag){
			this.show();
		}
		this.myChart1 = echarts.init(document.getElementById('echartss'));
		var width=$(".det").width();
		var detWidth=width-92;
		//$(".det #echartss11 div").eq(1).css({"width":detWidth+"px"});
		$(".det #echartss11 div").eq(1).find("div").css({"width":detWidth-1+"px"});
		this.selected1=false;
		this.selected2=false;
		this.showFlag=false;
		this.getTempColor();
		this.circleMarkerGroup=[];
		this.colorArr=[];
		this.stationId=[];
	},
	handler:function(){
		//处理操作逻辑
		$("#search").blur();
			//时序图的显示 与取消
			var that=this;

		$(".chartsClose").live("click",function(){
				that.hide();
		})
			//导出时序图
			$("#export").on("click", function () {
				var publishDate = $("#publishDate1").html();
				publishDate = publishDate.replace(/-/g, "").slice(0, 11).replace(/ /g, "");
				window.location.href = handlerPath + "/MeteoHandler?method=exportgridexcel&publishDate=" + publishDate + "&relativePathList=/forecast/QPF_V2/gridrain03,/fsol/ttt_05_1h,/fsol/wind_05_1h,/fsol/rrh_05_1h,/fsol/cloud_05_1h&lat=" + lat1 + "&lng=" + lng1 + "&day=10";
				//console.log(window.location.href)
			});

			//时序图与表格数据的切换
			$("#changeTable").on("click", function () {
				//表示当前展开的是表
				$("#changeTable1").removeClass("button1");
				$(this).addClass("button1");
				$("#echarts1").css({"display": "block", "height": "390px"});
				$("#echarts11").css({"display": "none"});
			});

			$("#changeTable1").on("click", function () {
					//表示当前展开的是  图
				$("#changeTable").removeClass("button1");
				$(this).addClass("button1");
					var width = $(".det").width();
					var detHeight = $(".det").height();
					//console.log(width)
					$("#echarts1").css({"display": "none"});
					$("#echarts11").css({"display": "block"});
					var len = $(".shixvTable").find("tr").length;
				if(len==0){
					len=7;
				}
					var height = len * 30 + len + 1 + 18+7;
				$(".shixvTable1").parent().css({"height": height});
					if (!!window.ActiveXObject || "ActiveXObject" in window||(navigator.userAgent.indexOf("Firefox") > -1)){
						//火狐IE浏览器的时候  使它的高度增加  避免滚动条挡住数据
						$(".shixvTable1").parent().css({"height": height+8});
				}

			});

		$("#changeTable1").trigger("click");
		//始终保持选项为上一个的选择
		   that.myChart1.on('legendselectchanged', function (params) {
			var isSelected = params.selected[params.name];

			if(params.name=="相对湿度"){

				that.selected1=isSelected;
			}
			if (params.name=="云量"){
				that.selected2=isSelected;
			}
			if(that.selected1==true && that.selected2==true){
				that.option.legend.selected={}
			}else if(that.selected1==false && that.selected2==true){
				that.option.legend.selected={
					"相对湿度":false
				}
			}else if(that.selected1==true && that.selected2==false){
				that.option.legend.selected={
					"云量":false
				}
			}

		})
		$(".picValueClick").die().live("mouseover",function(){
			pickFlag=false;
			mapElementSelected=false;
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
						//$("#changeTable1").trigger("click");
						that.showEchart(currentLatLng);
						that.myChart1.setOption(that.option);
					}
					that.show();
				}
			})
		})
		$(".picValueClick").live("mouseout",function(){
			pickFlag=true;
			closeFlag=true;
			mapElementSelected=true;
		})
		//$(".picValueClick").live("mouseout",function(){
		//
		//})

		$(".pickValueClose").die().live("mouseover",function(){
			closeFlag=false;
			mapElementSelected=false;
			$(".pickValueClose").live("click",function(e){
				mouseFlag=true;
				//
				$(".chartsClose").css({display:"block"});
				$("#pickValueMarker").css({display:"none"});
				currentLatLng=null;
			})
		})

		$(".pickValueClose").live("mouseout",function(){
			closeFlag=true;
			mapElementSelected=true;
		})

			//点击地图
			map.on('mapclicked', function (e) {
				var htmlWidth = isMobile();
				var dis=0;

				if(pickFlag&&mapClickFlag&&closeFlag){
					//判断是否为手机
					if (htmlWidth) {
						$("#changeTable").css({display:"block",'top':"23px"});
						$("#changeTable1").css({display:"block","top":"23px"});
						$("#publishDate1").parents(".box").css({position:"absolute",top:0,right:0})
						$("#echartName1").next("div").css({width:"100%",height:"auto",float:"left"});
						$("#echartName1").next("div").children(".box").eq(0).css({marginLeft:0});
						$(".span-box").height(45).width('100%');
						$("#echartName1").hide();
						$("#stNum").parents(".box").hide();
						$("#publishDate1").parents(".box").css({"top":'25px',"left":"10px"})
						$("#echartss").css({"height":265});
						$("#export").css({top:"294px",right:2});
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
					var latlng = e.latlng;
					//$("#changeTable1").trigger("click");
					that.showEchart(latlng)

					that.myChart1.setOption(that.option);

				}

			});
			//当地图有打的点时  再点击初始按钮  显示的地点是当前的打点
			if(currentLatLng!=null){
				//$("#changeTable1").trigger("click");
					that.showEchart(currentLatLng)
					//$(".change").css("display", "none");
					that.myChart1.setOption(that.option);


			}
		$(".api").on("click",function(){

				that.hide();

		});
//点击站点的   叠加站点格点数据
		$(".stationEle").die().live("click",function(){
			$(".stationEle").removeClass("stationEleSelect");
			$(this).addClass("stationEleSelect");
			//显示数据
			var type=$(this).attr("type");
			that.showSlider(type);
			when.all(that.getColorArr(type)).then(function(){
				that.getStationData(type)
			})


		})
		//if(toolClick=='intelligentGridPrediction'){
		//	$(".stationEle").eq(1).trigger("click");
		//}

		//改变浏览器窗口  重新加载
		window.onresize = function(){
			var width=$(".det").width();
			var detWidth=width-92;
			$(".det #echartss11 div").eq(1).css({"width":detWidth+"px"});
			$(".det #echartss11 div").eq(1).find("div").css({"width":detWidth-1+"px"});
		}

	},
	showSlider:function(type){
		var that=this;
		var valSlider=0;
		var minSlider=0;
		var maxSlider=0;
		if(type=="rain6"){
			$(".val").show();
			$(".val1").show();
			minSlider=0;
			maxSlider=50;
			valSlider=0;
			$(".val span").eq(0).html("降水阈值>=");
			$(".val span").eq(1).html(valSlider);
			$(".val span").eq(2).html("mm");
			$(".val1 span").eq(0).html("最小值："+minSlider);
			$(".val1 span").eq(1).html("最大值："+maxSlider);
		}else if(type=="temp"){
			$(".val").show();
			$(".val1").show();
			minSlider=-40;
			maxSlider=45;
			valSlider=10;
			$(".val span").eq(0).html("温度阈值>=");
			$(".val span").eq(1).html(valSlider);
			$(".val span").eq(2).html("°C");
			$(".val1 span").eq(0).html("最小值："+minSlider);
			$(".val1 span").eq(1).html("最大值："+maxSlider);
		}else{
			$(".val").hide();
			$(".val1").hide();
		}
		if(type=="temp"||type=="rain6"){
			if(type=="temp"){
				$( "#slider-range-min").html("").show();
				$( "#slider-range-max").html("").hide();
				$( "#slider-range-min" ).slider({
					range: "min",
					value:valSlider,
					min: minSlider,
					max: maxSlider,
					slide: function( event, ui ) {
						$( ".val span" ).eq(1).html(ui.value );
					},
					change:function(event, ui ){
                       if(event.handleObj!=undefined){
						   var type=$(".stationEleSelect").attr("type");
						   when.all(that.getColorArr(type)).then(function(){
							   that.getStationData(type);
						   })
					   }


					}

				});
			}else{
				$( "#slider-range-max").html("").show();
				$( "#slider-range-min").html("").hide();
				$( "#slider-range-max" ).slider({
					range: "min",
					value:valSlider,
					min: minSlider,
					max: maxSlider,
					slide: function( event, ui ) {
						$( ".val span" ).eq(1).html(ui.value );
					},
					change:function(event, ui ){
						if(event.handleObj!=undefined){
							var type=$(".stationEleSelect").attr("type");
							when.all(that.getColorArr(type)).then(function(){
								that.getStationData(type);
							})
						}
					}

				});
			}
		}else{
			$( "#slider-range-min").html("").hide();
			$( "#slider-range-max").html("").hide();
		}
	},
	creatStationData:function(result,threshold,result1){
		var infoData="";

		for(var i=0;i<result.length;i++){
			var info=result[i];
			if(parseFloat(threshold)<parseFloat(info.value)){
				if(info.latitude!=null||info.latitude!=undefined){
					infoData+=info.longitude+" "+info.latitude+" "+info.value+" "+info.city+" "+info.height+" "+info.province+" "+info.stName+" "+info.stationId+" "+info.latitude+" "+info.longitude+";";
				}
			}

		}
		result1.data.feature.data=infoData.slice(0,infoData.length-1);
		return  result1;
	},
	getStationData:function(type,arr){
		var that=this;
		//var stationUrl="http://10.10.31.24:1024/live/national/"+type;
		var stationUrl="http://10.1.64.146/awsdsi/live/national/"+type;


		var stationUnit='';   //表示单位  mm或者°C
		var stationName='';  //表示温度 或者 降水
		var threshold=0;     //过滤的阈值
		var styleFile="";
		if(type=="temp"){
			stationUnit='°C';
			stationName='温度';
			threshold=parseFloat($(".val span").eq(1).html());
			styleFile="macros/temp";
		}else if(type=='rain6'){
			stationUnit='mm';
			stationName='降水';
			threshold=parseFloat($(".val span").eq(1).html());
			styleFile="macros/rain6";
		}
		$(".leaflet-pane .leaflet-popup-pane").html("");
		if(type=="temp"||type=="rain6"){
			//温度   canvas实现
			$.getJSON(stationUrl).then(function(json) {
				Aws.attachAwsInfs(json.data);
				//Aws.toGeoJSON(json);
				var result = json.data;
				var time = json.time;
				for(var i=0; i<that.circleMarkerGroup.length;i++){
					var circleMarker = that.circleMarkerGroup[i];
					map.removeLayer(circleMarker);
				}
				that.circleMarkerGroup = [];
				if(heatmapLayer!=null){
					heatmapLayer.onRemove(map);
					heatmapLayer=null;
				}
				that.stationId=[];
				//setInterval("shuaxin()",1000);
				//$.ajaxSetup({
				//	cache:false
				//})
				//tempDataUrl1.json
				$.get('../../styles/populationDataUrl1.json',function(result1){

					//console.log(1);
					when.all(that.creatStationData(result,threshold,result1)).then(function(){
						if(result1.data.feature.data!=""){
							//console.log(result1)
							if(meteoNGLayer!=null){
								//更新图层
								meteoNGLayer.updateLayeConfig({"layerConfig":{"layerGroup":[
									{"data":result1,"styleKey":"point","visible":true,"layerType":"vector","interactive":true}],"styleFile":styleFile}});
							}else{
								meteoNGLayer = new shell.meteoNGLayer({"layerConfig":{"layerGroup":[
									{"data":result1,"styleKey":"point","visible":true,"layerType":"vector","interactive":true}],"styleFile":styleFile}});
								map.addLayer(meteoNGLayer);
							}
						}else{
							if(meteoNGLayer!=null){
								meteoNGLayer.eachLayer(function (layer) {
									map.removeLayer(layer);
								});
								meteoNGLayer=null;
							}
						}

					})

					//点击canvas的点出现提示信息框
				map.on('elementSelected',function(e){//
					console.log(mapElementSelected)
					if(e.eventType=='click'&&mapElementSelected){
						var info= e.properties;
						var html="时间: "+time.substring(4,6) + "月" + time.substring(6,8) + "日" + time.substring(8,10) + "时"+ "</br>";
						html += "站号: " + info.stationId + "</br>";
						if(info.stName!="undefined"){
							html += "站名: " + info.stName + "</br>";
						}
						if(info.province!="undefined"){
							html += "省份: " + info.province + "</br>";
						}
						html += "高度: " + info.height + "m</br>";
						html += stationName+": "+ info.value + stationUnit+"</br>";
						html += "<span class=\"foreaStationClick\" onclick=\"stationClick("+info.lat+","+info.lng+")\" style=\"cursor: pointer;color:#7E0308\">预报详情</span>";
						L.popup().setLatLng([e.geometry.coordinates[1],e.geometry.coordinates[0]])
							.setContent(html)
							.openOn(map);
					}

					//if(e.eventType=='click'){
					//	var info= e.properties;
					//	var html="时间: "+time.substring(4,6) + "月" + time.substring(6,8) + "日" + time.substring(8,10) + "时"+ "</br>";
					//	html += "站号: " + info.stationId + "</br>";
					//	if(info.stName!="undefined"){
					//		html += "站名: " + info.stName + "</br>";
					//	}
					//	if(info.province!="undefined"){
					//		html += "省份: " + info.province + "</br>";
					//	}
					//	html += "高度: " + info.height + "m</br>";
					//	html += stationName+": "+ info.value + stationUnit+"</br>";
					//	html += "<span class=\"foreaStationClick\" onclick=\"stationClick("+info.lat+","+info.lng+")\" style=\"cursor: pointer;color:#7E0308\">预报详情</span>";
					//	L.popup().setLatLng([e.geometry.coordinates[1],e.geometry.coordinates[0]])
					//		.setContent(html)
					//		.openOn(map);
					//}

				});

				})
			})
		}else if(type=='air'){
			//机场
			if(heatmapLayer!=null){
				heatmapLayer.onRemove(map);
				heatmapLayer=null;
			}
			if(meteoNGLayer!=null){
				meteoNGLayer.eachLayer(function (layer) {
					map.removeLayer(layer);
				});
				meteoNGLayer=null;
			}
			for(var i=0; i<that.circleMarkerGroup.length;i++){
				var circleMarker = that.circleMarkerGroup[i];
				map.removeLayer(circleMarker);
			}
			that.circleMarkerGroup = [];
			for(var i=0;i<airPort.length;i++){
				var info = airPort[i]
				var circleMarker = L.marker([info.LAT, info.LNG],{icon: L.divIcon({className: 'staionPonit1',iconSize:[18,18]})});
				circleMarker.info = info;
				circleMarker.bindPopup(function(layer){
					var info = layer.info;
					var html = "省名: " + info.PROVINCE_NAME + "</br>";
					html += "城市: " + info.CITY_NAME + "</br>";
					html += "机场: " + info.AIRPORT_NAME + "</br>";
					html+="机场四字码: "+info.ICAO+ "</br>";
					html += "<span class=\"foreaStationClick\" onclick=\"stationClick("+info.LAT+","+info.LNG+")\" style=\"cursor: pointer;color:#7E0308\">预报详情</span>";
					//html += stationName+ info.value + stationUnit+"</br>";


					return html;
				});
				circleMarker.addTo(map);
				//$(".staionPonit1").eq(i).css({background:color})
				that.circleMarkerGroup.push(circleMarker);
			}
		}else if(type=="population"||type=="economic"){
			//从地图移除温度和降水站点的图层
            if(meteoNGLayer!=null){
				meteoNGLayer.eachLayer(function (layer) {
					map.removeLayer(layer);
				});
				meteoNGLayer=null;
			}
			//从地图移除机场站点图层
			for(var i=0; i<that.circleMarkerGroup.length;i++){
				var circleMarker = that.circleMarkerGroup[i];
				map.removeLayer(circleMarker);
			}
			that.circleMarkerGroup = [];
			if(heatmapLayer!=null){
				heatmapLayer.onRemove(map);
				heatmapLayer=null;
			}
			var cfg = {
				// radius should be small ONLY if scaleRadius is true (or small radius is intended)
				// if scaleRadius is false it will be the constant radius used in pixels
				"radius": 2,
				"maxOpacity": .8,
				// scales the radius based on map zoom
				"scaleRadius": true,
				// if set to false the heatmap uses the global maximum for colorization
				// if activated: uses the data maximum within the current map boundaries
				//   (there will always be a red spot with useLocalExtremas true)
				"useLocalExtrema": true,
				// which field name in your data represents the latitude - default "lat"
				latField: 'lat',
				// which field name in your data represents the longitude - default "lng"
				lngField: 'lng',
				// which field name in your data represents the data value - default "value"
				valueField: 'count'
			};
			$.get("../../styles/populationDataUrl.json",function(result){

				if(result){
					var data = [];
					var max = 0;
					var arr=[];
					arr=result.data.feature.data.split(";");
					var len = arr.length;
					for(var i =0; i<len; i++){
						var obj = arr[i].split(" ");
						if(type=="population"){
							data.push({lat: obj[1], lng:obj[0], count: obj[3]});
							if(obj[3] > max){
								max = obj[3];
							}
						}else{
							data.push({lat: obj[1], lng:obj[0], count: obj[4]});
							if(obj[4] > max){
								max = obj[4];
							}
						}
					}

					var testData = {"max": max, "data": data};
					heatmapLayer = new HeatmapOverlay(cfg);
					heatmapLayer.setData(testData);
					heatmapLayer.onAdd(map);
				}
			});

		}else{
			for(var i=0; i<that.circleMarkerGroup.length;i++){
				var circleMarker = that.circleMarkerGroup[i];
				map.removeLayer(circleMarker);
			}
			that.circleMarkerGroup = [];
			if(meteoNGLayer!=null){
				meteoNGLayer.eachLayer(function (layer) {
					map.removeLayer(layer);
				});
				meteoNGLayer=null;
			}
			if(heatmapLayer!=null){
				heatmapLayer.onRemove(map);
				heatmapLayer=null;
			}
		}
	},
	//站点匹配调色板
    getColorArr:function(type){
	 var that=this;
	var xmlUrl;
	 that.colorArr=[];
	if(type=='temp'){
		xmlUrl=styleRoot+ 'palettes/temperature.xml?v=1.0.8';
	}else{
		xmlUrl=styleRoot+ 'palettes/precipitation.xml?v=1.0.8';
	}
	// 请求对应的xml文件  获取对应的数值以及颜色
	$.get(xmlUrl, function(data) {
		$(data).find('entry').each(function(index, ele) {
			var obj={};
			obj.rgba=$(ele).attr('rgba');
			obj.value=$(ele).attr('value');
			that.colorArr.push(obj);
		});
	});
return that.colorArr;
},
	showEchart:function(latlng){
		var that=this;
	var g = g ? true : false;
	var lat = latlng.lat;
	var lng = latlng.lng;
	var day = 10;
		lat1 = lat;
		lng1 = lng;
		var radLat1 = lat1 * Math.PI / 180.0;
		//var radLat2 = Aws.national[that.stationId[0]].latitude * Math.PI / 180.0;
		var radLat2 = Aws.national["56891"].latitude * Math.PI / 180.0;
		var a = radLat1 - radLat2;
		var b = lng1 * Math.PI / 180.0 -  Aws.national["56891"].longitude * Math.PI / 180.0;
		var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
		dis = dis * 6378.137;
		dis = Math.round(dis * 10000) / 10000;
		var info;
		for(var i in Aws.national){
			var s=that.testDis(lat1,lng1,Aws.national[i].latitude,Aws.national[i].longitude);
			if(s<dis){
				dis=s;
				info= Aws.national[i];
			}
		}
		if(info.stName==null||info.stName==undefined){
			$("#stNum").html(info.stationId);
		}else{
			$("#stNum").html(info.stationId+"("+info.stName+")");
		}

	var publishDate = startTime.format("yyyyMMdd");
	if(Tm >=6 && Tm < 18){
		publishDate += "08"
	}else if(Tm >= 18){
		publishDate += "20";
	}else if(Tm < 6){
		publishDate = moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20";
	}
	//3小时降水数据
	var gridrain03Url = handlerPath + "/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/forecast/QPF_V2/gridrain03&format=grid03_{yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
	//console.log(gridrain03Url)
	//	fetch(gridrain03Url,{
	//		method: 'get',
	//	}).then(function(responese) {
	//		return responese.json().then(function(result){
	//			if (result) {
	//				if (result.status == 0) {
	//					return;
	//				}
    //
	//				if(forecastRule == "d310"){
	//					that.option.xAxis[0].data = result.category;
	//					that.option.series[0].data = result.data;
	//					that.myChart1.setOption(that.option);
	//					that.createShixvTable(that.option);
	//				}else if(forecastRule == "d1139"){
	//					var tmpCategory = [];
	//					var tmpData = [];
    //
	//					var category = result.category;
	//					var data = result.data;
	//					var len = category.length;
	//					for (var i = 0; i < len;) {
	//						if (i < 24) {
	//							i += 3;
	//							tmpCategory.push(category[i - 1]);
	//							tmpData.push(data[i - 1]);
	//						} else {
	//							i++;
	//							tmpCategory.push(category[i - 1]);
	//							tmpData.push(data[i - 1]);
	//						}
	//					}
    //
	//					that.option.xAxis[0].data = tmpCategory;
	//					that.option.series[0].data = tmpData;
	//					that.myChart1.setOption(that.option);
	//					that.createShixvTable(that.option);
	//				}else if(forecastRule == "d1337"){
	//					var tmpCategory = [];
	//					var tmpData = [];
    //
	//					var category = result.category;
	//					var data = result.data;
	//					var len = category.length;
	//					for (var i = 0; i < len;) {
	//						if (i < 72) {
	//							i += 3;
	//							tmpCategory.push(category[i - 1]);
	//							tmpData.push(data[i - 1]);
	//						} else {
	//							i++;
	//							tmpCategory.push(category[i - 1]);
	//							tmpData.push(data[i - 1]);
	//						}
	//					}
    //
	//					that.option.xAxis[0].data = tmpCategory;
	//					that.option.series[0].data = tmpData;
	//					that.myChart1.setOption(that.option);
	//					that.createShixvTable(that.option);
	//				}
    //
	//				$('#publishDate1').text(result.publishDate);
	//			}
	//		})
    //
	//	})
	$.ajax({
		type: 'get',
		url: gridrain03Url,
		dataType: 'json',
		success: function (result) {
			if (result) {
				if (result.status == 0) {
					return;
				}

				if(forecastRule == "d310"){
					that.option.xAxis[0].data = result.category;
					that.option.series[0].data = result.data;
					that.myChart1.setOption(that.option);
					that.createShixvTable(that.option);
				}else if(forecastRule == "d1139"){
					var tmpCategory = [];
					var tmpData = [];

					var category = result.category;
					var data = result.data;
					var len = category.length;
					for (var i = 0; i < len;) {
						if (i < 24) {
							i += 3;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						} else {
							i++;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						}
					}

					that.option.xAxis[0].data = tmpCategory;
					that.option.series[0].data = tmpData;
					that.myChart1.setOption(that.option);
					that.createShixvTable(that.option);
				}else if(forecastRule == "d1337"){
					var tmpCategory = [];
					var tmpData = [];

					var category = result.category;
					var data = result.data;
					var len = category.length;
					for (var i = 0; i < len;) {
						if (i < 72) {
							i += 3;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						} else {
							i++;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						}
					}

					that.option.xAxis[0].data = tmpCategory;
					that.option.series[0].data = tmpData;
					that.myChart1.setOption(that.option);
					that.createShixvTable(that.option);
				}

				$('#publishDate1').text(result.publishDate);
			}
		},
		error: function (errMsg) {
			console.error("加载数据失败");
		}
	});

	//1小时温度数据 (前端处理为3小时间隔数据)
	var ttt_05_1hUrl = handlerPath + "/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/ttt_05_1h&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
		//fetch(ttt_05_1hUrl,{
		//	method: 'get',
		//}).then(function(response) {
		//	return response.json().then(function(result){
		//		if (result) {
		//			if (result.status == 0) {
		//				return;
		//			}
        //
		//			if(forecastRule == "d310"){
		//				that.option.xAxis[0].data = result.category;
		//				that.option.series[1].data = result.data;
		//				that.myChart1.setOption(that.option);
		//				that.createShixvTable(that.option);
		//			}else if(forecastRule == "d1139"){
		//				var tmpCategory = [];
		//				var tmpData = [];
        //
		//				var category = result.category;
		//				var data = result.data;
		//				var len = category.length;
		//				for (var i = 0; i < len;) {
		//					if (i < 24) {
		//						i += 3;
		//						tmpCategory.push(category[i - 1]);
		//						tmpData.push(data[i - 1]);
		//					} else {
		//						i++;
		//						tmpCategory.push(category[i - 1]);
		//						tmpData.push(data[i - 1]);
		//					}
		//				}
        //
		//				that.option.xAxis[0].data = tmpCategory;
		//				that.option.series[1].data = tmpData;
		//				that.myChart1.setOption(that.option);
		//				that.createShixvTable(that.option);
		//			}else if(forecastRule == "d1337"){
		//				var tmpCategory = [];
		//				var tmpData = [];
        //
		//				var category = result.category;
		//				var data = result.data;
		//				var len = category.length;
		//				for (var i = 0; i < len;) {
		//					if (i < 72) {
		//						i += 3;
		//						tmpCategory.push(category[i - 1]);
		//						tmpData.push(data[i - 1]);
		//					} else {
		//						i++;
		//						tmpCategory.push(category[i - 1]);
		//						tmpData.push(data[i - 1]);
		//					}
		//				}
        //
		//				that.option.xAxis[0].data = tmpCategory;
		//				that.option.series[1].data = tmpData;
		//				that.myChart1.setOption(that.option);
		//				that.createShixvTable(that.option);
		//			}
		//		}
		//	})
        //
		//}).catch(function(error){
		//	console.error(error)
		//})
		$.ajax({
		type: 'get',
		url: ttt_05_1hUrl,
		dataType: 'json',
		success: function (result) {
			if (result) {
				if (result.status == 0) {
					return;
				}

				if(forecastRule == "d310"){
					that.option.xAxis[0].data = result.category;
					that.option.series[1].data = result.data;
					that.myChart1.setOption(that.option);
					that.createShixvTable(that.option);
				}else if(forecastRule == "d1139"){
					var tmpCategory = [];
					var tmpData = [];

					var category = result.category;
					var data = result.data;
					var len = category.length;
					for (var i = 0; i < len;) {
						if (i < 24) {
							i += 3;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						} else {
							i++;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						}
					}

					that.option.xAxis[0].data = tmpCategory;
					that.option.series[1].data = tmpData;
					that.myChart1.setOption(that.option);
					that.createShixvTable(that.option);
				}else if(forecastRule == "d1337"){
					var tmpCategory = [];
					var tmpData = [];

					var category = result.category;
					var data = result.data;
					var len = category.length;
					for (var i = 0; i < len;) {
						if (i < 72) {
							i += 3;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						} else {
							i++;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						}
					}

					that.option.xAxis[0].data = tmpCategory;
					that.option.series[1].data = tmpData;
					that.myChart1.setOption(that.option);
					that.createShixvTable(that.option);
				}
			}
		},
		error: function (errMsg) {
			console.error("加载数据失败");
		}
	});

		//1小时风速数据 (前端处理为3小时间隔数据)
		var wind_05_1hUrl = handlerPath + "/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/wind_05_1h&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
		//fetch(wind_05_1hUrl,{
		//	method: 'get',
		//}).then(function(responese) {
		//	return responese.json().then(function(result){
		//		if (result) {
		//			if (result.status == 0) {
		//				return;
		//			}
        //
		//			//1小时风向数据 (前端处理为3小时间隔数据)
		//			var wind_05_1h_dirUrl = handlerPath + "/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/wind_05_1h_dir&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
		//			fetch(wind_05_1h_dirUrl,{
		//				method: 'get',
		//			}).then(function(resultDirUrl) {
		//				return resultDirUrl.json().then(function(resultDir){
		//					if (resultDir) {
		//						if (resultDir.status == 0) {
		//							return;
		//						}
        //
		//						if(forecastRule == "d310"){
		//							that.option.xAxis[0].data = result.category;
        //
		//							var tmpData = [];
		//							var data = result.data;
		//							var dataDir = resultDir.data;
		//							var len = data.length;
		//							for (var i = 0; i < len; i++) {
		//								//叠加风向杆
		//								tmpData.push({value: data[i],
		//									symbol: 'image://' + that.getWindImgUrl(data[i]),
		//									//symbolSize: [24,12],
		//									symbolSize: [12,24],
		//									//标志图形旋转角度[-180,180]，正值为逆时针
		//									//0 90 180 225 270 315
		//									//0 -90 -180 135 90 45
		//									symbolRotate: dataDir[i]>180?360-dataDir[i]:-dataDir[i]});
		//								//symbolRotate: dataDir[i]-90>0?-(dataDir[i]-90):(90-dataDir[i])});
		//							}
		//							that.option.series[2].data = tmpData;
		//							//that.option.series[2].data = result.data;
        //
		//							that.myChart1.setOption(that.option);
		//							that.createShixvTable(that.option);
		//						}else if(forecastRule == "d1139"){
		//							var tmpCategory = [];
		//							var tmpData = [];
        //
		//							var category = result.category;
		//							var data = result.data;
		//							var dataDir = resultDir.data;
		//							var len = category.length;
		//							for (var i = 0; i < len;) {
		//								if (i < 24) {
		//									i += 3;
		//									tmpCategory.push(category[i - 1]);
        //
		//									//叠加风向杆
		//									var symbolData = {value: data[i - 1],
		//										symbol: 'image://' + that.getWindImgUrl(data[i - 1]),
		//										//symbolSize: [24,12],
		//										symbolSize: [12,24],
		//										//标志图形旋转角度[-180,180]，正值为逆时针
		//										//0 90 180 225 270 315
		//										//0 -90 -180 135 90 45
		//										symbolRotate : dataDir[i - 1]>180?360-dataDir[i - 1]:-dataDir[i - 1]};
		//									//symbolRotate: dataDir[i-1]-90>0?-(dataDir[i-1]-90):(90-dataDir[i-1])};
		//									tmpData.push(symbolData);
		//									//tmpData.push(data[i - 1]);
		//								} else {
		//									i++;
		//									tmpCategory.push(category[i - 1]);
        //
		//									//叠加风向杆
		//									var symbolData = {value: data[i - 1],
		//										symbol: 'image://' + that.getWindImgUrl(data[i - 1]),
		//										//symbolSize: [24,12],
		//										symbolSize: [12,24],
		//										//标志图形旋转角度[-180,180]，正值为逆时针
		//										//0 90 180 225 270 315
		//										//0 -90 -180 135 90 45
		//										symbolRotate : dataDir[i - 1]>180?360-dataDir[i - 1]:-dataDir[i - 1]};
		//									//symbolRotate: dataDir[i-1]-90>0?-(dataDir[i-1]-90):(90-dataDir[i-1])};
		//									tmpData.push(symbolData);
		//									//tmpData.push(data[i - 1]);
		//								}
		//							}
        //
		//							that.option.xAxis[0].data = tmpCategory;
		//							that.option.series[2].data = tmpData;
		//							that.myChart1.setOption(that.option);
		//							that.createShixvTable(that.option);
		//						}else if(forecastRule == "d1337"){
		//							var tmpCategory = [];
		//							var tmpData = [];
        //
		//							var category = result.category;
		//							var data = result.data;
		//							var len = category.length;
		//							for (var i = 0; i < len;) {
		//								if (i < 72) {
		//									i += 3;
		//									tmpCategory.push(category[i - 1]);
        //
        //
		//									//叠加风向杆
		//									var symbolData = {value: data[i - 1],
		//										symbol: 'image://' + that.getWindImgUrl(data[i - 1]),
		//										//symbolSize: [24,12],
		//										symbolSize: [12,24],
		//										//标志图形旋转角度[-180,180]，正值为逆时针
		//										//0 90 180 225 270 315
		//										//0 -90 -180 135 90 45
		//										symbolRotate : dataDir[i - 1]>180?360-dataDir[i - 1]:-dataDir[i - 1]};
		//									//symbolRotate: dataDir[i-1]-90>0?-(dataDir[i-1]-90):(90-dataDir[i-1])};
		//									tmpData.push(symbolData);
		//									//tmpData.push(data[i - 1]);
		//								} else {
		//									i++;
		//									tmpCategory.push(category[i - 1]);
        //
		//									//叠加风向杆
		//									var symbolData = {value: data[i - 1],
		//										symbol: 'image://' + that.getWindImgUrl(data[i - 1]),
		//										//symbolSize: [24,12],
		//										symbolSize: [12,24],
		//										//标志图形旋转角度[-180,180]，正值为逆时针
		//										//0 90 180 225 270 315
		//										//0 -90 -180 135 90 45
		//										symbolRotate : dataDir[i - 1]>180?360-dataDir[i - 1]:-dataDir[i - 1]};
		//									//symbolRotate: dataDir[i-1]-90>0?-(dataDir[i-1]-90):(90-dataDir[i-1])};
		//									tmpData.push(symbolData);
		//									//tmpData.push(data[i - 1]);
		//								}
		//							}
        //
		//							that.option.xAxis[0].data = tmpCategory;
		//							that.option.series[2].data = tmpData;
		//							that.myChart1.setOption(that.option);
		//							that.createShixvTable(that.option);
		//						}
        //
        //
		//					}
		//				})
        //
		//			}).catch(function(error){
		//				console.error(error)
		//			})
        //
		//		}
		//	})
        //
		//}).catch(function(error){
		//	console.error(error)
		//})
		$.ajax({
			type: 'get',
			url: wind_05_1hUrl,
			dataType: 'json',
			success: function (result) {
				if (result) {
					if (result.status == 0) {
						return;
					}

					//1小时风向数据 (前端处理为3小时间隔数据)
					var wind_05_1h_dirUrl = handlerPath + "/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/wind_05_1h_dir&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;

					$.ajax({
						type: 'get',
						url: wind_05_1h_dirUrl,
						dataType: 'json',
						success: function (resultDir) {
							if (resultDir) {
								if (resultDir.status == 0) {
									return;
								}

								if(forecastRule == "d310"){
									that.option.xAxis[0].data = result.category;

									var tmpData = [];
									var data = result.data;
									var dataDir = resultDir.data;
									var len = data.length;
									for (var i = 0; i < len; i++) {
										//叠加风向杆
										tmpData.push({value: data[i],
											symbol: 'image://' + that.getWindImgUrl(data[i]),
											//symbolSize: [24,12],
											symbolSize: [12,24],
											//标志图形旋转角度[-180,180]，正值为逆时针
											//0 90 180 225 270 315
											//0 -90 -180 135 90 45
											symbolRotate: dataDir[i]>180?360-dataDir[i]:-dataDir[i]});
											//symbolRotate: dataDir[i]-90>0?-(dataDir[i]-90):(90-dataDir[i])});
									}
									that.option.series[2].data = tmpData;
									//that.option.series[2].data = result.data;

									that.myChart1.setOption(that.option);
									that.createShixvTable(that.option);
								}else if(forecastRule == "d1139"){
									var tmpCategory = [];
									var tmpData = [];

									var category = result.category;
									var data = result.data;
									var dataDir = resultDir.data;
									var len = category.length;
									for (var i = 0; i < len;) {
										if (i < 24) {
											i += 3;
											tmpCategory.push(category[i - 1]);

											//叠加风向杆
											var symbolData = {value: data[i - 1],
												symbol: 'image://' + that.getWindImgUrl(data[i - 1]),
												//symbolSize: [24,12],
												symbolSize: [12,24],
												//标志图形旋转角度[-180,180]，正值为逆时针
												//0 90 180 225 270 315
												//0 -90 -180 135 90 45
												symbolRotate : dataDir[i - 1]>180?360-dataDir[i - 1]:-dataDir[i - 1]};
												//symbolRotate: dataDir[i-1]-90>0?-(dataDir[i-1]-90):(90-dataDir[i-1])};
											tmpData.push(symbolData);
											//tmpData.push(data[i - 1]);
										} else {
											i++;
											tmpCategory.push(category[i - 1]);

											//叠加风向杆
											var symbolData = {value: data[i - 1],
												symbol: 'image://' + that.getWindImgUrl(data[i - 1]),
												//symbolSize: [24,12],
												symbolSize: [12,24],
												//标志图形旋转角度[-180,180]，正值为逆时针
												//0 90 180 225 270 315
												//0 -90 -180 135 90 45
												symbolRotate : dataDir[i - 1]>180?360-dataDir[i - 1]:-dataDir[i - 1]};
												//symbolRotate: dataDir[i-1]-90>0?-(dataDir[i-1]-90):(90-dataDir[i-1])};
											tmpData.push(symbolData);
											//tmpData.push(data[i - 1]);
										}
									}

									that.option.xAxis[0].data = tmpCategory;
									that.option.series[2].data = tmpData;
									that.myChart1.setOption(that.option);
									that.createShixvTable(that.option);
								}else if(forecastRule == "d1337"){
									var tmpCategory = [];
									var tmpData = [];

									var category = result.category;
									var data = result.data;
									var len = category.length;
									for (var i = 0; i < len;) {
										if (i < 72) {
											i += 3;
											tmpCategory.push(category[i - 1]);


											//叠加风向杆
											var symbolData = {value: data[i - 1],
												symbol: 'image://' + that.getWindImgUrl(data[i - 1]),
												//symbolSize: [24,12],
												symbolSize: [12,24],
												//标志图形旋转角度[-180,180]，正值为逆时针
												//0 90 180 225 270 315
												//0 -90 -180 135 90 45
												symbolRotate : dataDir[i - 1]>180?360-dataDir[i - 1]:-dataDir[i - 1]};
												//symbolRotate: dataDir[i-1]-90>0?-(dataDir[i-1]-90):(90-dataDir[i-1])};
											tmpData.push(symbolData);
											//tmpData.push(data[i - 1]);
										} else {
											i++;
											tmpCategory.push(category[i - 1]);

											//叠加风向杆
											var symbolData = {value: data[i - 1],
												symbol: 'image://' + that.getWindImgUrl(data[i - 1]),
												//symbolSize: [24,12],
												symbolSize: [12,24],
												//标志图形旋转角度[-180,180]，正值为逆时针
												//0 90 180 225 270 315
												//0 -90 -180 135 90 45
												symbolRotate : dataDir[i - 1]>180?360-dataDir[i - 1]:-dataDir[i - 1]};
												//symbolRotate: dataDir[i-1]-90>0?-(dataDir[i-1]-90):(90-dataDir[i-1])};
											tmpData.push(symbolData);
											//tmpData.push(data[i - 1]);
										}
									}

									that.option.xAxis[0].data = tmpCategory;
									that.option.series[2].data = tmpData;
									that.myChart1.setOption(that.option);
									that.createShixvTable(that.option);
								}


							}
						},
						error: function (errMsg) {
							console.error("加载数据失败");
						}
					});

				}
			},
			error: function (errMsg) {
				console.error("加载数据失败");
			}
		});

	//1小时相对湿度数据 (前端处理为3小时间隔数据)
	var rrh_05_1hUrl = handlerPath + "/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/rrh_05_1h&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
	//fetch(rrh_05_1hUrl,{
	//	method: 'get',
	//}).then(function(reponse) {
	//	return reponse.json().then(function(result){
	//		if (result) {
	//			if (result.status == 0) {
	//				return;
	//			}
    //
	//			if(forecastRule == "d310"){
	//				that.option.xAxis[0].data = result.category;
	//				that.option.series[3].data = result.data;
	//				that.myChart1.setOption(that.option);
	//				that.createShixvTable(that.option);
	//			}else if(forecastRule == "d1139"){
	//				var tmpCategory = [];
	//				var tmpData = [];
    //
	//				var category = result.category;
	//				var data = result.data;
	//				var len = category.length;
	//				for (var i = 0; i < len;) {
	//					if (i < 24) {
	//						i += 3;
	//						tmpCategory.push(category[i - 1]);
	//						tmpData.push(data[i - 1]);
	//					} else {
	//						i++;
	//						tmpCategory.push(category[i - 1]);
	//						tmpData.push(data[i - 1]);
	//					}
	//				}
    //
	//				that.option.xAxis[0].data = tmpCategory;
	//				that.option.series[3].data = tmpData;
	//				that.myChart1.setOption(that.option);
	//				that.createShixvTable(that.option);
	//			}else if(forecastRule == "d1337"){
	//				var tmpCategory = [];
	//				var tmpData = [];
    //
	//				var category = result.category;
	//				var data = result.data;
	//				var len = category.length;
	//				for (var i = 0; i < len;) {
	//					if (i < 72) {
	//						i += 3;
	//						tmpCategory.push(category[i - 1]);
	//						tmpData.push(data[i - 1]);
	//					} else {
	//						i++;
	//						tmpCategory.push(category[i - 1]);
	//						tmpData.push(data[i - 1]);
	//					}
	//				}
    //
	//				that.option.xAxis[0].data = tmpCategory;
	//				that.option.series[3].data = tmpData;
	//				that.myChart1.setOption(that.option);
	//				that.createShixvTable(that.option);
	//			}
    //
	//		}
	//	})
    //
	//}).catch(function(error){
	//	console.error(error)
	//})
		$.ajax({
		type: 'get',
		url: rrh_05_1hUrl,
		dataType: 'json',
		success: function (result) {
			if (result) {
				if (result.status == 0) {
					return;
				}

				if(forecastRule == "d310"){
					that.option.xAxis[0].data = result.category;
					that.option.series[3].data = result.data;
					that.myChart1.setOption(that.option);
					that.createShixvTable(that.option);
				}else if(forecastRule == "d1139"){
					var tmpCategory = [];
					var tmpData = [];

					var category = result.category;
					var data = result.data;
					var len = category.length;
					for (var i = 0; i < len;) {
						if (i < 24) {
							i += 3;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						} else {
							i++;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						}
					}

					that.option.xAxis[0].data = tmpCategory;
					that.option.series[3].data = tmpData;
					that.myChart1.setOption(that.option);
					that.createShixvTable(that.option);
				}else if(forecastRule == "d1337"){
					var tmpCategory = [];
					var tmpData = [];

					var category = result.category;
					var data = result.data;
					var len = category.length;
					for (var i = 0; i < len;) {
						if (i < 72) {
							i += 3;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						} else {
							i++;
							tmpCategory.push(category[i - 1]);
							tmpData.push(data[i - 1]);
						}
					}

					that.option.xAxis[0].data = tmpCategory;
					that.option.series[3].data = tmpData;
					that.myChart1.setOption(that.option);
					that.createShixvTable(that.option);
				}

			}
		},
		error: function (errMsg) {
			console.error("加载数据失败");
		}
	});

	//3小时云量数据 (前端处理为3小时间隔数据)
	var cloud_05_1hUrl = handlerPath + "/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/cloud_05_1h&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
		//fetch(cloud_05_1hUrl,{
		//	method: 'get',
		//}).then(function(response) {
		//	return response.json().then(function(result){
		//		if (result) {
		//			if (result.status == 0) {
		//				return;
		//			}
        //
		//			that.option.xAxis[0].data = result.category;
		//			that.option.series[4].data = result.data;
		//			that.myChart1.setOption(that.option);
		//			that.createShixvTable(that.option);
		//			//$('#publishDate3').text(result.publishDate);
		//		}
		//	})
        //
		//}).catch(function(error){
		//	console.error(error)
		//})
	$.ajax({
		type: 'get',
		url: cloud_05_1hUrl,
		dataType: 'json',
		success: function (result) {
			if (result) {
				if (result.status == 0) {
					return;
				}

				that.option.xAxis[0].data = result.category;
				that.option.series[4].data = result.data;
				that.myChart1.setOption(that.option);
				that.createShixvTable(that.option);
				//$('#publishDate3').text(result.publishDate);
			}
		},
		error: function (errMsg) {
			console.error("加载数据失败");
		}
	});
		//判断是否为手机
		var htmlWidth = isMobile();
		if (htmlWidth) {
			//$("")
			$("#changeTable").css({display:"block",'top':"23px"});
			$("#changeTable1").css({display:"block","top":"23px"});
			$("#publishDate1").parents(".box").css({position:"absolute",top:0,right:0})
			$("#echartName1").next("div").css({width:"100%",height:"auto",float:"left"});
			$("#echartName1").next("div").children(".box").eq(0).css({marginLeft:0});
			$(".span-box").height(45).width('100%');
			$("#echartName1").hide();
			$("#stNum").parents(".box").hide();
			$("#publishDate1").parents(".box").css({"top":'25px',"left":"10px"})
			$("#echartss").css({"height":265});
			$("#export").css({top:"294px",right:2});
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
		that.showFlag=true;


		var myP1 = new BMap.Point(lng,lat);
		geoc.getLocation(myP1, function(rs){
			if(rs !=null){
				var addComp = rs.addressComponents;
				//alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
				//location.innerHTML = "当前位置：" + addComp.province + addComp.city + addComp.district + "(" + lngs.toFixed(2) + "°   " + lats.toFixed(2)+"°)";

				var province = addComp.province;
				var city = addComp.city;
				var area = addComp.district;

				//console.log(lat1)
				that.inputVal = area + "  " + lng.toFixed(2) + "," + lat.toFixed(2);
				//$("#longitude").html(lng.toFixed(2)+"°");
				//$("#latitude").html(lat.toFixed(2)+"°");
				$("#province").html(province);
				$("#city").html(city);
				$("#area").html(area);
				//if(g){
				$(".searchDiv input").val(that.inputVal);
				//}
			}

		});
},
    getWindImgUrl:function(windSpeed){
		var speedKey;
		/*var _windSpeedKeys=[];//[1,2];
		for(var i=3;i<=15;i+=2){
			_windSpeedKeys.push(i);
		}
		if(windSpeed<4) {
			speedKey = 2;
			if (windSpeed < 2)
				speedKey = 1;
		}else{
			for(var len=_windSpeedKeys.length,i=len- 1,speedKey;i>=0;i--){
				speedKey=_windSpeedKeys[i];
				if(windSpeed>=speedKey+1)
					break;
			}
		}*/
		
		/*if(windSpeed >= 25){
			speedKey = 25;
		}else if(windSpeed >= 23){
			speedKey = 23;
		}else if(windSpeed >= 21){
			speedKey = 21;
		}else if(windSpeed >= 19){
			speedKey = 19;
		}else if(windSpeed >= 17){
			speedKey = 17;
		}else if(windSpeed >= 15){
			speedKey = 15;
		}else if(windSpeed >= 13){
			speedKey = 13;
		}else if(windSpeed >= 11){
			speedKey = 11;
		}else if(windSpeed >= 9){
			speedKey = 9;
		}else if(windSpeed >= 7){
			speedKey = 7;
		}else if(windSpeed >= 5){
			speedKey = 5;
		}else if(windSpeed >= 3){
			speedKey = 3;
		}else if(windSpeed >= 2){
			speedKey = 2;
		}else if(windSpeed >= 1){
			speedKey = 1;
		}*/
		
		/*if(windSpeed <= 0.2){
			speedKey = 0;
		}else if(windSpeed <= 1.5){
			speedKey = 1;
		}else if(windSpeed <= 3.3){
			speedKey = 2;
		}else if(windSpeed <= 5.4){
			speedKey = 3;
		}else if(windSpeed <= 7.9){
			speedKey = 4;
		}else if(windSpeed <= 10.7){
			speedKey = 5;
		}else if(windSpeed <= 13.8){
			speedKey = 6;
		}else if(windSpeed <= 17.1){
			speedKey = 7;
		}else if(windSpeed <= 20.7){
			speedKey = 8;
		}else if(windSpeed <= 24.4){
			speedKey = 9;
		}else if(windSpeed <= 28.4){
			speedKey = 10;
		}else if(windSpeed <= 32.6){
			speedKey = 11;
		}else if(windSpeed <= 36.9){
			speedKey = 12;
		}
		
		var url=shell.application.StyleRoot+"images/wind/wind"+speedKey+".png";*/
		
		speedKey = 0;
		windSpeed+=1;
		var a = parseInt(windSpeed/20);
		var b = parseInt((windSpeed - a*20) / 4);
		var c = parseInt((windSpeed - a*20 - b*4) / 2);
		speedKey = a*10+b*2+c;
		var url=shell.application.StyleRoot+"images/wind/wind"+speedKey+".png";
		return url;
	},
	createShixvTable:function(option) {
	//console.log(option)
		var that=this;
		var str = "<tr><td>预报时间</td></tr>";
	var optionEles = option.legend.data;
		//var optionEles=["天气现象","降水","温度","风速","风向","相对湿度","云量"];
		var optionEles=["降水","温度","风速","风向杆","相对湿度","云量"];
	//var unit = ["","(mm)", "(°C)", "(m/s)","", "(%)", "(%)"];
		var unit = ["(mm)", "(°C)", "(m/s)","", "(%)", "(%)"];
	var flag = true;
	var redArr = []; //为了区分td是否为23：00加边框
		var odd=[];  //奇数  为了区分日期是否重复
		var even=[]; //偶数
		var greenArr=[];

	//var optionTimes=option.xAxis[0].data;
	//console.log(option.xAxis[0].data)
	//var optionSeries=option.series;
	var strTime = "<tr>";
	//和循环标题指示内容和单位
	for (var i = 0; i < optionEles.length; i++) {
		str += "<tr><td>" + optionEles[i] + unit[i] + "</td></tr>"
	}
	//鍒涘缓鏃堕棿option.series

	for (var i = 0; i < option.xAxis[0].data.length; i++) {

		if (option.xAxis[0].data[i].substring(8, 10) % 2 == 0) {
			//例如20号
				greenArr.push(i);
			if(even.indexOf(option.xAxis[0].data[i].substring(8, 10))==-1){
				even.push(option.xAxis[0].data[i].substring(8, 10));

						if(option.xAxis[0].data[i].substring(11, 16)=="23:00"){
							redArr.push(i);
							strTime += "<td style=\"border-right:1px solid #BEC3D5\"><p style=\"color:#000;font-size: 14px;padding-top: 8px;padding-bottom: 3px;\">"+option.xAxis[0].data[i].substring(8, 10)+"日</p><p style=\"color:#808080;\">"+option.xAxis[0].data[i].substring(11, 16)+"</p></td>";
						}else{
							strTime += "<td><p style=\"color:#000;font-size: 14px;padding-top: 8px;padding-bottom: 3px;\">"+option.xAxis[0].data[i].substring(8, 10)+"日</p><p style=\"color:#808080;\">"+option.xAxis[0].data[i].substring(11, 16)+"</p></td>";
						}

			}else{
				if(option.xAxis[0].data[i].substring(11, 16)=="23:00"){
					redArr.push(i);
					strTime += "<td style=\"border-right:1px solid #BEC3D5\"><p style=\"color:#000;font-size: 14px;padding-top: 8px;padding-bottom: 3px;\"></p><br><p style=\"color:#808080;\">"+option.xAxis[0].data[i].substring(11, 16)+"</p></td>";
				}else{
					strTime += "<td><p style=\"color:#000;font-size: 14px;padding-top: 8px;padding-bottom: 3px;\"><br></p><p style=\"color:#808080;\">"+option.xAxis[0].data[i].substring(11, 16)+"</p></td>";
				}
			}

				//flag=true;
		} else if (option.xAxis[0].data[i].substring(8, 10) % 2 != 0) {
					//例如21号
					//greenArr.push(i);
					//strTime += "<td style='background:#C1DCFA'>" + option.xAxis[0].data[i].substring(8, 10) + "日" + option.xAxis[0].data[i].substring(11, 16) + "</td>";
					if(odd.indexOf(option.xAxis[0].data[i].substring(8, 10))==-1){
						odd.push(option.xAxis[0].data[i].substring(8, 10));
						if(option.xAxis[0].data[i].substring(11, 16)=="23:00"){
							redArr.push(i);
							strTime += "<td style=\"border-right:1px solid #BEC3D5\"><p style=\"color:#000;font-size: 14px;padding-top: 8px;padding-bottom: 3px;\">"+option.xAxis[0].data[i].substring(8, 10)+"日</p><p style=\"color:#808080;\">"+option.xAxis[0].data[i].substring(11, 16)+"</p></td>";
						}else{
							strTime += "<td><p style=\"color:#000;font-size: 14px;padding-top: 8px;padding-bottom: 3px;\">"+option.xAxis[0].data[i].substring(8, 10)+"日</p><p style=\"color:#808080;\">"+option.xAxis[0].data[i].substring(11, 16)+"</p></td>";
						}
					}else{
						if(option.xAxis[0].data[i].substring(11, 16)=="23:00"){
							redArr.push(i);
							strTime += "<td style=\"border-right:1px solid #BEC3D5\"><p style=\"color:#000;font-size: 14px;padding-top: 8px;padding-bottom: 3px;\"></p><br><p style=\"color:#808080;\">"+option.xAxis[0].data[i].substring(11, 16)+"</p></td>";
						}else{
							strTime += "<td><p style=\"color:#000;font-size: 14px;padding-top: 8px;padding-bottom: 3px;\"><br></p><p style=\"color:#808080;\">"+option.xAxis[0].data[i].substring(11, 16)+"</p></td>";
						}
						}
		}
	}
	strTime += "</tr>";
	//鍒涘缓鍝ュ摜瑕佺礌瀵瑰簲鏁版嵁
	for (var i = 0; i < option.series.length+1; i++) {

		strTime += "<tr>";
		if(i==2||i==3){
			for(var j in option.series[2].data){
				if(i==2){
					var rgba1,rgba2,rgba3;
					for(var k=0;k<colorTemperature[1].length;k++){
						if(parseFloat(option.series[i].data[j].value)<=2){

							if(parseFloat(option.series[i].data[j].value)==colorTemperature[1][k].value){
								if(k==0){
									rgba1=rgba2="rgba("+colorTemperature[1][k].rgba+")";
									rgba3="rgba("+colorTemperature[1][k+1].rgba+")";

								}else if(k==colorTemperature[1].length-1){
									rgba3=rgba2="rgba("+colorTemperature[1][k].rgba+")";
									rgba1="rgba("+colorTemperature[1][k-1].rgba+")";

								}else{
									rgba2="rgba("+colorTemperature[1][k].rgba+")";
									rgba1="rgba("+colorTemperature[1][k-1].rgba+")";
									rgba3="rgba("+colorTemperature[1][k+1].rgba+")";

								}
							}
						}else{
							//value值与所选择的值不匹配的时候
							if(Math.floor(option.series[i].data[j].value)==colorTemperature[1][k].value){
								//取小值可以匹配的
								if(k==0){
									rgba1=rgba2="rgba("+colorTemperature[1][k].rgba+")";
									rgba3="rgba("+colorTemperature[1][k+1].rgba+")";

								}else if(k==colorTemperature[1].length-1){
									rgba3=rgba2="rgba("+colorTemperature[1][k].rgba+")";
									rgba1="rgba("+colorTemperature[1][k-1].rgba+")"

								}else{
									rgba2="rgba("+colorTemperature[1][k].rgba+")";
									rgba1="rgba("+colorTemperature[1][k-1].rgba+")";
									rgba3="rgba("+colorTemperature[1][k+1].rgba+")";

								}
							}else{
									//若所取数据在颜色数据之间  切小值不匹配的
								if(Math.floor(option.series[i].data[j].value)+1==colorTemperature[1][k].value){
									if(k==0){
										rgba1=rgba2="rgba("+colorTemperature[1][k].rgba+")";
										rgba3="rgba("+colorTemperature[1][k+1].rgba+")";
									}else if(k==colorTemperature[1].length-1){
										rgba3=rgba2="rgba("+colorTemperature[1][k].rgba+")";
										rgba1="rgba("+colorTemperature[1][k-1].rgba+")"
									}else{
										rgba2="rgba("+colorTemperature[1][k].rgba+")";
										rgba1="rgba("+colorTemperature[1][k-1].rgba+")";
										rgba3="rgba("+colorTemperature[1][k+1].rgba+")";
									}
								}


								}

						}
					}
					if(greenArr.indexOf(parseInt(j),0)!=-1){
						//存在在数组中

						if (redArr.indexOf(parseInt(j), 0) != -1) {
							strTime += "<td  style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");border-right:1px solid #BEC3D5\">" + option.series[i].data[j].value + "</td>"

						} else {
							strTime += "<td style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");\">" + option.series[i].data[j].value + "</td>"

						}
					}else{
						if (redArr.indexOf(parseInt(j), 0) != -1) {
							strTime += "<td  style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");border-right:1px solid #BEC3D5\">" + option.series[i].data[j].value + "</td>"

						} else {
							strTime += "<td style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");\">" + option.series[i].data[j].value + "</td>"

						}
					}
				}else{
					  var symbol = option.series[2].data[j].symbol;
					  var indexS = symbol.indexOf("/images")+1;
						if(greenArr.indexOf(parseInt(j),0)!=-1){
							//存在在数组中
							if (redArr.indexOf(parseInt(j), 0) != -1) {
								strTime += "<td  style=\"border-right:1px solid #BEC3D5\"><img src="+"../../"+symbol.slice(indexS)+" style=\"width:12px;height:24px;margin-top:5px;transform:rotate("+(-option.series[2].data[j].symbolRotate)+"deg);\"></td>"

							} else {
								strTime += "<td style=\"\"><img src="+"../../"+symbol.slice(indexS)+" style=\"width:12px;height:24px;margin-top:5px;transform:rotate("+(-option.series[2].data[j].symbolRotate)+"deg);\"></td>"

							}
						}else{
							if (redArr.indexOf(parseInt(j), 0) != -1) {
								strTime += "<td  style=\"border-right:1px solid #BEC3D5\"><img src="+"../../"+symbol.slice(indexS)+" style=\"width:12px;height:24px;margin-top:5px;transform:rotate("+(-option.series[2].data[j].symbolRotate)+"deg);\"></td>"

							} else {
								strTime += "<td style=\"\"><img src="+"../../"+symbol.slice(indexS)+" style=\"width:12px;height:24px;margin-top:5px;transform:rotate("+(-option.series[2].data[j].symbolRotate)+"deg);\"></td>"

							}
						}

				}

			}
		}else{
			for (var j = 0; j < option.series[0].data.length; j++) {
				if(i<3&&i!=2){
					if(i==1){
						var rgba1,rgba2,rgba3;
						for(var k=0;k<colorTemperature[0].length;k++){
							if(Math.floor(option.series[i].data[j])==colorTemperature[0][k].value){
								if(k==0){
									rgba1=rgba2="rgba("+colorTemperature[0][k].rgba+")";
									rgba3="rgba("+colorTemperature[0][k+1].rgba+")";
								}else if(k==colorTemperature[0].length-1){
									rgba3=rgba2="rgba("+colorTemperature[0][k].rgba+")";
									rgba1="rgba("+colorTemperature[0][k-1].rgba+")"
								}else{
									rgba2="rgba("+colorTemperature[0][k].rgba+")";
									rgba1="rgba("+colorTemperature[0][k-1].rgba+")";
									rgba3="rgba("+colorTemperature[0][k+1].rgba+")";
								}
							}
						}

						if(greenArr.indexOf(j,0)!=-1){
							//存在在数组中
							if (redArr.indexOf(j, 0) != -1) {
								strTime += "<td  style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");border-right:1px solid #BEC3D5\">" + option.series[i].data[j] + "</td>"

							} else {
								strTime += "<td style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+")\">" + option.series[i].data[j] + "</td>"

							}
						}else{
							if (redArr.indexOf(j, 0) != -1) {
								strTime += "<td  style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");border-right:1px solid #BEC3D5\">" + option.series[i].data[j] + "</td>"

							} else {
								strTime += "<td style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+")\">" + option.series[i].data[j] + "</td>"

							}
						}

					}else{
						if(greenArr.indexOf(j,0)!=-1){
							//存在在数组中
							if (redArr.indexOf(j, 0) != -1) {
								strTime += "<td  style=\"border-right:1px solid #BEC3D5\">" + option.series[i].data[j] + "</td>"

							} else {
								strTime += "<td style=\"\">" + option.series[i].data[j] + "</td>"

							}
						}else{
							if (redArr.indexOf(j, 0) != -1) {
								strTime += "<td  style=\"border-right:1px solid #BEC3D5\">" + option.series[i].data[j] + "</td>"

							} else {
								strTime += "<td style=\"\">" + option.series[i].data[j] + "</td>"

							}
						}

					}

				}else{
					if(greenArr.indexOf(j,0)!=-1){
						//存在在数组中
						if (redArr.indexOf(j, 0) != -1) {
							strTime += "<td  style=\"border-right:1px solid #BEC3D5\">" + option.series[i-1].data[j] + "</td>"

						} else {
							strTime += "<td style=\"\">" + option.series[i-1].data[j] + "</td>"

						}
					}else{
						if (redArr.indexOf(j, 0) != -1) {
							strTime += "<td  style=\"border-right:1px solid #BEC3D5\">" + option.series[i-1].data[j] + "</td>"

						} else {
							strTime += "<td style=\"\">" + option.series[i-1].data[j] + "</td>"

						}
					}
				}
			}
		}


			strTime += "</tr>"
		}
		//for (var i = 0; i < option.series.length+2; i++) {
        //
		//	strTime += "<tr>";
		//	if(i==3||i==4){
		//		for(var j in option.series[2].data){
		//			if(i==3){
		//				var rgba1,rgba2,rgba3;
		//				for(var k=0;k<colorTemperature[1].length;k++){
		//					if(parseFloat(option.series[i-1].data[j].value)<=2){
        //
		//						if(parseFloat(option.series[i-1].data[j].value)==colorTemperature[1][k].value){
		//							if(k==0){
		//								rgba1=rgba2="rgba("+colorTemperature[1][k].rgba+")";
		//								rgba3="rgba("+colorTemperature[1][k+1].rgba+")";
        //
		//							}else if(k==colorTemperature[1].length-1){
		//								rgba3=rgba2="rgba("+colorTemperature[1][k].rgba+")";
		//								rgba1="rgba("+colorTemperature[1][k-1].rgba+")";
        //
		//							}else{
		//								rgba2="rgba("+colorTemperature[1][k].rgba+")";
		//								rgba1="rgba("+colorTemperature[1][k-1].rgba+")";
		//								rgba3="rgba("+colorTemperature[1][k+1].rgba+")";
        //
		//							}
		//						}
		//					}else{
		//						//value值与所选择的值不匹配的时候
		//						if(Math.floor(option.series[i-1].data[j].value)==colorTemperature[1][k].value){
		//							//取小值可以匹配的
		//							if(k==0){
		//								rgba1=rgba2="rgba("+colorTemperature[1][k].rgba+")";
		//								rgba3="rgba("+colorTemperature[1][k+1].rgba+")";
        //
		//							}else if(k==colorTemperature[1].length-1){
		//								rgba3=rgba2="rgba("+colorTemperature[1][k].rgba+")";
		//								rgba1="rgba("+colorTemperature[1][k-1].rgba+")"
        //
		//							}else{
		//								rgba2="rgba("+colorTemperature[1][k].rgba+")";
		//								rgba1="rgba("+colorTemperature[1][k-1].rgba+")";
		//								rgba3="rgba("+colorTemperature[1][k+1].rgba+")";
        //
		//							}
		//						}else{
		//							//若所取数据在颜色数据之间  切小值不匹配的
		//							if(Math.floor(option.series[i-1].data[j].value)+1==colorTemperature[1][k].value){
		//								if(k==0){
		//									rgba1=rgba2="rgba("+colorTemperature[1][k].rgba+")";
		//									rgba3="rgba("+colorTemperature[1][k+1].rgba+")";
		//								}else if(k==colorTemperature[1].length-1){
		//									rgba3=rgba2="rgba("+colorTemperature[1][k].rgba+")";
		//									rgba1="rgba("+colorTemperature[1][k-1].rgba+")"
		//								}else{
		//									rgba2="rgba("+colorTemperature[1][k].rgba+")";
		//									rgba1="rgba("+colorTemperature[1][k-1].rgba+")";
		//									rgba3="rgba("+colorTemperature[1][k+1].rgba+")";
		//								}
		//							}
        //
        //
		//						}
        //
		//					}
		//				}
		//				if(greenArr.indexOf(parseInt(j),0)!=-1){
		//					//存在在数组中
        //
		//					if (redArr.indexOf(parseInt(j), 0) != -1) {
		//						strTime += "<td  style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");border-right:1px solid #BEC3D5\">" + option.series[i-1].data[j].value + "</td>"
        //
		//					} else {
		//						strTime += "<td style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");\">" + option.series[i-1].data[j].value + "</td>"
        //
		//					}
		//				}else{
		//					if (redArr.indexOf(parseInt(j), 0) != -1) {
		//						strTime += "<td  style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");border-right:1px solid #BEC3D5\">" + option.series[i-1].data[j].value + "</td>"
        //
		//					} else {
		//						strTime += "<td style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");\">" + option.series[i-1].data[j].value + "</td>"
        //
		//					}
		//				}
		//			}else{
		//				if(greenArr.indexOf(parseInt(j),0)!=-1){
		//					//存在在数组中
		//					if (redArr.indexOf(parseInt(j), 0) != -1) {
		//						strTime += "<td  style=\"border-right:1px solid #BEC3D5\"><img src="+"../../"+option.series[2].data[j].symbol.slice(17)+" style=\"width:21px;height:20px;margin-top:5px;transform:rotate("+(-option.series[2].data[j].symbolRotate)+"deg);\"></td>"
        //
		//					} else {
		//						strTime += "<td style=\"\"><img src="+"../../"+option.series[2].data[j].symbol.slice(17)+" style=\"width:21px;height:20px;margin-top:5px;transform:rotate("+(-option.series[2].data[j].symbolRotate)+"deg);\"></td>"
        //
		//					}
		//				}else{
		//					if (redArr.indexOf(parseInt(j), 0) != -1) {
		//						strTime += "<td  style=\"border-right:1px solid #BEC3D5\"><img src="+"../../"+option.series[2].data[j].symbol.slice(17)+" style=\"width:21px;height:20px;margin-top:5px;transform:rotate("+(-option.series[2].data[j].symbolRotate)+"deg);\"></td>"
        //
		//					} else {
		//						strTime += "<td style=\"\"><img src="+"../../"+option.series[2].data[j].symbol.slice(17)+" style=\"width:21px;height:20px;margin-top:5px;transform:rotate("+(-option.series[2].data[j].symbolRotate)+"deg);\"></td>"
        //
		//					}
		//				}
        //
		//			}
        //
		//		}
		//	}else{
		//		for (var j = 0; j < option.series[0].data.length; j++) {
		//			if(i==0){
		//				var weather=that.getWeatherInfoByCloud(option.series[4].data[j]);
		//				var indexImg="";
		//				if(weather.setImg<10){
		//					indexImg="0"+weather.setImg;
		//				}else{
		//					indexImg+=weather.setImg;
		//				}
		//				if(greenArr.indexOf(j,0)!=-1){
		//					//存在在数组中
		//					if (redArr.indexOf(j, 0) != -1) {
        //
		//						strTime += "<td  style=\"border-right:1px solid #BEC3D5\"><img src=\"images/d00.png\" style=\"width:21px;height:20px;margin-top:5px;\"></td>"
        //
		//					} else {
		//						strTime += "<td style=\"\"><img src=\"images/d00.png\" style=\"width:21px;height:20px;margin-top:5px;\"></td>"
        //
		//					}
		//				}else{
		//					if (redArr.indexOf(j, 0) != -1) {
		//						strTime += "<td  style=\"border-right:1px solid #BEC3D5\"><img src=\"images/d00.png\" style=\"width:21px;height:20px;margin-top:5px;\"></td>"
        //
		//					} else {
		//						strTime += "<td style=\"\"><img src=\"images/d00.png\"  style=\"width:21px;height:20px;margin-top:5px;\"></td>"
        //
		//					}
		//				}
		//			}else if(i<4&&i!=3){
		//				if(i==2){
		//					var rgba1,rgba2,rgba3;
		//					for(var k=0;k<colorTemperature[0].length;k++){
		//						if(Math.floor(option.series[i-1].data[j])==colorTemperature[0][k].value){
		//							if(k==0){
		//								rgba1=rgba2="rgba("+colorTemperature[0][k].rgba+")";
		//								rgba3="rgba("+colorTemperature[0][k+1].rgba+")";
		//							}else if(k==colorTemperature[0].length-1){
		//								rgba3=rgba2="rgba("+colorTemperature[0][k].rgba+")";
		//								rgba1="rgba("+colorTemperature[0][k-1].rgba+")"
		//							}else{
		//								rgba2="rgba("+colorTemperature[0][k].rgba+")";
		//								rgba1="rgba("+colorTemperature[0][k-1].rgba+")";
		//								rgba3="rgba("+colorTemperature[0][k+1].rgba+")";
		//							}
		//						}
		//					}
        //
		//					if(greenArr.indexOf(j,0)!=-1){
		//						//存在在数组中
		//						if (redArr.indexOf(j, 0) != -1) {
		//							strTime += "<td  style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");border-right:1px solid #BEC3D5\">" + option.series[i-1].data[j] + "</td>"
        //
		//						} else {
		//							strTime += "<td style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+")\">" + option.series[i-1].data[j] + "</td>"
        //
		//						}
		//					}else{
		//						if (redArr.indexOf(j, 0) != -1) {
		//							strTime += "<td  style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+");border-right:1px solid #BEC3D5\">" + option.series[i-1].data[j] + "</td>"
        //
		//						} else {
		//							strTime += "<td style=\"background: linear-gradient(to right,"+rgba1+","+rgba2+","+rgba3+")\">" + option.series[i-1].data[j] + "</td>"
        //
		//						}
		//					}
        //
		//				}else{
		//					if(greenArr.indexOf(j,0)!=-1){
		//						//存在在数组中
		//						if (redArr.indexOf(j, 0) != -1) {
		//							strTime += "<td  style=\"border-right:1px solid #BEC3D5\">" + option.series[i-1].data[j] + "</td>"
        //
		//						} else {
		//							strTime += "<td style=\"\">" + option.series[i-1].data[j] + "</td>"
        //
		//						}
		//					}else{
		//						if (redArr.indexOf(j, 0) != -1) {
		//							strTime += "<td  style=\"border-right:1px solid #BEC3D5\">" + option.series[i-1].data[j] + "</td>"
        //
		//						} else {
		//							strTime += "<td style=\"\">" + option.series[i-1].data[j] + "</td>"
        //
		//						}
		//					}
        //
		//				}
        //
		//			}else{
		//				if(greenArr.indexOf(j,0)!=-1){
		//					//存在在数组中
		//					if (redArr.indexOf(j, 0) != -1) {
		//						strTime += "<td  style=\"border-right:1px solid #BEC3D5\">" + option.series[i-2].data[j] + "</td>"
        //
		//					} else {
		//						strTime += "<td style=\"\">" + option.series[i-2].data[j] + "</td>"
        //
		//					}
		//				}else{
		//					if (redArr.indexOf(j, 0) != -1) {
		//						strTime += "<td  style=\"border-right:1px solid #BEC3D5\">" + option.series[i-2].data[j] + "</td>"
        //
		//					} else {
		//						strTime += "<td style=\"\">" + option.series[i-2].data[j] + "</td>"
        //
		//					}
		//				}
		//			}
		//		}
		//	}
        //
        //
		//	strTime += "</tr>"
		//}
		$(".shixvTable").html(str);

		$(".shixvTable1").html(strTime);
		$(".shixvTable1 tr").eq(0).css({"height":49})

},
	testDis:function(lat1, lng1, lat2, lng2) {
	var radLat1 = lat1 * Math.PI / 180.0;
	var radLat2 = lat2 * Math.PI / 180.0;
	var a = radLat1 - radLat2;
	var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	s = s * 6378.137;
	s = Math.round(s * 10000) / 10000;
	return s
},
	//表格匹配调色板
    getTempColor:function(){
		var indexx=2;
		for(var i=0;i<indexx;i++){
			if(i==1){
				var xmlUrl=styleRoot+ 'palettes/temperature.xml?v=1.0.8';
				var arr=[];
				// 请求对应的xml文件  获取对应的数值以及颜色
				$.get(xmlUrl, function(data) {
					$(data).find('entry').each(function(index, ele) {
						var obj={};
						obj.rgba=$(ele).attr('rgba');
						obj.value=$(ele).attr('value');
						arr.push(obj);
					});
					//colorTemperature.push(arr);
					colorTemperature[0]=arr;
				});

			}else{
				var xmlUrl1=styleRoot+ 'palettes/wind.xml?v=1.0.8';
				var arr1=[];
				// 请求对应的xml文件  获取对应的数值以及颜色
				$.get(xmlUrl1, function(data) {
					$(data).find('entry').each(function(index, ele) {
						var obj={};
						obj.rgba=$(ele).attr('rgba');
						obj.value=$(ele).attr('value');
						arr1.push(obj);
					});
					//colorTemperature.push(arr1);
					colorTemperature[1]=arr1;
				});
			}
		}


	}

});
function stationClick(lat1,lng1){
	var latlng ={lat:lat1,lng:lng1};
	$(".zhankai").animate({height: 336}, 500, function () {
	});
	//$(".footer").animate({bottom: 336}, 500, function () {
	//});
	$(".chartsClose").css({display:"block"})
	var intelligent=shell.application.intelligentGridPrediction;
	//$("#changeTable1").trigger("click");
	intelligent.showEchart(latlng);
	intelligent.myChart1.setOption(intelligent.option);

	//console.log(1)
}


