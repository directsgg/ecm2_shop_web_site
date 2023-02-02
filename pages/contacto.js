import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import React, { useState } from 'react';
import Image from 'next/image';

 
const Contacto = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading1, setLoading1] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const clickIniciarSesion = (e) => {
    e.preventDefault();
    setLoading1(true);
    setSubmitted(true);
    
  }

  const items = [
    { label: 'Contacto'},
  ]

  const home = {
    icon: 'pi pi-home',
    label: 'Inicio',
    command: () => {
      window.location.href='/'
    }
  }
  return (
    <>
      {/* Breadcrumb Start */}
      <BreadCrumb className='mx-2 mt-5' model={items} home={home} />

      {/*presentacion*/}
      <main className='mx-2 mt-2 '>
        <Card title={<h1><span className='text-yellow-500 text-7xl'>C</span>ontacto</h1>}>
          <section id='contacto' className='grid m-0'>
            <div className="col-12 lg:col-6">
              <div className='block relative h-15rem'>
                <Image src='/demo/images/menu/contact_us.svg' layout='fill' objectFit='contain'
                  alt='contactanos.jpg' priority
                />
              </div>
              <p className='text-xl'>
                Para cualquier consulta, comentario o si 
                quieres mayor información acerca de 
                nuestros productos puedes realizarlo 
                por medio del formulario y con gusto 
                atendemos tu mensaje, ó contáctanos 
                directamente por nuestros medios de 
                comunicación.
              </p>
              <hr />
              <p className='text-xl'>
                Puedes comunicarte a nuestro número de watsapp:
              </p>
							<p className='text-xl'>
                <i className="pi pi-phone text-yellow-500 mr-2 font-bold"></i> 
                +502 12345678
              </p>
            </div>
            <div className="col-12 lg:col-6 text-center ">
              <hr className='lg:hidden'/>
              <h3 className='mb-6'>Formulario de contacto</h3>
              <form onSubmit={clickIniciarSesion} className='formgrid p-fluid  px-6'>
                  <div className='field mb-6'>
                    <span className='p-float-label'>
                      <InputText id='nombre' required 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className={classNames( { 'p-invalid' : submitted && !nombre })}
                      />
                      <label htmlFor='nombre'>Nombre</label>
                    </span>
                    {submitted && !nombre && 
                      <small className='p-error'>
                        Nombre es requerido.
                      </small>
                    }
                  </div>

                  <div className='field mb-6'>
                    <span className='p-float-label'>
                      <InputText id='correo' required
                        value={correo} type='email'
                        onChange={(e) => setCorreo(e.target.value)}
                        className={classNames( { 'p-invalid' : submitted && !correo })}
                      />
                      <label htmlFor='correo'>Correo electrónico</label>
                    </span>
                    {submitted && !correo && 
                      <small className='p-error'>
                        Correo es requerido.
                      </small>
                    }
                  </div>

                  <div className="field mb-3">
                    <span className="p-float-label">
                      <InputTextarea id="mensaje" required
                        value={mensaje} 
                        onChange={(e) => setMensaje(e.target.value)} 
                        rows={4} cols={30} autoResize
                        className={classNames( { 'p-invalid' : submitted && !mensaje })}
                      />
                      <label htmlFor="mensaje">Mensaje</label>
                    </span>
                    {submitted && !mensaje && 
                      <small className='p-error'>
                        Mensaje es requerido.
                      </small>
                    }
                  </div>

                  <Button label='ENVIAR' className="p-button-warning"
                    loading={loading1} 
                    type='submit'
                  />
              </form> 
            </div>
          </section>
        </Card>  
      </main>  
    </>
  );
};

export default Contacto;