import getConfig from 'next/config';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { Button } from 'primereact/button';

const AppTopbar = forwardRef((props, ref) => {
    const { setLayoutState } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const items = [
        {
            label:'Inicio',
            command: () => {
                window.location.href='/'
            }
        },
        {
            label: 'Tienda',
            command: () => {
                window.location.href='/tienda'
            }
        },
        {
            label: 'Nosotros',
            command: () => {
                window.location.href='/nosotros'
            }
        },
        {
            label: 'Contacto',
            command: () => {
                window.location.href='/contacto'
            }
        },
        {
            label: 'FAQ',
            command: () => {
                window.location.href='/preguntas-frecuentes'
            }
        }
    ];

    const onCarritoButtonClick = () => {
        setLayoutState((prevState) => ({ ...prevState, carritoSidebarVisible: true }));
    };

    return (
        <>
        <div className='bg-white grid m-0 align-items-center py-3 lg:pb-0'>
            <Link href="/">
                <a className="layout-topbar-logo col-12 lg:col-4 text-center lg:text-left" >
                    <span className='m-3 text-5xl logo-style'>
                        <span className='bg-gray-900 text-white'>MUSIC</span>
                        <span className='border-gray-900 text-gray-900 border-1'>STORE</span>
                    </span>
                </a>
            </Link>
            <InputText className='col-7 sm:col-7 lg:col-6 col-offset-1 sm:col-offset-2 lg:col-offset-0' placeholder="Buscar productos..." type="text" />
            <Button icon='pi pi-shopping-cart' label='Carrito' 
                className='ml-2 mt-2 sm:mt-0' onClick={onCarritoButtonClick} />
            {/*<Link href="/carrito">
                <a className='p-link col-3 sm:col-2 md:col-1 ml-2 p-2 shadow-1 bg-yellow-300 p-overlay-badge
                    transition-delay-100 transition-colors transition-duration-300 hover:bg-yellow-500 text-900'>
                    <i className="pi pi-shopping-cart"></i> 
                    <span>Carrito</span>
                    <Badge value="8" severity="danger"></Badge>
                </a>
            </Link>*/}
        </div>
        <Menubar className='bg-white border-noround border-none flex lg:justify-content-center' model={items} />
        </>
    );
});

export default AppTopbar;
