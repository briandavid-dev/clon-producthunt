import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/react';
import Styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import Layout from '../../components/layout/Layout';
import Error404 from '../../components/layout/404';
import { FirebaseContext } from '../../firebase/';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

const ContenedorProducto = Styled.div `
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = Styled.p `
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #FFF;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;


const Producto = () => {

    const [producto, guardarProducto] = useState({});
    const [error, guardarError] = useState(false);
    const [comentario, guardarComentario] = useState({});
    const [consultarDB, guardarConsultarDB] = useState(true);
    
    const router = useRouter();
    const { query: { id } } = router;
    
    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if(id && consultarDB) {
            (async function obtenerProductos(){
                const productoQuery = await firebase.db.collection('productos').doc(id);
                const producto = await productoQuery.get();
                if(producto.exists) {
                    guardarProducto( producto.data() );
                    guardarConsultarDB(false);
                } else {
                    guardarError(true);
                    guardarConsultarDB(false);
                }
            })();
        }
    }, [id, producto]);

    const { comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos, creador, haVotado} = producto;

    const votarProducto = () => {
        if(!usuario)
            return router.push('/login');

        // obtener y sumar nuevo total
        const nuevoTotal = votos + 1;

        // verificar si el usuario ha votado
        if( haVotado.includes(usuario.uid) ) return;

        //guardar el id del usuario que ha votado
        const nuevoHanVotado = [...haVotado, usuario.uid];

        // guardar en database
        firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal,
            haVotado: nuevoHanVotado
        });

        // actualizar el state
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        })

        guardarConsultarDB(true); // se guarda un producto, ve a consultar la base de datos

    }
    
    
    // funciones para crear comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentarios,
            [e.target.name]: e.target.value
        })
    }

    // identifica si el comentario es del creador del producto
    const esCreador = id => {
        if(creador.id == id){
            return true;
        }
    }

    const agregarComentario = e => {
        e.preventDefault();

        if(!usuario)
            return router.push('/login');

        // informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName

        // tomar copia de los comentarios y agregar este ultimo comentario a la copia
        const nuevosComentarios = [...comentarios, comentario];

        // acrtualizar db
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        })

        // actualizar state
        guardarComentario({
            ...comentarios,
            comentario: nuevosComentarios
        })

        guardarConsultarDB(true); // se guarda un comentario, ve a consultar la base de datos


    }

    // function que identifica que el creardor del producto sea el mismo que está autenticado
    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid) {
            return true;
        }
    }

    const eliminarProducto = async () => {

        if(!usuario)
            return router.push('/login');

        if(creador.id !== usuario.uid)
            return router.push('/');

        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/');
        } catch (error) {
            console.log('error', error);
        }
    }


    return (
        <Layout>

            { ( Object.keys(producto).length === 0 && !error ) && <p>Cargando...</p> }

            { Object.keys(producto).length > 0 && (
            <>
            <div className="contenedor">
                <h1
                    css={css`
                        text-align: center;
                        margin-top: 5rem; 
                    `}
                >
                    {nombre}
                </h1>

                <ContenedorProducto>
                    <div>
                        <p>Publicado hace: { formatDistanceToNow(new Date(creado), { locale: es }) }</p>
                        <p>Por: {creador?.nombre} de {empresa} </p>

                        <img src={urlImagen} />
                        <p>{descripcion}</p>

                        { usuario && (
                            <>
                            <h2>Agrega tu comentario</h2>
                            <form onSubmit={agregarComentario}>
                                <Campo>
                                    <input 
                                        type="text"
                                        name="mensaje"
                                        onChange={comentarioChange}
                                    />
                                </Campo>
                                <InputSubmit
                                    type="submit"
                                    value="Agregar Comentario"
                                />
                            </form>     
                            </>
                        )}

                        <h2 css={css`margin: 2rem 0;`}>Comentarios</h2>

                        { comentarios.length === 0 && "Aún no hay comentarios"}

                        { comentarios.map((comentario, id) => (
                            <li 
                                key={`${comentario.id}-${id}`}
                                css={css`
                                    border: 1px solid var(--gris3);
                                    padding: 2rem;
                                `}
                            >
                                <p>{comentario.mensaje}</p>
                                <p>Escrito por: 
                                    <span
                                        css={css`
                                            font-weight: bold;
                                        `}
                                    >
                                        {''} {comentario.usuarioNombre}
                                    </span>
                                </p>
                                { esCreador( comentario.usuarioId ) && <CreadorProducto>Es Creador</CreadorProducto>}
                            </li>
                        ))}

                    </div>
                    <aside>
                        <Boton
                            target="_blank"
                            bgColor
                            href={url}
                        >
                            Visitar URL
                        </Boton>
                        
                        
                        <p css={css`text-align:center; margin-top: 5rem;`}>{votos} Votos</p>
                        
                        { usuario && (
                            <Boton
                                onClick={votarProducto}
                            >
                                Votar
                            </Boton>
                        )}
                    </aside>
                </ContenedorProducto>

                { puedeBorrar() && 
                    <Boton
                        onClick={eliminarProducto}
                    >Eliminar Producto</Boton>}
                
            </div>
            </>
            ) }
            


            { error && <Error404 /> }
        </Layout>
    )
}

export default Producto;
