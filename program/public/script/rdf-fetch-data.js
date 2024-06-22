import $rdf  from 'rdflib';
import fetch  from 'node-fetch';


const rdfFetchDataFromFuseki = async (page = 1, searchQuery) => {
    const itemsPerPage = 20
    const offset = (page - 1) * itemsPerPage
    try {
        const store = $rdf.graph()
        const fetcher = new $rdf.Fetcher(store, {fetch : fetch});
        console.log("Hai")
    
        const rdf_enpoint = "http://localhost:3030/katalog-toko-buku/query";
        let query = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX kata: <http://www.katalog-buku.com/list#>
    
            SELECT ?book ?title ?author ?rating ?description
            WHERE {
            ?book kata:titled       ?title.
            ?book kata:writtenBy    ?author.
            ?book kata:rated        ?rating.
            ?book kata:description  ?description.
            `;
        
        if (searchQuery != null) {
            query = query.concat(`FILTER (
                CONTAINS(LCASE(?title), LCASE("${searchQuery}")) ||
                CONTAINS(LCASE(?author), LCASE("${searchQuery}")) ||
                CONTAINS(LCASE(?description), LCASE("${searchQuery}"))
            )`)
        }

        query = query.concat(`}
                            LIMIT ${itemsPerPage} 
                            OFFSET ${offset}
                            `)
        console.log("query = ", query)

        const fullUrl = `${rdf_enpoint}?query=${encodeURIComponent(query)}`

        const response = await fetch(fullUrl, {
            headers: {'Accept': 'application/sparql-results+json'}
        });
    
        if (!response.ok) {
            throw new Error(`Network response was not ok ${response.statusText}`);
        }
    
        const data = await response.json();
    
        const results =  data.results.bindings.map(binding => ({
            bookId: binding.book.value,
            title: binding.title.value,
            author: binding.author.value,
            rating: binding.rating.value
        }));  

        // console.log('ressult : ', results)
        return results;
    } catch {
        console.error('Error fetching data from Fuseki:', error);
        res.status(500).send('Error fetching data from Fuseki');
    }
};

export default rdfFetchDataFromFuseki;
 