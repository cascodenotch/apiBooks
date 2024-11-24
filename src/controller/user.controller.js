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
                    
                    let user = result1[0];
    
                    if (password === user.password) {
                        respuesta = {
                            error: false,
                            codigo: 200,
                            mensaje: 'Inicio de sesión exitoso',
                            data: {
                                Id_user: user.Id_user,
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

async function edit(request, response) {
    let respuesta;

    if (!request.body.Id_user) {
        response.status(400).send({
            error: true,
            codigo: 400,
            mensaje: "El ID del usuario es obligatorio."
        });
        return;
    }

    try {
        const sql = `
            UPDATE user 
            SET 
                name = COALESCE(?, name), 
                last_name = COALESCE(?, last_name), 
                email = COALESCE(?, email), 
                photo = COALESCE(?, photo)
            WHERE 
                Id_user = ?`;

        const values = [
            request.body.name || null,
            request.body.last_name || null,
            request.body.email || null,
            request.body.photo || null,
            request.body.Id_user
        ];

        console.log("Datos enviados para actualización:", values);

        const [result] = await pool.query(sql, values);
        console.log("Resultado de la consulta:", result);

        if (result.affectedRows > 0) {
            respuesta = {
                error: false,
                codigo: 200,
                mensaje: "Usuario actualizado correctamente",
                data: {
                    name: request.body.name,
                    last_name: request.body.last_name,
                    email: request.body.email,
                    photo: request.body.photo
                }
            };
        } else {
            respuesta = {
                error: true,
                codigo: 400,
                mensaje: "No se pudo actualizar el usuario o los datos no cambiaron"
            };
        }
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        respuesta = {
            error: true,
            codigo: 500,
            mensaje: "Error al actualizar usuario"
        };
    }

    response.send(respuesta);
}


async function get (request, response){
    let respuesta; 
        try{
            const sql = `SELECT name, last_name, email, photo FROM user
            WHERE Id_user=?`;
            const value = request.body.Id_user;
            console.log("ID del usuario recibido:", value);

            const [result] = await pool.query(sql,value);
            console.log(result);

            if (result.length > 0){

                let user = result[0];

                respuesta = {
                error: false,
                codigo: 200,
                mensaje: 'Usuario encontrado',
                data: {
                    name: user.name,
                    last_name: user.last_name,
                    email: user.email,
                    photo: user.photo
                    }
                }
            }
        }
        catch(error) {
            console.log(error);
            respuesta = {
                error: true,
                codigo: 500,
                mensaje: 'Error al obtener usuario'
            };
        }

    response.send(respuesta);
}

module.exports = {register, login, edit, get};