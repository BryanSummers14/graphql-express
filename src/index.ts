import express from 'express';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import cors from 'cors';
import { db, buzzSchema, buzzTable } from './config';
import _knex from 'knex';

const knex = _knex(db);

const schema = buildSchema(`
  ${buzzSchema}
  type Query {
    hello: String
    buzz: [Buzz]
    buzzer(id: Int): Buzz
  }
  type Mutation {
    updateBuzzContact(id: Int, contact1: Int): Buzz
  }
`);

const root = {
  // Query
  hello: () => 'Hello world!',
  buzz: async () => await knex.select().from(buzzTable),
  buzzer: async ({ id }: { id: number }) => (await knex.select().from(buzzTable).where('id', id))[0],
  // Mutation
  updateBuzzContact: async ({id, contact1 }: { id: number, contact1: number }) => {
    await knex(buzzTable).where('id', id).update({ contact1 });
    return (await knex.select().from(buzzTable).where('id', id))[0];
  }
};

const app = express();
app.use(cors());
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);