import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEventListener, useUnmountEffect } from 'primereact/hooks';
import { classNames, DomHandler } from 'primereact/utils';
import React, { useContext, useEffect, useRef } from 'react';
import AppFooterAdmin from './AppFooterAdmin';
import AppSidebar from './AppSidebar';
import AppTopbarAdmin from './AppTopbarAdmin';
import { LayoutContext } from './context/layoutcontext';
import PrimeReact from 'primereact/api';
import { authFirebase } from '../services/firebaseConfig/firebase';
const Layout = (props) => {
    const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const topbarRef = useRef(null);
    const sidebarRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();

    const [bindLogoutClickListener, unbindLogoutClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isInsideClicked = (
                topbarRef.current.logoutbutton.isSameNode(event.target) ||
                topbarRef.current.logoutbutton.contains(event.target)
            );
            
            if (isInsideClicked) {
                console.log('click logout');
                logoutClicked();
            }
        }
    })

    const logoutClicked = async () => {
        console.log('success logout');
        await authFirebase.signOut();
        //router.push('/auth/login/');
    }

    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                sidebarRef.current.isSameNode(event.target) || 
                sidebarRef.current.contains(event.target) || 
                topbarRef.current.menubutton.isSameNode(event.target) || 
                topbarRef.current.menubutton.contains(event.target)
            );

            if (isOutsideClicked) {
                hideMenu();
            }
        }
    });

    const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                topbarRef.current.topbarmenu.isSameNode(event.target) ||
                topbarRef.current.topbarmenu.contains(event.target) ||
                topbarRef.current.topbarmenubutton.isSameNode(event.target) ||
                topbarRef.current.topbarmenubutton.contains(event.target)
            );

            if (isOutsideClicked) {
                hideProfileMenu();
            }
        }
    });

    const hideMenu = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        unbindMenuOutsideClickListener();
        unblockBodyScroll();
    };

    const hideProfileMenu = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: false }));
        unbindProfileMenuOutsideClickListener();
    };

    const blockBodyScroll = () => {
        DomHandler.addClass('blocked-scroll');
    };

    const unblockBodyScroll = () => {
        DomHandler.removeClass('blocked-scroll');
    };

    useEffect(() => {
        bindLogoutClickListener();
    }, [])

    useEffect(() => {
        if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
            bindMenuOutsideClickListener();
        }

        layoutState.staticMenuMobileActive && blockBodyScroll();
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

    useEffect(() => {
        if (layoutState.profileSidebarVisible) {
            bindProfileMenuOutsideClickListener();
        }
    }, [layoutState.profileSidebarVisible]);

    useEffect(() => {
        router.events.on('routeChangeComplete', () => {
            hideMenu();
            hideProfileMenu();
        });
    }, []);

    PrimeReact.ripple = true;

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
        unbindProfileMenuOutsideClickListener();
        unbindLogoutClickListener();
    });

    const containerClass = classNames('layout-wrapper', {
        'layout-theme-light': layoutConfig.colorScheme === 'light',
        'layout-theme-dark': layoutConfig.colorScheme === 'dark',
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple
    });

    return (
        <React.Fragment>
            <Head>
                <title>Admin MUSIC STORE</title>
                <meta charSet="UTF-8" />
                <meta name="description" content="The ultimate collection of design-agnostic, flexible and accessible React UI Components." />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <meta property="og:type" content="website"></meta>
                <meta property="og:title" content="MUSIC STORE"></meta>
                <meta property="og:url" content="https://eroedevgt.web.app"></meta>
                <meta property="og:description" content="ecommerce demo web site" />
                <meta property="og:image" content="https://www.primefaces.org/"></meta>
                <meta property="og:ttl" content="604800"></meta>
                <link rel="icon" href={`${contextPath}/favicon.ico`} type="image/x-icon"></link>
            </Head>

            <div className={containerClass}>
                <AppTopbarAdmin ref={topbarRef} />
                <div ref={sidebarRef} className="layout-sidebar">
                    <AppSidebar />
                </div>
                <div className="layout-main-container">
                    <div className="layout-main">{props.children}</div>
                    <AppFooterAdmin />
                </div>
                <div className="layout-mask"></div>
            </div>
        </React.Fragment>
    );
};

export default Layout;
