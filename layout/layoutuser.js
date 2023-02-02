import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEventListener, useUnmountEffect } from 'primereact/hooks';
import { classNames, DomHandler } from 'primereact/utils';
import React, { useContext, useEffect, useRef } from 'react';
import AppFooter from './AppFooter';
import AppTopbar from './AppTopbar';
import AppCarrito from './AppCarrito';
import { LayoutContext } from './context/layoutcontext';
import PrimeReact from 'primereact/api';

const LayoutUser = (props) => {
    const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const topbarRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();

    PrimeReact.ripple = true;
    return (
        <React.Fragment>
            <Head>
                <title>Music Store</title>
                <meta charSet="UTF-8" />
                <meta name="description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <link rel="icon" href={`${contextPath}/favicon.ico`} type="image/x-icon"></link>
            </Head>
            
            <div className="layout-main-container layout-main-container-user">
                <AppTopbar ref={topbarRef} />
                <div className="layout-main">{props.children}</div>
                <AppFooter />
                <AppCarrito />
            </div>
                
        </React.Fragment>
    );
};

export default LayoutUser;
