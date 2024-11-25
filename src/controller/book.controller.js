const {pool} = require("../database")

// Anteriores

async function getAllBooks(request, response){

    let respuesta;
    
    try{
    
        const sql = `SELECT * FROM book`;
        const [result] = await pool.query(sql);
        console.info("Consulta exitosa obtener libros", { sql, result });

        respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Obtener libros exitoso',
            data: result
        };

    }
    catch (error) {
        console.log(error);
        respuesta = {
            error: true,
            codigo: 500,
            mensaje: 'Error interno obtener libros'
        };
    }
    
    response.send(respuesta);   

}

async function addBook (request, response){

    let respuesta; 
    
    try {

        let bookId = request.body.Id_book;
        let bookExists = false;  

        let userId = request.body.Id_user;
        let userExists = false;  
      
        const sql1 = `SELECT * FROM book`;
        const [result] = await pool.query(sql1);

        result.forEach(book => {
            if (book.Id_book === bookId) {
                bookExists = true;
            }
        });

        result.forEach(book => {
            if (book.Id_user === userId) {
                userExists = true;
            }
        });

        if (bookExists) {
            respuesta = { 
                error: true, 
                codigo: 400, 
                mensaje: 'Libro ya existe'};
        } 

        if (!userExists){
            respuesta = { 
                error: true, 
                codigo: 404, 
                mensaje: 'No existe el usuario'};
        }

        else{

        const sql = `INSERT INTO book (Id_book, Id_user, title, type, author, price, photo) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [
        request.body.Id_book,
        request.body.Id_user,
        request.body.title,
        request.body.type,
        request.body.author,
        request.body.price,
        request.body.photo
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
        
    } catch (error) {
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
        let bookExists = false;

        let userId = request.body.Id_user;
        let userExists = false;  

        const sql1 = `SELECT * FROM book`;
        const [result] = await pool.query(sql1);

        result.forEach(book => {
            if (book.Id_book === bookId) {
                bookExists = true;
            }
        });

        result.forEach(book => {
            if (book.Id_user === userId) {
                userExists = true;
            }
        });

        if (!bookExists || !userExists ) {
            respuesta = { 
                error: true, 
                codigo: 404, 
                mensaje: 'No existe un libro con ese Id o un usuario con ese Id'};
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
            console.info("Consulta exitosa en register:", { sql, values, result });

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

    const sql1 = `SELECT * FROM book`;
    const [result1] = await pool.query(sql1);
    let arrayBooks = result1;

    try {

        let bookId = request.body.Id_book;
        let arrayFiltrado = result1.filter (book => (book.Id_book != bookId))

        if (arrayBooks.length != arrayFiltrado.length){

            const sql = `DELETE book FROM book
            WHERE Id_book = ?`;
            const values = [request.body.Id_book];

            const [result] = await pool.query(sql, values);
            console.info("Consulta exitosa en delete:", { sql, values, result });

            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Libro eliminado con éxito',
                data: arrayFiltrado
            };

        }

        else{
            respuesta = { 
                error: true, 
                codigo: 404, 
                mensaje: 'No existe un libro con ese Id para borrar'};
        }
        
    } catch (error) {
        console.log(error);
        respuesta = {
            error: true,
            codigo: 500,
            mensaje: 'Error interno eliminar'
        };
    }

    response.send(respuesta);
}

async function getOneBook (request, response){
    let respuesta;

    const sql1 = `SELECT * FROM book`;
    const [result1] = await pool.query(sql1);
    let arrayBooks = result1;

    try {

        let bookId = parseInt(request.params.Id_book);
        let book = arrayBooks.find(book => book.Id_book === bookId);

        if (book){

            const sql = `SELECT * FROM book
            WHERE Id_book = ?`;
            const values = [request.params.Id_book];

            const [result] = await pool.query(sql, values);
            console.info("Consulta exitosa en buscar:", { sql, values, result });

            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Libro encontrado con éxito',
                data: book
            };

        }
        else{
            respuesta = { 
                error: true, 
                codigo: 404, 
                mensaje: 'No existe un libro con ese Id para buscar'};
        }
        
    } catch (error) {
        console.log(error);
        respuesta = {
            error: true,
            codigo: 500,
            mensaje: 'Error interno buscar'
        };
    }

    response.send(respuesta);
}

// Nuevas

async function getBooksByUser (request, response) {

    let respuesta;

    try {
    
        const sql = `SELECT * FROM book
        WHERE Id_user = ?`;
        const param = request.params.Id_user;
        const [result] = await pool.query(sql, [param]);
        console.info("Consulta exitosa", { sql, param, result });

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
                data: result
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


module.exports = {getAllBooks, addBook, updateBook, deleteBook, getOneBook, getBooksByUser, getBooksByUserAndId};