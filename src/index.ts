import { Hono } from "hono";

import { handle } from "hono/aws-lambda";

import { poweredBy } from "hono/powered-by";

import { cors } from "hono/cors";

import { prettyJSON } from "hono/pretty-json";

import { compress } from "hono/compress";

const app = new Hono();

import assignmentCommentsRouter from "./routes/assignmentCommentsRouter";

app.use('*', poweredBy(), cors(), prettyJSON(), compress());

app.get('/', (c: any) => {

    return c.json({error: false, data: 'home'})
});

app.get('/api', (c: any) => {

    return c.json({error: false, data: 'home api'})
});


app.get('/api/v1', (c: any) => {

    return c.json({error: false, data: 'home api v1'})
});


app.route('/api/v1', assignmentCommentsRouter);

app.notFound((c) => c.json({ error: true, data: 'Route not found!' }, 404));

app.onError((err, c) => {

  if (err.name == 'NotFound') return c.json({ error: true, data: 'Not found!' }, 404);

  return c.json({ error: true, data: err }, 500);

});

export const handler = handle(app)
