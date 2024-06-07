import $rdf  from 'rdflib';
import fetch  from 'node-fetch';


const rdfFetchDataFromFuseki = async () => {
    try {
        const store = $rdf.graph()
        const fetcher = new $rdf.Fetcher(store, {fetch : fetch});
        // const queryEngine = new $rdf.QueryEngine();
        console.log("Hai");
    
        const rdf_enpoint = "http://localhost:3030/katalog-toko-buku/query";
        const query = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX kata: <http://www.katalog-buku.com/list#>
    
            SELECT ?book ?title ?author ?rating 
            WHERE {
            ?book kata:titled ?title;
                    kata:writtenBy ?author;
                    kata:rated ?rating.
            }
            LIMIT 10
            `;
        const fullUrl = `${rdf_enpoint}?query=${encodeURIComponent(query)}`
        
        // await fetcher.load(rdf_enpoint);
        
        // const books = await queryEngine.query(store, query);
        // console.log("Hai");
        // const books = await fetch(fullUrl, {
        //     headers: {'Accept': 'application/sparql-results+json'}
        // });
        // console.log('books : ', books)
        // const results = [];
        // books.foreach(book => {
        //     results.push({
        //         bookID: book.book.value, 
        //         title: book.title.value, 
        // });
        //         author: book.author.value, 
        //         rating: book.rating.value
        //     });

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

        console.log('ressult : ', results)
        return results;
    } catch {
        console.error('Error fetching data from Fuseki:', error);
        res.status(500).send('Error fetching data from Fuseki');
    }
};

// module.exports = { rdfFetchDataFromFuseki };
// module.exports.rdfFetchDataFromFuseki = rdfFetchDataFromFuseki;
export default rdfFetchDataFromFuseki;
 