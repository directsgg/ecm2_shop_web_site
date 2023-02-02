import React, { useContext } from 'react'
import { Sidebar } from 'primereact/sidebar';
import { LayoutContext } from './context/layoutcontext';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import Link from 'next/link';

export default function AppCarrito() {
  const { totalCompra, setTotalCompra, carritoCompra, setCarritoCompra, layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
  const onCarritoSidebarHide = () => {
    setLayoutState((prevState) => ({ ...prevState, carritoSidebarVisible: false }));
  };

  const formatCurrency = (value) => {
    if(value === undefined) return 0;
    return value.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ'});
  };

  const cantidadProductoChange = (e, index) => {
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

  const porcentajeClassName = (rowData) => classNames({
    'text-red-400 font-bold': rowData.porcentajeDescuento > 0,
    'text-gray-300 font-bold': rowData.porcentajeDescuento === 0
  });

  const precioClassName = (rowData) => classNames({
    'line-through ': rowData.porcentajeDescuento > 0
  });

  return (
    <>
    <Sidebar visible={layoutState.carritoSidebarVisible} position='right' style={{width:'60em'}}
      onHide={onCarritoSidebarHide}
    >
      <h3>Carrito de compras</h3>
      {carritoCompra.map((producto, index) => {
        return (
          <div key={producto.id}>
          <div className='flex flex-column'>
            <div className='flex flex-row py-4'>
              <div className='w-16 h-16 relative overflow-hidden cursor-pointer'>
                <img src={producto.imagenes[0].src} alt={producto.nombre} width={64} height={64} />
              </div>
              <div className='flex flex-1 flex-col text-base ml-4'>
                <a href="/" className='font-bold text-gray-900'>{producto.nombre}</a>
              </div>
              <div className='flex flex-column align-items-end space-y-2 '>
                
                <label className='mb-2'> C/U <span className={precioClassName(producto)}>
                    {formatCurrency(producto.precio)}
                  </span> {(producto.porcentajeDescuento > 0)  && 
                    <span className={porcentajeClassName(producto)}>
                    {formatCurrency(producto.precioDescuento)}
                    </span> 
                  }
                </label>
                <label>Subtotal: {formatCurrency(producto.subtotal)}</label>
              </div>
            </div>
            <div className='flex flex-row h-9'>
              <Button icon='pi pi-times' className="p-button-outlined p-button-secondary" onClick={() => eliminarProductoDelCarrito(producto.id)} />
              <InputNumber inputId="horizontal" value={producto.cantidad} onValueChange={(e) => cantidadProductoChange(e, index)} 
                showButtons buttonLayout="horizontal" step={1} min={1} mode='decimal' useGrouping={false}
                decrementButtonClassName="p-button-outlined p-button-secondary" 
                incrementButtonClassName="p-button-outlined p-button-secondary" incrementButtonIcon="pi pi-plus" 
                decrementButtonIcon="pi pi-minus" className='w-full border-accent-2 border ml-2' 
              />
            </div>
          </div>
          <Divider />
          </div>
        )

        })
      }
      <div className='flex flex-column align-items-end px-6'>
        <div className='font-bold mb-2'>
          Total: {formatCurrency(totalCompra)}
        </div>
        <Link href='/checkout'>
          <Button label='Ordenar pedido' onClick={onCarritoSidebarHide}/>  
        </Link>
      </div>
    </Sidebar>
    </>
  )
}
