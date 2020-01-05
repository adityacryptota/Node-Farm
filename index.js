const fs = require('fs');
const http = require('http');
const url = require('url');

// Get the data
const data = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, 'utf-8'));

// Get the content of the file. Passing encoding is important.
const overView = fs.readFileSync(`${__dirname}/overview.html`, 'utf-8');
const cardTemplate = fs.readFileSync(`${__dirname}/card.html`, 'utf-8');

// Replace the placeholder with actual data.
const replaceContent = (cardTemplate, product) => {

    // .replace() method affect original string. Do not mutate the original data. Good practice.
    let output = cardTemplate;
    output = output.replace(/{NAME}/g, product.productName);
    output = output.replace(/{IMAGE}/g, product.image);
    output = output.replace(/{QUANTITY}/g, product.quantity);
    output = output.replace(/{PRICE}/g, product.price);
    output = output.replace(/{URL}/g, `/product?id=${product.id}`);
    // console.log(`/product?id=${product.id}`);
    
    (!product.organic) ? output = output.replace(/{ORGANIC_OR_NOT}/g, 'Not Organic') : output = output.replace(/{ORGANIC_OR_NOT}/g, 'Organic');
    return output;
}



const server = http.createServer((req,res) => {
    // Get the url
    let pathName = req.url;

    // console.log(url.parse(req.url, true));

    // Routes
    if(pathName === '/overview' || pathName === '/'){
        // Send the header saying the content that server is going to send to the browser, is text/html. This is important.
        res.writeHead(200, {
            "Content-type": "text/html"
        });

        // Generate one card for each item in the data. Since data contains 5 object. 5 Cards will be generated.
        const cardsHtml = data.map((product) => replaceContent(cardTemplate, product)).join('');
        // Add the cards to the overview page.
        const mainPage = overView.replace(/{CARD}/, cardsHtml);
        // Send the overview page.
        res.end(mainPage);

    }else if(pathName === '/product'){
        res.end('This is the product page');
    }else if(pathName === '/api'){
        res.writeHead(200, {
            "Content-type": "application/json"
        });
        res.end('This is API');
    }
    res.writeHead(404, {
        "content-type": "text/html"
    });
    res.end('Page not found');
});

server.listen(3000, () => console.log('Server has been started on port 3000'));

