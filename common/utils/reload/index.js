let fn;
if (process.env.DISCUZ_ENV === 'web') {
    fn = require('./web');
} else {
    fn = require('./mini');
}

export default function() {
    fn();
}