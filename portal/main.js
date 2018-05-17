Portal = L.Class.extend({
		initialize: function (options) {
        
    },
    
    //获取选中模块项
		getModule: function (moduleId){
			 //intelligentGridPrediction
			 //impactForecast
			 //bigDataAnalysis
			 //monitorAnalysis
			 //gridEdit
			 
			 this.hideModuleUI();
			 this.initModuleUI(moduleId);
		},
		
		//初始化界面
		initModuleUI: function (moduleId){
			 
			 if(moduleId == "intelligentGridPrediction"){

			 		 $('#iframeMain').attr('src','appmodules/intelligentGridPrediction/intelligentGridPrediction.html?lat='+lat+'&lng='+lng);
				 $("#initSearch").hide();
			 }else if(moduleId == "impactForecast"){

			 		 $('#iframeMain').attr('src','appmodules/impactForecast/impactForecast.html');
				 $("#initSearch").hide();
			 }else if(moduleId == "bigDataAnalysis"){

			 		 $('#iframeMain').attr('src','appmodules/bigDataAnalysis/bigDataAnalysis.html');
			 		 
			 }else if(moduleId == "monitorAnalysis"){

			 		 $('#iframeMain').attr('src','appmodules/monitorAnalysis/monitorAnalysis.html');
			 		 
			 }else if(moduleId == "gridEdit"){

			 		 $('#iframeMain').attr('src','appmodules/gridEdit/gridEdit.html?lat='+lat+'&lng='+lng);
				 $("#initSearch").hide();
			 }
			 
		},
		
		//隐藏界面DIV
		hideModuleUI: function (){
			 
		}
	
});

var portal = new Portal({});
//默认显示智能网格预报应用
portal.getModule("intelligentGridPrediction");