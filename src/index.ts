import { Hono } from 'hono';
import { Env } from './env';

const app = new Hono<{ Bindings: Env }>()

app.get('*', async (c) => {
  return c.text('Hello, world!');
})

export default app
