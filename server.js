//|-----------------------------------------------------------------------------
//|            This source code is provided under the Apache 2.0 license      --
//|  and is provided AS IS with no warranty or guarantee of fit for purpose.  --
//|                See the project's LICENSE.md for details.                  --
//|           Copyright (C) 2017-2022 Refinitiv. All rights reserved.         --
//|-----------------------------------------------------------------------------

const path = require('path')
const express = require('express')
const httpProxy = require('http-proxy');

require('dotenv').config()

const app = express()
const port = process.env.PORT || 8080 //Support both local environment and deployed location


const publicDirectoryPath = path.join(__dirname, './public')
app.set('x-powered-by' , 'Express.js')
// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

const options = {
    changeOrigin: true,
    target: {
        https: true
    }
}
const apiProxy = httpProxy.createProxyServer(options);
const rdpServer = process.env.RDP_BASE_URL


app.post(`/auth/oauth2/${process.env.RDP_AUTH_VERSION}/*`, function(req, res) {
    console.log(`redirecting to RDP ${req.url}`)
    apiProxy.web(req, res, {target: rdpServer})
});


app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})