const fs = require('fs');
var express = require('express');
var app = express();
const phantom = require('phantom');

const imgname = 'cache.png';

app.get('/', async function (req, res) {
  console.log(req.query);
  if (!req.query.url) {
    const imgname = 'error.png';
    res.sendFile(__dirname + '/' + imgname);
    return
  }
  const url = addhttp(req.query.url);
  const instance = await phantom.create();
  const page = await instance.createPage();
  page.property('viewportSize', {width: 1920, height: 1080});
  page.property('clipRect',{ top: 0, left: 0, width: 1920, height: 1080 });
  page.setting('userAgent', 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0');
  await page.on("onResourceRequested", function(requestData) {
      console.info('Requesting', requestData.url)
  });
  const status = await page.open(url);
  if (status == "fail") {
    const imgname = 'error.png';
    res.sendFile(__dirname + '/' + imgname);
    return
  }

  page.render(imgname);

  await instance.exit();
  res.sendFile(__dirname + '/' + imgname);

  //fs.unlink(imgname, (err) => {
  //  if (err) {
  //    console.error(err)
  //  }
  //});

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});



function addhttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}
