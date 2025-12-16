// Constantes
const SPARQL_ENDPOINT = "https://stats.linkeddata.es/sparql";

// Event listeners
document.addEventListener('DOMContentLoaded', loadCCAA);

// Inicialización de componentes al cargar la página
$(document).ready(function () {
	$("#tablesorter-demo").tablesorter();
	$("#tablesorter-demo").stickyTableHeaders();
	$('[data-toggle="tooltip"]').tooltip();
});

// Ejecutar consulta SPARQL y devuelve los datos
function executeSparqlQuery(query) {
	return fetch(SPARQL_ENDPOINT + "?query=" + encodeURIComponent(query), {
		headers: { "Accept": "application/sparql-results+json" }
	})
		.then(response => response.json());
}

// Mostrar resultados en la tabla
function displayQueryInTable(query) {
	// Limpia la tabla
	document.getElementById('table-head').innerHTML = '';
	document.getElementById('table-body').innerHTML = '';

	// Ejecuta la consulta y llena la tabla
	data = executeSparqlQuery(query)
		.then(data => {
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
		});
}

// Cargar comunidades autónomas en el selector
function loadCCAA() {
	const query = `
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX inelod: <https://stats.linkeddata.es/voc/cubes/vocabulary#>

SELECT DISTINCT ?ccaa
WHERE {
    ?observation a qb:Observation;
        inelod:ccaa ?ccaa .
}
`;

	executeSparqlQuery(query)
		.then(data => {
			const selector = document.getElementById('ccaa-selector');

			data.results.bindings.forEach(row => {
				const option = document.createElement('option');
				option.value = row.ccaa.value;
				option.textContent = row.ccaa.value;
				selector.appendChild(option);
			});
		});
}

