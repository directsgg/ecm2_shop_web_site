import { Card } from 'primereact/card';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Accordion, AccordionTab } from 'primereact/accordion';
import React from 'react';
import Image from 'next/image';

const Nosotros = () => {
  const items = [
    { label: 'FAQ'},
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

      {/*main*/}
      <main className='mx-2 mt-2 '>
        <Card title={<h1><span className='text-yellow-500 text-7xl'>P</span>reguntas frecuentes</h1>}>
          <section className='grid m-0'>
            <div className="col-12 md:col-6 text-center block relative h-10rem  md:h-20rem">
              <Image src='/demo/images/menu/faq.svg' layout='fill' objectFit='contain'
                alt='faq.jpg' priority
              />
            </div>
            <section id="faq" className="col-12 md:col-6">
              <Accordion activeIndex={0}>
                <AccordionTab header="¿Cómo comprar?">
                  <p>Puedes realizar tus órdenes en nuestro sitio web y te 
                    lo enviamos a cualquier parte del país de Guatemala. 
                    Simplemente presiona sobre el boton comprar que aparece en la 
                    tarjeta del producto que deseas, y se agrega automáticamente 
                    a tu carrito de compras. Después procedes a realizar el pedido, 
                    debes llenar el formulario con los datos que solicite y la orden esta completa.</p>
                </AccordionTab>
                <AccordionTab header="Información de envío">
                  <p>Todos los pedidos son enviados por el consentimiento de la persona que realiza el pedido.</p>
									<p>El envío es a traves de Guatex previo deposito. El costo de envio es en promedio de Q.40.00 dependiendo de tu ubicación. El tiempo de entrega es en promedio de 2 días hábiles y depende de la distancia y ubicación de la entrega. En lugares lejanos puede tomar más tiempo.</p>
								</AccordionTab>
                <AccordionTab header="Formas de pago">
                  <p> 
                    <span className="fw-bold">
                      Transferencia o deposito bancario:
                    </span> Puedes usar cualquiera de las siguientes cuentas:
                  </p>
									<ul>
										<li>
											<p>
                        Cuenta monetaria:  
                        <span className="mx-1 font-bold">
                          xxxxxxxxxx
                        </span> a nombre de: 
                        <span className="mx-1 font-bold">
                          Music Store S.A.
                        </span> 
                        en 
                        <span className="ml-1 font-bold">
                          Banrural
                        </span>
                      </p>
										</li>
									</ul>
                </AccordionTab>
              </Accordion>
            </section>
          </section>
        </Card>  
      </main>  
    </>
  );
};

export default Nosotros;