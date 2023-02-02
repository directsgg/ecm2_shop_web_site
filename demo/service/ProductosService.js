export async function getSortedProductosData() {
  const res = 
    await fetch(this.contextPath + '/demo/data/productos.json', 
    { headers: { 'Cache-Control': 'no-cache' } }
    );
  console.log(res);
  const d = await res.json();
  return d.data;
}
