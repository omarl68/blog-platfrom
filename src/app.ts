import express, { Express } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './docs/config';
import routes from './routes';
import notFound from './core/middleware/notFound';
import errors from './core/middleware/errors';

dotenv.config();

const app: Express = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(xss());
app.use(hpp());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api', routes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(notFound);
app.use(errors);

export default app;
