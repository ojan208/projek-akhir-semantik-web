import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { decode } from 'html-entities';
import rdfFetchDataFromFuseki from './public/script/rdf-fetch-data.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const app = express();

app.use(express.static('public'));
app.use('/style', express.static(__dirname + "'public/style"))
app.use('/script', express.static(__dirname + "'public/script"))

app.set('views', './views')
app.set('view engine', 'ejs')

app.set('json spaces', 40);

app.get('/', async (req, res) => {
    try {
        const response = await rdfFetchDataFromFuseki();
        console.log('response : ', response)
        const jsonData = JSON.stringify(response, null, 3);
        const results = decode(jsonData);
        // const parsedData = JSON.parse(results);
        console.log('results : ',results)
        // var decodedData = decodeHTMLEntities(jsonData);
        // console.log('decoded Data : ', decodedData)
        // console.log('parsed Data : ', parsedData)

        // console.log('response data in app.js : ', jsonData)
        // Send the JSON data as plain text
        res.setHeader('Content-Type', 'application/json');
        // res.send(jsonData);
        // console.log(jsonData)
        res.render('index', {data: (results)});
    } catch (error) {
        console.error('Error fetching data from Fuseki:', error);
        res.status(500).send('Error fetching data from Fuseki');
    }
})

app.get('/fetch-data', async (req, res) => {
    // res.sendFile(path.join(__dirname, 'public/page', 'index.html'));
    try {
        const results = await rdfFetchDataFromFuseki();
        // const jsonData = JSON.stringify(results, null, 2);

        // console.log('response data in app.js : ', jsonData)
        // Send the JSON data as plain text
        res.setHeader('Content-Type', 'application/json');
        // res.send(jsonData);
        // console.log(jsonData)

        var contoh = {
            "bookId": "http://www.katalog-buku.com/list#B10",
            "title": "Screenplay",
            "author": "Syd Field",
            "rating": "4.5"
          }
        res.render('index', {data: results});
    } catch (error) {
        console.error('Error fetching data from Fuseki:', error);
        res.status(500).send('Error fetching data from Fuseki');
    }
});

app.listen(3000, () => {
    console.log("App running on http://localhost:3000")
})