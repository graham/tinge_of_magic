#!/usr/bin/env node

const esbuild = require("esbuild");
const http = require('http');
const fs = require('fs');

const clients = [];

let util = require("./lib/util.js");

;(async () => {
    var argv = require('yargs/yargs')(process.argv.slice(2)).argv;

    console.log(argv);

    let vendor_packages = ['react', 'react-dom', 'react-dom/client'];

    let header = `(() => {
    window.__esbuild_vendors__ = window.__esbuild_vendors__ || {};
    function require(key) { return window.__esbuild_vendors__[key] };
    (() => new EventSource("/esbuild").onmessage = () => location.reload())();`

    let footer = `})();`

    let vendor = `window.__esbuild_vendors__ = window.__esbuild_vendors__ || {};
${vendor_packages.map(key => {
    return `window.__esbuild_vendors__['${key}'] = require('${key}');`
}).join('\n')}
`
    esbuild.build({
        stdin: {
            contents: vendor,
            resolveDir: __dirname
        },
        bundle: true,
        minify: true,
        outfile: 'app/static/compiled/vendor.js',
        logLevel: 'debug',
        sourcemap: true,
        format: 'esm',
    }).catch(() => {
        console.log(e);
    });

    let d = util.loadDirectory({entry: {}}, './app/', '');

    let builder = await esbuild.build({
        logLevel: "debug",
        entryPoints: d.entry,
        banner: { js: header },
        footer: { js: footer },    
        outdir: './app/static/compiled/',
        minify: argv.watch ? false : true,
        bundle: true,
        sourcemap: 'external',
        external: vendor_packages,
        format: 'cjs',
        watch: argv.watch ? {
            onRebuild(error, result) {
                clients.forEach((res) => res.write('data: UPDATE!\n\n'))
                clients.length = 0;
                console.log("Refreshing browsers...");
            },
        } : false,
    }).catch((e) => {
        console.log(e);
    });

    if (argv.server) {
        let proxy_conn = (hostname, port, host_req, host_res) => {
            var options = {
                hostname: hostname,
                port: port,
                path: host_req.url,
                method: host_req.method,
                headers: host_req.headers,
            };

            var proxy = http.request(options, function (pres) {
                host_res.writeHead(pres.statusCode, pres.headers)
                pres.pipe(host_res, {
                    end: true
                });
            });

            host_req.pipe(proxy, {
                end: true
            });
        }

        let server = http.createServer((req, res) => {
            const { url, method, headers } = req
            if (req.url === '/esbuild') {
                return clients.push(
                    res.writeHead(200, {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        Connection: 'keep-alive',
                    })
                )
            }

            let target_url = url;

            if (target_url.startsWith('/api') ||
                target_url.startsWith('/auth') ||
                target_url.startsWith('/admin') ||
                target_url.startsWith('/static/admin')
               ) {
                proxy_conn('127.0.0.1', 8000, req, res);
                return
            }

            if (target_url.endsWith('/')) {
                target_url += 'index.html';
            }


            turl = '.' + target_url.split('?')[0];

            if (fs.existsSync(turl)) {
                res.writeHead(200, {
                    'content-type': 'text/html',
                });
                res.end(fs.readFileSync(turl));
            } else {
                res.writeHead(404, {});
                res.end("File not found...");
            }

        });

        (async () => {
            server.listen(8080, '127.0.0.1')
        })();
    }
})()
