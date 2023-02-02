import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tooltip } from 'primereact/tooltip';
import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';
import { FileUpload } from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getDownloadURL } from 'firebase/storage';
import { getCategorias, setCategoria, 
    updateCategoria, deleteCategoria, 
    setImageCategoriaDb, deleteImageCategoriaDb } from '../../../../services/admin/categoriaService';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { authFirebase } from '../../../../services/firebaseConfig/firebase';

const CategoriasPage = () => {
  const categoriaVacio = {
    id: null,
    titulo: '',
    redireccion: '',
    imagen: '',
    pathFile: '',
    orden: 0
  }
  //1 - configurar los hooks
  const toast = useRef(null);
  const dt = useRef(null);
  const fileUploadRef = useRef(null);
  const [categoriasDataTable, setCategoriasDataTable] = useState([]);
  const [viewDialogDetalles, setViewDialogDetalles] = useState(false);
  const [viewDialogDelete, setViewDialogDelete] = useState(false);
  const [categoriaData, setCategoriaData] = useState(categoriaVacio);
  const [submitted, setSubmitted] = useState(false);
  const [loadingBtnGuardar, setLoadingBtnGuardar] = useState(false);
  const [loadingDataTable, setLoadingDataTable] = useState(true);
  const [blockPanelUpload, setBlockPanelUpload] = useState(false);
  const [user] = useAuthState(authFirebase);
  const router = useRouter();

  // - obtener datos db
  const obtenerCategorias = async () => {
    const _categorias = await getCategorias();
    if(_categorias === undefined) _categorias = [];
    setCategoriasDataTable(_categorias);
    setLoadingDataTable(false);
  }

  // - usamos useEffect
  useEffect(() =>{
    if(!user) {
      router.push('/auth/login/');
    }else {
      obtenerCategorias();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // - guardar datos db
  const guardarCategoria = async () => {
    setSubmitted(true);
    if(categoriaData.titulo.trim() && categoriaData.imagen.trim()) {
      setLoadingBtnGuardar(true);
      const _categoria  = {...categoriaData};
      const _categorias = [...categoriasDataTable];
      if(categoriaData.id !== null) {
        // actualizar
        await updateCategoria(_categoria).then(() => {
          obtenerCategorias();
          setViewDialogDetalles(false);
          setCategoriaData(categoriaVacio);
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
        await setCategoria(_categoria).then(() => {
          obtenerCategorias();
          setViewDialogDetalles(false);
          setCategoriaData(categoriaVacio);
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
        })
        setLoadingBtnGuardar(false);
      }
    }
  }

  // - eliminar datos db
  const confirmacionEliminar = async () => {
    await deleteImageCategoriaDb(categoriaData.pathFile). then(() => {
      // file deleted successfully
      deleteCategoria(categoriaData.id).then(() => {
        // data deleted successfully
        obtenerCategorias();
        setViewDialogDelete(false);
        setCategoriaData(categoriaVacio);
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
    }).catch(() => {
      // error ocurred!
      toast.current.show(
        { severity: 'error', 
          summary: 'Error', 
          detail: 'Fallo al eliminar imagen, intente de nuevo'
        }
      );
    });
  }

  // - subir archivos
  const customUploader = async (e) => {
    setBlockPanelUpload(true);
    const file = e.files[0];
    const _pathFile = `${Date.now()}/${file.name}`;
    const uploadTask = setImageCategoriaDb(_pathFile, file);
    // register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. error observer, called on failure
    // 3. completion observer, called on successful completion
    uploadTask.on('state_changed', () => {}, 
      () => {
        setBlockPanelUpload(false);
        toast.current.show(
          { severity: 'error', 
            summary: 'Error', 
            detail: 'Fallo al subir imagen, intente de nuevo'
          }
        );
      },
      () => {
        setBlockPanelUpload(false);
        // upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          setCategoriaData({...categoriaData, imagen: downloadURL, pathFile: _pathFile});
        })
        .catch(() => {
          toast.current.show(
            { severity: 'error', 
              summary: 'Error al subir imagen', 
              detail: 'Porfavor contacteme si ocurre este error'
            }
          );
        });
      }
    );
  }
  // - eliminar archivos
  const onEliminarImagenStorage = async () => {
    await deleteImageCategoriaDb(categoriaData.pathFile). then(() => {
      // file deleted successfully
      setCategoriaData({...categoriaData, imagen: '', pathFile: ''});
    }).catch(() => {
      // error ocurred!
      toast.current.show(
        { severity: 'error', 
          summary: 'Error', 
          detail: 'Fallo al eliminar imagen, intente de nuevo'
        }
      );
    });
  }

  // - input change
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _categoria = {...categoriaData};
    _categoria[`${name}`] = val;
    setCategoriaData(_categoria);
  }

  // modal dialog configuracion
  const abrirDialogoNuevo = () => {
    setCategoriaData(categoriaVacio);
    setSubmitted(false);
    setViewDialogDetalles(true);
  }
  const ocultarDialogoNuevo = () => {
    setSubmitted(false);
    setViewDialogDetalles(false);
  }
  const abrirDialogoEditar = (_data) => {
    setCategoriaData(_data);
    setViewDialogDetalles(true);
  }

  const abrirDialogoEliminar = (_data) => {
    setCategoriaData(_data);
    setViewDialogDelete(true);
  }
  const ocultarDialogoEliminar = () => {
    setViewDialogDelete(false);
  }

  // ---templates---
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
    return <img src={rowData.imagen} 
     alt={`${rowData.titulo}.img`} className="w-8rem" 
    />;
  }
    // dialog
  const templateDialogDetalleFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" 
        className="p-button-text" 
        onClick={ocultarDialogoNuevo} 
      />
      <Button label="Guardar" icon="pi pi-check" 
        className="p-button-text" onClick={guardarCategoria} 
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
        <div className="flex align-items-center flex-wrap">
            <div className="flex flex-column align-items-center w-full" >
                <img alt={file.name} role="presentation" src={file.objectURL} className='w-full sm:w-30rem  ' />
                <div className='flex flex-column align-items-center sm:flex-row justify-content-around  w-full'>
                  <span className="flex flex-column text-left ml-3">
                    {file.name}
                    <small>{new Date().toLocaleDateString()}</small>
                  </span>
                  <Tag value={props.formatSize} severity="info" className="px-3 py-2" />
                  <Button type="button" icon="pi pi-times" 
                    className="p-button-outlined p-button-rounded p-button-danger mt-2 sm:mt-0 w-3rem" 
                    onClick={() => onTemplateRemove(file, props.onRemove)} 
                  />
                </div>
            </div>
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
                Arrastre y Suelte una imagen aquí, ó presione sobre el icono de la imagen.
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
      <p className='text-50 bg-gray-900 p-3 border-round-xl'>Cargando imagen por favor espere...</p>
    </div>
  );  
  const templateImgNew = (
    <BlockUI blocked={blockPanelUpload} template={templateBlockUI}>
      <Tooltip target=".custom-choose-btn" content="Elegir"/>
      <FileUpload ref={fileUploadRef} name='demo[]' accept='image/*' customUpload auto
        maxFileSize={10000000} uploadHandler={customUploader}
        headerTemplate={headerFileUploadTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        className={classNames({ 'border-1 border-red-600' : submitted && !categoriaData.imagen })} 
      />
      {submitted && !categoriaData.imagen && 
        <small className='p-error'>Imagen es requerido.</small>
      }
    </BlockUI>
  );
  const templateImgEdit = (
    <div className="flex align-items-center flex-wrap border-1 border-round-xl p-3 border-300">
      <div className="flex flex-column align-items-center w-full" >
        <img alt={categoriaData.titulo} role="presentation" src={categoriaData.imagen} className='w-full sm:w-30rem  ' />
        <div className='text-center mt-2'>
          <Button type="button" icon="pi pi-times" tooltip='Eliminar imagen'
            className="p-button-outlined p-button-rounded p-button-danger mt-2 sm:mt-0 w-3rem" 
            onClick={() => onEliminarImagenStorage()} 
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className='datatable-crud-demo '>
      <Toast ref={toast} />

      <Card className='shadow-8 border-round-xl' title='Administrar categorias'>
        <Toolbar className='mb-4' left={leftToolbarTemplate} ></Toolbar>
        <DataTable ref={dt} value={categoriasDataTable} size='small' 
          dataKey='id' emptyMessage="No hay registros..."
          responsiveLayout='scroll' loading={loadingDataTable} 
        >
          <Column field='titulo' header='Título'></Column>
          <Column header='Imagen' body={imageBodyTemplate}></Column>
          <Column body={accionBodyTemplate}></Column>
        </DataTable>
      </Card>

      <Dialog visible={viewDialogDetalles} 
        header='Detalles categoría' modal className='p-fluid w-11 lg:w-8' 
        footer={templateDialogDetalleFooter} onHide={ocultarDialogoNuevo}
      >
        {categoriaData.imagen ? templateImgEdit : templateImgNew}
        
        <div className='formgrid grid mt-3'>
          <div className='field col-12'>
            <label htmlFor='titulo'>Título</label>
            <InputText id='titulo' value={categoriaData.titulo} 
              onChange={(e) => onInputChange(e, 'titulo')} required autoFocus 
              className={classNames({ 'p-invalid' : submitted && !categoriaData.titulo })} 
            />
            {submitted && !categoriaData.titulo && 
              <small className='p-error'>Titulo es requerido.</small>
            }
          </div>
        </div>
      </Dialog>
      <Dialog visible={viewDialogDelete} className='w-12 md:w-6 lg:w-4' 
        header='Confirmar' modal footer={templateDialogEliminarFooter} 
        onHide={ocultarDialogoEliminar} 
      >
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem'}} />
          {categoriaData && <span>¿Seguro que desea eliminar <b>{categoriaData.titulo}</b> ?</span>}
        </div>
      </Dialog>
    </div>
  )
}
CategoriasPage.getLayoutAdmin = function getLayout(page) {
  return page;
};
export default CategoriasPage