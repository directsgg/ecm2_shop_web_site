import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import LayoutUser from '../layout/layoutuser';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import '../styles/custom/stylecustom.css';
export default function MyApp({ Component, pageProps }) {
  if (Component.getLayout) {
    return (
      <LayoutProvider>
        {Component.getLayout(<Component {...pageProps} />)}
      </LayoutProvider>
    )
  } else if(Component.getLayoutAdmin) {
    // user is signed in
    return (
      <LayoutProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LayoutProvider>
    );
  } else {
    return (
      <LayoutProvider>
        <LayoutUser>
          <Component {...pageProps} />
        </LayoutUser>
      </LayoutProvider>
    );
  }
}
