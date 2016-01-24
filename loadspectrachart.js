google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

var filepath = 'http://localhost:8000/Spectra/';
var spectraObj = {};

function populList(path, parent) {
    $.ajax({
	url: path,
	type: 'get',
	async: false,
	success: function(files) {
	    var fileList = $(files).find("li");
	    for (var i = 0; i < fileList.length; i++) {
		name = fileList[i].textContent;
		if (name.indexOf(".txt") >= 0) {
		    name = name.substring(0, name.indexOf(".txt"));
		    spectraObj[parent].push(name);
		} else {
		    name = name.substring(0, name.length - 2);
		    spectraObj[name] = [];
		    populList(path + name + "/", name)
		}
	    }
	}
    });
}

window.onload = function() {
    populList(filepath, "");

    var spectraType = document.getElementById("spectraType");
    var spectra = document.getElementById("spectra");

    for (var cat in spectraObj) {
	spectraType.options[spectraType.options.length] = new Option(cat,cat);
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
	if (this.selectedIndex < 1) return;
	name = filepath + spectraType.value + "/" + this.value + ".txt";
	drawChart(name, this.value);
    }
}

function drawChart(name, materialName) {

    var dataArray = [];
    var filename = name;

    $.ajax({
        url: filename,
        type: 'get',
        success: function (txt) {
            var txtArray = txt.split("\n");

            for (var i=0; i < txtArray.length; i++) {
		var tmpData = txtArray[i].match(/[-+]?\d*\.?\d+([eE][-+]\d+)?/g);
		
                if (tmpData) {
                    var t0 = parseFloat(tmpData[0]);
                    var t1 = parseFloat(tmpData[1]);
		    dataArray.push([t0, t1]);
                }
            }

	    if (dataArray.length == 0) dataArray.push([0, 0]);},
	
	error: function() {
	    dataArray = [[0, 0]];},
	
	complete: function() {
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
		title: materialName,
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
	    
	    chart.draw(data, options);
	}
    });

}


function downloadSpectra() {
    var spectraType = document.getElementById("spectraType");
    var spectra = document.getElementById("spectra");
    
    if (spectra.selectedIndex >= 1) {
	var link = document.createElement("a");
	link.href = "Spectra/" + spectraType.value + "/" + spectra.value + ".txt";
	link.target = "_blank";
	link.click()
    }
}
