/**
 * Created by Administrator on 2017/3/6.
 */
$(function() {
	var lineAll;		 //时间轴总长度
	var lineDay;         //一天的总长度
	var lineHours;		 //每小时的长度
	var spanPointer;     //指针自身宽度/2
	var time;			 //指针运动定时器
	var Divs;
	var newDate = new Date();
	var newMap = new Map();
	var kolse = false;
	var qel1;
	var hel1;
	var qel2;
	var hel2;
	var Tm = newDate.getHours();
	var spWidth = $("#all").width();

	var Nm;
	var nuTm;
	var startTime;

	var offsetHtml = $("html").width() / 2;
	var inpWidth = $("#inp").width() / 2;
	var newDate = new Date;
	var Tm = newDate.getHours();
	var liveTm = moment(newDate).subtract(30,"minutes").toDate().getHours();
	var isdrag = false;
	var NowLeft, disX;
	var setWidth = $("html").width() / 2;
	var oDiv2 = document.getElementById("parst");
	var ten = 30;     // 不影响体验 设定 一小时最小宽度60px
	var kos = true;
	var timeMove;    // web 计时器
	var lat1;
	var lng1;
	var level;
	var unit;
	var reRectangle;
	var mapClickFlag = true;
	var mapMouseFlag = true;
	var changeFlag = false;
	var yxMapClick = true;
	var rectPoint1;
	var rectPoint3;

	var ifLayer;
	var pictureFlag=true;
	var selected1=false;
	var selected2=false;
	var firstFlag=true;
	var currentLatLng = null;
	var fileUrl="";
	var latCan = getParam('lat');
	var lngCan = getParam('lng');
	var flagCan = false;
	//var latCan = 25.06;
	//var lngCan = 132.36;
	//监听浏览器视图的大小变化（以确保指针位置随窗口大小变化之后的正确显示）
	$(window).resize(function () {
		lineAll = parseInt($("#all").css("width"));
		offsetHtml = $("html").width() / 2;
		//console.log(offsetHtml)
		$("#scorlSep").css("left", 80);
		$("#inp").css("left", 45);
	});

	function getParam(paramName) {
		paramValue = "";
		paramValue = "";
		isFound = false;
		if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
			arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&");
			i = 0;
			while (i < arrSource.length && !isFound) {
				if (arrSource[i].indexOf("=") > 0) {
					if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
						paramValue = arrSource[i].split("=")[1];
						isFound = true;
					}
				}
				i++;
			}
		}
		return paramValue;
	}
	//根据刻度获取时效值
	function getDiv(time) {
		var num = $("#all").children(".mellDay").length;
		var next = $("#all .red").parent(".mellDay").nextAll(".mellDay").length;

		var index = 0;
		for (var i = 0, len = num - next - 1; i < len; i++) {
			var numDiv = $("#all").children(".mellDay").eq(i).children(".bbb").length;
			index += numDiv;
		}
		index += $("#all .red").length - 1;
		return time[index];
	}

	//根据刻度获取当前块的索引
	/*function getDivIndex() {
	 var num = $("#all").children(".mellDay").length;
	 var next = $("#all .red").parent(".mellDay").nextAll(".mellDay").length;

	 var index = 0;
	 for (var i = 0, len = num - next - 1; i < len; i++) {
	 var numDiv = $("#all").children(".mellDay").eq(i).children(".bbb").length;
	 index += numDiv;
	 }
	 var len = $("#all .red").length;
	 index += len - 1;
	 return index;
	 }*/

	//根据刻度获取当前块的索引
	function getDivIndex(){
		var first = $(".mellDay").eq(0).find(".bbb").length;
		var redSmall = $(".red").length;
		var redBig = $(".redMellDay").length;
		var index = 0;
		for(i=1;i<redBig;i++){
			var len = $(".redMellDay").eq(i).find(".bbb").length;
			index += len;
		}
		if(redBig>0){
			index = index + first + redSmall -1;
		}else if(redBig == 0){
			index = redSmall -1;
		}

		//console.log(index);
		return index;
	}

	//根据起报时间等参数换算文件名
	function getFileName(num, date, featureData) {
		//var yyyyMMddHH = moment(obj).format("YYYYMMDD");
		var fileName = "";
		var yyyyMMddHH = date.format("yyyyMMdd");
		if (featureData.liveVisible) {
			var index = getDivIndex();
			if (Boolean(qel2) && !Boolean(qel3)) {
				if (Tm >= 6 && Tm < 18) {
					if (index <= liveTm) {
						//实况
						var HH = "";
						if (index < 10) {
							HH = "0" + index;
						} else {
							HH = "" + index;
						}
						var data = {"yyyyMMddHH": yyyyMMddHH + HH};
						fileName = npt.util.template(featureData.liveFileFormat, data);
					} else {
						//6 7 8三个时间 点的预报路径
						if (index <= 8) {
							yyyyMMddHH = moment(date).subtract(1, "day").toDate().format("yyyyMMdd") + "20";
							var XXX = parseInt(featureData.time[(index + 4 - 1)]);
							if (XXX < 10) {
								XXX = "00" + XXX;
							} else if (10 <= XXX && XXX < 100) {
								XXX = "0" + XXX;
							} else if (XXX >= 100) {
								XXX = "" + XXX;
							}

							var data = {"yyyyMMddHH": yyyyMMddHH, "XXX": XXX};
							fileName = npt.util.template(featureData.fileFormat, data);

						} else {
							//8点以后
							yyyyMMddHH = date.format("yyyyMMdd") + "08";

							var XXX = parseInt(featureData.time[(index - 9)]);
							if (XXX < 10) {
								XXX = "00" + XXX;
							} else if (10 <= XXX && XXX < 100) {
								XXX = "0" + XXX;
							} else if (XXX >= 100) {
								XXX = "" + XXX;
							}

							var data = {"yyyyMMddHH": yyyyMMddHH, "XXX": XXX};
							fileName = npt.util.template(featureData.fileFormat, data);

						}
					}

				} else if (Tm >= 18) {
					if (index <= liveTm) {
						//实况
						var HH = "";
						if (index < 10) {
							HH = "0" + index;
						} else {
							HH = "" + index;
						}
						var data = {"yyyyMMddHH": yyyyMMddHH + HH};
						fileName = npt.util.template(featureData.liveFileFormat, data);
					} else {
						if (index <= 20) {
							//在 18 19 20 三个特殊时刻的路径
							var XXX = parseInt(featureData.time[(index - 9)]);
							if (XXX < 10) {
								XXX = "00" + XXX;
							} else if (10 <= XXX && XXX < 100) {
								XXX = "0" + XXX;
							} else if (XXX >= 100) {
								XXX = "" + XXX;
							}

							var data = {"yyyyMMddHH": yyyyMMddHH + "08", "XXX": XXX};
							fileName = npt.util.template(featureData.fileFormat, data);

						} else {
							//20点以后
							var XXX = parseInt(featureData.time[(index - 21)]);
							if (XXX < 10) {
								XXX = "00" + XXX;
							} else if (10 <= XXX && XXX < 100) {
								XXX = "0" + XXX;
							} else if (XXX >= 100) {
								XXX = "" + XXX;
							}

							var data = {"yyyyMMddHH": yyyyMMddHH + "20", "XXX": XXX};
							fileName = npt.util.template(featureData.fileFormat, data);

						}
					}

				} else if (Tm < 6) {
					var tmpTm = liveTm;
					if (liveTm == 23) {
						tmpTm = -1;
					}

					if (index <= tmpTm + 24) {
						var HH = "";
						if (index < 24) {
							if (index < 10) {
								HH = "0" + index;
							} else {
								HH = "" + index;
							}
							yyyyMMddHH = moment(date).subtract(1, "day").toDate().format("yyyyMMdd");
						} else {
							HH = "0" + (index - 24);
						}
						var data = {"yyyyMMddHH": yyyyMMddHH + HH};
						fileName = npt.util.template(featureData.liveFileFormat, data);
					} else {
						var i = Math.floor((tmpTm + 24 - 20) / hel1);
						var XXX = parseInt(featureData.time[(index - (tmpTm + 24 + 1)) + i]);
						if (XXX < 10) {
							XXX = "00" + XXX;
						} else if (10 <= XXX && XXX < 100) {
							XXX = "0" + XXX;
						} else if (XXX >= 100) {
							XXX = "" + XXX;
						}

						yyyyMMddHH = moment(date).subtract(1, "day").toDate().format("yyyyMMdd") + "20";
						var data = {"yyyyMMddHH": yyyyMMddHH, "XXX": XXX};
						fileName = npt.util.template(featureData.fileFormat, data);
					}
				}
			} else if (Boolean(qel3)) {


			} else {
				if (Tm >= 6 && Tm < 18) {
					if (index <= liveTm) {
						var HH = "";
						if (index < 10) {
							HH = "0" + index;
						} else {
							HH = "" + index;
						}
						var data = {"yyyyMMddHH": yyyyMMddHH + HH};
						fileName = npt.util.template(featureData.liveFileFormat, data);
					} else if (liveTm == 5) {
						if (index == 6) {
							yyyyMMddHH = moment(date).subtract(1, "day").toDate().format("yyyyMMdd") + "20";
							var data = {"yyyyMMddHH": yyyyMMddHH, "XXX": "012"};
							fileName = npt.util.template(featureData.fileFormat, data);
						} else {
							var XXX = parseInt(featureData.time[(index - 7)]);
							if (XXX < 10) {
								XXX = "00" + XXX;
							} else if (10 <= XXX && XXX < 100) {
								XXX = "0" + XXX;
							} else if (XXX >= 100) {
								XXX = "" + XXX;
							}

							var data = {"yyyyMMddHH": yyyyMMddHH + "08", "XXX": XXX};
							fileName = npt.util.template(featureData.fileFormat, data);
						}
					} else if (liveTm == 6) {
						if (index == 7) {
							yyyyMMddHH = moment(date).subtract(1, "day").toDate().format("yyyyMMdd") + "20";
							var data = {"yyyyMMddHH": yyyyMMddHH, "XXX": "012"};
							fileName = npt.util.template(featureData.fileFormat, data);
						} else {
							var XXX = parseInt(featureData.time[(index - 8)]);
							if (XXX < 10) {
								XXX = "00" + XXX;
							} else if (10 <= XXX && XXX < 100) {
								XXX = "0" + XXX;
							} else if (XXX >= 100) {
								XXX = "" + XXX;
							}

							var data = {"yyyyMMddHH": yyyyMMddHH + "08", "XXX": XXX};
							fileName = npt.util.template(featureData.fileFormat, data);
						}
					} else if (liveTm == 7) {
						if (index == 8) {
							yyyyMMddHH = moment(date).subtract(1, "day").toDate().format("yyyyMMdd") + "20";
							var data = {"yyyyMMddHH": yyyyMMddHH, "XXX": "012"};
							fileName = npt.util.template(featureData.fileFormat, data);
						} else {
							var XXX = parseInt(featureData.time[(index - 9)]);
							if (XXX < 10) {
								XXX = "00" + XXX;
							} else if (10 <= XXX && XXX < 100) {
								XXX = "0" + XXX;
							} else if (XXX >= 100) {
								XXX = "" + XXX;
							}

							var data = {"yyyyMMddHH": yyyyMMddHH + "08", "XXX": XXX};
							fileName = npt.util.template(featureData.fileFormat, data);
						}
					} else {
						var i = Math.floor((liveTm - 8) / hel1);
						var XXX = parseInt(featureData.time[(index - (liveTm + 1)) + i]);
						if (XXX < 10) {
							XXX = "00" + XXX;
						} else if (10 <= XXX && XXX < 100) {
							XXX = "0" + XXX;
						} else if (XXX >= 100) {
							XXX = "" + XXX;
						}

						var data = {"yyyyMMddHH": yyyyMMddHH + "08", "XXX": XXX};
						fileName = npt.util.template(featureData.fileFormat, data);
					}

				} else if (Tm >= 18) {

					if (index <= liveTm) {
						var HH = "";
						if (index < 10) {
							HH = "0" + index;
						} else {
							HH = "" + index;
						}
						var data = {"yyyyMMddHH": yyyyMMddHH + HH};
						fileName = npt.util.template(featureData.liveFileFormat, data);
					} else if (liveTm == 17) {
						if (index == 18) {
							yyyyMMddHH = moment(date).toDate().format("yyyyMMdd") + "08";
							var data = {"yyyyMMddHH": yyyyMMddHH, "XXX": "012"};
							fileName = npt.util.template(featureData.fileFormat, data);
						} else {
							var XXX = parseInt(featureData.time[(index - 19)]);
							if (XXX < 10) {
								XXX = "00" + XXX;
							} else if (10 <= XXX && XXX < 100) {
								XXX = "0" + XXX;
							} else if (XXX >= 100) {
								XXX = "" + XXX;
							}

							var data = {"yyyyMMddHH": yyyyMMddHH + "20", "XXX": XXX};
							fileName = npt.util.template(featureData.fileFormat, data);
						}
					} else if (liveTm == 18) {
						if (index == 19) {
							yyyyMMddHH = moment(date).toDate().format("yyyyMMdd") + "08";
							var data = {"yyyyMMddHH": yyyyMMddHH, "XXX": "012"};
							fileName = npt.util.template(featureData.fileFormat, data);
						} else {
							var XXX = parseInt(featureData.time[(index - 20)]);
							if (XXX < 10) {
								XXX = "00" + XXX;
							} else if (10 <= XXX && XXX < 100) {
								XXX = "0" + XXX;
							} else if (XXX >= 100) {
								XXX = "" + XXX;
							}

							var data = {"yyyyMMddHH": yyyyMMddHH + "20", "XXX": XXX};
							fileName = npt.util.template(featureData.fileFormat, data);
						}
					} else if (liveTm == 19) {
						if (index == 20) {
							yyyyMMddHH = moment(date).toDate().format("yyyyMMdd") + "08";
							var data = {"yyyyMMddHH": yyyyMMddHH, "XXX": "012"};
							fileName = npt.util.template(featureData.fileFormat, data);
						} else {
							var XXX = parseInt(featureData.time[(index - 21)]);
							if (XXX < 10) {
								XXX = "00" + XXX;
							} else if (10 <= XXX && XXX < 100) {
								XXX = "0" + XXX;
							} else if (XXX >= 100) {
								XXX = "" + XXX;
							}

							var data = {"yyyyMMddHH": yyyyMMddHH + "20", "XXX": XXX};
							fileName = npt.util.template(featureData.fileFormat, data);
						}
					} else {
						var i = Math.floor((liveTm - 20) / hel1);
						var XXX = parseInt(featureData.time[(index - (liveTm + 1)) + i]);
						if (XXX < 10) {
							XXX = "00" + XXX;
						} else if (10 <= XXX && XXX < 100) {
							XXX = "0" + XXX;
						} else if (XXX >= 100) {
							XXX = "" + XXX;
						}

						var data = {"yyyyMMddHH": yyyyMMddHH + "20", "XXX": XXX};
						fileName = npt.util.template(featureData.fileFormat, data);
					}
				} else if (Tm < 6) {
					var tmpTm = liveTm;
					if (liveTm == 23) {
						tmpTm = -1;
					}

					if (index <= tmpTm + 24) {
						var HH = "";
						if (index < 24) {
							if (index < 10) {
								HH = "0" + index;
							} else {
								HH = "" + index;
							}
							yyyyMMddHH = moment(date).subtract(1, "day").toDate().format("yyyyMMdd");
						} else {
							HH = "0" + (index - 24);
						}
						var data = {"yyyyMMddHH": yyyyMMddHH + HH};
						fileName = npt.util.template(featureData.liveFileFormat, data);
					} else {
						var i = Math.floor((tmpTm + 24 - 20) / hel1);
						var XXX = parseInt(featureData.time[(index - (tmpTm + 24 + 1)) + i]);
						if (XXX < 10) {
							XXX = "00" + XXX;
						} else if (10 <= XXX && XXX < 100) {
							XXX = "0" + XXX;
						} else if (XXX >= 100) {
							XXX = "" + XXX;
						}

						yyyyMMddHH = moment(date).subtract(1, "day").toDate().format("yyyyMMdd") + "20";
						var data = {"yyyyMMddHH": yyyyMMddHH, "XXX": XXX};
						fileName = npt.util.template(featureData.fileFormat, data);
					}
				}
			}

		}else{
			/*if (nuTm == 8) {
			 yyyyMMddHH += "08"
			 } else if (nuTm == 20) {
			 yyyyMMddHH += "20";
			 }*/

			if(Tm >= 6 && Tm < 18){
				yyyyMMddHH += "08";
			}else if(Tm >= 18){
				yyyyMMddHH += "20";
			}else if(Tm < 6){
				yyyyMMddHH = moment(date).subtract(1,"day").toDate().format("yyyyMMdd")+"20";
			}

			var XXX = parseInt(getDiv(featureData.time));
			if (XXX < 10) {
				XXX = "00" + XXX;
			} else if (10 <= XXX && XXX < 100) {
				XXX = "0" + XXX;
			} else if (XXX >= 100) {
				XXX = "" + XXX;
			}

			var data = {"yyyyMMddHH": yyyyMMddHH, "XXX": XXX};
			fileName = npt.util.template(featureData.fileFormat, data);
		}
		//return "/" + fileName + ".2.png";
		return fileName;
	}

	//根据起报时间等参数换算文件名
	function getFileName1(date, currentTime, featureData) {
		if(Tm<6){
			var startTime = moment(date).subtract(1,"day").toDate().format("yyyyMMdd");
		}else{
			var startTime = date.format("yyyyMMdd");
		}

		//console.log(currentTime)
		if (nuTm == 8) {
			startTime += "08"
		} else if (nuTm == 20) {
			startTime += "20";
		}

		var year1 = parseInt(startTime.substring(0, 4));
		var mouth1 = parseInt(startTime.substring(4, 6));
		var day1 = parseInt(startTime.substring(6, 8));
		var hour1 = parseInt(startTime.substring(8, 10));

		var startDateTime = new Date(year1, mouth1 - 1, day1, hour1);

		var year2 = parseInt(currentTime.substring(0, 4));
		var mouth2 = parseInt(currentTime.substring(5, 7));
		var day2 = parseInt(currentTime.substring(8, 10));
		var hour2 = parseInt(currentTime.substring(11, 13));

		var currentDateTime = new Date(year2, mouth2 - 1, day2, hour2);
		var s1 = currentDateTime.getTime(), s2 = startDateTime.getTime();
		var XXX = (s1 - s2) / 1000 / 60 / 60;
		if (XXX < 10) {
			XXX = "00" + XXX;
		} else if (10 <= XXX && XXX < 100) {
			XXX = "0" + XXX;
		} else if (XXX >= 100) {
			XXX = "" + XXX;
		}

		//var XXX = "072";
		var data = {"yyyyMMddHH": startTime, "XXX": XXX};
		var fileName = npt.util.template(featureData.fileFormat, data);

		//return "/" + fileName + ".2.png";
		return fileName;
	}

	//  实况预报分界线提示
	$("#qzLine").mousemove(function () {
		$(".ybLine").css("display", "block");
	})

	$("#qzLine").mouseleave(function () {
		$(".ybLine").css("display", "none");
	})


	//点击刻度事件
	var title;

	function clickDiv(ifLayer) {
		for (i = 0; i < $(".bbb").length; i++) {
			$(".bbb").eq(i).click(function () {
				if(ifLayer){
					//判断播放按钮是否打开
					if (kolse) {
						$("#action").css("display", "block");
						$("#stop").css("display", "none")
					}
					//停止自动播放
					moveStop();

					title = $(this).attr("name");
					$("#pointer .xs").html(title + ":00");
					var indexClick2 = $(this).index();
					var indexClick1 = $(this).parent(".mellDay").index();
					// console.log(indexClick1)
					// console.log(indexClick2)
					//清除之前的样式
					$(".mellDay").removeClass("redMellDay");
					$(".bbb").removeClass("red");
					//因为$("#all")的第一个mellDay的下标是3。
					if (indexClick1 - 3 > 0) {
						//改变鼠标点击位置之前的mellDay的颜色
						for (j = 0; j <= indexClick1 - 4; j++) {
							$(".mellDay").eq(j).addClass("redMellDay");
						}
					}
					//改变当前点击.bbb的之前的颜色
					for (k = 0; k <= indexClick2; k++) {
						$(".mellDay").eq(indexClick1 - 3).find(".bbb").eq(k).addClass("red");
					}

//			            console.log(indexClick1)
//			            console.log($(".mellDay").eq(0).width())
//			            console.log($("#flexNone").length)
//			            console.log($(this))
//			            console.log($(this).index())
//			            console.log($(this).parent(".mellDay").index())
//
//			            console.log($(".mellDay").eq(0).find(".bbb").length)
//			            console.log($(".mellDay").eq(0).find("#flexNone").length)

					var oB = $(".mellDay").eq(0).find(".bbb").length;
					var oGound = $(".mellDay").eq(0).find("#flexNone").length;
					//var oWidth = $(".mellDay").eq(0).find(".bbb").eq(0).width()+1;
					var oWidth  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[0]).width)+1;

					var flexWidth = $(".mellDay").eq(0).find("#flexNone").width();
					if(indexClick1 - 3 == 0){
						if( $(this).index() < oB-oGound ){
							//console.log($(this).index()+1)
							//console.log(oWidth)
							var Line = ($(this).index()+1)*oWidth;
							spanPointer = parseInt($("#pointer").width()) / 2;
							var poLeft = Line - spanPointer + "px";
							$("#pointer").css("left", poLeft);
						}else{
							var oAll = (oB-oGound) * oWidth;
							//console.log(oB-oGound)
							var chesWc = $(this).index()+1 - (oB-oGound);
							//console.log(chesWc)
							var lastWidth = $(".mellDay").eq(0).children("div:last-child").width();
							spanPointer = parseInt($("#pointer").width()) / 2;
							var poLeft = chesWc*lastWidth + oAll - spanPointer +"px";
							$("#pointer").css("left", poLeft);
						}
					}else{
						var ches = indexClick1 - 3;
						var frist = $(".mellDay").eq(0).width();
						var second = $(".mellDay").eq(1).width();
						var last = $("#all").children(".mellDay:last-child").width();
						var small = $("#all").children(".mellDay:last-child").find(".bbb").width()+1;
						//console.log(frist);
						//console.log(last);
						//console.log(ches);
						spanPointer = parseInt($("#pointer").width()) / 2;
						var poLeft = frist + last*(ches-1) + ($(this).index()+1)*small  - spanPointer +"px";
						$("#pointer").css("left", poLeft);

						var redLen = $(".red").length;
						var parent = $(".red").parent(".mellDay").find(".bbb").length;
						//console.log(redLen == parent)
						if(redLen == parent){
							$(".red").parent(".mellDay").addClass("redMellDay");
							$(".red").removeClass("red");
							var redMell = $(".redMellDay").length;
							spanPointer = parseInt($("#pointer").width()) / 2;
							var poLeft = frist +  second*(redMell-1) - spanPointer +"px";
							$("#pointer").css("left", poLeft);
						}



					}




					var obj = $(".select span").html();
					var featureData = getCheckedFeatureData(obj);
					if (!mapClickFlag) {
						initGif(featureData, 2);
					}

					getUrl(nuTm, newDate, featureData);

					if (currentLatLng != null && mapClickFlag) {
						pickValue(currentLatLng);
					}

					weekWidth(ifLayer);
				}else{
					//判断播放按钮是否打开
					if (kolse) {
						$("#action").css("display", "block");
						$("#stop").css("display", "none")
					}
					//停止自动播放
					moveStop();

					title = $(this).attr("name");
					$("#pointer .xs").html(title + ":00");
					var indexClick2 = $(this).index();
					var indexClick1 = $(this).parent(".mellDay").index();
					// console.log(indexClick1)
					// console.log(indexClick2)
					//清除之前的样式
					$(".mellDay").removeClass("redMellDay");
					$(".bbb").removeClass("red");
					//因为$("#all")的第一个mellDay的下标是3。
					if (indexClick1 - 3 > 0) {
						//改变鼠标点击位置之前的mellDay的颜色
						for (j = 0; j <= indexClick1 - 4; j++) {
							$(".mellDay").eq(j).addClass("redMellDay");
						}
					}
					//改变当前点击.bbb的之前的颜色
					for (k = 0; k <= indexClick2; k++) {
						$(".mellDay").eq(indexClick1 - 3).find(".bbb").eq(k).addClass("red");
					}

					//console.log(indexClick1)

					//确定指针的位置  1：盒子的总长度   2:指针宽度的一半   3： mellDay盒子个数  4:.bbb盒子的个数
					if (Boolean(qel2) && Boolean(qel3)) {
						if (indexClick1 - 3 >= qel1 + qel2 - 1) {
							var smarlWidth = $(".mellDay").eq(qel3 + qel2 - 1).find(".bbb").width() + 1;
							var DivWidth1 = (indexClick1 - 3) * parseFloat($(".mellDay").width());
							var DivWidth2 = (indexClick2 + 1) * (parseFloat(smarlWidth));//+1是因为。bbb有一像素的border
							spanPointer = parseInt($("#pointer").width()) / 2;
							var poLeft = DivWidth1 + DivWidth2 - spanPointer + "px"
							$("#pointer").css("left", poLeft)


						} else if (indexClick1 - 3 >= qel1 && indexClick1 - 3 < qel1 + qel2) {
							var smarlWidth = $(".mellDay").eq(qel2 - 1).find(".bbb").width() + 1;
							var DivWidth1 = (indexClick1 - 3) * parseFloat($(".mellDay").width());
							var DivWidth2 = (indexClick2 + 1) * (parseFloat(smarlWidth));//+1是因为。bbb有一像素的border
							spanPointer = parseInt($("#pointer").width()) / 2;
							var poLeft = DivWidth1 + DivWidth2 - spanPointer + "px"
							$("#pointer").css("left", poLeft)
						} else {
							var qel1Length = $(".mellDay").eq(0).find(".bbb").length;
							var bbbFloatValue = $(".mellDay").width() / qel1Length;
							var smarlWidth = $(".mellDay").eq(0).find(".bbb").width() + 1;
							var DivWidth1 = (indexClick1 - 3) * parseFloat($(".mellDay").width());
							var DivWidth2 = (indexClick2 + 1) * (parseFloat(bbbFloatValue));  //+1是因为。bbb有一像素的border
							spanPointer = parseInt($("#pointer").width()) / 2;
							var poLeft = DivWidth1 + DivWidth2 - spanPointer + "px"
							$("#pointer").css("left", poLeft)
						}
					} else if (Boolean(qel2 && qel3 == null)) {
						if (indexClick1 - 3 >= qel1) {

							var smarlWidth = $(".mellDay").eq(qel2).find(".bbb").width() + 1;
							var DivWidth1 = (indexClick1 - 3) * parseFloat($(".mellDay").width());
							var DivWidth2 = (indexClick2 + 1) * (parseFloat(smarlWidth));//+1是因为。bbb有一像素的border
							spanPointer = parseInt($("#pointer").width()) / 2;
							var poLeft = DivWidth1 + DivWidth2 - spanPointer + "px"
							$("#pointer").css("left", poLeft)
						} else {
							var qel1Length = $(".mellDay").eq(0).find(".bbb").length;
							var bbbFloatValue = $(".mellDay").width() / qel1Length;
							var smarlWidth = $(".mellDay").eq(0).find(".bbb").width() + 1;
							var DivWidth1 = (indexClick1 - 3) * parseFloat($(".mellDay").width());
							var DivWidth2 = (indexClick2 + 1) * (parseFloat(bbbFloatValue));  //+1是因为。bbb有一像素的border
							spanPointer = parseInt($("#pointer").width()) / 2;
							var poLeft = DivWidth1 + DivWidth2 - spanPointer + "px"
							$("#pointer").css("left", poLeft)
						}
					} else {
						var DivWidth1 = (indexClick1 - 3) * parseFloat($(".mellDay").width());
						var DivWidth2 = (indexClick2 + 1) * (parseFloat($(".bbb").width() + 1));  //+1是因为。bbb有一像素的border
						// console.log(DivWidth2)
						spanPointer = parseInt($("#pointer").width()) / 2;
						var poLeft = DivWidth1 + DivWidth2 - spanPointer + "px";
						$("#pointer").css("left", poLeft);
					}
					//getUrl(nuTm,newDate);
					//var path = "http://127.0.0.1:8080/fsol/rrh_05/2017022108.024.1.png";

					var obj = $(".select span").html();
					var featureData = getCheckedFeatureData(obj);
					if (!mapClickFlag) {
						initGif(featureData, 2);
					}

					getUrl(nuTm, newDate, featureData);

					if (currentLatLng != null && mapClickFlag) {
						pickValue(currentLatLng);
					}

					weekWidth(ifLayer);
				}



			})
		}
	}

	// 直接修改$("#pointer").html来显示   注意： 不通过位置坐标进行判断 以造成误差。
	function weekWidth(ifLayer) {
		//console.log(ifLayer)
		getDivIndex();
		var redOne = $(".redMellDay").length;   //红色大div的个数
		if (redOne == $(".mellDay").length) {
			redOne -= 1;
		}

		if(ifLayer){
			var redplace = parseInt($("#pointer").css("left"))+$("#pointer").width()/2-5;
			var messDay = $(".messDay").width()+1;
			var num = parseInt(redplace/messDay);
			//console.log(redplace)
			//console.log(messDay)
			//console.log(num)
			var weekS = $(".messDay").eq(num).html();					//获取显示内容；
			var dayS = $(".messDay").eq(num).find(".dayName").html();	//获取显示内容；
			var str1 = weekS.substring(0, 2);	//截取
			var str2 = dayS.substring(6, 9); //截取
			// console.log(str1)
			$("#pointer b").html(str1);
			$("#pointer p").html(str2);

		}else{
			var redTwo = $(".red").length;			//红色小div的个数
			var mellDayWidth = $(".mellDay").width();  //红色大div的宽度
			var messDayWidth = $(".messDay").width() + 1;  //标注栏目div的宽度
			var bbbwidth = $(".mellDay").eq(0).find(".bbb").width() + 1; //红色小div的宽度
			var bbQel1Length = $(".mellDay").eq(0).find(".bbb").length;
			var bbQel2Width = $(".mellDay").eq(qel2).find(".bbb").width() + 1;
			var bbQel2Length = $(".mellDay").eq(qel2).find(".bbb").length;
			var allLeft = parseFloat($("#all").css("left"));
			var qel1Num = bbQel1Length * qel1;
			if (Boolean(qel2)) {
				if (redOne >= qel1) {
					var numMessDay = parseInt((mellDayWidth * redOne + bbQel2Width * redTwo + allLeft) / messDayWidth);
					var weekS = $(".messDay").eq(numMessDay).html();					//获取显示内容；
					var dayS = $(".messDay").eq(numMessDay).find(".dayName").html();	//获取显示内容；
					var str1 = weekS.substring(0, 2);	//截取
					var str2 = dayS.substring(6, 9); //截取
					// console.log(str1)
					$("#pointer b").html(str1);
					$("#pointer p").html(str2);
				} else {
					var numMessDay = parseInt((mellDayWidth * redOne + bbbwidth * redTwo + allLeft) / messDayWidth);
					var weekS = $(".messDay").eq(numMessDay).html();					//获取显示内容；
					var dayS = $(".messDay").eq(numMessDay).find(".dayName").html();	//获取显示内容；
					var str1 = weekS.substring(0, 2);	//截取
					var str2 = dayS.substring(6, 9); //截取
					// console.log(str1)
					$("#pointer b").html(str1);
					$("#pointer p").html(str2);
				}
			} else {
				//得到红色条末端的时候在第几个messDay范围内  直接读取 那个messDay里面的 week 与 day  不再做位置坐标判断。
				var numMessDay = parseInt((mellDayWidth * redOne + bbbwidth * redTwo + allLeft) / messDayWidth);
				var weekS = $(".messDay").eq(numMessDay).html();					//获取显示内容；
				var dayS = $(".messDay").eq(numMessDay).find(".dayName").html();	//获取显示内容；
				var str1 = weekS.substring(0, 2);	//截取
				var str2 = dayS.substring(6, 9); //截取
				// console.log(str1)
				$("#pointer b").html(str1);
				$("#pointer p").html(str2);
			}
		}



	}

	//开始自动播放
	$("#action").click(function () {
		kolse = true;
		$(this).toggle();
		$("#stop").toggle();
		timeMove(ifLayer);
	})

	// 点击上一个的时候 如果当前正在进行播放事件  切换播放暂停按钮
	if (kolse) {
		$("#action").css("display", "block");
		$("#stop").css("display", "none");
	}
	kolse = false;

	// 自动播放函数：
	function timeMove(ifLayer) {
		time = setInterval(function () {
			go(ifLayer); 			//下一个运动函数
			weekWidth(ifLayer);  	//更新时间
		}, 1500)
	}

	//暂停自动播放
	$("#stop").click(function () {
		kolse = false;
		$(this).toggle();
		$("#action").toggle();
		moveStop();
	})


	// //鼠标拖拽事件
	$("#pointer").mousedown(function (e) {
		var mouseClear = true;
		var xLiness;
		var lineMax;
		var lineMin;
		var ches = ($("html").width() - $("footer").width()) / 2;
		//阻止默认事件
		stopDef(e);
		//停止自动播放
		moveStop();
		//判断播放按钮是否打开
		if (kolse) {
			$("#action").css("display", "block");
			$("#stop").css("display", "none");
		}


		$("body").mousemove(function () {

			if (mouseClear) {
				var theEvent = window.event || arguments.callee.caller.arguments[0];
				var mX = theEvent.pageX ? theEvent.pageX : theEvent.x;
				//console.log(mX)
				xLiness = mX - ches - $("#pointer").width() / 2;
				lineMax = lineAll;
				lineMin = ches;

				if(ifLayer){
					if (Boolean(qel2) && !Boolean(qel3)) {
						//var redWd =parseFloat(document.defaultView.getComputedStyle($(".red")[0]).width)+1;

						var oLine = xLiness + $("#pointer").width()/2;
						var allLine = $("#all").width();
						var oPinter = $("#pointer").width();
						var first = $(".mellDay").eq(0).width()+1;

						//var firstSmall = $(".mellDay").eq(0).find(".bbb").width()+1;
						//var firstSmall = parseFloat(document.defaultView.getComputedStyle($(".mellDay").eq(0).find(".bbb")[0]).width)+1;
						var firstSmall  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[0]).width)+1;

						//var lastSmall = $(".mellDay").eq(0).children("div:last-child").width()+1;
						//第一个mellDay的最后一个在一小时的当中与第一个相同
						//var lastSmall = $(".mellDay").eq(0).children("div:last-child").width()+1;
						var lastSmall  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[0]).width)+1;

						//var lastSmall = parseFloat(document.defaultView.getComputedStyle($(".mellDay").eq(0).children("div:last-child")).width)+1;
						var second = $(".mellDay").eq(1).width();
						//最后一个div的width  它与第二个mellDay的第一个bbb相同
						var lastIndex=$("#all").find(".bbb").length;
						var secondSmall  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[lastIndex-1]).width)+1;

						//var secondSmall = $(".mellDay").eq(1).find(".bbb").width()+1;
						//第一个预报的小标
						var nomal = $(".mellDay").eq(0).find(".nomal").index();
						//var nomalwidth = $(".mellDay").eq(0).find(".nomal").width()+1;
						var nomalwidth  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[0]).width)+1;

						//var nomalwidth = parseFloat(document.defaultView.getComputedStyle($(".mellDay").eq(0).find(".nomal")).width)+1;
						//console.log(xLiness + $("#pointer").width() / 2+"-------------------------")

						if(oLine < 0){
							oLine = 0;
						}else if(oLine > allLine){
							oLine = allLine;
						}
						//console.log(oLine)

						$(".redMellDay").removeClass("redMellDay");
						$(".red").removeClass("red");

						if( oLine <= first){
							// 分为三种情况
							var o1 = nomal*firstSmall; //实况的长度
							var o2 = o1+nomalwidth;//第一个预报的长度
							//console.log(oLine)
							if(oLine >= o2 && oLine <= first){
								var len = parseInt((oLine - o2)/lastSmall);
								var lens = len+nomal+1;
								for(i=0;i<lens;i++){
									$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
								}

								if( $(".mellDay").eq(0).find(".bbb").length == $(".mellDay").eq(0).find(".red").length ){
									$(".mellDay").eq(0).find(".bbb").removeClass("red");
									$(".mellDay").eq(0).addClass("redMellDay");
								}

								//var point = o2 + len*lastSmall - oPinter/2 +"px";
								var point = lens*lastSmall - oPinter/2 +"px";

								$("#pointer").css("left",point);

							}else if( o1< oLine && oLine <= o2){
								for(i=0;i<nomal+1+1;i++){
									$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
								}

								var point = o2 + nomalwidth - oPinter/2 +"px";
								$("#pointer").css("left",point);

							}else if( 0 <= oLine && oLine <= o1){
								var len = oLine/firstSmall;
								for(i=0;i<len+1;i++){
									$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
								}

								if(0<= oLine && oLine<= firstSmall){
									$(".mellDay").eq(0).find(".bbb").eq(0).addClass("red");
								}
								var red = $(".red").length;
								var point = red*firstSmall - oPinter/2 +"px";
								$("#pointer").css("left",point);

							}
							var reds = $(".red").length;
							var hours = $(".red").eq(reds-1).attr("name")+":00";

							if(reds == 0){
								var bigRedLength = $(".redMellDay").length;
								var noWell = $(".redMellDay").eq(bigRedLength-1).find(".bbb").length;
								var hours = $(".redMellDay").eq(bigRedLength-1).find(".bbb").eq(noWell-1).attr("name") + ":00";
							}
							$("#pointer .xs").html(hours);


						}else{
							var len = parseInt( (oLine - first)/second );   // redMellDay
							var lenSmall = ((oLine - first)%second)/secondSmall;  //red

							for(i=0;i<len+1;i++){
								$(".mellDay").eq(i).addClass("redMellDay");
							}

							for(i=0;i<lenSmall;i++){
								$(".mellDay").eq(len+1).find(".bbb").eq(i).addClass("red");
							}

							var redMell = $(".redMellDay").length;
							var reds = $(".red").length;
							var point = first + (redMell-1)*second + reds*secondSmall - oPinter/2 +"px";
							$("#pointer").css("left",point)
							var hours = $(".red").eq(reds-1).attr("name")+":00";

							if(reds == 0){
								var bigRedLength = $(".redMellDay").length;
								var noWell = $(".redMellDay").eq(bigRedLength-1).find(".bbb").length;
								var hours = $(".redMellDay").eq(bigRedLength-1).find(".bbb").eq(noWell-1).attr("name") + ":00";
							}
							$("#pointer .xs").html(hours);

						}
					} else if (Boolean(qel3)) {


					} else {
						//var redWd =parseFloat(document.defaultView.getComputedStyle($(".red")[0]).width)+1;

						var oLine = xLiness + $("#pointer").width()/2;
						var allLine = $("#all").width();
						var oPinter = $("#pointer").width();
						var first = $(".mellDay").eq(0).width()+1;

						//var firstSmall = $(".mellDay").eq(0).find(".bbb").width()+1;
						//var firstSmall = parseFloat(document.defaultView.getComputedStyle($(".mellDay").eq(0).find(".bbb")[0]).width)+1;
						var firstSmall  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[0]).width)+1;

						//var lastSmall = $(".mellDay").eq(0).children("div:last-child").width()+1;
						//第一个mellDay的最后一个在一小时的当中与第一个相同
						//var lastSmall = $(".mellDay").eq(0).children("div:last-child").width()+1;
						var lastSmall  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[0]).width)+1;

						//var lastSmall = parseFloat(document.defaultView.getComputedStyle($(".mellDay").eq(0).children("div:last-child")).width)+1;
						var second = $(".mellDay").eq(1).width();
						//最后一个div的width  它与第二个mellDay的第一个bbb相同
						var lastIndex=$("#all").find(".bbb").length;
						var secondSmall  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[lastIndex-1]).width)+1;

						//var secondSmall = $(".mellDay").eq(1).find(".bbb").width()+1;
						//第一个预报的小标
						var nomal = $(".mellDay").eq(0).find(".nomal").index();
						//var nomalwidth = $(".mellDay").eq(0).find(".nomal").width()+1;
						var firstNomal;
						if(Tm<6){
							if(liveTm==23){
								firstNomal=24;
							}else{
								firstNomal=liveTm+1+24;
							}
						}else if(Tm>=6&&Tm<18){
							firstNomal=liveTm+1;
						}else{
							firstNomal=liveTm+1;
						}
						//第一个预报的宽度
						var nomalwidth  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[firstNomal]).width)+1;

						//var nomalwidth = parseFloat(document.defaultView.getComputedStyle($(".mellDay").eq(0).find(".nomal")).width)+1;
						//console.log(xLiness + $("#pointer").width() / 2+"-------------------------")

						if(oLine < 0){
							oLine = 0;
						}else if(oLine > allLine){
							oLine = allLine;
						}
						//console.log(oLine)

						$(".redMellDay").removeClass("redMellDay");
						$(".red").removeClass("red");

						var o1 = nomal*firstSmall; //实况的长度
						var o2 = o1+nomalwidth;//第一个预报的长度
						if(oLine <= first){
							if(oLine<=o1&&oLine>=0){
								//表示在实况的范围内拖拽
								var len = Math.floor(oLine/firstSmall);
								for(i=0;i<len;i++){
									$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
								}

								if(0<= oLine && oLine<= firstSmall){
									$(".mellDay").eq(0).find(".bbb").eq(0).addClass("red");
								}
								var red = $(".red").length;
								var point = red*firstSmall - oPinter/2 +"px";
								$("#pointer").css("left",point);
							}else if( o1< oLine && oLine <= o2){
								//第一个预报
								for(i=0;i<nomal+1;i++){
									$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
								}

								var point = o1 + nomalwidth - oPinter/2 +"px";
								$("#pointer").css("left",point);
							}else{
								var len = Math.ceil((oLine - o2)/secondSmall);
								var lens = len+nomal+1;
								for(i=0;i<lens;i++){
									$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
								}

								if( $(".mellDay").eq(0).find(".bbb").length == $(".mellDay").eq(0).find(".red").length ){
									$(".mellDay").eq(0).find(".bbb").removeClass("red");
									$(".mellDay").eq(0).addClass("redMellDay");
								}

								//var point = o2 + len*lastSmall - oPinter/2 +"px";
								var point = len*secondSmall+o2 - oPinter/2 +"px";

								$("#pointer").css("left",point);
							}
						}else{
							var len = parseInt( (oLine - first)/second );   // redMellDay
							var lenSmall = ((oLine - first)%second)/secondSmall;  //red

							for(i=0;i<len+1;i++){
								$(".mellDay").eq(i).addClass("redMellDay");
							}

							for(i=0;i<lenSmall;i++){
								$(".mellDay").eq(len+1).find(".bbb").eq(i).addClass("red");
							}

							var redMell = $(".redMellDay").length;
							var reds = $(".red").length;
							var point = first + (redMell-1)*second + reds*secondSmall - oPinter/2 +"px";
							$("#pointer").css("left",point)
							var hours = $(".red").eq(reds-1).attr("name")+":00";

							if(reds == 0){
								var bigRedLength = $(".redMellDay").length;
								var noWell = $(".redMellDay").eq(bigRedLength-1).find(".bbb").length;
								var hours = $(".redMellDay").eq(bigRedLength-1).find(".bbb").eq(noWell-1).attr("name") + ":00";
							}
							$("#pointer .xs").html(hours);
						}

						var reds = $(".red").length;
						var hours = $(".red").eq(reds-1).attr("name")+":00";

						if(reds == 0){
							var bigRedLength = $(".redMellDay").length;
							var noWell = $(".redMellDay").eq(bigRedLength-1).find(".bbb").length;
							var hours = $(".redMellDay").eq(bigRedLength-1).find(".bbb").eq(noWell-1).attr("name") + ":00";
						}
						$("#pointer .xs").html(hours);
						//if( oLine <= first){
						//	// 分为三种情况
						//
						//	//console.log(oLine)
						//	if(oLine >= o2 && oLine <= first){
						//		var len = parseInt((oLine - o2)/lastSmall);
						//		var lens = len+nomal+1;
						//		for(i=0;i<lens;i++){
						//			$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
						//		}
						//
						//		if( $(".mellDay").eq(0).find(".bbb").length == $(".mellDay").eq(0).find(".red").length ){
						//			$(".mellDay").eq(0).find(".bbb").removeClass("red");
						//			$(".mellDay").eq(0).addClass("redMellDay");
						//		}
						//
						//		//var point = o2 + len*lastSmall - oPinter/2 +"px";
						//		var point = lens*secondSmall - oPinter/2 +"px";
						//
						//		$("#pointer").css("left",point);
						//
						//	}else if( o1< oLine && oLine <= o2){
						//		//第一个预报
						//for(i=0;i<nomal+1;i++){
						//	$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
						//}
						//
						//var point = o1 + nomalwidth - oPinter/2 +"px";
						//$("#pointer").css("left",point);
						//
						//		}else if( 0 <= oLine && oLine <= o1){
						//			//表示第一个预报
						//			var len = oLine/firstSmall;
						//			for(i=0;i<len+1;i++){
						//				$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
						//			}
						//
						//			if(0<= oLine && oLine<= firstSmall){
						//				$(".mellDay").eq(0).find(".bbb").eq(0).addClass("red");
						//			}
						//			var red = $(".red").length;
						//			var point = red*firstSmall - oPinter/2 +"px";
						//			$("#pointer").css("left",point);
						//
						//		}
						//		var reds = $(".red").length;
						//		var hours = $(".red").eq(reds-1).attr("name")+":00";
						//
						//		if(reds == 0){
						//			var bigRedLength = $(".redMellDay").length;
						//			var noWell = $(".redMellDay").eq(bigRedLength-1).find(".bbb").length;
						//			var hours = $(".redMellDay").eq(bigRedLength-1).find(".bbb").eq(noWell-1).attr("name") + ":00";
						//		}
						//		$("#pointer .xs").html(hours);
						//
						//
						//	}else{
						//		var len = parseInt( (oLine - first)/second );   // redMellDay
						//		var lenSmall = ((oLine - first)%second)/secondSmall;  //red
						//
						//		for(i=0;i<len+1;i++){
						//			$(".mellDay").eq(i).addClass("redMellDay");
						//		}
						//
						//		for(i=0;i<lenSmall;i++){
						//			$(".mellDay").eq(len+1).find(".bbb").eq(i).addClass("red");
						//		}
						//
						//		var redMell = $(".redMellDay").length;
						//		var reds = $(".red").length;
						//		var point = first + (redMell-1)*second + reds*secondSmall - oPinter/2 +"px";
						//		$("#pointer").css("left",point)
						//		var hours = $(".red").eq(reds-1).attr("name")+":00";
						//
						//		if(reds == 0){
						//			var bigRedLength = $(".redMellDay").length;
						//			var noWell = $(".redMellDay").eq(bigRedLength-1).find(".bbb").length;
						//			var hours = $(".redMellDay").eq(bigRedLength-1).find(".bbb").eq(noWell-1).attr("name") + ":00";
						//		}
						//		$("#pointer .xs").html(hours);
						//
						//	}
					}


				}else{
					var mellWidth = $(".mellDay").width();
					var bbbWidth = $(".mellDay").eq(0).find(".bbb").width() + 1;
					var bbbQelWidth = $(".mellDay").eq(qel1).find(".bbb").width() + 1;
					var bbbQelWidth3 = $(".mellDay").eq(qel1+qel2-1).find(".bbb").width() + 1;
					var Wd = $(".mellDay").width() / 24;
					var LoneOne = (Wd * 8);
					var LoneTwo = (Wd * 20);
					var LineOne = (Wd * 15.5);
					var LineTwo = (Wd * 3.5);


					if (Tm >= 8 && Tm <= 20) {
						if (xLiness <= 0) {
							xLiness = 0;
						} else if (xLiness >= lineMax) {
							xLiness = lineMax - 5;
						}
					} else {
						if (xLiness <= 0) {
							xLiness = 0;
						} else if (xLiness >= lineMax) {
							xLiness = lineMax - 5;
						}
					}
					xPointer = xLiness - spanPointer;

					xLinesspv = xLiness + parseFloat($("#all").css("left"));
					var teTime = xLinesspv % lineDay / lineHours;
					var teWeek = parseInt(xLinesspv / (lineAll / Divs) + newDate.getDay());
					var sow = document.getElementById("pointer b");
					bWeek(teWeek);
					$(".xs").html(parseInt(teTime) + ":00");
					var p = document.getElementsByClassName("pDay")[0];
					var numDay = newDate.getDate() + parseInt(xLinesspv / (lineAll / Divs));
					if (xLinesspv <= lineAll / Divs) {
						numDay = newDate.getDate();
					}
					DateCruer(p, numDay);

					// console.log(parseInt($("#pointer").css("left")))
					$(".mellDay").removeClass("redMellDay");
					$(".bbb").removeClass("red");
					if(Boolean(qel3)){
						var a = xLiness;
						var redBnum = parseInt(a / mellWidth);
						if (redBnum >= qel1+qel2-1) {
							var redSnum = parseInt((a % mellWidth) / bbbQelWidth3);
							for (i = 0; i <= redBnum - 1; i++) {
								$(".mellDay").eq(i).addClass("redMellDay");
							}
							for (i = 0; i <= redSnum; i++) {
								$(".mellDay").eq(redBnum).find(".bbb").eq(i).addClass("red");
							}
							var title = $(".mellDay").eq(redBnum).find(".red").last().attr("name");
							$("#pointer .xs").html(title + ":00");
							var weizhi = redBnum * mellWidth + (redSnum + 1) * bbbQelWidth3 - spanPointer;
							$("#pointer").css("left", weizhi);

						}else if(redBnum >= qel1){
							var redSnum = parseInt((a % mellWidth) / bbbQelWidth);
							for (i = 0; i <= redBnum - 1; i++) {
								$(".mellDay").eq(i).addClass("redMellDay");
							}
							for (i = 0; i <= redSnum; i++) {
								$(".mellDay").eq(redBnum).find(".bbb").eq(i).addClass("red");
							}
							var title = $(".mellDay").eq(redBnum).find(".red").last().attr("name");
							$("#pointer .xs").html(title + ":00");
							var weizhi = redBnum * mellWidth + (redSnum + 1) * bbbQelWidth - spanPointer;
							$("#pointer").css("left", weizhi);

						} else {
							var redSnum = parseInt((a % mellWidth) / bbbWidth);
							for (i = 0; i <= redBnum - 1; i++) {
								$(".mellDay").eq(i).addClass("redMellDay");
							}
							for (i = 0; i <= redSnum; i++) {
								$(".mellDay").eq(redBnum).find(".bbb").eq(i).addClass("red");
							}
							var title = $(".mellDay").eq(redBnum).find(".red").last().attr("name");
							$("#pointer .xs").html(title + ":00");
							var weizhi = redBnum * mellWidth + (redSnum + 1) * bbbWidth - spanPointer;
							$("#pointer").css("left", weizhi);

						}
					}else if (Boolean(qel2)&&Boolean(qel3)) {
						var a = xLiness;
						var redBnum = parseInt(a / mellWidth);
						if (redBnum >= qel1) {
							var redSnum = parseInt((a % mellWidth) / bbbQelWidth);
							for (i = 0; i <= redBnum - 1; i++) {
								$(".mellDay").eq(i).addClass("redMellDay");
							}
							for (i = 0; i <= redSnum; i++) {
								$(".mellDay").eq(redBnum).find(".bbb").eq(i).addClass("red");
							}
							var title = $(".mellDay").eq(redBnum).find(".red").last().attr("name");
							$("#pointer .xs").html(title + ":00");
							var weizhi = redBnum * mellWidth + (redSnum + 1) * bbbQelWidth - spanPointer;
							$("#pointer").css("left", weizhi);

						} else {
							var redSnum = parseInt((a % mellWidth) / bbbWidth);
							for (i = 0; i <= redBnum - 1; i++) {
								$(".mellDay").eq(i).addClass("redMellDay");
							}
							for (i = 0; i <= redSnum; i++) {
								$(".mellDay").eq(redBnum).find(".bbb").eq(i).addClass("red");
							}
							var title = $(".mellDay").eq(redBnum).find(".red").last().attr("name");
							$("#pointer .xs").html(title + ":00");
							var weizhi = redBnum * mellWidth + (redSnum + 1) * bbbWidth - spanPointer;
							$("#pointer").css("left", weizhi);

						}
					} else {
						var a = xLiness;
						var redBnum = parseInt(a / mellWidth);
						var redSnum = parseInt((a % mellWidth) / bbbWidth);
						// console.log(redBnum)
						// console.log(redSnum)
						for (i = 0; i <= redBnum - 1; i++) {
							$(".mellDay").eq(i).addClass("redMellDay");
						}
						for (i = 0; i <= redSnum; i++) {
							$(".mellDay").eq(redBnum).find(".bbb").eq(i).addClass("red");
						}
						var title = $(".mellDay").eq(redBnum).find(".red").last().attr("name");
						$("#pointer .xs").html(title + ":00");
						var weizhi = redBnum * mellWidth + (redSnum + 1) * bbbWidth - spanPointer;
						$("#pointer").css("left", weizhi);
					}
				}

				weekWidth(ifLayer);
			}
		});

		$("body").mouseup(function () {
			mouseClear = false;

			var obj = $(".select span").html();
			var featureData = getCheckedFeatureData(obj);
			getUrl(nuTm, startTime, featureData);

			//var url = path +getfile($(".select span").html()) + getUrl(nuTm,startTime);
			/*var fileName = getFileName(nuTm, startTime, featureData);
			 var url =  path + featureData.relativepath + "/" + fileName + ".2.png";

			 if(currentLayer == null){
			 var errorTileUrl="images/empty.png";
			 var mapOptions = {title: "", opacity:0.8, fadeAnimation: false, bounds:[[0.0,70.0],[60.0,140.0]], assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
			 currentLayer = new shell.MeteoLayer({url: url, styleKey: featureData.style, nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions});

			 if(currentLayer){
			 currentLayer.addTo(map);
			 currentLayer.on('layerAdded', function (layer) {
			 console.log('layerAdded');
			 var drawStyle = layer.drawStyle;
			 if (drawStyle.paletteEntries) {
			 shell.application.paletteBar.update(drawStyle.paletteEntries);
			 }
			 shell.application.paletteBar.show();
			 });
			 }

			 if(shell.application.currentLayer!=undefined){
			 var layer = shell.application.currentLayer;
			 map.removeLayer(layer);
			 }
			 var vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
			 var vectorTileLayer = new shell.MeteoLayer({layerType:"VectorTile",styleKey:featureData.style,url:[vectorUrl,""]});
			 //vectorTileLayer.nodeInfo = obj;
			 vectorTileLayer.addTo(map);

			 }else{
			 currentLayer.layers.origin.layer.setOpacity(0);
			 if(featureData.imageLayerVisible == true){
			 currentLayer.layers.origin.layer.setUrl(url);
			 currentLayer.layers.origin.layer.setOpacity(0.8);
			 }
			 var palettesUrl = 'palettes/'+featureData.palettes+'.xml?v=1.0.8';
			 var req = new XMLHttpRequest();
			 req.open('GET', palettesUrl);
			 req.onload = function() {
			 if (req.status == 200) {
			 var data = req.responseText;
			 var paletteEntries = [];
			 $(data).find('entry').each(function(index, ele) {
			 // console.log($(ele).attr('value'));
			 var value = parseFloat($(ele).attr('value'));
			 var color = $(ele).attr('rgba');
			 paletteEntries.push({
			 value: value,
			 color: color
			 });


			 });

			 paletteEntries.palettetype="fix"
			 shell.application.paletteBar.update(paletteEntries);
			 shell.application.paletteBar.show();
			 } else {
			 console.log('getStyle file error!');
			 return;
			 }
			 };
			 req.send();

			 if(shell.application.currentLayer!=undefined){
			 var layer = shell.application.currentLayer;
			 map.removeLayer(layer);
			 }
			 var vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
			 var vectorTileLayer = new shell.MeteoLayer({layerType:"VectorTile",styleKey:featureData.style,url:[vectorUrl,""]});
			 //vectorTileLayer.nodeInfo = obj;
			 vectorTileLayer.addTo(map);
			 }*/

			if (currentLatLng != null && mapClickFlag && yxMapClick) {
				pickValue(currentLatLng);
			}
			/*if(currentLayer == null){
			 var errorTileUrl="images/empty.png";
			 var mapOptions = {title: "", opacity:0.8, fadeAnimation: false, bounds:[[0.0,70.0],[60.0,140.0]], assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
			 currentLayer = new shell.MeteoLayer({url: url, styleKey: "test4", nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions});
			 currentLayer.addTo(map);
			 }else{
			 currentLayer.layers.origin.layer.setUrl(url);
			 }*/
			//var path = "http://127.0.0.1:8080/fsol"+url;
			//imageOverlay.setUrl(url);
			//console.log(url);
		});
	});

	// 鼠标离开时间轴隐藏时间信息
	$(".lineMv").mouseleave(function () {
		$("#time").css("display", "none");
	});


	// 前一个 （点击事件）
	$("#back").click(function () {

		//console.log(ifLayer)
		//停止自动播放
		moveStop();
		Back(ifLayer);
		weekWidth(ifLayer);
	})

	//后一个
	$("#go").click(function () {

		// 点击上一个的时候 如果当前正在进行播放事件  切换播放暂停按钮
		if (kolse) {
			$("#action").css("display", "block");
			$("#stop").css("display", "none")
		}
		kolse = false;
		//停止自动播放
		moveStop();
		go(ifLayer);
		weekWidth(ifLayer);
	})

	if(isMobile()){
		oDiv2.addEventListener('touchstart', thismousedown);
		oDiv2.addEventListener('touchend', thismouseup);
		oDiv2.addEventListener('touchmove', thismousemove);
	}else{
		oDiv2.addEventListener('mousedown', thismousedown);
		var bodyMouse=document.getElementsByTagName("body")[0];
		oDiv2.addEventListener('mouseup', thismouseup);
		oDiv2.addEventListener('mousemove', thismousemove);
	}
	//oDiv2.addEventListener('touchstart', thismousedown);
	//oDiv2.addEventListener('touchend', thismouseup);
	//oDiv2.addEventListener('touchmove', thismousemove);
	//oDiv2.addEventListener('mousedown', thismousedown);
	//var bodyMouse=document.getElementsByTagName("body")[0];
	//oDiv2.addEventListener('mouseup', thismouseup);
	//oDiv2.addEventListener('mousemove', thismousemove);

	// 每一次切换数据  初始化 时间轴起始位置
	function init() {
		$("#scorlSep").css("left", 80);
		$("#parst").css("left", 0);
		$("#inp").css("left", 45);
		//console.log(hel1)
		if (hel1 <= 24 && hel1 >= 6) {
			ten = 6;
		} else if (hel1 < 6 && hel1 >= 3) {
			if(ifLayer){
				ten=20;
			}else{
				ten=12
			}
			//ten = 12;
		} else if (hel1 < 3 && hel1 >= 1) {
			ten = 30;
		}

	}

	// centerPointer
	//执行顺序： 待动态完成.hours之后执行。
	function centerPointer(ifLayer) {

		if(ifLayer){
			var parstLeft = 0 - $(".hours").width() + "px";
			if (Boolean(qel2) && !Boolean(qel3)) {
				if(Tm<6){
					var temp=liveTm
					if(liveTm==23){
						temp=-1;
					}
					$("#parst").css("left", parseInt(parstLeft)*(24+temp+1)-10+"px");
				}else{
					$("#parst").css("left", parseInt(parstLeft)*(liveTm+1)-10+"px");
				}

			}else if (Boolean(qel3)) {


			} else {
				var a;var b;var c;
				a = (45 - (liveTm+1)) % hel1;
				b = Math.ceil((45 - (liveTm+1)) / hel1);
				if(a == 0){
					c = hel1*ten/2;
				}else{
					c = a*ten/2;
				}
				if(Tm>=6&&Tm<18){

					$("#parst").css("left", parseInt(parstLeft)*(liveTm+1)-c+"px");
				}else if(Tm<6){
					var tmpTm=liveTm;
					if(liveTm==23){
						a = (45 - (24+tmpTm+1)) % hel1;
						b = Math.ceil((45 - (24+tmpTm+1)) / hel1);
						if(a == 0){
							c = hel1*ten/2;
						}else{
							c = a*ten/2;
						}
						$("#parst").css("left", parseInt(parstLeft)*24-c+"px");
					}else{
						$("#parst").css("left",  parseInt(parstLeft)*(liveTm+1+24)-c+"px");
					}

				}else{
					$("#parst").css("left",  parseInt(parstLeft)*(liveTm+1)-c+"px");
				}

			}


		}else{
			if (Boolean(qel2) && !Boolean(qel3)) {
				var parstLeft = 0 - $(".hours").width() / 2- (hel1*ten-hel1 * ten/2) + "px";
				if((nuTm+hel1)>24){
					parstLeft = 0 - $(".hours").width() / 2- ((nuTm+hel1-24)*ten-hel1 * ten/2) + "px";
				}else{
					parstLeft = 0 - $(".hours").width() / 2- ((nuTm+hel1)*ten-hel1 * ten/2) + "px";
				}
				$("#parst").css("left", parstLeft);
			}else if (Boolean(qel3)) {
				var parstLeft = 0 - $(".hours").width() / 2- (hel1*ten-hel1 * ten/2) + "px";
				if((nuTm+hel1)>24){
					parstLeft = 0 - $(".hours").width() / 2- ((nuTm+hel1-24)*ten-hel1 * ten/2) + "px";
				}else{
					parstLeft = 0 - $(".hours").width() / 2- ((nuTm+hel1)*ten-hel1 * ten/2) + "px";
				}
				$("#parst").css("left", parstLeft);

			} else {
				var parstLeft = 0 - $(".hours").width() / 2- (hel1*ten-hel1 * ten/2) + "px";
				if((nuTm+hel1)>24){
					parstLeft = 0 - $(".hours").width() / 2- ((nuTm+hel1-24)*ten-hel1 * ten/2) + "px";
				}else{
					parstLeft = 0 - $(".hours").width() / 2- ((nuTm+hel1)*ten-hel1 * ten/2) + "px";
				}
				$("#parst").css("left", parstLeft);
			}
		}

	}



	function chartJS() {
		var mobile = isMobile();
		if (mobile) {
			$("#echartss").css("height", "210px");
		}
	}

//移动端的title样式
	if (isMobile()) {
		$(".main_title1").attr("style", "width:100%;position: absolute;top: 50px;left:0;z-index: 999;")

		$(".main_title").attr("style", "padding-left:5px;padding-right:5px;border-radius:5px;width:130px;line-height: 20px;font-size: 16px;text-align: center;color:#fff;background: rgba(51, 51, 51, 0.3);margin:0 auto;")

	} else {
		$(".main_title").attr("style", "padding-left:15px;padding-right:15px;border-radius:20px;width:250px;line-height: 40px;font-size:30px;text-align: center;color:#fff;background: rgba(51, 51, 51, 0.3);margin:0 auto;")

	}
	//  return   false  or  ture   进行判断是否是移动端还是PC端
	function isMobile() {
		var sUserAgent = navigator.userAgent.toLowerCase(),
			bIsIpad = sUserAgent.match(/ipad/i) == "ipad",
			bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os",
			bIsMidp = sUserAgent.match(/midp/i) == "midp",
			bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4",
			bIsUc = sUserAgent.match(/ucweb/i) == "ucweb",
			bIsAndroid = sUserAgent.match(/android/i) == "android",
			bIsCE = sUserAgent.match(/windows ce/i) == "windows ce",
			bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile",
			bIsWebview = sUserAgent.match(/webview/i) == "webview";
		return (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM);
	}

	// 动态创建li
	function creatLi(ifLayer) {
		//console.log(qel1)
		//console.log(qel2)
		//console.log(hel1)
		var contUl = document.getElementById("parst");

		//for (i = 0; i < dayes - 1; i++) {
		//	var contLi = document.createElement("li");
		//	contLi.className = "days";
		//	contUl.appendChild(contLi)
		//}
		//console.log($("#parst").width());
		if(ifLayer) {
			for (i = 0; i < dayes - 1; i++) {
				var contLi = document.createElement("li");
				contLi.className = "days";
				contUl.appendChild(contLi)
			}
			var ds = ($("#dayZet").width() / $("#dayZet li").length);
			//var ds = 1440;

			var Wd = ds / 24;
			var key;
			if (Tm >= 6 && Tm < 18) {
				key=liveTm+1;
				var lengthMS = $(".days").length;
				$("#parst").css("width", ds * (lengthMS - 1) + Wd * 9);
				//$(".days").eq(lengthMS - 1).remove();

				var oDiv = document.getElementsByClassName("days")[0];
				oDiv.style.width = (ds + Wd * 9) + "px";

				if (Boolean(qel2) && !Boolean(qel3)) {
					for (i = 0; i < qel1 + qel2; i++) {
						var days = document.getElementsByClassName("days")[i];

						var a = (33 - (liveTm+1)) % hel1;
						var b = Math.ceil((33 - (liveTm+1)) / hel1);
						var len = (liveTm+1) + b;
						var c;
						if(i == 0){
							var g;
							for (j = 0; j < len; j++) {
								if(j <= liveTm ){
									var aaa = document.createElement("div");

									aaa.style.width = 20 + "px";
									aaa.className = "hours";
									aaa.setAttribute("name", j);
									aaa.innerHTML = j % 24;
									days.appendChild(aaa);
								}else if(j == liveTm +1){
									var aaa = document.createElement("div");
									//if(a == 0){
									//   c = a + hel1;
									//}else{
									//   c = a;
									//}
									g = liveTm+1;
									//aaa.className = "bbb nomal";
									//var name = g%24;
									//aaa.setAttribute("name",name);

									aaa.style.width =20+ "px";
									aaa.className = "hours nomal";
									aaa.setAttribute("id", "flexNone");
									aaa.setAttribute("name", liveTm +1);
									aaa.innerHTML = (liveTm +1)%24;
									days.appendChild(aaa);
								}else{

									var aaa = document.createElement("div");
									//aaa.style.width = (Wd-0.3) * hel1 + "px";
									aaa.className = "bbb";
									//aaa.setAttribute("id","flexNone");

									aaa.style.width = 20*hel1 + "px";
									aaa.className = "hours";
									aaa.setAttribute("id", "flexNone");
									aaa.setAttribute("name", (g + (j-(liveTm+1)) * hel1) );
									aaa.innerHTML = (g + (j-(liveTm+1)) * hel1) % 24;
									days.appendChild(aaa);
								}

							}
							days.setAttribute("id","flexNone");
							days.style.width = 20 * 33 + "px";
						}else if (i <= qel1 - 1) {
							var days = document.getElementsByClassName("days")[i];
							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "hours";
								//var name = liveTm + c + b * hel1 + j * hel1+(i-1)*24;
								var name = ( 8 + (j+1)* hel1);
								aaa.setAttribute("name", name);
								aaa.innerHTML = name % 24;
								aaa.style.width=hel1 * 20 + "px"
								days.appendChild(aaa);
							}
						} else {
							var days = document.getElementsByClassName("days")[i];
							for (j = 0; j < 24 / hel2; j++) {
								var aaa = document.createElement("div");
								aaa.className = "hours";
								//var name = liveTm + c + b * hel2 + j * hel2+(i-1)*24;
								var name =35+ (i-1)*24+j*hel2;
								aaa.setAttribute("name", name);
								aaa.innerHTML = name % 24;
								aaa.style.width=hel2 * 20 + "px"
								days.appendChild(aaa);
							}
							//var hoursWidth = hel1 * ten + "px";
							//$(".hours").css("width", hoursWidth);
						}
						// console.log(i)
					}
				} else if (Boolean(qel3)) {


				} else {
					qel2 = null;
					qel3 = null;
					hel2 = null;
					hel3 = null;
					for (var i = 0; i < qel1; i++) {
						var days = document.getElementsByClassName("days")[i];
						var a = (33 - (liveTm + 1)) % hel1;
						var b = Math.ceil((33 - (liveTm + 1)) / hel1);
						var len = (liveTm + 1) + b;
						var c;
						if (i == 0) {
							var g;
							for (j = 0; j < len; j++) {
								if (j <= liveTm) {
									var aaa = document.createElement("div");
									aaa.style.width = 20 + "px";
									aaa.className = "hours";
									aaa.setAttribute("name", j);
									aaa.innerHTML = j % 24;
									days.appendChild(aaa);
								} else if (j == liveTm + 1) {
									var aaa = document.createElement("div");
									if (a == 0) {
										c = a + hel1;
									} else {
										c = a;
									}
									g = (j - 1 + c);
									aaa.style.width =20* c + "px";
									//aaa.className = "bbb";
									aaa.className = "hours nomal";
									aaa.setAttribute("id", "flexNone");
									//var name = g%24;
									//aaa.setAttribute("name",name);
									aaa.setAttribute("name", c + j - 1);
									aaa.innerHTML = (c + j - 1) % 24;
									days.appendChild(aaa);

								} else {

									var aaa = document.createElement("div");
									aaa.style.width = 20*hel1 + "px";
									aaa.className = "hours";
									aaa.setAttribute("id", "flexNone");
									var name = liveTm + c + (j - liveTm - 1) * hel1;
									aaa.setAttribute("name", name);
									aaa.innerHTML = name % 24;
									days.appendChild(aaa);
								}

							}
							days.setAttribute("id", "flexNone");
						} else {
							var days = document.getElementsByClassName("days")[i];
							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "hours";
								var name = liveTm + c + b * hel1 + j * hel1+(i-1)*24;
								aaa.setAttribute("name", name);
								aaa.innerHTML = name % 24;
								aaa.style.width=hel1 * 20 + "px"
								days.appendChild(aaa);
							}
							//var hoursWidth = hel1 * ten + "px";
							//$(".hours").css("width", hoursWidth);
						}
					}

				}


			} else if (Tm >= 18) {
				key=liveTm+1;
				var lengthMS = $(".days").length;
				$("#parst").css("width", ds * (lengthMS - 1) + Wd * 9);
				//$(".days").eq(lengthMS - 1).remove();

				var oDiv = document.getElementsByClassName("days")[0];
				oDiv.style.width = (ds + Wd * 9) + "px";

				if (Boolean(qel2) && !Boolean(qel3)) {
					for (i = 0; i < qel1 + qel2; i++) {
						var days = document.getElementsByClassName("days")[i];

						var a = (45 - (liveTm+1)) % hel1;
						var b = Math.ceil((45 - (liveTm+1)) / hel1);
						var len = (liveTm+1) + b;
						var c;
						if(i == 0){
							var g;
							for (j = 0; j < len; j++) {
								if(j <= liveTm ){
									var aaa = document.createElement("div");

									aaa.style.width = 20 + "px";
									aaa.className = "hours";
									aaa.setAttribute("name", j);
									aaa.innerHTML = j % 24;
									days.appendChild(aaa);
								}else if(j == liveTm +1){
									var aaa = document.createElement("div");
									//if(a == 0){
									//   c = a + hel1;
									//}else{
									//   c = a;
									//}
									g = liveTm+1;
									//aaa.className = "bbb nomal";
									//var name = g%24;
									//aaa.setAttribute("name",name);

									aaa.style.width =20+ "px";
									aaa.className = "hours nomal";
									aaa.setAttribute("id", "flexNone");
									aaa.setAttribute("name", liveTm +1);
									aaa.innerHTML = (liveTm +1)%24;
									days.appendChild(aaa);
								}else{

									var aaa = document.createElement("div");
									//aaa.style.width = (Wd-0.3) * hel1 + "px";
									aaa.className = "bbb";
									//aaa.setAttribute("id","flexNone");

									aaa.style.width = 20*hel1 + "px";
									aaa.className = "hours";
									aaa.setAttribute("id", "flexNone");
									aaa.setAttribute("name", (g + (j-(liveTm+1)) * hel1) );
									aaa.innerHTML = (g + (j-(liveTm+1)) * hel1) % 24;
									days.appendChild(aaa);
								}

							}
							days.setAttribute("id","flexNone");
							days.style.width = 20 * 45 + "px";
						}else if (i <= qel1 - 1) {
							var days = document.getElementsByClassName("days")[i];
							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "hours";
								//var name = liveTm + c + b * hel1 + j * hel1+(i-1)*24;
								var name = ( 8 + (j+1)* hel1);
								aaa.setAttribute("name", name);
								aaa.innerHTML = name % 24;
								aaa.style.width=hel1 * 20 + "px"
								days.appendChild(aaa);
							}
						} else {
							var days = document.getElementsByClassName("days")[i];
							for (j = 0; j < 24 / hel2; j++) {
								var aaa = document.createElement("div");
								aaa.className = "hours";
								//var name = liveTm + c + b * hel2 + j * hel2+(i-1)*24;
								var name =47+ (i-1)*24+j*hel2;
								aaa.setAttribute("name", name);
								aaa.innerHTML = name % 24;
								aaa.style.width=hel2 * 20 + "px"
								days.appendChild(aaa);
							}
							//var hoursWidth = hel1 * ten + "px";
							//$(".hours").css("width", hoursWidth);
						}
						// console.log(i)
					}
				} else if (Boolean(qel3)) {


				} else {
					qel2 = null;
					qel3 = null;
					hel2 = null;
					hel3 = null;
					for (var i = 0; i < qel1; i++) {
						var days = document.getElementsByClassName("days")[i];
						var a = (45 - (liveTm + 1)) % hel1;
						var b = Math.ceil((45 - (liveTm + 1)) / hel1);
						var len = (liveTm + 1) + b;
						var c;
						if (i == 0) {
							var g;
							for (j = 0; j < len; j++) {
								if (j <= liveTm) {
									var aaa = document.createElement("div");
									aaa.style.width =20+ "px";
									aaa.className = "hours";
									aaa.setAttribute("name", j);
									aaa.innerHTML = j % 24;
									days.appendChild(aaa);
								} else if (j == liveTm + 1) {
									var aaa = document.createElement("div");

									if (a == 0) {
										c = a + hel1;
									} else {
										c = a;
									}
									g = (j - 1 + c);
									aaa.style.width = 20 * c + "px";
									//aaa.className = "bbb";
									aaa.className = "hours nomal";
									aaa.setAttribute("id", "flexNone");
									//var name = g%24;
									//aaa.setAttribute("name",name);
									aaa.setAttribute("name", c + j - 1);
									aaa.innerHTML = (c + j - 1) % 24;
									days.appendChild(aaa);

								} else {

									var aaa = document.createElement("div");
									aaa.style.width =20* hel1 + "px";
									aaa.className = "hours";
									aaa.setAttribute("id", "flexNone");
									var name = liveTm + c + (j - liveTm - 1) * hel1;
									aaa.setAttribute("name", name);
									aaa.innerHTML = name % 24;
									days.appendChild(aaa);
								}

							}
							days.setAttribute("id", "flexNone");
						} else {
							var days = document.getElementsByClassName("days")[i];
							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "hours";
								aaa.style.width = 20 * hel1 + "px";
								var name = liveTm + c + b * hel1 + j * hel1+(i-1)*24;
								aaa.setAttribute("name", name);
								aaa.innerHTML = name % 24;
								days.appendChild(aaa);

							}
							//var hoursWidth = hel1 * ten + "px";
							//$(".hours").css("width", hoursWidth);
						}
					}

				}


			} else if (Tm < 6) {
				if(liveTm==23){
					key=24;
				}else{
					key=24+liveTm+1;
				}
				var lengthMS = $(".days").length;
				$("#parst").css("width", ds * (lengthMS - 1) + Wd * 9);
				//$(".days").eq(lengthMS - 1).remove();

				var oDiv = document.getElementsByClassName("days")[0];
				oDiv.style.width = (ds + Wd * 9) + "px";

				if (Boolean(qel2) && !Boolean(qel3)) {
					for (i = 0; i < qel1 + qel2; i++) {
						var days = document.getElementsByClassName("days")[i];

						var a = (45 - (liveTm+1)) % hel1;
						var b = Math.ceil((45 - (liveTm+1)) / hel1);
						var len = (liveTm+1) + b;
						var c;
						if(i == 0){
							var g;
							for (j = 0; j < len; j++) {
								if(j <= liveTm ){
									var aaa = document.createElement("div");

									aaa.style.width = 20 + "px";
									aaa.className = "hours";
									aaa.setAttribute("name", j);
									aaa.innerHTML = j % 24;
									days.appendChild(aaa);
								}else if(j == liveTm +1){
									var aaa = document.createElement("div");
									//if(a == 0){
									//   c = a + hel1;
									//}else{
									//   c = a;
									//}
									g = liveTm+1;
									//aaa.className = "bbb nomal";
									//var name = g%24;
									//aaa.setAttribute("name",name);

									aaa.style.width =20+ "px";
									aaa.className = "hours nomal";
									aaa.setAttribute("id", "flexNone");
									aaa.setAttribute("name", liveTm +1);
									aaa.innerHTML = (liveTm +1)%24;
									days.appendChild(aaa);
								}else{

									var aaa = document.createElement("div");
									//aaa.style.width = (Wd-0.3) * hel1 + "px";
									aaa.className = "bbb";
									//aaa.setAttribute("id","flexNone");

									aaa.style.width = 20*hel1 + "px";
									aaa.className = "hours";
									aaa.setAttribute("id", "flexNone");
									aaa.setAttribute("name", (g + (j-(liveTm+1)) * hel1) );
									aaa.innerHTML = (g + (j-(liveTm+1)) * hel1) % 24;
									days.appendChild(aaa);
								}

							}
							days.setAttribute("id","flexNone");
							days.style.width = 20 * 45 + "px";
						}else if (i <= qel1 - 1) {
							var days = document.getElementsByClassName("days")[i];
							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "hours";
								//var name = liveTm + c + b * hel1 + j * hel1+(i-1)*24;
								var name = ( 8 + (j+1)* hel1);
								aaa.setAttribute("name", name);
								aaa.innerHTML = name % 24;
								aaa.style.width=hel1 * 20 + "px"
								days.appendChild(aaa);
							}
						} else {
							var days = document.getElementsByClassName("days")[i];
							for (j = 0; j < 24 / hel2; j++) {
								var aaa = document.createElement("div");
								aaa.className = "hours";
								//var name = liveTm + c + b * hel2 + j * hel2+(i-1)*24;
								var name =47+ (i-1)*24+j*hel2;
								aaa.setAttribute("name", name);
								aaa.innerHTML = name % 24;
								aaa.style.width=hel2 * 20 + "px"
								days.appendChild(aaa);
							}
							//var hoursWidth = hel1 * ten + "px";
							//$(".hours").css("width", hoursWidth);
						}
						// console.log(i)
					}
				} else if (Boolean(qel3)) {


				} else {
					qel2 = null;
					qel3 = null;
					hel2 = null;
					hel3 = null;
					for (var i = 0; i < qel1; i++) {
						var days = document.getElementsByClassName("days")[i];

						var a;
						var b ;
						var len;
						var c;
						if (i == 0) {
							var tmpTm=liveTm;
							if(liveTm==23){
								tmpTm=-1
							}
							a = (45 - (24+tmpTm + 1)) % hel1;
							b = Math.ceil((45 - (24+tmpTm + 1)) / hel1);
							len = (24+tmpTm + 1) + b;
							var g;
							for (j = 0; j < len; j++) {
								if (j <= 24+tmpTm) {
									var aaa = document.createElement("div");
									aaa.style.width =20 + "px";
									aaa.className = "hours";
									aaa.setAttribute("name", j);
									aaa.innerHTML = j % 24;
									days.appendChild(aaa);
								} else if (j == 24+tmpTm+ 1) {
									var aaa = document.createElement("div");

									if (a == 0) {
										c = a + hel1;
									} else {
										c = a;
									}
									g = (j - 1 + c);
									aaa.style.width =20 * c + "px";
									//aaa.className = "bbb";
									aaa.className = "hours nomal";
									aaa.setAttribute("id", "flexNone");
									//var name = g%24;
									//aaa.setAttribute("name",name);
									aaa.setAttribute("name", c + j - 1);
									aaa.innerHTML = (c + j - 1) % 24;
									days.appendChild(aaa);

								} else {

									var aaa = document.createElement("div");
									aaa.style.width = 20 * hel1 + "px";
									aaa.className = "hours";
									aaa.setAttribute("id", "flexNone");
									var name = 24+tmpTm + c + (j - (24+tmpTm)- 1) * hel1;
									aaa.setAttribute("name", name);
									aaa.innerHTML = name % 24;
									days.appendChild(aaa);
								}

							}
							days.setAttribute("id", "flexNone");
						} else {
							var days = document.getElementsByClassName("days")[i];
							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "hours";
								aaa.style.width = 20 * hel1 + "px";
								var name = 24+tmpTm + c + b * hel1 + j * hel1+(i-1)*24;
								aaa.setAttribute("name", name);
								aaa.innerHTML = name % 24;
								days.appendChild(aaa);

							}
							//var hoursWidth = hel1 * ten + "px";
							//$(".hours").css("width", hoursWidth);
						}
					}

				}

			}
			var htmlSey = $(".hours").eq(key).html();

			$("#inp p").html(htmlSey + ":00");

		}else{
			if((nuTm+hel1)>24){
				dayes=dayes+1;
			}
			for (i = 0; i < dayes - 1; i++) {
				var contLi = document.createElement("li");
				contLi.className = "days";
				contUl.appendChild(contLi)
			}
			if (Boolean(qel2) && !Boolean(qel3)) {

				for (i = 0; i < qel1 + qel2; i++) {
					var mellDiv = document.getElementsByClassName("days")[i];
					if (i <= qel1 - 1) {
						for (j = 0; j < 24 / hel1; j++) {
							var aaa = document.createElement("div");
							aaa.className = "hours";
							mellDiv.appendChild(aaa);
						}
					} else {
						for (j = 0; j < 24 / hel2; j++) {
							var aaa = document.createElement("div");
							aaa.className = "hours";
							mellDiv.appendChild(aaa);
						}
					}
				}
				var hoursWidth = hel1 * ten + "px";
				$(".hours").css("width", hoursWidth);
			} else if (Boolean(qel3)) {
				for (i = 0; i < qel1 + qel2 + qel3; i++) {
					$(".esDay").css({"width":ten*24})
					var mellDiv = document.getElementsByClassName("days")[i];
					if (i <= qel1 - 1) {
						for (j = 0; j < 24 / hel1; j++) {
							var aaa = document.createElement("div");
							aaa.className = "hours";
							aaa.style.width = ten*hel1 + "px";
							mellDiv.appendChild(aaa);
							//mellDiv.style.width=
						}
					} else if (i < qel1 - 1 + qel2) {
						for (j = 0; j < 24 / hel2; j++) {
							var aaa = document.createElement("div");
							aaa.className = "hours";
							aaa.style.width = ten*hel2 + "px";
							mellDiv.appendChild(aaa);
						}

					} else {
						for (j = 0; j < 24 / hel3; j++) {
							var aaa = document.createElement("div");
							aaa.className = "hours";
							aaa.style.width = ten*hel3 + "px";
							mellDiv.appendChild(aaa);
						}

					}
				}
				//var hoursWidth = hel1 * ten + "px";
				//$(".hours").css("width", hoursWidth);
				if((nuTm+hel1)>24){
					$(".days").eq(0).css({"margin-left":((nuTm+hel1-24)*ten-hel1 * ten/2)});
				}else{
					$(".days").eq(0).css({"margin-left":((nuTm+hel1)*ten-hel1 * ten/2)});

				}
			}
			else {

				qel2 = null;
				qel3 = null;
				hel2 = null;
				hel3 = null;
				//for (i = 0; i < qel1; i++) {
				//    var mellDiv = document.getElementsByClassName("days")[i];
				//    for (j = 0; j < 24 / hel1; j++) {
				//        var aaa = document.createElement("div");
				//        aaa.className = "hours";
				//        mellDiv.appendChild(aaa);
				//    }
				//}
				for (i = 0; i < dayes-1; i++) {
					var mellDiv = document.getElementsByClassName("days")[i];
					for (j = 0; j < 24 / hel1; j++) {
						var aaa = document.createElement("div");
						aaa.className = "hours";
						mellDiv.appendChild(aaa);
					}
				}
				var hoursWidth = hel1 * ten + "px";
				$(".hours").css("width", hoursWidth);

				//$(".days").eq(0).css({"margin-left":((nuTm+hel1)*ten-hel1 * ten/2)});
				if((nuTm+hel1)>24){
					$(".days").eq(0).css({"margin-left":((nuTm+hel1-24)*ten-hel1 * ten/2)});
				}else{
					$(".days").eq(0).css({"margin-left":((nuTm+hel1)*ten-hel1 * ten/2)});

				}


				//$(".days").eq(0).css({"margin-left":nuTm*ten-hoursWidth/2})

			}

			if (Tm >= 6 && Tm < 18) {
				for (i = 0; i < $(".hours").length; i++) {
					var mis = (timeSam[i] + 8);
					$(".hours").eq(i).attr("name", mis);
					$(".hours").eq(i).html(mis % 24);
				}
			} else if (Tm < 6 || Tm >= 18) {
				for (i = 0; i < $(".hours").length; i++) {
					var mis = (timeSam[i] + 20);
					$(".hours").eq(i).attr("name", mis);
					$(".hours").eq(i).html(mis % 24);
				}
			}

			var htmlSey = $(".hours").eq(0).html();
			$("#inp p").html(htmlSey + ":00");


			if (Boolean(qel3)) {

				var gum = $("#parst").find(".days").length;
				//console.log(gum)
				//console.log(qel1+qel2-1)
				var numLeng = qel1 + qel2 - 1;
				for (i = numLeng; i < gum; i++) {
					$("#parst").find(".days").eq(i).find("div").attr("id", "right");
				}
			}
		}

	}

	// 不同时差跨度修正
	function celSever(ifLayer) {
		if(ifLayer){

		}else{
			if (Boolean(qel2) && qel3 == null) {
				for (i = qel1; i < $("#parst li").length; i++) {
					var child = $("#parst li").eq(i).children();
					var childWidth = hel2 * ten + "px";
					child.css("width", childWidth);
				}
			} else if (Boolean(qel2) && Boolean(qel3)) {
				//for (i = 0; i < $("#parst li").length; i++) {
				//var child = $("#parst li").eq(i).children();
				//var childWidth = hel2 * 20 + "px";
				//child.css("width", childWidth);
				//}
				//for (i = qel1; i < $("#parst li").length; i++) {
				//    var child = $("#parst li").eq(i).children();
				//    var childWidth = hel2 * 20 + "px";
				//    child.css("width", childWidth);
				//}
				//for (i = qel1 + qel2 - 1; i < $("#parst li").length; i++) {
				//    var child = $("#parst li").eq(i).children();
				//    var childWidth = hel3 * 20 + "px";
				//    child.css("width", childWidth);
				//}
			} else {
				return
			}
		}

	}

	//因为存在跨天问题  日期的现实必须单独处理 不能与包裹小时创建  与小时同级存在  用position定位
	function creatDate(ifLayer) {
		if(ifLayer){
			var liWidth = $("#parst li div").width();
			var divDate = document.createElement("ol");
			var parst = document.getElementById("parst");
			divDate.className = "dayZet";
			for (i = 0; i < dayes; i++) {
				var liDate = document.createElement("li");
				liDate.className = "esDay"
				divDate.appendChild(liDate);
			}

			parst.appendChild(divDate);
			if (Tm >= 6 && Tm < 18) {
				var teDay;
				var dt = new Date();
				dt = new Date(dt);
				dt = desend(dt, 1 * 24);
				dt = dt.Format("yyyy-MM-dd");
				var fit = $(".esDay").length;
				for (i = 0; i < fit; i++) {
					dt = new Date(dt);
					dt = add(dt, 24);
					dt = dt.Format("yyyy-MM-dd")
					$(".esDay").eq(i).html(dt);
				}
				var lenAll = 24 * 20 + "px";
				var lenOne = (24 - 8 - 1) * 20 + "px";
				var lenTwo = (8 + 1) * 20 + "px";
				var lengths = $(".esDay").length - 1;
				$(".esDay").css("width", lenAll);
				//$(".esDay").eq(0).css("width", lenOne);
				$(".esDay").eq(lengths).css("width", lenTwo);
			} else if (Tm >= 18) {
				var teDay;
				var dt = new Date();
				dt = new Date(dt);
				dt = desend(dt, 2 * 24);
				dt = dt.Format("yyyy-MM-dd");
				var fit = $(".esDay").length;
				//console.log(fit)
				for (i = -1; i < fit; i++) {
					dt = new Date(dt);
					dt = add(dt, 24);
					dt = dt.Format("yyyy-MM-dd");
					$(".esDay").eq(i).html(dt);
				}
				var lenAll = 24 * 20 + "px";
				var lenOne = (24 - 20 - 1) * 20 + "px";
				var lenTwo = (8 + 1) * 20 + "px";
				var lengths = $(".esDay").length - 1;
				$(".esDay").css("width", lenAll);
				//$(".esDay").eq(0).css("width", lenOne);
				$(".esDay").eq(lengths).css("width", lenTwo);
			}else{
				var teDay;
				var dt = new Date();
				dt =moment(dt).subtract(1,"day").toDate().setHours(20);
				dt = new Date(dt);
				dt = desend(dt, 2 * 24);
				dt = dt.Format("yyyy-MM-dd");
				var fit = $(".esDay").length;
				//console.log(fit)
				for (i = -1; i < fit; i++) {
					dt = new Date(dt);
					dt = add(dt, 24);
					dt = dt.Format("yyyy-MM-dd");
					$(".esDay").eq(i).html(dt);
				}
				var lenAll = 24 * 20 + "px";
				var lenOne = (24 - 20 - 1) * 20 + "px";
				var lenTwo = (20 + 1) * 20 + "px";
				var lengths = $(".esDay").length - 1;
				$(".esDay").css("width", lenAll);
				//$(".esDay").eq(0).css("width", lenOne);
				$(".esDay").eq(lengths).css("width", lenTwo);
			}
		}else{
			var liWidth = $("#parst li div").width();
			var divDate = document.createElement("ol");
			var parst = document.getElementById("parst");
			divDate.className = "dayZet";
			var kuaDay=true;
			if((nuTm+hel1)>24){
				dayes=dayes-1;
				kuaDay=false;
			}
			for (i = 0; i < dayes; i++) {
				var liDate = document.createElement("li");
				liDate.className = "esDay"
				divDate.appendChild(liDate);
			}

			parst.appendChild(divDate);
			if (Tm >= 6 && Tm < 18) {
				var teDay;
				if(kuaDay){
					var dt = new Date();
				}else{
					var dt =moment(new Date()).subtract(-1,"day").toDate();
				}
				//var dt = new Date();
				dt = new Date(dt);
				dt = desend(dt, 1 * 24);
				dt = dt.Format("yyyy-MM-dd");
				var fit = $(".esDay").length;
				for (i = 0; i < fit; i++) {
					dt = new Date(dt);
					dt = add(dt, 24);
					dt = dt.Format("yyyy-MM-dd")
					$(".esDay").eq(i).html(dt);
				}
				var lenAll = 24 * ten + "px";
				var lenOne = (24 - 8 - 1) * ten + "px";
				var lenTwo = (8 + 1) * ten + "px";
				var lengths = $(".esDay").length - 1;
				$(".esDay").css("width", lenAll);
				//$(".esDay").eq(0).css("width", lenOne);
				$(".esDay").eq(lengths).css("width", lenTwo);
			} else if (Tm >= 18) {
				var teDay;
				if(kuaDay){
					var dt = new Date();
				}else{
					var dt = moment(new Date()).subtract(-1,"day").toDate();
				}
				//var dt = new Date();
				dt = new Date(dt);
				dt = desend(dt, 2 * 24);
				dt = dt.Format("yyyy-MM-dd");
				var fit = $(".esDay").length;
				//console.log(fit)
				for (i = -1; i < fit; i++) {
					dt = new Date(dt);
					dt = add(dt, 24);
					dt = dt.Format("yyyy-MM-dd");
					$(".esDay").eq(i).html(dt);
				}
				var lenAll = 24 * ten + "px";
				var lenOne = (24 - 20 - 1) * ten + "px";
				var lenTwo = (20 + 1) * ten + "px";
				var lengths = $(".esDay").length - 1;
				$(".esDay").css("width", lenAll);
				//$(".esDay").eq(0).css("width", lenOne);
				$(".esDay").eq(lengths).css("width", lenTwo);
			}else if(Tm<6){
				var teDay;
				if(kuaDay){
					var dt = new Date();
				}else{
					var dt = moment(new Date()).subtract(-1,"day").toDate();
				}
				//var dt = new Date();
				dt=moment(dt).subtract(1,"day").toDate().setHours(20);
				dt = new Date(dt);
				dt = desend(dt, 2 * 24);
				dt = dt.Format("yyyy-MM-dd");
				var fit = $(".esDay").length;
				//console.log(fit)
				for (i = -1; i < fit; i++) {
					dt = new Date(dt);
					dt = add(dt, 24);
					dt = dt.Format("yyyy-MM-dd");
					$(".esDay").eq(i).html(dt);
				}
				var lenAll = 24 * ten + "px";
				var lenOne = (24 - 20 - 1) * ten + "px";
				var lenTwo = (20 + 1) * ten + "px";
				var lengths = $(".esDay").length - 1;
				$(".esDay").css("width", lenAll);
				//$(".esDay").eq(0).css("width", lenOne);
				$(".esDay").eq(lengths).css("width", lenTwo);
			}

		}

	}

	function thismousedown(e) {
		var event = e || window.event;
		event.preventDefault();
		isdrag = true;
		NowLeft = parseInt(oDiv2.style.left + 0);
		if(event.type=="mousedown"){
			disX =event.pageX;
		}else{
			disX = event.touches[0].pageX;
		}


		clearInterval(timeMove);
		$(".goStart").removeAttr("id");


		$(".change").css("display", "none");
		return false;
	}


	function thismousemove(e) {
		var event = e || window.event;
		event.preventDefault();
		if (isdrag) {
			if(event.type=="mousemove"){
				oDiv2.style.left = NowLeft + event.pageX - disX + 'px';
				//oDiv2.onselectstart=function(){return false}
			}else{
				oDiv2.style.left = NowLeft + event.touches[0].pageX - disX + 'px';
				//oDiv2.onselectstart=function(){return false}
			}
			//oDiv2.style.left = NowLeft + event.touches[0].pageX - disX + 'px';
			//		//oDiv2.onselectstart=function(){return false}
			return false;
		}
	}

	function add(date, day) {
		day = parseInt(day);
		var interTimes = day * 60 * 60 * 1000;
		interTimes = parseInt(interTimes);
		return new Date(Date.parse(date) + interTimes);
	}

	function desend(date, day) {
		day = parseInt(day);
		var interTimes = day * 60 * 60 * 1000;
		interTimes = parseInt(interTimes);
		return new Date(Date.parse(date) - interTimes);
	}

	function thismouseup() {
		isdrag = false;
		var parsetLeft = parseInt($("#parst").css("left"));
		var parsetWidth = $("#parst").width();
		if(ifLayer){
			if (parsetLeft >= 0) {
				var startLeft = 0 + "px";
				$("#parst").css("left", startLeft)
			} else if (parsetLeft <= 0 - parsetWidth) {
				var endLeft = 2 + 0 - parsetWidth + "px";
				$("#parst").css("left", endLeft);
			}
		}else{
			var temp;
			if((nuTm+hel1)>24){
				temp=((nuTm+hel1-24)*ten-hel1*ten/2)
			}else {
				temp = ((nuTm + hel1) * ten - hel1 * ten / 2);
			}
			//var temp=((nuTm+hel1-24)*ten-hel1*ten/2);
			if (parsetLeft >= -temp) {
				var startLeft = -temp + "px";
				$("#parst").css("left", startLeft)
			} else if (parsetLeft <= 0 - parsetWidth) {
				var endLeft = 2 + 0 - parsetWidth + "px";
				$("#parst").css("left", endLeft);
			}

		}

		var arry = hoursDel(ifLayer);
		var lenNum = arry[0];
		var left_Ul = arry[1] + "px";
		$("#parst").animate({left: left_Ul}, 200);
		if(ifLayer){
			var divName = parseInt($(".hours").eq(lenNum).attr("name"));
			var numHours = (divName % 24).toString();
			if (numHours.length < 2) {
				numHours = 0 + numHours;
			}
			var numDay = parseInt(divName / 24);
			$("#inp p").html(numHours + ":00");
			var dayHtml = $(".dayZet li").eq(numDay).html();
			var currentTime = dayHtml + " " + numHours + ":00";
		}else{
			var divName = parseInt($(".hours").eq(lenNum).attr("name"));
			var numHours = (divName % 24).toString();
			if (numHours.length < 2) {
				numHours = 0 + numHours;
			}
			var numDay = parseInt(divName / 24);
			$("#inp p").html(numHours + ":00");
			if((nuTm+hel1)>24){
				var dayHtml = $(".dayZet li").eq(numDay-1).html();
			}else{
				var dayHtml = $(".dayZet li").eq(numDay).html();
			}
			//var dayHtml = $(".dayZet li").eq(numDay-1).html();
			var currentTime = dayHtml + " " + numHours + ":00";
		}
		//var divName = parseInt($(".hours").eq(lenNum).attr("name"));
		//var numHours = (divName % 24).toString();
		//if (numHours.length < 2) {
		//	numHours = 0 + numHours;
		//}
		//var numDay = parseInt(divName / 24);
		//$("#inp p").html(numHours + ":00");
		//var dayHtml = $(".dayZet li").eq(numDay).html();
		//var currentTime = dayHtml + " " + numHours + ":00";

		var startLeft=parseInt($("#parst").css("left"));
		var index=parseInt((-startLeft)/20);
		var numHours1=$(".hours").eq(index-1).html();
		var obj = $(".select span").html();
		var featureData = getCheckedFeatureData(obj);
		if(ifLayer){
			if (Boolean(qel2) && !Boolean(qel3)) {
				var a,b;
				var firstForeLeft;
				//全部实况的结束时的left
				var shikLeft;
				//结束时的的left
				var endForeLeft=$("#parst").width();
				var  firstDayForeLeft
				if(Tm>=6&&Tm<18){
					firstForeLeft=(liveTm+1)*20+10;
					shikLeft=(liveTm+1)*20;
					firstDayForeLeft=33*20-10;
				}else if(Tm<6){
					var tmpTm=liveTm;
					if(liveTm == 23){
						tmpTm=-1
					}
					firstForeLeft=(24+tmpTm+1)*20+10;
					shikLeft=(24+tmpTm+1)*20;
					firstDayForeLeft=45*20-10;
				}else if(Tm>=18){
					firstForeLeft=(liveTm+1)*20+10;
					shikLeft=(liveTm+1)*20;
					firstDayForeLeft=45*20-10;
				}
				getUrl2(startTime,  featureData,arry[1],shikLeft,firstForeLeft,endForeLeft,parseInt(numHours),firstDayForeLeft)

			} else if (Boolean(qel3)) {


			} else {
				var a,b;
				var firstForeLeft;
				//全部实况的结束时的left
				var shikLeft;
				//结束时的的left
				var endForeLeft=$("#parst").width();

				if(Tm>=6&&Tm<18){
					a = (33 - (liveTm+1)) % hel1;
					if(a ==0){
						b =20*hel1/2;
					}else{
						b=20*a/2;
					}
					firstForeLeft=(liveTm+1)*20+b;
					shikLeft=(liveTm+1)*20;
				}else if(Tm<6){
					var tmpTm=liveTm
					if(liveTm == 23){
						tmpTm=-1
					}
					a = (45 - (24+tmpTm+1)) % hel1;
					if(a ==0){
						b =20*hel1/2;
					}else{
						b=20*a/2;
					}
					firstForeLeft=(24+tmpTm+1)*20+b;
					shikLeft=(24+tmpTm+1)*20;
				}else if(Tm>=18){
					a = (33 - (liveTm+1)) % hel1;
					if(a ==0){
						b =20*hel1/2;
					}else{
						b=20*a/2;
					}
					firstForeLeft=(liveTm+1)*20+b;
					shikLeft=(liveTm+1)*20;
				}
				var startLeft=parseInt($("#parst").css("left"));
				var index=parseInt((-startLeft)/20);
				var numHours1=$(".hours").eq(index-1).html();
				var obj = $(".select span").html();
				var featureData = getCheckedFeatureData(obj);
				getUrl2(startTime,  featureData,arry[1],shikLeft,firstForeLeft,endForeLeft,parseInt(numHours),b)

			}
		}else{
			getUrl1(startTime, currentTime, featureData);

		}

		if (currentLatLng != null) {
			pickValue1(currentLatLng);
		}
		/*var t=startTime.format("yyyy-MM-dd");

		 if(nuTm==8){
		 t+="&nbsp;&nbsp;08时发布";
		 }else{
		 t+="&nbsp;&nbsp;20时发布";
		 }*/
	}

	//  **  偏移量问题：     解决方案一   ul外套一个div 让div-center  ul的left从0开始计算。
	function hoursDel(ifLayer) {
		var leftUl = Math.abs(parseInt($("#parst").css("left")));   // 必定为负值
		//console.log(leftUl)
		var divWidth = parseInt($(".hours").width());
		var liWidth = parseInt($("#parst li").width());
		var severWidth = parseInt($("#parst li").eq(qel1).children(".hours").width());
		var lenNum,
			severWidth3,
			animaLeft;


		if(ifLayer){

			if (Boolean(qel3)) {
				severWidth3 = parseInt($("#parst li").eq(qel1 + qel2 - 1).find("div").width());
				//console.log(lenNum)
				var arr = new Array();
				arr.push(lenNum);
				arr.push(animaLeft);
				//console.log(arr)
				return arr;
			}else if (Boolean(qel2) && qel3 == null) {
				var a,b;
				var firstForeLeft;
				//全部实况的结束时的left
				var shikLeft;
				//结束时的的left
				var endForeLeft=$("#parst").width();
				var  firstDayForeLeft
				var  tempIndex;
				if(Tm>=6&&Tm<18){
					firstForeLeft=(liveTm+1)*20+10;
					shikLeft=(liveTm+1)*20;
					firstDayForeLeft=33*20-10;
					tempIndex=32;
				}else if(Tm<6){
					var tmpTm=liveTm;
					if(liveTm == 23){
						tmpTm=-1
					}
					firstForeLeft=(24+tmpTm+1)*20+10;
					shikLeft=(24+tmpTm+1)*20;
					firstDayForeLeft=45*20-10;
					tempIndex=44;
				}else if(Tm>=18){
					firstForeLeft=(liveTm+1)*20+10;
					shikLeft=(liveTm+1)*20;
					firstDayForeLeft=45*20-10;
					tempIndex=44;
				}

				var startLeft=parseInt($("#parst").css("left"));
				if(-startLeft>endForeLeft-30){
					var index=Math.floor((shikLeft-10)/20)+Math.floor((endForeLeft-firstForeLeft-b)/60);
				}else{
					var index=(-startLeft)/20;
				}

				var numHours1=$(".hours").eq(index-1).html();

				if(-startLeft<firstDayForeLeft-5){
					var num=Math.floor((-startLeft)/20);
					startLeft=-num*20-10;
				}else if(-startLeft>=firstDayForeLeft-5&&-startLeft<=firstDayForeLeft+5){
					var num=tempIndex;
					startLeft=-firstDayForeLeft;
				}else if(-startLeft>firstDayForeLeft+5&&-startLeft<=endForeLeft-30){
					var num=tempIndex+Math.ceil((-startLeft-firstDayForeLeft-10)/60);
					startLeft=-firstDayForeLeft-40-Math.floor((-startLeft-firstDayForeLeft-10)/60)*20*3;

				}else{
					var num=tempIndex+Math.ceil((endForeLeft-30-firstDayForeLeft-10)/60);
					startLeft=-firstDayForeLeft-40-Math.floor((endForeLeft-30-firstDayForeLeft-10)/60)*20*3;
				}

				var arr = new Array();
				arr.push(num);
				arr.push(startLeft);
				//console.log(arr)
				return arr;

			} else if (Boolean(qel2) && Boolean(qel3)) {

			} else{
				var a,b;
				var firstForeLeft;
				//全部实况的结束时的left
				var shikLeft;
				//结束时的的left
				var endForeLeft=$("#parst").width();

				if(Tm>=6&&Tm<18){
					a = (33 - (liveTm+1)) % hel1;
					if(a ==0){
						b =20*hel1/2;
					}else{
						b=20*a/2;
					}
					firstForeLeft=(liveTm+1)*20+b;
					shikLeft=(liveTm+1)*20;
				}else if(Tm<6){
					var tmpTm=liveTm
					if(liveTm == 23){
						tmpTm=-1
					}
					a = (45 - (24+tmpTm+1)) % hel1;
					if(a ==0){
						b =20*hel1/2;
					}else{
						b=20*a/2;
					}
					firstForeLeft=(24+tmpTm+1)*20+b;
					shikLeft=(24+tmpTm+1)*20;
				}else if(Tm>=18){
					a = (33 - (liveTm+1)) % hel1;
					if(a ==0){
						b =20*hel1/2;
					}else{
						b=20*a/2;
					}
					firstForeLeft=(liveTm+1)*20+b;
					shikLeft=(liveTm+1)*20;
				}
				var startLeft=parseInt($("#parst").css("left"));
				if(-startLeft>=endForeLeft-30){
					var index=Math.floor((shikLeft-10)/20)+Math.floor((endForeLeft-firstForeLeft-b)/60);
				}else{
					var index=(-startLeft)/20;
				}

				var numHours1=$(".hours").eq(index-1).html();
				if(-startLeft<=shikLeft){
					var num=Math.floor((-startLeft)/20);
					startLeft=-num*20-10;
				}else if(-startLeft>shikLeft&&-startLeft<=firstForeLeft){
					var num=Math.floor((shikLeft)/20);
					startLeft=-shikLeft-b;
				}else if(-startLeft>firstForeLeft&&-startLeft<=endForeLeft-30){
					var num=Math.floor((shikLeft)/20)+1+Math.floor((-startLeft-firstForeLeft)/60);
					startLeft=-firstForeLeft-b-30-Math.floor((-startLeft-firstForeLeft)/60)*60;
				}else{
					var num=Math.floor((shikLeft)/20)+Math.floor((endForeLeft-firstForeLeft-b)/60);
					startLeft=-endForeLeft+30;
				}

				var arr = new Array();
				arr.push(num);
				arr.push(startLeft);
				//console.log(arr)
				return arr;
				//var tabNum = parseInt(leftUl / divWidth);
				//animaLeft = (0 - tabNum * divWidth - divWidth / 2);
				//lenNum = Math.abs(parseInt(leftUl / divWidth));
			}
		}else{

			if (Boolean(qel3)) {

				if((nuTm+hel1)>24){
					var temp=$(".hours").width() / 2+((nuTm+hel1-24)*ten-hel1 * ten/2);
				}else{
					var temp= $(".hours").width() / 2+ ((nuTm+hel1)*ten-hel1 * ten/2);
				}
				if(leftUl<=liWidth*qel1-36 +temp){
					divWidth = parseInt($(".hours").eq(0).width())
					lenNum =Math.ceil((leftUl-temp)/divWidth);
					var tabNum =Math.ceil((leftUl-temp)/divWidth);
					animaLeft = (0 - tabNum*divWidth-temp);
				}else if(leftUl<=liWidth*qel1+18+temp){
					var nums = (24/hel1)*qel1;
					lenNum =nums;
					animaLeft = -(liWidth*qel1+18+temp);
				}else if(leftUl>liWidth*qel1+18+temp && leftUl<= 72*(qel1+qel2-1)+liWidth*qel1+18+temp){
					severWidth = parseInt($(".days").eq(qel1).children(".hours").width());
					var nums = (24/hel1)*qel1;
					lenNum = Math.abs(parseInt((leftUl-liWidth*qel1+36-temp)/severWidth))+nums;
					var tabNum =Math.abs(parseInt((leftUl-liWidth*qel1+36-temp)/severWidth));
					animaLeft = (0 - tabNum*severWidth-(liWidth*qel1+18+temp));
				}else if(leftUl>72*(qel1+qel2-1)+liWidth*qel1+18+temp&&leftUl<=72*(qel1+qel2-1)+liWidth*qel1+18+temp+36+144){
					var nums = (24/hel1)*qel1;
					var nums2 = (24/hel2)*(qel2-1)
					lenNum =nums+nums2;


					animaLeft = (0 -(72*(qel1+qel2-1)+liWidth*qel1+18+temp+36+144));

				}else{
					severWidth3 = parseInt($(".days").eq(qel1 + qel2 - 1).find(".hours").width());
					var nums = (24/hel1)*qel1;
					var nums2 = (24/hel2)*(qel2-1)
					lenNum = Math.floor((leftUl-(72*(qel1+qel2-1)+liWidth*qel1+18+temp)-36)/severWidth3)+nums+nums2;

					var tabNum =  Math.floor((leftUl-(72*(qel1+qel2-1)+liWidth*qel1+18+temp)-36)/severWidth3);
					animaLeft = (0 -(72*(qel1+qel2-1)+liWidth*qel1+18+temp) - (tabNum+1)*severWidth3-36);
				}
				var arr = new Array();
				arr.push(lenNum);
				arr.push(animaLeft);
				//console.log(arr)
				return arr;
			}else if (Boolean(qel2) && qel3 == null) {
				if (leftUl < liWidth * qel1) {
					lenNum = Math.abs(parseInt(leftUl / divWidth));
					var tabNum = parseInt(leftUl / divWidth);
					animaLeft = (0 - tabNum * divWidth - divWidth / 2);
				} else {
					var nums = (24 / hel1) * qel1;
					lenNum = Math.abs(parseInt((leftUl - liWidth * qel1) / severWidth)) + nums;
					var tabNum = Math.abs(parseInt((leftUl - liWidth * qel1) / severWidth));
					animaLeft = (0 - liWidth * qel1 - tabNum * severWidth - severWidth / 2);
				}
				//console.log(lenNum)
				var arr = new Array();
				arr.push(lenNum);
				arr.push(animaLeft);
				//console.log(arr)
				return arr;

			} else if (Boolean(qel2) && Boolean(qel3)) {
				if (leftUl < liWidth * qel1) {

					lenNum = Math.abs(parseInt(leftUl / divWidth));
					var tabNum = parseInt(leftUl / divWidth);
					animaLeft = (0 - tabNum * divWidth - divWidth / 2);
				} else if (leftUl >= liWidth * qel1 && leftUl < liWidth * (qel1 + qel2 - 1)) {

					var nums = (24 / hel1) * qel1;
					lenNum = Math.abs(parseInt((leftUl - liWidth * qel1) / severWidth)) + nums;
					var tabNum = Math.abs(parseInt((leftUl - liWidth * qel1) / severWidth));
					animaLeft = (0 - liWidth * qel1 - tabNum * severWidth - severWidth / 2);
				} else {
					var nums = (24 / hel1) * qel1;
					var nums2 = (24 / hel2) * (qel2 - 1)
					lenNum = Math.abs(parseInt((leftUl - liWidth * (qel1 + qel2 - 1)) / severWidth3)) + nums + nums2;

					var tabNum = Math.abs(parseInt((leftUl - liWidth * (qel1 + qel2 - 1)) / severWidth3));
					animaLeft = (0 - liWidth * (qel1 + qel2 - 1) - tabNum * severWidth3 - severWidth3);
				}
				//console.log(lenNum)
				var arr = new Array();
				arr.push(lenNum);
				arr.push(animaLeft);
				//console.log(arr)
				return arr;
			} else{
				//leftUl=leftUl-((nuTm+hel1)*ten-hel1*ten/2);
				var temp;
				if((nuTm+hel1)>24){
					temp=((nuTm+hel1-24)*ten-hel1*ten/2)
					leftUl=leftUl-temp;
					//var parstLeft = 0 - $(".hours").width() / 2- ((nuTm+hel1-24)*ten-hel1 * ten/2) + "px";
				}else{
					temp=((nuTm+hel1)*ten-hel1*ten/2);
					leftUl=leftUl-temp;
				}

				var tabNum = parseInt(leftUl / divWidth);
				animaLeft = (0 - tabNum * divWidth - divWidth / 2-temp);
				lenNum = Math.abs(parseInt(leftUl / divWidth));
				//console.log(lenNum)
				var arr = new Array();
				arr.push(lenNum);
				arr.push(animaLeft);
				//console.log(arr)
				return arr;
			}


		}
		//console.log(lenNum)
		//var arr = new Array();
		//arr.push(lenNum);
		//arr.push(animaLeft);
		//console.log(arr)
		//return arr;
	}

	function DayLes(ifLayer) {
		for (i = 0; i < dayes; i++) {
			var crDiv = document.createElement("div");
			var allDiv = document.getElementById("all");
			crDiv.className = "mellDay";
			allDiv.appendChild(crDiv);
		}


		if(ifLayer){
			var oDiv;      // 总共有多少小时
			var oWidth;    // 单位1小时的宽度
			var oLength;   // 第一天小DIV总个数
			var windowLine = $(window).width();

			var ds = ($("#dateStyle").width() / $("#dateStyle span").length);
			var Wd = ds / 24;

			if (Tm >= 6 && Tm < 18) {
				var lengthMS = $(".mellDay").length;
				$("#all").css("width", ds * (lengthMS-1) + Wd*9);
				$(".mellDay").eq(lengthMS-1).remove();

				var oDiv = document.getElementsByClassName("mellDay")[0];
				oDiv.style.width = (ds + Wd*9)+"px";

				if (qel2 != 0 && qel3 == null) {  //前3天逐1小时，后7天逐3小时

					for (i = 0; i < qel1 + qel2; i++) {
						var mellDiv = document.getElementsByClassName("mellDay")[i];

						if(i == 0){

							var a = (33 - (liveTm+1)) % hel1;
							var b = Math.ceil((33 - (liveTm+1)) / hel1);
							var len = (liveTm+1) + b;

							var g;
							for (j = 0; j < len; j++) {
								if(j <= liveTm ){
									var aaa = document.createElement("div");
									aaa.className = "bbb";
									aaa.setAttribute("name",j);
									mellDiv.appendChild(aaa);
								}else if(j == liveTm +1){
									var aaa = document.createElement("div");
									var c;
									if(a == 0){
										c = a + hel1;
									}else{
										c = a;
									}
									g = (j-1+c);
									//aaa.style.width = (Wd-0.3) * c + "px";
									//aaa.className = "bbb";
									aaa.className = "bbb nomal";
									//aaa.setAttribute("id","flexNone");
									var name = g%24;
									aaa.setAttribute("name",name);
									mellDiv.appendChild(aaa);

								}else{

									var aaa = document.createElement("div");
									//aaa.style.width = (Wd-0.3) * hel1 + "px";
									aaa.className = "bbb";
									//aaa.setAttribute("id","flexNone");

									aaa.setAttribute("name", (g + (j-(liveTm+1)) * hel1) % 24 );
									mellDiv.appendChild(aaa);
								}

							}
							mellDiv.setAttribute("id","flexNone");
						}else if (i <= qel1 - 1) {
							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "bbb";

								aaa.setAttribute("name",( 8 + (j+1)* hel1) % 24 );
								mellDiv.appendChild(aaa);
							}
						} else {
							for (j = 0; j < 24 / hel2; j++) {
								var aaa = document.createElement("div");
								aaa.className = "bbb";
								aaa.setAttribute("name",( 8 + (j+1)* hel2) % 24 );
								mellDiv.appendChild(aaa);
								// console.log(hel2)
							}
						}
						// console.log(i)
					}

				} else if (Boolean(qel2) && Boolean(qel3)) {


				} else {


					qel2 = null;
					hel2 = null;
					for (i = 0; i < 10; i++) {
						var mellDiv = document.getElementsByClassName("mellDay")[i];

						if(i == 0){

							var a = (33 - (liveTm+1)) % hel1;
							var b = Math.ceil((33 - (liveTm+1)) / hel1);
							var len = (liveTm+1) + b;

							var g;
							for (j = 0; j < len; j++) {
								if(j <= liveTm ){
									var aaa = document.createElement("div");
									aaa.className = "bbb";
									aaa.setAttribute("name",j);
									mellDiv.appendChild(aaa);
								}else if(j == liveTm +1){
									var aaa = document.createElement("div");
									var c;
									if(a == 0){
										c = a + hel1;
									}else{
										c = a;
									}
									g = (j-1+c);
									aaa.style.width = (Wd-0.3) * c + "px";
									//aaa.className = "bbb";
									aaa.className = "bbb nomal";
									aaa.setAttribute("id","flexNone");
									var name = g%24;
									aaa.setAttribute("name",name);
									mellDiv.appendChild(aaa);

								}else{

									var aaa = document.createElement("div");
									aaa.style.width = (Wd-0.3) * hel1 + "px";
									aaa.className = "bbb";
									aaa.setAttribute("id","flexNone");

									aaa.setAttribute("name", (g + (j-(liveTm+1)) * hel1) % 24 );
									mellDiv.appendChild(aaa);
								}

							}
							mellDiv.setAttribute("id","flexNone");
						}else{

							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "bbb";
								aaa.setAttribute("name",( 8 + (j+1)* hel1) % 24 );
								mellDiv.appendChild(aaa);
							}
						}

					}
				}


			} else if (Tm >= 18) {

				var lengthMS = $(".mellDay").length;
				$("#all").css("width", ds * (lengthMS-1) + Wd*21);
				$(".mellDay").eq(lengthMS-1).remove();

				var oDiv = document.getElementsByClassName("mellDay")[0];
				oDiv.style.width = (ds + Wd*21)+"px";

				if (qel2 != 0 && qel3 == null) {

					for (i = 0; i < qel1 + qel2; i++) {
						var mellDiv = document.getElementsByClassName("mellDay")[i];

						if(i == 0){

							var a = (45 - (liveTm+1)) % hel1;
							var b = Math.ceil((45 - (liveTm+1)) / hel1);
							var len = (liveTm+1) + b;
							var g;
							for (j = 0; j < len; j++) {
								if(j <= liveTm ){
									var aaa = document.createElement("div");
									aaa.className = "bbb";
									aaa.setAttribute("name",j);
									mellDiv.appendChild(aaa);
								}else if(j == liveTm +1){
									var aaa = document.createElement("div");
									var c;
									if(a == 0){
										c = a + hel1;
									}else{
										c = a;
									}
									g = (j-1+c);
									//aaa.style.width = (Wd-0.3) * c + "px";
									//aaa.className = "bbb";
									aaa.className = "bbb nomal";
									//aaa.setAttribute("id","flexNone");
									var name = g%24;
									aaa.setAttribute("name",name);
									mellDiv.appendChild(aaa);

								}else{

									var aaa = document.createElement("div");
									//aaa.style.width = (Wd-0.3) * hel1 + "px";
									aaa.className = "bbb";
									//aaa.setAttribute("id","flexNone");

									aaa.setAttribute("name", (g + (j - (liveTm +1)) * hel1) % 24);
									mellDiv.appendChild(aaa);
								}

							}
							mellDiv.setAttribute("id","flexNone");
						}else if (i <= qel1 - 1) {
							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "bbb";

								aaa.setAttribute("name",( 20 + (j+1)* hel1) % 24 );
								mellDiv.appendChild(aaa);
							}
						} else {
							for (j = 0; j < 24 / hel2; j++) {
								var aaa = document.createElement("div");
								aaa.className = "bbb";
								aaa.setAttribute("name",( 20 + (j+1)* hel2) % 24 );
								mellDiv.appendChild(aaa);
								// console.log(hel2)
							}
						}
						// console.log(i)
					}

				} else if (Boolean(qel2) && Boolean(qel3)) {


				} else {


					qel2 = null;
					hel2 = null;
					for (i = 0; i < 10; i++) {
						var mellDiv = document.getElementsByClassName("mellDay")[i];

						if(i == 0){

							var a = (45 - (liveTm+1)) % hel1;
							var b = Math.ceil((45 - (liveTm+1)) / hel1);
							var len = (liveTm+1) + b;
							var g;
							for (j = 0; j < len; j++) {
								if(j <= liveTm ){
									var aaa = document.createElement("div");
									aaa.className = "bbb";
									aaa.setAttribute("name",j);
									mellDiv.appendChild(aaa);
								}else if(j == liveTm +1){
									var aaa = document.createElement("div");
									var c;
									if(a == 0){
										c = a + hel1;
									}else{
										c = a;
									}
									g = (j-1+c);
									aaa.style.width = (Wd-0.3) * c + "px";
									//aaa.className = "bbb";
									aaa.className = "bbb nomal";
									aaa.setAttribute("id","flexNone");
									var name = g%24;
									aaa.setAttribute("name",name);
									mellDiv.appendChild(aaa);

								}else{

									var aaa = document.createElement("div");
									aaa.style.width = (Wd-0.3) * hel1 + "px";
									aaa.className = "bbb";
									aaa.setAttribute("id","flexNone");

									aaa.setAttribute("name", (g + (j - (liveTm +1)) * hel1) % 24);
									mellDiv.appendChild(aaa);
								}

							}
							mellDiv.setAttribute("id","flexNone");
						}else{

							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "bbb";
								aaa.setAttribute("name",( 20 + (j+1)* hel1) % 24 );
								mellDiv.appendChild(aaa);
							}
						}

					}
				}

			}else if (Tm < 6 ){

				var lengthMS = $(".mellDay").length;
				$("#all").css("width", ds * (lengthMS-1) + Wd*21);
				$(".mellDay").eq(lengthMS-1).remove();

				var oDiv = document.getElementsByClassName("mellDay")[0];
				oDiv.style.width = (ds + Wd*21)+"px";

				if (qel2 != 0 && qel3 == null) {

					for (i = 0; i < qel1 + qel2; i++) {
						var mellDiv = document.getElementsByClassName("mellDay")[i];

						if(i == 0){
							var tmpTm = liveTm;
							if(liveTm == 23){
								tmpTm = -1;
							}

							var a = (45 - (24+tmpTm+1)) % hel1;
							var b = Math.ceil((45 - (24+tmpTm+1)) / hel1);
							var len = (24+tmpTm+1) + b;

							var g;
							for (j = 0; j < len; j++) {
								if(j <= 24+tmpTm ){
									var aaa = document.createElement("div");
									aaa.className = "bbb";
									aaa.setAttribute("name",j % 24);
									mellDiv.appendChild(aaa);
								}else if(j == 24+tmpTm +1){
									var aaa = document.createElement("div");
									var c;
									if(a == 0){
										c = a + hel1;
									}else{
										c = a;
									}
									g = (j-24-1+c);
									//aaa.style.width = (Wd-0.3) * c + "px";
									//aaa.className = "bbb";
									aaa.className = "bbb nomal";
									//aaa.setAttribute("id","flexNone");
									aaa.setAttribute("name", g%24);
									mellDiv.appendChild(aaa);

								}else{

									var aaa = document.createElement("div");
									//aaa.style.width = (Wd-0.3) * hel1 + "px";
									aaa.className = "bbb";
									//aaa.setAttribute("id","flexNone");

									aaa.setAttribute("name", (g + (j - (24+tmpTm +1)) * hel1) % 24);
									mellDiv.appendChild(aaa);
								}

							}
							mellDiv.setAttribute("id","flexNone");
						}else if (i <= qel1 - 1) {
							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "bbb";

								aaa.setAttribute("name",( 20 + (j+1)* hel1) % 24 );
								mellDiv.appendChild(aaa);
							}
						} else {
							for (j = 0; j < 24 / hel2; j++) {
								var aaa = document.createElement("div");
								aaa.className = "bbb";
								aaa.setAttribute("name",( 20 + (j+1)* hel2) % 24 );
								mellDiv.appendChild(aaa);
								// console.log(hel2)
							}
						}
						// console.log(i)
					}

				} else if (Boolean(qel2) && Boolean(qel3)) {


				} else {

					qel2 = null;
					hel2 = null;
					for (i = 0; i < 10; i++) {
						var mellDiv = document.getElementsByClassName("mellDay")[i];

						if(i == 0){
							var tmpTm = liveTm;
							if(liveTm == 23){
								tmpTm = -1;
							}

							var a = (45 - (24+tmpTm+1)) % hel1;
							var b = Math.ceil((45 - (24+tmpTm+1)) / hel1);
							var len = (24+tmpTm+1) + b;

							var g;
							for (j = 0; j < len; j++) {
								if(j <= 24+tmpTm ){
									var aaa = document.createElement("div");
									aaa.className = "bbb";
									aaa.setAttribute("name",j % 24);
									mellDiv.appendChild(aaa);
								}else if(j == 24+tmpTm +1){
									var aaa = document.createElement("div");
									var c;
									if(a == 0){
										c = a + hel1;
									}else{
										c = a;
									}
									g = (j-24-1+c);
									aaa.style.width = (Wd-0.3) * c + "px";
									//aaa.className = "bbb";
									aaa.className = "bbb nomal";
									aaa.setAttribute("id","flexNone");
									aaa.setAttribute("name", g%24);
									mellDiv.appendChild(aaa);

								}else{

									var aaa = document.createElement("div");
									aaa.style.width = (Wd-0.3) * hel1 + "px";
									aaa.className = "bbb";
									aaa.setAttribute("id","flexNone");

									aaa.setAttribute("name", (g + (j - (24+tmpTm +1)) * hel1) % 24);
									mellDiv.appendChild(aaa);
								}

							}
							mellDiv.setAttribute("id","flexNone");
						}else{

							for (j = 0; j < 24 / hel1; j++) {
								var aaa = document.createElement("div");
								aaa.className = "bbb";
								aaa.setAttribute("name",( 20 + (j+1)* hel1) % 24 );
								mellDiv.appendChild(aaa);
							}
						}

					}
				}
			}






		}else{

			if (qel2 != 0 && qel3 == null) {

				for (i = 0; i < qel1 + qel2 + 1; i++) {
					var mellDiv = document.getElementsByClassName("mellDay")[i];
					if (i <= qel1 - 1) {
						for (j = 0; j < 24 / hel1; j++) {
							var aaa = document.createElement("div");
							aaa.className = "bbb";
							mellDiv.appendChild(aaa);
						}
					} else {
						for (j = 0; j < 24 / hel2; j++) {
							var aaa = document.createElement("div");
							aaa.className = "bbb";
							mellDiv.appendChild(aaa);
							// console.log(hel2)
						}
					}
					// console.log(i)
				}
			} else if (Boolean(qel2) && Boolean(qel3)) {

				for (i = 0; i < qel1 + qel2 + 1 + qel3; i++) {
					var mellDiv = document.getElementsByClassName("mellDay")[i];
					if (i <= qel1 - 1) {
						for (j = 0; j < 24 / hel1; j++) {
							var aaa = document.createElement("div");
							aaa.className = "bbb";
							mellDiv.appendChild(aaa);
						}
					} else if (i < qel1 - 1 + qel2) {
						for (j = 0; j < 24 / hel2; j++) {
							var aaa = document.createElement("div");
							aaa.className = "bbb";
							mellDiv.appendChild(aaa);
						}
					} else {
						for (j = 0; j < 24 / hel3; j++) {
							var aaa = document.createElement("div");
							aaa.className = "bbb";
							mellDiv.appendChild(aaa);
							// console.log(hel2)
						}
					}
					// console.log(i)
				}
			} else {

				qel2 = null;
				hel2 = null;
				for (i = 0; i < qel1 + 1; i++) {
					var mellDiv = document.getElementsByClassName("mellDay")[i];
					for (j = 0; j < 24 / hel1; j++) {
						var aaa = document.createElement("div");
						aaa.className = "bbb";
						mellDiv.appendChild(aaa);
					}
				}
			}

			if (Tm >= 6 && Tm < 18) {
				for (i = 0; i < $(".bbb").length; i++) {
					//console.log(timeSam[i])
					var mis = (timeSam[i] + 8) % 24;
					var misMs = (timeSam[i] + 8);
					$(".bbb").eq(i).attr("name", mis);
					$(".bbb").eq(i).attr("node", misMs);
				}
			} else if (Tm < 6 || Tm >= 18) {
				for (i = 0; i < $(".bbb").length; i++) {
					var mis = (timeSam[i] + 20) % 24;
					var misMs = (timeSam[i] + 20);
					$(".bbb").eq(i).attr("name", mis);
					$(".bbb").eq(i).attr("node", misMs);
				}
			}
		}




		/*if(ifLayer){
		 var small = $(".mellDay").eq(1).find(".bbb").width();  //清除border影响
		 var big = $(".mellDay").eq(1).width();
		 var nowTime = new Date().getHours();					//获取当前时刻
		 var startTime = Number($(".mellDay").eq(0).find(".bbb").eq(0).attr("name"));
		 var oDiv = document.getElementsByClassName("mellDay")[0];
		 var firstChild = oDiv.children[0];
		 console.log(startTime)
		 console.log(nowTime)
		 console.log(small)
		 oDiv.style.width = (big+nowTime*(small/hel1+1))+"px";
		 var starting;
		 if (Tm >= 6 && Tm < 18) {
		 starting = 8;
		 //				if(Math.abs(nowTime-starting))
		 var ches = Math.abs(nowTime-starting-hel1)%hel1;
		 if(Tm <=8){
		 ches += hel1;
		 }
		 console.log(ches)
		 for(i=0;i<nowTime+1;i++){                        //  时间是从0开始 9时刻 添加 9+1个盒子
		 var div = document.createElement("div");
		 div.style.width = small/hel1 + "px";
		 div.className = "bbb";
		 div.setAttribute("id","flexNone");
		 div.setAttribute("name",i);
		 oDiv.insertBefore(div,firstChild);
		 }
		 oDiv.setAttribute("id","flexNone");

		 var oAll = $("#all").width();
		 console.log(nowTime*(small/hel1+1))
		 var oAllWidth = (oAll+nowTime*(small/hel1+1))+"px";
		 document.getElementById("all").style.width = oAllWidth;


		 if(nowTime>=(starting)){
		 var removeChlid = parseInt((nowTime-starting-hel1)/hel1+1);
		 console.log(parseInt((nowTime-starting-hel1)/hel1+1))

		 if(nowTime == starting+hel1){

		 }

		 for(i=0;i<removeChlid;i++){
		 var all = $(".mellDay").eq(0).find(".bbb").length;
		 var small = $(".mellDay").eq(0).find(".bbb").eq(all-1).width();
		 var before = $(".mellDay #flexNone").length;
		 var eqLefs = before;
		 console.log(eqLefs)
		 $(".mellDay").eq(0).find(".bbb").eq(eqLefs).remove();



		 var ferWidth = $(".mellDay").eq(0).width();
		 var chesWidth = (ferWidth - small)+ "px";

		 $(".mellDay").eq(0).css("width",chesWidth);

		 var allWidth = $("#all").width();
		 var allchesWidth = (allWidth - small)+ "px";
		 $("#all").css("width",allchesWidth)

		 }

		 if(ches == 0){

		 }else{
		 $(".mellDay").eq(0).find(".bbb").eq(nowTime+1).attr("id","flexNone");
		 $(".mellDay").eq(0).find(".bbb").eq(nowTime+1).css("width",small/hel1* Math.abs(ches));
		 }


		 }



		 } else if (Tm < 6 || Tm >= 18) {

		 starting = 20;
		 console.log(Math.abs(nowTime-starting)%hel1)
		 for(i=0;i<nowTime+1;i++){
		 var div = document.createElement("div");
		 div.style.width = small/hel1 + "px";
		 div.className = "bbb";
		 div.setAttribute("id","flexNone");
		 div.setAttribute("name",i);
		 oDiv.insertBefore(div,firstChild);
		 }
		 oDiv.setAttribute("id","flexNone");

		 var oAll = $("#all").width();
		 var oAllWidth = (oAll+nowTime*(small/hel1+1))+"px";
		 document.getElementById("all").style.width = oAllWidth;
		 $(".mellDay").eq(0).find(".bbb").eq(nowTime+1).attr("id","flexNone");
		 $(".mellDay").eq(0).find(".bbb").eq(nowTime+1).css("width",small/hel1*(hel1-ches));
		 }

		 //纠偏！！！！！！！！
		 var lengthMS = $(".mellDay").length;
		 $(".mellDay").eq(lengthMS-1).remove();
		 }*/






// 		for(i=0;i<=nowTime;i++){
// 			var div = document.createElement("div");
// 			div.style.width = small/hel1 + "px";
// 			div.className = "bbb";
// 			div.setAttribute("id","flexNone");
// 			div.setAttribute("name",i);
// 			oDiv.insertBefore(div,firstChild);
// 		}
// 		oDiv.setAttribute("id","flexNone");
//
// 		var oAll = $("#all").width();
// 		var oAllWidth = (oAll+nowTime*(small/hel1+1))+"px";
// 		document.getElementById("all").style.width = oAllWidth;


	}

	//处理实况部分方案
	function changeDiv(){
		var small = $(".mellDay").eq(1).find(".bbb").width();
		var nowTime = newData.getHours();
		//console.log(nowTime)
		//console.log(small)
	}


	// 设置时间轴的星期以及日期和时间的指针
	function weekDell() {
		var dayNum;
		if (Tm >= 6 && Tm < 18) {
			nuTm = 8;
			dayNum = newDate.getDay();  // Tm>=6&&Tm<18    第一个messDay 为当前的日期
		} else if (Tm < 6) {
			nuTm = 20;
			dayNum = newDate.getDay() - 1;    // Tm<6  起报时间为前一天20时  所以 weekDay - 1 天.
		} else if (Tm >= 18) {
			nuTm = 20;
			//对应星期
			dayNum = newDate.getDay();     // Tm>=18  起报时间为当前20时
		}

		for (i = 0; i < dayes; i++) {
			//循环设置时间轴下边的星期
			var txtSpan1 = document.createElement("span");
			var dateStyle = document.getElementById("dateStyle");
			txtSpan1.className = "messDay";
			weekDay = dayNum++;
			if (weekDay > 7) {
				dayNum = 1;
				weekDay = dayNum++;
			}
			weekOne(weekDay, txtSpan1);
			dateStyle.appendChild(txtSpan1);
		}
		//设置时间轴上随时间的变化而产生的星期、日期、时间变化的的上边的指针
		var p = document.createElement("p");
		var span = document.getElementById("pointer");
		p.className = "pDay";//用来存储日期的天
		span.appendChild(p);
		var numDay = newDate.getDate();
		//加载时间轴上日期的值
		DateCruer(p, numDay);
	}


	/*//指针运动（根据当前时间确定的 ，指针每次移动距离是每小时的时间长）
	 function pointerAction(ifLayer) {
	 Divs = $(".mellDay").length;
	 lineAll = parseInt($("#all").css("width"));
	 lineDay = lineAll / Divs;
	 lineHours = lineDay / 24;
	 spanPointer = parseInt($("#pointer").css("width")) / 2;

	 var weekDay;  //默认初始week；

	 if (Tm >= 6 && Tm < 18) {
	 nuTm = 8;
	 weekDay = newDate.getDay();  // Tm>=6&&Tm<18    第一个messDay 为当前的日期
	 } else if (Tm < 6) {
	 nuTm = 20;
	 weekDay = newDate.getDay() - 1;    // Tm<6  起报时间为前一天20时  所以 weekDay - 1 天.
	 } else if (Tm >= 18) {
	 nuTm = 20;
	 weekDay = newDate.getDay();     // Tm>=18  起报时间为当前20时
	 }

	 //页面刷新默认情况
	 var stry = $(".mellDay").eq(0).find(".bbb").eq(0).width() + 1;
	 var message = $(".mellDay").eq(0).find(".bbb").eq(0).attr("name");
	 // console.log(stry)
	 var weizhi = stry - spanPointer + "px";
	 // console.log(weizhi)

	 $(".mellDay").eq(0).find(".bbb").eq(0).addClass("red");
	 $("#pointer").css("left", weizhi);
	 $("#pointer .xs").html(message + ":00");
	 //周 ：判断
	 weekWidth(ifLayer);
	 //				bWeek(weekDay);

	 }*/

	//指针运动（根据当前时间确定的 ，指针每次移动距离是每小时的时间长）
	function pointerAction(ifLayer) {
		if(ifLayer){
			var oSmall  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[0]).width)+1;
			if(Tm < 6){
				var tmpTm = liveTm;
				if(liveTm == 23){
					tmpTm = -1;
				}
				for(i=0;i<tmpTm+24+2;i++){
					$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
				}
				var nowDiv = $(".mellDay").eq(0).find(".bbb").eq(tmpTm+24+1).width()+1;
				var line = (tmpTm+24+1)*oSmall+nowDiv - $("#pointer").width()/2 +"px";

				$("#pointer").css("left",line);
				var oTime = $(".messDay").eq(1).html().substr(0,2);
				var redlen = $(".red").length;
				var oHours = $(".red").eq(redlen-1).attr("name");

				$(".xs").html(oHours+":00");

				$("#pointer b").html(oTime);
			}else{
				for(i=0;i<liveTm+2;i++){
					$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
				}

				var nowDiv = $(".mellDay").eq(0).find(".bbb").eq(liveTm+1).width()+1;
				var line = (liveTm+1)*oSmall+nowDiv - $("#pointer").width()/2 +"px";

				$("#pointer").css("left",line);
				var oTime = $(".messDay").eq(0).html().substr(0,2);
				var redlen = $(".red").length;
				var oHours = $(".red").eq(redlen-1).attr("name");

				$(".xs").html(oHours+":00");

				$("#pointer b").html(oTime);
			}
		}else{
			Divs = $(".mellDay").length;
			lineAll = parseInt($("#all").css("width"));
			lineDay = lineAll / Divs;
			lineHours = lineDay / 24;
			spanPointer = parseInt($("#pointer").css("width")) / 2;

			var weekDay;  //默认初始week；

			if (Tm >= 6 && Tm < 18) {
				nuTm = 8;
				weekDay = newDate.getDay();  // Tm>=6&&Tm<18    第一个messDay 为当前的日期
			} else if (Tm < 6) {
				nuTm = 20;
				weekDay = newDate.getDay() - 1;    // Tm<6  起报时间为前一天20时  所以 weekDay - 1 天.
			} else if (Tm >= 18) {
				nuTm = 20;
				weekDay = newDate.getDay();     // Tm>=18  起报时间为当前20时
			}

			//页面刷新默认情况
			var stry = $(".mellDay").eq(0).find(".bbb").eq(0).width() + 1;
			var message = $(".mellDay").eq(0).find(".bbb").eq(0).attr("name");
			// console.log(stry)
			var weizhi = stry - spanPointer + "px";
			// console.log(weizhi)

			$(".mellDay").eq(0).find(".bbb").eq(0).addClass("red");
			$("#pointer").css("left", weizhi);
			$("#pointer .xs").html(message + ":00");
			//周 ：判断
			weekWidth(ifLayer);
			//				bWeek(weekDay);
		}

		// 实况预报分界
		if(ifLayer){
			divide();
		}else{
			$(".divide").css({"display":"none"});
		}
	}

	// 实况预报分界线
	function divide(){
		if(isMobile()){
			var divide = document.createElement("div");
			divide.className = "divide";
			var left;
			if(Tm<6){
				var temp=liveTm;
				if(liveTm==23){
					temp=-1;
				}
				left=(24+temp+1)*20+"px";
			}else{
				left=(liveTm+1)*20+"px";
			}
			document.getElementById("parst").appendChild(divide);
			divide.style.left = left;
		}else{
			var divide = document.createElement("div");
			divide.className = "divide";
			var left;
			if(Tm<6){
				var temp=liveTm;
				if(liveTm==23){
					temp=-1;
				}
				left=(24+temp+1)*20+"px";
			}else{
				left=(liveTm+1)*20+"px";
			}
			document.getElementById("parst").appendChild(divide);
			divide.style.left = left;
			//	var divide = document.createElement("div");
			//	divide.className = "divide";
			//	var red = $(".red").length;
			//	var redWd =parseFloat(document.defaultView.getComputedStyle($(".red")[0]).width)+1;
			//	var left = (red-1)*redWd-1 +"px";
			//	document.getElementsByClassName("vues")[0].appendChild(divide);
			//	divide.style.left = left;
		}

	}

	//控制进度条长度
	function delTsp() {
		$("#all .mellDay:last-child").remove();
		//ds : 删除末尾多余mellDay时的$("#all")的宽度
		var ds = spWidth - ($("#dateStyle").width() / $("#dateStyle span").length)
		$("#all").css("width", ds)
		var Wd = $(".mellDay").width() / 24;
		var LoneOne = Wd * (8+1) + "px";
		var LoneTwo = Wd * (20+1) + "px";
		var LineOne = Wd * 16 + "px";
		var LineTwo = Wd * 4 + "px";
		var str=""
		if (Tm >= 6 && Tm < 18) {
			$("#all").css("left", LoneOne);
//					alert("控制进度条--走 当天 8时预报")
		} else if (Tm < 6) {
			$("#all").css("left", LoneTwo);
//					alert("控制进度条--走 前一天 20时预报")
		} else if (Tm >= 18) {
			$("#all").css("left", LoneTwo);
//					alert("控制进度条--走 当天 20时预报")
		}
//         console.log(Tm)
//        if(Tm>= 6 && Tm<18){
//            $("#all .mellDay").eq(0).html("");
//            for(var i=0;i<Tm;i++){
//                str+='<div style="width:'+Wd+'px" class="bbb red" name="'+(i+1)+'"></div>'
//            }
//            str+='<div style="width:'+Wd*((23-Tm)%3)+'px" class="bbb red" name="'+(Tm+(23-Tm)%3)+'"></div>'
//            var len=(23-(Tm+(23-Tm)%3))/3;
//            for(var i=1;i<=len;i++){
//                str+='<div style="width:'+Wd*3+'px" class="bbb red" name="'+(Tm+(23-Tm)%3+i*3)+'"></div>'
//            }
//            str+='<div style="width:'+Wd*3+'px" class="bbb red" name="24"></div>'
//            $("#all .mellDay").eq(0).html(str);
//            $("#all").css("left", Wd+"px");
//        }
	}

	//停止自动播放
	function moveStop() {
		window.clearInterval(time);
	}

	//阻止浏览器默认的行为
	function stopDef(e) {
		if (e && e.preventDefault) e.preventDefault();
		else window.event.returnValue = false;
		return false;
	}

	// 鼠标滑过显示时间事件
	function timeBk() {
		for (i = 0; i < $(".bbb").length; i++) {
			$(".bbb").eq(i).mousemove(function () {
//						alert($(this).attr("name"))
				var title = $(this).attr("name");
				$("#time span").html(title + ":00");
				$("#time").css("display", "block");
				var num = $("#time").width() / 2;
				var ches = ($("html").width() - $("footer").width()) / 2;
				var theEvent = window.event || arguments.callee.caller.arguments[0];
				var mX = theEvent.pageX ? theEvent.pageX : theEvent.x;
				//console.log(mX)
				xLinessPs = mX - ches - num;
				//xLinessPs=event.pageX-ches-num;
				lineMax = lineAll;
				lineMin = ches;
				if (xLinessPs <= 0 - num) {
					xLinessPs = 0 - num;
				} else if (xLinessPs >= lineMax + num) {
					xLinessPs = lineMax + num;
				}
				$("#time").css("left", xLinessPs);
				var codMin = parseInt($("#pointer").css("left"));
				var codMax = parseInt($("#pointer").css("left")) + $("#time span").width() + $("#pointer").width();
				var lineMoue = mX - ches;
				if (lineMoue >= codMin && lineMoue <= codMax) {
					$("#time").css("top", "-50px");
				} else {
					$("#time").css("top", "-28px");
				}
			})
		}

		$(".bbb").mouseleave(function () {
			$("#time").css("display", "none");
		})
	}


	//动态显示当前时间
	function timeOeel() {
		var xLine = event.offsetX;
		var xPointer = parseInt(xLine) - spanPointer + "px";
		var Gnum = parseInt(xLine / lineDay) + newDate.getDay();
		bWeek(Gnum);
		// console.log(newDate.getDay())
		// console.log(Gnum)
	}

	//b-week
	function bWeek(Gnum) {
		var piont = document.getElementById("pointer");
		var b = pointer.getElementsByTagName("b")[0];
		if (Gnum > 7) {
			Gnum = Gnum - 7;
		}
		weekOne(Gnum, b);
	}

	//格式一 ： week  所求时间的星期的匹配对应
	function weekOne(weekDay, obj) {
		switch (weekDay) {
			case 0 :
				obj.innerHTML = "周日" + "<p></p>";
				break;
			case 1 :
				obj.innerHTML = "周一" + "<p></p>";
				break;
			case 2 :
				obj.innerHTML = "周二" + "<p></p>";
				break;
			case 3 :
				obj.innerHTML = "周三" + "<p></p>";
				break;
			case 4 :
				obj.innerHTML = "周四" + "<p></p>";
				break;
			case 5 :
				obj.innerHTML = "周五" + "<p></p>";
				break;
			case 6 :
				obj.innerHTML = "周六" + "<p></p>";
				break;
			case 7 :
				obj.innerHTML = "周日" + "<p></p>";
				break;
		}
	}

	//格式二： week
	function weekTwo(weekDay, obj) {
		switch (weekDay) {
			case 1 :
				obj.innerHTML = "Monday";
				break;
			case 2 :
				obj.innerHTML = "Tuesday";
				break;
			case 3 :
				obj.innerHTML = "Wednesday";
				break;
			case 4 :
				obj.innerHTML = "Thursday";
				break;
			case 5 :
				obj.innerHTML = "Friday";
				break;
			case 6 :
				obj.innerHTML = "Saturday";
				break;
			case 7 :
				obj.innerHTML = "Sunday";
				break;
		}
	}

	// date
	//显示日期
	function dateRs() {
		var numDay;
		if (Tm >= 6 && Tm < 18) {
			numDay = newDate.getDate();  // Tm>=6&&Tm<18    第一个messDay 为当前的日期
			startTime = newDate;
		} else if (Tm < 6) {
			nuTm = 20;
			numDay = newDate.getDate() - 1;    // Tm<6  起报时间为前一天20时  所以 numDay - 1 天.
			//startTime=moment().subtract(1,"day");
			//startTime = new Date(new Date() - 24 * 60 * 60 * 1000);
			startTime = newDate;
		} else if (Tm >= 18) {
			nuTm = 20;
			numDay = newDate.getDate();     // Tm>=18  起报时间为当前20时
			startTime = newDate;
		}
		// var numDay = newDate.getDate(); //（从一天前开始展示，所以 - 1）
		var j = 0;
		for (i = 0; i < $(".messDay").length; i++) {
			var spanWk = document.getElementsByClassName("messDay")[i];
			var b = document.createElement("b");
			b.className = "dayName";
			var numMonth = newDate.getMonth() + 1;
			if (isLeapYear(newDate.getYear())) {
				if (numMonth == 1 || numMonth == 3 || numMonth == 5 || numMonth == 7 || numMonth == 8 || numMonth == 10 || numMonth == 12) {
					// console.log(numDay)
					if (numDay <= 31) {
						b.innerHTML = numMonth + "  -  " + numDay;
						numDay = numDay + 1;
					} else {
						j = j + 1;
						b.innerHTML = numMonth + 1 + "  -  " + j;
					}
				} else if (numMonth == 4 || numMonth == 6 || numMonth == 9 || numMonth == 11) {
					if (numDay <= 30) {
						numDay = numDay + 1;
						b.innerHTML = numMonth + "  -  " + numDay;
					} else {
						j = j + 1;
						b.innerHTML = numMonth + 1 + "  -  " + j;
					}
				} else if (numMonth == 2) {
					if (numDay <= 29) {
						numDay = numDay + 1;
						b.innerHTML = numMonth + "  -  " + numDay;
					} else {
						j = j + 1;
						b.innerHTML = numMonth + 1 + "  -  " + j;
					}
				}
			} else {
				if (numMonth == 1 || numMonth == 3 || numMonth == 5 || numMonth == 7 || numMonth == 8 || numMonth == 10 || numMonth == 12) {
					// console.log(numDay)
					if (numDay <= 31) {
						b.innerHTML = numMonth + "  -  " + numDay;
						numDay = numDay + 1;
					} else {
						j = j + 1;
						b.innerHTML = numMonth + 1 + "  -  " + j;
					}
				} else if (numMonth == 4 || numMonth == 6 || numMonth == 9 || numMonth == 11) {
					if (numDay <= 30) {
						b.innerHTML = numMonth + "  -  " + numDay;
						numDay = numDay + 1;
					} else {
						j = j + 1;
						b.innerHTML = numMonth + 1 + "  -  " + j;
					}
				} else if (numMonth == 2) {
					if (numDay <= 28) {
						b.innerHTML = numMonth + "  -  " + numDay;
						numDay = numDay + 1;
					} else {
						j = j + 1;
						b.innerHTML = numMonth + 1 + "  -  " + j;
					}
				}
			}
			spanWk.appendChild(b);
			numMonth += i;
		}
	}

	//判断是否是闰年
	function isLeapYear(year) {
		var cond1 = year % 4 == 0;  //条件1：年份必须要能被4整除
		var cond2 = year % 100 != 0;  //条件2：年份不能是整百数
		var cond3 = year % 400 == 0;  //条件3：年份是400的倍数
		//判断闰年的表达式：
		var cond = cond1 && cond2 || cond3;
		if (cond) {
			return true;
		} else {
			return false;
		}
	}

	//加载时间轴上日期的值
	function DateCruer(obj, numDay) {
		var numMonth = newDate.getMonth() + 1;//当前的月份
		if (isLeapYear(newDate.getYear())) {
			if (numMonth == 1 || numMonth == 3 || numMonth == 5 || numMonth == 7 || numMonth == 8 || numMonth == 10 || numMonth == 12) {
				if (numDay <= 31) {
					obj.innerHTML = numDay;
					numDay = numDay + 1;
				} else {
					j = j + 1;
					obj.innerHTML = j;
				}
			} else if (numMonth == 4 || numMonth == 6 || numMonth == 9 || numMonth == 11) {
				if (numDay <= 30) {
					obj.innerHTML = numDay;
					numDay = numDay + 1;
				} else {
					j = j + 1;
					obj.innerHTML = j;
				}
			} else if (numMonth == 2) {
				if (numDay <= 29) {
					obj.innerHTML = numDay;
					numDay = numDay + 1;
				} else {
					j = j + 1;
					obj.innerHTML = j;
				}
			}
		} else {
			if (numMonth == 1 || numMonth == 3 || numMonth == 5 || numMonth == 7 || numMonth == 8 || numMonth == 10 || numMonth == 12) {
				// console.log(numDay)
				if (numDay <= 31) {
					obj.innerHTML = numDay;
					numDay = numDay + 1;
				} else {
					j = j + 1;
					obj.innerHTML = j;
				}
			} else if (numMonth == 4 || numMonth == 6 || numMonth == 9 || numMonth == 11) {
				if (numDay <= 30) {
					obj.innerHTML = numDay;
					numDay = numDay + 1;
				} else {
					j = j + 1;
					obj.innerHTML = j;
				}
			} else if (numMonth == 2) {
				if (numDay <= 28) {
					obj.innerHTML = numDay;
					numDay = numDay + 1;
				} else {
					var s = numDay - 28;
					obj.innerHTML = s;
					numDay = numDay + 1;
				}
			}
		}
	}


	function go(ifLayer) {

		if(ifLayer){
			var redLength = $(".red").length;
			var redMellLength = $(".redMellDay").length;
			var firstMellDay = $(".mellDay").eq(0).width();
			var secondMellDay = $(".mellDay").eq(1).width();
			var firstLength = $(".mellDay").eq(0).find(".bbb").length;
			var secondLength = $(".mellDay").eq(1).find(".bbb").length;
			var mellLength = $(".mellDay").length;
			//console.log(redLength)
			//console.log(redMellLength)
			//console.log($(".mellDay").length)
			if(redMellLength == 0){
				$(".mellDay").eq(0).find(".bbb").eq(redLength).addClass("red");
				var red = $(".red").length;
				if( red == firstLength){

					$(".mellDay").eq(0).addClass("redMellDay");
					$(".mellDay").eq(0).find(".bbb").removeClass("red");
				}
			}else if(redMellLength > 0 && redMellLength < mellLength){
				var leng = $(".mellDay").eq(redMellLength).find(".red").length;
				if(leng == 0){   													// 第二个div没有red存在时  creat first red
					$(".mellDay").eq(redMellLength).find(".bbb").eq(0).addClass("red");
				}else{																// 如果存在red  下标为 red的个数的bbb addClass red
					$(".mellDay").eq(redMellLength).find(".bbb").eq(leng).addClass("red");

					var red = $(".mellDay").eq(redMellLength).find(".red").length;

					if( red == secondLength){										// if red length == bbb length  >  all bbb removeClass red , parent div addClass redmellDay

						$(".mellDay").eq(redMellLength).addClass("redMellDay");
						$(".mellDay").eq(redMellLength).find(".bbb").removeClass("red");
					}
				}
			}else if(redMellLength == mellLength){        // if all mellDay div  addClass remMellDay , go first start!
				$(".mellDay").removeClass("redMellDay");
				$(".mellDay").eq(0).find(".bbb").eq(0).addClass("red");
			}
		}else{
			var redLength = $(".red").length;
			var redMellLength = $(".redMellDay").length;
			var redbbb = $(".red").eq(redLength - 1);
			var redMellDay = redbbb.parent(".mellDay").index();
			var tebDom = $(".mellDay").eq(0).find(".bbb").length; //第一个mellDay的。bbb的个数
			var tebDomQel2 = $(".mellDay").eq(qel2 - 1).find(".bbb").length;  //类型二 第二种
			var tebDomQel3;
			var mellNum = $(".mellDay").length;
			if (Boolean(qel3)) {
				tebDomQel3 = $(".mellDay").eq(qel2 + qel3 - 1).find(".bbb").length;  //类型二 第二种
			}

			//     //清除之前的样式
			$(".mellDay").removeClass("redMellDay");
			$(".bbb").removeClass("red");

			redLength = redLength + 1;
			// console.log(qel2)

			if (redMellDay <= 3) {
				//console.log(111)
				for (k = 0; k < redLength; k++) {
					$(".mellDay").eq(redMellDay - 3).find(".bbb").eq(k).addClass("red");
				}
				if (redLength > tebDom) {
					//console.log("111sss")
					redLength = 1;
					redMellDay = redMellDay + 1;
					$(".bbb").removeClass("red");
					for (k = 0; k < redLength; k++) {
						$(".mellDay").eq(redMellDay - 3).find(".bbb").eq(k).addClass("red");
					}
					for (j = 0; j <= redMellDay - 4; j++) {
						$(".mellDay").eq(j).addClass("redMellDay");
					}
				}
			} else if (redMellDay - 3 >= mellNum - 1 && redLength > tebDom || redMellDay - 3 >= mellNum - 1 && redLength > tebDomQel2 || redMellDay - 3 >= mellNum - 1 && redLength >= tebDomQel3) {
				//console.log(222)
				$(".mellDay").removeClass("redMellDay");
				redMellDay = 3;
				redLength = 1;
				for (k = 0; k < redLength; k++) {
					$(".mellDay").eq(redMellDay - 3).find(".bbb").eq(k).addClass("red");
				}
			} else {
				//console.log(333)
				if (Boolean(qel2) && qel3 == null) {
					if (redMellDay - 3 < qel1) {
						if (redLength > tebDom) {
							redLength = 1;
							redMellDay = redMellDay + 1;
						}
						$(".bbb").removeClass("red");
						for (k = 0; k < redLength; k++) {
							$(".mellDay").eq(redMellDay - 3).find(".bbb").eq(k).addClass("red");
						}
						for (j = 0; j <= redMellDay - 4; j++) {
							$(".mellDay").eq(j).addClass("redMellDay");
						}
					} else {
						if (redLength > tebDomQel2) {
							//console.log(redLength)
							//console.log(tebDomQel2)
							redLength = 1;
							redMellDay = redMellDay + 1;
						}
						$(".bbb").removeClass("red");
						for (k = 0; k < redLength; k++) {
							$(".mellDay").eq(redMellDay - 3).find(".bbb").eq(k).addClass("red");
						}
						for (j = 0; j <= redMellDay - 4; j++) {
							$(".mellDay").eq(j).addClass("redMellDay");
						}
					}
				} else if (Boolean(qel2) && Boolean(qel3)) {

					if (redMellDay - 3 < qel1) {
						//console.log("aaaa")
						if (redLength > tebDom) {
							redLength = 1;
							redMellDay = redMellDay + 1;
						}
						$(".bbb").removeClass("red");
						for (k = 0; k < redLength; k++) {
							$(".mellDay").eq(redMellDay - 3).find(".bbb").eq(k).addClass("red");
						}
						for (j = 0; j <= redMellDay - 4; j++) {
							$(".mellDay").eq(j).addClass("redMellDay");
						}
					} else {
						//console.log("bbb")
						if (redLength > tebDomQel2) {
							redLength = 1;
							redMellDay = redMellDay + 1;

						}
						//console.log("ss" + redMellDay)
						//console.log("ss" + ($(".mellDay").length - qel3 - 1))
						if (redMellDay - 3 >= $(".mellDay").length - qel3 - 1) {

							if (redLength > tebDomQel3) {
								//console.log("bbbb_1111")
								//console.log(redLength)
								//console.log(tebDomQel2)
								redLength = 1;
								redMellDay = redMellDay + 1;
								//console.log(redLength)
								//console.log(tebDomQel2)
								//console.log(redMellDay)
							}
						}

						//console.log(redLength)
						//console.log(tebDomQel2)
						//console.log(redMellDay)
						$(".bbb").removeClass("red");
						for (k = 0; k < redLength; k++) {
							$(".mellDay").eq(redMellDay - 3).find(".bbb").eq(k).addClass("red");
						}
						for (j = 0; j <= redMellDay - 4; j++) {
							$(".mellDay").eq(j).addClass("redMellDay");
						}
					}
				} else {
					if (redLength > tebDom) {
						redLength = 1;
						redMellDay = redMellDay + 1;
					}
					$(".bbb").removeClass("red");
					for (k = 0; k < redLength; k++) {
						$(".mellDay").eq(redMellDay - 3).find(".bbb").eq(k).addClass("red");
					}
					for (j = 0; j <= redMellDay - 4; j++) {
						$(".mellDay").eq(j).addClass("redMellDay");
					}
				}
			}
		}

		//console.log(redLength)
		//console.log(tebDomQel3)
		//console.log(redMellDay - 3)
		//console.log(mellNum - 1)
		//console.log(redMellDay - 3 >= mellNum - 1)
		//console.log(redLength >= tebDomQel3)

		if(!ifLayer){
			// console.log(redLength)
			// console.log(redMellDay)
			//避免变量污染 重新定义获取存在颜色的div个数
			var smarlDiv = $(".red").length;
			var bigDiv = $(".redMellDay").length;
			var smarlWidthQel3
			var smarlWidth = $(".mellDay").eq(0).find(".bbb").width() + 1;  // +1是因为有1px的border
			var bigWidth = $(".mellDay").width();
			var smarlWidthQel2 = $(".mellDay").eq(qel2 - 1).find(".bbb").width() + 1;
			var qel1Length = $(".mellDay").eq(0).find(".bbb").length;
			var bbbFloatValue = $(".mellDay").width() / qel1Length;
			//console.log(redMellDay - 3)
			//console.log($(".mellDay").length - qel3 - 1)


			if (Boolean(qel3)) {
				smarlWidthQel3 = $(".mellDay").eq(qel3 + qel2 - 1).find(".bbb").width() + 1;
				;  //类型二 第二种
			}

			if (Boolean(qel2) && qel3 == null) {
				if (redMellDay - 3 >= qel1) {
					var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
					$("#pointer .xs").html(titleSmal);
					var weizhi = smarlWidthQel2 * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
					$("#pointer").css("left", weizhi);
				} else {
					var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
					$("#pointer .xs").html(titleSmal);
					var weizhi = bbbFloatValue * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
					$("#pointer").css("left", weizhi);
				}
			} else if (Boolean(qel2) && Boolean(qel3)) {
				if (redMellDay - 3 >= $(".mellDay").length - qel3 - 1) {
					var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
					$("#pointer .xs").html(titleSmal);
					//console.log(smarlDiv)
					//console.log(bigDiv)
					//console.log(smarlWidthQel3)
					//console.log(bigWidth)
					var weizhi = smarlWidthQel3 * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
					$("#pointer").css("left", weizhi);
				} else if (redMellDay - 3 >= qel1) {
					var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
					$("#pointer .xs").html(titleSmal);
					var weizhi = smarlWidthQel2 * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
					$("#pointer").css("left", weizhi);
				} else {
					var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
					$("#pointer .xs").html(titleSmal);
					var weizhi = bbbFloatValue * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
					$("#pointer").css("left", weizhi);
				}
			} else {
				if ($(".mellDay").length <= bigDiv) {
					var titleSmal = $(".redMellDay").eq(bigDiv - 1).find(".bbb").last().attr("name") + ":00";
					$("#pointer .xs").html(titleSmal);
					var weizhi = smarlWidth * smarlDiv + bigWidth * (bigDiv - 1) - spanPointer + "px";
					$("#pointer").css("left", weizhi);
				} else {
					var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
					$("#pointer .xs").html(titleSmal);
					var weizhi = smarlWidth * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
					$("#pointer").css("left", weizhi);
				}
			}
			//console.log(weizhi)
			var obj = $(".select span").html();
			var featureData = getCheckedFeatureData(obj);
			//if(!mapClickFlag){
			//    initGif(featureData);
			//}
			getUrl(nuTm, startTime, featureData);
		}else{
			var bigRed = $(".redMellDay").length;
			var smallRed = $(".red").length
			var firstMell = $(".mellDay").eq(0).width();
			var secondMell = $(".mellDay").eq(1).width();
			var lastIndex=$("#all").find(".bbb").length;
			//var secondSmall = $(".mellDay").eq(1).find(".bbb").eq(0).width()+1;
			var secondSmall =parseFloat(document.defaultView.getComputedStyle($(".bbb")[lastIndex-1]).width)+1;

			//var oWd = $(".mellDay").eq(0).find(".bbb").eq(0).width()+1;
			//var secondSmall =document.defaultView.getComputedStyle($(".mellDay").eq(1).find(".bbb").eq(0)).width()+1;
			//var ele=;
			var oWd  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[0]).width)+1;
			var ches = $("#pointer").width();
			if (Boolean(qel2) && qel3 == null) {
				if(bigRed == 0){

					var red = $(".mellDay").eq(0).find(".red").length;
					var nomal = $(".mellDay").eq(0).find(".nomal").index();
					var lastWd = $(".mellDay").children("div:last-child").width();
					var nomalWd = $(".nomal").width();
					// 判断实况预报结合的 三种不同宽度：

					if( red < nomal + 1 ){
						var pointLine = oWd * red - ches/2 + "px";
						$("#pointer").css("left",pointLine);

					}else if( red == nomal + 1){

						var pointLine = (red-1)*oWd + nomalWd -ches/2 +"px";
						$("#pointer").css("left",pointLine);

					}else{
						//var pointLine = nomal * oWd + nomalWd + (red-nomal-1) * lastWd - ches/2 +"px";
						var pointLine = nomal * oWd + nomalWd + (red-nomal-1) * oWd - ches/2 +"px";

						$("#pointer").css("left",pointLine);

					}

				}else if(bigRed > 0){
					var bigLine = (bigRed -1 )*secondMell;
					var smallLine = smallRed * secondSmall;
					var pointLine = firstMell + bigLine +smallLine - ches/2 + "px";
					$("#pointer").css("left",pointLine);
				}
			} else if (Boolean(qel2) && Boolean(qel3)) {


			} else {
				if(bigRed == 0){

					var red = $(".mellDay").eq(0).find(".red").length;
					var nomal = $(".mellDay").eq(0).find(".nomal").index();
					var lastWd = $(".mellDay").children("div:last-child").width();
					var nomalWd = $(".nomal").width();
					// 判断实况预报结合的 三种不同宽度：

					if( red < nomal + 1 ){
						var pointLine = oWd * red - ches/2 + "px";
						$("#pointer").css("left",pointLine);

					}else if( red == nomal + 1){
						var pointLine = (red-1)*oWd + nomalWd -ches/2 +"px";
						$("#pointer").css("left",pointLine);

					}else{
						//var pointLine = nomal * oWd + nomalWd + (red-nomal-1) * lastWd - ches/2 +"px";
						var pointLine = nomal * oWd + nomalWd + (red-nomal-1) * oWd*hel1 - ches/2 +"px";

						$("#pointer").css("left",pointLine);

					}

				}else if(bigRed > 0){
					var bigLine = (bigRed -1 )*secondMell;
					var smallLine = smallRed * secondSmall;
					var pointLine = firstMell + bigLine +smallLine - ches/2 + "px";
					$("#pointer").css("left",pointLine);
				}

			}



			var reds = $(".red").length;
			var hours = $(".red").eq(reds-1).attr("name") + ":00";
			if(reds == 0){
				var bigRedLength = $(".redMellDay").length;
				var noWell = $(".redMellDay").eq(bigRedLength-1).find(".bbb").length;
				var hours = $(".redMellDay").eq(bigRedLength-1).find(".bbb").eq(noWell-1).attr("name") + ":00";
			}
			$("#pointer .xs").html(hours);

			var obj = $(".select span").html();
			var featureData = getCheckedFeatureData(obj);

			getUrl(nuTm, startTime, featureData);


		}


		//var url = path +getfile($(".select span").html()) + getUrl(nuTm,startTime);
		/*var fileName = getFileName(nuTm, startTime, featureData);
		 var url =  path + featureData.relativepath + "/" + fileName + ".2.png";

		 if(currentLayer == null){
		 var errorTileUrl="images/empty.png";
		 var mapOptions = {title: "", opacity:0.8, fadeAnimation: false, bounds:[[0.0,70.0],[60.0,140.0]], assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
		 currentLayer = new shell.MeteoLayer({url: url, styleKey: featureData.style, nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions});

		 if(currentLayer){
		 currentLayer.addTo(map);
		 currentLayer.on('layerAdded', function (layer) {
		 console.log('layerAdded');
		 var drawStyle = layer.drawStyle;
		 if (drawStyle.paletteEntries) {
		 shell.application.paletteBar.update(drawStyle.paletteEntries);
		 }
		 shell.application.paletteBar.show();
		 });
		 }

		 if(shell.application.currentLayer!=undefined){
		 var layer = shell.application.currentLayer;
		 map.removeLayer(layer);
		 }
		 var vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
		 var vectorTileLayer = new shell.MeteoLayer({layerType:"VectorTile",styleKey:featureData.style,url:[vectorUrl,""]});
		 //vectorTileLayer.nodeInfo = obj;
		 vectorTileLayer.addTo(map);

		 }else{
		 currentLayer.layers.origin.layer.setOpacity(0);
		 if(featureData.imageLayerVisible == true){
		 currentLayer.layers.origin.layer.setUrl(url);
		 currentLayer.layers.origin.layer.setOpacity(0.8);
		 }

		 if(shell.application.currentLayer!=undefined){
		 var layer = shell.application.currentLayer;
		 map.removeLayer(layer);
		 }
		 var vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
		 var vectorTileLayer = new shell.MeteoLayer({layerType:"VectorTile",styleKey:featureData.style,url:[vectorUrl,""]});
		 //vectorTileLayer.nodeInfo = obj;
		 vectorTileLayer.addTo(map);
		 }*/
		if (currentLatLng != null && mapClickFlag && yxMapClick) {
			pickValue(currentLatLng);
		}
		/*if(currentLayer == null){
		 var errorTileUrl="images/empty.png";
		 var mapOptions = {title: "", opacity:0.8, fadeAnimation: false, bounds:[[0.0,70.0],[60.0,140.0]], assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
		 currentLayer = new shell.MeteoLayer({url: url, styleKey: "test4", nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions});
		 currentLayer.addTo(map);
		 }else{
		 currentLayer.layers.origin.layer.setUrl(url);
		 }*/
		// console.log(getUrl(nuTm,startTime))
		//imageOverlay.setUrl(url);
		//console.log(url);
	}


	//返回前一个
	function Back(ifLayer) {
		//console.log(ifLayer)

		if(ifLayer){
			if (Boolean(qel2) && !Boolean(qel3)) {
				//两种时效的
				if(Tm<6){
					var a=44;
				}else{
					var a=32;
				}
				var index=getDivIndex();
				var redSmall = $(".red").length;
				var redBig = $(".redMellDay").length;
				//var secondSmall = $(".mellDay").eq(1).find(".bbb").eq(0).width()+1;
				var firstBig = $(".mellDay").eq(0).width();
				var ches = $("#pointer").width();
				var secondBig = $(".mellDay").eq(1).width();
				var nomal = $(".mellDay").eq(0).find(".nomal").index();
				if(index <a){
					$(".red").eq(redSmall-1).removeClass("red");
					var reds = $(".red").length;
					if(reds == 0){
						$(".mellDay").addClass("redMellDay");
					}

					// 位置
					var red = $(".mellDay").eq(0).find(".red").length;
					var lastWd = $(".mellDay").eq(0).children("div:last-child").width()+1;
					var lastIndex=$("#all").find(".bbb").length;
					//var secondSmall = $(".mellDay").eq(1).find(".bbb").eq(0).width()+1;
					var secondSmall =parseFloat(document.defaultView.getComputedStyle($(".bbb")[lastIndex-1]).width)+1;

					//var oWd = $(".mellDay").eq(0).find(".bbb").eq(0).width()+1;
					//var secondSmall =document.defaultView.getComputedStyle($(".mellDay").eq(1).find(".bbb").eq(0)).width()+1;
					//var ele=;
					var oWd  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[0]).width)+1;

					//var oWd = $(".mellDay").eq(0).find(".bbb").eq(0).width()+1;
					var nomalWd = $(".nomal").width();
					var redMell = $(".redMellDay").length;
					// 判断实况预报结合的 三种不同宽度：

					//if( red < nomal + 1 ){
					//	//表示实况
					//	var pointLine = oWd * red - ches/2 + "px";
					//
					//	if(red == 0){
					//		var pointLine = firstBig + (redMell-1)*secondBig -ches/2 +"px";
					//	}
					//
					//	$("#pointer").css("left",pointLine);
					//}else if( red == nomal + 1){
					//	//第一个预报
					//	var pointLine = (red-1)*oWd + nomalWd -ches/2 +"px";
					//	$("#pointer").css("left",pointLine);
					//
					//}else{
					//	//预报
					//	var pointLine = nomal * oWd + nomalWd + (red-nomal-1) * oWd - ches/2 +"px";
					if(index==0){
						var pointLine = $("#all").width() - ches/2 +"px";
					}else{
						var pointLine = (index)* oWd - ches/2 +"px";
					}



					//var pointLine = nomal * oWd + nomalWd + (red-nomal-1) * lastWd - ches/2 +"px";
					$("#pointer").css("left",pointLine);

					//}
					for(var i=0;i<=index-1;i++){
						$(".mellDay").eq(0).find(".bbb").eq(i).addClass("red");
					}
					var redSmall = $(".red").length;
					var redBig = $(".redMellDay").length;
					var hours = $(".red").eq(redSmall-1).attr("name") + ":00";

					//if(redSmall == 0){
					//	var bigRedLength = $(".redMellDay").length;
					//	var noWell = $(".redMellDay").eq(redBig-1).find(".bbb").length;
					//	var hours = $(".redMellDay").eq(redBig-1).find(".bbb").eq(noWell-1).attr("name") + ":00";
					//}
					$("#pointer .xs").html(hours);

				}else{
					//第二种刻度的时效
					var lastIndex=$("#all").find(".bbb").length;
					//var secondSmall = $(".mellDay").eq(1).find(".bbb").eq(0).width()+1;
					var secondSmall =parseFloat(document.defaultView.getComputedStyle($(".bbb")[lastIndex-1]).width)+1;

					if(redSmall == 0){
						var nowLength = $(".redMellDay").eq(redBig-1).find(".bbb").length;

						for(i=0;i<nowLength-1;i++){
							$(".redMellDay").eq(redBig-1).find(".bbb").eq(i).addClass("red");
						}
						$(".redMellDay").eq(redBig-1).removeClass("redMellDay");

					}else{
						$(".red").eq(redSmall-1).removeClass("red");
					}
					//位置
					var redSmall = $(".red").length;
					var redBig = $(".redMellDay").length;
					var last = $(".mellDay").eq(0).children("div:last-child").width()+1;
					var pointLine = firstBig + secondBig * (redBig-1) + redSmall * secondSmall -ches/2 +"px";
					if(redBig == 0){
						pointLine = firstBig - last -ches/2 +"px";
					}
					$("#pointer").css("left",pointLine);

					//时刻显示
					var hours = $(".red").eq(redSmall-1).attr("name") + ":00";
					if(redSmall == 0){
						var bigRedLength = $(".redMellDay").length;
						var noWell = $(".redMellDay").eq(redBig-1).find(".bbb").length;
						var hours = $(".redMellDay").eq(redBig-1).find(".bbb").eq(noWell-1).attr("name") + ":00";
					}
					$("#pointer .xs").html(hours);


				}
			}else if(Boolean(qel3)){
				//三种时效
			}else{
				//只有一种预报的
				var redSmall = $(".red").length;
				var redBig = $(".redMellDay").length;
				//var secondSmall = $(".mellDay").eq(1).find(".bbb").eq(0).width()+1;
				var firstBig = $(".mellDay").eq(0).width();
				var ches = $("#pointer").width();
				var secondBig = $(".mellDay").eq(1).width();
				var nomal = $(".mellDay").eq(0).find(".nomal").index();
				if(redBig == 0){
					$(".red").eq(redSmall-1).removeClass("red");
					var reds = $(".red").length;
					if(reds == 0){
						$(".mellDay").addClass("redMellDay");
					}

					// 位置
					var red = $(".mellDay").eq(0).find(".red").length;
					var lastWd = $(".mellDay").eq(0).children("div:last-child").width()+1;
					var lastIndex=$("#all").find(".bbb").length;
					//var secondSmall = $(".mellDay").eq(1).find(".bbb").eq(0).width()+1;
					var secondSmall =parseFloat(document.defaultView.getComputedStyle($(".bbb")[lastIndex-1]).width)+1;

					//var oWd = $(".mellDay").eq(0).find(".bbb").eq(0).width()+1;
					//var secondSmall =document.defaultView.getComputedStyle($(".mellDay").eq(1).find(".bbb").eq(0)).width()+1;
					//var ele=;
					var oWd  =parseFloat(document.defaultView.getComputedStyle($(".bbb")[0]).width)+1;

					//var oWd = $(".mellDay").eq(0).find(".bbb").eq(0).width()+1;
					var nomalWd = $(".nomal").width();
					var redMell = $(".redMellDay").length;
					// 判断实况预报结合的 三种不同宽度：

					if( red < nomal + 1 ){
						var pointLine = oWd * red - ches/2 + "px";

						if(red == 0){
							var pointLine = firstBig + (redMell-1)*secondBig -ches/2 +"px";
						}

						$("#pointer").css("left",pointLine);
					}else if( red == nomal + 1){
						var pointLine = (red-1)*oWd + nomalWd -ches/2 +"px";
						$("#pointer").css("left",pointLine);

					}else{
						var pointLine = nomal * oWd + nomalWd + (red-nomal-1) * lastWd - ches/2 +"px";

						//var pointLine = nomal * oWd + nomalWd + (red-nomal-1) * lastWd - ches/2 +"px";
						$("#pointer").css("left",pointLine);

					}
					var redSmall = $(".red").length;
					var redBig = $(".redMellDay").length;
					var hours = $(".red").eq(redSmall-1).attr("name") + ":00";
					if(redSmall == 0){
						var bigRedLength = $(".redMellDay").length;
						var noWell = $(".redMellDay").eq(redBig-1).find(".bbb").length;
						var hours = $(".redMellDay").eq(redBig-1).find(".bbb").eq(noWell-1).attr("name") + ":00";
					}
					$("#pointer .xs").html(hours);

				}else{
					var lastIndex=$("#all").find(".bbb").length;
					//var secondSmall = $(".mellDay").eq(1).find(".bbb").eq(0).width()+1;
					var secondSmall =parseFloat(document.defaultView.getComputedStyle($(".bbb")[lastIndex-1]).width)+1;

					if(redSmall == 0){
						var nowLength = $(".redMellDay").eq(redBig-1).find(".bbb").length;

						for(i=0;i<nowLength-1;i++){
							$(".redMellDay").eq(redBig-1).find(".bbb").eq(i).addClass("red");
						}
						$(".redMellDay").eq(redBig-1).removeClass("redMellDay");

					}else{
						$(".red").eq(redSmall-1).removeClass("red");
					}
					//位置
					var redSmall = $(".red").length;
					var redBig = $(".redMellDay").length;
					var last = $(".mellDay").eq(0).children("div:last-child").width()+1;
					var pointLine = firstBig + secondBig * (redBig-1) + redSmall * secondSmall -ches/2 +"px";
					if(redBig == 0){
						pointLine = firstBig - last -ches/2 +"px";
					}
					$("#pointer").css("left",pointLine);

					//时刻显示
					var hours = $(".red").eq(redSmall-1).attr("name") + ":00";
					if(redSmall == 0){
						var bigRedLength = $(".redMellDay").length;
						var noWell = $(".redMellDay").eq(redBig-1).find(".bbb").length;
						var hours = $(".redMellDay").eq(redBig-1).find(".bbb").eq(noWell-1).attr("name") + ":00";
					}
					$("#pointer .xs").html(hours);


				}
			}


			var obj = $(".select span").html();
			var featureData = getCheckedFeatureData(obj);

			getUrl(nuTm, startTime, featureData);

			if (currentLatLng != null && mapClickFlag && yxMapClick) {
				pickValue(currentLatLng);
			}

		}else{
			var redLength = $(".red").length;
			var redbbb = $(".red").eq(redLength - 1);
			var redMellDay = redbbb.parent(".mellDay").index();
			// 点击上一个的时候 如果当前正在进行播放事件  切换播放暂停按钮
			if (kolse) {
				$("#action").css("display", "block");
				$("#stop").css("display", "none")
			}
			kolse = false;

			//清除之前的样式
			$(".mellDay").removeClass("redMellDay");
			$(".bbb").removeClass("red");
			//因为$("#all")的第一个mellDay的下标是3。
			redLength = redLength - 1;
			// console.log(redLength)
			if (Boolean(qel2) && Boolean(qel3)) {

				if (redLength <= 0) {
					if (redMellDay <= 3) {
						redMellDay = $(".mellDay").length + 3;
						redLength = $(".mellDay").eq(redMellDay - 4).find(".bbb").length;
						$(".mellDay").eq(redMellDay - 4).find(".bbb").addClass("red");
					} else {
						redLength = redLength - 1;
						if (redLength <= 0) {
							redMellDay = redMellDay - 1;
							redLength = $(".mellDay").eq(redMellDay - 4).find(".bbb").length;
							$(".mellDay").eq(redMellDay - 3).find(".bbb").addClass("red");
							var rs = $(".mellDay").eq(redMellDay - 4).find(".bbb").length;
							$(".mellDay").eq(redMellDay - 3).find(".bbb").eq(rs - 1).removeClass("red");

							// console.log($(".mellDay").eq(redMellDay-4).find(".bbb").length-1)
						}
					}
				} else {
					redLength = redLength - 1;
				}
			} else {
				if (redLength <= 0) {
					if (redMellDay <= 3) {
						redMellDay = $(".mellDay").length + 3;
						redLength = $(".mellDay").eq(redMellDay - 4).find(".bbb").length;
						$(".mellDay").eq(redMellDay - 4).find(".bbb").addClass("red");
					} else {
						redLength = redLength - 1;
						if (redLength <= 0) {
							redMellDay = redMellDay - 1;
							redLength = $(".mellDay").eq(redMellDay - 4).find(".bbb").length;
							$(".mellDay").eq(redMellDay - 3).find(".bbb").addClass("red");
							var rs = $(".mellDay").eq(redMellDay - 4).find(".bbb").length;
							$(".mellDay").eq(redMellDay - 3).find(".bbb").eq(rs - 1).removeClass("red");
							// console.log($(".mellDay").eq(redMellDay-4).find(".bbb").length-1)
						}
					}
				} else {
					redLength = redLength - 1;
				}
			}


			if (redMellDay - 3 > 0) {
				//改变mellDay的颜色
				for (j = 0; j <= redMellDay - 4; j++) {
					$(".mellDay").eq(j).addClass("redMellDay");
				}
			}
			//改变.bbb的颜色
			for (k = 0; k <= redLength; k++) {
				$(".mellDay").eq(redMellDay - 3).find(".bbb").eq(k).addClass("red");
			}
			//避免变量污染 重新定义获取存在颜色的div个数
			var smarlDiv = $(".red").length;
			var bigDiv = $(".redMellDay").length;
			var smarlWidth = $(".bbb").width() + 1;// +1是因为有1px的border
			// console.log(parseFloat($(".bbb").width()) )

			var bigWidth = $(".mellDay").width();
			var smarlWidthQel2 = $(".mellDay").eq(qel2 - 1).find(".bbb").width() + 1;
			var qel1Length = $(".mellDay").eq(0).find(".bbb").length;
			var bbbFloatValue = $(".mellDay").width() / qel1Length;
			// console.log(qel1Length)
			// console.log(bbbFloatValue)
			// console.log(redMellDay)
			if (Boolean(qel3)) {
				smarlWidthQel3 = $(".mellDay").eq(qel3 + qel2 - 1).find(".bbb").width() + 1;
				;  //类型二 第二种
			}
			//console.log(smarlDiv)
			//console.log(bigDiv)
			//              console.log(smarlWidthQel3)
			//console.log(bigWidth)
			//console.log($(".mellDay").length)
			if (Boolean(qel2) && Boolean(qel3)) {
				//列如海洋三种时效值
				if (redMellDay - 3 <= qel2 + qel1 + qel3 && redMellDay - 3 >= qel1 + qel2 - 1) {
					if ($(".mellDay").length <= bigDiv) {

						var titleSmal = $(".redMellDay").eq(bigDiv - 1).find(".bbb").last().attr("name") + ":00";
						$("#pointer .xs").html(titleSmal);
						var weizhi = smarlWidthQel3 * smarlDiv + bigWidth * (bigDiv - 1) - spanPointer + "px";
						$("#pointer").css("left", weizhi);
					} else {

						var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
						$("#pointer .xs").html(titleSmal);

						var weizhi = smarlWidthQel3 * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
						$("#pointer").css("left", weizhi);
						if (redMellDay - 3 < qel2 + qel1 - 1) {
							var weizhi = smarlWidthQel3 * smarlDiv + bigWidth * (bigDiv - 1) - spanPointer + "px";
							$("#pointer").css("left", weizhi);
						}
					}
				} else if (redMellDay - 3 <= qel2 + qel1 - 1 && redMellDay - 3 >= qel1) {

					var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
					$("#pointer .xs").html(titleSmal);
					var weizhi = smarlWidthQel3 * smarlDiv + bigWidth * (bigDiv - 1) - spanPointer + "px";
					$("#pointer").css("left", weizhi);
					if (redLength < 1) {
						var weizhi = smarlWidthQel2 * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
						$("#pointer").css("left", weizhi);
					}
				} else {

					if ($(".mellDay").length <= bigDiv) {

						var titleSmal = $(".redMellDay").eq(bigDiv - 1).find(".bbb").last().attr("name") + ":00";
						$("#pointer .xs").html(titleSmal);
						var weizhi = smarlWidthQel3 * smarlDiv + bigWidth * (bigDiv - 1) - spanPointer + "px";
						$("#pointer").css("left", weizhi);
					} else {

						var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
						$("#pointer .xs").html(titleSmal);
						var weizhi = bbbFloatValue * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
						$("#pointer").css("left", weizhi);
					}
				}
			} else if (Boolean(qel2) && qel3 == null) {
				//两种时效值
				if (redMellDay - 3 < qel2 - 1) {
					var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
					$("#pointer .xs").html(titleSmal);
					var weizhi = bbbFloatValue * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
					$("#pointer").css("left", weizhi);
				} else {
					if ($(".mellDay").length <= bigDiv) {
						var titleSmal = $(".redMellDay").eq(bigDiv - 1).find(".bbb").last().attr("name") + ":00";
						$("#pointer .xs").html(titleSmal);
						var weizhi = smarlWidthQel2 * smarlDiv + bigWidth * (bigDiv - 1) - spanPointer + "px";
						$("#pointer").css("left", weizhi);
					} else {
						var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
						$("#pointer .xs").html(titleSmal);
						var weizhi = smarlWidthQel2 * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
						$("#pointer").css("left", weizhi);
					}
				}
			} else {
				//只有一种时效值的
				if ($(".mellDay").length <= bigDiv) {
					var titleSmal = $(".redMellDay").eq(bigDiv - 1).find(".bbb").last().attr("name") + ":00";
					$("#pointer .xs").html(titleSmal);
					var weizhi = smarlWidth * smarlDiv + bigWidth * (bigDiv - 1) - spanPointer + "px";
					$("#pointer").css("left", weizhi);
				} else {
					var titleSmal = $(".red").eq(smarlDiv - 1).attr("name") + ":00";
					$("#pointer .xs").html(titleSmal);
					var weizhi = smarlWidth * smarlDiv + bigWidth * bigDiv - spanPointer + "px";
					$("#pointer").css("left", weizhi);
				}
			}

			var obj = $(".select span").html();
			var featureData = getCheckedFeatureData(obj);

			getUrl(nuTm, startTime, featureData);



			if (currentLatLng != null && mapClickFlag && yxMapClick) {
				pickValue(currentLatLng);
			}

		}


	}

	if (!isMobile()) {
		map.on("mousemove", function (e) {
			if (mapMouseFlag) {
				var latlng = e.latlng;
				var lngs = latlng.lng;
				var lats = latlng.lat;

				$("#latlng").html("经度:" + lngs.toFixed(2) + "° " + "纬度:" + lats.toFixed(2) + "°");
				mouseMoveValue(latlng);
			}
		});
	}

	//// 加载时序图
	////var dataSelect=[{province:"青海",city:"果洛藏族自治区",area:"玛多县",longitude:"97.80°",latitude:"37.70°"}];
	//var chart = "";
	//chart += "<div class=\"detail\"><div style=\"width:100%;height:25px;margin-top: 5px;\"><span class=\"button\" id=\"export\" style=\"float:left;border:1px solid #eee;z-index: 1000;margin-left:20px;margin-right:10px;cursor: pointer\">导出Excel</span><span class=\"button\" id=\"changeTable\" style=\"float:left;border:1px solid #eee;z-index: 1000;cursor: pointer\">图表切换</span></div><span class=\"box\"style=\"margin-left: 25px\">省：<span id=\"province\"></span></span><span class=\"box\">市：<span id=\"city\"></span></span><span class=\"box\"style=\"padding-right:0px;\">区：<span id=\"area\"></span></span>"
	//chart += '<div class=\"det\" style=\"position:relative;padding-top:5px\"><table id="rainTable" class="table2" border="0" cellspacing="0" cellpadding="0"">\
	//	<tr>\
	//	<td style="background-color: rgb(41,50,55)">\
	//	<div>\
	//	<div class="images"><span class=\"iconfont icon-yu\"></span>\
	//	<span id="echartName1">智能网格预报图表</span>\
	//	<span style="padding-right: 15px;float: right;">发布时间:<span id="publishDate1"></span></span>\
	//	</div>\
	//	</div>\
	//	</td>\
	//	</tr>\
	//	<tr class="tr2">\
	//	<td id="echarts1"  valign="top">\
	//	    <div id="echartss" style="height:390px;"></div></div>\
	//	</td>\
	//	<td id="echarts11"  valign="top">\
	//	    <div id="echartss11" style="width:100%;height:389px;">\
	//	      <div><table class="shixvTable" border="0" cellspacing="0" cellpadding="0"></table></div>\
	//	      <div><div style="margin:0;padding:0;width:604px;height:20px;    overflow-x: scroll;overflow-y: hidden;"><table class="shixvTable1" border="0" cellspacing="0" cellpadding="0"></table></div></div>\
	//	    </div></div>\
	//	</td>\
	//	</tr>\
	//	</table>\
     //   </div></div>';
	//$(".chart").html(chart);
	//chartJS();


	var myChart1 = echarts.init(document.getElementById('echartss'));
	var option = {
		dataZoom: [
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
			{top: "15%", width: '80%', height: '65%'}
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
			borderColor: 'rgba(178,34,34,0.8)',
			borderWidth: 1,
			padding: 5,    // [5, 10, 15, 20]
			itemGap: 5,
			textStyle: {color: 'red'},
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
				offset: 150
			}
		],
		series: [
			{
				name: '降水',
				type: 'bar',
				barWidth: '30%',
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
	var optionTableOne = {
		title: {
			text: '综合影响统计',
			textStyle: {
				fontSize: 10,
			}
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
	var optionTable2 = {
		title: {
			text: '站点影响统计',
			textStyle: {
				fontSize: 10,
			}
		},
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['高温', '低温'],
			right: 10,
		},
		grid: {
			left: '3%',
			top: '20%',
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
	var quxiaoFlag = true;
	var yxClick = true;
	//var inputVal;
	myChart1.on('legendselectchanged', function (params) {
		var isSelected = params.selected[params.name];

		if(params.name=="相对湿度"){

			selected1=isSelected;
		}
		if (params.name=="云量"){
			selected2=isSelected;
		}
		if(selected1==true && selected2==true){
			option.legend.selected={}
		}else if(selected1==false && selected2==true){
			option.legend.selected={
				"相对湿度":false
			}
		}else if(selected1==true && selected2==false){
			option.legend.selected={
				"云量":false
			}
		}

	})
	map.on('click', function (e) {
		if (mapClickFlag && yxMapClick) {
			var latlng = e.latlng;
			var g = true;
			//console.log(latlng)
			showEchart(latlng, g)
			//console.log(inputVal);

			var htmlWidth = isMobile();
			if (htmlWidth) {
				$("#echartss").css({"height":240});
				$("#echartss div").css({"height":240});
				$(".det").css({"padding-top":0});

				pickValue1(latlng);
				$("#hoverPic").animate({height: "310px"}, 500);
				option.grid = [
					//{top:"19%",width: '83%', height: '22%'},
					{top: "25%", width: '83%', height: '50%'}
				];
				option.dataZoom = [
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
						bottom: "0",
						left: "200",
						right: "300"
					}, {
						type: 'inside',
					}
				];
				option.yAxis = [
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
			}else{
				pickValue1(latlng);
			}
			$(".change").css("display", "none");
			myChart1.setOption(option);
			createShixvTable(option);
		}
	});

	map.on('moveend', function (e) {
		if (!mapClickFlag) { //当出图状态下才执行一下动作
			//$("#fwei").children("option").eq(0).attr("selected",true);
			//延迟显示缩略图
			if (mapFlag == true) {
				if (mapClick == 2) {
					mapClick--;
					changeFlag = true;
					//setTimeout(thumbnail,1000);
				} else if (mapClick == 1) {
					mapFlag = false;
				}

			} else {
				if (map.getZoom() > curZoom || map.getZoom() < curZoom) {
					changeFlag = true;
					setTimeout(thumbnail, 1000);
				} else {
					setTimeout(thumbnail, 1000);
				}
				//thumbnail();
			}

			//Timeout(thumbnail,1000);
		}
	});

	function thumbnail() {
		//var selectName=$(".select").children("span").html();
		//var startTime=$("#option2").children("option:selected").val();
		//var endTime=$("#option3").children("option:selected").val();

		var mapView = map.getBounds();
		//alert(mapView.getWest() + "," + mapView.getEast() + "," + mapView.getSouth() + "," + mapView.getNorth());
		//var flag = true;  //是否重绘缩略图标识
		//var srcLatLngBounds = L.latLngBounds(getCheckedFeatureData(selectName).bounds);


		//var bounds = map.getPixelBounds();

		var lng1 = reRectangle.handle1.getLatLng().lng;
		if (lng1 < mapView.getWest()) {
			lng1 = mapView.getWest();
			changeFlag = true;
		}
		var lat1 = reRectangle.handle1.getLatLng().lat;
		if (lat1 < mapView.getSouth()) {
			lat1 = mapView.getSouth();
			changeFlag = true;
		}
		var lng2 = reRectangle.handle3.getLatLng().lng;
		if (lng2 > mapView.getEast()) {
			lng2 = mapView.getEast();
			changeFlag = true;
		}
		var lat2 = reRectangle.handle3.getLatLng().lat;
		if (lat2 > mapView.getNorth()) {
			lat2 = mapView.getNorth();
			changeFlag = true;
		}
		var destLatLngBounds = L.latLngBounds([[lat1, lng1], [lat2, lng2]]);

		if (reRectangle != null) {
			map.removeLayer(reRectangle);
		}
		reRectangle = new Re_Rectangle(L.latLngBounds(destLatLngBounds));
		//console.log(reRectangle)
		reRectangle.addTo(map);

		//var width=(lng2-lng1)*10;
		//var height=(lat2-lat1)*10;
		/*var max = reRectangle.rectangle._pxBounds.max;
		 var min = reRectangle.rectangle._pxBounds.min;
		 var width = max.x - min.x;
		 var height = max.y - min.y;
		 var unders=[
		 new Promise(function (resolve,reject) {
		 var img = new Image();
		 img.onload=function () {
		 var part = snip.part(img,mapView,destLatLngBounds);
		 resolve(part);
		 }

		 //image.src = canvas.toDataURL("image/png");
		 var canvas = collage();
		 img.src=canvas.toDataURL("image/png");
		 })
		 ];
		 var renderer = basemap._renderer;
		 var aboves=[
		 snip.part(renderer._container,mapView,destLatLngBounds)
		 ];
		 if(changeFlag){
		 snip.prepare(selectName,startTime,endTime,srcLatLngBounds,destLatLngBounds,
		 {width:width,height:height},//size要和destLatLngBounds的长宽比相同
		 unders,aboves)
		 .then(snip.toAdd);

		 $("#imgBox").css({"width":350,"height":height*350/width,"margin":"5px auto"});
		 curZoom=map.getZoom();
		 changeFlag=false;
		 }*/

	}

	$("#search").click(function () {
		$(".change").css("display", "none");
	})


	////时序图的显示
	//$(".quX").on("click", function () {
	//	if (!quxiaoFlag) {
	//		$(".icon-shousuo").removeClass("icon-shousuo").addClass("icon-zhankai").animate({left: "0px"}, 500)
	//		$(".chartBox").animate({width: 0}, 500, function () {
	//			//$(".chartBox").css({visibility:"hidden"});
    //
	//		});
	//		//yxClick=true;
	//		quxiaoFlag = true;
	//	} else if (quxiaoFlag) {
	//		if (!mapClickFlag) {
	//			mapClickFlag = true;
	//			mapMouseFlag = true;
	//			$(".apiBox .close").trigger("click");
	//		}
	//		$(".chart").css("display", "block");
	//		$(".icon-zhankai").removeClass("icon-zhankai").addClass("icon-shousuo").animate({left: "-700px"}, 500)
	//		$(".chartBox").css({visibility: "visible"}).animate({width: "700px"}, 500);
	//		myChart1.setOption(option);
	//		createShixvTable(option);
	//		quxiaoFlag = false;
	//	}
	//});

	$(".colse").on("click", function () {
		$("#hoverPic").animate({height: "0"}, 1000);
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
		if (yxClick) {
			var width = $(".det").width();
			var detHeight = $(".det").height();
			//console.log(width)
			$("#echarts1").css({"display": "none"});
			$("#echarts11").css({"display": "block"});
			var len = $(".shixvTable").find("tr").length;
			var height = len * 40 + len + 1 + 18;
			$(".shixvTable1").parent().css({"height": height});
			var shouji = isMobile();
			if (shouji) {
				$(".det").css({"height": detHeight})
				$("#echarts11").css({"width": width - 2});
				height = len * 30 + len + 1;
				width = width - 54;
				$(".shixvTable1").parent().parent().css({"width": width})
				$(".shixvTable1").parent().css({"height": height, "width": width});
			}


			//$(".tr2").css({"height":"390px"})
			//$("#echartName1").html("智能网格预报表格数据");
			yxClick = false;
		} else if (!yxClick) {
			$("#echarts1").css({"display": "block", "height": "390px"});
			$("#echarts11").css({"display": "none"});
			//$("#echartName1").html("智能网格预报时序图")
			yxClick = true;

		}


	})


	// 播放
	$(".goStart").on("click", function () {
		if (kos) {
			$(this).attr("id", "pause");
			kos = false;
			startMove(ifLayer);
		} else {
			$(this).removeAttr("id");
			kos = true;
			clearInterval(timeMove);
		}
	})

	// start move
	function startMove(ifLayer) {
		var length = $(".days").length;
		var setStartWidth = $(".days").eq(qel2 - 1).find("div").width();
		var setStart3 = $(".days").eq(qel1 + qel2 - 1).find("div").width();

		var startWidth = $(".hours").eq(0).width();
		var startLeft = parseInt($("#parst").css("left"));
		var endLeft = startLeft + 0;
		var liwidth = $(".esDay").eq(1).width();
		var kell,
			lenNum;

		timeMove = setInterval(function () {
			if(ifLayer){
				if (Boolean(qel2) && Boolean(qel3)) {
					var pel = Math.abs(parseInt($("#parst").css("left")));
					var rel = $("#parst li").eq(0).width() * qel1 - startWidth / 2;
					var rel3 = $("#parst li").eq(0).width() * qel1 + $("#parst li").eq(qel1 + qel2 - 1).width() * (qel2 - 1) - setStart3 / 2;

					if (pel >= rel && pel < rel3) {
						if (pel == rel) {
							var thum = parseInt((pel - rel) / setStartWidth);
							endLeft = (0 - (setStartWidth / 2 + thum * setStartWidth + rel + startWidth / 2)) + "px";
						} else {
							endLeft = (0 - (setStartWidth + pel)) + "px";
						}

					} else if (pel >= rel3) {
						//console.log(setStart3)
						//console.log(setStartWidth)
						var setlet = liwidth * (qel1 + qel2 - 1) - setStartWidth / 2;
						//console.log(setlet);
						//console.log(pel);
						if (pel == setlet) {
							endLeft = (0 - setlet - setStartWidth / 2 - setStart3 + 3) + "px";  //3:   取消偏差 保证最后一个的运动
						} else {
							endLeft = (0 - (setStart3 + Math.abs(parseInt(endLeft)))) + "px";
						}

					} else {
						endLeft = (0 - (startWidth + Math.abs(parseInt(endLeft)))) + "px";
					}

					var end = $("#parst").width();

					if (parseInt(endLeft) <= 0 - end) {
						endLeft = (0 - startWidth / 2) + "px";
						$("#parst").css("left", endLeft);
						kell = true;
					} else {
						$("#parst").animate({left: endLeft}, 1000);
					}
					//console.log(endLeft)
					var arry = hoursDel(ifLayer);
					if (kell) {
						//console.log("开始循环")
						lenNum = arry[0];
					} else {
						lenNum = arry[0] + 1;
					}
					kell = false;
					var divName = parseInt($(".hours").eq(lenNum).attr("name"));
					var numHours = (divName % 24).toString();
					if (numHours.length < 2) {
						numHours = 0 + numHours;
					}
					var numDay = parseInt(divName / 24);
					$("#inp p").html(numHours + ":00");

					var dayHtml = $(".dayZet li").eq(numDay).html();

					var currentTime = dayHtml + " " + numHours + ":00";
					//console.log(dayHtml + " " + numHours + ":00");

					var obj = $(".select span").html();
					var featureData = getCheckedFeatureData(obj);
					//console.log(currentTime)
					getUrl1(startTime, currentTime, featureData);

					if (currentLatLng != null) {
						pickValue1(currentLatLng);
					}

					if (parseInt(endLeft) <= 0 - end) {
						clearInterval(timeMove);
						$(".goStart").removeAttr("id");
					}
				} else if (Boolean(qel2) && qel3 == null) {
					var a,b;
					var firstForeLeft;
					//全部实况的结束时的left
					var shikLeft;
					//结束时的的left
					var endForeLeft=$("#parst").width();
					var  firstDayForeLeft;
					var tempIndex;
					if(Tm>=6&&Tm<18){

						firstForeLeft=(liveTm+1)*20+10;
						shikLeft=(liveTm+1)*20;
						firstDayForeLeft=33*20-10;
						tempIndex=32;
					}else if(Tm<6){
						var tmpTm=liveTm;
						if(liveTm == 23){
							tmpTm=-1
						}

						firstForeLeft=(24+tmpTm+1)*20+10;
						shikLeft=(24+tmpTm+1)*20;
						firstDayForeLeft=45*20-10;
						tempIndex=44;
					}else if(Tm>=18){

						firstForeLeft=(liveTm+1)*20+10;
						shikLeft=(liveTm+1)*20;
						firstDayForeLeft=45*20-10;
						tempIndex=44;
					}
					var obj = $(".select span").html();
					var featureData = getCheckedFeatureData(obj);
					var startLeft=Math.abs(parseInt($("#parst").css("left")));


					if(startLeft<firstDayForeLeft){
						startLeft=-startLeft-20;
						var num=Math.floor((-startLeft)/20);
						var numHours1=$(".hours").eq(num).html();
						if (numHours1.length < 2) {
							numHours1 = 0 + numHours1;
						}
						$("#inp p").html(numHours1 + ":00");
						$("#parst").animate({left: startLeft+"px"}, 1000);
						getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,firstDayForeLeft)

					}else if(startLeft==firstDayForeLeft){
						//startLeft=-firstDayForeLeft-40-Math.floor((startLeft-firstDayForeLeft-10)/60)*20*3;
						startLeft=-firstDayForeLeft-40;
						var num=tempIndex+1;
						var numHours1=$(".hours").eq(num).html();
						if (numHours1.length < 2) {
							numHours1 = 0 + numHours1;
						}
						$("#inp p").html(numHours1 + ":00");
						$("#parst").animate({left: startLeft+"px"}, 1000);
						getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,firstDayForeLeft)

					}else if(startLeft>firstDayForeLeft&&startLeft<endForeLeft-30){
						//startLeft=-firstDayForeLeft-40-Math.floor((startLeft-firstDayForeLeft-10)/60)*20*3;
						startLeft=-firstDayForeLeft-40-Math.ceil((startLeft-firstDayForeLeft-10)/60)*20*3;
						var num=tempIndex+Math.ceil((-startLeft-firstDayForeLeft-10)/60);
						var numHours1=$(".hours").eq(num).html();
						if (numHours1.length < 2) {
							numHours1 = 0 + numHours1;
						}
						$("#inp p").html(numHours1 + ":00");
						$("#parst").animate({left: startLeft+"px"}, 1000);
						getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,firstDayForeLeft)

					}else{
						startLeft=-10;
						var num=0;
						var numHours1=$(".hours").eq(num).html();
						if (numHours1.length < 2) {
							numHours1 = 0 + numHours1;
						}
						$("#inp p").html(numHours1 + ":00");
						$("#parst").css({left: startLeft+"px"});
						getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,firstDayForeLeft)

					}
					if (currentLatLng != null) {
						pickValue1(currentLatLng);
					}


				}  else {
					var a,b;
					var firstForeLeft;
					//全部实况的结束时的left
					var shikLeft;
					//结束时的的left
					var endForeLeft=$("#parst").width();

					if(Tm>=6&&Tm<18){
						a = (33 - (liveTm+1)) % hel1;
						if(a ==0){
							b =20*hel1/2;
						}else{
							b=20*a/2;
						}
						firstForeLeft=(liveTm+1)*20+b;
						shikLeft=(liveTm+1)*20;
					}else if(Tm<6){
						var tmpTm=liveTm
						if(liveTm == 23){
							tmpTm=-1
						}
						a = (45 - (24+tmpTm+1)) % hel1;
						if(a ==0){
							b =20*hel1/2;
						}else{
							b=20*a/2;
						}
						firstForeLeft=(24+tmpTm+1)*20+b;
						shikLeft=(24+tmpTm+1)*20;
					}else if(Tm>=18){
						a = (33 - (liveTm+1)) % hel1;
						if(a ==0){
							b =20*hel1/2;
						}else{
							b=20*a/2;
						}
						firstForeLeft=(liveTm+1)*20+b;
						shikLeft=(liveTm+1)*20;
					}
					var obj = $(".select span").html();
					var featureData = getCheckedFeatureData(obj);
					var startLeft=Math.abs(parseInt($("#parst").css("left")));
					if(startLeft==firstForeLeft){
						startLeft=-startLeft-b-30;
						var index=parseInt((firstForeLeft-b)/20);
						var numHours1=$(".hours").eq(index+1).html();
						if (numHours1.length < 2) {
							numHours1 = 0 + numHours1;
						}
						$("#inp p").html(numHours1 + ":00");
						$("#parst").animate({left: startLeft+"px"}, 1000);
						var obj = $(".select span").html();
						var featureData = getCheckedFeatureData(obj);
						getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,b)

					}else if(startLeft>firstForeLeft&&startLeft<endForeLeft){

						if(startLeft==endForeLeft-30){
							startLeft=-10;
							var index=0;
							var numHours1=$(".hours").eq(index).html();
							if (numHours1.length < 2) {
								numHours1 = 0 + numHours1;
							}
							$("#inp p").html(numHours1 + ":00");
							$("#parst").animate({left: startLeft+"px"}, 0);
							getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,b)


						}else{
							startLeft=-startLeft-60;
							var index=parseInt((shikLeft-10)/20)+1+parseInt((-startLeft+30-(firstForeLeft+b))/60);
							var numHours1=$(".hours").eq(index).html();
							if (numHours1.length < 2) {
								numHours1 = 0 + numHours1;
							}
							$("#inp p").html(numHours1 + ":00");
							$("#parst").animate({left: startLeft+"px"}, 1000);
							getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,b)

						}
					}else if(startLeft<shikLeft){
						if(startLeft==shikLeft-10){
							startLeft=parseInt(-startLeft-10-b);
							var index=parseInt((shikLeft)/20);
							var numHours1=$(".hours").eq(index).html();
							if (numHours1.length < 2) {
								numHours1 = 0 + numHours1;
							}
							$("#inp p").html(numHours1 + ":00");
							$("#parst").animate({left: startLeft+"px"}, 1000);
							var obj = $(".select span").html();
							var featureData = getCheckedFeatureData(obj);
							getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,b)


						}else{
							startLeft=-startLeft-20;
							var index=parseInt((-startLeft+10)/20);
							var numHours1=$(".hours").eq(index-1).html();
							if (numHours1.length < 2) {
								numHours1 = 0 + numHours1;
							}
							$("#inp p").html(numHours1 + ":00");
							$("#parst").animate({left: startLeft+"px"}, 1000);
							var obj = $(".select span").html();
							var featureData = getCheckedFeatureData(obj);
							getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,b)
						}

					}
					if (currentLatLng != null) {
						pickValue1(currentLatLng);
					}

				}
			}else{
				if (Boolean(qel2) && Boolean(qel3)) {
					var temp;
					if((nuTm+hel1)>24){
						temp=((nuTm+hel1-24)*ten-hel1*ten/2)
					}else {
						temp = ((nuTm + hel1) * ten - hel1 * ten / 2);
					}
					var pel = Math.abs(parseInt($("#parst").css("left")));
					var rel = $("#parst li").eq(0).width() * qel1+temp-18;
					var rel3 = $("#parst li").eq(0).width() * qel1 + $("#parst li").eq(qel1 + qel2 - 1).width() * (qel2 - 1) -36+temp;

					if (pel >=rel && pel < rel3) {
						if (pel == rel) {
							endLeft=0-(pel+18+36);
							//var thum = parseInt((pel - rel) / setStartWidth);
							//endLeft = (0 - (setStartWidth / 2 + thum * setStartWidth + rel + startWidth / 2)) + "px";
						} else {
							setStartWidth = $(".days").eq(qel2 - 1).find("div").width();
							endLeft = (0 - (setStartWidth + pel)) + "px";
						}

					} else if (pel >= rel3) {
						setStart3 = $(".days").eq(qel1 + qel2 - 1).find("div").width();
						//console.log(setStart3)
						//console.log(setStartWidth)
						var setlet = liwidth * (qel1 + qel2 - 1)+temp-36;
						//console.log(setlet);
						//console.log(pel);
						if (pel == setlet) {
							endLeft = (0 - pel-36-144) + "px";  //3:   取消偏差 保证最后一个的运动
						} else {
							endLeft = (0 - (setStart3 + Math.abs(parseInt(endLeft)))) + "px";
						}

					} else {
						endLeft = (0 - (startWidth + Math.abs(parseInt(endLeft)))) + "px";
					}

					var end = $("#parst").width();

					if (parseInt(endLeft) <0 - end) {
						endLeft = (0 - startWidth / 2-temp) + "px";
						$("#parst").css("left", endLeft);
						kell = true;
					}else if(parseInt(endLeft) ==0 - end){
						kell = false;
						$("#parst").animate({left: endLeft}, 1000);
					} else {
						$("#parst").animate({left: endLeft}, 1000);
					}
					//console.log(endLeft)
					var arry = hoursDel(ifLayer);
					if (kell) {
						//console.log("开始循环")
						lenNum = arry[0];
					} else {
						lenNum = arry[0] + 1;
					}
					kell = false;
					var divName = parseInt($(".hours").eq(lenNum).attr("name"));
					var numHours = (divName % 24).toString();
					if (numHours.length < 2) {
						numHours = 0 + numHours;
					}
					var numDay = parseInt(divName / 24);
					$("#inp p").html(numHours + ":00");
					if((nuTm+hel1)>24){
						var dayHtml = $(".dayZet li").eq(numDay-1).html();
					}else{
						var dayHtml = $(".dayZet li").eq(numDay).html();
					}


					var currentTime = dayHtml + " " + numHours + ":00";
					//console.log(dayHtml + " " + numHours + ":00");

					var obj = $(".select span").html();
					var featureData = getCheckedFeatureData(obj);
					console.log(currentTime)
					getUrl1(startTime, currentTime, featureData);

					if (currentLatLng != null) {
						pickValue1(currentLatLng);
					}

					//if (parseInt(endLeft) <= 0 - end) {
					//	clearInterval(timeMove);
					//	$(".goStart").removeAttr("id");
					//}
				} else if (Boolean(qel2) && qel3 == null) {
					var pel = Math.abs(parseInt($("#parst").css("left")));
					var rel = $("#parst li").eq(0).width() * qel1 - startWidth / 2;


//					if(pel==rel){
//              		var thum = parseInt((pel-rel)/setStartWidth);
//                  	endLeft = (0 - (setStartWidth/2 + thum*setStartWidth +rel+ startWidth/2))+"px";
//              	}else{
//              		endLeft = (0 - (setStartWidth + pel))+"px";
//              	}


					if (pel >= rel) {
						if (pel == rel) {
							var thum = parseInt((pel - rel) / setStartWidth);
							endLeft = (0 - (setStartWidth / 2 + thum * setStartWidth + rel + startWidth / 2)) + "px";
						} else {
							endLeft = (0 - (setStartWidth + pel)) + "px";
						}
					} else {
						endLeft = (0 - (startWidth + Math.abs(parseInt(endLeft)))) + "px";
					}

					var end = $("#parst").width();

					if (parseInt(endLeft) <= 0 - end) {
						endLeft = (0 - startWidth / 2) + "px";
						$("#parst").css("left", endLeft);
						kell = true;
					} else {
						$("#parst").animate({left: endLeft}, 1000);
					}
					//console.log(endLeft)
					var arry = hoursDel(ifLayer);
					if (kell) {
						//console.log("开始循环")
						lenNum = arry[0];
					} else {
						lenNum = arry[0] + 1;
					}
					kell = false;
					var divName = parseInt($(".hours").eq(lenNum).attr("name"));
					var numHours = (divName % 24).toString();
					if (numHours.length < 2) {
						numHours = 0 + numHours;
					}
					var numDay = parseInt(divName / 24);
					$("#inp p").html(numHours + ":00");

					//var dayHtml = $(".dayZet li").eq(numDay).html();
					if((nuTm+hel1)>24){
						var dayHtml = $(".dayZet li").eq(numDay-1).html();
					}else{
						var dayHtml = $(".dayZet li").eq(numDay).html();
					}
					var currentTime = dayHtml + " " + numHours + ":00";
					//console.log(dayHtml + " " + numHours + ":00");

					var obj = $(".select span").html();
					var featureData = getCheckedFeatureData(obj);
					//console.log(currentTime)
					getUrl1(startTime, currentTime, featureData);

					if (currentLatLng != null) {
						pickValue1(currentLatLng);
					}

					if (parseInt(endLeft) <= 0 - end) {
						clearInterval(timeMove);
						$(".goStart").removeAttr("id");
					}

				}  else {
					endLeft = (0 - (startWidth + Math.abs(parseInt(endLeft)))) + "px";
					var end = $("#parst").width();
					//var temp=((nuTm + hel1) * ten - hel1 * ten / 2)
					var temp;
					if((nuTm+hel1)>24){
						temp=((nuTm+hel1-24)*ten-hel1*ten/2)
					}else {
						temp = ((nuTm + hel1) * ten - hel1 * ten / 2);
					}
					if (parseInt(endLeft) <= 0 - end) {
						endLeft = (0 - startWidth / 2-temp )+ "px";
						$("#parst").css("left", endLeft);
						kell = true;
					} else {
						$("#parst").animate({left: endLeft}, 1000);
					}
					//console.log(endLeft)
					var arry = hoursDel(ifLayer);
					if (kell) {
						lenNum = arry[0];
					} else {
						lenNum = arry[0] + 1;
					}
					var divName = parseInt($(".hours").eq(lenNum).attr("name"));
					var numHours = (divName % 24).toString();
					if (numHours.length < 2) {
						numHours = 0 + numHours;
					}
					var numDay = parseInt(divName / 24);
					$("#inp p").html(numHours + ":00");
					if((nuTm+hel1)>24){
						var dayHtml = $(".dayZet li").eq(numDay-1).html();
					}else{
						var dayHtml = $(".dayZet li").eq(numDay).html();
					}
					//var dayHtml = $(".dayZet li").eq(numDay).html();

					var currentTime = dayHtml + " " + numHours + ":00";
					//console.log(dayHtml + " " + numHours + ":00");

					var obj = $(".select span").html();
					var featureData = getCheckedFeatureData(obj);
					//console.log(currentTime)
					getUrl1(startTime, currentTime, featureData);

					if (currentLatLng != null) {
						pickValue1(currentLatLng);
					}

					if (parseInt(endLeft) <= 0 - end) {
						clearInterval(timeMove);
						$(".goStart").removeAttr("id");
					}
					kell = false;


				}
			}

		}, 3000);
	}


	$(".list_text01 span").live("click", function () {
		var answer = $(this).siblings(".list_text02");
		if (answer.is(":visible")) {
			answer.hide();
		}
		else {
			answer.parents(".index_menu_right").find(".list_text02").hide();
			answer.show();
		}
	});


	$(".index_menu_left").live("click", function () {
		var blackDiv = $(this).siblings(".change");

		// blackDiv.css("height","500px");
		if (blackDiv.height() > 500) {
			blackDiv.css("height", "500px");
			blackDiv.css("overflowY", "scroll");
		}
		blackDiv.show();

		// 默认第一个选中24小时，其他的选中第一个
		if ($(this).children("span").html() == "基本要素") {
			var ss = blackDiv.children(".index_menu_right").children(".index_menu_righ_list").children().eq(3).children().eq(0);
		} else {
			var ss = blackDiv.children(".index_menu_right").children(".index_menu_righ_list").children().eq(0).children().eq(0);
		}

		ss.attr('checked', 'true');
		$(this).parent().siblings().children(".change").hide();
		$(this).parent().siblings().children(".index_menu_left").removeAttr("style", "border:1px solid #31b0d5");

		/*$(this).siblings(".change").on("mouseover",function(){
		 $(this).show()
		 })
		 $(this).siblings(".change").on("mouseout",function(){
		 $(this).hide()
		 })*/

	});
	$(".list_title").live("click", function () {
		//console.log($(this).html())
		$(this).children("input").attr("checked", true)
	})

	/*$("#leftNav").live("mouseleave", function () {
	 $(this).find(".change").hide();
	 });*/

	//加载左边导航菜单
	if (nwfdData != null) {
		$("#leftNav").html("");
		var shtml = "";
		var dhtml = "";
		for (var i = 0, m = nwfdData.length; i < m; i++) {
			var features = nwfdData[i];
			shtml += "<div class=\"index_menu index_menu01\" id=\"navpanel" + (i + 1).toString() + "\">";

			if (features.children.length > 1) {
				shtml += "<div class=\"index_menu_left \" onclick=\"\">";
				shtml += "<span style='display: inline-block;margin-top: 10px;'>" + features.name + "</span>";
				shtml += "<div class='navpanelList' id=\"navpanelList" + (i + 1).toString() + "\" style=\"background:url('images/data" + (i + 1).toString() + "_s.png')  no-repeat;\"></div>";
				shtml += "</div>";

				shtml += "<div class=\"change index01 floatL\" style=\"\">";
				shtml += "<div class=\"index_menu_right floatL\" style=\"background:rgba(255, 255,255,.5);\">";
				shtml += "<div class=\"index_menu_righ_list floatL\">";
				var childFeatures = features.children;
				for (var j = 0, l = childFeatures.length; j < l; j++) {
					var childFeature = childFeatures[j];
					shtml += "<span class=\"list_title\" onclick=\"\" ><input type=\"radio\" name=\"radioButton\"><span>" + childFeature.name + "</span></span>";
				}
				shtml += "</div></div></div>";
			} else {
				var childFeature = features.children[0];
				shtml += "<div class=\"index_menu_left \" onclick=\"\">";
				shtml += "<span style='display: inline-block;margin-top: 10px;'>" + childFeature.name + "</span>";
				shtml += "<div class='navpanelList' id=\"navpanelList" + (i + 1).toString() + "\" style=\"background:url('images/data" + (i + 1).toString() + "_s.png')  no-repeat;\"></div>";
				shtml += "</div>";
			}

			shtml += "</div>";

			//点击左侧图标
			$(".index_menu").live("click", function () {
				var index = $(this).index();

				if (isMobile()) {
					var height = 42;
				} else {
					var height = 49;
				}

				$(".index_menu_right").css("top", index * height + 26 + "px");

			})

			$("#navpanel" + (i + 1)).live("click", function () {
				var index = $(this).context.id.replace("navpanel", "");

				$(this).siblings(".change").css({display:"block"});
				$("#navpanelList" + (index)).attr("style", "background:url('images/data" + (index) + "_s.png')  no-repeat;");
				$(this).children(".index_menu_left").attr("style", "background:rgba(41, 50,65,.5);color:#fff;border:1px solid #fff;").addClass("select");
				var otherLength = $(this).siblings().children(".index_menu_left").children(".navpanelList").length;
				for (var j = 0; j < otherLength; j++) {
					var jid = $(this).siblings().children(".index_menu_left").children(".navpanelList")[j].id;
					var idss = jid.substring(jid.length - 1, jid.length);
					$(this).siblings().children(".index_menu_left").attr("style", "background:rgba(255, 255,255,.5);color:#000;border:1px solid #eee;").removeClass("select");
					$(this).siblings().children(".index_menu_left").children("#navpanelList" + idss).attr("style", "background:url('images/data" + (idss) + ".png')  no-repeat;");
				}

				//Nm = 2;
				if (kolse) {
					$("#action").css("display", "block");
					$("#stop").css("display", "none");
				}

				//停止自动播放
				moveStop();
				clearInterval(timeMove);

				$("#all .mellDay").remove();
				$("#pointer p").remove();
				$("#dateStyle .messDay").remove();
				$(".dayZet li").remove();
				$("#parst li").remove();
				$("#parst ol").remove();

				$("#partst").html("");
				$(".goStart").removeAttr("id");

				//numDiv(Nm);
				changeDiv($(".select span").html());

				ifLayer = ifTime($(".select span").html());
				//console.log(ifLayer)
				if(!Boolean(ifLayer)){
					pictureFlag=true;
				}else{
					pictureFlag=false;
				}
				weekDell();
				DayLes(ifLayer);

				if(!Boolean(ifLayer)){
					delTsp();
				}else{
					$("#all").css("left","0");
				}

				dateRs();  //日期
				pointerAction(ifLayer);
				clickDiv(ifLayer);
				timeBk();

				//移动端时间轴的处理
				init();
				creatDate(ifLayer);
				creatLi(ifLayer);

				celSever(ifLayer);
				centerPointer(ifLayer);

				var obj = $(".select span").html();
				var featureData = getCheckedFeatureData(obj);

				if (!mapClickFlag) {
					initGif(featureData, 2);
					//reRectangle.addTo(map);
				}

				var reName = featureData.name + "格点预报（" + featureData.mileage + "）";
				$("#recordName").html(reName);
				$("#recordName1").html(reName);
				var mobile = isMobile();
				var arry = hoursDel(ifLayer);
				var lenNum = arry[0];
				if(ifLayer){
					var divName = parseInt($(".hours").eq(lenNum).attr("name"));
					var numHours = (divName % 24).toString();
					if (numHours.length < 2) {
						numHours = 0 + numHours;
					}
					var numDay = parseInt(divName / 24);

					var dayHtml = $(".dayZet li").eq(numDay).html();

					var currentTime = dayHtml + " " + numHours + ":00";
				}else{
					var divName = parseInt($(".hours").eq(lenNum).attr("name"));
					var numHours = (divName % 24).toString();
					if (numHours.length < 2) {
						numHours = 0 + numHours;
					}
					var numDay = parseInt(divName / 24);
					if((nuTm+hel1)>24){
						var dayHtml = $(".dayZet li").eq(numDay-1).html();
					}else{
						var dayHtml = $(".dayZet li").eq(numDay).html();
					}
					//var dayHtml = $(".dayZet li").eq(numDay-1).html();

					var currentTime = dayHtml + " " + numHours + ":00";
				}


				if(ifLayer){
					if(Boolean(qel2) && !Boolean(qel3)){
						var a,b;
						var firstForeLeft;
						//全部实况的结束时的left
						var shikLeft;
						//结束时的的left
						var endForeLeft=$("#parst").width();
						var  firstDayForeLeft
						if(Tm>=6&&Tm<18){

							firstForeLeft=(liveTm+1)*20+10;
							shikLeft=(liveTm+1)*20;
							firstDayForeLeft=33*20-10;
						}else if(Tm<6){
							var tmpTm=liveTm;
							if(liveTm == 23){
								tmpTm=-1
							}

							firstForeLeft=(24+tmpTm+1)*20+10;
							shikLeft=(24+tmpTm+1)*20;
							firstDayForeLeft=45*20-10;
						}else if(Tm>=18){

							firstForeLeft=(liveTm+1)*20+10;
							shikLeft=(liveTm+1)*20;
							firstDayForeLeft=45*20-10;
						}
						var startLeft=parseInt($("#parst").css("left"));
						if(-startLeft<firstForeLeft){
							var index1=parseInt((-startLeft-10)/20);
						}else if(-startLeft==firstForeLeft){
							var index1=parseInt((shikLeft-10)/20)+1;
						}else{
							var index1=parseInt((shikLeft-10)/20)+1+parseInt(-startLeft-firstForeLeft);
						}

						var numHours1=$(".hours").eq(index1-1).html();
						if(mobile){
							//移动端获取URL
							getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,firstDayForeLeft)

						}else{
							//PC端获取URL
							getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,firstDayForeLeft)

							//	getUrl(nuTm, startTime, featureData);
							//
							if (currentLatLng != null && mapClickFlag && yxMapClick) {
								//pickValue(currentLatLng);
								pickValue1(currentLatLng);
							}
							if(firstFlag==true){
								if(latCan!=""&&lngCan!=""){
									var latlng = L.latLng(latCan,lngCan);
									//map.setZoom(3);

									flagCan = true;
									map.panTo(latlng);
									pickValue1(latlng);
									showEchart(latlng);
									firstFlag=false;
									var myP1 = new BMap.Point(latlng.lng,latlng.lat);
									geoc.getLocation(myP1, function(rs){
										if(rs !=null){
											var addComp = rs.addressComponents;
											var area = addComp.district;
											var inputVal = area + "  " + latlng.lng.toFixed(2) + "," + latlng.lat.toFixed(2);

											$(".searchDiv input").val(inputVal);

										}

									});
								}
							}

						}

					}else if(Boolean(qel3)){

					}else{
						var a,b;
						var firstForeLeft;
						//全部实况的结束时的left
						var shikLeft;
						//结束时的的left
						var endForeLeft=$("#parst").width();
						var  firstDayForeLeft;
						if(Tm>=6&&Tm<18){
							a = (33 - (liveTm+1)) % hel1;
							if(a ==0){
								b =20*hel1/2;
							}else{
								b=20*a/2;
							}
							firstForeLeft=(liveTm+1)*20+b;
							shikLeft=(liveTm+1)*20;
							firstDayForeLeft=33*20-10;
						}else if(Tm<6){
							var tmpTm=liveTm
							if(liveTm == 23){
								tmpTm=-1
							}
							a = (45 - (24+tmpTm+1)) % hel1;
							if(a ==0){
								b =20*hel1/2;
							}else{
								b=20*a/2;
							}
							firstForeLeft=(24+tmpTm+1)*20+b;
							shikLeft=(24+tmpTm+1)*20;
							firstDayForeLeft=45*20-10;
						}else if(Tm>=18){
							a = (33 - (liveTm+1)) % hel1;
							if(a ==0){
								b =20*hel1/2;
							}else{
								b=20*a/2;
							}
							firstForeLeft=(liveTm+1)*20+b;
							shikLeft=(liveTm+1)*20;
							firstDayForeLeft=45*20-10;
						}
						var startLeft=parseInt($("#parst").css("left"));
						if(-startLeft<firstForeLeft){
							var index1=parseInt((-startLeft-10)/20);
						}else if(-startLeft==firstForeLeft){
							var index1=parseInt((shikLeft-10)/20)+1;
						}else{
							var index1=parseInt((shikLeft-10)/20)+1+parseInt(-startLeft-firstForeLeft);
						}

						var numHours1=$(".hours").eq(index1-1).html();
						if(isMobile()){
							getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,b)

						}else{
							//PC端获取URL
							getUrl2(startTime,  featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,numHours1,b)

							//	getUrl(nuTm, startTime, featureData);
							//
							if (currentLatLng != null && mapClickFlag && yxMapClick) {
								//pickValue(currentLatLng);
								pickValue1(currentLatLng);
							}
							if(firstFlag==true){
								if(latCan!=""&&lngCan!=""){
									var latlng = L.latLng(latCan,lngCan);
									//map.setZoom(3);

									flagCan = true;
									map.panTo(latlng);
									pickValue1(latlng);
									showEchart(latlng);
									firstFlag=false;
									var myP1 = new BMap.Point(latlng.lng,latlng.lat);
									geoc.getLocation(myP1, function(rs){
										if(rs !=null){
											var addComp = rs.addressComponents;
											var area = addComp.district;
											var inputVal = area + "  " + latlng.lng.toFixed(2) + "," + latlng.lat.toFixed(2);

											$(".searchDiv input").val(inputVal);

										}

									});
								}
							}

						}

					}



				}else{
					getUrl1(startTime, currentTime, featureData);
				}


				if (currentLatLng != null) {
					pickValue1(currentLatLng);
				}

				if(firstFlag==true){
					if(latCan!=""&&lngCan!=""){
						var latlng = L.latLng(latCan,lngCan);
						map.setZoom(3);
						map.panTo(latlng);

						pickValue1(latlng);
						firstFlag=false;
						var myP1 = new BMap.Point(latlng.lng,latlng.lat);
						geoc.getLocation(myP1, function(rs){
							if(rs !=null){
								var addComp = rs.addressComponents;
								var area = addComp.district;
								var inputVal = area + "  " + latlng.lng.toFixed(2) + "," + latlng.lat.toFixed(2);

								$(".searchDiv input").val(inputVal);

							}

						});
					}
				}

			});
		}

		$("#leftNav").html(shtml);
		//触发input点击事件

		$(".index_menu_left").eq(0).trigger("click");
		$(".index_menu_left").siblings().css({display: "none"});

	}

	var t = startTime.format("yyyy-MM-dd");
	if(Tm >= 6 && Tm < 18){
		t += "&nbsp;&nbsp;08时发布";
	}else if(Tm >= 18){
		t += "&nbsp;&nbsp;20时发布";
	}else if(Tm < 6){
		t = moment(startTime).subtract(1,"day").toDate().format("yyyy-MM-dd") + "&nbsp;&nbsp;20时发布";
	}
	$("#recordTime").html(t);



//设置cookie里边的值
	function setCookie(name,value,time)
	{
		var strsec = getsec(time);
		var exp = new Date();
		exp.setTime(exp.getTime() + strsec*1);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}
	//设置过期时间
	function getsec(str)
	{
		var str1=str.substring(1,str.length)*1;
		var str2=str.substring(0,1);
		if (str2=="s")
		{
			return str1*1000;
		}else if(str2=="m"){
			return str1*60*1000;
		}
		else if (str2=="h")
		{
			return str1*60*60*1000;
		}
		else if (str2=="d")
		{
			return str1*24*60*60*1000;
		}
	}
	//读取cookie值
	function getCookie(name)
	{
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

		if(arr=document.cookie.match(reg))

			return unescape(arr[2]);
		else
			return null;
	}

	function showEchart(latlng, g) {
		var g = g ? true : false;
		var lat = latlng.lat;
		var lng = latlng.lng;
		var day = 10;
		lat1 = lat;
		lng1 = lng;
		/*var locationUrl = handlerPath + "/MeteoHandler?method=getnptgridlocation&lng=" + lng + "&lat=" + lat;
		 //console.log(locationUrl);
		 $.ajax({
		 url: locationUrl,
		 type: 'GET',
		 dataType: 'json',
		 success: function (result) {
		 if (result) {
		 var lat = result.lat;
		 var lng = result.lng;
		 var province = result.province;
		 var city = result.city;
		 var area = result.county;

		 //console.log(lat1)
		 inputVal = area + "  " + lng + "," + lat;
		 //$("#longitude").html(lng.toFixed(2)+"°");
		 //$("#latitude").html(lat.toFixed(2)+"°");
		 $("#province").html(province);
		 $("#city").html(city);
		 $("#area").html(area);
		 //if(g){
		 $(".searchDiv input").val(inputVal)
		 //}
		 }
		 },
		 error: function (XMLHttpRequest, textStatus, errorThrown) {
		 console.error("加载数据失败")
		 }
		 });*/

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
				inputVal = area + "  " + lng.toFixed(2) + "," + lat.toFixed(2);
				//$("#longitude").html(lng.toFixed(2)+"°");
				//$("#latitude").html(lat.toFixed(2)+"°");
				$("#province").html(province);
				$("#city").html(city);
				$("#area").html(area);
				//if(g){
				$(".searchDiv input").val(inputVal);
				//}
			}

		});

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
						option.xAxis[0].data = result.category;
						option.series[0].data = result.data;
						myChart1.setOption(option);
						createShixvTable(option);
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

						option.xAxis[0].data = tmpCategory;
						option.series[0].data = tmpData;
						myChart1.setOption(option);
						createShixvTable(option);
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

						option.xAxis[0].data = tmpCategory;
						option.series[0].data = tmpData;
						myChart1.setOption(option);
						createShixvTable(option);
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
						option.xAxis[0].data = result.category;
						option.series[1].data = result.data;
						myChart1.setOption(option);
						createShixvTable(option);
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

						option.xAxis[0].data = tmpCategory;
						option.series[1].data = tmpData;
						myChart1.setOption(option);
						createShixvTable(option);
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

						option.xAxis[0].data = tmpCategory;
						option.series[1].data = tmpData;
						myChart1.setOption(option);
						createShixvTable(option);
					}
				}
			},
			error: function (errMsg) {
				console.error("加载数据失败");
			}
		});

		//1小时风速数据 (前端处理为3小时间隔数据)
		var wind_05_1hUrl = handlerPath + "/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/wind_05_1h&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
		$.ajax({
			type: 'get',
			url: wind_05_1hUrl,
			dataType: 'json',
			success: function (result) {
				if (result) {
					if (result.status == 0) {
						return;
					}

					if(forecastRule == "d310"){
						option.xAxis[0].data = result.category;
						option.series[2].data = result.data;
						myChart1.setOption(option);
						createShixvTable(option);
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

						option.xAxis[0].data = tmpCategory;
						option.series[2].data = tmpData;
						myChart1.setOption(option);
						createShixvTable(option);
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

						option.xAxis[0].data = tmpCategory;
						option.series[2].data = tmpData;
						myChart1.setOption(option);
						createShixvTable(option);
					}
				}
			},
			error: function (errMsg) {
				console.error("加载数据失败");
			}
		});

		//1小时相对湿度数据 (前端处理为3小时间隔数据)
		var rrh_05_1hUrl = handlerPath + "/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/rrh_05_1h&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
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
						option.xAxis[0].data = result.category;
						option.series[3].data = result.data;
						myChart1.setOption(option);
						createShixvTable(option);
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

						option.xAxis[0].data = tmpCategory;
						option.series[3].data = tmpData;
						myChart1.setOption(option);
						createShixvTable(option);
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

						option.xAxis[0].data = tmpCategory;
						option.series[3].data = tmpData;
						myChart1.setOption(option);
						createShixvTable(option);
					}

				}
			},
			error: function (errMsg) {
				console.error("加载数据失败");
			}
		});

		//3小时云量数据 (前端处理为3小时间隔数据)
		var cloud_05_1hUrl = handlerPath + "/MeteoHandler?method=getmeteodatablockfeatureinfo&type=grid&relativePath=/fsol/cloud_05_1h&format={yyyyMMddHH}.{XXX}&publishDate=" + publishDate + "&lat=" + lat + "&lng=" + lng + "&day=" + day;
		$.ajax({
			type: 'get',
			url: cloud_05_1hUrl,
			dataType: 'json',
			success: function (result) {
				if (result) {
					if (result.status == 0) {
						return;
					}

					option.xAxis[0].data = result.category;
					option.series[4].data = result.data;
					myChart1.setOption(option);
					createShixvTable(option);
					//$('#publishDate3').text(result.publishDate);
				}
			},
			error: function (errMsg) {
				console.error("加载数据失败");
			}
		});
		var htmlWidth = isMobile();
		//console.log(quxiaoFlag)
		if (quxiaoFlag && !htmlWidth) {
			$(".icon-zhankai").removeClass("icon-zhankai").addClass("icon-shousuo").animate({left: "-700px"}, 500);
			$(".chartBox").css({visibility: "visible"});
			$(".chartBox").animate({width: "700px"}, 500);
			myChart1.setOption(option);
			//console.log(option)
			//创建表格数据
			createShixvTable(option);
			quxiaoFlag = false;
		}
	}

	//创建表格数据
	function createShixvTable(option) {
		//console.log(option)
		var str = "<tr><td>预报时间</td></tr>";
		var optionEles = option.legend.data;
		var unit = ["(mm)", "(℃)", "(m/s)", "(%)", "(%)"];
		var flag = true;
		var redArr = [];
		var greenArr = [];
		//var optionTimes=option.xAxis[0].data;
		//console.log(option.xAxis[0].data)
		//var optionSeries=option.series;
		var strTime = "<tr>";
		//创建要素
		for (var i = 0; i < optionEles.length; i++) {
			str += "<tr><td>" + optionEles[i] + unit[i] + "</td></tr>"
		}
		//创建时间option.series

		for (var i = 0; i < option.xAxis[0].data.length; i++) {

			if (option.xAxis[0].data[i].substring(8, 10) % 2 == 0) {
				redArr.push(i);
				strTime += "<td  style='background:#A5CEF0'>" + option.xAxis[0].data[i].substring(8, 10) + "日" + option.xAxis[0].data[i].substring(11, 16) + "</td>";
				//flag=true;
			} else if (option.xAxis[0].data[i].substring(8, 10) % 2 != 0) {
				greenArr.push(i);
				strTime += "<td style='background:#C1DCFA'>" + option.xAxis[0].data[i].substring(8, 10) + "日" + option.xAxis[0].data[i].substring(11, 16) + "</td>";

			}
		}
		strTime += "</tr>";
		//创建哥哥要素对应数据
		for (var i = 0; i < option.series.length; i++) {
			strTime += "<tr>";
			for (var j = 0; j < option.series[i].data.length; j++) {
				//for(var k=0;k<redArr.length;k++){
				//    if(j ==redArr[k]){
				if(redArr.indexOf(j,0)!=-1){
					strTime += "<td style='background:#A5CEF0'>" + option.series[i].data[j] + "</td>"

				}else{
					strTime+="<td style='background:#C1DCFA'>"+option.series[i].data[j]+"</td>"

				}

			}

			//}
			strTime += "</tr>"
		}

		$(".shixvTable").html(str);

		$(".shixvTable1").html(strTime);

	}

	// 获取某个选中子要素的数据
	function getCheckedFeatureData(obj){
		var featureData = null;
		for(var i=0;i<nwfdData.length;i++){
			if(obj==nwfdData[i].name){
				if(nwfdData[i].children.length==1){
					featureData = nwfdData[i].children[0];
				}else {
					var obj = $(".select").siblings().find("input[name=radioButton]:checked").siblings().html();
					var values = nwfdData[i].children;
					for(var j = 0; j < values.length; j++){
						if(obj == values[j].name){
							featureData = values[j];
							break;
						}
					}
				}
				break;
			}
		}
		return featureData;
	}



	function initGif(feautrueData,flag){
		if(!Boolean(ifLayer)){
			//表示没有实况只有预报的要素的初始化
			var apiTime=startTime;
			var api='';
			if(Tm>=18){
				apiTime.setHours(20);
			}else if(Tm>=6&&Tm<18){
				apiTime.setHours(8);
			}else{
				apiTime=moment(apiTime).subtract(1,"day").toDate().setHours(20);
			}
			api+='<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
			for(var i=0;i<feautrueData.time.length;i++){


				api+='<option value="'+moment(apiTime).subtract(-feautrueData.time[i],"hour").toDate().format("yyyy-MM-dd HH:00")+'">'+moment(apiTime).subtract(-feautrueData.time[i],"hour").toDate().format("yyyy-MM-dd HH:00")+'</option>'
				//console.log()
			}

			api+='</select></span></br>';
			api+='<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
			for(var i=feautrueData.time.length-1;i>=0;i--){
				api+='<option value="'+moment(apiTime).subtract(-feautrueData.time[i],"hour").toDate().format("yyyy-MM-dd HH:00")+'">'+moment(apiTime).subtract(-feautrueData.time[i],"hour").toDate().format("yyyy-MM-dd HH:00")+'</option>'

			}
			//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
			//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
			api+='</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

			for(var i=0;i<rangeData.length;i++){
				api+='<option value="'+rangeData[i].name+'">'+rangeData[i].name+'</option>'
			}
			api+='</select>'
			$(".apiImg").html(api);
			//$("#fwei").children("option").eq(1).attr("selected",true);
			//点击div改变无实况的要素的起始时间
			var time=getDiv(feautrueData.time);
			for(var i=0;i<feautrueData.time.length;i++){
				if(time==feautrueData.time[i]){
					$("#option2").children("option").eq(i).attr("selected",true);
					$("#option3").children("option").eq(feautrueData.time.length-i-1).attr("selected",true);
				};
			}
		}else {

			if (Boolean(qel2) && !Boolean(qel3)) {
				//表示实况与预报结合的要素的初始化
				var index=getDivIndex();
				var temp;
				if(Tm<6){
					if(liveTm==23){
						temp=24;
					}else{
						temp=liveTm+24;
					}

				}else if(Tm>=6&&Tm<8){
					temp=liveTm+1;
				}else{
					temp=liveTm;
				}

				if(index<temp){
					//console.log("小于");
					pictureFlag=false;
					return;
				}else {
					//相当于走预报的路径
					if (Tm < 6) {
						if(liveTm!=Tm){
							if(liveTm==23){
								var div08Index =24;//表示当天08时的div的个数
							}else{
								var div08Index = liveTm + 24+1;//表示当天08时的div的个数
							}
						}else{
							var div08Index = liveTm + 24+1;//表示当天08时的div的个数
						}
						if (index < div08Index) {
							//console.log("小于");
							pictureFlag = false;
							return;
						} else {
							var apiTime = startTime;
							apiTime = moment(apiTime).subtract(1, "day").toDate().setHours(20);
							var api = '';
							api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';

							for (var i =Math.floor((div08Index-21)/hel1)+ index - div08Index; i < feautrueData.time.length; i++) {

								api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
								//console.log()
							}

							api += '</select></span></br>';
							api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
							for (var i = feautrueData.time.length - 1; i>=Math.floor((div08Index-21)/hel1)+ index - div08Index; i--) {
								api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

							}
							//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
							//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
							api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

							for (var i = 0; i < rangeData.length; i++) {
								api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
							}
							api += '</select>'
							$(".apiImg").html(api);
							$("#option3").children("option").last().attr("selected",true);

							pictureFlag = true;

						}
					} else if (Tm >= 6 && Tm < 18) {

						if (Tm == 6) {
							var div08Index = liveTm + (8-liveTm);//表示当天08时的div的个数
							if (index <= div08Index) {
								//console.log("小于");
								pictureFlag = false;
								return;
							} else {
								var apiTime = startTime;
								apiTime = apiTime.setHours(8);
								var apiTime = startTime;
								var api = '';
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i = index - div08Index-1; i < feautrueData.time.length; i++) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >= index - div08Index-1; i--) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
							}

						} else if (Tm == 7) {
							var div08Index = liveTm + (8-liveTm);//表示当天08时的div的个数
							if (index <= div08Index) {
								//console.log("小于");
								pictureFlag = false;
								return;
							} else {
								var apiTime = startTime;
								apiTime = apiTime.setHours(8);
								var api = '';
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i = index - div08Index-1 ; i < feautrueData.time.length; i++) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >= index - div08Index-1; i--) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
							}
						} else if(Tm==8){
							var div08Index = liveTm +(8-liveTm) ;//表示当天08时的div的个数
							if(index<=div08Index){
								//console.log("小于");
								pictureFlag = false;
								return;
							}else{
								var apiTime = startTime;
								apiTime = apiTime.setHours(8);
								var api = '';
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i =(index-div08Index)+Math.floor((div08Index-9)/3); i < feautrueData.time.length; i++) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >= (index-div08Index)+Math.floor((div08Index-9)/3); i--) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
							}
						} else {

							var div08Index = liveTm +1 ;//表示当天08时的div的个数
							if(index<div08Index){
								//console.log("小于");
								pictureFlag = false;
								return;
							}else{
								var apiTime = startTime;
								apiTime = apiTime.setHours(8);
								var api = '';
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i =index-9; i < feautrueData.time.length; i++) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >= index-9; i--) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
							}

						}
					}else if (Tm >= 18) {
						var apiTime = startTime;
						apiTime = apiTime.setHours(20);

						var api = '';
						if(Tm==18){
							var div08Index = liveTm +(20-liveTm) ;//表示当天08时的div的个数
							if(index<=div08Index){
								//console.log("小于");
								pictureFlag = false;
								return;
							}else{
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i = index-div08Index-1; i < feautrueData.time.length; i++) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >=index-div08Index-1; i--) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
							}

						}else if(Tm==19){
							var div08Index = liveTm +(20-liveTm) ;//表示当天08时的div的个数
							if(index<=div08Index){
								//console.log("小于");
								pictureFlag = false;
								return;
							}else{
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i = index-div08Index-1; i < feautrueData.time.length; i++) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >=index-div08Index-1; i--) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
							}
						}else if(Tm==20){
							var div08Index = liveTm +(20-liveTm) ;//表示当天08时的div的个数
							if(index<=div08Index){
								//console.log("小于");
								pictureFlag = false;
								return;
							}else{
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i = index-div08Index-1; i < feautrueData.time.length; i++) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >=index-div08Index-1; i--) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
								//console.log($(".bbb").eq(Tm).attr("name"))
							}
						} else{


							if(index<div08Index){
								//console.log("小于");
								pictureFlag = false;
								return;
							}else{
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i = index-21; i < feautrueData.time.length; i++) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >=index-21; i--) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
								//console.log($(".bbb").eq(Tm).attr("name"))
							}
						}



					}

				}

			} else if (Boolean(qel3)) {


			} else {
				var index=getDivIndex();
				var temp;
				if(Tm<6){
					if(liveTm==23){
						temp=24;
					}else{
						temp=liveTm+24;
					}

				}else if(Tm>=6&&Tm<8){
					temp=liveTm+1;
				}else{
					temp=liveTm;
				}

				if(index<temp){
					console.log("小于");
					pictureFlag=false;
					return;
				}else {
					//相当于走预报的路径
					if (Tm < 6) {
						if(liveTm!=Tm){
							if(liveTm==23){
								var div08Index =24;//表示当天08时的div的个数
							}else{
								var div08Index = liveTm + 24+1;//表示当天08时的div的个数
							}
						}else{
							var div08Index = liveTm + 24+1;//表示当天08时的div的个数
						}
						if (index < div08Index) {
							console.log("小于");
							pictureFlag = false;
							return;
						} else {
							var apiTime = startTime;
							apiTime = moment(apiTime).subtract(1, "day").toDate().setHours(20);
							var api = '';
							api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';

							for (var i =Math.floor((div08Index-21)/hel1)+ index - div08Index; i < feautrueData.time.length; i++) {

								api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
								//console.log()
							}

							api += '</select></span></br>';
							api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
							for (var i = feautrueData.time.length - 1; i>=Math.floor((div08Index-21)/hel1)+ index - div08Index; i--) {
								api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

							}
							//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
							//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
							api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

							for (var i = 0; i < rangeData.length; i++) {
								api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
							}
							api += '</select>'
							$(".apiImg").html(api);
							$("#option3").children("option").last().attr("selected",true);

							pictureFlag = true;

						}
					} else if (Tm >= 6 && Tm < 18) {

						if (Tm == 6) {
							var div08Index = liveTm + 2;//表示当天08时的div的个数
							if (index < div08Index) {
								console.log("小于");
								pictureFlag = false;
								return;
							} else {
								var apiTime = startTime;
								apiTime = apiTime.setHours(8);
								var apiTime = startTime;
								var api = '';
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i = index - div08Index; i < feautrueData.time.length; i++) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >= index - div08Index; i--) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
							}

						} else if (Tm == 7) {
							var div08Index = liveTm + 2;//表示当天08时的div的个数
							if (index < div08Index) {
								console.log("小于");
								pictureFlag = false;
								return;
							} else {
								var apiTime = startTime;
								apiTime = apiTime.setHours(8);
								var api = '';
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i = index - div08Index ; i < feautrueData.time.length; i++) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >= index - div08Index; i--) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
							}
						} else {
							var div08Index = liveTm +1 ;//表示当天08时的div的个数
							if(index<div08Index){
								console.log("小于");
								pictureFlag = false;
								return;
							}else{
								var apiTime = startTime;
								apiTime = apiTime.setHours(8);
								var api = '';
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i =(index-div08Index)+Math.floor((div08Index-9)/3); i < feautrueData.time.length; i++) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >= (index-div08Index)+Math.floor((div08Index-9)/3); i--) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
							}

						}
					}else if (Tm >= 18) {
						var apiTime = startTime;
						apiTime = apiTime.setHours(20);

						var api = '';
						if(Tm==18){
							var div08Index = liveTm +1 ;//表示当天08时的div的个数
							if(index<div08Index){
								console.log("小于");
								pictureFlag = false;
								return;
							}else{
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i = index-div08Index-1; i < feautrueData.time.length; i++) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >=index-div08Index-1; i--) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
							}

						}else if(Tm==19){
							var div08Index = liveTm +2 ;//表示当天08时的div的个数
							if(index<div08Index){
								console.log("小于");
								pictureFlag = false;
								return;
							}else{
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i = index-div08Index; i < feautrueData.time.length; i++) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >=index-div08Index; i--) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
							}
						}else{
							if(liveTm!=Tm){
								if(liveTm==19){
									var div08Index = liveTm +2 ;//表示当天08时的div的个数
								}else{
									var div08Index = liveTm +1 ;//表示当天08时的div的个数
								}
							}else{
								if(liveTm==23){
									var div08Index = liveTm ;//表示当天08时的div的个数
								}else{
									var div08Index = liveTm +1 ;//表示当天08时的div的个数
								}

							}
							//var div08Index = liveTm +1 ;//表示当天08时的div的个数
							if(index<div08Index){
								console.log("小于");
								pictureFlag = false;
								return;
							}else{
								api += '<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:12px;white-space:pre-line;color:#000;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
								for (var i = index-div08Index; i < feautrueData.time.length; i++) {

									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'
									//console.log()
								}

								api += '</select></span></br>';
								api += '<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
								for (var i = feautrueData.time.length - 1; i >=index-div08Index; i--) {
									api += '<option value="' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '">' + moment(apiTime).subtract(-feautrueData.time[i], "hour").toDate().format("yyyy-MM-dd HH:00") + '</option>'

								}
								//api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								//api+='</select></span><button class="buttonApi" disabled style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
								api += '</select></span><button class="buttonApi"  style="width: 80px;line-height: 20px;position: absolute;top:65px;right:40px;background: none;border:1px solid #ccc;">动态出图</button><div class="close"><b></b></div></br><select style="position: absolute;top:65px;left:15px;" name="fwei" id="fwei">';

								for (var i = 0; i < rangeData.length; i++) {
									api += '<option value="' + rangeData[i].name + '">' + rangeData[i].name + '</option>'
								}
								api += '</select>'
								$(".apiImg").html(api);
								$("#option3").children("option").last().attr("selected",true);
								pictureFlag = true;
								console.log($(".bbb").eq(Tm).attr("name"))
							}
						}



					}

				}
			}
		}

		if(flag == 1){
			//var preTime=$("#option2").children("option:selected").val();
			//var lastTime=$("#option3").children("option:selected").val();
			//var selectName=$(".select").children("span").html();

			var mapView=map.getBounds();
			var srcLatLngBounds = L.latLngBounds(feautrueData.bounds);

			if(reRectangle!=null){
				map.removeLayer(reRectangle);
			}
			$("#fwei").children("option").eq(1).attr("selected",true);
			var name=$("#fwei").children("option").eq(1).val();
			for(var i=0;i<rangeData.length;i++){
				if(name==rangeData[i].name){
					reRectangle = new Re_Rectangle(L.latLngBounds(rangeData[i].bounds));
				}
			}
			reRectangle.addTo(map);


			map.fitBounds([
				[2.760, 64.259],
				[54.693, 140.631]
			]);
		}

		//点击出单图
		$(".apiImg button").eq(0).on("click",function(){
			$(".apiImg button").removeClass("buttonApi");
			$(this).addClass("buttonApi");
			var width;
			var height;

			var selectName=$(".select").children("span").html();
			var srcLatLngBounds = L.latLngBounds(getCheckedFeatureData(selectName).bounds);
			var mapView=map.getBounds();
			//$("#imgBox a img").css({"width":width/2,"height":height/2});
			var preTime=$("#option2").children("option:selected").val();
			var preIndex=$("#option2").children("option:selected").index();
			var lastTime=$("#option3").children("option:selected").val();
			var lastIndex=$("#option3").children("option:selected").index();
			var len=$("#option2").children("option").length;
			if(preIndex<=len-1-lastIndex) {
				$(".popupApi").fadeIn(1000);
				$(this).attr("disabled",true);
				$(".popup_innerApi").text("正在动态出图,请稍后...");

				var destLatLngBounds = L.latLngBounds([[reRectangle.handle1.getLatLng().lat,reRectangle.handle1.getLatLng().lng],[reRectangle.handle3.getLatLng().lat,reRectangle.handle3.getLatLng().lng]]);
				var max = reRectangle.rectangle._pxBounds.max;
				var min = reRectangle.rectangle._pxBounds.min;
				width = max.x - min.x;
				height = max.y - min.y;

				//unders 和 aboves 要求返回的图片是按destLatLngBounds裁剪过的
				var unders=[
					new Promise(function (resolve,reject) {
						var img = new Image();
						img.onload=function () {
							var part = snip.part(img,mapView,destLatLngBounds);
							resolve(part);
						}
						//image.src = canvas.toDataURL("image/png");
						var canvas = collage();
						img.src=canvas.toDataURL("image/png");
					})
				];
				var renderer = basemap._renderer;
				var aboves=[
					snip.part(renderer._container,mapView,destLatLngBounds)
				];

				showGifImage(selectName,preTime,lastTime,srcLatLngBounds,destLatLngBounds,
					{width:width,height:height},//size要和destLatLngBounds的长宽比相同
					unders,aboves);
				//snip.toSave(snip.blobObject);
			}else{
				$(".popupApi").fadeIn(1000);
				$(".popup_innerApi").text("起始时间要小于结束时间");
				$(".popupApi").fadeOut(1000);
				return;
			}
		});
		//改变范围
		$("#fwei").change(function(){
			var name=$(this).val();
			if(name=="请选择"){
				$(".popupApi").fadeIn(1000);
				$(".popup_innerApi").text("请选择有效范围");
				$(".popupApi").fadeOut(1000);
				return;
			}else if(name=="全国"){
				map.fitBounds([
					[2.760, 64.259],
					[54.693, 140.631]
				]);
			}


			if(reRectangle!=null){
				map.removeLayer(reRectangle);
			}
			for(var i=0;i<rangeData.length;i++){
				if(name==rangeData[i].name){
					destlatLngBounds = L.latLngBounds(rangeData[i].bounds);
				}
			}
			reRectangle = new Re_Rectangle(L.latLngBounds(destlatLngBounds));
			//console.log(reRectangle)
			reRectangle.addTo(map);

			/*var preTime=$("#option2").children("option:selected").val();
			 var preIndex=$("#option2").children("option:selected").index();
			 var lastTime=$("#option3").children("option:selected").val();
			 var lastIndex=$("#option3").children("option:selected").index();
			 var len=$("#option2").children("option").length;
			 if(preIndex<=len-1-lastIndex){
			 if(reRectangle!=null){
			 map.removeLayer(reRectangle);
			 }
			 for(var i=0;i<rangeData.length;i++){
			 if(name==rangeData[i].name){
			 destlatLngBounds = L.latLngBounds(rangeData[i].bounds);
			 }
			 }
			 reRectangle = new Re_Rectangle(L.latLngBounds(destlatLngBounds));
			 //console.log(reRectangle)
			 reRectangle.addTo(map);

			 //var cuLat=(destlatLngBounds._northEast.lat+destLatLngBounds._southWest.lat)/2;
			 //var cuLng=(destLatLngBounds._northEast.lng+destLatLngBounds._southWest.lng)/2;
			 //var latlng = L.latLng(cuLat, cuLng);
			 //map.panTo(latlng);
			 var unders=[
			 new Promise(function (resolve,reject) {
			 var img = new Image();
			 img.onload=function () {
			 var part = snip.part(img,mapView,destLatLngBounds);
			 resolve(part);
			 }
			 //image.src = canvas.toDataURL("image/png");
			 var canvas = collage();
			 img.src=canvas.toDataURL("image/png");
			 })
			 ];
			 var renderer = basemap._renderer;
			 var aboves=[
			 snip.part(renderer._container,mapView,destLatLngBounds)
			 ];
			 var width=(destLatLngBounds._northEast.lng-destLatLngBounds._southWest.lng)*10;
			 var height=(destLatLngBounds._northEast.lat-destLatLngBounds._southWest.lat)*10;

			 addGifImage(selectName,preTime,lastTime,srcLatLngBounds,destLatLngBounds,
			 {width:width,height:height},//size要和destLatLngBounds的长宽比相同
			 unders,aboves);
			 }else{
			 $(".popupApi").fadeIn(1000);
			 $(".popup_innerApi").text("起始时间要小于结束时间");
			 $(".popupApi").fadeOut(1000);
			 return;
			 }*/
		});
		//改变起始时间
		$("#option2").change(function(){
			//changeApiOption();
		});
		//改变结束时间 触发事件
		$("#option3").change(function(){
			//changeApiOption();
		});

		$(".apiBox .close").on("click",function(){
			$(".apiBox").hide();
			map.removeLayer(reRectangle);
			mapClickFlag=true;
			mapMouseFlag=true;
		});
	}

	$(".api").on("click",function(){
		if(Boolean(ifLayer)) {
			var index = getDivIndex();
			if (Boolean(qel2) && !Boolean(qel3)) {
				if (Tm < 6) {
					if (liveTm == 23) {
						if (index <= 23) {
							pictureFlag = false;
						} else {
							pictureFlag = true;
						}
					} else {
						if (index <= liveTm + 24 - 1) {
							pictureFlag = false;
						} else {
							pictureFlag = true;
						}
					}

				} else if (Tm >= 6 && Tm < 8) {

					if (index <= liveTm + Math.ceil((8 - liveTm) / hel1)) {
						pictureFlag = false;
					} else {
						pictureFlag = true;
					}
				} else if (Tm >= 8 && Tm < 18) {
					if (index <= liveTm + Math.ceil((8 - liveTm) / hel1)) {
						pictureFlag = false;
					} else {
						pictureFlag = true;
					}
				} else if (Tm >= 18) {
					if (Tm == 18) {
						if (index < liveTm + (20-liveTm)+1) {
							pictureFlag = false;
						} else {
							pictureFlag = true;
						}
					} else if (Tm == 19) {
						if (index < liveTm + (20-liveTm)+1) {
							pictureFlag = false;
						} else {
							pictureFlag = true;
						}
					} else {
						if (liveTm != Tm) {
							if (liveTm == 20) {
								if (index <= liveTm) {
									pictureFlag = false;
								} else {
									pictureFlag = true;
								}
							}else if(liveTm==19){
								if (index <=liveTm + 1) {
									pictureFlag = false;
								} else {
									pictureFlag = true;
								}
							} else {
								if (index <liveTm + 1) {
									pictureFlag = false;
								} else {
									pictureFlag = true;
								}
							}
						}else {
							if (index <liveTm + 1) {
								pictureFlag = false;
							} else {
								pictureFlag = true;
							}
						}
					}
				}
			} else if (Boolean(qel3)) {


			} else {
				if (Tm < 6) {
					if (liveTm == 23) {
						if (index <= 23) {
							pictureFlag = false;
						} else {
							pictureFlag = true;
						}
					} else {
						if (index <= liveTm + 24 - 1) {
							pictureFlag = false;
						} else {
							pictureFlag = true;
						}
					}

				} else if (Tm >= 6 && Tm < 8) {

					if (index <= liveTm + Math.ceil((8 - liveTm) / hel1)) {
						pictureFlag = false;
					} else {
						pictureFlag = true;
					}
				} else if (Tm >= 8 && Tm < 18) {
					if (index <= liveTm + Math.ceil((8 - liveTm) / hel1)) {
						pictureFlag = false;
					} else {
						pictureFlag = true;
					}
				} else if (Tm >= 18) {
					if (Tm == 18) {
						if (index < liveTm + 2) {
							pictureFlag = false;
						} else {
							pictureFlag = true;
						}
					} else if (Tm == 19) {
						if (index < liveTm + 2) {
							pictureFlag = false;
						} else {
							pictureFlag = true;
						}
					} else {
						if (liveTm != Tm) {
							if (liveTm == 20) {
								if (index <= liveTm) {
									pictureFlag = false;
								} else {
									pictureFlag = true;
								}
							}else if(liveTm==19){
								if (index <=liveTm + 1) {
									pictureFlag = false;
								} else {
									pictureFlag = true;
								}
							} else {
								if (index <liveTm + 1) {
									pictureFlag = false;
								} else {
									pictureFlag = true;
								}
							}
						}else {
							if (index <liveTm + 1) {
								pictureFlag = false;
							} else {
								pictureFlag = true;
							}
						}
					}
				}
			}

		}
		if(!pictureFlag){
			$(".apiBox").hide();
			return
		}
		//console.log(quxiaoFlag)
		if(!quxiaoFlag){
			//取消时序图
			$(".icon-shousuo").removeClass("icon-shousuo").addClass("icon-zhankai").animate({left:"0px"})
			$(".chartBox").animate({width:0},function(){
				//$(".chartBox").css({visibility:"hidden"});
			});

			quxiaoFlag=true;
		}
		$("#tipMarker").hide();
		$("#pickValueMarker").hide();
		$(".apiBox").show();

		mapClickFlag=false;
		mapMouseFlag=false;
		//yxMapClick=false;
		var selectName=$(".select").children("span").html();
		//var feautrueData = getCheckedFeatureData(selectName);
		//console.log(getCheckedFeatureData(selectName))

		/*var apiTime=startTime;
		 var api='';
		 api+='<div class="popupApi" style="display:none;background:rgba(0,0,0,.5);padding:5px;position:absolute;margin:auto;left:0;right:0;top:0;bottom:0;width:240px;height:45px;z-index:4000"><div class="popup_innerApi" style="background:#fff;text-align:center;width:auto;padding:10px;font-size:14px;white-space:pre-line;color:#666;line-height:24px"></div></div><span style="margin: 5px;">开始时间：<select name="option2" id="option2">';
		 for(var i=0;i<feautrueData.time.length;i++){

		 if(startTime.getHours()>=18){
		 apiTime.setHours(20);
		 }else{
		 apiTime.setHours(8);
		 }
		 api+='<option value="'+moment(apiTime).subtract(-feautrueData.time[i],"hour").toDate().format("yyyy-MM-dd HH:00")+'">'+moment(apiTime).subtract(-feautrueData.time[i],"hour").toDate().format("yyyy-MM-dd HH:00")+'</option>'
		 //console.log()
		 }

		 api+='</select></span></br>';
		 api+='<span style="margin: 5px">结束时间：<select name="option3" id="option3">';
		 for(var i=feautrueData.time.length-1;i>=0;i--){

		 if(startTime.getHours()>=18){
		 apiTime.setHours(20);
		 }else{
		 apiTime.setHours(8);
		 }
		 api+='<option value="'+moment(apiTime).subtract(-feautrueData.time[i],"hour").toDate().format("yyyy-MM-dd HH:00")+'">'+moment(apiTime).subtract(-feautrueData.time[i],"hour").toDate().format("yyyy-MM-dd HH:00")+'</option>'

		 }
		 //api+='</select></span><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:50px;">出图</button><button class="buttonApi" style="width: 50px;line-height: 20px;position: absolute;top:60px;right:120px;">截图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';
		 api+='</select></span><button class="buttonApi" style="width: 80px;line-height: 20px;position: absolute;top:60px;right:50px;">动态出图</button><div class="close"><b></b></div></br><select name="fwei" id="fwei">';

		 for(var i=0;i<rangeData.length;i++){
		 api+='<option value="'+rangeData[i].name+'">'+rangeData[i].name+'</option>'
		 }
		 api+='</select>';
		 $(".apiImg").html(api);
		 //$("#fwei").children("option").eq(1).attr("selected",true);
		 var time=getDiv(feautrueData.time);
		 for(var i=0;i<feautrueData.time.length;i++){
		 if(time==feautrueData.time[i]){
		 $("#option2").children("option").eq(i).attr("selected",true);
		 $("#option3").children("option").eq(feautrueData.time.length-i-1).attr("selected",true);
		 };
		 }*/

		initGif(getCheckedFeatureData(selectName),1);
		if(!yxMapClick){
			$(".selectElementBox .close").trigger("click");
		}
		//destLatLngBounds = L.latLngBounds([[16,70],[60,140]]);
		//width=(destLatLngBounds._northEast.lng-destLatLngBounds._southWest.lng)*10;
		//height=(destLatLngBounds._northEast.lat-destLatLngBounds._southWest.lat)*10;

		/*if(reRectangle!=null){
		 map.removeLayer(reRectangle);
		 }
		 $("#fwei").children("option").eq(1).attr("selected",true);
		 var name=$("#fwei").children("option").eq(1).val();
		 for(var i=0;i<rangeData.length;i++){
		 if(name==rangeData[i].name){
		 reRectangle = new Re_Rectangle(L.latLngBounds(rangeData[i].bounds));
		 }
		 }
		 reRectangle.addTo(map);
		 map.fitBounds([
		 [2.760, 64.259],
		 [54.693, 140.631]
		 ]);*/
		//$(".selectElementBox").hide();
	});


	//下载图片
	function showGifImage(ele,startTime,endTime,srcLatLngBounds,destlatLngBounds,destSize,unders,aboves){
		snip.prepare(ele,startTime,endTime,srcLatLngBounds,destlatLngBounds,
			destSize,//size要和destLatLngBounds的长宽比相同
			unders,aboves)
			.then(snip.toSave);
	}

	// 电脑端显示图层数据
	function getUrl(nuTm, startTime, featureData){
		//var url = path +getfile($(".select span").html()) + getUrl(nuTm,startTime);
		var fileName = getFileName(nuTm, startTime, featureData);

		var url = "";
		var bounds = featureData.bounds;
		if(featureData.liveVisible){
			var index = getDivIndex();
			if(Tm >= 6 && Tm < 18){
				if(index <= liveTm){
					url =  path + featureData.liveRelativePath + "/" + fileName + ".2.png";
					if(featureData.liveBounds){
						bounds = featureData.liveBounds;
					}
				}else{
					url =  path + featureData.relativepath + "/" + fileName + ".2.png";
				}
			}else if(Tm >= 18){
				if(index <= liveTm){
					url =  path + featureData.liveRelativePath + "/" + fileName + ".2.png";
					if(featureData.liveBounds){
						bounds = featureData.liveBounds;
					}
				}else{
					url =  path + featureData.relativepath + "/" + fileName + ".2.png";
				}
			}else if(Tm < 6){
				var tmpTm = liveTm;
				if(liveTm == 23){
					tmpTm = -1;
				}

				if(index <= tmpTm+24){
					url =  path + featureData.liveRelativePath + "/" + fileName + ".2.png";
					if(featureData.liveBounds){
						bounds = featureData.liveBounds;
					}
				}else{
					url =  path + featureData.relativepath + "/" + fileName + ".2.png";
				}
			}

		}else{
			url =  path + featureData.relativepath + "/" + fileName + ".2.png";
		}

		if(currentLargeImageLayer == null){
			if(featureData.imageLayerVisible == true){
				var errorTileUrl="images/empty.png";
				var mapOptions = {title: "", opacity:0.5, fadeAnimation: false, bounds:bounds, assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
				var options = {url: url, styleKey: featureData.style, nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions};
				currentLargeImageLayer = new shell.MeteoLayer(options);
				if(currentLargeImageLayer){
					currentLargeImageLayer.addTo(map);
					currentLargeImageLayer.on('layerAdded', function (layer) {
						//console.log('layerAdded');
						var drawStyle = layer.drawStyle;
						if (drawStyle && drawStyle.paletteEntries) {
							shell.application.paletteBar.update(drawStyle.paletteEntries);
						}
						shell.application.paletteBar.show();

					});
				}
			}

			if(featureData.vectorLayerVisible == false){
				if(currentVectorTileLayer != null){
					var layer1 = currentVectorTileLayer.layers.origin.layer;
					if(layer1 != null){
						map.removeLayer(layer1);
					}
					var layer2 = currentVectorTileLayer.layers.stream.layer;
					if(layer2 != null){
						map.removeLayer(layer2);
					}
					if(map.hasLayer(currentVectorTileLayer)){
						map.removeLayer(currentVectorTileLayer);
					}
					currentVectorTileLayer = null;
				}
			}
		}else{
			if(featureData.imageLayerVisible == true){
				var errorTileUrl="images/empty.png";
				var mapOptions = {title: "", opacity:0.5, fadeAnimation: false, bounds:bounds, assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
				var options = {url: url, styleKey: featureData.style, nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions};
				currentLargeImageLayer.options = options;
				currentLargeImageLayer.setUrl(url);
				currentLargeImageLayer.on('layerUpdated', function (layer) {
					var drawStyle = layer.drawStyle;
					if (drawStyle && drawStyle.paletteEntries) {
						shell.application.paletteBar.update(drawStyle.paletteEntries);
					}
					shell.application.paletteBar.show();

				});
			}

			if(featureData.vectorLayerVisible == false){
				if(currentVectorTileLayer != null){
					var layer1 = currentVectorTileLayer.layers.origin.layer;
					if(layer1 != null){
						map.removeLayer(layer1);
					}
					var layer2 = currentVectorTileLayer.layers.stream.layer;
					if(layer2 != null){
						map.removeLayer(layer2);
					}
					if(map.hasLayer(currentVectorTileLayer)){
						map.removeLayer(currentVectorTileLayer);
					}
					currentVectorTileLayer = null;
				}
			}
		}

		if(currentVectorTileLayer == null){
			if(featureData.vectorLayerVisible == true){
				var vectorUrl = "";
				if(featureData.liveVisible){
					var index = getDivIndex();
					if(Tm >= 6 && Tm < 18){
						if(index <= liveTm){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}else if(Tm >= 18){
						if(index <= liveTm){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}else if(Tm < 6){
						var tmpTm = liveTm;
						if(liveTm == 23){
							tmpTm = -1;
						}

						if(index <= tmpTm+24){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}

				}else{
					vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
				}

				var options = {layerType:"VectorTile",styleKey:featureData.style,url:[vectorUrl,""]};
				currentVectorTileLayer = new shell.MeteoLayer(options);
				if(currentVectorTileLayer){
					currentVectorTileLayer.addTo(map);
					currentVectorTileLayer.on('layerAdded', function (layer) {
						var drawStyle = layer.drawStyle;
						if (drawStyle && drawStyle.paletteEntries) {
							shell.application.paletteBar.update(drawStyle.paletteEntries);
						}
						shell.application.paletteBar.show();

					});
				}
			}

			if(featureData.imageLayerVisible == false){
				if(currentLargeImageLayer != null){
					var layer = currentLargeImageLayer.layers.origin.layer;
					if(layer != null){
						map.removeLayer(layer);
					}
					currentLargeImageLayer = null;
				}
			}


		}else{
			if(featureData.vectorLayerVisible == true){
				var vectorUrl = "";
				if(featureData.liveVisible){
					var index = getDivIndex();
					if(Tm >= 6 && Tm < 18){
						if(index <= liveTm){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}else if(Tm >= 18){
						if(index <= liveTm){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}else if(Tm < 6){
						var tmpTm = liveTm;
						if(liveTm == 23){
							tmpTm = -1;
						}

						if(index <= tmpTm+24){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}
				}else{
					vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
				}
				//var vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
				var options = {layerType:"VectorTile",styleKey:featureData.style,url:[vectorUrl,""]};
				currentVectorTileLayer.options = options;
				currentVectorTileLayer.setUrl(vectorUrl);
				currentVectorTileLayer.on('layerAdded', function (layer) {
					var drawStyle = layer.drawStyle;
					if (drawStyle && drawStyle.paletteEntries) {
						shell.application.paletteBar.update(drawStyle.paletteEntries);
					}
					shell.application.paletteBar.show();

				});
			}

			if(featureData.imageLayerVisible == false){
				if(currentLargeImageLayer != null){
					var layer = currentLargeImageLayer.layers.origin.layer;
					if(layer != null){
						map.removeLayer(layer);
					}
					currentLargeImageLayer = null;
				}
			}

		}

	}

	// 显示图层数据
	function getUrl1(startTime, currentTime, featureData){
		//var url = path +getfile($(".select span").html()) + getUrl(nuTm,startTime);
		var fileName = getFileName1(startTime, currentTime, featureData);
		var url =  path + featureData.relativepath + "/" + fileName + ".1.png";
		//console.log(url)
		fileUrl=url;
		if(currentLargeImageLayer == null){
			if(featureData.imageLayerVisible == true){
				var errorTileUrl="images/empty.png";
				var mapOptions = {title: "", opacity:0.5, fadeAnimation: false, bounds:featureData.bounds, assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
				var options = {url: url, styleKey: featureData.style, nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions};
				currentLargeImageLayer = new shell.MeteoLayer(options);
				if(currentLargeImageLayer){
					currentLargeImageLayer.addTo(map);
					currentLargeImageLayer.on('layerAdded', function (layer) {
						//console.log('layerAdded');
						var drawStyle = layer.drawStyle;
						if (drawStyle && drawStyle.paletteEntries) {
							shell.application.paletteBar.update(drawStyle.paletteEntries);
						}
						shell.application.paletteBar.show();

					});
				}
			}

			if(featureData.vectorLayerVisible == false){
				if(currentVectorTileLayer != null){
					var layer1 = currentVectorTileLayer.layers.origin.layer;
					if(layer1 != null){
						map.removeLayer(layer1);
					}
					var layer2 = currentVectorTileLayer.layers.stream.layer;
					if(layer2 != null){
						map.removeLayer(layer2);
					}
					if(map.hasLayer(currentVectorTileLayer)){
						map.removeLayer(currentVectorTileLayer);
					}
					currentVectorTileLayer = null;
				}
			}
		}else{
			if(featureData.imageLayerVisible == true){
				var errorTileUrl="images/empty.png";
				var mapOptions = {title: "", opacity:0.5, fadeAnimation: false, bounds:featureData.bounds, assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
				var options = {url: url, styleKey: featureData.style, nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions};
				currentLargeImageLayer.options = options;
				currentLargeImageLayer.setUrl(url);
				currentLargeImageLayer.on('layerUpdated', function (layer) {
					var drawStyle = layer.drawStyle;
					if (drawStyle && drawStyle.paletteEntries) {
						shell.application.paletteBar.update(drawStyle.paletteEntries);
					}
					shell.application.paletteBar.show();

				});
			}

			if(featureData.vectorLayerVisible == false){
				if(currentVectorTileLayer != null){
					var layer1 = currentVectorTileLayer.layers.origin.layer;
					if(layer1 != null){
						map.removeLayer(layer1);
					}
					var layer2 = currentVectorTileLayer.layers.stream.layer;
					if(layer2 != null){
						map.removeLayer(layer2);
					}
					if(map.hasLayer(currentVectorTileLayer)){
						map.removeLayer(currentVectorTileLayer);
					}
					currentVectorTileLayer = null;
				}
			}
		}


		if(currentVectorTileLayer == null){
			if(featureData.vectorLayerVisible == true){
				var vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
				var options = {layerType:"VectorTile",styleKey:featureData.style,url:[vectorUrl,""]};
				currentVectorTileLayer = new shell.MeteoLayer(options);
				if(currentVectorTileLayer){
					currentVectorTileLayer.addTo(map);
					currentVectorTileLayer.on('layerAdded', function (layer) {
						var drawStyle = layer.drawStyle;
						if (drawStyle && drawStyle.paletteEntries) {
							shell.application.paletteBar.update(drawStyle.paletteEntries);
						}
						shell.application.paletteBar.show();

					});
				}
			}

			if(featureData.imageLayerVisible == false){
				if(currentLargeImageLayer != null){
					var layer = currentLargeImageLayer.layers.origin.layer;
					if(layer != null){
						map.removeLayer(layer);
					}
					currentLargeImageLayer = null;
				}
			}

		}else{
			if(featureData.vectorLayerVisible == true){
				var vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
				var options = {layerType:"VectorTile",styleKey:featureData.style,url:[vectorUrl,""]};
				currentVectorTileLayer.options = options;
				currentVectorTileLayer.setUrl(vectorUrl);
				currentVectorTileLayer.on('layerAdded', function (layer) {
					var drawStyle = layer.drawStyle;
					if (drawStyle && drawStyle.paletteEntries) {
						shell.application.paletteBar.update(drawStyle.paletteEntries);
					}
					shell.application.paletteBar.show();

				});
			}

			if(featureData.imageLayerVisible == false){
				if(currentLargeImageLayer != null){
					var layer = currentLargeImageLayer.layers.origin.layer;
					if(layer != null){
						map.removeLayer(layer);
					}
					currentLargeImageLayer = null;
				}
			}

		}

	}


	//有实况的数据所走的URL
	// 显示图层数据
	function getFileName2(startTime, featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,index,b) {

		if(index<10){
			index="0"+index;
		}else{
			index=""+index;
		}
		var xxx="";
		var yyyyMMddHH="";
		if (Boolean(qel2) && !Boolean(qel3)) {
			if(-startLeft<shikLeft){
				if(Tm<6){
					if(-startLeft<=470){
						yyyyMMddHH = moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+index;
						var data = {"yyyyMMddHH": yyyyMMddHH};
						var fileName = npt.util.template(featureData.liveFileFormat, data);

					}else{
						yyyyMMddHH = startTime.format("yyyyMMdd")+index;
						var data = {"yyyyMMddHH": yyyyMMddHH};
						var fileName = npt.util.template(featureData.liveFileFormat, data);

					}
				}else{
					yyyyMMddHH = startTime.format("yyyyMMdd")+index;
					var data = {"yyyyMMddHH": yyyyMMddHH};
					var fileName = npt.util.template(featureData.liveFileFormat, data);
				}

				var url =  path + featureData.liveRelativePath + "/" + fileName+".1.png";
			}else if(-startLeft==firstForeLeft){
				if(Tm<6){
					if(liveTm==23){
						var fileName = moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20.004";
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";
					}else{
						var shixiao=(liveTm+4);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}
				}else if(Tm>=6&&Tm<18){

					if(liveTm<8){
						var shixiao=(liveTm+4);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}else{
						var shixiao=(liveTm+1-9);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}

				}else{
					if(liveTm<20){
						var shixiao=(liveTm+1-9);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"08."+xxx;

					}else{
						var shixiao=(liveTm+1-21);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"20."+xxx;

					}
					var url =  path + featureData.relativepath + "/" + fileName+".1.png";

				}
			}else if(-startLeft>firstForeLeft&&-startLeft<=b){
				if(Tm<6){
					var urlTime=startTime;
					if(liveTm==23){
						var shixiao=Math.floor((-startLeft-firstForeLeft)/20)+Math.floor((0+4))-1;
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";
					}else{
						var shixiao=Math.ceil((-startLeft-firstForeLeft)/20)+Math.floor((liveTm+4)/1);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}
				}else if(Tm>=6&&Tm<18){
					if(Tm==6||Tm==7){
						if(liveTm<8){
							if(Math.floor((-startLeft-firstForeLeft)/20)+liveTm+1<=8){
								var shixiao=Math.floor((-startLeft-firstForeLeft)/20)+liveTm+4;
								if(featureData.time[shixiao]<10){
									xxx="00"+featureData.time[shixiao]
								}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
									xxx="0"+featureData.time[shixiao]
								}else{
									xxx=featureData.time[shixiao];
								}
								var fileName =moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
								var url =  path + featureData.relativepath + "/" + fileName+".1.png";

							}else{

								var shixiao=Math.floor((-startLeft-firstForeLeft)/20)-(8-liveTm);
								if(featureData.time[shixiao]<10){
									xxx="00"+featureData.time[shixiao]
								}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
									xxx="0"+featureData.time[shixiao]
								}else{
									xxx=featureData.time[shixiao];
								}
								var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
								var url =  path + featureData.relativepath + "/" + fileName+".1.png";

							}
						}

					}else{
						var shixiao=Math.ceil((liveTm-8)/1)+Math.floor((-startLeft-firstForeLeft)/20);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}
				}else{
					if(Tm>=18&&Tm<20){
						if(Math.floor((-startLeft-firstForeLeft)/20)+(liveTm-8)<12){
							var shixiao=Math.floor((-startLeft-firstForeLeft)/20)+(liveTm-8);
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName+".1.png";

						}else{
							var shixiao=Math.floor((-startLeft-firstForeLeft)/20)-(-liveTm+20);
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName+".1.png";

						}
					}else{
						var shixiao=Math.ceil((liveTm-20)/1)+Math.floor((-startLeft-firstForeLeft)/20);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";
					}


				}
			}else if(-startLeft>b&&-startLeft<=endForeLeft-30){
				if(Tm<6){
					var urlTime=startTime;
					if(liveTm==23){
						var shixiao=Math.ceil((-startLeft-b)/60)+23;
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";
					}else{
						var shixiao=Math.ceil((-startLeft-b)/60)+23;
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}
				}else if(Tm>=6&&Tm<18){

					var shixiao=Math.ceil((-startLeft-b)/60)+23;
					if(featureData.time[shixiao]<10){
						xxx="00"+featureData.time[shixiao]
					}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
						xxx="0"+featureData.time[shixiao]
					}else{
						xxx=featureData.time[shixiao];
					}
					var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
					var url =  path + featureData.relativepath + "/" + fileName+".1.png";


				}else{
					var shixiao=Math.ceil((-startLeft-b)/60)+23;
					if(featureData.time[shixiao]<10){
						xxx="00"+featureData.time[shixiao]
					}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
						xxx="0"+featureData.time[shixiao]
					}else{
						xxx=featureData.time[shixiao];
					}
					var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
					var url =  path + featureData.relativepath + "/" + fileName+".1.png";
				}
			}
		} else if (Boolean(qel3)) {


		} else {
			if(-startLeft<shikLeft){
				if(Tm<6){
					if(-startLeft<=470){
						var fileName =moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+index+".001";

					}else{
						var fileName =startTime.format("yyyyMMdd")+index+".001"

					}
				}else{
					var fileName =startTime.format("yyyyMMdd")+index+".001"
				}


				var url =  path + featureData.liveRelativePath + "/" + fileName+".1.png";
			}else if(-startLeft==firstForeLeft){
				if(Tm<6){

					if(liveTm==23){
						var fileName = moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20.006";
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";
					}else{
						var shixiao=Math.floor((liveTm+4)/3);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}
				}else if(Tm>=6&&Tm<18){
					if(Tm==6||Tm==7){
						var urlTime=startTime;
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20.012";
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}else if(Tm==8&&liveTm==7){
						var urlTime=startTime;
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20.012";
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}else{

						var shixiao=Math.floor((liveTm+1-9)/3);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}
				}else{
					if(Tm==18||Tm==19){
						var fileName =startTime.format("yyyyMMdd")+"08.012";
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";
					}else{
						if(liveTm==19){
							var fileName =startTime.format("yyyyMMdd")+"08.012";
							var url =  path + featureData.relativepath + "/" + fileName+".1.png";
						}else{
							var shixiao=Math.floor((liveTm+1-21)/3);
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName+".1.png";
						}


					}

				}
			}else if(-startLeft>firstForeLeft&&-startLeft<=endForeLeft){
				if(Tm<6){
					var urlTime=startTime;
					if(liveTm==23){
						var shixiao=Math.floor((-startLeft-firstForeLeft)/60)+Math.floor((0+4)/3);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";
					}else{
						var shixiao=Math.ceil((-startLeft-firstForeLeft)/60)+Math.floor((liveTm+4)/3);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}
				}else if(Tm>=6&&Tm<18){
					if(Tm==6||Tm==7){
						if(liveTm==5){
							var shixiao=Math.floor((-startLeft-firstForeLeft)/60)-1;
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName+".1.png";

						}else{
							var shixiao=Math.floor((-startLeft-firstForeLeft)/60);
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName+".1.png";

						}

					}else{
						var shixiao=Math.ceil((liveTm-8)/3)+Math.floor((-startLeft-firstForeLeft)/60);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";

					}
				}else{
					if(Tm==18||Tm==19){
						if(liveTm==17){
							var shixiao=Math.floor((-startLeft-firstForeLeft)/60)-1;
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName+".1.png";

						}else{
							var shixiao=Math.floor((-startLeft-firstForeLeft)/60);
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName+".1.png";

						}
					}else{
						var shixiao=Math.ceil((liveTm-20)/3)+Math.floor((-startLeft-firstForeLeft)/60);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName+".1.png";
					}


				}
			}
		}

		//var fileName = getFileName1(startTime, currentTime, featureData);
		//var url =  path + featureData.relativepath + "/" + fileName + ".1.png";
		return url;
	}


	//有实况的数据所走的URL
	// 显示图层数据
	function getUrl2(startTime, featureData,startLeft,shikLeft,firstForeLeft,endForeLeft,index,b) {

		if(parseInt(index)<10){
			index="0"+parseInt(index);
		}else{
			index=""+parseInt(index);
		}
		var xxx="";
		var yyyyMMddHH="";
		if (Boolean(qel2) && !Boolean(qel3)) {
			if(-startLeft<shikLeft){
				if(Tm<6){
					if(-startLeft<=470){
						yyyyMMddHH = moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+index;
						var data = {"yyyyMMddHH": yyyyMMddHH};
						var fileName = npt.util.template(featureData.liveFileFormat, data);

					}else{
						yyyyMMddHH = startTime.format("yyyyMMdd")+index;
						var data = {"yyyyMMddHH": yyyyMMddHH};
						var fileName = npt.util.template(featureData.liveFileFormat, data);

					}
				}else{
					yyyyMMddHH = startTime.format("yyyyMMdd")+index;
					var data = {"yyyyMMddHH": yyyyMMddHH};
					var fileName = npt.util.template(featureData.liveFileFormat, data);
				}

				var url =  path + featureData.liveRelativePath + "/" + fileName;
			}else if(-startLeft==firstForeLeft){
				if(Tm<6){
					if(liveTm==23){
						var fileName = moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20.004";
						var url =  path + featureData.relativepath + "/" + fileName;
					}else{
						var shixiao=(liveTm+4);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;

					}
				}else if(Tm>=6&&Tm<18){

					if(liveTm<8){
						var shixiao=(liveTm+4);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;

					}else{
						var shixiao=(liveTm+1-9);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;

					}

				}else{
					if(liveTm<20){
						var shixiao=(liveTm+1-9);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"08."+xxx;

					}else{
						var shixiao=(liveTm+1-21);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"20."+xxx;

					}
					var url =  path + featureData.relativepath + "/" + fileName;

				}
			}else if(-startLeft>firstForeLeft&&-startLeft<=b){
				if(Tm<6){
					var urlTime=startTime;
					if(liveTm==23){
						var shixiao=Math.floor((-startLeft-firstForeLeft)/20)+Math.floor((0+4))-1;
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;
					}else{
						var shixiao=Math.ceil((-startLeft-firstForeLeft)/20)+Math.floor((liveTm+4)/1);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;

					}
				}else if(Tm>=6&&Tm<18){
					if(Tm==6||Tm==7){
						if(liveTm<8){
							if(Math.floor((-startLeft-firstForeLeft)/20)+liveTm+1<=8){
								var shixiao=Math.floor((-startLeft-firstForeLeft)/20)+liveTm+4;
								if(featureData.time[shixiao]<10){
									xxx="00"+featureData.time[shixiao]
								}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
									xxx="0"+featureData.time[shixiao]
								}else{
									xxx=featureData.time[shixiao];
								}
								var fileName =moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
								var url =  path + featureData.relativepath + "/" + fileName;

							}else{

								var shixiao=Math.floor((-startLeft-firstForeLeft)/20)-(8-liveTm);
								if(featureData.time[shixiao]<10){
									xxx="00"+featureData.time[shixiao]
								}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
									xxx="0"+featureData.time[shixiao]
								}else{
									xxx=featureData.time[shixiao];
								}
								var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
								var url =  path + featureData.relativepath + "/" + fileName;

							}
						}

					}else{
						var shixiao=Math.ceil((liveTm-8)/1)+Math.floor((-startLeft-firstForeLeft)/20);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;

					}
				}else{
					if(Tm>=18&&Tm<20){
						if(Math.floor((-startLeft-firstForeLeft)/20)+(liveTm-8)<12){
							var shixiao=Math.floor((-startLeft-firstForeLeft)/20)+(liveTm-8);
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName;

						}else{
							var shixiao=Math.floor((-startLeft-firstForeLeft)/20)-(-liveTm+20);
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName;

						}
					}else{
						var shixiao=Math.ceil((liveTm-20)/1)+Math.floor((-startLeft-firstForeLeft)/20);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;
					}


				}
			}else if(-startLeft>b&&-startLeft<=endForeLeft-30){
				if(Tm<6){
					var urlTime=startTime;
					if(liveTm==23){
						var shixiao=Math.ceil((-startLeft-b)/60)+23;
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;
					}else{
						var shixiao=Math.ceil((-startLeft-b)/60)+23;
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;

					}
				}else if(Tm>=6&&Tm<18){

					var shixiao=Math.ceil((-startLeft-b)/60)+23;
					if(featureData.time[shixiao]<10){
						xxx="00"+featureData.time[shixiao]
					}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
						xxx="0"+featureData.time[shixiao]
					}else{
						xxx=featureData.time[shixiao];
					}
					var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
					var url =  path + featureData.relativepath + "/" + fileName;


				}else{
					var shixiao=Math.ceil((-startLeft-b)/60)+23;
					if(featureData.time[shixiao]<10){
						xxx="00"+featureData.time[shixiao]
					}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
						xxx="0"+featureData.time[shixiao]
					}else{
						xxx=featureData.time[shixiao];
					}
					var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
					var url =  path + featureData.relativepath + "/" + fileName;
				}
			}
		} else if (Boolean(qel3)) {


		} else {
			if(-startLeft<shikLeft){
				if(Tm<6){
					if(-startLeft<=470){
						yyyyMMddHH = moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+index;
						var data = {"yyyyMMddHH": yyyyMMddHH};
						var fileName = npt.util.template(featureData.liveFileFormat, data);

					}else{
						yyyyMMddHH = startTime.format("yyyyMMdd")+index;
						var data = {"yyyyMMddHH": yyyyMMddHH};
						var fileName = npt.util.template(featureData.liveFileFormat, data);

					}
				}else{
					yyyyMMddHH = startTime.format("yyyyMMdd")+index;
					var data = {"yyyyMMddHH": yyyyMMddHH};
					var fileName = npt.util.template(featureData.liveFileFormat, data);
				}
				var url =  path + featureData.liveRelativePath + "/" + fileName;
			}else if(-startLeft==firstForeLeft){
				if(Tm<6){

					if(liveTm==23){
						var fileName = moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20.006";
						var url =  path + featureData.relativepath + "/" + fileName;
					}else{
						var shixiao=Math.floor((liveTm+4)/3);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(startTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;

					}
				}else if(Tm>=6&&Tm<18){
					if(Tm==6||Tm==7){
						var urlTime=startTime;
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20.012";
						var url =  path + featureData.relativepath + "/" + fileName;

					}else if(Tm==8&&liveTm==7){
						var urlTime=startTime;
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20.012";
						var url =  path + featureData.relativepath + "/" + fileName;

					}else{

						var shixiao=Math.floor((liveTm+1-9)/3);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;

					}
				}else{
					if(Tm==18||Tm==19){
						var fileName =startTime.format("yyyyMMdd")+"08.012";
						var url =  path + featureData.relativepath + "/" + fileName;
					}else{
						if(liveTm==19){
							var fileName =startTime.format("yyyyMMdd")+"08.012";
							var url =  path + featureData.relativepath + "/" + fileName;
						}else{
							var shixiao=Math.floor((liveTm+1-21)/3);
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName;
						}


					}

				}
			}else if(-startLeft>firstForeLeft&&-startLeft<=endForeLeft){
				if(Tm<6){
					var urlTime=startTime;
					if(liveTm==23){
						var shixiao=Math.floor((-startLeft-firstForeLeft)/60)+Math.floor((0+4)/3);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;
					}else{
						var shixiao=Math.ceil((-startLeft-firstForeLeft)/60)+Math.floor((liveTm+4)/3);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =moment(urlTime).subtract(1,"day").toDate().format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;

					}
				}else if(Tm>=6&&Tm<18){
					if(Tm==6||Tm==7){
						if(liveTm==5){
							var shixiao=Math.floor((-startLeft-firstForeLeft)/60)-1;
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName;

						}else{
							var shixiao=Math.floor((-startLeft-firstForeLeft)/60);
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName;

						}

					}else{
						var shixiao=Math.ceil((liveTm-8)/3)+Math.floor((-startLeft-firstForeLeft)/60);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"08."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;

					}
				}else{
					if(Tm==18||Tm==19){
						if(liveTm==17){
							var shixiao=Math.floor((-startLeft-firstForeLeft)/60)-1;
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName;

						}else{
							var shixiao=Math.floor((-startLeft-firstForeLeft)/60);
							if(featureData.time[shixiao]<10){
								xxx="00"+featureData.time[shixiao]
							}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
								xxx="0"+featureData.time[shixiao]
							}else{
								xxx=featureData.time[shixiao];
							}
							var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
							var url =  path + featureData.relativepath + "/" + fileName;

						}
					}else{
						var shixiao=Math.ceil((liveTm-20)/3)+Math.floor((-startLeft-firstForeLeft)/60);
						if(featureData.time[shixiao]<10){
							xxx="00"+featureData.time[shixiao]
						}else if(featureData.time[shixiao]<100&&featureData.time[shixiao]>=10){
							xxx="0"+featureData.time[shixiao]
						}else{
							xxx=featureData.time[shixiao];
						}
						var fileName =startTime.format("yyyyMMdd")+"20."+xxx;
						var url =  path + featureData.relativepath + "/" + fileName;
					}


				}
			}
		}
		url+=".1.png";
		//console.log(url)
		fileUrl=url;
		var bounds = featureData.bounds;
		if(featureData.liveVisible){

			if(Tm >= 6 && Tm < 18){
				if(-startLeft<shikLeft){
					if(featureData.liveBounds){
						bounds = featureData.liveBounds;
					}
				}
			}else if(Tm >= 18){
				if(-startLeft<shikLeft){
					if(featureData.liveBounds){
						bounds = featureData.liveBounds;
					}
				}
			}else if(Tm < 6){
				if(-startLeft<shikLeft){
					if(featureData.liveBounds){
						bounds = featureData.liveBounds;
					}
				}
			}

		}

		if(currentLargeImageLayer == null){
			if(featureData.imageLayerVisible == true){
				var errorTileUrl="images/empty.png";
				var mapOptions = {title: "", opacity:0.5, fadeAnimation: false, bounds:bounds, assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
				var options = {url: url, styleKey: featureData.style, nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions};
				currentLargeImageLayer = new shell.MeteoLayer(options);
				if(currentLargeImageLayer){
					currentLargeImageLayer.addTo(map);
					currentLargeImageLayer.on('layerAdded', function (layer) {
						//console.log('layerAdded');
						var drawStyle = layer.drawStyle;
						if (drawStyle && drawStyle.paletteEntries) {
							shell.application.paletteBar.update(drawStyle.paletteEntries);
						}
						shell.application.paletteBar.show();

					});
				}
			}

			if(featureData.vectorLayerVisible == false){
				if(currentVectorTileLayer != null){
					var layer1 = currentVectorTileLayer.layers.origin.layer;
					if(layer1 != null){
						map.removeLayer(layer1);
					}
					var layer2 = currentVectorTileLayer.layers.stream.layer;
					if(layer2 != null){
						map.removeLayer(layer2);
					}
					if(map.hasLayer(currentVectorTileLayer)){
						map.removeLayer(currentVectorTileLayer);
					}
					currentVectorTileLayer = null;
				}
			}
		}else{
			if(featureData.imageLayerVisible == true){
				var errorTileUrl="images/empty.png";
				var mapOptions = {title: "", opacity:0.5, fadeAnimation: false, bounds:bounds, assignZoom:[1,1,2,3,4,5,6,6,6,6,6,6,6,6], errorTileUrl:errorTileUrl};
				var options = {url: url, styleKey: featureData.style, nodeInfo: {}, layerType: "LargeImage", interactive: false, inLayerManager: true, mapOptions: mapOptions};
				currentLargeImageLayer.options = options;
				currentLargeImageLayer.setUrl(url);
				currentLargeImageLayer.on('layerUpdated', function (layer) {
					var drawStyle = layer.drawStyle;
					if (drawStyle && drawStyle.paletteEntries) {
						shell.application.paletteBar.update(drawStyle.paletteEntries);
					}
					shell.application.paletteBar.show();

				});
			}

			if(featureData.vectorLayerVisible == false){
				if(currentVectorTileLayer != null){
					var layer1 = currentVectorTileLayer.layers.origin.layer;
					if(layer1 != null){
						map.removeLayer(layer1);
					}
					var layer2 = currentVectorTileLayer.layers.stream.layer;
					if(layer2 != null){
						map.removeLayer(layer2);
					}
					if(map.hasLayer(currentVectorTileLayer)){
						map.removeLayer(currentVectorTileLayer);
					}
					currentVectorTileLayer = null;
				}
			}
		}


		if(currentVectorTileLayer == null){
			if(featureData.vectorLayerVisible == true){
				var vectorUrl = "";
				if(featureData.liveVisible){
					if(Tm >= 6 && Tm < 18){
						if(-startLeft<shikLeft){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}else if(Tm >= 18){
						if(-startLeft<shikLeft){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}else if(Tm < 6){
						var tmpTm = liveTm;
						if(liveTm == 23){
							tmpTm = -1;
						}

						if(-startLeft<shikLeft){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}

				}else{
					vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
				}

				var options = {layerType:"VectorTile",styleKey:featureData.style,url:[vectorUrl,""]};
				currentVectorTileLayer = new shell.MeteoLayer(options);
				if(currentVectorTileLayer){
					currentVectorTileLayer.addTo(map);
					currentVectorTileLayer.on('layerAdded', function (layer) {
						var drawStyle = layer.drawStyle;
						if (drawStyle && drawStyle.paletteEntries) {
							shell.application.paletteBar.update(drawStyle.paletteEntries);
						}
						shell.application.paletteBar.show();

					});
				}
			}

			if(featureData.imageLayerVisible == false){
				if(currentLargeImageLayer != null){
					var layer = currentLargeImageLayer.layers.origin.layer;
					if(layer != null){
						map.removeLayer(layer);
					}
					currentLargeImageLayer = null;
				}
			}


		}else{
			if(featureData.vectorLayerVisible == true){
				var vectorUrl = "";
				if(featureData.liveVisible){
					if(Tm >= 6 && Tm < 18){
						if(-startLeft<shikLeft){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}else if(Tm >= 18){
						if(-startLeft<shikLeft){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}else if(Tm < 6){
						if(-startLeft<shikLeft){
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.liveRelativePath+"&format="+featureData.liveFileFormat+"&viewBounds=";
						}else{
							vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
						}
					}
				}else{
					vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
				}
				//var vectorUrl = handlerPath + "/MeteoHandler?method=getmeteodatablock&type=micaps&fileName="+fileName+"&relativePath="+featureData.relativepath+"&format="+featureData.fileFormat+"&viewBounds=";
				var options = {layerType:"VectorTile",styleKey:featureData.style,url:[vectorUrl,""]};
				currentVectorTileLayer.options = options;
				currentVectorTileLayer.setUrl(vectorUrl);
				currentVectorTileLayer.on('layerAdded', function (layer) {
					var drawStyle = layer.drawStyle;
					if (drawStyle && drawStyle.paletteEntries) {
						shell.application.paletteBar.update(drawStyle.paletteEntries);
					}
					shell.application.paletteBar.show();

				});
			}

			if(featureData.imageLayerVisible == false){
				if(currentLargeImageLayer != null){
					var layer = currentLargeImageLayer.layers.origin.layer;
					if(layer != null){
						map.removeLayer(layer);
					}
					currentLargeImageLayer = null;
				}
			}

		}

	}

	//提示错误信息
	map.on('message', function(layer) {
		//$.messager.alert("提示","没有数据","info");
		var message = "";
		var obj = $(".select span").html();
		var featureData = getCheckedFeatureData(obj);
		if(featureData.liveVisible){
			var index = getDivIndex();
			if(Tm >= 6 && Tm < 18){
				if(index <= liveTm){
					message+= startTime.format("yyyy-MM-dd") + " 没有此时刻实况数据!";
				}else{
					message+= startTime.format("yyyy-MM-dd") + " 08时没有此时刻发布数据!";
				}
			}else if(Tm >= 18){
				if(index <= liveTm){
					message+= startTime.format("yyyy-MM-dd") + " 没有此时刻实况数据!";
				}else{
					message+= startTime.format("yyyy-MM-dd") + " 20时没有此时刻发布数据!";
				}
			}else if(Tm < 6){
				var tmpTm = liveTm;
				if(liveTm == 23){
					tmpTm = -1;
				}

				if(index <= tmpTm+24){
					message+= moment(startTime).subtract(1,"day").toDate().format("yyyy-MM-dd") + " 没有此时刻实况数据!";
				}else{
					message+= moment(startTime).subtract(1,"day").toDate().format("yyyy-MM-dd") + " 20时没有此时刻发布数据!";
				}
			}
		}else{
			if(Tm >= 6 && Tm <18){
				message+= startTime.format("yyyy-MM-dd") + " 08时没有此时刻发布数据!";
			}else if(Tm >= 18){
				message+= startTime.format("yyyy-MM-dd") + " 20时没有此时刻发布数据!";
			}else if(Tm < 6){
				message+= moment(startTime).subtract(1,"day").toDate().format("yyyy-MM-dd") + " 20时没有此时刻发布数据!";
			}
		}

		$(".popup").fadeIn(1000);
		$(".popup_inner").text(message);
		//$(".popup_inner").text(layer.errorInfo);

		if(layer.diamondType == "LargeImage"){
			if(currentLargeImageLayer != null){
				var layer1 = currentLargeImageLayer.layers.origin.layer;
				if(layer1 != null){
					map.removeLayer(layer1);
				}
				if(map.hasLayer(currentLargeImageLayer)){
					map.removeLayer(currentLargeImageLayer);
				}
				currentLargeImageLayer = null;
			}

			if(layer.layers != undefined){
				var layer1 = layer.layers.origin.layer;
				if(layer1 != null){
					map.removeLayer(layer1);
				}
			}else{
				map.removeLayer(layer);
			}
			layer = null;
		}else{
			if(currentVectorTileLayer != null){
				var layer1 = currentVectorTileLayer.layers.origin.layer;
				if(layer1 != null){
					map.removeLayer(layer1);
				}
				var layer2 = currentVectorTileLayer.layers.stream.layer;
				if(layer2 != null){
					map.removeLayer(layer2);
				}
				if(map.hasLayer(currentVectorTileLayer)){
					map.removeLayer(currentVectorTileLayer);
				}
				currentVectorTileLayer = null;
			}

			if(layer.layers != undefined){
				var layer1 = layer.layers.origin.layer;
				if(layer1 != null){
					map.removeLayer(layer1);
				}
				var layer2 = layer.layers.stream.layer;
				if(layer2 != null){
					map.removeLayer(layer2);
				}
			}else{
				map.removeLayer(layer);
			}
			layer = null;
		}
		/*if(currentLargeImageLayer != null){
		 var layer = currentLargeImageLayer.layers.origin.layer;
		 if(layer != null){
		 map.removeLayer(layer);
		 }
		 currentLargeImageLayer = null;
		 }

		 if(currentVectorTileLayer != null){
		 var layer = currentVectorTileLayer.layers.origin.layer;
		 if(layer != null){
		 map.removeLayer(layer);
		 }
		 layer = currentVectorTileLayer.layers.stream.layer;
		 if(layer != null){
		 map.removeLayer(layer);
		 }
		 currentVectorTileLayer = null;
		 }

		 if(layer != null){
		 var l = layer.layers.origin.layer;
		 if(l != null){
		 map.removeLayer(l);
		 }
		 layer = null;
		 }*/

	});


	var pickValueMarker = null;
	var pickValueMarkerFlag = false;


	function pickValue(latlng){
		var obj = $(".select span").html();
		var featureData = getCheckedFeatureData(obj);

		var latlngBounds = L.latLngBounds(featureData.bounds);
		if(featureData.liveVisible){
			var index = getDivIndex();
			if(Tm >= 6 && Tm < 18){
				if(index <= liveTm){
					latlngBounds = L.latLngBounds(featureData.liveBounds);
				}
			}else if(Tm >= 18){
				if(index <= liveTm){
					latlngBounds = L.latLngBounds(featureData.liveBounds);
				}
			}else if(Tm < 6){
				var tmpTm = liveTm;
				if(liveTm == 23){
					tmpTm = -1;
				}

				if(index <= tmpTm+24){
					latlngBounds = L.latLngBounds(featureData.liveBounds);
				}
			}
		}
		//var layer = currentLargeImageLayer.layers.origin.layer;
		//var latlngBounds = layer.getBounds();
		if(latlngBounds.contains(latlng)){
			currentLatLng = latlng;

			var image = new Image();
			image.crossOrigin = '*';

			var unit = featureData.unit;
			var contourUrl = "";
			if(featureData.liveVisible){
				var index = getDivIndex();
				if(Tm >= 6 && Tm < 18){
					if(index <= liveTm){
						contourUrl = path + featureData.liveRelativePath + "/" + getFileName(nuTm, startTime, featureData) + ".1.png";
					}else{
						contourUrl = path + featureData.relativepath + "/" + getFileName(nuTm, startTime, featureData) + ".1.png";
					}
				}else if(Tm >= 18){
					if(index <= liveTm){
						contourUrl = path + featureData.liveRelativePath + "/" + getFileName(nuTm, startTime, featureData) + ".1.png";
					}else{
						contourUrl = path + featureData.relativepath + "/" + getFileName(nuTm, startTime, featureData) + ".1.png";
					}
				}else if(Tm < 6){
					var tmpTm = liveTm;
					if(liveTm == 23){
						tmpTm = -1;
					}

					if(index <= tmpTm+24){
						contourUrl = path + featureData.liveRelativePath + "/" + getFileName(nuTm, startTime, featureData) + ".1.png";
					}else{
						contourUrl = path + featureData.relativepath + "/" + getFileName(nuTm, startTime, featureData) + ".1.png";
					}
				}

			}else{
				contourUrl = path + featureData.relativepath + "/" + getFileName(nuTm, startTime, featureData) + ".1.png";
			}
			//contourUrl = path + featureData.relativepath + "/" + getFileName(nuTm, startTime, featureData) + ".1.png";

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

					var palettesUrl = 'palettes/'+featureData.palettes+'.xml?v=1.0.8';
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
							label = "";
						}else{
							label = value + " " + unit;
						}
						//var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker' style=\"width: 50px;height: auto;position: relative;\"><span style=\"position:absolute;left:-12px;top:-20px;display: inline-block;width: 100%;line-height: 20px;text-align:center; color:#000;font-family: 微软雅黑;font-weight: bold;\">"+label+"</span><span style=\"display:inline-block; width: 15px;height: 15px;border-radius: 50%;background:#000;border: 1px solid #E5C646;background:rgba(152,137,72,0.5);\"></span></div>"});
						var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker' style=\"width:auto;height:16px;position: relative;\"><span style=\"position:absolute;left:-20px;top:-20px;display: inline-block;width: 60px;line-height: 20px;text-align:center; color:#000;font-family: 微软雅黑;font-weight: bold;\">"+label+"</span><span style=\"display:inline-block; width: 15px;height: 15px;border-radius: 50%;background:#000;border: 2px solid red;background:rgba(13,14,13,0.5);\"></span></div>"});
						//var pickValueIcon = L.divIcon({html:"<span id='tipMarker' class='tipSpan'>"+label+"\</span>"});
						if(!pickValueMarkerFlag){
							pickValueMarker = L.marker(latlng, {icon: pickValueIcon}).addTo(map);
							pickValueMarkerFlag = true;
						}else{
							pickValueMarker.setIcon(pickValueIcon);
							pickValueMarker.setLatLng(latlng);
						}
						$("#pickValueMarker").show();
						$("#pickValueMarker").parent().css({width:"auto",height:"auto",border:"0px",background:"rgba(0,0,0,0)"});
						/*$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
						 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
						 $("#map").children().eq(0).children().eq(3).children().eq(0).width(0);
						 $("#map").children().eq(0).children().eq(3).children().eq(0).height(0);
						 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
						 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
						 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("width",'0px');
						 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("height",'0px');*/
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
									label = "";
								}else{
									label = value + " " + unit;
								}
								//var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker' style=\"width: 50px;height: auto;position: relative;\"><span style=\"position:absolute;left:-12px;top:-20px;display: inline-block;width: 100%;line-height: 20px;text-align:center; color:#000;font-family: 微软雅黑;font-weight: bold;\">"+label+"</span><span style=\"display:inline-block; width: 15px;height: 15px;border-radius: 50%;background:#000;border: 1px solid #E5C646;background:rgba(152,137,72,0.5);\"></span></div>"});
								var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker' style=\"width:auto;height:16px;position: absolute;\"><span style=\"position:absolute;left:-20px;top:-20px;display: inline-block;width: 60px;line-height: 20px;text-align:center; color:#000;font-family: 微软雅黑;font-weight: bold;\">"+label+"</span><span style=\"display:inline-block; width: 15px;height: 15px;border-radius: 50%;background:#000;border: 2px solid red;background:rgba(13,14,13,0.5);\"></span></div>"});
								if(!pickValueMarkerFlag){
									pickValueMarker = L.marker(latlng, {icon: pickValueIcon}).addTo(map);
									pickValueMarkerFlag = true;
								}else{
									pickValueMarker.setIcon(pickValueIcon);
									pickValueMarker.setLatLng(latlng);
								}
								$("#pickValueMarker").show();
								$("#pickValueMarker").parent().css({width:"auto",height:"auto",border:"0px",background:"rgba(0,0,0,0)"});
								/*$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
								 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
								 $("#map").children().eq(0).children().eq(3).children().eq(0).width(0);
								 $("#map").children().eq(0).children().eq(3).children().eq(0).height(0);
								 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
								 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
								 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("width",'0px');
								 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("height",'0px');*/
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

	}

	function pickValue1(latlng){
		var obj = $(".select span").html();
		var featureData = getCheckedFeatureData(obj);

		var latlngBounds = L.latLngBounds(featureData.bounds);

		//全部实况的结束时的left
		var shikLeft;
		var startLeft=parseInt($("#parst").css("left"));
		if(featureData.liveVisible){

			if(Tm >= 6 && Tm < 18){
				shikLeft=(liveTm+1)*20;
				if(-startLeft<shikLeft){
					if(featureData.liveBounds){
						latlngBounds = L.latLngBounds(featureData.liveBounds);
					}
				}
			}else if(Tm >= 18){
				shikLeft=(liveTm+1)*20;
				if(-startLeft<shikLeft){
					if(featureData.liveBounds){
						latlngBounds = L.latLngBounds(featureData.liveBounds);
					}
				}
			}else if(Tm < 6){
				var tmpTm=liveTm;
				if(liveTm == 23){
					tmpTm=-1
				}
				shikLeft=(24+tmpTm+1)*20;
				if(-startLeft<shikLeft){
					if(featureData.liveBounds){
						latlngBounds = L.latLngBounds(featureData.liveBounds);
					}
				}
			}

		}

		if(latlngBounds.contains(latlng)){
			currentLatLng = latlng;

			var image = new Image();
			image.crossOrigin = '*';

			var unit = featureData.unit;
			var contourUrl = "";
			//fileurl 当前现实的图片路径
			contourUrl=fileUrl;
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

					var palettesUrl = 'palettes/'+featureData.palettes+'.xml?v=1.0.8';
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
							label = "";
						}else{
							label = value + " " + unit;
						}
						//var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker' style=\"width: 50px;height: auto;position: relative;\"><span style=\"position:absolute;left:-12px;top:-20px;display: inline-block;width: 100%;line-height: 20px;text-align:center; color:#000;font-family: 微软雅黑;font-weight: bold;\">"+label+"</span><span style=\"display:inline-block; width: 15px;height: 15px;border-radius: 50%;background:#000;border: 1px solid #E5C646;background:rgba(152,137,72,0.5);\"></span></div>"});
						var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker' style=\"width:auto;height:16px;position: relative;\"><span style=\"position:absolute;left:-20px;top:-20px;display: inline-block;width: 60px;line-height: 20px;text-align:center; color:#000;font-family: 微软雅黑;font-weight: bold;\">"+label+"</span><span style=\"display:inline-block; width: 15px;height: 15px;border-radius: 50%;background:#000;border: 2px solid red;background:rgba(13,14,13,0.5);\"></span></div>"});
						if(!pickValueMarkerFlag){
							pickValueMarker = L.marker(latlng, {icon: pickValueIcon}).addTo(map);
							pickValueMarkerFlag = true;
						}else{
							pickValueMarker.setIcon(pickValueIcon);
							pickValueMarker.setLatLng(latlng);
						}
						$("#pickValueMarker").show();
						$("#pickValueMarker").parent().css({width:"auto",height:"auto",border:"0px",background:"rgba(0,0,0,0)"});
						/*$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
						 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
						 $("#map").children().eq(0).children().eq(3).children().eq(0).width(0);
						 $("#map").children().eq(0).children().eq(3).children().eq(0).height(0);
						 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
						 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
						 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("width",'0px');
						 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("height",'0px');*/
					}else{
						var req = new XMLHttpRequest();
						req.open('GET', palettesUrl);
						req.onload = function() {
							if (req.status == 200) {
								var data = req.responseText;
								newMap.set(featureData.palettes,data);
								var flag = false;
								var value = null;
								newMap.set(featureData.palettes,data);
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
									label = "";
								}else{
									label = value + " " + unit;
								}
								//var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker' style=\"width: 50px;height: auto;position: relative;\"><span style=\"position:absolute;left:-12px;top:-20px;display: inline-block;width: 100%;line-height: 20px;text-align:center; color:#000;font-family: 微软雅黑;font-weight: bold;\">"+label+"</span><span style=\"display:inline-block; width: 15px;height: 15px;border-radius: 50%;background:#000;border: 1px solid #E5C646;background:rgba(152,137,72,0.5);\"></span></div>"});
								var pickValueIcon = L.divIcon({html:"<div id='pickValueMarker' style=\"width:auto;height:16px;position: relative;\"><span style=\"position:absolute;left:-20px;top:-20px;display: inline-block;width: 60px;line-height: 20px;text-align:center; color:#000;font-family: 微软雅黑;font-weight: bold;\">"+label+"</span><span style=\"display:inline-block; width: 15px;height: 15px;border-radius: 50%;background:#000;border: 2px solid red;background:rgba(13,14,13,0.5);\"></span></div>"});
								if(!pickValueMarkerFlag){
									pickValueMarker = L.marker(latlng, {icon: pickValueIcon}).addTo(map);
									pickValueMarkerFlag = true;
								}else{
									pickValueMarker.setIcon(pickValueIcon);
									pickValueMarker.setLatLng(latlng);
								}
								$("#pickValueMarker").show();
								$("#pickValueMarker").parent().css({width:"auto",height:"auto",border:"0px",background:"rgba(0,0,0,0)"});
								/*$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
								 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
								 $("#map").children().eq(0).children().eq(3).children().eq(0).width(0);
								 $("#map").children().eq(0).children().eq(3).children().eq(0).height(0);
								 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
								 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
								 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("width",'0px');
								 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("height",'0px');*/
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

	}

	var tipMarker = null;
	var tipMarkerFlag = false;
	function mouseMoveValue(latlng){
		var obj = $(".select span").html();
		var featureData = getCheckedFeatureData(obj);

		var latlngBounds = L.latLngBounds(featureData.bounds);
		//全部实况的结束时的left
		var shikLeft;
		var startLeft=parseInt($("#parst").css("left"));
		if(featureData.liveVisible){

			if(Tm >= 6 && Tm < 18){
				shikLeft=(liveTm+1)*20;
				if(-startLeft<shikLeft){
					if(featureData.liveBounds){
						latlngBounds = L.latLngBounds(featureData.liveBounds);
					}
				}
			}else if(Tm >= 18){
				shikLeft=(liveTm+1)*20;
				if(-startLeft<shikLeft){
					if(featureData.liveBounds){
						latlngBounds = L.latLngBounds(featureData.liveBounds);
					}
				}
			}else if(Tm < 6){
				var tmpTm=liveTm;
				if(liveTm == 23){
					tmpTm=-1
				}
				shikLeft=(24+tmpTm+1)*20;
				if(-startLeft<shikLeft){
					if(featureData.liveBounds){
						latlngBounds = L.latLngBounds(featureData.liveBounds);
					}
				}
			}

		}

		if(latlngBounds.contains(latlng)){
			var image = new Image();
			image.crossOrigin = '*';

			var unit = featureData.unit;

			image.src = fileUrl;
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

					var palettesUrl = 'palettes/'+featureData.palettes+'.xml?v=1.0.8';
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
								return false;
							}
						});

						if(!flag){
							value = null;
							//console.log('px 匹配无效值：( 9999 )');
						}

						var label = "";
						if(value == null){
							label = value;
							var tipIcon = L.divIcon({html:"<span id='tipMarker' style=\"background:url(images/locations.png) center no-repeat;position:absolute;width: 64px;height:29px;padding-top:5px;color: #FFFFFF;font-size: 14px;text-align: center;\">"+label+"\</span>"});
							if(!tipMarkerFlag ){
								tipMarker = L.marker(latlng, {icon: tipIcon}).addTo(map);
								tipMarkerFlag = true;
							}else{
								tipMarker.setIcon(tipIcon);
								tipMarker.setLatLng(latlng);
							}
							$("#tipMarker").parent().css({width:"auto",height:"auto",border:"0px",background:"rgba(0,0,0,0)"});

							$("#tipMarker").hide();
						}else{
							label = value + " " + unit;

							var mobile = isMobile();
							if(!mobile){
								var tipIcon = L.divIcon({html:"<span id='tipMarker' style=\"background:url(images/locations.png) center no-repeat;position:absolute;width: 64px;height:29px;padding-top:5px;color: #FFFFFF;font-size: 14px;text-align: center;\">"+label+"\</span>"});
								if(!tipMarkerFlag ){
									tipMarker = L.marker(latlng, {icon: tipIcon}).addTo(map);
									tipMarkerFlag = true;
								}else{
									tipMarker.setIcon(tipIcon);
									tipMarker.setLatLng(latlng);
								}
								$("#tipMarker").show();
								$("#tipMarker").parent().css({width:"auto",height:"auto",border:"0px",background:"rgba(0,0,0,0)"});
							}
						}

						/*$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
						 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
						 $("#map").children().eq(0).children().eq(3).children().eq(0).width(0);
						 $("#map").children().eq(0).children().eq(3).children().eq(0).height(0);*/
						if(flagCan){
							$(".leaflet-pane .leaflet-marker-pane").children().eq(1).css("left",'-32px');
							$(".leaflet-pane .leaflet-marker-pane").children().eq(1).css("top",'-29px');
							$(".leaflet-pane .leaflet-marker-pane").children().eq(1).css("width",'0px');
							$(".leaflet-pane .leaflet-marker-pane").children().eq(1).css("height",'0px');
						}else{
							$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
							$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
							$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("width",'0px');
							$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("height",'0px');
						}


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
										return false;
									}
								});

								if(!flag){
									value = null;
									//console.log('px 匹配无效值：( 9999 )');
								}

								var label = "";
								if(value == null){
									label = value;
									var tipIcon = L.divIcon({html:"<span id='tipMarker' style=\"background:url(images/locations.png) center no-repeat;position:absolute;width: 64px;height:29px;padding-top:5px;color: #FFFFFF;font-size: 14px;text-align: center;\">"+label+"\</span>"});
									if(!tipMarkerFlag ){
										tipMarker = L.marker(latlng, {icon: tipIcon}).addTo(map);
										tipMarkerFlag = true;
									}else{
										tipMarker.setIcon(tipIcon);
										tipMarker.setLatLng(latlng);
									}
									$("#tipMarker").parent().css({width:"auto",height:"auto",border:"0px",background:"rgba(0,0,0,0)"});

									$("#tipMarker").hide();
								}else{
									label = value + " " + unit;

									var mobile = isMobile();
									if(!mobile){
										var tipIcon = L.divIcon({html:"<span id='tipMarker' style=\"background:url(images/locations.png) center no-repeat;position:absolute;width: 64px;height:29px;padding-top:5px;color: #FFFFFF;font-size: 14px;text-align: center;\">"+label+"\</span>"});
										if(!tipMarkerFlag ){
											tipMarker = L.marker(latlng, {icon: tipIcon}).addTo(map);
											tipMarkerFlag = true;
										}else{
											tipMarker.setIcon(tipIcon);
											tipMarker.setLatLng(latlng);
										}
										$("#tipMarker").show();
										$("#tipMarker").parent().css({width:"auto",height:"auto",border:"0px",background:"rgba(0,0,0,0)"});
									}
								}

								/*$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
								 $(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
								 $("#map").children().eq(0).children().eq(3).children().eq(0).width(0);
								 $("#map").children().eq(0).children().eq(3).children().eq(0).height(0);*/
								if(flagCan){
									$(".leaflet-pane .leaflet-marker-pane").children().eq(1).css("left",'-32px');
									$(".leaflet-pane .leaflet-marker-pane").children().eq(1).css("top",'-29px');
									$(".leaflet-pane .leaflet-marker-pane").children().eq(1).css("width",'0px');
									$(".leaflet-pane .leaflet-marker-pane").children().eq(1).css("height",'0px');
								}else{
									$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("left",'-32px');
									$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("top",'-29px');
									$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("width",'0px');
									$(".leaflet-pane .leaflet-marker-pane").children().eq(0).css("height",'0px');
								}
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

	}

	// 随着子要素的改变时间轴发生变化
	function changeDiv(obj){
		//console.log(nwfdData);
		for(var i=0;i<nwfdData.length;i++){

			if(obj==nwfdData[i].name){

				if(nwfdData[i].children.length==1){
					changeTime(nwfdData[i].children[0].time);
				}else {
					for(var j=0;j<nwfdData[i].children.length;j++){

						if($(".select").siblings().find("input[name=radioButton]:checked").siblings().html()==null){
							return changeTime(nwfdData[i].children[0].time,nwfdData[i].children[0].liveVisible);

						}else if($(".select").siblings().find("input[name=radioButton]:checked").siblings().html()==nwfdData[i].children[j].name){
							return changeTime(nwfdData[i].children[j].time,nwfdData[i].children[j].liveVisible);

						}
					}

				}
			}
		}
	}


	function ifTime(obj){
		//console.log(nwfdData);
		for(var i=0;i<nwfdData.length;i++){

			if(obj==nwfdData[i].name){

				if(nwfdData[i].children.length==1){
					return nwfdData[i].children[0].liveVisible;
				}else {
					for(var j=0;j<nwfdData[i].children.length;j++){

						if($(".select").siblings().find("input[name=radioButton]:checked").siblings().html()==null){
							return nwfdData[i].children[0].liveVisible;

						}else if($(".select").siblings().find("input[name=radioButton]:checked").siblings().html()==nwfdData[i].children[j].name){
							return nwfdData[i].children[j].liveVisible;

						}
					}

				}
			}
		}
	}

	function To(ifLayer){
		return ifLayer
	}


	// 获取子要素的时间time
	function changeTime(obj,pok){
		//console.log(obj)
		//console.log(pok)
		var tiList;
		tiList = obj;
		lengths = obj.length-1;
		//根据最后一项计算共计多少天
		dayes = obj[lengths]/24+1;
		var st = [];
		var lenSt = [];
		var stChe =[];
		for(i=0;i<lengths-1;i++){
			if(obj[i+1]-obj[i] != obj[i+2]-obj[i+1]){

				var cheTs = obj[i+1]-obj[i];
				st.push(obj[i+1]);
				lenSt.push(i+1);
				stChe.push(cheTs);
			}

		}
		if(st.length != 2 ){
			//获取数组
			timeSam = obj;
			sum = timeSam[1]-timeSam[0];//获取数组中的时间间隔
			vum = timeSam[lengths] - timeSam[lengths-1];
			var aLy=[timeSam[0]];

			for(i=0;i<lengths;i++){
				if(timeSam[i+1]-timeSam[i] == sum){
					aLy.push(timeSam[i+1])
				}
			}
			qel1 = aLy[aLy.length-1]/24;
			qel2 = dayes - 1 -qel1;
			qel3 = null;

			hel1 = sum;
			hel2 = vum;
			hel3 = null;

		}else{
			timeSam = obj;
			stChe.push(obj[lengths]-obj[lengths-1])
			qel1 = Number(st[0])/24;
			qel2 = Number(st[1])/24;
			qel3 = Number(obj[lengths])/24-qel1-qel2;
			hel1 = stChe[0];
			hel2 = stChe[1];
			hel3 = stChe[2];
		}

	}

	// 搜索框的效果实现
	$("#search").blur(function(){
		$("#search").parent().width(260).css("transition",".25s all 1s" );
		if($(this).val()!=""){
			$(this).parent().css("box-shadow","2px 2px 5px #92674E,-2px -2px 5px #92674E")
		}
	});
	var flag=false;
	var val;
	var Data=[];
	var coorData=[];
	var oldData=[];//记录历史记录的值
	var newData=[];//记录与输入字符串向匹配的数据
	//var opacity=["1","1","1","0.95","0.9","0.8","0.7","0.6","0.4","0.2"];
	var data=[];
	var coor=[];
	for(var i=0;i<addressData.length;i++){
		Data.push(addressData[i].split(",")[0]);
		coorData.push(addressData[i].split(",")[1]+","+addressData[i].split(",")[2]);
	}
	$("#search").focus(function(){
		$("#search").parent().width(360).css("transition",".25s all 0.5s");
		$(this).val("");
		//判断是否属于第一次获得焦点 是则清除value  否的话显示值与匹配的值

	});

	//输入值与数据的匹配
	$("#search"). bind('input propertychange',function(){
		//var val=c(obj).value;
		val=$(this).val();
		if(val.indexOf(",")==-1&&val.indexOf("，")==-1) {
			newData = data = [];
			coor = [];
			$(".newText").css("display", "block")

			for (var i = 0; i < Data.length; i++) {
				if (val == "") {
					newData = data = [];
					data = oldData;//浅赋值
				} else {
					if (Data[i].indexOf(val) == 0) {//判断输入字符串是否与数据的首字符匹配
						newData.push(Data[i]);
						coor.push(coorData[i]);
						data = newData;
					}
				}
			}

			//console.log(data);
			//初始化级联下拉列表
			var html = "";
			if (data.length >= 10) {
				data.length = 10;
			}
			for (var i = 0; i < data.length; i++) {

				if (data == oldData) {
					html += "<span style=\"data-value=" + data[i] + "\">" + data[i] + "</span>"
				} else {
					html += "<span style=\"data-value=" + data[i] + "\">" + data[i] + "  " + "  " + coor[i] + "</span>"
				}

			}
			$(".newText").html(html);

		}

	});

	//点击搜索  显示时序图
	$(".searchDiv span").on("click",function(){
		if(!yxMapClick){
			$(".selectElementBox .close").trigger("click");
		}
		if(!mapClickFlag){
			$(".apiBox .close").trigger("click");
		}
		$("#search").trigger("input propertychange");
		//console.log(val)
		if(val.indexOf(",")==-1&&val.indexOf("，")==-1){
			$(".newText span").eq(0).trigger("click");
		}else{

			var str = val.toString().replace(/\s+/g, ' ');
			if(str.indexOf(" ") != -1){
				str=str.split(" ")[1];
			}

			var breakPoint=str.match(",")||str.match("，");
			var a = str.split(breakPoint)[0];
			var b = str.split(breakPoint)[1];
			if(a.length > 2 && b.length >= 2){
				var xPoint = parseFloat(a);
				var yPoint = parseFloat(b);
				if(!isNaN(xPoint) && !isNaN(yPoint)){
					var latlng = L.latLng(yPoint, xPoint);
					map.panTo(latlng);
					showEchart(latlng);
					pickValue(latlng);

					var htmlWidth =parseInt($("html").width());
					if(htmlWidth<=992){
						$("#hoverPic").animate({height:"310px"},1000);
					}
//  	 $(".chartBox").css({visibility:"visible"}).animate({width:"500px"},1000);
					myChart1.setOption(option);
				}
			}
		}
	})

//enter键输入选择城市
	$(".searchDiv").keydown(function(e){
		if(e.keyCode==13){
			if(!yxMapClick){
				$(".selectElementBox .close").trigger("click");
			}
			if(!mapClickFlag){
				$(".apiBox .close").trigger("click");
			}
			//console.log(val)
			$("#search").trigger("input propertychange");
			if(val.indexOf(",")==-1&&val.indexOf("，")==-1){
				$(".newText span").eq(0).trigger("click");
			}else{
				var str = val.toString().replace(/\s+/g, ' ');
				if(str.indexOf(" ") != -1){
					str=str.split(" ")[1];
				}
				var breakPoint=str.match(",")||str.match("，");
				var a = str.split(breakPoint)[0];
				var b = str.split(breakPoint)[1];
				if(a.length > 2 && b.length >= 2){
					var xPoint = parseFloat(a);
					var yPoint = parseFloat(b);
					if(!isNaN(xPoint) && !isNaN(yPoint)){
						var latlng = L.latLng(yPoint, xPoint);
						map.panTo(latlng);
						showEchart(latlng);
						pickValue(latlng);

						var htmlWidth =parseInt($("html").width());
						if(htmlWidth<=992){
							$("#hoverPic").animate({height:"310px"},1000);
						}
//  	 $(".chartBox").css({visibility:"visible"}).animate({width:"500px"},1000);
						myChart1.setOption(option);
					}
				}
			}
		}
		//$(".newText").css("display", "none");
	})

	//下拉列表点击
	$(".newText span").live("click", function () {
		if(!yxMapClick){
			$(".selectElementBox .close").trigger("click");
		}
		if(!mapClickFlag){
			$(".apiBox .close").trigger("click");
		}
		var label = $(this).html();
		$("#search").val(label);

		if (oldData.length > 0 && oldData.length < 10) {  // 判断历史记录是否超出最大长度，超出的话数组从头删除值
			// console.log($(this).html());
			var str = ""
			for (var i = 0; i < oldData.length; i++) {
				str += oldData[i];
			}
			if (str.indexOf($(this).html()) == -1) {
				oldData.push($(this).html());
			} else {
				oldData = oldData;
			}

		} else {
			oldData.shift();
			oldData.push($(this).html());
		}
		//console.log(oldData)
		$(this).parent().css("display", "none");

		var arr = label.split(" ");
		var point = arr[arr.length - 1].split(",");

		var latlng = L.latLng(point[1], point[0]);
		map.panTo(latlng);
		showEchart(latlng);
		pickValue(latlng);


		var htmlWidth =parseInt($("html").width());
		if(htmlWidth<=992){
			$("#hoverPic").animate({height:"310px"},1000);
		}
//  	 $(".chartBox").css({visibility:"visible"}).animate({width:"500px"},1000);
		myChart1.setOption(option);
	});


	//温馨提示
	var mobile = isMobile();
	if(mobile){
		$(".searchDiv").css("display","block");
	}else{
		setTimeout(function(){
			$("#reminder").fadeOut(500);
			$(".searchDiv").fadeIn(500);
		},5000);
	}
})

//下拉列表消失
$(".newText").mouseover(function () {
	$(this).css("display", "block");
})
$(".newText").mouseout(function () {
	$(this).css("display", "none");
})
//随机生成地图
function collage() {
	var clientWidth=document.body.offsetWidth;
	var clientHeight=document.body.offsetHeight;
	var tileLayer;
	map.eachLayer(function(layer) {
		if (layer instanceof L.TileLayer) {
			tileLayer = layer;
		}
	});
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width=clientWidth;
	canvas.height=clientHeight;
	var mapRect = map.getContainer().getBoundingClientRect();
	var tilesBox = tileLayer.getContainer();
	var div = tilesBox.firstElementChild;
	do{
		var tile = div.firstElementChild;
		if(!tile)continue;
		do {
			var tileRect = tile.getBoundingClientRect();
			var tilePos = {left: tileRect.left - mapRect.left, top: tileRect.top - mapRect.top};

			ctx.drawImage(tile, tilePos.left, tilePos.top, tileRect.width, tileRect.height);
		} while (tile = tile.nextElementSibling)
	}while (div = div.nextElementSibling)

	return canvas;
}


// 获取某个选中子要素的数据
function getCheckedFeatureData(obj){
	var featureData = null;
	for(var i=0;i<nwfdData.length;i++){
		if(obj==nwfdData[i].name){
			if(nwfdData[i].children.length==1){
				featureData = nwfdData[i].children[0];
			}else {
				var obj = $(".select").siblings().find("input[name=radioButton]:checked").siblings().html();
				var values = nwfdData[i].children;
				for(var j = 0; j < values.length; j++){
					if(obj == values[j].name){
						featureData = values[j];
						break;
					}
				}
			}
			break;
		}
	}
	return featureData;
}





//  格式化时间
Date.prototype.Format = function (fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}





