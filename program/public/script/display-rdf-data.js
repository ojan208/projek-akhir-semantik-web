// script.js
function decodeHTMLEntities(text) {
    var entities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#x27;': '\'',
        '&#39;': '\'',
        '&#x2F;': '/',
        '&#039;': '\'',
        '&#34;': '"'
    };

    return text.replace(/&(?:amp|lt|gt|quot|#x27|#x2F|#39|#039);/g, function(entity) {
        return entities[entity];
    });
}

window.onload = function() {
    var jsonData = "<%= JSON.stringify(data) %>"; // This will be replaced with the actual JSON data
    var decodedData = decodeHTMLEntities(jsonData);
    var parsedData = JSON.parse(decodedData);

    var tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

    parsedData.forEach(function(item) {
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = item.bookID;
        cell2.innerHTML = item.title;
        cell3.innerHTML = item.author;
        cell4.innerHTML = item.rating;
    });
};

{/* <script>
    import { decode } from 'html-entities';

window.onload = function() {
    var jsonData = <%= (data) %>; 
    console.log('raw json : ', jsonData);
    var jsonStrings = JSON.stringify(jsonData)
    console.log('json strings : ', jsonStrings);
    // var decodedData = decode(jsonData);
    // console.log('Decoded Data : ', decodedData);
    // var parsedData = JSON.parse(decodedData);

    // console.log('parsed data', parsedData)

    var tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];

    jsonStrings.forEach(function(item) {
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = item.bookID;
        cell2.innerHTML = item.title;
        cell3.innerHTML = item.author;
        cell4.innerHTML = item.rating;
    });
};

</script> */}
