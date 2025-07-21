import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { HEADERS, HEADER_VALUES } from '@/shared/constants/headers';

const app = express();

const STATIC_DIR = path.join(__dirname, '../static');

dotenv.config();

app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void => {
    if (req.originalUrl.split('/').includes('webhook')) {
      next();
    } else {
      express.json()(req, res, next);
    }
  },
);

app.use('/static', express.static(STATIC_DIR));

app.use(express.urlencoded({ extended: true }) as express.RequestHandler);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header(
      HEADERS.ACCESS_CONTROL_ALLOW_ORIGIN,
      HEADER_VALUES.LOCALHOST_3000,
    ); // dev only
    res.header(
      HEADERS.ACCESS_CONTROL_ALLOW_METHODS,
      HEADER_VALUES.ALLOWED_METHODS,
    );
    res.header(
      HEADERS.ACCESS_CONTROL_ALLOW_HEADERS,
      HEADER_VALUES.ALLOWED_HEADERS,
    );
    res.header(
      HEADERS.ACCESS_CONTROL_ALLOW_CREDENTIALS,
      HEADER_VALUES.ALLOW_CREDENTIALS,
    );
    if (req.method === 'OPTIONS') {
      res.status(200).send();
    } else {
      next();
    }
  },
);

export default app;
