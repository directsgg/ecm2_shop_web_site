import React, { useState, useEffect, useRef} from 'react'
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
import { setImageCarruselDb, updateCarruseles, getCarruseles, deleteImageCarruselDb } from '../../../../services/admin/carruselService';
import { getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { authFirebase } from '../../../../services/firebaseConfig/firebase';

const Carrusel = () => {
  const carruselVacio = {
    id: null,
    titulo: '',
    descripcion: '',
    tituloAccion: '',
    redireccion: '',
    imagen: '',
    pathFile: ''
  };

  //1 - configurar los hooks
  const toast = useRef(null);
  const dt = useRef(null);
  const fileUploadRef = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const [loadingDataTableCarrusel, setLoadingDataTableCarrusel] = useState(true);
  const [carruselesDataTable, setCarruselesDataTable] = useState([]);
  const [carruselDialog, setCarruselDialog] = useState(false);
  const [deleteCarruselDialog, setDeleteCarruselDialog] = useState(false);
  const [carruselLayout, setCarruselLayout] = useState(carruselVacio);
  const [submitted, setSubmitted] = useState(false);
  const [loadingBtnGuardar, setLoadingBtnGuardar] = useState(false);
  const [blockPanelUpload, setBlockPanelUpload] = useState(false);
  const [user] = useAuthState(authFirebase);
  const router = useRouter();
  //3 - funcion para mostrar TODOS los datos
  const getLayoutCarruseles = async () =>{
    let _carruseles = await getCarruseles();
    if(_carruseles === undefined) _carruseles = [];
    setCarruselesDataTable(_carruseles);
    setLoadingDataTableCarrusel(false);
  }

  const findIndexById = (id) => {
    let index = -1;
    const carrouselesLength = carruselesDataTable.length;
    for(let i = 0; i < carrouselesLength; i++) {
      if (carruselesDataTable[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  }
   
  const guardarCarrusel = () => {
    setSubmitted(true);
    if(carruselLayout.titulo.trim()  && carruselLayout.descripcion.trim()  &&
      carruselLayout.redireccion.trim() && carruselLayout.imagen.trim()) {
      setLoadingBtnGuardar(true);
      const _carrusel  = {...carruselLayout};
      const _carruseles = [...carruselesDataTable];
      if(carruselLayout.id !== null) {
        const _id = _carrusel.id;
        const index = findIndexById(_id);
        _carruseles[index] = _carrusel;
      }
      else {
        _carrusel.id = Date.now().toString();
        _carruseles.push(_carrusel);
      }

      updateCarruseles(_carruseles).then(() => {
        setLoadingBtnGuardar(false);
        // updated successfully
        toast.current.show({
          severity: 'success', 
          summary: '¡Hecho!', 
          detail: 'Datos actualizados'
          
        });
        setCarruselesDataTable(_carruseles);
        setCarruselDialog(false);
        setCarruselLayout(carruselVacio);
        setSubmitted(false);
      }).catch((error) => {
        setLoadingBtnGuardar(false);
        toast.current.show({
          severity: 'error', 
          summary: 'Error', 
          detail: 'Fallo al actualizar, intente de nuevo'
        });
      })
    }
  }
  //4 - eliminar
  const confirmacionEliminarCarrusel = async () => {
    await deleteImageCarruselDb(carruselLayout.pathFile). then(() => {
      // file deleted successfully
      const _carruseles = carruselesDataTable.filter(val => val.id !== carruselLayout.id);
      // update carruseles
      updateCarruseles(_carruseles).then(() => {
        setCarruselesDataTable(_carruseles);
        setDeleteCarruselDialog(false);
        setCarruselLayout(carruselVacio);
        toast.current.show({ 
          severity: 'success', 
          summary: 'Exito!', 
          detail: 'Eliminado'
        });
      }).catch(() => {
        toast.current.show({
          severity: 'error', 
          summary: 'Error', 
          detail: 'Fallo al eliminar imagen, intente de nuevo'
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

  //6 - usamos useEffect
  useEffect(() =>{
    if(!user) {
      router.push('/auth/login/');
    }else {
      getLayoutCarruseles();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // modal dialog configuracion
  const abrirDialogoNuevoCarrusel = () => {
    setCarruselLayout(carruselVacio);
    setSubmitted(false);
    setCarruselDialog(true);
  }

  const ocultarDialogoNuevoCarrusel = () => {
    setSubmitted(false);
    setCarruselDialog(false);
  }

  const ocultarDialogoEliminarCarrusel = () => {
    setDeleteCarruselDialog(false);
  }

  const abrirDialogoEditarCarrusel = (_carrusel) => {
    setCarruselLayout({..._carrusel});
    setCarruselDialog(true);
  }

  const abrirDialogoEliminarCarrusel = (_carrusel) => {
    setCarruselLayout(_carrusel);
    setDeleteCarruselDialog(true);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _carrusel = {...carruselLayout};
    if(name === 'tituloAccion') val = val.toUpperCase();
    _carrusel[`${name}`] = val;
    setCarruselLayout(_carrusel);
  }

  const leftToolbarTemplate = () => {
    return (
      <Button label='Nuevo' icon='pi pi-plus' 
        className='p-button-primary mr-2' onClick={abrirDialogoNuevoCarrusel} 
      />
    )
  }

  const accionBodyTemplate = (rowData) => {
    return (
      <>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-success mr-2" 
          onClick={() => abrirDialogoEditarCarrusel(rowData)} 
        />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-warning" 
          onClick={() => abrirDialogoEliminarCarrusel(rowData)} 
        />
      </>
    );
  }

  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.imagen} 
     alt={rowData.titulo} className="w-8rem" 
    />;
  }

  const nuevoCarruselDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" 
        className="p-button-text" onClick={ocultarDialogoNuevoCarrusel} 
      />
      <Button label="Guardar" icon="pi pi-check" 
        className="p-button-text" onClick={guardarCarrusel} 
        disabled={blockPanelUpload} loading={loadingBtnGuardar}
      />
    </>
  );

  const eliminarCarruselDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" 
        className="p-button-text" onClick={ocultarDialogoEliminarCarrusel} 
      />
      <Button label="Si" icon="pi pi-check" 
        className="p-button-text" onClick={confirmacionEliminarCarrusel} 
      />
    </>
  );

  const onRowReorder = async (e) => {
    setLoadingDataTableCarrusel(true);
    // update carruseles
    await updateCarruseles(e.value).then(() => {
      setCarruselesDataTable(e.value);
      toast.current.show(
      {
        severity:'success', 
        summary: 'Reordenado', 
        life: 3000
      });
    }).catch(() => {
      toast.current.show({
        severity: 'error', 
        summary: 'Error', 
        detail: 'Fallo al ordenar, intente de nuevo'
      });
    });
    setLoadingDataTableCarrusel(false);
  }

  const onTemplateSelect = (e) => {
    /*let _totalSize = totalSize;
    let files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });
    setTotalSize(_totalSize);*/
  }

  const onTemplateUpload = async (event) => {
    /*let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });
    setTotalSize(_totalSize);*/
    toast.current.show({ severity: 'info', summary: 'Info', detail: 'Archivo nuevo' });
  };

  const customUploader = async (e) => {
    setBlockPanelUpload(true);
    const file = e.files[0];
    //let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
    const _pathFile = `${Date.now()}/${file.name}`;
    const uploadTask = setImageCarruselDb(_pathFile, file);
    // register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. error observer, called on failure
    // 3. completion observer, called on successful completion
  
    uploadTask.on('state_changed', 
      (snapshot) => {
        // observe state change events such as progess, pause and resume
        // get task progess, including the number of bytes uploaded and the total number of bytes to be uploaded
        
        //const progress = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
       // console.log('Upload is ' + progress + '% done');

      }, 
      (error) => {
        setBlockPanelUpload(false);
        switch(error.code) {
          case 'storage/unauthorized' :
            // user doesn't have permision to access the object
            break;
          case 'storage/unknown':
            // unknown error occurred, inspect error.serverResponse
            break;
        }
        toast.current.show(
          { severity: 'error', 
            summary: 'Error, intente de nuevo', 
            detail: error.code 
          }
        );
      },
      () => {
        setBlockPanelUpload(false);
        // upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          setCarruselLayout({...carruselLayout, imagen: downloadURL, pathFile: _pathFile});
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

    /*reader.readAsDataURL(blob);

    reader.onloadend = function () {
      const base64data = reader.result;
    };*/
  }

  const onEliminarImagenStorage = async () => {
    await deleteImageCarruselDb(carruselLayout.pathFile). then(() => {
      // file deleted successfully
      setCarruselLayout({...carruselLayout, imagen: '', pathFile: ''});
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

  const onTemplateRemove = (file, callback) => {
    //setTotalSize(totalSize - file.size);
    callback();
  }

  const onTemplateClear = () => {
    //setTotalSize(0);
  }

  const headerFileUploadTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    return (
        <div className={className} 
          style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}
        >
          {chooseButton}
          {uploadButton}
          {cancelButton}
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
  const uploadOptions = { 
    icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, 
    className: 'p-button-success p-button-rounded p-button-outlined' 
  };
  const cancelOptions = { 
    icon: 'pi pi-fw pi-times', iconOnly: true, 
    className: 'w-3rem custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' 
  };

  const templateBlockUI = (
    <div className='flex flex-column'>
      <ProgressSpinner />
      <p className='text-50 bg-gray-900 p-3 border-round-xl'>Cargando imagen por favor espere...</p>
    </div>
  );

  const templateImgEdit = (
    <div className="flex align-items-center flex-wrap border-1 border-round-xl p-3 border-300">
      <div className="flex flex-column align-items-center w-full" >
        <img alt={carruselLayout.titulo} role="presentation" src={carruselLayout.imagen} className='w-full sm:w-30rem  ' />
        <div className='text-center mt-2'>
          <Button type="button" icon="pi pi-times" tooltip='Eliminar imagen'
            className="p-button-outlined p-button-rounded p-button-danger mt-2 sm:mt-0 w-3rem" 
            onClick={() => onEliminarImagenStorage()} 
          />
        </div>
      </div>
    </div>
  );

  const templateImgNew = (
    <BlockUI blocked={blockPanelUpload} template={templateBlockUI}>
      <Tooltip target=".custom-choose-btn" content="Elegir"/>
      <Tooltip target=".custom-cancel-btn" content="Eliminar" />
      <FileUpload ref={fileUploadRef} name='demo[]' accept='image/*' customUpload auto
        maxFileSize={10000000} onUpload={onTemplateUpload} uploadHandler={customUploader}
        onError={onTemplateClear} onClear={onTemplateClear} onSelect={onTemplateSelect}
        headerTemplate={headerFileUploadTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions}
        className={classNames({ 'border-1 border-red-600' : submitted && !carruselLayout.imagen })} 
      />
      {submitted && !carruselLayout.imagen && 
        <small className='p-error'>Imagen es requerido.</small>
      }
    </BlockUI>
  );
  
  return (
    <div className='datatable-crud-demo '>
      <Toast ref={toast} />

      <Card className='shadow-8 border-round-xl' title='Administrar carrusel'>
        <Toolbar className='mb-4' left={leftToolbarTemplate} ></Toolbar>
        <DataTable ref={dt} value={carruselesDataTable} size='small' 
          dataKey='id' emptyMessage="No hay registros..."
          responsiveLayout='scroll' loading={loadingDataTableCarrusel} 
          reorderableRows onRowReorder={onRowReorder}
        >
          <Column rowReorder style={{width: '3rem'}}></Column>
          <Column field='titulo' header='Título'></Column>
          <Column field='imagen' header='Imagen' body={imageBodyTemplate}></Column>
          <Column field='descripcion' header='Descripción'></Column>
          <Column field='tituloAccion' header='Acción'></Column>
          <Column field='redireccion' header='Redirigir a'></Column>
          <Column body={accionBodyTemplate}></Column>
        </DataTable>
      </Card>

      <Dialog visible={carruselDialog} 
        header='Detalles del carrusel' modal className='p-fluid w-11 lg:w-8' 
        footer={nuevoCarruselDialogFooter} onHide={ocultarDialogoNuevoCarrusel}
      >
        {carruselLayout.imagen ? templateImgEdit : templateImgNew}
        
        <div className='formgrid grid mt-3'>
          <div className='field col-12'>
            <label htmlFor='titulo'>Título</label>
            <InputText id='titulo' value={carruselLayout.titulo} 
              onChange={(e) => onInputChange(e, 'titulo')} required autoFocus 
              className={classNames({ 'p-invalid' : submitted && !carruselLayout.titulo })} 
            />
            {submitted && !carruselLayout.titulo && 
              <small className='p-error'>Titulo es requerido.</small>
            }
          </div>
          <div className='field col-12'>
            <label htmlFor='descripcion'>Descripcion</label>
            <InputText id='descripcion' value={carruselLayout.descripcion} 
              onChange={(e) => onInputChange(e, 'descripcion')} required 
              className={classNames({ 'p-invalid' : submitted && !carruselLayout.descripcion })} 
            />
            {submitted && !carruselLayout.descripcion && 
              <small className='p-error'>Descripcion es requerido.</small>
            }
          </div>
          <div className='field col-12 md:col-6 lg:col-3'>
            <label htmlFor='tituloAccion'>Acción</label>
            <InputText id='tituloAccion' value={carruselLayout.tituloAccion} 
              onChange={(e) => onInputChange(e, 'tituloAccion')} required
              className={classNames({ 'p-invalid' : submitted && !carruselLayout.tituloAccion })} 
            />
            {submitted && !carruselLayout.tituloAccion && 
              <small className='p-error'>Accion es requerido.</small>
            }
          </div>
          <div className='field col-12 md:col-6 lg:col-3'>
            <label htmlFor='redireccion'>Redirigir A</label>
            <InputText id='redireccion' value={carruselLayout.redireccion} 
              onChange={(e) => onInputChange(e, 'redireccion')} required
              className={classNames({ 'p-invalid' : submitted && !carruselLayout.redireccion })} 
            />
            {submitted && !carruselLayout.redireccion && 
              <small className='p-error'>"Redirigir a" es requerido.</small>
            }
          </div>
        </div>
      </Dialog>
      <Dialog visible={deleteCarruselDialog} className='w-12 md:w-6 lg:w-4' 
        header='Confirmar' modal footer={eliminarCarruselDialogFooter} 
        onHide={ocultarDialogoEliminarCarrusel} 
      >
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem'}} />
          {carruselLayout && <span>¿Seguro que desea eliminar <b>{carruselLayout.titulo}</b> ?</span>}
        </div>
      </Dialog>
    </div>
  )
}
Carrusel.getLayoutAdmin = function getLayout(page) {
  return page;
};
export default Carrusel