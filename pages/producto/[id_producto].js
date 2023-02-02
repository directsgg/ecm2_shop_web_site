import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Galleria } from 'primereact/galleria';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { TabView, TabPanel } from 'primereact/tabview';
import { classNames } from 'primereact/utils';
import React, { useState, useContext} from 'react'
import { getAllProductosId, getProductoData } from '../../services/user/productoService';
import Head from 'next/head';
import { LayoutContext } from '../../layout/context/layoutcontext';

export default function Producto({ productoData}) {
  const { setTotalCompra, carritoCompra, setCarritoCompra, layoutConfig, setLayoutState } = useContext(LayoutContext);
  const [galleriaActiveIndex, setGalleriaActiveIndex] = useState(0);
  const [cantidadProducto, setCantidadProducto] = useState(1);

  const anadirACarrito = () => {
    const producto = {...productoData};
    // si no hay producto con el id dado en el carrito, crearlo
    const _carritoCompra = [...carritoCompra];
    const indexProductoCarrito = findIndexById(producto.id, _carritoCompra);
    if(indexProductoCarrito === -1) {
      producto.cantidad = cantidadProducto;
      producto.subtotal = producto.cantidad * producto.precio;
      _carritoCompra.push(producto);
    }
    else {
      _carritoCompra[indexProductoCarrito].cantidad = cantidadProducto;
      _carritoCompra[indexProductoCarrito].subtotal = cantidadProducto * producto.precio;
    }
    setCarritoCompra(_carritoCompra);
    let _totalCompra = 0;
    _carritoCompra.forEach(_producto => {
      _totalCompra += _producto.subtotal;
    });
    setTotalCompra(_totalCompra);

    setLayoutState((prevState) => ({ ...prevState, carritoSidebarVisible: true }));
  }

  const itemTemplate = (item) => {
    return (
      <img src={item.src} className='w-full h-auto'
        alt={productoData.nombre} style={{ height: '30rem'}}
      />
    );
  }

  const findIndexById = (_id, _producto) => {
    let index = -1;
    const productsLength = _producto.length;
    for(let i = 0; i < productsLength; i++) {
      if (_producto[i].id === _id) {
        index = i;
        break;
      }
    }
    return index;
  }

  const thumbnailTemplate = (item) => {
    return <img src={item.src} className='w-5rem h-5rem'
      alt={productoData.nombre}
    />
  }

  const items = [
    { label: 'Tienda',
      command: () => {
        window.location.href='/tienda'
      }
    },
    {
      label: productoData.nombre
    }
  ]

  const home = {
    icon: 'pi pi-home',
    label: 'Inicio',
    command: () => {
      window.location.href='/'
    }
  }

  const itemsTabMenu = [
    {label: 'Detalles'},
    {label: 'Envio'}
  ];

  const formatCurrency = (value) => {
    if(value === undefined) return 0;
    return value.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ'});
  };

  const porcentajeClassName = (rowData) => classNames({
    'text-red-400 font-bold': rowData.porcentajeDescuento > 0,
    'text-gray-300 font-bold': rowData.porcentajeDescuento === 0
  });

  const precioClassName = (rowData) => classNames({
    'line-through ': rowData.porcentajeDescuento > 0
  });

  return (
    <>
      <Head>
        <title>Music Store: {productoData.nombre}</title>
      </Head>
      {/* Breadcrumb  */}
      <BreadCrumb className='mx-2 mt-5' model={items} home={home} />
      {/* main */}
      <main className='mx-2 mt-2'>
        <Card>
          <div className='grid'>
          <div className="col-12 lg:col-6">
            <Galleria value={productoData.imagenes} item={itemTemplate}
              thumbnail={thumbnailTemplate} numVisible={4}
              activeIndex={galleriaActiveIndex} circular
              onItemChange={(e) => setGalleriaActiveIndex(e.index)} 
              showThumbnailNavigators={false}
            ></Galleria>
          </div>
          <div className="col-12 lg:col-6 py-3 lg:pl-6">
            <h1 className='flex align-items-center text-xl
              font-medium text-900 mb-4 '>
              {productoData.nombre}
            </h1>
            <div className='mb-5'>
              <h6 className="text-900 font-medium text-3xl block">
              {(productoData.porcentajeDescuento > 0)  &&
              <small className={porcentajeClassName(productoData)}>
                {productoData.porcentajeDescuento}%
              </small>} <span className={precioClassName(productoData)}>
                {formatCurrency(productoData.precio)}
              </span> 
            </h6>
            {(productoData.porcentajeDescuento > 0)  &&
              <h6 className="text-900 font-medium text-3xl block"> Oferta: 
                <span className={porcentajeClassName(productoData)}>
                  {formatCurrency(productoData.precioDescuento)}
                </span>
              </h6>
            }

            </div>
            <div className='font-bold text-900 mb-3'>Cantidad</div>
            <div className='flex flex-column sm:flex-row sm:align-items-center
              sm:justify-content-between'
            >
              <InputNumber inputId="horizontal" value={cantidadProducto} onValueChange={(e) => setCantidadProducto(e.value)} 
                showButtons buttonLayout="horizontal" step={1} min={1} mode='decimal' useGrouping={false}
                decrementButtonClassName="p-button-outlined p-button-secondary" 
                incrementButtonClassName="p-button-outlined p-button-secondary" incrementButtonIcon="pi pi-plus" 
                decrementButtonIcon="pi pi-minus" className='border-accent-3 border ' 
                />
              <div className='flex align-items-center flex-1 mt-3 sm:mt-0 ml-0 sm:ml-5'>
                <Button label='Añadir al carrito' className='flex-1 mr-5'
                   disabled={productoData.estadoInventario === 'SIN-STOCK'}
                   onClick={() => anadirACarrito()} 
                />
              </div>
            </div>
            <TabView className='mt-5'>
            <TabPanel header='Descripción'>
              <h2>Descripción del producto</h2>
              <p>
                {productoData.descripcion}
              </p>
            </TabPanel>
            <TabPanel header='Envio'>
            <h2>Informacion de envio</h2>
            <p>
              Los envios se realizan por medio de Guatex...
            </p>
            </TabPanel>
          </TabView>
          </div>
          </div>
          
        </Card>
      </main>
    </>
  )
}

export async function getStaticPaths() {
  const paths = await getAllProductosId();
  // we'll pre-render only these paths at build time,
  // { fallback: blocking } wiññ server-render pages
  // on-demand if the path doesn't exist.
  return {
    paths,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  const productoData = await getProductoData(params.id_producto);
  if(!productoData) {
    return {
      notFound: true
    }
  }
  return {
    props: {
      productoData
    },
    // Next.js will attempt to re-generate the page:
    // - when a request comes in 
    // - at most once every 120 seconds
    revalidate: 120, // in seconds
  }
}