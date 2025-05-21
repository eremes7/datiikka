import { materialBank } from "./materialMap"

const modules = import.meta.glob('../../../3D_objektit/*/*.jsx', { eager: true })

export const modelList = []
export const modelMap = {}

for (const path in modules) {
    const match = path.match(/\/3D_objektit\/([^/]+)\/([^/]+)\.jsx$/)


    if (!match) continue
    const url = match[0]

    const name = match[1]
    const mod = modules[path]

    const component = mod.Model || mod.default
    const isSupport = name.toLowerCase().includes('support')


    if (component) {
        modelList.push({
            name,
            component,
            isSupport,
            materialBank
        })
        modelMap[name] = component

    }

}