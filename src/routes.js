import express from 'express';
import {
  obtenerLibros,
  obtenerLibro,
  crearLibro,
  actualizarLibro,
  eliminarLibro
} from './controller.js';

const router = express.Router();

router.get('/libros', obtenerLibros);
router.get('/libros/:id', obtenerLibro);
router.post('/libros', crearLibro);
router.put('/libros/:id', actualizarLibro);
router.delete('/libros/:isbn', eliminarLibro);

export default router;
