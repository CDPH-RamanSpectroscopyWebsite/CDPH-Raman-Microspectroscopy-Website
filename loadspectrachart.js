google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

var filepath = 'http://localhost:8000/Spectra/';

var spectraObj = {
	"Pharmaceuticals":
		["acetaminophen",
		"amitryptyline",
		"arecoline",
		"atenolol"],
	"Minerals":
		["Actinolite1",
		"Anatase1"],
	"Plastics":
		["PEpellets_CR022114_Ctab_785edgeconfocal_30s_100%_50X_2Processed",
		"PETpellets_CR022114_Ctab_785edgeconfocal_30s_100%_50X_2processed",
		"PPpellets_CR022114_Ctab_785edgeconfocal_30s_100%_50X_2processed",
		"PVC_CR022114_Ctab_785edgeconfocal_30s_100%_50X_2processed"]
		
}

window.onload = function() {
	var spectraType = document.getElementById("spectraType");
	var spectra = document.getElementById("spectra");
	
	for (var cat in spectraObj) {
		spectraType.options[spectraType.options.length] = new Option(cat, cat);
	}
	
	spectraType.onchange = function() {
		spectra.length = 1;
		if (this.selectedIndex < 1) return;
		for (var i = 0; i < spectraObj[this.value].length; i++) {
			var currSpec = spectraObj[this.value][i];
			spectra.options[spectra.options.length] = new Option(currSpec, currSpec);
		}	
	}
	
	spectra.onchange = function() {
		name = filepath + spectraType.value + "/" + this.value + ".txt";
		drawChart(name);
	}
}

function drawChart(name) {

    var dataArray = [];
    var filename = name;

    $.ajax({
        url: filename,
        type: 'get',
        success: function (txt) {
            var txtArray = txt.split("\n");

            for (var i=0; i < txtArray.length; i++) {
                var tmpData = txtArray[i].split(/\s+/);
				//var tmpData = txtArray[i].match(/[-+]?\d*\.?\d+/g);
				
                var t0 = parseFloat(tmpData[0]);
                var t1 = parseFloat(tmpData[1]);
				
                if (isNaN(t0) || isNaN(t1)) {
                    continue;
                } else {
					dataArray.push([t0, t1]);
				}
            }

			if (dataArray.length == 0) dataArray.push([0, 0]);
            var data = google.visualization.arrayToDataTable(dataArray, true);

            var options = {
                width: 800,
                height: 500,
                lineWidth: 1,
                pointSize: 0,
                hAxis: {title: 'Raman Shift (cm-1)'},
                vAxis: {title: 'Intensity'},
                tooltip: { isHtml: true },
                legend: 'none',
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
			
			chart.draw(data, options);	
            
        }
    });

}