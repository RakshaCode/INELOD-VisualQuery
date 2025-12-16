// Constants
const SPARQL_ENDPOINT = "https://stats.linkeddata.es/sparql";

// Event listeners
document.addEventListener('DOMContentLoaded', loadCCAA);

// Initialization of components on page load
$(document).ready(function () {
	$("#tablesorter-demo").tablesorter();
	$("#tablesorter-demo").stickyTableHeaders();
	$('[data-toggle="tooltip"]').tooltip();
});

// Execute SPARQL query and return data
function executeSparqlQuery(query) {
	return fetch(SPARQL_ENDPOINT + "?query=" + encodeURIComponent(query), {
		headers: { "Accept": "application/sparql-results+json" }
	})
		.then(response => response.json());
}

// Display results in the table
function displayQueryInTable(query) {
	// Clear the table
	document.getElementById('table-head').innerHTML = '';
	document.getElementById('table-body').innerHTML = '';

	// Execute the query and fill the table
	data = executeSparqlQuery(query)
		.then(data => {
			// Headers
			let headHtml = '<tr>';
			data.head.vars.forEach(v => headHtml += '<th>' + v + '</th>');
			headHtml += '</tr>';
			document.getElementById('table-head').innerHTML = headHtml;

			// Rows
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

// Load CCAA into the selector
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

// Execute query with the selected CCAA
function executeQueryWithSelectedCCAA() {
	const selectedCCAA = document.getElementById('ccaa-selector').value;
	const selectedCube = document.getElementById('cube-selector').value;

	let query = '';

	if ("estancia-media" == selectedCube) {
		query = `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX clasificaciones: <http://stats.linkeddata.es/voc/clasificaciones/>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX inelod: <https://stats.linkeddata.es/voc/cubes/vocabulary#>
PREFIX sdmx: <http://purl.org/linked-data/sdmx/2009/dimension#>

SELECT DISTINCT ?ccaa ?observation ?lodging ?averageStay ?refPeriod WHERE {
    BIND("${selectedCCAA}" AS ?ccaa)
    ?observation qb:dataSet <http://stats.linkeddata.es/voc/cubes/2940>;
        inelod:ccaa ?ccaa.
    OPTIONAL {?observation inelod:lodgingType ?lodging.}
    OPTIONAL {?observation inelod:averageStay ?averageStay.}
    OPTIONAL {?observation sdmx:refPeriod ?refPeriod.}
} LIMIT 100`;
	}
	else if ("tasa-paro" == selectedCube) {
		query = `
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX clasificaciones: <http://stats.linkeddata.es/voc/clasificaciones/>
PREFIX qb: <http://purl.org/linked-data/cube#>
PREFIX inelod: <https://stats.linkeddata.es/voc/cubes/vocabulary#>
PREFIX sdmx: <http://purl.org/linked-data/sdmx/2009/dimension#>

SELECT DISTINCT ?ccaa ?observation ?refPeriod ?age ?sex ?unemploymentRate WHERE {
    BIND("${selectedCCAA}" AS ?ccaa)
    ?observation qb:dataSet <http://stats.linkeddata.es/voc/cubes/65334>;
        inelod:ccaa ?ccaa.
    OPTIONAL{?observation sdmx:refPeriod ?refPeriod.}
    OPTIONAL{?observation sdmx:age ?age.}
    OPTIONAL{?observation sdmx:sex ?sex.}
    OPTIONAL{?observation sdmx:unemploymentRate ?unemploymentRate.}
} LIMIT 100`;
	}


	displayQueryInTable(query);
}

