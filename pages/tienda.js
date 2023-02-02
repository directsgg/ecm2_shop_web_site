import { BreadCrumb } from 'primereact/breadcrumb';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Divider } from 'primereact/divider';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { Slider } from 'primereact/slider';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useState, useRef, useContext, useEffect } from 'react';
import Link from 'next/link';
import { getProductos, getProductosPorCategoria } from '../services/user/productoService';
import { LayoutContext } from '../layout/context/layoutcontext';
import { getCategorias } from '../services/user/categoriaService';

export default function Tienda({allProductosData} = {}) {
  const defautlRangoPrecio = [20, 600];
  const toast = useRef(null);
  const { setTotalCompra, carritoCompra, setCarritoCompra, 
    layoutConfig, setLayoutState, 
    globalSelectCategoria, setGlobalSelectCategoria } = useContext(LayoutContext);
  const [categorias, setCategorias] = useState([]);
  const [productosDataView, setProductosDataView] = useState(allProductosData);
  const [selectedCategoria, setSelectedCategoria] = useState({id: -1});
  const [rangoPrecio, setRangoPrecio] = useState(defautlRangoPrecio);
  const [layoutDataView, setLayoutDataView] = useState('grid');
  const [loadinDataView, setLoadingDataView] = useState(false);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);
  const sortOptions = [
    {
      label: 'Precio de mayor a menor',
      value: '!precio'
    },
    {
      label: 'Precio de menor a mayor',
      value: 'precio'
    }
  ];

  const onSortChange = (e) => {
    const value = e.value;

    if(value.indexOf('!') === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  }

  // - obtener categorias
  const obtenerCategorias = async () => {
    const _categorias = await getCategorias();
    if(_categorias !== undefined)
      setCategorias(_categorias);
    if(globalSelectCategoria[0] !== undefined){
      setSelectedCategoria(globalSelectCategoria[0]); 
      obtenerProductosPorCategoria(globalSelectCategoria[0]);
    }
  }

  useEffect(() => {
    obtenerCategorias();
  },[]);

  const obtenerProductosPorCategoria = async (_cat) => {
    if(_cat !== undefined) {
      setLoadingDataView(true);
      const _productos = await getProductosPorCategoria(_cat.titulo);
      if(_productos !== undefined)
        setProductosDataView(_productos);
      setLoadingDataView(false);
    }
  }

  const onCategoriaChange = (e) => {
    setSelectedCategoria(e.value)
    obtenerProductosPorCategoria(e.value)

    /*let _selectedCategorias = [...selectedCategorias];
    if(e.checked) {
      _selectedCategorias.push(e.value);
    }
    else {
      for (let i = 0; i < _selectedCategorias.length; i++) {
        const selectedCategoria = _selectedCategorias[i];
        if(selectedCategoria.id === e.value.id) {
          _selectedCategorias.splice(i, 1);
          break;
        }
      }
    }
    setSelectedCategorias(_selectedCategorias); */
  }

  const obtenerTodosProductos = async () => {
    setLoadingDataView(true);
    const _productos = await getProductos();
    setProductosDataView(_productos);
    setLoadingDataView(false);
  }

  const limpiarFiltrosProductos = () => {
    setSelectedCategoria({id: -1});
    obtenerTodosProductos();
  }

  const formatCurrency = (value) => {
    if(value === undefined) return 0;
    return value.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ'});
  };

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

  const porcentajeClassName = (rowData) => classNames({
    'text-red-400 font-bold': rowData.porcentajeDescuento > 0,
    'text-gray-300 font-bold': rowData.porcentajeDescuento === 0
  });

  const precioClassName = (rowData) => classNames({
    'line-through ': rowData.porcentajeDescuento > 0
  });

  const renderListItem = (data) => {
    return (
      <div className='col-12'>
        <div className="product-list-item">
          <Link href={`/producto/${data.id}`}>
              <a>
                <img src={data.imagenes[0].src} 
                  alt={data.nombre} 
                />
              </a>
          </Link>
          <div className='product-list-detail'>
            <Link href={`/producto/${data.id}`}>
              <a className='product-name text-700 hover:text-900 hover:underline block'>
                {data.nombre}
              </a>
            </Link>
            <i className='pi pi-tag product-category-icon'></i>
            <span className='product-category'>{data.categoria}</span>
          </div>
          <div className="product-list-action">
            <h6 className="product-price">
              {(data.porcentajeDescuento > 0)  &&
              <small className={porcentajeClassName(data)}>
                {data.porcentajeDescuento}%
              </small>} <span className={precioClassName(data)}>
                {formatCurrency(data.precio)}
              </span> 
            </h6>
            {(data.porcentajeDescuento > 0)  &&
              <h6 className="product-price">
                <span className={porcentajeClassName(data)}>
                  {formatCurrency(data.precioDescuento)}
                </span>
              </h6>
            }
            <Button icon='pi pi-shopping-cart' label='Comprar'
              disabled={data.estadoInventario === 'SIN-STOCK'} 
              onClick={() => anadirACarrito(data)} 
            />
            <Link href={`/producto/${data.id}`}>
              <Button  label="Ver" className='p-button-secondary ' />
            </Link>
            <span className={`product-badge status-${data.estadoInventario.toLowerCase()}`}>
              {data.estadoInventario}
            </span>
          </div>
        </div>
      </div> 
    );
  }

  const renderGridItem = (data) => {
    return (
      <div className="col-12 md:col-4 mb-3">
        <div className="product-grid-item card h-full transition-delay-100 transition-all transition-duration-300 hover:shadow-5">
          <div className='product-grid-item-top'>
            <div>
              <i className="pi pi-tag product-category-icon"></i>
              <span className='product-category'>{data.categoria}</span>
            </div>
            <span className={`product-badge status-${data.estadoInventario.toLowerCase()}`}>
              {data.estadoInventario}
            </span>
          </div>
          <div className="product-grid-item-content">
            <Link href={`/producto/${data.id}`}>
              <a>
                <img src={data.imagenes[0].src} 
                  alt={data.nombre} 
                />
              </a>
            </Link>
            <Link href={`/producto/${data.id}`}>
              <a className='product-name text-700 hover:text-900 hover:underline block'>
                {data.nombre}
              </a>
            </Link>
          </div>
          <div className="pproduct-grid-item-bottom">
            <h6 className="product-price">
              {(data.porcentajeDescuento > 0)  &&
              <small className={porcentajeClassName(data)}>
                {data.porcentajeDescuento}%
              </small>} <span className={precioClassName(data)}>
                {formatCurrency(data.precio)}
              </span> 
            </h6>
            {(data.porcentajeDescuento > 0)  &&
              <h6 className="product-price">
                <span className={porcentajeClassName(data)}>
                  {formatCurrency(data.precioDescuento)}
                </span>
              </h6>
            }
            <div className='flex flex-wrap align-items-stretch'>
              <Button icon='pi pi-shopping-cart' label='Comprar' className='block '
                disabled={data.estadoInventario === 'SIN-STOCK'}
                onClick={() => anadirACarrito(data)} 
              />
              <Link href={`/producto/${data.id}`}>
                <Button  label="Ver" className='p-button-secondary ml-1 mt-1' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const itemTemplate = (producto, layout) => {
    if(!producto) return;

    if(layout === 'list') 
      return renderListItem(producto);
    else if(layout === 'grid') 
      return renderGridItem(producto);
  }

  const header = (
    <div className="grid grid-nogutter">
      <div className="col-6" style={{textAlign: 'left'}}>
        
      </div>
      <div className='col-6' style={{textAlign: 'right'}}>
        <DataViewLayoutOptions layout={layoutDataView} onChange={(e) => setLayoutDataView(e.value)} />
      </div>
    </div>
  );

  const items = [
    { label: 'Tienda'},
  ]
  const home = {
    icon: 'pi pi-home',
    label: 'Inicio',
    command: () => {
      window.location.href='/'
    }
  }

  return (
    <>
      {/* toast */}
      <Toast ref={toast} />
      
      {/* Breadcrumb  */}
      <BreadCrumb className='mx-2 mt-5' model={items} home={home} />
      {/*main*/}
      <main className='mx-2 mt-2 '>
        <div className='dataview-productos'>
          <div className='card'>
            <h1>Tienda</h1>
            <div className="grid">
              <div className='col-fixed lg:col-2 mr-4 p-0 flex flex-column w-full lg:w-3'>
                <Divider>
                  <span>Filtros</span>
                </Divider>
                <Button label='Limpiar filtros' 
                  className='p-button-secondary mb-3 w-full sm:w-4 md:w-3 lg:w-full' 
                  onClick={limpiarFiltrosProductos}
                />
                <Accordion activeIndex={0} >
                  <AccordionTab header="Categorías">
                    {/*
                    <div key={categoria.id} className='field-checkbox'>
                            <Checkbox inputId={categoria.id} name='categoria'
                              value={categoria} onChange={onCategoriaChange}
                              checked={selectedCategorias.some((item) => item.id === categoria.id)}
                            />
                            <label htmlFor={categoria.id}>{categoria.titulo}</label>
                          </div> */
                      categorias.map((categoria) => {
                        return (
                          <div key={categoria.id} className='flex align-items-center mb-2'>
                            <RadioButton inputId={categoria.id} name='categoria'
                            value={categoria}
                            onChange={onCategoriaChange}
                            checked={selectedCategoria.id === categoria.id} 
                            />
                            <label htmlFor={categoria.id} className='ml-2'>{categoria.titulo}</label>
                          </div>
                        )
                      })
                    }
                  </AccordionTab>
                  <AccordionTab header="Precio">
                    <Slider value={rangoPrecio} onChange={(e) => setRangoPrecio(e.value)} 
                      max={defautlRangoPrecio[1]} range
                    />
                    <p className='my-3'>Rango: {formatCurrency(rangoPrecio[0])} - {formatCurrency(rangoPrecio[1])}</p>
                    <Dropdown options={sortOptions} value={sortKey}
                      optionLabel='label' placeholder='Ordenar por precio'
                      onChange={onSortChange} className='w-full'
                    />
                  </AccordionTab>
                </Accordion>
              </div> 
              <div className='col w-full mt-3 lg:mt-0' style={{minHeight: '25rem'}}>
                <DataView value={productosDataView} header={header} dataKey='id'
                  layout={layoutDataView} onChange={(e) => setLayoutDataView(e.value)} paginator rows={9}
                  itemTemplate={itemTemplate} loading={loadinDataView}
                  sortOrder={sortOrder} sortField={sortField} 
                  emptyMessage='No hay productos con la búsqueda asociada...' className='w-full'
                />
              </div> 
            </div>  
          </div>
        </div>
        {/*<Card title={<h1><span className='text-yellow-500 text-7xl'>T</span>ienda</h1>}>
          <section id='tienda' className='grid m-0'>
            
          </section>
        </Card>  */}
      </main>  
    </>
  );
};


export async function getStaticProps() {
  let allProductosData = await getProductos();
  
  return {
    props: {
      allProductosData
    },
  };
}