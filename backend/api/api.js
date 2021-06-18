const http = require('http')
const exec = require("child_process").exec

const hostname = '127.0.0.1'
const port = 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Request-Method', '*')
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
	res.setHeader('Access-Control-Allow-Headers', '*')

    if(req.url === "/") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain')
        res.end('Hello World')
    }
    if(req.url === "/atp-rankings") {
        exec("./scripts/atp_rankings", (err, stdout, stderr) => {
            if(err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain')
                console.log(err)
                res.end("Sorry there is an issue at our side.")
            }
            if(stdout) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json')
                res.end(stdout)
            }
        })
    }
    if(req.url === "/stubs/atp-rankings") {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        const response = require("./stubs/rankings.json")
        res.end(JSON.stringify(response))
    }
    if(req.method === "POST" && req.url === "/submit-prono") {
        console.log(req.body)
        res.end(req.body)
    }
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
})