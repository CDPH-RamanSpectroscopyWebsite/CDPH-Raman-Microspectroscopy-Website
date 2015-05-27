google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

var dataArray = [["Shift", "Intensity"]];
var filename = 'http://localhost:8000/Spectra/Pharmaceuticals/TXT/Atenolol.txt';

function drawChart() {
    $.ajax({
        url: filename,
        type: 'get',
        success: function (txt) {
            var txtArray = txt.split("\n");

            for (var i=0; i < txtArray.length; i++) {
                var tmpData = txtArray[i].split(/\s+/);
                var t0 = parseFloat(tmpData[0]);
                var t1 = parseFloat(tmpData[1]);
                if (true) {
                    dataArray.push([t0, t1]);

                }
            }

            var data = google.visualization.arrayToDataTable(dataArray);

            var options = {
                width: 800,
                height: 500,
                lineWidth: 1,
                pointSize: 0,
                hAxis: {title: 'Shift (cm-1)'},
                vAxis: {title: 'Intensity'},
                tooltip: { isHtml: true },
                legend: 'none'
            };

            var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

            chart.draw(data, options);
            

        }
    });

}