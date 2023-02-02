import getConfig from 'next/config';

export class ProductService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    async getProductsSmall() {
        const res = await fetch(this.contextPath + '/demo/data/products-small.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    }

    async getMejoresProductos() {
        const res = await fetch(this.contextPath + '/demo/data/mejoresproductos.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    }

    async getOfertasProductos() {
        const res = await fetch(this.contextPath + '/demo/data/ofertasproductos.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    }

    async getProducts() {
        const res = await fetch(this.contextPath + '/demo/data/products.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    }

    async getProductos() {
        const res = await fetch(this.contextPath + '/demo/data/productos.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    }

    async getProductsWithOrdersSmall() {
        const res = await fetch(this.contextPath + '/demo/data/products-orders-small.json', { headers: { 'Cache-Control': 'no-cache' } });
        const d = await res.json();
        return d.data;
    }

}
