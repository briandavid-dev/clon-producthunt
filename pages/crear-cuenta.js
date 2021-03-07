import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import firebase from '../firebase';

// validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

const STATE_INICIAL = {
  nombre: '',
  email: '',
  password: ''
}

export default function CrearCuenta() {

  const [ error, guardaError ] = useState(false);

  const { valores, errores, submitForm, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = valores;

  async function crearCuenta() {
      try {
          const result = await firebase.registrar(nombre, email, password);
          Router.push('/');
          
      } catch (error) {
          console.error('error al crear un usuario - crearCuenta crear-cuenta.js', error);
          guardaError(error.message);
      }
  }


  
  return (
    <div>
      <Layout>
        <h1 css={css`
          text-align: center;
          margin-top: 5rem;
        `}>Crear Cuenta</h1>
        <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Tu Nombre"
                  name="nombre"
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
            </Campo>

            { errores.nombre && <Error>{errores.nombre}</Error> }

            <Campo>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Tu Email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
            </Campo>
            { errores.email && <Error>{errores.email}</Error>}
            <Campo>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Tu Password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
            </Campo>
            { errores.password && <Error>{errores.password}</Error>}

            <InputSubmit
              type="submit"
              value="Crear Cuenta"
            />

            { error && <Error>{error}</Error>}

        </Formulario>
      </Layout>
    </div>
  )
}
