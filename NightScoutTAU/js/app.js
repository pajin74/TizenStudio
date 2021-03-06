(function () {
	window.addEventListener("tizenhwkey", function (ev) {
		var activePopup = null,
			page = null,
			pageid = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageid = page ? page.id : "";

			if (pageid === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
	
    /**
     * Initializes the application.
     * @private
     */
    function init() {
    	
       	//var INSULIN_SENSITIVITY = 2.2;
    	var CARB_RATIO = 5.5;
    	//var GLY_MAX = 5.5;
    	//var GLY_MIN = 5.0;
    	
    	var directionSymbols = {
                NONE: "()",
                DoubleUp: "&#8593;&#8593;",
                SingleUp: "&#8593;",
                FortyFiveUp: "&#8599;",
                Flat:"&#8594;",
                FortyFiveDown: "&#8600;",
                SingleDown: "&#8595;",
                DoubleDown: "&#8595;",
                "NOT COMPUTABLE": "-",
                "RATE OUT OF RANGE": "?"
            };
              
        var client = new XMLHttpRequest();
        
        client.overrideMimeType("application/json");
              
        client.onreadystatechange = function () {
        	if (this.readyState === 4 && this.status === 200) {
        		     		
        		var resultJSON = JSON.parse(client.responseText);
        		
        		var contenttext = document.getElementById('content-time');
        		var timestampDiff = Math.round((resultJSON.status[0].now - resultJSON.bgs[0].datetime)/(1000*60));
        		contenttext.textContent = timestampDiff + " min ago"; 
        		
        		// glykemie
        		contenttext = document.getElementById('content-sgv');
        		contenttext.textContent = resultJSON.bgs[0].sgv;
        		
        		// direction
           		contenttext = document.getElementById('content-direction');
        		contenttext.innerHTML  = directionSymbols[resultJSON.bgs[0].direction];
        		
        		// delta
        		contenttext = document.getElementById('content-bgdelta');
        		if (resultJSON.bgs[0].bgdelta > 0) {
        			contenttext.textContent = "(+" + resultJSON.bgs[0].bgdelta + ")" ;
        		} else {
        			contenttext.textContent = "(" + resultJSON.bgs[0].bgdelta + ")" ;
        		}
        		
        		// IOB (insulin on board)
        		contenttext = document.getElementById('content-iob');
        		contenttext.textContent =resultJSON.bgs[0].iob;        		
        		
        		// BWP (correction insulin)
        		contenttext = document.getElementById('content-bwp');
        		if (resultJSON.bgs[0].bwp < 0 ) {
        			contenttext.textContent = resultJSON.bgs[0].bwp + "(" + Math.round((-resultJSON.bgs[0].bwp) * CARB_RATIO,1) + ")" ;
        		} else {
        			contenttext.textContent = resultJSON.bgs[0].bwp;
        		}
        		
        		//BWPO (expected result)
        		contenttext = document.getElementById('content-bwpo');
        		contenttext.textContent = "(" + resultJSON.bgs[0].bwpo + ")"; 
        		
        		// COB
        		contenttext = document.getElementById('content-cob');
        		contenttext.textContent = resultJSON.bgs[0].cob; 
        	}
        };
        		
        client.open('GET', 'https://pajin-cgm-monitor.herokuapp.com/pebble',true);
        client.send();
        
    }
 
    // The function "init" will be executed after the application successfully loaded.
    
    window.onload = init;
}());