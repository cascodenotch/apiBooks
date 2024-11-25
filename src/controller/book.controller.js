const {pool} = require("../database")

async function getAllBooks(request, response){

    let respuesta;
    
    try{
    
        const sql = `SELECT * FROM book`;
        const [result] = await pool.query(sql);
        console.info("Consulta exitosa", { sql, result });

        respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Acceso a libros exitoso',
            data: result
        };

    }
    catch (error) {
        console.log(error);
        respuesta = {
            error: true,
            codigo: 500,
            mensaje: 'Error interno al obtener libros'
        };
    }
    
    response.send(respuesta);   
}

async function getBooksByUser (request, response) {

    let respuesta;

    try {
    
        const sql = `SELECT * FROM book
        WHERE Id_user = ?`;
        const param = request.param.Id_user;
        const [result] = await pool.query(sql);
        console.info("Consulta exitosa", { sql, param, result });

        respuesta = {
            error: false,
            codigo: 200,
            mensaje: 'Acceso a libros de usuario exitoso',
            data: result
        };
        
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

module.exports = {getAllBooks, getBooksByUser};