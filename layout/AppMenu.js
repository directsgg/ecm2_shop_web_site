import getConfig from 'next/config';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const model = [
        {
            label: 'Inicio',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/admin/' }]
        },
        {
            label: 'Pagina principal',
            items: [
                { label: 'Carrusel', icon: 'pi pi-fw pi-tablet', to: '/admin/pagina-principal/carrusel'}
            ]
        },
        {
            label: 'Tienda',
            items: [
                { label: 'Pedidos', icon: 'pi pi-fw pi-shopping-bag', to: '/admin/tienda/pedidos'},
                { label: 'Categorías', icon: 'pi pi-fw pi-tag', to: '/admin/tienda/categorias'},
                { label: 'Productos', icon: 'pi pi-fw pi-table', to: '/admin/tienda/productos'}
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
