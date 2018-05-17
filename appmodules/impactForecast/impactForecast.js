ImpactForecast = L.Class.extend({
	initialize: function (options) {
//this.initUI();

	},
	show:function(obj){
//显示模块对应的DIV
//影响预报的显示
		$(".selectElementBox").animate({width: 800}, 500, function () {
			$(".boxClose").addClass("boxShow").removeClass("boxClose");
		});
//this.handle();
		if (geojsonLayer != null) {
			geojsonLayer.addTo(map);
		}
		this.showFlag=true;
	},
	hide:function(){
//隐藏模块对应的DIV
		$(".selectElementBox").animate({width: 13}, 500, function () {
			$(".boxShow").addClass("boxClose").removeClass("boxShow");
		});
		map.removeLayer(geojsonLayer);
		this.showFlag=false;
	},
	initUI:function(){
//初始化模块界面UI
		$(".toolHtml1").css({display:"block"});
		$(".toolHtml2").css({display:"none"});
		$(".zhankai").animate({height: 0}, 500, function () {
			$(".quX1").addClass("flodSx").removeClass("quX1");
		});
		$(".footer").animate({bottom: 0}, 500, function () {

		});
		$(".selectElementBox").animate({width: 800}, 500, function () {
			$(".boxClose").addClass("boxShow").removeClass("boxClose");
		});
		//如果截图选框存在  使之消失
		//关闭截图界面
		$(".apiBox .close").on("click",function(){
			$(".apiBox").hide();
			map.removeLayer(reRectangle);
		});
		if (reRectangle != null) {
			$(".apiBox .close").trigger("click");
		}

		this.showFlag=true;
		this.level;
		this.unit;
		this.ele;
		this.optionTableOne = {
			title: {
				text: '综合影响统计',
				textStyle: {
					fontSize: 12,

				},
				left:'50'
			},
			tooltip: {
				trigger: 'axis',
				formatter: '{b}</br>{a0}:{c0}万</br>{a1}:{c1}亿元',
				axisPointer: {
					type: 'shadow',
				}, position: function (pos, params, dom, rect, size) {
					if (pos[1] > 40 && pos[1] <= 45) {
						var top = pos[1] + 15;
					} else if (pos[1] > 45) {
						var top = pos[1] - 50;
					} else {
						var top = pos[1];
					}
					if (pos[0] > 100) {
						var left = pos[0] - 100;
					} else {
						var left = pos[0] + 10;
					}

					return [left, top];
				}
			},
			legend: {
				data: ['人口', 'GDP'],
				right: 20,
			},
			grid: {
				top: '20%',
				left: '2%',
				right: '10%',
				bottom: "2%",
				containLabel: true
			},
			dataZoom: [{
				type: 'slider',
				start: 0,
				end: 100,
				handleSize: '80%',
				zoomLock: true,
				yAxisIndex: 0,
				filterMode: 'empty',
				right: 4,
				left: '93%',
			}],
			xAxis: {
				type: 'value',
				//min:1,
				//position: 'top',
				boundaryGap: [0, 0.01],
				//interval:1,
			},
			yAxis: {
				type: 'category',
				interval: 0,
				data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
			},
			series: [
				{
					name: '人口',
					type: 'bar',
					barWidth: '30%',
					data: [18203, 23489, 29034, 104970, 131744, 630230]
				},
				{
					name: 'GDP',
					type: 'bar',
					barWidth: '30%',
					data: [19325, 23438, 31000, 121594, 134141, 681807]
				}
			]
		};
		this.optionTable2 = {
			title: [{
				text: '站点影响统计',
				textStyle: {
					fontSize: 12,

				},
				x:50,
			},{
				text: '站点影响统计',
				textStyle: {
					fontSize: 10,

				},
				x:'right',
				y:20,
			},

			],

			tooltip: {
				trigger: 'axis',
			},
			legend: {
				data: ['高温', '低温'],
				right: 10,
			},
			grid: {
				left: '3%',
				top: '22%',
				right: '3%',
				bottom: "2%",
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

					axisPointer: {
						type: 'shadow'
					}, axisLabel: {

					//interval:4,
					formatter: function (str) {
						var a = str.substring(10, 13);
						a = str.substring(8, 10) + "日/" + str.substring(11, 13);
						return a;
					}
				}
				}
			],
			yAxis: [],
			series: []
		};
//加载影响预报以及API数据
		this.influenceForecast = "";
		this.influenceForecast += '<div class="elementBox" style="width:777px;height:537px;position: absolute;top:10px;left: 13px;">\
			<div class="selectElement" style="width:100%;height:100%;position: absolute;top: 0;left:0;">\
			<div class="selectElement_box" style="padding-top: 10px;"><div style="width:100%;height:40px;font-size: 12px"><span style="display: inline-block;line-height: 20px;font-size: 14px;border: 1px solid #000;border-right:0px;margin-left: 10px">';
		for (var i = 0; i < elementData.length; i++) {
//console.log(elementData.length);
			if (elementData[i].children == null) {
				this.influenceForecast += '<span class="selectElement_span" style="width:40px;height: 20px;border-right: 1px solid #000;" onclick="\"><span class="ele" style="display:inline-block;width:100%;text-align:center;">' + elementData[i].name + '</span></span>';

			} else {
				var data = elementData[i].children;
				this.influenceForecast += '<span class="selectElement_span" style="width:40px;height: 20px;border-right: 1px solid #000;" onclick="\"><span class="ele" style="display:inline-block;width:100%;text-align:center;">' + elementData[i].name + '</span><span style="position:absolute;top:30px;left:0;display: inline-block;line-height: 20px;font-size: 14px;margin-top: 5px">';
				for (var j = 0; j < elementData[i].children.length; j++) {
					this.influenceForecast += '<span class="selectElement_radioTime" style="width:50px;height: 20px;text-align:center;"><input type="radio" name="radioTime"/><span>' + data[j].name + '</span></span>'
				}

				this.influenceForecast += '</span></span>';
			}
		}
//<div class="showEchartsBox">
		this.influenceForecast += '</span></div>\
        <div class="zongShu" style="position:absolute;top:65px;left:0px;width: 100%;height:94px;"><p style="font-weight:bold;text-indent:10px;font-size:14px;display: inline-block;width: 100%;height:25px;line-height: 25px;background:#293241;color: #fff;">影响预报</p><div class="zongzhuTable"style="width:100%;height: 74px;overflow-y: scroll;background: #E2E6F2;">\
        <p style="text-indent:10px;font-size: 15px;"></p>\
        </div></div>\
        <div class="showEchartsBox" style="position:absolute;top:165px;left:0px;"><p style="font-weight:bold;text-indent:10px;font-size:14px;display: inline-block;width: 100%;height:25px;line-height: 25px;background:#293241;color: #fff;">图表展示</p><div style="width:100%;height:220px;border-bottom: 1px solid #AFBFCC;"><div class="showEcharts" style="">\
        <div class="echartsContentBox" style="width: 240px;height: 173px;float:left;margin-top: 25px;margin-left: 15px">\
          <table id="echartsContent"></table>\
          <div style="width:100%;height:149px;overflow-y:scroll;float: left;">\
            <table id="echartsContent2"  width="100%" ></table>\
          </div>\
        </div>\
        <div id="tableEcharts1" style="display: inline-block;width: 500px;height: 193px;float:left;margin-top: 13px;margin-left: 10px;">\
        </div>\
        </div></div></div>\
        <div style="position:absolute;top:411px;left:0px;width:100%;background: #E2E6F2"><div class="showEchartsBox" style=""><div class="showEcharts" style="">\
        <div class="echartsContentBox1" style="width: 240px;height: 173px;float:left;margin-top: 20px;margin-left: 15px;">\
        <table id="echartsContent1"></table>\
          <div style="width:100%;height:151px;overflow-y:scroll;float: left;">\
             <table id="echartsContent3"  width="100%" ></table>\
          </div>\
        </div>\
        <div id="tableEcharts2" style="display: inline-block;width: 500px;height: 173px;float:left;margin-top: 13px;margin-left: 10px">\
        </div>\
        </div></div></div>\
    <div class="tipLable" style="width:250px;height:60px;position:absolute;top:230px;right:0;left:0;bottom:0;margin:0 auto;background: #e2e6f2;color:#000;display:none;"></div><div style="position:absolute;top:10px;right:0px;width:150px;font-size: 12px;color: #fff;"><span style="display: inline-block;float:left;">选择日期：</span><div class="uiMain" style="float:left;width:80px;height:18px;text-align:center;line-height: 16px;"></div></div><div class="ui-hover-panel" style="position:absolute;top:62px;right:10px;display: none;">\
        <div class="easyui-calendar" id="calendarAverage" style="width:220px;height:220px;"></div></div>\
    </div><div id="selectPrescription"  style="position:absolute;top:33px;right: 30px;width:120px;font-size: 12px;"><span style="color:#fff;">选择时效：</span><select name="prescription" id="prescription" style="background:#E5E6F8;margin-left: 7px;">';
		for (var i = 0; i < elementData[0].children[0].time.length; i++) {
			this.influenceForecast += '<option value="' + elementData[0].children[0].time[i] + '">' + elementData[0].children[0].time[i] + '</option>';
		}
		this.influenceForecast += '</select></div></div>\</div>';
		$(".BOX").html(this.influenceForecast);

//显示影响预报
		this.yxMapClick = false;
		this.eleOutside = $(".select").siblings(".change").find("input[name=radioButton]:checked").siblings().html()
//初始化默认值
		this.today = new Date();
		$(".uiMain").html(this.today.format("yyyy-MM-dd"));
		$(".selectElement_radioTime").live("click", function () {
			$(this).children("input").attr("checked", true)
		});


//判断刚开始进入时默认的是哪个要素
		this.indexOutside = 0;
		this.shixiaoIndex = 3;
		$(".selectElement_radioTime").eq(this.shixiaoIndex).children("input").attr("checked", true);


		//$(".selectElement_span").eq(this.indexOutside).trigger("click");


		this.show();
	},
	loadUrl:function(url){
		//数据同步问题
		var deferred = when.defer();
		console.log(url);
		$.ajax({
			url: url.slice(0, 34),
			type: 'get',
			dataType: 'json',
			data: {ploygon: url.slice(43, -36), type: url.slice(-30, -1) + 'r', ec1: 'ISO-8859-1', ec2: 'utf-8'},
			success: function (data) {
//console.log(url);
				deferred.resolve(data);
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
//console.log(url);
				console.error("加载数据失败")
			}
		});

		return deferred.promise;

	},
	getAllData:function(influenceInfo) {
		var deferreds = [];
		for (var k = 0; k < influenceInfo.length; k++) {
			var url = influenceInfo[k];
//console.log(url);
			deferreds.push(this.loadUrl(url));
		}
		return deferreds;
	},
	getApiUrl:function(lujing, obj, time) {
		//获取api的url
		var yyyyMMddhh = obj.replace(/-/g, "");
		var t = new Date();
//console.log(t.getHours());//
		if (t.getHours() < 18 && t.getHours() >= 6) {
			yyyyMMddhh += "08";
		} else {
			yyyyMMddhh += "20";
		}
		var XXX = "";
		if (time < 10) {
			XXX += "00" + time;
		} else if (time > 10 && time < 100) {
			XXX += "0" + time;
		} else {
			XXX += time;
		}
		var url = path + lujing.relativepath + "/";
		var data = {"yyyyMMddHH": yyyyMMddhh, "XXX": XXX};
		url += npt.util.template(lujing.fileFormat, data) + ".json";

		return url;
	},
	matchName:function(obj, objRadio) {
		//匹配要素  时效
		for (var i = 0; i < elementData.length; i++) {
			if (obj == elementData[i].name && obj != "暴雨") {
				var eleData = elementData[i];
				this.ele = elementData[i];
				return eleData;
			} else if (obj == elementData[i].name && obj == "暴雨") {
				for (var j = 0; j < elementData[i].children.length; j++) {
					if (objRadio == elementData[i].children[j].name) {
//console.log(objRadio);console.log(elementData[i].children[j].name)
						var eleData = elementData[i].children[j];
						this.ele = elementData[i];
					}
				}
				return eleData;
			}

		}
	},
	//影响落区转换为对应的url
	changeWebUrl:function(result) {
		var url = "";
		for (var i = 0; i < result.length; i++) {
			var geometries = result[i].geometry;
			if (i == result.length - 1) {
				url += this.matchCoorUrl(geometries.coordinates);
			} else {
				url += this.matchCoorUrl(geometries.coordinates) + "--";
			}

		}
//console.log(url);
		return url;
	},

	matchCoorUrl:function(data) {
//var str="http://10.1.64.17110.28.16.199/geoAPI/getData?ploygon=POLYGON ((";
//匹配坐标接口
		for (var i = 0; i < data.length; i++) {
			var str = "http://10.28.16.199/geoAPI/getData?ploygon=POLYGON ((";
			for (var j = 0; j < data[i].length; j++) {
//console.log(typeof data[i][j][0].toString())
				if (j < data[i].length - 1) {
					str += data[i][j][0].toString() + " " + data[i][j][1].toString() + ", ";

				} else if (j == data[i].length - 1) {
					str += data[i][j][0].toString() + " " + data[i][j][1].toString();

				}

			}

			str += "))&type=county,river,station,reservoir";


		}
//console.log(str);
		return str;
	},//给表格添加数据  想试试时序图
	addData:function(result) {
		var that=this;
//影响预报综合描述中的值
		var xZhZong = 0;//行政编号的总数
		var renkouZong = 0;//影响人口的总数
		var gdpZong = 0;//一下GDP的总数
		var shuikuZong = 0;//影响水库的总数
		var heliuZong = 0;//影响河流的总数   数据处理为河流为空的话  剔除  不算在总数之内
		var heliu = "";//影响河流的名称  去掉空字符串  名称与名称之间用、隔开
		var shuiku = "";//影响水库的名称  去掉空字符串  名称与名称之间用、隔开
		var administrativeCodeName = ""; //行政编码的对应县名
		var stationNum1 = 0;//影响的站点总数//ar stationName=""; //该数组下存放的为county的对象 包括行政编号  县名  人口总数  GDP总数
		var shuzu = [];
		var zhandian = [];
		var stzh = "";
		var str="";
		var shuikuming="";
		var heliuming="";
//处理各种数据
		for (var k = 0; k < result.length; k++) {
//判断水库是否有空值
			if (result[k].reservoir.length != 0) {
				for (var i = 0; i < result[k].reservoir.length; i++) {
					if (result[k].reservoir[i][0].replace(/ /g, "") != "" && shuiku.indexOf(result[k].reservoir[i][0].replace(/ /g, "")) == -1) {
						shuikuZong += 1;
						shuiku += result[k].reservoir[i][0].replace(/ /g, "") + "、";
					}
				}
			}

//判断河流是否有空值
			if (result[k].river.length != 0) {

				for (var i = 0; i < result[k].river.length; i++) {
					if (result[k].river[i][0].replace(/ /g, "") != "" && heliu.indexOf(result[k].river[i][0].replace(/ /g, "")) == -1) {
						heliuZong += 1;
						heliu += result[k].river[i][0].replace(/ /g, "") + "、";
					}
				}
			}


//判断county是否有空值  计算总数  和名称
			if (result[k].county.length != 0) {
//$("#administrativeCode5").parent("tr").remove();
				var s = "台湾省香港特别行政区澳门特别行政区";
				for (var i = 0; i < result[k].county.length; i++) {
					if (s.indexOf(result[k].county[i][1].replace(/ /g, "")) == -1) {
//console.log(result[k].county[i][1]);
						var a = {};
						a.num = result[k].county[i][0];
						a.name = result[k].county[i][1].replace(/ /g, "");
						a.renkou = Number(result[k].county[i][2].toFixed(2));

						a.gdp = Number((result[k].county[i][3] / 10000).toFixed(2));
						shuzu.push(a);
						renkouZong += Number(result[k].county[i][2].toFixed(2));
//console.log(result[k].county[i][2])
						gdpZong += Number((result[k].county[i][3] / 10000).toFixed(2));
						if (result[k].county[i][1].replace(/ /g, "") != "" && administrativeCodeName.indexOf(result[k].county[i][1].replace(/ /g, "")) == -1) {

							xZhZong += 1;
							administrativeCodeName += result[k].county[i][1].replace(/ /g, "") + "、";


						}
					} else {
						break;
					}

				}
			}
//判断站点是否为空值
			if (result[k].station.length != 0) {

				for (var i = 0; i < result[k].station.length; i++) {
					if (result[k].station[i][1].replace(/ /g, "") != "" && stzh.indexOf(result[k].station[i][1].replace(/ /g, "")) == -1) {
						stzh += result[k].station[i][1].replace(/ /g, "") + "、";
						stationNum1 += 1;
						zhandian.push(result[k].station[i]);
					}
				}
			}
			var obj = $(".select1").children("span").html();
			var objRadio = $(".selectElement_radioTime").children("input[name=radioTime]:checked").siblings("span").html();
			if (obj == "暴雨") {
				obj = obj + objRadio;
			}
			if (obj == "低温") {
				 str = obj + "<=" + that.level + that.unit + "的落区影响范围包括：" + administrativeCodeName.slice(0, -1) + "等" + xZhZong + "个县市；人口总数为：" + renkouZong.toFixed(2) + "万；GDP总数为：" + gdpZong.toFixed(2) + "亿元；站点总数为：" + stationNum1 + "个；<span class=\"shuiku\" style=\"cursor:pointer;text-decoration: underline\">水库总数为：" + shuikuZong + "座</span>；<span class=\"heliu\" style=\"cursor:pointer;text-decoration: underline\">河流总数为：" + heliuZong + "条</span>。";

			} else {
				 str = obj + ">=" + that.level + that.unit + "的落区影响范围包括：" + administrativeCodeName.slice(0, -1) + "等" + xZhZong + "个县市；人口总数为：" + renkouZong.toFixed(2) + "万；GDP总数为：" + gdpZong.toFixed(2) + "亿元；站点总数为：" + stationNum1 + "个；<span class=\"shuiku\" style=\"cursor:pointer;text-decoration: underline\">水库总数为：" + shuikuZong + "座</span>；<span class=\"heliu\" style=\"cursor:pointer;text-decoration: underline\">河流总数为：" + heliuZong + "条</span>。";

			}
			$(".zongzhuTable p").html(str);
			shuikuming = "该落区影响的水库包括：" + shuiku.slice(0, -1) + "。";
			heliuming = "该落区影响的河流包括：" + heliu.slice(0, -1) + "。";
			if (shuikuZong == 0) {
				shuikuming = '该落区无影响的水库'
			}
			if (heliuZong == 0) {
				heliuming = '该落区无影响的河流'
			}


			$(".shuiku").attr('title', shuikuming);

			$(".heliu").attr('title', heliuming);


		}
//console.log(shuzu);
		var new_shuzu = that.regroup(shuzu);

		for (var u = 0; u < new_shuzu.length; u++) {
			new_shuzu[u].renkou = Number(new_shuzu[u].renkou.toFixed(2));
			new_shuzu[u].gdp = Number(new_shuzu[u].gdp.toFixed(2));
		}
//组成的数组按照降序排列   并将它  填充到人口和GDP的表格中
		new_shuzu.sort(that.by("renkou"));

		that.add2(3, new_shuzu);
//console.log(new_shuzu.sort(by1("renkou")))
//以升序的顺序显示人口和GDP的echarts
		that.showEchartTable(new_shuzu.sort(that.by1("renkou")));

//填充到站点的数据表格中
		that.add3(4, zhandian);
//点击站点td出现时序图
		$("#echartsContent3 tr").die().live("click", function () {
			$(this).siblings().css({"background": ""});
			$(this).css({"background": "#D2E4F2"});
			var name = $(this).children().eq(1).html();
			var lat = $(this).children().eq(2).html();
			var lng = $(this).children().eq(3).html();
//console.log($("#recordTime").html())
			var publishDate = $("#recordTime").html().replace(/-/g, "").slice(0, 8) + $("#recordTime").html().slice(22, 24);
            var stationid = $(this).children().eq(0).html();
			var url = "http://10.28.16.199/npt/livemonitor/gridforecast?lat=" + lat + "&lng=" + lng + "&publishDate=" + publishDate;
//console.log(url);
			$.ajax({
				url: url,
				type: 'GET',
				dataType: 'json',
				success: function (result) {
//显示站点数据形成的echarts
					that.showEchartTable2(result,name, stationid);
				}
			})
		})
//默认选中站点中第一个的值
		$("#echartsContent3 tr").eq(0).trigger("click");

	},//处理数组中的重复  人口与GDP数据叠加
	regroup:function(testData) {
		var newData = [];
		for (var i = 0; i < testData.length; i++) {
			var bh = testData[i].num;
			var rk = testData[i].renkou;
			var gdp = testData[i].gdp;
			if (newData.length == 0) {
				newData.push(testData[i]);
			} else {
				var flag = true;
				for (var j = 0; j < newData.length; j++) {
					var new_bh = newData[j].num;
					var new_rk = newData[j].renkou;
					var new_gdp = newData[j].gdp;
					if (new_bh == bh) {
						new_rk = new_rk + rk;
						new_gdp = new_gdp + gdp;
						newData[j].renkou = new_rk;
						newData[j].gdp = new_gdp;
						flag = false;
						break;
					}
				}
				if (flag) {
					newData.push(testData[i]);
				}
			}
		}
		return newData;
	},//表格数据数组从大到小排序
	by:function(name) {
		return function (o, p) {
			var a, b;
			if (typeof o === "object" && typeof p === "object" && o && p) {
				a = o[name];
				b = p[name];
				if (a === b) {
					return 0;
				}
				if (typeof a === typeof b) {
					return a > b ? -1 : 1;
				}
				return typeof a > typeof b ? -1 : 1;
			}
			else {
				throw ("error");
			}
		}
	},//人口时序图中按照降序排列
	by1:function(name) {
		return function (o, p) {
			var a, b;
			if (typeof o === "object" && typeof p === "object" && o && p) {
				a = o[name];
				b = p[name];
				if (a === b) {
					return 0;
				}
				if (typeof a === typeof b) {
					return a < b ? -1 : 1;
				}
				return typeof a < typeof b ? -1 : 1;
			}
			else {
				throw ("error");
			}
		}
	},//自动生成表格--人口GDP的
	add2:function(obj, data) {
		//console.log(data)
		for (var j = 0; j < data.length; j++) {
			var obj1 = document.createElement("tr");
			var data1 = data[j];
			var td;
			for (var i = 0; i < obj; i++) {
				td = document.createElement("td");
				obj1.appendChild(td);
				if (obj == 3) {
					if (i == 0) {
						td.innerHTML = data1.name;
					} else if (i == 1) {
						td.innerHTML = data1.renkou;

					} else {
						td.innerHTML = data1.gdp;
					}
				}
			}

			document.getElementById("echartsContent2").appendChild(obj1);
		}


	},//自动生成表格--站点县市的
	add3:function(obj, data) {
		for (var j = 0; j < data.length; j++) {
			var td;
			var obj1 = document.createElement("tr");
			for (var i = 0; i < obj; i++) {
				td = document.createElement("td");
				obj1.appendChild(td);
				td.innerHTML = data[j][i];

			}
			//document.getElementById()
			document.getElementById("echartsContent3").appendChild(obj1);
		}

	},//显示table中县与人口的比例
	showEchartTable:function(obj) {
		var that=this;
		if (obj.length != 0) {
			var myChart3 = echarts.init(document.getElementById('tableEcharts1'));

			var county = [];
			var popular = [];
			var gdp = [];
			for (var j = 0; j < obj.length; j++) {
				county.push(obj[j].name);
				popular.push(Number(obj[j].renkou));
				gdp.push(obj[j].gdp);
			}

			that.optionTableOne.series[0].data = popular;
			//console.log(popular);
			//console.log(gdp)
			that.optionTableOne.series[1].data = gdp;

			that.optionTableOne.xAxis.data = popular;
			//console.log(optionTable1.xAxis.data)
			that.optionTableOne.yAxis.data = county;
			var bili;
			//console.log(county.length)
			if (county.length <= 5) {
				that.optionTableOne.dataZoom[0].start = 0;
				if(county.length==1){
					that.optionTableOne.xAxis.data[1] = 0;
				}
			} else if (county.length > 5 && county.length <= 10) {
				that.optionTableOne.dataZoom[0].start = 50;
			} else {
				bili = (5 / county.length * 100).toFixed(0);
				that.optionTableOne.dataZoom[0].start = 100 - bili;
			}


			myChart3.setOption(that.optionTableOne);
			//myChart3.setOption(option);
		}


	},//显示table中的站点的时序图
	showEchartTable2:function (obj, name, stationid) {
		var that=this;
		var myChart4 = echarts.init(document.getElementById('tableEcharts2'));

		var url = 'http://10.28.16.199/npt/livemonitor/historyextreme?stationid=' + stationid + '&startperiod=1&timeUnit=3';
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			success: function (result) {
				//console.log(result);
				//console.log(url)
				var element = $(".select1 .ele").html();
				var jizhi = '';
				if (element == "暴雨") {
					jizhi = "建站以来日极值：" + result[0].extremeValue + "mm";
					that.optionTable2.legend.data[0] = "降水量";
					that.optionTable2.xAxis[0].data = obj[0].data.category;
					that.optionTable2.xAxis[0].interval = 4;

					that.optionTable2.yAxis[0] = {
						type: 'value',
						//name: '水量',
						min: 0,
						//max: 25,
						//interval: 5,
						axisLabel: {
							formatter: '{value} mm'
						}
					};
					that.optionTable2.series[0] = {
						name: '降水量',
						type: 'bar',
						data: obj[0].data.data,
						symbolSize: 4,
						symbol: 'circle',
						itemStyle: {
							normal: {color: "#0AC5F5", lineStyle: {color: "#0AC5F5"}},
							emphasis: {color: "#0AC5F5"}
						}
					}
					that.optionTable2.series[0].name = "降水量";
					that.optionTable2.series[0].type = 'bar';
					that.optionTable2.series[0].barWidth = '6';
					that.optionTable2.series[0].data = obj[0].data.data;
					that.optionTable2.series[0].itemStyle.normal.color="#588A9F"
				} else if (element == "高温") {
					jizhi = "建站以来日极值：" + result[1].extremeValue + "°C";
					that.optionTable2.legend.data[0] = "高温";
					that.optionTable2.xAxis[0].data = obj[1].data.category;
					//optionTable2.xAxis[0].interval =1;

					that.optionTable2.yAxis[0] = {
						type: 'value',
						//name: '温度',
						//min: 0,
						//max: 35,
						//interval: 5,
						axisLabel: {
							formatter: '{value} °C'
						}
					};
					that.optionTable2.series[0] = {
						name: '高温',
						type: 'line',
						data: obj[1].data.data,
						symbolSize: 4,
						symbol: 'circle',
						itemStyle: {
							normal: {color: "#FF0000", lineStyle: {color: "#FF0000"}},
							emphasis: {color: "#4ACC60"}
						}
					}
				} else if (element == "低温") {
					jizhi = "建站以来日极值：" + result[2].extremeValue + "°C";

					that.optionTable2.legend.data[0] = "低温";
					//optionTable2.xAxis[0].interval =1;
					that.optionTable2.xAxis[0].data = obj[2].data.category;

					that.optionTable2.yAxis[0] = {
						type: 'value',
						//name: '温度',
						//min: 0,
						//max: 35,
						//interval: 5,
						axisLabel: {
							formatter: '{value} °C'
						}
					};
					that.optionTable2.series[0] = {
						name: '低温',
						type: 'line',
						data: obj[2].data.data,
						symbolSize: 4,
						symbol: 'circle',
						itemStyle: {
							normal: {color: "#AB4642", lineStyle: {color: "#AB4642"}},
							emphasis: {color: "#4ACC60"}
						}
					}
				}
				that.optionTable2.title[0].text = "站点影响统计--" + name.replace(/ /g, "");
				that.optionTable2.title[1].text ="   " + jizhi;
				myChart4.setOption(that.optionTable2);
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				console.error("加载数据失败")
			}
		})

	},
	handler:function(){
		//处理操作逻辑
		//点击关闭地图上的点
		$(".pickValueClose").live("mouseover",function(){
			closeFlag=false;
			$(".pickValueClose").live("click",function(e){
				mouseFlag=true;
				$("#pickValueMarker").css({display:"none"});
				currentLatLng=null;

			})
		})
		$(".picValueClick").live("mouseout",function(){
			closeFlag=true;
		})
		$(".pickValueClose").live("mouseout",function(){
			closeFlag=true;
		})
		//点击关闭影响预报
		var that=this;
		$(".selectElementBox .close").on("click", function () {
			that.hide();
		});
		//点击出现日历
		$(".uiMain").on("click", function () {
			$(".ui-hover-panel").show();
		})
		//日历的取消
		$(".ui-hover-panel").mouseout(function(){
			$(this).hide();
		})
		$(".ui-hover-panel").mouseover(function(){
			$(this).show();
		})

		var objName;
		//点击影响预报的要素  选择匹配值
		$(".selectElement_span").die().live("click", function () {
			$(this).addClass("select1");
			$(this).siblings().removeClass("select1");
			var obj = $(".select1").children(".ele").html();
			var objRadio = $(".selectElement_radioTime").children("input[name=radioTime]:checked").siblings("span").html();
			if(obj=="暴雨"){
				var i=$("input[name=radioTime]:checked").parents(".selectElement_radioTime").index();
				$(".list_title").eq(i).trigger("click");
			}else if(obj=="高温"){
				$(".list_title").eq(5).trigger("click");
			}else if(obj=="低温"){
				$(".list_title").eq(6).trigger("click");
			}else if(obj=="大风"){
				$(".list_title").eq(7).trigger("click");
			}


			//清空  初始化
			$("#tableEcharts2").html("");
			$("#tableEcharts1").html("");
			$(".zongzhuTable p").html("");
			$("#echartsContent2").html("");
			$("#echartsContent3").html("");


			var selectData =that.matchName(obj, objRadio);
			that.unit = selectData.unit;
			//初始化时效选择
			var option = '';
			for (var i = 0; i < selectData.time.length; i++) {
				option += '<option value="' + selectData.time[i] + '">' + selectData.time[i] + '</option>';
			}
			$(".selectElementBox select").html(option);
			if (that.ele.children == null) {

				$(".selectElement_radioTime").parent().css({"display": "none"});

			} else {
				$(".selectElement_radioTime").parent().css({"display": "block"});

			}
			var urlTime = $(".uiMain").html();
			var shixiao = $("select").children("option:selected").val();
			//落区请求的是路径
			var apiUrl = that.getApiUrl(selectData, urlTime, shixiao);
			//console.log(apiUrl)
			$.ajax({
				url: apiUrl,
				type: 'GET',
				dataType: 'json',
				success: function (result) {
					//console.log(result);
					if (geojsonLayer != null) {
						map.removeLayer(geojsonLayer);
					}

					var tr = '<table id="echartsContent"  width="223px" ><tr>\
			<td width=\"100px\">行政名称</td><td width=\"52px\">人口(万)</td><td width=\"69px\">GDP(亿元)</td>\
			</tr></table><div style="width:100%;height:151px;overflow-y:scroll;float: left;">\
			  <table id="echartsContent2"  width="100%" ></table></div>';
					var tr1 = '<table id="echartsContent1"  width="223px" ><tr>\
			<td width=\"100px\">站号</td><td>站名</td>\
			</tr></table>\
			  <div style="width:100%;height:151px;overflow-y:scroll;float: left;">\
			  <table id="echartsContent3"  width="100%" ></table></div>';

					$(".echartsContentBox").html(tr);
					$(".echartsContentBox1").html(tr1);
					//$("#tableEcharts").html(str1);


					if (result != null) {
						var length = result.features.length;
						//console.log(length);
						if (length != 0) {
							var levelStart = result.features[0].properties.level;
							var levelEnd = result.features[length - 1].properties.level;
							var featrue = [];
							if (apiUrl.indexOf("tmi_") != -1) {
								featrue.push(result.features[0]);
								that.level = levelStart;
								for (var i = 1; i < length - 1; i++) {
									if (levelStart == result.features[i].properties.level) {
										featrue.push(result.features[i]);
									}
								}
								//console.log(featrue.length);
								result.features = featrue;
							} else {
								that.level = levelEnd;
								featrue.push(result.features[length - 1]);
								for (var i = length - 2; i >= 0; i--) {
									if (levelEnd == result.features[i].properties.level) {
										featrue.push(result.features[i]);
									}
								}
								//console.log(featrue.length);
								result.features = featrue;
							}
							//console.log(result);
							geojsonLayer = L.geoJSON(result, {
								style: function (feature) {
									return {color: 'red'};
								}
							}).addTo(map);
							var influenceInfo = that.changeWebUrl(result.features);
							influenceInfo = influenceInfo.split("--");
							//解决同步异步  逐条去查
							when.all(that.getAllData(influenceInfo)).then(function (result) {
								//填充表格以及站点表格
								that.addData(result);

							});
						} else {
							var str = '<notice style="background: rgba(0,0,0,.5);padding: 5px;position:absolute;margin: auto;left: 0;right: 0;top: 0;bottom: 0;width: 240px;height: 45px;z-index: 4000;"><div style="background: #fff;text-align: center;width: auto;padding: 10px;font-size: 14px;white-space: pre-line;color: #666;line-height: 24px">该时效下无数据</div></notice>';
							$(".tipLable").html(str).fadeIn(1000).fadeOut(1000);
						}
					} else {
						var str = '<notice style="background: rgba(0,0,0,.5);padding: 5px;position:absolute;margin: auto;left: 0;right: 0;top: 0;bottom: 0;width: 240px;height: 45px;z-index: 4000;"><div style="background: #fff;text-align: center;width: auto;padding: 10px;font-size: 14px;white-space: pre-line;color: #666;line-height: 24px">该时效下无数据</div></notice>';
						$(".tipLable").html(str).fadeIn(1000).fadeOut(1000);
					}


				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.error("加载数据失败")
				}
			});

		})

		$(".selectElement_span").eq(that.indexOutside).trigger("click");

		//日期选择框
		$('#calendarAverage').calendar({
			current: new Date(),
			onSelect: function (date) {
				$("#tableEcharts2").html("");
				$("#tableEcharts1").html("");
				$(".zongzhuTable p").html("");
				$("#echartsContent2").html("");
				$("#echartsContent3").html("");
				$(".uiMain").html(date.format("yyyy-MM-dd"));
				var obj = $(".select1").children("span").html();
				var objRadio = $(".selectElement_radioTime").children("input[name=radioTime]:checked").siblings("span").html();

				//console.log(objRadio)
				var selectData = that.matchName(obj, objRadio);
				var option = '';
				for (var i = 0; i < selectData.time.length; i++) {
					option += '<option value="' + selectData.time[i] + '">' + selectData.time[i] + '</option>';
				}
				$("select").html(option);
				var urlTime = date.format("yyyy-MM-dd");
				var shixiao = $("select").children("option:selected").val();
				var apiUrl = that.getApiUrl(selectData, urlTime, shixiao);
				//console.log(apiUrl)
				$.ajax({
					url: apiUrl,
					type: 'GET',
					dataType: 'json',
					success: function (result) {
						//console.log(result);
						if (geojsonLayer != null) {
							map.removeLayer(geojsonLayer);
						}

						var tr = '<table id="echartsContent"  width="223px" ><tr>\
			<td width=\"100px\">行政名称</td><td width=\"52px\">人口(万)</td><td width=\"69px\">GDP(亿元)</td>\
			</tr></table><div style="width:100%;height:151px;overflow-y:scroll;float: left;">\
			  <table id="echartsContent2"  width="100%" ></table></div>';
						var tr1 = '<table id="echartsContent1"  width="223px" ><tr>\
			<td width=\"100px\">站号</td><td>站名</td>\
			</tr></table>\
			  <div style="width:100%;height:151px;overflow-y:scroll;float: left;">\
			  <table id="echartsContent3"  width="100%" ></table></div>';

						$(".echartsContentBox").html(tr);
						$(".echartsContentBox1").html(tr1);
						//$("#tableEcharts").html(str1);
						if (result != null) {
							var length = result.features.length;
							//console.log(length);
							if (length != 0) {
								var levelStart = result.features[0].properties.level;
								var levelEnd = result.features[length - 1].properties.level;
								var featrue = [];
								if (apiUrl.indexOf("tmi_") != -1) {
									featrue.push(result.features[0]);
									that.level= levelStart;
									for (var i = 1; i < length - 1; i++) {
										if (levelStart == result.features[i].properties.level) {
											featrue.push(result.features[i]);
										}
									}
									//console.log(featrue.length);
									result.features = featrue;
								} else {
									that.level = levelEnd;
									featrue.push(result.features[length - 1]);
									for (var i = length - 2; i >= 0; i--) {
										if (levelEnd == result.features[i].properties.level) {
											featrue.push(result.features[i]);
										}
									}
									//console.log(featrue.length);
									result.features = featrue;
								}
								//console.log(result);
								geojsonLayer = L.geoJSON(result, {
									style: function (feature) {
										return {color: 'red'};
									}
								}).addTo(map);
								var influenceInfo = that.changeWebUrl(result.features);
								influenceInfo = influenceInfo.split("--");
								when.all(that.getAllData(influenceInfo)).then(function (result) {

									that.addData(result);

								});
							} else {
								var str = '<notice style="background: rgba(0,0,0,.5);padding: 5px;position:absolute;margin: auto;left: 0;right: 0;top: 0;bottom: 0;width: 240px;height: 45px;z-index: 4000;"><div style="background: #fff;text-align: center;width: auto;padding: 10px;font-size: 14px;white-space: pre-line;color: #666;line-height: 24px">该时效下无数据</div></notice>';
								$(".tipLable").html(str).fadeIn(1000).fadeOut(1000);
							}
						} else {
							var str = '<notice style="background: rgba(0,0,0,.5);padding: 5px;position:absolute;margin: auto;left: 0;right: 0;top: 0;bottom: 0;width: 240px;height: 45px;z-index: 4000;"><div style="background: #fff;text-align: center;width: auto;padding: 10px;font-size: 14px;white-space: pre-line;color: #666;line-height: 24px">该时效下无数据</div></notice>';
							$(".tipLable").html(str).fadeIn(1000).fadeOut(1000);
						}


					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						console.error("加载数据失败")
					}
				});
				$(".ui-hover-panel").hide();
			}
		});
		//改变option的值  触发事件
		$("#prescription").change(function () {
			$("#tableEcharts2").html("");
			$("#tableEcharts1").html("");
			$(".zongzhuTable p").html("");
			$("#echartsContent2").html("");
			$("#echartsContent3").html("");
			var obj = $(".select1").children("span").html();
			var objRadio = $(".selectElement_radioTime").children("input[name=radioTime]:checked").siblings("span").html();
			//console.log(objRadio)
			var selectData = that.matchName(obj, objRadio);
			var urlTime = $(".uiMain").html().replace(/-/g, "");
			var shixiao = $("select").children("option:selected").val();
			//console.log(shixiao)
			//console.log(getApiUrl(selectData,urlTime,shixiao));
			var apiUrl = that.getApiUrl(selectData, urlTime, shixiao);
			//console.log(apiUrl)
			$.ajax({
				url: apiUrl,
				type: 'GET',
				dataType: 'json',
				success: function (result) {
					//console.log(result);
					if (geojsonLayer != null) {
						map.removeLayer(geojsonLayer);
					}

					var tr = '<table id="echartsContent"  width="223px" ><tr>\
			<td width=\"100px\">行政名称</td><td width=\"52px\">人口(万)</td><td width=\"69px\">GDP(亿元)</td>\
			</tr></table><div style="width:100%;height:151px;overflow-y:scroll;float: left;">\
			  <table id="echartsContent2"  width="100%" ></table></div>';
					var tr1 = '<table id="echartsContent1"  width="223px" ><tr>\
			<td width=\"100px\">站号</td><td>站名</td>\
			</tr></table>\
			  <div style="width:100%;height:151px;overflow-y:scroll;float: left;">\
			  <table id="echartsContent3"  width="100%" ></table></div>';

					$(".echartsContentBox").html(tr);
					$(".echartsContentBox1").html(tr1);
					//$("#tableEcharts").html(str1);


					if (result != null) {
						var length = result.features.length;
						//console.log(length);
						if (length != 0) {
							var levelStart = result.features[0].properties.level;
							var levelEnd = result.features[length - 1].properties.level;
							var featrue = [];
							if (apiUrl.indexOf("tmi_") != -1) {
								featrue.push(result.features[0]);
								that.level = levelStart;
								for (var i = 1; i < length - 1; i++) {
									if (levelStart == result.features[i].properties.level) {
										featrue.push(result.features[i]);
									}
								}
								//console.log(featrue.length);
								result.features = featrue;
							} else {
								that.level = levelEnd;
								featrue.push(result.features[length - 1]);
								for (var i = length - 2; i >= 0; i--) {
									if (levelEnd == result.features[i].properties.level) {
										featrue.push(result.features[i]);
									}
								}
								//console.log(featrue.length);
								result.features = featrue;
							}
							//console.log(result);
							geojsonLayer = L.geoJSON(result, {
								style: function (feature) {
									return {color: 'red'};
								}
							}).addTo(map);
							var influenceInfo = that.changeWebUrl(result.features);
							influenceInfo = influenceInfo.split("--");
							//console.log(influenceInfo)
							when.all(that.getAllData(influenceInfo)).then(function (result) {

								that.addData(result);

							});
						} else {
							var str = '<notice style="background: rgba(0,0,0,.5);padding: 5px;position:absolute;margin: auto;left: 0;right: 0;top: 0;bottom: 0;width: 240px;height: 45px;z-index: 4000;"><div style="background: #fff;text-align: center;width: auto;padding: 10px;font-size: 14px;white-space: pre-line;color: #666;line-height: 24px">该时效下无数据</div></notice>';
							$(".tipLable").html(str).fadeIn(1000).fadeOut(1000);
						}
					} else {
						var str = '<notice style="background: rgba(0,0,0,.5);padding: 5px;position:absolute;margin: auto;left: 0;right: 0;top: 0;bottom: 0;width: 240px;height: 45px;z-index: 4000;"><div style="background: #fff;text-align: center;width: auto;padding: 10px;font-size: 14px;white-space: pre-line;color: #666;line-height: 24px">该时效下无数据</div></notice>';
						$(".tipLable").html(str).fadeIn(1000).fadeOut(1000);
					}


				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.error("加载数据失败")
				}
			});
		});

		 $(".closeForecast").die().live("click",function(){

				 if(that.showFlag){
					 //收起时序图
					 that.hide();
					 //that.showFlag=false;
				 }else{
					 //展开时序图
					 $(".apiBox .close").on("click",function(){
						 $(".apiBox").hide();
						 map.removeLayer(reRectangle);
					 });
					 if (reRectangle != null) {
						 $(".apiBox .close").trigger("click");
					 }

					 that.show();
					 //that.showFlag=true;
				 }

		 })
		$(".api").on("click",function(){
			that.hide();
		})

	}


});