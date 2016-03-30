google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

var filepath = 'http://localhost:8000/Spectra/';
var spectraObj = {};


function populList(path) {
    $.ajax({
	url: path,
	type: 'get',
	async: false,
	success: function(txt) {
	    var currDir = 'Default';
	    var foldHead = '__FOLDER__: ';

	    var txtArray = txt.split("\n");
	    for (i = 0; i < txtArray.length; i++) {
		line = txtArray[i];
		if (line.indexOf(foldHead) >= 0) {
		    currDir = line.slice(foldHead.length);
		    spectraObj[currDir] = [];
		} else {
		    extInd = line.indexOf('.')
		    spectraObj[currDir].push(line.slice(0, extInd));
		}
            }
	}
    });

}

window.onload = function() {
    populList(filepath + 'dir_index.txt');

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


function searchPeaks() {
    var peaksIn = document.getElementById("peaksIn");
    var peaksOut = document.getElementById("peaksOut");

    while (peaksOut.firstChild) {
	peaksOut.removeChild(peaksOut.firstChild);
    }

    var peakStrList = (peaksIn.value).split(",");
    var peakList = [];
    for (i = 0; i < peakStrList.length; i++) {
	peakList.push(parseInt(peakStrList[i]));
    }
    $.ajax({
	url: filepath + 'peak_index.txt',
	type: 'get',
	async: false,
	success: function(txt) {
	    var firstHit = true;
	    var potPeaks = [];
	    var prevline = [];
	    var prevBin = 0;
	    var txtArray = txt.split("\n");
	    for (i = 0; i < txtArray.length; i++) {
		line = txtArray[i].split(/ : |,/);
		currBin = parseInt(line[0]);
		for (k = 0; k < peakList.length; k++) {
		    peak = peakList[k];
		    if ( peak >= prevBin && peak < currBin ) {
			// The first element of line is the raman shift of the
			// bin. The last element is just an empty string (that
			// replaced a comma)
			temp = [];
			for (j = 1; j < prevline.length-1; j++) {
			    if (firstHit) {
				potPeaks.push(prevline[j]);
			    } else {
				if (potPeaks.indexOf(prevline[j]) >= 0) {
				    if (peak = 1302) {
					console.log(prevline);
				    }
				    
				    temp.push(prevline[j]);
				}
			    }
			}
			if (!firstHit) 	potPeaks = temp;
			firstHit = false;
		    }
		}
		prevline = line;
		prevBin = currBin;
            }

	    for (i = 0; i < potPeaks.length; i++) {
		specMatch = potPeaks[i];
		var li = document.createElement('li');
		var btn = document.createElement('BUTTON');
		btn.appendChild(document.createTextNode(specMatch));
		btn.value = specMatch;
		li.appendChild(btn);
		peaksOut.appendChild(li);
		
		btn.addEventListener('click', function() {
		    drawChart(filepath+this.value,
			      this.value)
		});
	    }
	}
    });
}
