import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { Tooltip } from 'primereact/tooltip';
import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';
import { FileUpload } from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ScrollPanel } from 'primereact/scrollpanel';
import { OrderList } from 'primereact/orderlist';
import { Message } from 'primereact/message';
import { getDownloadURL } from 'firebase/storage';
import { getCategorias } from '../../../../services/admin/categoriaService';
import { getProductos, setProducto,
  updateProducto, deleteProducto,
  setImageProductoDb, deleteImageProductoDb } from '../../../../services/admin/productoService';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { authFirebase } from '../../../../services/firebaseConfig/firebase';

  const ProductosPage = () => {
  const productoVacio = {
    id: null,
    nombre: '',
    descripcion: '',
    imagenes: [],
    precio: 0,
    porcentajeDescuento: 0,
    precioDescuento: 0,
    categoria: '',
    estadoInventario: '',
    mejorProducto: false
  }
  const dataEstadosInventario = [
    'EN-STOCK', 'BAJO-STOCK', 'SIN-STOCK'
  ]
  //1 - configurar los hooks
  const toast = useRef(null);
  const dt = useRef(null);
  const fileUploadRef = useRef(null);
  const [dataCategorias, setDataCategorias] = useState([]);
  const [productosDataTable, setProductosDataTable] = useState([]);
  const [viewDialogDetalles, setViewDialogDetalles] = useState(false);
  const [viewDialogDelete, setViewDialogDelete] = useState(false);
  const [productoData, setProductoData] = useState(productoVacio);
  const [submitted, setSubmitted] = useState(false);
  const [loadingBtnGuardar, setLoadingBtnGuardar] = useState(false);
  const [loadingDataTable, setLoadingDataTable] = useState(true);
  const [blockPanelUpload, setBlockPanelUpload] = useState(false);
  const [blockPanelEdit, setBlockPanelEdit] = useState(false);
  const [stateImgAdd, setStateImgAdd] = useState(false);
  const [user] = useAuthState(authFirebase);
  const router = useRouter();
  // - obtener datos db
  const obtenerProductos = async () => {
    let _productos = await getProductos();
    if(_productos === undefined) _productos = [];
    setProductosDataTable(_productos);
    setLoadingDataTable(false);
  }

  // - obtener categorias db
  const obtenerCategorias = async () => {
    const _categorias = await getCategorias();
    if (_categorias !== undefined) {
      const _dataCategorias = _categorias.map((_categoria) => _categoria.titulo);
      setDataCategorias(_dataCategorias);
    }
  }

  // - usamos useEffect
  useEffect(() =>{
    if(!user) {
      router.push('/auth/login/');
    }else {
      obtenerCategorias();
      obtenerProductos();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // - guardar datos db
  const guardarDatosDb = async () => {
    setSubmitted(true);
    if(productoData.nombre.trim() && productoData.imagenes.length > 0 &&
      productoData.descripcion.trim() &&
      productoData.estadoInventario.trim() && productoData.precio > 0) {
      setLoadingBtnGuardar(true);
      const _producto  = {...productoData};
      //const _productos = [...productosDataTable];
      if(productoData.id !== null) {
        // actualizar
        await updateProducto(_producto).then(() => {
          obtenerProductos();
          setViewDialogDetalles(false);
          setProductoData(productoVacio);
          setSubmitted(false);
          toast.current.show({
            severity: 'success', 
            summary: '¡Hecho!', 
            detail: 'Datos actualizados'
          });
        }).catch(() => {
          toast.current.show({
            severity: 'error', 
            summary: 'Error', 
            detail: 'Fallo al guardar, intente de nuevo'
          });
        })
        
        setLoadingBtnGuardar(false);
      }
      else {
        // guardar 
        await setProducto(_producto).then(() => {
          obtenerProductos();
          setViewDialogDetalles(false);
          setProductoData(productoVacio);
          setSubmitted(false);
          toast.current.show({
            severity: 'success', 
            summary: '¡Hecho!', 
            detail: 'Datos guardados'
          });
        }).catch(() => {
          toast.current.show({
            severity: 'error', 
            summary: 'Error', 
            detail: 'Fallo al guardar, intente de nuevo'
          });
        });
        setLoadingBtnGuardar(false);
      }
    }
  }

  // - eliminar datos db
  const confirmacionEliminar = async () => {
    const lengthFiles = productoData.imagenes.length;
    for (const i = 0; i < lengthFiles; i++) {
      await deleteImageProductoDb(productoData.imagenes[i].pathFile).then(() => {
        if((i + 1)  === lengthFiles){
          // file deleted successfully

          deleteProducto(productoData.id).then(() => {
            // data deleted successfully
            obtenerProductos();
            setViewDialogDelete(false);
            setProductoData(productoVacio);
            toast.current.show({ 
              severity: 'success', 
              summary: 'Exito!', 
              detail: 'Eliminado'
            });
          }).catch(() => {
            toast.current.show({
              severity: 'error', 
              summary: 'Error', 
              detail: 'Fallo al eliminar , intente de nuevo'
            });
          });
        }
      }).catch(() => {
        toast.current.show({
          severity: 'error', 
          summary: 'Error', 
          detail: 'Fallo al eliminar , intente de nuevo'
        });
      });
    }
  }

  // - subir archivos
  const customUploader = async (e) => {
    setBlockPanelUpload(true);
    const lengthFiles = e.files.length;
    
    for (const i = 0; i < lengthFiles; i++) {
      const file = e.files[i];
      const _pathFile = `${Date.now()}/${file.name}`;
      const uploadTask = setImageProductoDb(_pathFile, file);
      uploadTask.on('state_changed', () => {},
      () => {
        if((i + 1)  === lengthFiles) {
          setBlockPanelUpload(false);
          setStateImgAdd(false);
        }
        toast.current.show(
          { severity: 'error', 
            summary: 'Error', 
            detail: `Fallo al subir imagen: ${file.name}, intente de nuevo`
          }
        );
      },
      () => {
        if((i + 1) === lengthFiles) {
          setBlockPanelUpload(false);
          setStateImgAdd(false);
        }
        // upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          const imagenesProductoData = productoData.imagenes;
          imagenesProductoData.push({ src: downloadURL, pathFile: _pathFile});
          
          setProductoData({...productoData, 
            imagenes: imagenesProductoData});
        }).catch(() => {
          toast.current.show(
            { severity: 'error', 
              summary: 'Error al subir imagen', 
              detail: 'Porfavor contacteme si ocurre este error'
            }
          );
        });
      })
    }
  }
  // - eliminar archivos
  const onEliminarImagenStorage = async (_itemImage) => {
    setBlockPanelEdit(true);
    await deleteImageProductoDb(_itemImage.pathFile).then(() => {
      // file deleted successfully
      const _imagenes = productoData.imagenes.filter(val => val.pathFile !== _itemImage.pathFile);
      setProductoData({...productoData, imagenes: _imagenes});
    }).catch(() => {
      // error ocurred
      toast.current.show(
        { severity: 'error', 
          summary: 'Error', 
          detail: 'Fallo al eliminar imagen, intente de nuevo'
        }
      );
    });
    setBlockPanelEdit(false);
  }


  // - input change
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _data = {...productoData};
    _data[`${name}`] = val;
    setProductoData(_data);
  }
  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _data = {...productoData};
    _data[`${name}`] = val;
    if(name === 'porcentajeDescuento') {
      const _precioDescuento = _data.precio - (_data.precio * (_data.porcentajeDescuento / 100));
      _data.precioDescuento = _precioDescuento;
    }
    setProductoData(_data);
  }
  const onEstadoInventarioChange = (e) => {
    setProductoData({...productoData, estadoInventario: e.value});
  }
  const onCategoriaChange = (e) => {
    setProductoData({...productoData, categoria: e.value});
  }

  // modal dialog configuracion
  const abrirDialogoNuevo = () => {
    setProductoData(productoVacio);
    setSubmitted(false);
    setViewDialogDetalles(true);
  }
  const ocultarDialogoNuevo = () => {
    setSubmitted(false);
    setViewDialogDetalles(false);
  }
  const abrirDialogoEditar = (_data) => {
    setProductoData(_data);
    setViewDialogDetalles(true);
  }

  const abrirDialogoEliminar = (_data) => {
    setProductoData(_data);
    setViewDialogDelete(true);
  }
  const ocultarDialogoEliminar = () => {
    setViewDialogDelete(false);
  }

  // ---templates---
  const formatCurrency = (value) => {
    if(value === undefined) return 0;
    return value.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ'});
  };
    // toolbar
  const leftToolbarTemplate = () => {
    return (
      <Button label='Nuevo' icon='pi pi-plus' 
        className='p-button-primary mr-2' 
        onClick={abrirDialogoNuevo} 
      />
    )
  }
    // datatable
  const accionBodyTemplate = (rowData) => {
    return (
      <>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-success mr-2" 
          onClick={() => abrirDialogoEditar(rowData)} 
        />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-warning" 
          onClick={() => abrirDialogoEliminar(rowData)} 
        />
      </>
    );
  }
  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.imagenes[0].src} 
     alt={`${rowData.nombre}.img`} className="h-8rem" 
    />;
  }
  const descripcionBodyTemplate = (rowData) => {
    return (
      <ScrollPanel style={{height: '8rem'}}>
        <p>{rowData.descripcion}</p>
      </ScrollPanel>
    );
  }
  const nombreBodyTemplate = (rowData) => {
    return (
      <ScrollPanel style={{height: '8rem'}}>
        <p>{rowData.nombre}</p>
      </ScrollPanel>
    );
  }
  const mejorProductoBodyTemplate = (rowData) => {
    return (
      <Checkbox checked={rowData.mejorProducto} disabled />
    );
  }
  const precioBodyTemplate = (rowData) => {
    const precioClassName = classNames({
      'line-through ': rowData.porcentajeDescuento > 0
    });
    if(rowData.precio === undefined) rowData.precio = 0;
    return (
      <div className={precioClassName}>
        {formatCurrency(rowData.precio)}
      </div>
    )
  }

  const porcentajeDescuentoBodyTemplate = (rowData) => {
    if(rowData.porcentajeDescuento === undefined) rowData.porcentajeDescuento = 0;
    const porcentajeClassName = classNames({
      'text-red-400 font-bold': rowData.porcentajeDescuento > 0,
      'text-gray-300 font-bold': rowData.porcentajeDescuento === 0
    });
    return (
      <div className={porcentajeClassName}>
        {rowData.porcentajeDescuento}%
      </div>
    );
  }

  const precioDescuentoBodyTemplate = (rowData) => {
    if(rowData.precioDescuento === undefined) rowData.precioDescuento = 0;
    const porcentajeClassName = classNames({
      'text-red-400 font-bold': rowData.porcentajeDescuento > 0,
      'text-gray-300 font-bold': rowData.porcentajeDescuento === 0
    });
    return (
      <div className={porcentajeClassName}>
        {formatCurrency(rowData.precioDescuento)}
      </div>
    );

  }

    // dialog
  const templateDialogDetalleFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" 
        className="p-button-text" 
        onClick={ocultarDialogoNuevo} 
      />
      <Button label="Guardar" icon="pi pi-check" 
        className="p-button-text" onClick={guardarDatosDb} 
        disabled={blockPanelUpload} loading={loadingBtnGuardar}
      />
    </>
  );
  const templateDialogEliminarFooter = (
    <>
      <Button label="No" icon="pi pi-times" 
        className="p-button-text" onClick={ocultarDialogoEliminar} 
      />
      <Button label="Si" icon="pi pi-check" 
        className="p-button-text" onClick={confirmacionEliminar} 
      />
    </>
  );
  
    // imagen 
      // upload property
  const headerFileUploadTemplate = (options) => {
    const { className, chooseButton } = options;
    return (
        <div className={className} 
          style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}
        >
          {chooseButton}
        </div>
    );
  };
  const itemTemplate = (file, props) => {
    return (
      <div className="text-center p-0">
        {file.name}
      </div>
    );
  };
  const emptyTemplate = () => {
    return (
        <div className="flex align-items-center flex-column">
            <i className="pi pi-image mt-3 p-5" 
              style={{ fontSize: '5em', borderRadius: '50%', 
                backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}
            ></i>
            <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                Arrastre y Suelte las imagenes aquí, ó presione sobre el icono de la imagen.
            </span>
        </div>
    );
  };
  const chooseOptions = { 
    icon: 'pi pi-fw pi-images', iconOnly: true, 
    className: 'w-3rem custom-choose-btn p-button-rounded p-button-outlined' 
  };
      //upload main
  const templateBlockUI = (
    <div className='flex flex-column'>
      <ProgressSpinner />
      <p className='text-50 bg-gray-900 p-3 border-round-xl'>Cargando imagen(es) por favor espere...</p>
    </div>
  );  
  const templateImgNew = (
    <BlockUI blocked={blockPanelUpload} template={templateBlockUI}>
      <Tooltip target=".custom-choose-btn" content="Elegir"/>
      <FileUpload ref={fileUploadRef} name='demo[]' accept='image/*' customUpload multiple
        maxFileSize={10000000} uploadHandler={customUploader} auto
        headerTemplate={headerFileUploadTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        className={classNames({ 'border-1 border-red-600' : submitted && !productoData.imagenes.length > 0 })} 
      />
      {submitted && !productoData.imagenes.length > 0 && 
        <small className='p-error'>Imagen(es) requerida(s).</small>
      }
    </BlockUI>
  );

  const onChangeOrderListImage = (e) => {
    setProductoData({...productoData, imagenes: e.value});
  }

  const itemTemplateOrderListImage = (_item) => {
    return (
      <div className='relative text-center '>
        <img alt={_item.src} role="presentation" src={_item.src} style={{width: '100%'}} />
        <div className='absolute top-0 left-50 bg-gray-900 p-2 border-round-xl'>
          <Button type="button" icon="pi pi-times" tooltip='Eliminar imagen'
            className=" p-button-rounded p-button-danger w-3rem " 
            onClick={() => onEliminarImagenStorage(_item)} 
          />
        </div>
      </div>
      
    )
  }

  const templateImgEdit = (
    <BlockUI blocked={blockPanelEdit} template={templateBlockUI}>
    <div className='h-auto md:h-30rem'>
    <OrderList value={productoData.imagenes} itemTemplate={itemTemplateOrderListImage}
      onChange={onChangeOrderListImage} 
    />
    <Button label='Añadir imagen' className='p-button-secondary p-button-outlined'
      onClick={() => setStateImgAdd(true)} />
    </div>
    </BlockUI>
  );

  return (
    <div className='datatable-crud-demo '>
      <Toast ref={toast} />

      <Card className='shadow-8 border-round-xl' title='Administrar productos'>
        <Toolbar className='mb-4' left={leftToolbarTemplate} ></Toolbar>
        <DataTable ref={dt} value={productosDataTable} size='small' 
          dataKey='id' emptyMessage="No hay registros..."
          responsiveLayout='scroll' loading={loadingDataTable} 
        >
          <Column header='Nombre' body={nombreBodyTemplate}></Column>
          <Column header='✔Mejor' body={mejorProductoBodyTemplate}></Column>
          <Column header='Descripcion' body={descripcionBodyTemplate}></Column>
          <Column header='Precio' body={precioBodyTemplate}></Column>
          <Column header='% Oferta' body={porcentajeDescuentoBodyTemplate}></Column>
          <Column header='Descuento' body={precioDescuentoBodyTemplate}></Column>
          <Column field='categoria' header='Categoria'></Column>
          <Column field='estadoInventario' header='Inventario'></Column>
          <Column header='Imagen principal' body={imageBodyTemplate}></Column>
          <Column body={accionBodyTemplate}></Column>
        </DataTable>
      </Card>

      <Dialog visible={viewDialogDetalles} maximizable
        header='Detalles producto' modal className='p-fluid w-12 h-full' 
        footer={templateDialogDetalleFooter} onHide={ocultarDialogoNuevo}
      >
        <div className='grid'>
          <div className='col-12 md:col-6'>
            <Message text="Recuerde guardar cada vez que hace cambios en la imagen." />
            {(productoData.imagenes.length <= 0 || stateImgAdd) ? templateImgNew :templateImgEdit }
          </div>
          <div className='col-12 md:col-6'>
            <div className='formgrid grid'>
            <div className='field col-12'>
              <label htmlFor='nombre'>Nombre</label>
              <InputText id='nombre' value={productoData.nombre} 
                onChange={(e) => onInputChange(e, 'nombre')} required autoFocus 
                className={classNames({ 'p-invalid' : submitted && !productoData.nombre })} 
              />
              {submitted && !productoData.nombre && 
                <small className='p-error'>Nombre requerido.</small>
              }
            </div>
            <div className="field col-12">
              <label htmlFor="descripcion">Descripcion</label>
              <InputTextarea id="descripcion" value={productoData.descripcion} 
                onChange={(e) => onInputChange(e, 'descripcion')} required rows={10} cols={20} 
                className={classNames({ 'p-invalid' : submitted && !productoData.descripcion })} 
              />
              {submitted && !productoData.descripcion && 
                <small className='p-error'>Descripcion requerido.</small>
              }
            </div>
            <div className='field col-12 md:col-6'>
              <label htmlFor='categorias'>Categoría</label>
              <Dropdown id='categorias' value={productoData.categoria} 
                options={dataCategorias} onChange={onCategoriaChange}
              />
            </div>
            <div className='field col-12 md:col-6'>
              <label htmlFor='estadoInventario'>Inventario</label>
              <Dropdown id='estadoInventario' value={productoData.estadoInventario} 
                options={dataEstadosInventario} onChange={onEstadoInventarioChange}
                className={classNames({ 'p-invalid' : submitted && !productoData.estadoInventario })} 
              />
              {submitted && !productoData.estadoInventario && 
                <small className='p-error'>Estado inventario requerido.</small>
              }
            </div>

            <div className="field col-12 md:col-6">
              <label htmlFor="precio">Precio</label>
              <InputNumber id="precio" value={productoData.precio } 
                onValueChange={(e) => onInputNumberChange(e, 'precio')} required 
                mode="currency" currency="GTQ" locale="es-GT"
                className={classNames({ 'p-invalid' : submitted && !productoData.precio })} 
              />
              {submitted && !productoData.precio && 
                <small className='p-error'>Precio requerido.</small>
              }
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="porcentajeDescuento">
                Descuento: {(productoData.precioDescuento > 0) && formatCurrency(productoData.precioDescuento)}
               </label>
              <InputNumber id="porcentajeDescuento" value={productoData.porcentajeDescuento } 
                onValueChange={(e) => onInputNumberChange(e, 'porcentajeDescuento')} 
                prefix="%"
              />
            </div>
            <div className="field col-12 md:col-6 flex align-items-center">
              <Checkbox id='mejorProducto' checked={productoData.mejorProducto}
                onChange={e => setProductoData({...productoData, mejorProducto: e.checked})}
              />
              <label htmlFor="mejorProducto">✔Mejor Producto</label>
            </div>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog visible={viewDialogDelete} className='w-12 md:w-6 lg:w-4' 
        header='Confirmar' modal footer={templateDialogEliminarFooter} 
        onHide={ocultarDialogoEliminar} 
      >
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem'}} />
          {productoData && <span>¿Seguro que desea eliminar <b>{productoData.nombre}</b> ?</span>}
        </div>
      </Dialog>
    </div>
  )
}
ProductosPage.getLayoutAdmin = function getLayout(page) {
  return page;
};
export default ProductosPage