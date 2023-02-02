import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import React from 'react';
import Image from 'next/image';

const Nosotros = () => {
  const items = [
    { label: 'Nosotros'},
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
        <Card title={<h1><span className='text-yellow-500 text-7xl'>S</span>obre Nosotros</h1>}>
          <section id='nosotros' className='grid m-0'>
            <div className="col-12 md:col-6">
              <p className='text-xl'>
                Somos personas dedicadas a vender todo 
                tipo de instrumentos musicales, 
                equipo de audio y comprometidos a 
                ofrecer una gran variedad. Porque 
                confiamos en que cada vez que 
                ofrecemos un producto de calidad 
                aportamos a proyectos creativos que 
                personas como tú realizan día a día 
                y de esa manera cumplimos nuestra misión.
              </p>
            </div>
            <div className="col-12 md:col-6 text-center block relative h-30rem">
              <Image src='/demo/images/menu/compose_music.svg' layout='fill' objectFit='contain'
                alt='compositor de musica.jpg' priority
              />
            </div>
          </section>
        </Card>  
      </main>  
    </>
  );
};

export default Nosotros;