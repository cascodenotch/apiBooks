const {pool} = require("../database")

async function register(request, response) {
    let respuesta;

    try {
        const sql = `INSERT INTO user (name, last_name, email, photo, password) 
                     VALUES (?, ?, ?, ?, ?)`;
        const values = [
            request.body.name,
            request.body.last_name,
            request.body.email,
            request.body.photo,
            request.body.password
        ];

        const [result] = await pool.query(sql, values);
        console.log(result);

        if (result.insertId) {
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Usuario registrado exitosamente',
                data: { id: result.insertId }
            };
        } else {
            respuesta = {
                error: true,
                codigo: 400,
                mensaje: 'No se pudo registrar el usuario'
            };
        }
    } catch (error) {
        console.log(error);
        respuesta = {
            error: true,
            codigo: 500,
            mensaje: 'Error al registrar usuario'
        };
    }

    response.send(respuesta);
}

const login = async (request, response) =>{
        
    let respuesta;
    
        try {
            const email = request.body.email;
            const password = request.body.password;
    
            if (email && password) {
                const sql = `SELECT * FROM user WHERE email=?`;
                const values = [email];
                const [result1] = await pool.query(sql, values);
    
                if (result1.length > 0) {
                    const user = result1[0];
    
                    if (password === user.password) {
                        respuesta = {
                            error: false,
                            codigo: 200,
                            mensaje: 'Inicio de sesión exitoso',
                            data: {
                                name: user.name,
                                last_name: user.last_name,
                                email: user.email,
                                photo: user.photo
                            }
                        };
                    } else {
                        respuesta = {
                            error: true,
                            codigo: 401,
                            mensaje: 'Contraseña incorrecta'
                        };
                    }
                } else {
                    respuesta = {
                        error: true,
                        codigo: 404,
                        mensaje: 'Correo no encontrado'
                    };
                }
            } else {
                respuesta = {
                    error: true,
                    codigo: 400,
                    mensaje: 'Es necesario introducir correo y contraseña'
                };
            }
        } catch (error) {
            console.log(error);
            respuesta = {
                error: true,
                codigo: 500,
                mensaje: 'Error al iniciar sesión'
            };
        }
    
    response.send(respuesta);
}

module.exports = {register, login};