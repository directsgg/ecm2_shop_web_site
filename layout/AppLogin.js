import React from 'react'

const AppLogin = () => {
  const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', {'p-input-filled': layoutConfig.inputStyle === 'filled'});
    
  return (
    <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <h1  className="mb-5">MUSIC STORE</h1>
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">¡Bienvenido, de nuevo!</div>
                            <span className="text-600 font-medium">Inicie sesion para continuar</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Correo
                            </label>
                            <InputText inputid="email1" type="text" placeholder="Ingrese direccion de correo" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Contraseña
                            </label>
                            <Password inputid="password1" value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Ingrese contraseña" toggleMask 
                                className="w-full mb-5" inputClassName='w-full p-3 md:w-30rem'></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    ¿Olvido su contraseña?
                                </a>
                            </div>
                            <Button label="Iniciar Sesión" className="w-full p-3 text-xl" onClick={() => router.push('/')}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default AppLogin