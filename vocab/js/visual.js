// Constantes
const SPARQL_ENDPOINT = "https://stats.linkeddata.es/sparql";

// Inicialización de componentes al cargar la página
$(document).ready(function () {
	$("#tablesorter-demo").tablesorter();
	$("#tablesorter-demo").stickyTableHeaders();
	$('[data-toggle="tooltip"]').tooltip();
});

// Ejecutar consulta SPARQL y devuelve los datos
function executeSparqlQuery(query) {
	fetch(SPARQL_ENDPOINT + "?query=" + encodeURIComponent(query), {
		headers: { "Accept": "application/sparql-results+json" }
	})
		.then(response => response.json())
		.then(data => displayResultsInTable(data));
}

// Mostrar resultados en la tabla
function displayResultsInTable(data) {
	// Encabezados
	let headHtml = '<tr>';
	data.head.vars.forEach(v => headHtml += '<th>' + v + '</th>');
	headHtml += '</tr>';
	document.getElementById('table-head').innerHTML = headHtml;

	// Filas
	let bodyHtml = '';
	data.results.bindings.forEach(row => {
		bodyHtml += '<tr>';
		data.head.vars.forEach(v => {
			bodyHtml += '<td>' + (row[v] ? row[v].value : '') + '</td>';
		});
		bodyHtml += '</tr>';
	});
	document.getElementById('table-body').innerHTML = bodyHtml;
}

