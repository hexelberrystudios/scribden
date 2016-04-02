exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('threads', function (table) {
            table.integer('createdBy').unsigned().notNullable().references('id').inTable('users'); // user id
        }),
        
        knex.schema.table('trackedThreads', function (table) {
            table.integer('threadId').unsigned().notNullable().references('id').inTable('threads');
            table.integer('userId').unsigned().notNullable().references('id').inTable('users');
            table.primary(['threadId', 'userId']); // prevent a user from tracking the same thread multiple times
        }),
        
        knex.schema.table('posts', function (table) {
            table.integer('userId').unsigned().notNullable().references('id').inTable('users');
            table.integer('threadId').unsigned().notNullable().references('id').inTable('threads');
        }),
        
        knex.schema.table('reports', function (table) {
            table.integer('reporterId').unsigned().notNullable().references('id').inTable('users');
            table.integer('postId').unsigned().notNullable().references('id').inTable('posts');
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