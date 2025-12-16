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
	return fetch(SPARQL_ENDPOINT + "?query=" + encodeURIComponent(query), {
		headers: { "Accept": "application/sparql-results+json" }
	})
		.then(response => response.json())
		.then(data => data.results.bindings);
}
