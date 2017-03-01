F.onLocale = function (req) {
    if (req.query.language === 'vn')
        return 'vn';
    return 'en';
};
F.merge('js/default.js', 'js/axios.min.js', 'js/vue.min.js', 'js/vee-validate.min.js', 'js/default.js');
const Exec = require('child_process').exec;
const OPTIONS = {};

NEWOPERATION('compress', function(error, value, callback) {

    // value.path
    // value.filename

    var isFile = U.getExtension(value.path) !== '';
    var target = '*';

    if (isFile) {
        target = U.getName(value.path);
        OPTIONS.cwd = value.path.substring(0, value.path.length - target.length);
    } else
        OPTIONS.cwd = value.path;

    // Exclude directory "/tmp/"
    // Exec('zip --exclude=*/tmp/* -r {0} *'.format(value.filename)

    Exec('zip -r {0} {1}'.format(value.filename, target), OPTIONS, function(err, response) {
        err && error.push(err);
        callback(value.filename);
    });
});
