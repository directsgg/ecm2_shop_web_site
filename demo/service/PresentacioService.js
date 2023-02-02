import getConfig from 'next/config';

export class PresentacionService {
    constructor() {
        this.contextPath = getConfig().publicRuntimeConfig.contextPath;
    }

    async getPresentaciones() {
        return await fetch(this.contextPath + 'demo/data/presentacion.json', 
            { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }

    
}
