class Usuarios {

    constructor() {

        // Se inicializa el arreglo donde se guardaran las persoans Personas
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {

        //Se crea una persona
        let persona = {
            id: id,
            nombre: nombre,
            sala: sala
        }

        //La personas se agrega al arreglo
        this.personas.push(persona);

        //Se regresa el arreglo de personas
        return this.personas;

    }

    getPersona(id) {

        // Busca en el arreglo de Personas y regresa la primera persona en el arreglo que coincida con el ID
        let persona = this.personas.filter(persona => persona.id === id)[0];

        //Se regresa la personas
        return persona;

    }

    getPersonas() {

        //Regresa a todas las personas del arreglo
        return this.personas;

    }

    getPersonasPorSala(sala) {
        //Regresa a todas las personas que estan conectadas a una sala
        let personasEnSala = this.personas.filter(persona => {
            return persona.sala === sala
        });

        return personasEnSala;

    }

    borrarPersona(id) {

        //Se guarda la referencia de la persona que se va a borrar
        let personaBorrada = this.getPersona(id);

        //Se borra a la persona
        this.personas = this.personas.filter(persona => {
            return persona.id != id
        });

        //Regresa la persona borrada  "**Persona** se ha desconectado"
        return personaBorrada;

    }

}

//se exporta el modulo para poder usarlo en otros archivos
module.exports = {
    Usuarios
}