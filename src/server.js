//|-----------------------------------------------------------------------------
//|            This source code is provided under the Apache 2.0 license      --
//|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
//|                See the project's LICENSE.md for details.                  --
//|           Copyright (C) 2017-2025 LSEG. All rights reserved.              --
//|-----------------------------------------------------------------------------

const path = require('path')
const express = require('express')
const httpProxy = require('http-proxy'); //Import the HTTP-Proxy module

require('dotenv').config()

const app = express()
const port = process.env.PORT || 8080 //Support both local environment and deployed location


const publicDirectoryPath = path.join(__dirname, '../public')
app.set('x-powered-by' , 'Express.js')
// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

//Use this options for creating a reverse proxy to other domains.
const options = {
    changeOrigin: true,
    target: {
        https: true
    }
}
//Create a reverse proxy server
const apiProxy = httpProxy.createProxyServer(options);

const rdpServer = process.env.RDP_BASE_URL || 'https://api.refinitiv.com'
const rdpAuthVersion = process.env.RDP_AUTH_VERSION || 'v1'
const rdpEsgVersion = process.env.RDP_ESG_VERSION || 'v2'
const rdpNewsVersion = process.env.RDP_NEWS_VERSION || 'v1'
const rdpSymbologyVersion = process.env.RDP_SYMBOLOGY_VERSION || 'v1'

//For the RDP Authentication service
app.post(`/auth/oauth2/${rdpAuthVersion}/:endpoint`, (req, res) => {
    console.log(`redirecting to RDP ${req.url}`)
    apiProxy.web(req, res, {target: rdpServer})
});

//For the RDP Symbology service 
app.post(`/discovery/symbology/${rdpSymbologyVersion}/lookup`, (req, res) => {
    console.log(`redirecting to RDP ${req.url}`)
    apiProxy.web(req, res, {target: rdpServer})
})

//For the RDP ESG service 
app.get(`/data/environmental-social-governance/${rdpEsgVersion}/views/:endpoint`, (req, res) => {
    console.log(`redirecting to RDP ${req.url}`)
    apiProxy.web(req, res, {target: rdpServer})
})

//For the RDP News service 
app.get(`/data/news/${rdpNewsVersion}/headlines/`, (req, res) => {
    console.log(`redirecting to RDP ${req.url}`)
    apiProxy.web(req, res, {target: rdpServer})
})

process.on('SIGINT', function() {
    process.exit();
});

//Start the server
app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})