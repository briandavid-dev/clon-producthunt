export default function validarCrearCuenta(valores) {

    let errores = {}

    if(!valores.nombre){
        errores.nombre = "El nombre es obligatorio";
    }

    if(!valores.empresa){
        errores.empresa = "El nombre de empresa es obligatorio";
    }

    if(!valores.url){
        errores.url = "El url del producto es obligatoria";
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
        errores.url = "La url no tiene un formato valido."
    }

    if(!valores.descripcion) {
        errores.descripcion = "Agrega una descripción a tu producto";
    }
    

    return errores;

}