// src/index.js
import express from 'express';
import morgan from 'morgan';
import router from './routes.js';

const app = express();
const PORT = 3000;

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use(router);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
