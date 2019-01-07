'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const { db, buzzSchema, buzzTable } = require('../config.js');
const knex = require('knex')(db);

const schema = buildSchema(`
  ${buzzSchema}
  type Query {
    hello: String
    buzz: [Buzz]
    buzzer(id: Int): Buzz
  }
`);

const root = {
  hello: () => 'Hello world!',
  buzz: async () => await knex.select().from(buzzTable),
  buzzer: async ({id}) => (await knex.select().from(buzzTable).where('id', id))[0]
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);