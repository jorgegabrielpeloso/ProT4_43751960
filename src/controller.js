const db = require('./database');

// GET: Obtener todos los libros
const getLibros = (req, res) => {
  const sql = 'SELECT * FROM libros';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error en getLibros:', err.message);
      res.status(500).json({ error: 'Error al obtener los libros', detalle: err.message });
    } else {
      res.json(result);
    }
  });
};

// GET: Obtener un libro por ID
const getLibroById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM libros WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error en getLibroById:', err.message);
      res.status(500).json({ error: 'Error al obtener el libro', detalle: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ error: 'Libro no encontrado' });
    } else {
      res.json(result[0]);
    }
  });
};

// POST: Crear un nuevo libro
// POST /libros - Crear libro
const createLibro = async (req, res) => {
  const { titulo, autor, anio, isbn } = req.body;

  // VALIDACIÓN DE CAMPOS INVÁLIDOS
  const camposPermitidos = ["titulo", "autor", "anio", "isbn"];
  const camposEnviados = Object.keys(req.body);
  const camposInvalidos = camposEnviados.filter(campo => !camposPermitidos.includes(campo));

  if (camposInvalidos.length > 0) {
    return res.status(400).json({
      error: `Campos inválidos detectados: ${camposInvalidos.join(", ")}`
    });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO libros (titulo, autor, anio, isbn) VALUES (?, ?, ?, ?)",
      [titulo, autor, anio, isbn]
    );

    const libroNuevo = {
      id: result.insertId,
      titulo,
      autor,
      anio,
      isbn
    };

    res.status(201).json(libroNuevo);
  } catch (error) {
    console.error("Error al crear el libro:", error);
    res.status(500).json({ error: "Error al crear el libro - Detalle: " + error.message });
  }
};


// PUT: Actualizar un libro por ID
const updateLibro = (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, anio, isbn, precio, stock } = req.body;

    const sql = 'UPDATE libros SET titulo = ?, autor = ?, anio = ?, isbn = ?, precio = ?, stock = ? WHERE id = ?';
    db.query(sql, [titulo, autor, anio, isbn, precio, stock, id], (err, result) => {
      if (err) {
        console.error('Error en updateLibro:', err.message);
        return res.status(500).json({ error: 'Error al actualizar el libro', detalle: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }

      res.json({ id, titulo, autor, anio, isbn, precio, stock });
    });
  } catch (error) {
    console.error('Excepción en updateLibro:', error.message);
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
};

// DELETE: Eliminar un libro por ISBN (sin guiones)
const deleteLibroByIsbn = (req, res) => {
  try {
    let { isbn } = req.params;
    isbn = isbn.replace(/-/g, ''); // quitar guiones
    const sql = 'DELETE FROM libros WHERE REPLACE(isbn, "-", "") = ?';

    db.query(sql, [isbn], (err, result) => {
      if (err) {
        console.error('Error en deleteLibroByIsbn:', err.message);
        return res.status(500).json({ error: 'Error al eliminar el libro', detalle: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }

      res.json({ mensaje: 'Libro eliminado correctamente' });
    });
  } catch (error) {
    console.error('Excepción en deleteLibroByIsbn:', error.message);
    res.status(500).json({ error: 'Error inesperado', detalle: error.message });
  }
};

module.exports = {
  getLibros,
  getLibroById,
  createLibro,
  updateLibro,
  deleteLibroByIsbn
};
