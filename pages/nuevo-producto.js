import React, { useState, useEffect, useContext } from 'react';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import { FirebaseContext } from '../firebase';

// validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';
import Error404 from '../components/layout/404';

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  url: '',
  descripcion: ''
}

export default function NuevoProducto() {

  // state de las imagenes
  const [nombreImagen, guardarNombreImagen] = useState('');
  const [subiendo, guardarSubiendo] = useState(false);
  const [progreso, guardarProgreso] = useState(0);
  const [urlImagen, guardarUrlImagen] = useState('');

  
  const [ error, guardaError ] = useState(false);
  
  const { valores, errores, submitForm, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
  
  const { nombre, empresa, url, descripcion } = valores;

  const router = useRouter();
  
  const { usuario, firebase } = useContext(FirebaseContext);

  


  async function crearProducto() {

      // si el usuario no esta autenticado llevar a login
      if(!usuario) {
          return router.push('/login');
      }

      // crear el objeto de nuevo producto
      const producto = {
        nombre, 
        empresa,
        url,
        urlImagen,
        descripcion,
        votos: 0,
        comentarios: [],
        creado: Date.now(),
        creador: {
            id: usuario.uid,
            nombre: usuario.displayName
        },
        haVotado: []
      }

      try {
          // insertar en database
          firebase.db.collection('productos').add(producto);
          return router.push('/');
      } catch (error) {
          console.error('error al agregar un producto', error);
          guardaError(error.message);
      }
      
  }

  const handleUploadStart = () => {
      guardarProgreso(0);
      guardarSubiendo(true);
  };

  const handleProgress = progress => guardarProgreso({progreso});

  const handleUploadError = error => {
      guardarSubiendo(error);
      console.error('handleUploadError', error);
  };
  
  const handleUploadSuccess = nombre => {
    
      guardarProgreso(100);
      guardarSubiendo(false);
      guardarNombreImagen(nombre);

      firebase
        .storage
        .ref("productos")
        .child(nombre)
        .getDownloadURL()
        .then(url => {
            guardarUrlImagen(url);
            console.log('url', url);
        })
        .catch(error => {
          console.error(error);
        });
  };



  
  return (
    <div>
      <Layout>

        {!usuario ?
        (
            <Error404 />
        ) :
        (
        <>
            <h1 css={css`
              text-align: center;
              margin-top: 5rem;
            `}>Agregar Nuevo Producto</h1>
            <Formulario onSubmit={handleSubmit} noValidate>


              <fieldset>
                <legend>Información General</legend>
              

                <Campo>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      placeholder="Producto"
                      name="nombre"
                      value={nombre}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                </Campo>

                { errores.nombre && <Error>{errores.nombre}</Error> }

                <Campo>
                    <label htmlFor="empresa">Empresa</label>
                    <input
                      type="text"
                      id="empresa"
                      placeholder="Nombre Empresa"
                      name="empresa"
                      value={empresa}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                </Campo>

                { errores.empresa && <Error>{errores.empresa}</Error> }

                <Campo>
                    <label htmlFor="imagen">Imagen</label>
                    <FileUploader
                        accept="image/*"
                        name="imagen"
                        randomizeFilename
                        storageRef={firebase.storage.ref("productos")}
                        onUploadStart={handleUploadStart}
                        onUploadError={handleUploadError}
                        onUploadSuccess={handleUploadSuccess}
                        onProgress={handleProgress}
                    />
                </Campo>

                { errores.imagen && <Error>{errores.imagen}</Error> }
              

                <Campo>
                    <label htmlFor="url">Url</label>
                    <input
                      type="url"
                      id="url"
                      placeholder="URL del producto"
                      name="url"
                      value={url}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                </Campo>

                { errores.url && <Error>{errores.url}</Error> }
              </fieldset>


              <fieldset>
                  <legend>Sobre tu producto</legend>

                  <Campo>
                    <label htmlFor="descripcion">Descripcion</label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={descripcion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                </Campo>

                { errores.descripcion && <Error>{errores.descripcion}</Error> }

              </fieldset>
                

                <InputSubmit
                  type="submit"
                  value="Crear Pructo"
                />

                { error && <Error>{error}</Error>}

            </Formulario>
        </>
        )}


      </Layout>
    </div>
  )
}
