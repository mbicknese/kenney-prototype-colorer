const http = require('http');
const readFile = require('util').promisify(require('fs').readFile);
const path = require('path');

const port = 8080;
const host = '127.0.0.1'

http.createServer(async (request, response) => {
    console.log('request ', request.url);

    let filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    try {
        const content = await readFile(filePath, 'utf-8')
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            response.writeHead(404, { 'Content-Type': 'text/html' });
            response.end('File not found', 'utf-8');
        }
        else {
            response.writeHead(500);
            response.end(`Sorry, check with the site admin for error: ${error.code}..\n`);
        }
    }
}).listen(port, host);
console.log(`Server running at http://${host}:${port}/`);

// Courtesy of https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
