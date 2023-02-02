import React, { useContext, useState, useRef, useEffect } from 'react';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { authFirebase } from '../../../services/firebaseConfig/firebase';
const LoginPage = () => {
    const [password, setPassword] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const [usuario, setUsuario] = useState('');
    const [loading1, setLoading1] = useState(false);
    const toast = useRef(null);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {'p-input-filled': layoutConfig.inputStyle === 'filled'});
    const [user] = useAuthState(authFirebase);
    const router = useRouter();

    useEffect(() => {
        if(user) {
            router.push('/admin/');
        }
    }, [user]);

    const clickIniciarSesion = (e) => {
        e.preventDefault();
        
        signInWithEmailAndPassword(authFirebase, usuario, password)
        .catch((error) => {
            setLoading1(false);
            toast.current.show({ 
            severity: 'error', 
            summary: 'Error', 
            detail: error.code, 
            life: 4000 
            });
        })
    }

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <h1  className="mb-5">MUSIC STORE</h1>
                <div style={{ borderRadius: '56px', 
                    padding: '0.3rem', 
                    background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">¡Bienvenido, de nuevo!</div>
                            <span className="text-600 font-medium">Inicie sesion para continuar</span>
                        </div>

                        <form onSubmit={clickIniciarSesion} className='formgrid p-fluid  px-6'>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Correo
                            </label>
                            <InputText inputid="usuario" type="text" 
                                placeholder="Ingrese direccion de correo" 
                                className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} 
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Contraseña
                            </label>
                            <Password inputid="password1" value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Ingrese contraseña" toggleMask feedback={false}
                                className="w-full mb-5" inputClassName='w-full p-3 md:w-30rem'></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    ¿Olvido su contraseña?
                                </a>
                            </div>
                            <button type='submit' className='w-full p-3 text-xl bg-primary border-0 border-round-xl'>INICIAR SESIÓN</button>
                        </form> 
                    </div>
                </div>
            </div>
        </div>
    );
};

/*LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};*/

LoginPage.getLayout = function getLayout(page) {
    return page;
};
export default LoginPage;
