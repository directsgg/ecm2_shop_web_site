import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useState, useContext, useRef } from 'react'
import { LayoutContext } from '../layout/context/layoutcontext';
import Link from 'next/link';
import { setPedido } from '../services/user/pedidoService';
const Checkout = () => {
  const datosClienteVacio = {
    nombre: '',
    departamento: '',
    municipio: '',
    direccion: '',
    telefono: null,
    nit: null,
    comentario: ''
  };
  const { totalCompra, setTotalCompra, carritoCompra, setCarritoCompra } = useContext(LayoutContext);
  const toast = useRef(null);
  const [datosCliente, setDatosCliente] = useState(datosClienteVacio);
  const [submitted, setSubmitted] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const clickFinalizarPedido = async (e) => {
    setLoading1(true);
    setSubmitted(true);
    e.preventDefault();

    if(datosCliente.nombre.trim() && datosCliente.departamento.trim() &&
      datosCliente.municipio.trim() && datosCliente.direccion.trim() &&
      datosCliente.telefono) {

      await setPedido({
        cliente: datosCliente,
        pedido: carritoCompra
      }).then(() => {
        setCarritoCompra([]);
        setTotalCompra(0);
        setDatosCliente(datosClienteVacio);
        setSubmitted(false);
        toast.current.show({
          severity: 'success',
          summary: '¡Exito!',
          detail: 'Pedido generado, espera confirmación por wattsap.',
          life: '15000'
        });
      }).catch(() => {
        toast.current.show({
          severity: 'error',
          summary: '¡Error!',
          detail: 'Error interno, intenta de nuevo',
          life: '15000'
        });
      })
    }
    setLoading1(false);
  }

  const cantidadProductoChange = (e, index) => {
    if(index !== -1) {
      const _carritoCompra = [...carritoCompra];
      _carritoCompra[index].cantidad = e.value;
      if(_carritoCompra[index].precioDescuento > 0)
        _carritoCompra[index].subtotal = _carritoCompra[index].cantidad * _carritoCompra[index].precioDescuento;
      else 
        _carritoCompra[index].subtotal = _carritoCompra[index].cantidad * _carritoCompra[index].precio;
      setCarritoCompra(_carritoCompra);
      let _totalCompra = 0;
      _carritoCompra.forEach(_producto => {
        _totalCompra += _producto.subtotal;
      });
      setTotalCompra(_totalCompra);
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error en el sistema!',
        detail: 'Por favor contactenos si este error aparece.',
        life: '15000'
      });
    }
  }

  const eliminarProductoDelCarrito = (id) => {
    let _carritoCompra = carritoCompra.filter(val => val.id !== id);
    setCarritoCompra(_carritoCompra);
    let _totalCompra = 0;
    _carritoCompra.forEach(_producto => {
      _totalCompra += _producto.subtotal;
    });
    setTotalCompra(_totalCompra);
  }

  const formatCurrency = (value) => {
    if(value === undefined) return 0;
    return value.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ'});
  };

  const items = [
    { label: 'Tienda',
      command: () => {
        window.location.href='/tienda'
      }
    },
    { label: 'Finalizar compra'},
  ]

  const home = {
    icon: 'pi pi-home',
    label: 'Inicio',
    command: () => {
      window.location.href='/'
    }
  }

  const imageBodyTemplate = (rowData) => {
    return (
      <div className='w-16 h-16 relative overflow-hidden hidden sm:block'>
        <img src={rowData.imagenes[0].src} alt={rowData.nombre} width={64} height={64} />
      </div>
    );
  }

  const cantidadBodyTemplate = (rowData) => {
    const index = findIndexById(rowData.id, carritoCompra);
    return (
      <>
        <InputNumber
          value={rowData.cantidad} mode='decimal' useGrouping={false} allowEmpty={false}
          onValueChange={(e) => cantidadProductoChange(e, index)} 
          min={1} className='w-4rem' size={1}
        />
        <Button icon='pi pi-times' className="p-button-outlined p-button-secondary ml-1 mt-1" 
          onClick={() => eliminarProductoDelCarrito(rowData.id)} type='button' tooltip='Eliminar producto'
        />
      </>
    );
  }

  const findIndexById = (id, _carrito) => {
    let index = -1;
    const productsLength = _carrito.length;
    for(let i = 0; i < productsLength; i++) {
      if (_carrito[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  const subtotalBodyTemplate = (rowData) => {
    return formatCurrency(rowData.subtotal);
  }

  return (
    <>
      {/* toast */}
      <Toast ref={toast} />

      {/* Breadcrumb  */}
      <BreadCrumb className='mx-2 mt-5' model={items} home={home} />
      {/* main */}
      <main className='mx-2 mt-2 '>
        <Card title={<h1><span className='text-yellow-500 text-7xl'>F</span>inalizar compra</h1>}>
          <form onSubmit={clickFinalizarPedido} >
            <div className='grid m-0'>
              <section id='informacion' className="col-12 lg:col-4">
                <h3><Badge value='1' severity='secondary' size='xlarge'></Badge> Informacion de envio:</h3>
                  <div className='formgrid p-fluid px-6'>
                    <div className='field mb-5'>
                      <span className='p-float-label'>
                        <InputText id='nombre' required 
                          value={datosCliente.nombre}
                          onChange={(e) => setDatosCliente({...datosCliente, nombre: e.target.value})}
                          className={classNames( { 'p-invalid' : submitted && !datosCliente.nombre })}
                        />
                        <label htmlFor='nombre'>Nombre completo</label>
                      </span>
                      {submitted && !datosCliente.nombre && 
                        <small className='p-error'>
                          Nombre es requerido.
                        </small>
                      }
                    </div>

                    <div className='field mb-5'>
                      <span className='p-float-label'>
                        <InputText id='departamento' required 
                          value={datosCliente.departamento}
                          onChange={(e) => setDatosCliente({...datosCliente, departamento: e.target.value})}
                          className={classNames( { 'p-invalid' : submitted && !datosCliente.departamento })}
                        />
                        <label htmlFor='departamento'>Departamento</label>
                      </span>
                      {submitted && !datosCliente.departamento && 
                        <small className='p-error'>
                          Departamento es requerido.
                        </small>
                      }
                    </div>

                    <div className='field mb-5'>
                      <span className='p-float-label'>
                        <InputText id='municipio' required 
                          value={datosCliente.municipio}
                          onChange={(e) => setDatosCliente({...datosCliente, municipio: e.target.value})}
                          className={classNames( { 'p-invalid' : submitted && !datosCliente.municipio })}
                        />
                        <label htmlFor='municipio'>Municipio</label>
                      </span>
                      {submitted && !datosCliente.municipio && 
                        <small className='p-error'>
                          Municipio es requerido.
                        </small>
                      }
                    </div>

                    <div className='field mb-5'>
                      <span className='p-float-label'>
                        <InputText id='direccion' required 
                          value={datosCliente.direccion}
                          onChange={(e) => setDatosCliente({...datosCliente, direccion: e.target.value})}
                          className={classNames( { 'p-invalid' : submitted && !datosCliente.direccion })}
                        />
                        <label htmlFor='direccion'>Direccion</label>
                      </span>
                      {submitted && !datosCliente.direccion && 
                        <small className='p-error'>
                          Direccion es requerido.
                        </small>
                      }
                    </div>

                    <div className='field mb-5'>
                      <span className='p-float-label'>
                        <InputNumber id='telefono' required 
                          value={datosCliente.telefono} mode='decimal' useGrouping={false}
                          onValueChange={(e) => setDatosCliente({...datosCliente, telefono: e.value})}
                          className={classNames( { 'p-invalid' : submitted && !datosCliente.telefono })}
                        />
                        <label htmlFor='telefono'>Telefono</label>
                      </span>
                      {submitted && !datosCliente.telefono && 
                        <small className='p-error'>
                          Telefono es requerido.
                        </small>
                      }
                    </div>

                    <div className='field mb-5'>
                      <span className='p-float-label'>
                        <InputNumber id='nit'
                          value={datosCliente.nit} mode='decimal' useGrouping={false}
                          onValueChange={(e) => setDatosCliente({...datosCliente, nit: e.value})}
                        />
                        <label htmlFor='nit'>Nit o C/F (opcional)</label>
                      </span>
                    </div>

                    <div className="field mb-3">
                      <span className="p-float-label">
                        <InputTextarea id="cometario"
                          value={datosCliente.comentario} 
                          onChange={(e) => setDatosCliente({...datosCliente, comentario: e.target.value})}
                          rows={4} cols={30} autoResize
                        />
                        <label htmlFor="cometario">Cometarios (opcional)</label>
                      </span>
                    </div>
                  </div>  
              </section>
              <Divider layout='vertical' className='hidden lg:flex'/>
              <Divider className='lg:hidden' />
              <div className="col-12 lg:col-7 ">
                <section id='pedido'>
                  <h3><Badge value='2' severity='secondary' size='xlarge'></Badge> Pedido:</h3>
                  <DataTable value={carritoCompra} responsiveLayout='scroll' className='mx-0 sm:mx-6 lg:mx-0'
                    dataKey='id' emptyMessage='Tu carrito de compras esta vacío, regresa a la tienda.'
                  >
                    <Column body={imageBodyTemplate}></Column>
                    <Column field='nombre' header='Descripcion' ></Column>
                    <Column field='cantidad' header='Cantidad' body={cantidadBodyTemplate}></Column>
                    <Column field='subtotal' header='Subtotal' body={subtotalBodyTemplate} className='text-right' ></Column>
                  </DataTable>
                  <div className='flex flex-column align-items-end mt-2'>
                    <div className='font-bold mb-2'>
                      Total: {formatCurrency(totalCompra)}
                    </div>
                  </div>
                </section>
                <Divider />
                <section id='pago'>

                  <h3><Badge value='3' severity='secondary' size='xlarge'></Badge> Pago:</h3>
                  <p>Instrucciones:</p>
                  <ul>
                    <li>
                      <p> <span className="font-bold">Transferencia o deposito bancario:</span> Puedes usar cualquiera de las siguientes cuentas:</p>
                      <ul>
                        <li>
                          <p>Cuenta monetaria: <span className="font-bold">xxxxxxxxxx</span> a nombre de: <span className="font-bold">Music Store S.A.</span> en <span className="font-bold">Banrural</span></p>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <p>Seguidamente enviar la boleta de pago a nuestro watsapp:</p>
                      <Link href='https://wa.me/502123456789' >
                        <a className='text-gray-900 underline' target='_blank'>https://wa.me/502123456789</a>
                      </Link>
                    </li>
                  </ul>
                  <p>Nota: El pedido es enviado hasta que el pago sea debidamente acreditado y se notifica por watsapp.</p>
                  <Button icon='pi pi-check' label='Comprar' 
                    className="p-button-lg w-full" disabled={carritoCompra.length <= 0}
                    type='submit' loading={loading1} 
                  />
                </section>
              </div>
            </div>
          </form> 
        </Card>  
      </main>  
    </>
  )
}

export default Checkout