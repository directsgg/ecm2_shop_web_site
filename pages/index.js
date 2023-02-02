import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '../layout/context/layoutcontext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCategorias } from '../services/user/categoriaService';
import { getCarruseles } from '../services/user/carruselService';
import { getMejoresProductos, getOfertasProductos } from '../services/user/productoService';
const Inicio = () => {
  const toast = useRef(null);
  const router = useRouter();
    const [presentacion, setPresentacion] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [mejoresProductos, setMejoresProductos] = useState([]);
    const [ofertasProductos, setOfertasProductos] = useState([]);
    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const { setTotalCompra, carritoCompra, setCarritoCompra, 
      setGlobalSelectCategoria, setLayoutState } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '600px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '480px',
        numVisible: 1,
        numScroll: 1
      }
    ];

  // - obtener presentaciones
  const obtenerPresentaciones = async () => {
    const _carruseles = await getCarruseles();
    if(_carruseles !== undefined)
    setPresentacion(_carruseles);
  }

  // - obtener categorias
  const obtenerCategorias = async () => {
    const _categorias = await getCategorias();
    if(_categorias !== undefined)
    setCategorias(_categorias);
  }

  // - obtener mejores productos
  const obtenerMejoresProductos = async () => {
    const _mejoresProductos = await getMejoresProductos();
    if(_mejoresProductos !== undefined)
    setMejoresProductos(_mejoresProductos);
  }

  // - obtener ofertas productos
  const obtenerOfertasProductos = async () => {
    const _ofertasProductos = await getOfertasProductos();
    if(_ofertasProductos !== undefined)
    setOfertasProductos(_ofertasProductos);
  }

    useEffect(() => {
        obtenerPresentaciones();
        obtenerCategorias();
        obtenerMejoresProductos();
        obtenerOfertasProductos();
        //const productService = new ProductService();

        //productService.getOfertasProductos().then(data => setOfertasProductos(data.slice(0,9)));
    }, []);

    const findIndexById = (id, _producto) => {
      let index = -1;
      const productsLength = _producto.length;
      for(let i = 0; i < productsLength; i++) {
        if (_producto[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    }

    const onCarritoButtonClick = () => {
      setLayoutState((prevState) => ({ ...prevState, carritoSidebarVisible: true }));
    };

    const anadirACarrito = (producto) => {
      // si no hay producto con el id dado en el carrito, crearlo
    const _carritoCompra = [...carritoCompra];
    const indexProductoCarrito = findIndexById(producto.id, _carritoCompra);
    if(indexProductoCarrito === -1) {
      producto.cantidad = 1;
      if(producto.precioDescuento > 0)
        producto.subtotal = producto.cantidad * producto.precioDescuento;
      else 
        producto.subtotal = producto.cantidad * producto.precio;
      _carritoCompra.push(producto);
    }
    else {
      _carritoCompra[indexProductoCarrito].cantidad += 1;
      if(_carritoCompra[indexProductoCarrito].precioDescuento > 0)
        _carritoCompra[indexProductoCarrito].subtotal = _carritoCompra[indexProductoCarrito].cantidad * _carritoCompra[indexProductoCarrito].precioDescuento;
      else
        _carritoCompra[indexProductoCarrito].subtotal = _carritoCompra[indexProductoCarrito].cantidad * _carritoCompra[indexProductoCarrito].precio;
    }
    setCarritoCompra(_carritoCompra);
    let _totalCompra = 0;
    _carritoCompra.forEach(_producto => {
      _totalCompra += _producto.subtotal;
    });
    setTotalCompra(_totalCompra);

    toast.current.show({
      severity: 'info',
      life: 10000,
      content: (
        <div className="p-toast-message-content">
          <span className="p-toast-message-icon pi pi-info-circle"></span>
          <div className="p-toast-message-text">
            <span className="p-toast-summary">!Exito!</span>
            <div className="p-toast-detail">Producto añadido al carrito</div>
            <Button icon='pi pi-shopping-cart' label='Carrito' 
              className='ml-2 mt-2 sm:mt-0' onClick={onCarritoButtonClick} 
            />
          </div>
        </div>
      )
    });
    //setLayoutState((prevState) => ({ ...prevState, carritoSidebarVisible: true }));
  }  

  const formatCurrency = (value) => {
    if(value === undefined) return 0;
    return value.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ'});
  };

  const linkTiendaToCategoria = (_categoria) => {
    setGlobalSelectCategoria([_categoria]);
    router.push('/tienda/');
  }

  const presentacionTemplate = (_presentacion) => {
    return (
      <div className='block relative h-30rem' >
        <Image src={_presentacion.imagen} layout="fill" objectFit='cover'
          alt={_presentacion.titulo} className="img-oscuro-75"
          priority={(_presentacion.orden <= 0) ? true : false}
        />
        <div className='absolute bottom-0 text-center w-full m-2'>
            <h4 className='mx-2 mb-1 text-0'>{_presentacion.titulo}</h4>
            <h6 className='mx-2 mt-0 mb-3 text-0'>{_presentacion.descripcion}</h6>
            <div className='mb-3 pt-3'>
              <Link href={_presentacion.redireccion}>
                <a className='p-link shadow-3 border-3 border-yellow-500 text-yellow-500 p-3 uppercase 
                  transition-delay-100 transition-colors transition-duration-300 hover:bg-yellow-500
                  hover:text-900'
                >
                {_presentacion.tituloAccion}
                </a>
              </Link>
            </div>
        </div>
      </div>
    )
  } 

  const headerCard = (_categoria) => 
    <div className='block relative h-10rem'>
      <Image src={_categoria.imagen} layout='fill' objectFit='contain'
        alt={_categoria.titulo} className='right-0'
      />
    </div>;

  const porcentajeClassName = (rowData) => classNames({
    'text-red-400 font-bold': rowData.porcentajeDescuento > 0,
    'text-gray-300 font-bold': rowData.porcentajeDescuento === 0
  });

  const precioClassName = (rowData) => classNames({
    'line-through ': rowData.porcentajeDescuento > 0
  });

  const productTemplate = (product) => {
    return (
        <div className="product-item">
            <div className="product-item-content">
                <div className="mb-3 block relative h-15rem">
                  <Image src={product.imagenes[0].src} layout="fill" objectFit='contain'
                    alt={product.nombre} className="img-oscuro-75s"
                  />
                </div>
                <div>
                    <h4 className="mb-1">{product.nombre}</h4>
                    <h6>
                      {(product.porcentajeDescuento > 0)  &&
                      <small className={porcentajeClassName(product)}>
                        {product.porcentajeDescuento}%
                      </small>} <span className={precioClassName(product)}>
                        {formatCurrency(product.precio)}
                      </span> 
                    </h6>
                    {(product.porcentajeDescuento > 0)  &&
                      <h6>
                      👀 <span className={porcentajeClassName(product)}>
                        {formatCurrency(product.precioDescuento)}
                      </span>
                    </h6>
                    }
                    <span className={`product-badge status-${product.estadoInventario.toLowerCase()}`}>
                      {product.estadoInventario}
                    </span>
                    <div className="car-buttons mt-5">
                      <Link href={`/producto/${product.id}`}>
                        <Button icon="pi pi-search" tooltip="Ver detalles"
                          className="p-button-secondary p-button-rounded mr-2" 
                        />
                      </Link>
                      <Button icon="pi pi-cart-plus" tooltip="Añadir al carrito"
                        className="p-button-warning p-button-rounded mr-2" 
                        onClick={() => anadirACarrito(product)} 
                      />
                    </div>
                </div>
            </div>
        </div>
    );
  }  

  return (
    <main className='mx-2'>
      {/* toast */}
      <Toast ref={toast} />
      {/*presentacion*/}
      <section className='grid mt-2 w-full m-0'>
        <div className='col-12 lg:col-8'>
          <Carousel value={presentacion} circular autoplayInterval={10000}
            itemTemplate={presentacionTemplate} 
            page={1}
            />
        </div>
        <div className='col-12 lg:col-4 grid h-30rem lg:h-auto m-0'>
          <div className='col-12 block relative mb-1'>
            <Image src='/demo/images/promo/oferta.jpg' layout='fill' objectFit='cover'
              alt='oferta.jpg' className="img-oscuro-75" priority
            />
            <div className='absolute top-50 text-center w-full'>
              <h4 className='mb-4 text-0'>Ofertas</h4>
              <Link href="/#ofertas">
                <a className='p-link shadow-3 border-3 border-yellow-500 text-yellow-500 p-3 uppercase 
                  transition-delay-100 transition-colors transition-duration-300 hover:bg-yellow-500
                  hover:text-900'
                >
                  VER
                </a>
              </Link>
            </div>
          </div>
          <div className='col-12 block relative mb-1'>
            <Image src='/demo/images/promo/nuevoingreso.jpg' layout='fill' objectFit='cover'
              alt='oferta.jpg' className="img-oscuro-75" priority
            />
            <div className='absolute top-50 text-center w-full'>
              <h4 className='mb-4 text-0'>Mejores productos</h4>
              <Link href="/#mejoresproductos">
                <a className='p-link shadow-3 border-3 border-yellow-500 text-yellow-500 p-3 uppercase 
                  transition-delay-100 transition-colors transition-duration-300 hover:bg-yellow-500
                  hover:text-900'
                >
                  IR A
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/*info tienda */}
      <section className='bg-gray-900  mt-5 p-3'>
        <h1 className='text-white'>Music Store</h1>
        <p className='text-white'>Comprometidos en ofrecerte productos de calidad, de acuerdo a la demanda del mercado. 
          Ofreciendo amplia variedad y diversidad de equipos de alta tecnología y desde luego lo que necesites.
          Traemos lo mejor de lo mejor a Guatemala en instrumentos musicales y aparatos electrónicos.
          Enviamos a toda Guatemala, y es tan fácil que tus productos estarán a la puerta de tu casa a un click de distancia. 
          ¡Ordena ya!  
        </p>
      </section>
      {/*categorias */}
      <section className=' mt-5'>
        <h2>Categorías</h2>
        <hr />
        <div className='grid m-0'>
          {
            categorias.map((categoria) => (
              <div key={categoria.id} href='/tienda/'
                className='col-12 sm:col-6 md:col-4 lg:col-3 xl:col-2 mb-2'
                onClick={() => linkTiendaToCategoria(categoria)}
              >
                <Card subTitle={<span className='text-gray-900 no-underline hover:underline'>{categoria.titulo}</span>} header={headerCard(categoria)} 
                className='transition-delay-100 transition-all transition-duration-300 hover:shadow-5'
                />
              </div>
            ))
          }
        </div>
      </section>
      {/*mejores productos */}
      <section id="mejoresproductos" className=' mt-5'>
        <section className='bg-gray-900 mx-2 mt-5 p-3'>
          <h2 className='text-white'>Mejores productos</h2>
          <p className='text-white'>Nuestro escaparate de los productos mas vendidos y de la mejor calidad 
            seleccionados minuciosamente.  
          </p>
        </section>
        <hr />
        <div className="card">
          <Carousel value={mejoresProductos} numVisible={3} numScroll={1} responsiveOptions={responsiveOptions} 
            className="custom-carousel" circular
            autoplayInterval={5000} itemTemplate={productTemplate} 
          />
        </div>
      </section>
      {/*ofertas */}
      <section id="ofertas" className=' mt-5'>
        <section className='bg-gray-900 mx-2 mt-5 p-3'>
          <h2 className='text-white'>Ofertas</h2>
          <p className='text-white'>Queremos consentirte con nuestras ofertas de la semana.</p>
        </section>
        <hr />
        <div className="card">
          <Carousel value={ofertasProductos} numVisible={3} numScroll={1} responsiveOptions={responsiveOptions} 
            className="custom-carousel" circular
            autoplayInterval={5000} itemTemplate={productTemplate} 
          />
        </div>
      </section>
    </main>
  );
};

export default Inicio;