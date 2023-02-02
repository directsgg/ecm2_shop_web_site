import getConfig from 'next/config';

export class CategoriaService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    async getCategorias() {
        return await fetch(this.contextPath + 'demo/data/categoria.json', 
            { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}
