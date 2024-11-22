const register = async (request, response) => {
    try {
        
    } 
    catch (error) {
        console.log(error);
        response.status(500).send("Error al insertar usuario"); 
    }                  
}

module.exports = {register};