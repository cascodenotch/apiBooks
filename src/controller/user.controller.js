const {pool} = require("../database")

const register = async (request, response) => {
    try {

        let sql = `INSERT INTO user (name, last_name, email, photo, password) 
        VALUES (?, ?, ?, ?,?)`;
        let values = [
            request.body.name,
            request.body.last_name,
            request.body.email,
            request.body.photo,
            request.body.password
        ];

        let [result] = await pool.query(sql, values);
        console.log(result); 

        if (result.insertId) {
            response.send(String(result.insertId));
        } else {
            response.send("-1"); 
        }

    } 
    catch (error) {
        console.log(error);
        response.status(500).send("Error al registrar usuario"); 
    }                  
}

const login = async (request, response) =>{
    try{

        let email = request.body.email;
        let password = request.body.password

        if (email && password) {
            let sql = `SELECT * FROM user WHERE email=?`
            let values = [email];
            let [result1] = await pool.query(sql, values);

            if (result1.length > 0){
                let user= result1[0];

                if (password == user.password){

                response.status(200).send({
                    name: user.name,
                    last_name: user.last_name,
                    email: user.email,
                    photo: user.photo})

                } else {
                    response.status(401).send("Contraseña incorrecta");
                    console.log ("Contraseña incorrecta");
                }

            } else {
                response.status(404).send("Correo no encontrado");
                console.log ("Correo no encontrado");
            }
        } else {
            response.status(400).send("Es necesio introducir correo y contraseña");
        }

    } catch (error){
        console.log(error);
        response.status(500).send("Error al iniciar sesión"); 
    }
}

module.exports = {register, login};