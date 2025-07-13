import pool from './database.js';

// GET /libros
export async function obtenerLibros(req, res) {
  try {
    const [result] = await pool.query('SELECT * FROM libros');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los libros' });
  }
}

// GET /libros/:id
export async function obtenerLibro(req, res) {
  const { id } = req.params;
  try {
    const [result] = await pool.query('SELECT * FROM libros WHERE id = ?', [id]);
    if (result.length === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el libro' });
  }
}

// POST /libros
export async function crearLibro(req, res) {
  const { titulo, autor, anio, isbn } = req.body;
  if (!titulo || !autor || !anio || !isbn) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO libros (titulo, autor, anio, isbn) VALUES (?, ?, ?, ?)',
      [titulo, autor, anio, isbn]
    );
    res.status(201).json({ id: result.insertId, titulo, autor, anio, isbn });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el libro' });
  }
}

// PUT /libros/:id
export async function actualizarLibro(req, res) {
  const { id } = req.params;
  const { titulo, autor, anio, isbn } = req.body;
  if (!titulo || !autor || !anio || !isbn) {
    return res.status(400).json({ error: 'Faltan campos para actualizar' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE libros SET titulo = ?, autor = ?, anio = ?, isbn = ? WHERE id = ?',
      [titulo, autor, anio, isbn, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json({ id, titulo, autor, anio, isbn });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el libro' });
  }
}

// DELETE /libros/:isbn
export async function eliminarLibro(req, res) {
  let { isbn } = req.params;
  isbn = isbn.replace(/-/g, ''); // quita guiones
  
  try {
    const [result] = await pool.query('DELETE FROM libros WHERE isbn = ?', [isbn]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json({ mensaje: 'Libro eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el libro' });
  }
}


