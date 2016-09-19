var tableData = [[]];
var fileName;

function handleFiles(files) {
	// Check for the various File API support.
	if (window.FileReader) {
		// FileReader are supported.
		getAsText(files[0]);
	} else {
		alert('FileReader are not supported in this browser.');
	}
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
	// Read file into memory as UTF-8      
	reader.readAsText(fileToRead);
	fileName = fileToRead.name;
	var temp = document.getElementById("saveToFile");
	temp.setAttribute("value", fileName);
}

function loadHandler(event) {
	var csv = event.target.result;
	processData(csv);             
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
    console.log(lines);
    tableData = lines;
	drawOutput(lines);
}

function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}

function drawOutput(lines) {
    //Clear previous data
    document.getElementById("output").innerHTML = "";
    var table = document.createElement("table");
    table.setAttribute("id", "dataTable");
    var colWidth = [];

    var temp = table.insertRow(-1);
    //for (var j = 0; j < lines[0].length; j++) {
    //    var firstNameCell = temp.insertCell(-1);
    //    var tempText = document.createTextNode(lines[0][j]);
    //    colWidth[j] = tempText.length;
    //    firstNameCell.appendChild(tempText);
    //}

    //for (var i = 0; i < lines.length; i++) {
    //    for (var j = 0; j < lines[i].length; j++) {
    //        var tempString = lines[i][j];
    //        if (tempString.length > colWidth[j]) {
    //            colWidth[j] = tempString.length;
    //        }
    //        if (colWidth[j] > 50) {
    //            colWidth[j] = 50;
    //        }
    //    }
    //}

        for (var i = 0; i < lines.length; i++) {
            var row = table.insertRow(-1);
            for (var j = 0; j < lines[i].length; j++) {
                var firstNameCell = row.insertCell(-1);
                var tempInput = document.createTextNode(lines[i][j]);

                firstNameCell.appendChild(tempInput);
            }

        }
        document.getElementById("output").appendChild(table);
}

function reSaveData() {
    $("table#dataTable tr").each(function () {
        var arrayOfThisRow = [];
        var tempTableData = $(this).find('td');
        if (tempTableData.length > 0) {
            tempTableData.each(function () {
                arrayOfThisRow.push($(this).text());
            });
            tableData.push(arrayOfThisRow);
        }
    });
}

function exportToCsv() {
    reSaveData();
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < tableData.length; i++) {
        csvFile += processRow(tableData[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, fileName);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}