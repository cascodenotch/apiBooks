const {pool} = require("../database")

async function addBook (request, response){

    let respuesta; 
    
    try {

        const sql = `INSERT INTO book (title, type, author, price, photo, Id_user) 
        VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
        request.body.title,
        request.body.type,
        request.body.author,
        request.body.price,
        request.body.photo,
        request.body.Id_user,
        ];

        const [result] = await pool.query(sql, values);
        console.info("Consulta exitosa en añadir libro:", { sql, values, result });

        respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Libro añadido con éxito',
            data: result
        };
    }
        
    catch (error) {
        console.log(error);
        respuesta = {
            error: true,
            codigo: 500,
            mensaje: 'Error interno añadir libro'
        };
    }

    response.send (respuesta);
}

async function updateBook (request, response){
    let respuesta;

    try {

        let bookId = request.body.Id_book;

        const sqlCheck = `SELECT * FROM book WHERE Id_book = ?`;
        const [checkResult] = await pool.query(sqlCheck, [bookId]);
        
        if (checkResult.length == 0) {
            respuesta = { 
                error: true, 
                codigo: 404, 
                mensaje: 'No existe un libro con ese Id'};
        } 

        else {
          
            const sql = `UPDATE book 
            SET 
                title = COALESCE(?, title), 
                type = COALESCE(?, type), 
                author = COALESCE(?, author), 
                price = COALESCE(?, price),
                photo = COALESCE(?, photo)
            WHERE 
                Id_book = ?`;
            const values = [
                request.body.title || null,
                request.body.type || null,
                request.body.author || null,
                request.body.price || null,
                request.body.photo || null,
                request.body.Id_book
            ];

            const [result] = await pool.query(sql, values);
            console.info("Consulta exitosa en update:", { sql, values, result });

            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Libro modificado con éxito',
                data: result
            };

        } 

    } catch (error) {
        console.log(error);
        respuesta = {
            error: true,
            codigo: 500,
            mensaje: 'Error interno modificar libro'
        };
    }

    response.send(respuesta);
}

async function deleteBook(request, response){
    
    let respuesta;
    
        try {
            const bookId = request.body.Id_book;

            const sql = `DELETE FROM book WHERE Id_book = ?`;
            const [result] = await pool.query(sql, [bookId]);
            console.info("Consulta exitosa en delete:", { sql, bookId, result });
    
            if (result.affectedRows > 0) {
                respuesta = {
                    error: false,
                    codigo: 200,
                    mensaje: 'Libro eliminado con éxito',
                };
            } else {
                respuesta = {
                    error: true,
                    codigo: 404,
                    mensaje: 'No existe un libro con ese Id para borrar'
                };
            }
        } catch (error) {
            console.log(error);
            respuesta = {
                error: true,
                codigo: 500,
                mensaje: 'Error interno al eliminar el libro'
            };
        }
   
    response.send(respuesta);
}

async function getBooksByUser (request, response) {

    let respuesta;

    try {
    
        const sql = `SELECT * FROM book
        WHERE Id_user = ?`;
        const param = request.params.Id_user;
        const [result] = await pool.query(sql, [param]);
        console.info("Consulta exitosa getBooksByUser", { sql, param, result });

        if (result.length === 0) {
            respuesta = {
                error: true,
                codigo: 404,
                mensaje: 'No se encontraron libros para este usuario'
            };
        }
        
        else {
            respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Acceso a libros exitoso',
            data: result
            };
        }

    } catch (error) {
        console.log(error);
        respuesta = {
            error: true,
            codigo: 500,
            mensaje: 'Error interno al obtener libros'
        };
        }

    response.send(respuesta);
}

async function getBooksByUserAndId(request, response) {
    let respuesta;

    try {
       
        const sql = `SELECT * FROM book
        WHERE Id_book = ? AND Id_user = ?`;
        const params = [request.query.Id_book, request.query.Id_user];
        const [result] = await pool.query(sql, params);
        console.info("Consulta exitosa", { sql, params, result });

        if (result.length === 0) {
            respuesta = {
                error: true,
                codigo: 404,
                mensaje: 'No se encontró el libro para este usuario'
            };
        } else {
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Acceso a libro exitoso',
                data: result[0]
            };
        }

    } catch (error) {
        console.log(error);
        respuesta = {
            error: true,
            codigo: 500,
            mensaje: 'Error interno obtener libro'
        };
    }

    response.send(respuesta);
}


module.exports = {addBook, updateBook, deleteBook, getBooksByUser, getBooksByUserAndId};