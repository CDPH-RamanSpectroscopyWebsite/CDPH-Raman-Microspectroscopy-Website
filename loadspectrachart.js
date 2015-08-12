google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);

var filepath = 'http://localhost:8000/Spectra/';

var spectraObj = {
	"Flame Retardant":
		["3 Bromo Styrene_532nm", "3 Bromo Styrene_785nm", "Antimony Trioxide__780nm",
		 "DecaPBDE_532nm", "DecaPBDE_785nm", "Dimethyl Cholothiophosphate",
		 "FM2100_semstub_785nm_50%_10s_20x_2final_Raman", "HBCDD_785nm", "HexaPBDE_785nm",
		 "Melamine", "Phosphorus Oxychloride", "PUF_Ref_1",
		 "PUF_Ref_short", "TBB_532nm", "TBBPA_semstub_785nm_100%_10s_20x_2final_Raman",
		 "TBPH_785nm", "TCEP_532nm", "TCEP_785nm",
		 "TCPP_532nm", "TCPP_785nm", "TDCCP_532nm",
		 "TDCCP_785nm", "TPP_Ctab_532nm_25X1000um_5mW_5s_50x_0_highRes", "TPP_Ctab_532nm_25X1000um_10mW_5s_50x_0_LowRes",
		 "TPP_Ctab_785nm_25X1000um_50mW_5s_50x_0_LowRes", "TPP_Ctab_785nm_25X1000um_100mW_5s_50x_0_LowRes",
		 "TPP_Ctab_785nm_25X1000um_100mW_5s_50x_1_HighRes"],
	"Fungal Spores":
		["ASPERGILLUS VERSICOLOR", "ASPERGILLUS VERSICOLOR",
		 "EPICOCCUM NIGRAM", "EUROTIUM HERBARIORUM",
		 "PENICILLIUM BREVICOMPACTUM", "PENICILLIUM COPROPHILUM",
		 "RHIZOPUS STOLONIFER", "SCOPULARIOPSIS BREVICAULIS_AVG"],
	"Miscellaneous":
		["Bengay", "Canola oil", "Canola oil_6s_5acq",
		 "Canola oil_6s_5acq_avg", "Canola oil_6s_5acq_avg_BckGMulti_GRAMS", "Canola oil_6s_5acq_avg_lowRes_BsLn160",
		 "Conc Sulfuric acid (96%)", "DMMP in Canola Oil_12s_1acq", "DMMP in Canola Oil_12s_1acq_lowRes_BsLn160",
		 "DMMPl_auto_5acq_avg", "Na2CO3_AlFoil_ext1", "New Bengay (Red)",
		 "ONitroToluene", "Soybean oil", "Soybean oil_6s_5acq_avg"],
	"Pharmaceuticals":
		["acetaminophen", "amitryptyline", "arecoline", 
		 "atenolol", "cantharidin", "carbinoxamine",
		 "chlorpheniramine", "chlorpropamide", "chlorzoxazone", 
		 "clemastine", "clophedianol", "cyclobenzaprine",
		 "dexamethasone", "diclofenac", "dihydrocodeine",
		 "diphenidol", "diphenoxylate", "doxylamine",
		 "fenfluramine", "fentanyl", "flunitrazepam",
		 "furazolidone", "haloperidol", "heptaminol",
		 "imipramine", "lapachol", "loratadine",
		 "mephenesin", "mephentermine", "methimazole",
		 "metoprolol", "minoxidil", "nadolol",
		 "nalidixic", "nortriptyline", "oxybenzone",
		 "oxycodone", "papaverine", "pentazocine",
		 "phenformin", "phenothiazine", "phenytoin",
		 "pilocarpine", "pregnenolone", "progesterone",
		 "promethazine", "propantheline bromide", "propranolol",
		 "quinidine", "strychnine", "sulfadiazine",
		 "sulfanilamide", "theophyline", "timolol",
		 "tolazoline", "tolbutamide", "trihexyphenidyl",
		 "trimethobenzomide", "yohimbine"],
	"Plastics":
		["PEpellets_CR022114_Ctab_785edgeconfocal_30s_100%_50X_2Processed",
		 "PETpellets_CR022114_Ctab_785edgeconfocal_30s_100%_50X_2processed",
		 "PPpellets_CR022114_Ctab_785edgeconfocal_30s_100%_50X_2processed",
		 "PVC_CR022114_Ctab_785edgeconfocal_30s_100%_50X_2processed"],
	"WhitePowders":
		["AccentMSG", "Actinolite1", "Advil",
		 "Ajax", "amylose_asc", "apectin_asc",
		 "ArrowrootStarch", "Aspirin", "BabyPowder",
		 "BakingSoda", "Bisquick", "borax_532",
		 "borax_785", "cellulose_asc", "CornStarch",
		 "EqualSweet", "Fixall", "fructose_asc",
		 "GainDetergent", "GuarGumElephantPharmacy", "Ibuprofen",
		 "lactose_asc", "maltose_asc", "NatraTaste",
		 "ribose_asc", "Splenda", "SteviaExtract",
		 "sucr_asc", "SugarGranulatedCH", "SugarOrganic",
		 "SweetCrystals", "SweetNLow", "Talc",
		 "Talc1", "TalcumPowder", "TideDetergent",
		 "TraderJoesDetergent", "Tylenol", "UltraPlusDetergent",
		 "WheatFlour", "XanthanGum"]
		
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