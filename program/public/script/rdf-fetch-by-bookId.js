import $rdf  from 'rdflib';
import fetch  from 'node-fetch';


const rdfFecthDataByBookid = async (page = 1, bookId) => {
    try {
        const store = $rdf.graph()
        const fetcher = new $rdf.Fetcher(store, {fetch : fetch});
    
        const rdf_enpoint = "http://localhost:3030/katalog-toko-buku/query";
        const query = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX kata: <http://www.katalog-buku.com/list#>
    
            SELECT ?title ?author ?rating ?voterSum ?price ?description
            WHERE {
            kata:${bookId} kata:titled ?title;
                    kata:writtenBy ?author;
                    kata:rated ?rating;
                    kata:voterSum ?voterSum;
                    kata:priced ?price;
                    kata:description ?description.
            }
            `;
        console.log("Query : ", query)
        const fullUrl = `${rdf_enpoint}?query=${encodeURIComponent(query)}`
        
        const response = await fetch(fullUrl, {
            headers: {'Accept': 'application/sparql-results+json'}
        });
        
        if (!response.ok) {
            throw new Error(`Network response was not ok ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Data : ", data)
        
        const results =  data.results.bindings.map(binding => ({
            title: binding.title.value,
            author: binding.author.value,
            rating: binding.rating.value, 
            voterSum: binding.voterSum.value, 
            price: binding.price.value,
            description: binding.description.value
        }));  
        console.log("Hai")
        
        console.log('ressult : ', results)
        return results;
    } catch {
        console.error('Error fetching data from Fuseki:', error);
        res.status(500).send('Error fetching data from Fuseki');
    }
};

export default rdfFecthDataByBookid;
 