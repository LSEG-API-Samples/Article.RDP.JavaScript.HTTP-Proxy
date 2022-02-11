# How to set up HTTP Proxy for the Refinitiv Data Platform APIs on web browser with Express.js
- Last update: February 2022
- Environment: Windows 
- Compiler: Node.js
- Prerequisite: Refinitiv Data Platform credentials.

Example Code Disclaimer:
ALL EXAMPLE CODE IS PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS FOR ILLUSTRATIVE PURPOSES ONLY. REFINITIV MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF EXAMPLE CODE, OR THE INFORMATION, CONTENT OR MATERIALS USED IN CONNECTION WITH EXAMPLE CODE. YOU EXPRESSLY AGREE THAT YOUR USE OF EXAMPLE CODE IS AT YOUR SOLE RISK

## <a id="overview"></a>Overview

The [Refinitiv Data Platform (RDP) APIs](https://developers.refinitiv.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis) provide various Refinitiv data and content for developers via easy-to-use Web-based API. The developers which are data scientists, financial coder, or traders can use any programming languages that support HTTP request-response and JSON messages to retrieve content from the RDP in a straightforward way on any platform.

However, if you are a web developer, your JavaScript application cannot connect to the RDP directly because of the [***Same-origin***](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) policy. All web browsers enforce this policy to prevent browsers access different domain/server resources. And of cause, your web server/web application domain is always different from the RDP because they are hosted on different sites. 

This example project shows how to use a reverse proxy to make the JavaScript on a web browser can connect and consume data from the RDP endpoints. It utilizes  
the [http-proxy](https://www.npmjs.com/package/http-proxy) module and [Express.js](https://expressjs.com/) web framework for the webserver and reverse proxy functionalities. 

**Note**:
Please be informed that this article and example projects aim for Development and POC purposes only. This kind of reverse proxy implementation is not recommended for Production use. You may use the de-facto server like [Nginx](https://www.nginx.com/) for the reverse proxy in your environment. Alternatively, you may use [the RDP Implicit Grant](https://developers.refinitiv.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis/tutorials#authorization-for-browser-based-applications).

## <a id="cross_domain"></a>Why we need a Reverse Proxy?

Let's get back to the first question, why the web browsers cannot connect to the RDP APIs directly? Typically, the web browsers *do not allow* your JavaScript code to calls a 3rd party Web API that locates on a different server (cross-domain request). Browsers allow only the HTTP response has a Control-Allow-Origin ([Cross-Origin Resource Sharing - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)) header with a * value or your client's domain. Please see the following scenario as an example.

![figure-1](images/01_error_cors.png "Cross-domain error1")

The above scenario is the browser opens the file from a local file ```file:///C:/drive_d/Project/Code/RDP_HTTP_PROXY/public/index.html``` location.
1. It means the domain of this web is on a local machine (```file:///C```).
2. JavaScript application sends the authentication request message to the RDP Authentication service at  ```https://api.refinitiv.com``` URL which is on a different domain.  
3. The browser blocks the request and throws an error message about CORS (Cross-Origin Resource Sharing). 
4. JavaScript gets an error message, not the RDP Tokens, so it cannot continue requesting data with other RDP endpoints.

This browser's behavior can be illustrated with the following diagram.

![figure-2](images/02_domains_1.png "Cross-domain error2")

The 3rd Party Web APIs do not need to be the RDP specifically, it can be your microservice that is hosted on a different domain too. So, how can we handle this? You can build the API Gateway as a reverse proxy to redirect traffic to the different services according to the URL of the request.

![figure-2](images/03_domains_2.png "API Gateway Reverse Proxy")

**As of February 2022**:
Some RDP services like the Environmental - Social - and Governance (ESG), News, Symbology, etc support the cross-domain Control-Allow-Origin. You can call them directly from the web browsers (if you already have the access token). However, I am going to apply those calls with the proxy for easy management and prevent any future changes.

You can use other libraries/tools to do proxy work for you like this [Refinitiv-API-Samples/Example.RDPAPI.TypeScript.AngularESGWebapp](https://github.com/Refinitiv-API-Samples/Example.RDPAPI.TypeScript.AngularESGWebapp) project that uses [Angular](https://angular.io/) platform as a proxy on the client-side. 

**Note**:
Let me remind you again, this proxy implementation aims for Development and POC purposes only. It is not recommended for Production use. You may use the de-facto server like [Nginx](https://www.nginx.com/) for the reverse proxy in your environment. Alternatively, you may use [the RDP Implicit Grant](https://developers.refinitiv.com/en/api-catalog/refinitiv-data-platform/refinitiv-data-platform-apis/tutorials#authorization-for-browser-based-applications).

## <a id="expressjs-proxy"></a>Express.js with HTTP-Proxy

Let's start by setting the HTTP-Proxy in the Express.js application. The application file is ```server.js``` that serves as both static web-server and reverse proxy.

```
```
