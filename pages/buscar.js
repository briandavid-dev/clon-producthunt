import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';
import { useRouter } from 'next/router'; 
import useProductos from '../hooks/useProductos';

export default function Buscar() {

  const [productosEncontrados, guardarProductosEncontrados] = useState([]); 
  const [busquedaFinalizada, setBusquedaFinalizada] = useState(false);

  const router = useRouter();
  const { query: {q} } = router;

  const { productos } = useProductos('creado');

  useEffect(() => {
    
      const filtro = productos.filter(
        producto => 
            producto.nombre.toLowerCase().indexOf(q.toLowerCase()) >= 0 ||
            producto.descripcion.toLowerCase().indexOf(q.toLowerCase()) >= 0
      );
      guardarProductosEncontrados(filtro);
    
  }, [q, productos])

  return (
    <div>
      <Layout> 
        
          { Object.keys(productosEncontrados).length === 0 && <p>No se han encontrado productos con nombre {q}</p>}

          <div className="listado-productos">
              <div className="contenedor">
                  <div className="bg-white">
                      {
                          productosEncontrados.map(producto => (
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
