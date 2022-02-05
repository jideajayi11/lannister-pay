import express from 'express';
import 'dotenv/config';
import { env } from 'process';
import cors from 'cors';
import { connectDb } from './models';
import routes from './routes';

const port = env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb().then(async () => {
  app.listen(port, () => console.log(`App listening on port ${port}!`));
}).catch((err) => console.log('error connecting to db', err.message));

app.get('/', (req, res) => {
  res.send('Welcome to Lannister Pay')
});
app.use('/', routes);
app.use('/*', (req, res) => {
  return res.send("Not available");
});
