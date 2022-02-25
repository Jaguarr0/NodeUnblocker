var url = require('url');
var querystring = require('querystring');
var express = require('express');
var unblocker = require('unblocker');
var Transform = require('stream').Transform;

var app = express();

var google_analytics_id = process.env.GA_ID || null;

function addGa(html) {
      if (google_analytics_id) {
var ga = [
  "<script async src='https://www.googletagmanager.com/gtag/js?id=UA-139761472-1'></script>",
"<script>",
  "window.dataLayer = window.dataLayer || [];",
  "function gtag(){dataLayer.push(arguments);}",
  "gtag('js', new Date());",
  "gtag('config', 'UA-139761472-1');",
"</script>"
            ].join("\n");
        html = html.replace("</body>", ga + "\n\n</body>");
    }
    return html;
}

function googleAnalyticsMiddleware(data) {
    if (data.contentType == 'text/html') {

        // https://nodejs.org/api/stream.html#stream_transform
        data.stream = data.stream.pipe(new Transform({
            decodeStrings: false,
            transform: function(chunk, encoding, next) {
                this.push(addGa(chunk.toString()));
                next();
            }
        }));
    }
}

var unblockerConfig = {
    prefix: '/suibndiuvhdifuhvisduhvisduvhisduhvisduhvi/',
    responseMiddleware: [
        googleAnalyticsMiddleware
    ]
};




app.use(unblocker(unblockerConfig));


app.use('/', express.static(__dirname + '/public'));


app.get("/no-js", function(req, res) {
    
    var site = querystring.parse(url.parse(req.url).query).url;
    
    res.redirect(unblockerConfig.prefix + site);
});


module.exports = app;
