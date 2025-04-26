const modules = import.meta.glob('../3D_objektit/*/*.jsx', { eager: true })

export const modelList = []
export const modelMap = {}

for (const path in modules) {
  const match = path.match(/\/3D_objektit\/([^/]+)\/\1\.jsx$/)
  if (match) {
    const name = match[1]
    const componentModule = modules[path]

    const component = componentModule[name] // esim: export function Shelf_001 → Shelf_001

    if (component) {
      modelList.push({ name, component })
      modelMap[name] = component
    } else {
      console.warn(`Komponentti ${name} ei löytynyt tiedostosta ${path}`)
    }
  }
}
