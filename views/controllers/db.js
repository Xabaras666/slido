const pg = require('pg');

var config = {
    user: 'wxhasshm',
    database: 'wxhasshm',
    password: 'nwt6lHuOz-7Te63to6-pa_USyh5Lxlu8',
    host: 'mouse.db.elephantsql.com',
    port: 5432,
    max: 100,
    idleTimeoutMillis: 3000,
}

var pool = new pg.Pool(config);

