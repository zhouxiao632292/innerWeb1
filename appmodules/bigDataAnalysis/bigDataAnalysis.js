BigDataAnalysis = L.Class.extend({
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
				
				this.show();
		},
		handler:function(){
				//处理操作逻辑
				
		},
		getChildPage:function(pageId){
				if(pageId == "liveAnalysis"){
						//document.location.href = "liveAnalysis.html";
						$('#childPageIframe').attr('src','liveAnalysis.html');
				}else if(pageId == "historyExtreme"){
						$('#childPageIframe').attr('src','historyExtreme.html');
				}else if(pageId == "meteorologicalProcess"){
						//document.location.href = "meteorologicalProcess.html";
						$('#childPageIframe').attr('src','meteorologicalProcess.html');
				}else if(pageId == "disastrousWeather"){
						//document.location.href = "disastrousWeather.html";
						$('#childPageIframe').attr('src','disastrousWeather.html');
				}else if(pageId == "台风大数据"){
						
				}	
		}
		
    
});