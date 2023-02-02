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
import { getPedidos, deletePedido } from '../../../../services/admin/pedidoService';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { authFirebase } from '../../../../services/firebaseConfig/firebase';


const PedidoPage = () => {
  //1 - configurar los hooks
  const toast = useRef(null);
  const dt = useRef(null);
  const fileUploadRef = useRef(null);
  const [dataCategorias, setDataCategorias] = useState([]);
  const [pedidosDataTable, setPedidosDataTable] = useState([]);
  const [viewDialogDetalles, setViewDialogDetalles] = useState(false);
  const [viewDialogDelete, setViewDialogDelete] = useState(false);
  //const [productoData, setProductoData] = useState(productoVacio);
  const [submitted, setSubmitted] = useState(false);
  const [loadingBtnGuardar, setLoadingBtnGuardar] = useState(false);
  const [loadingDataTable, setLoadingDataTable] = useState(true);
  const [blockPanelUpload, setBlockPanelUpload] = useState(false);
  const [blockPanelEdit, setBlockPanelEdit] = useState(false);
  const [stateImgAdd, setStateImgAdd] = useState(false);
  const [pedidoData, setPedidoData] = useState({id: null});
  const [products, setProducts] = useState([]);
  const [expandedRows, setExpandedRows] = useState(null);
  const isMounted = useRef(false);
  const [user] = useAuthState(authFirebase);
  const router = useRouter();

  // - obtener datos db
  const obtenerPedidos = async () => {
    let _pedidos = await getPedidos();
    if(_pedidos === undefined) _pedidos = [];
    setPedidosDataTable(_pedidos);
    setLoadingDataTable(false);
  }

  // - eliminar datos db
  const confirmacionEliminar = async () => {
    
    deletePedido(pedidoData.id).then(() => {
      // data deleted successfully
      obtenerPedidos();
      setViewDialogDelete(false);
      setPedidoData({id: null});
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

  // - usamos useEffect
  useEffect(() =>{
    if(!user) {
      router.push('/auth/login/');
    }else {
      obtenerPedidos();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

const expandAll = () => {
    let _expandedRows = {};
    pedidosDataTable.forEach(p => _expandedRows[`${p.id}`] = true);

    setExpandedRows(_expandedRows);
}

const collapseAll = () => {
    setExpandedRows(null);
}

const formatCurrency = (value) => {
  if(value === undefined) return 0;
  return value.toLocaleString('es-GT', { style: 'currency', currency: 'GTQ'});
};

const amountBodyTemplate = (rowData) => {
    return formatCurrency(rowData.amount);
}

const statusOrderBodyTemplate = (rowData) => {
    return <span className={`order-badge order-${rowData.status.toLowerCase()}`}>{rowData.status}</span>;
}

const searchBodyTemplate = () => {
    return <Button icon="pi pi-search" />;
}

const imageBodyTemplate = (rowData) => {
    return <img src={`https://primereact.org/images/product/${rowData.image}`} alt={rowData.image} width="100px" className="shadow-4" />;
}

const priceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.price);
}

const precioBodyTemplate = (rowData) => {
  if(rowData.porcentajeDescuento > 0)
    return <span className='text-red-400'>{formatCurrency(rowData.precioDescuento)}</span>;
  return formatCurrency(rowData.precio);
}

const subtotalBodyTemplate = (rowData) => {
  return formatCurrency(rowData.subtotal);
}

const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
}

  const statusBodyTemplate = (rowData) => {
    return <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
}

  const allowExpansion = (rowData) => {
      return rowData.pedido.length > 0;
  };

  const abrirDialogoEliminar = (_data) => {
    setPedidoData(_data);
    setViewDialogDelete(true);
  }
  const ocultarDialogoEliminar = () => {
    setViewDialogDelete(false);
  }

  const rowExpansionTemplate = (data) => {
    return (
        <div className="p-3">
            <h5>Pedido por {data.cliente.nombre}</h5>
            <p>Telefono: {data.cliente.telefono}</p>
            <p>Departamento: {data.cliente.departamento}</p>
            <p>Municipio: {data.cliente.municipio}</p>
            <p>Direccion: {data.cliente.direccion}</p>
            <p>Nit: {data.cliente.nit}</p>
            <p>Comentario: {data.cliente.comentario}</p>
            <DataTable value={data.pedido} responsiveLayout="scroll">
              <Column field="cantidad" header="Cantidad" sortable></Column>
              <Column field="nombre" header="Producto" sortable></Column>
              <Column body={precioBodyTemplate} header="Precio" sortable ></Column>
              <Column body={subtotalBodyTemplate} header="Subtotal" sortable></Column>
            </DataTable>
        </div>
    );
  }

  const headerDataTable = (
    <div className="table-header-container">
        <Button icon="pi pi-plus" label="Expandir todo" 
          onClick={expandAll} className="mr-2 mb-2" 
        />
        <Button icon="pi pi-minus" label="Colapsar todo" 
          onClick={collapseAll} className="mb-2"
        />
    </div>
  );

  const accionBodyTemplate = (rowData) => {
    return (
      <>
        <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-warning" 
          onClick={() => abrirDialogoEliminar(rowData)} 
        />
      </>
    );
  }
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

  return (
    <div className='datatable-crud-demo '>
      <Toast ref={toast} />

      <Card className='shadow-8 border-round-xl' title='Administrar pedidos'>
        <DataTable value={pedidosDataTable} size='small' 
          dataKey='id' emptyMessage="No hay registros..."
          responsiveLayout='scroll' loading={loadingDataTable} 
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          header={headerDataTable}
        >
          <Column expander={allowExpansion} style={{ width: '3rem'}}></Column>
          <Column field='cliente.nombre' header='Cliente' sortable></Column>
          <Column field='cliente.telefono' header='Telefono' sortable></Column>
          <Column field='cliente.municipio' header='Municipio' sortable></Column>
          <Column field='cliente.departamento' header='Departamento' sortable></Column>
          <Column body={accionBodyTemplate}></Column>
        </DataTable>
      </Card>

  
      <Dialog visible={viewDialogDelete} className='w-12 md:w-6 lg:w-4' 
        header='Confirmar' modal footer={templateDialogEliminarFooter} 
        onHide={ocultarDialogoEliminar} 
      >
        <div className='confirmation-content'>
          <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem'}} />
          {pedidoData && <span>¿Seguro que desea eliminar <b>el pedido</b> ?</span>}
        </div>
      </Dialog>
    </div>
  )
}

PedidoPage.getLayoutAdmin = function getLayout(page) {
  return page;
};
export default PedidoPage