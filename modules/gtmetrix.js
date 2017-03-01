var FS = require('fs');
var URL = require('url');
var PATH = require('path');
var EXEC = require('child_process').exec;
var mkdirp = require('mkdirp');
var cheerio = require('cheerio');
var GTMETRIX_DOMAIN = "https://gtmetrix.com";

F.GTLOG = function (id, msg) {
    const timespan = new Date().getTime();
    const log = {id: id, log_id: timespan, msg: msg};
    //console.log(log);
    NOSQL('gtmetrix').insert(log);
};

F.gtmetrix_fetch_images = function (id, url, has, callback) {
    F.GTLOG(id, 'PARSING:{0}'.format(url));
    var TOTAL_DOWNLOAD = 0;
    U.request(url, ['get'], function (err, data) {
        if (err) {
            F.GTLOG(id, "DOWNLOAD ERROR:");
        }
        var $ = cheerio.load(data);
        var download_arr = [];
        $('#pagespeed table > tbody > tr.rules-details').each(function () {
            if ($(this).text().contains('Optimize the following images')) {
                var $div = $(this).find('div').eq(1);
                $div.find('ul > li').each(function (i, item) {
                    var $li = $(item);
                    var old_img = $li.find("a").eq(0).attr("href");
                    if (old_img.contains(has)) {
                        var new_img = GTMETRIX_DOMAIN + $li.find("a").eq(1).attr("href");
                        var filename = CONFIG('download-dir') + '/{0}/'.format(id) + URL.parse(old_img).pathname;
                        var dir = PATH.dirname(filename);
                        mkdirp.sync(F.path.public(dir));
                        download_arr.push(function (next) {
                            U.download(new_img, ['get'], function (err, response) {
                                F.GTLOG(id, "DOWNLOAD:{0}/{1}:{2}".format(TOTAL_DOWNLOAD - download_arr.length, TOTAL_DOWNLOAD, new_img));
                                response.pipe(FS.createWriteStream(F.path.public(filename)));
                                next();
                            });
                        });
                    }
                });
                return false;
            }
        });
        // download
        if (download_arr.length > 1) {
            TOTAL_DOWNLOAD = download_arr.length;
            download_arr.async(function () {
                F.GTLOG(id, "DOWNLOAD ALL IMAGES COMPLETE");
                OPERATION('compress', { path: F.path.public('/{0}/{1}'.format(CONFIG('download-dir'), id)), filename: F.path.public('/{0}/{1}.zip'.format(CONFIG('download-dir'), id))}, function(err, filename) {
                    F.GTLOG(id, 'Download URL: ' + CONFIG('base-url') + '/{0}/{1}.zip'.format(CONFIG('download-dir'), id));
                    U.rmdirAll(F.path.public('/{0}/{1}'.format(CONFIG('download-dir'), id)));
                });
            });
        } else {
            F.GTLOG(id, "No images found");
        }
    });
};

U.rmdirAll = function (dir, callback) {
    EXEC('rm -r ' + dir, function (err, stdout, stderr) {
        callback && callback(err, stdout);
    });
};


