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

// app.set('json spaces', 40);

app.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    try {
        const response = await rdfFetchDataFromFuseki(page);
        console.log('response : ', response)

        res.render('index', {data: (response), page});
        // res.json(jsonData)
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

        
        // res.render('index', {data: results});
        res.json(results)
    } catch (error) {
        console.error('Error fetching data from Fuseki:', error);
        res.status(500).send('Error fetching data from Fuseki');
    }
});

app.listen(3000, () => {
    console.log("App running on http://localhost:3000")
})