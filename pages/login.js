import React, { useState } from 'react';
import { css } from  '@emotion/react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import firebase from '../firebase';

// validaciones
import useValidacion from '../hooks/useValidacion';
import validarLogin from '../validacion/validarLogin';

const ESTADO_INICIAL = {
    email: '',
    password: ''
}

export default function Login() {
  
  const [error, guardaError] = useState(false);

  const { valores, errores, submitForm, handleSubmit, handleChange, handleBlur } = useValidacion(ESTADO_INICIAL, validarLogin, iniciarSesion);

  const { email, password } = valores;

  async function iniciarSesion() {
    try {
        const usuario = await firebase.login(email, password);
        console.log('usuario', usuario)
        Router.push('/');
        
    } catch (error) {
        console.error('error al autenticar un usuario - iniciarSesion login.js', error);
        guardaError(error.message);
    }
      
  }

  return (
    <div>
      <Layout>
        <h1 css={css`
          text-align: center;
          margin-top: 5rem;
        `}>Iniciar Sesión</h1>
        <Formulario onSubmit={handleSubmit} noValidate>

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
              value="Iniciar Sesión"
            />

            { error && <Error>{error}</Error>}

        </Formulario>
      </Layout>
    </div>
  )
}
