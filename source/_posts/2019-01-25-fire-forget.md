---
extends: _layouts.post
title: Fire and Forget HTTP Requests in PHP
slug: fire-and-forget-http-requests-in-php
author: Chris White
date: 2019-01-25
section: content
---

I came across an interesting problem recently while improving the [Loglia Laravel client](https://github.com/loglia/laravel-client). This client is what sends your Laravel application logs to Loglia. It does this by making a HTTP request to the log ingestion endpoint for the service.

The problem is that it’s common for applications to log many times during the request lifecycle, or perhaps even thousands of times in a queue job that does batch processing. All of these HTTP calls end up adding a lot of seconds to the request, slowing down page loads.

It would be ideal if we could fire off the HTTP request and continue processing the script without waiting for the response. Unfortunately PHP doesn’t have a convenient way to do this. None of the options that you can pass into the cURL extension allow PHP to continue processing before a response is returned. [Guzzle](https://github.com/guzzle/guzzle) does have the concept of async requests but they don’t work the way you might think. They do still wait for a response to be returned before continuing execution, but they do allow you to have multiple requests in-flight at once. [See this issue for more info](https://github.com/guzzle/guzzle/issues/1429#issuecomment-197152914).

Eventually I stumbled upon a similar solution that uses sockets to send data to a remote server over UDP, but managed to use the same concept for a HTTP request over a TCP connection. Example below:

```php
$endpoint = 'https://logs.loglia.app';
$postData = '{"foo": "bar"}';

$endpointParts = parse_url($endpoint);
$endpointParts['path'] = $endpointParts['path'] ?? '/';
$endpointParts['port'] = $endpointParts['port'] ?? $endpointParts['scheme'] === 'https' ? 443 : 80;

$contentLength = strlen($postData);

$request = "POST {$endpointParts['path']} HTTP/1.1\r\n";
$request .= "Host: {$endpointParts['host']}\r\n";
$request .= "User-Agent: Loglia Laravel Client v2.2.0\r\n";
$request .= "Authorization: Bearer api_key\r\n";
$request .= "Content-Length: {$contentLength}\r\n";
$request .= "Content-Type: application/json\r\n\r\n";
$request .= $postData;

$prefix = substr($endpoint, 0, 8) === 'https://' ? 'tls://' : '';

$socket = fsockopen($prefix.$endpointParts['host'], $endpointParts['port']);
fwrite($socket, $request);
fclose($socket);
```

This will send the JSON payload defined in the `$postData` variable to the endpoint specified in `$endpoint`. It also figures out the correct socket prefix, path, and port to use based on the endpoint given. As you can see, it just writes the HTTP request to the socket and then closes it and carries on.

Hand-crafting HTTP requests seemed like an unreliable method at first, but after some pretty extensive testing I can vouch for it reliably sending the requests and the remote server receiving them in full. It can be tricky to craft the request properly (respecting the line feeds that the HTTP specification expects, etc), but that’s why you have tests, right? 🙂

If you’re interested in benchmarks, I did a quick test between this method and using Guzzle to send 50 HTTP requests. Turns out to be almost a 75% decrease!

Guzzle 6 | Sockets
:---: | :---:
16.49 seconds | 4.28 seconds

You might be expecting it to be faster – but keep in mind that PHP still has to establish the TCP connection and negotiate the TLS handshake before it can send the request. But at least you cut out the time it takes for the remote server to prepare and send its response. The end-all solution might be to run a UDP server and send the data down a UDP socket.

