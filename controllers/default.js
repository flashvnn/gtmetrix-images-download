exports.install = function () {
    F.route('/', view_index);
    F.route('/api/fetch', api_fetch, ['post']);
    F.route('/api/logs/{fetch_id}/{log_id}', api_log);
};

function view_index() {
    var self = this;
    self.view('index');
}

function api_fetch() {
    var self = this;
    var fetch_id = new Date().getTime();
    F.gtmetrix_fetch_images(fetch_id, self.body.url, self.body.contain, function () {

    });
    self.json(SUCCESS(true, fetch_id));
}

function api_log(fetch_id, log_id) {
    var self = this;
    var nosql = NOSQL('gtmetrix');
    nosql.find().make(function(builder) {
        builder.where('id', parseInt(fetch_id));
        builder.where('log_id','>', parseInt(log_id));
        builder.callback(function(err, response) {
            self.json(SUCCESS(true, response));
        });
    });
}
