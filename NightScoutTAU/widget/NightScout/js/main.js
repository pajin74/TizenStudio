window.onload = function() {
	
	function errorHandler(eh){
		var contenttext = document.getElementById('content-time');
		contenttext.textContent = eh;	
		contenttext = document.getElementById('content-bwp');
		contenttext.textContent = eh;
		
	}

	/* Define the event handler in the main.js file */
	function visibilitychange() {
	    if (document.visibilityState === 'hidden') {
	        /* Store shared data */
	    } else {
	        /* Load stored data and update the page */
	    	init("Visibility");
	    }
	}
	
	function init(initType) {
    
			   	//var INSULIN_SENSITIVITY = 2.2;
				var CARB_RATIO = 5.5;
				//var GLY_MAX = 5.5;
				//var GLY_MIN = 5.0;
				
				/*var directionSymbols = {
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
			        };*/
				       
		        var client = new XMLHttpRequest();
		        client.open('GET', 'https://pajin-cgm-monitor.herokuapp.com/api/v1/entries.json',true);
		        
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
		        		//contenttext.innerHTML  = directionSymbols[resultJSON.bgs[0].direction];
		           		contenttext.textContent = "?";
		        		
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
		        	} else {
		        		errorHandler(initType + ": Onready state not pass ...");
		        	}
		        };
		        		  
		        client.send();
		}

	document.addEventListener('visibilitychange', visibilitychange);
	init("Load");

};
