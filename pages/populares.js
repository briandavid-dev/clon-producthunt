import React from 'react';
import DetallesProducto from '../components/layout/DetallesProducto';
import Layout from '../components/layout/Layout';
import useProductos from '../hooks/useProductos'; 


export default function Populares() {

  const { productos } = useProductos('votos');

  return (
    <div>
      <Layout>
        <div className="listado-productos">
            <div className="contenedor">
                <div className="bg-white">
                    {
                        productos.map(producto => (
                          <DetallesProducto 
                              key={producto.id}
                              producto={producto}
                          />
                        ))
                    }
                </div>
            </div>
        </div>
      </Layout>
    </div>
  )
}
