// src/controller.js
import pool from './database.js';

// GET todos los libros
const obtenerLibros = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM libros');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libros', detalle: err.message });
  }
};

// GET un libro por ID
const obtenerLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM libros WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener libro', detalle: err.message });
  }
};

// POST - Crear libro
const crearLibro = async (req, res) => {
  try {
    const datos = req.body;
    const camposPermitidos = ['nombre', 'autor', 'categoria', 'año-publicacion', 'isbn'];
    const camposInvalidos = Object.keys(datos).filter(c => !camposPermitidos.includes(c));

    if (camposInvalidos.length > 0) {
      return res.status(400).json({
        error: `Campos inválidos detectados: ${camposInvalidos.join(', ')}`
      });
    }

    const { nombre, autor, categoria, isbn } = datos;
    const anioPublicacion = datos["año-publicacion"];

    if (!nombre || !autor || !categoria || !anioPublicacion || !isbn) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const [result] = await pool.query(
      'INSERT INTO libros (nombre, autor, categoria, `año-publicacion`, isbn) VALUES (?, ?, ?, ?, ?)',
      [nombre, autor, categoria, anioPublicacion, isbn]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      autor,
      categoria,
      "año-publicacion": anioPublicacion,
      isbn
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear libro', detalle: err.message });
  }
};

// PUT - Actualizar libro
export async function updateLibro(req, res) {
  try {
    const id = req.params.id;
    const datos = req.body;

    const camposValidos = ["nombre", "autor", "categoria", "año-publicacion", "isbn"];
    const camposInvalidos = Object.keys(datos).filter(campo => !camposValidos.includes(campo));

    if (camposInvalidos.length > 0) {
      return res.status(400).json({ error: `Campos inválidos detectados: ${camposInvalidos.join(", ")}` });
    }

    const [result] = await pool.query("SELECT * FROM libros WHERE id = ?", [id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    await pool.query(
      "UPDATE libros SET nombre = ?, autor = ?, categoria = ?, `año-publicacion` = ?, isbn = ? WHERE id = ?",
      [datos.nombre, datos.autor, datos.categoria, datos["año-publicacion"], datos.isbn, id]
    );

    res.json({ id, ...datos });
  } catch (error) {
    console.error("Error al actualizar libro:", error);
    res.status(500).json({ error: "Error al actualizar libro" });
  }
}


// DELETE - Eliminar por ISBN
const eliminarLibro = async (req, res) => {
  try {
    let { isbn } = req.params;
    isbn = isbn.replace(/-/g, '');

    const [result] = await pool.query(
      'DELETE FROM libros WHERE REPLACE(isbn, "-", "") = ?',
      [isbn]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Libro no encontrado para eliminar' });
    }

    res.json({ mensaje: 'Libro eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar libro', detalle: err.message });
  }
};

export {
  obtenerLibros,
  obtenerLibro,
  crearLibro,
  actualizarLibro,
  eliminarLibro
};
