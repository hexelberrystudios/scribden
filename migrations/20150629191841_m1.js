// table.boolean('active'); // set to 0 when entry should be deleted, but not really deleted

exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', function (table) {
            table.increments();
            table.string('username', 15).notNullable();
            table.string('email', 254).notNullable();
            table.string('password', 254).nullable();
            table.boolean('isMod').notNullable().defaultTo(false);
            table.boolean('isAdmin').notNullable().defaultTo(false);
            table.string('status', 32).notNullable().defaultTo('active'); // current standing in the community. ex. banned, suspended, active, etc.
            table.dateTime('restoreDate').nullable(); // if suspended, when does their account get restored
            table.boolean('active').notNullable().defaultTo(true);
            table.timestamps();
        }),
        
        knex.schema.createTable('threads', function (table) {
            table.increments();
            table.string('description', 128).nullable();
            table.string('ruleset', 16).notNullable();
            table.boolean('active').notNullable().defaultTo(true);
            table.timestamps();
        }),
        
        knex.schema.createTable('trackedThreads', function (table) {
            table.boolean('active').notNullable().defaultTo(true);
            table.timestamps();
        }),
        
        knex.schema.createTable('posts', function (table) {
            table.increments();
            table.text('content').notNullable();
            // the original post id from which a thread of replies comes from
            table.integer('replyId').unsigned().nullable();
            table.boolean('active').notNullable().defaultTo(true);
            table.timestamps();
        }),
        
        knex.schema.createTable('reports', function (table) {
            table.increments();
            table.text('complaint').notNullable();
            table.boolean('active').notNullable().defaultTo(true);
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('threads'),
        knex.schema.dropTable('posts'),
        knex.schema.dropTable('replies'),
        knex.schema.dropTable('reports'),
        knex.schema.dropTable('trackedThreads')
    ]);
};