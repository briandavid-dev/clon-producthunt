export default function validarLogin(valores) {

    let errores = {}

    if(!valores.email) {
        errores.email = "El E-Mail es obligatorio";
    } else if ( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email) ) {
        errores.email = "El E-Mail debe tener formato de E-Mail";
    }

    if(!valores.password){
        errores.password = "El Password es obligatorio";
    } else if ( valores.password.length < 6 ) {
        errores.password = "El Password debe tener 6 o mas caracteres";
    }

    return errores;

}