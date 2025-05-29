import { useTexture } from '@react-three/drei'
import { RepeatWrapping } from 'three'
import { materialBank } from './utils/materialMap'

export function useMaterialTextures(materialKey) {
    const mat = materialBank[materialKey]

    if (!mat) {
        console.warn("Material not found:", materialKey)
        return null
    }

    // Tarkista onko mapissa hex-väri (alkaa #)
    const usesColorOnly = typeof mat.map === 'string' && mat.map.startsWith('#')

    if (usesColorOnly) {
        // Lataa loput tekstuurit
        const [normalMap, displacementMap, roughnessMap] = useTexture([
            mat.normalMap,
            mat.displacementMap,
            mat.roughnessMap,
        ])

            ;[normalMap, displacementMap, roughnessMap].forEach(tex => {
                tex.wrapS = tex.wrapT = RepeatWrapping
                tex.repeat.set(4, 4)
            })

        return {
            color: mat.map, // Hex string käytetään värinä
            normalMap,
            displacementMap,
            roughnessMap,
            normalScale: mat.normalScale,
            displacementScale: mat.displacementScale,
            roughness: mat.roughness,
            metalness: mat.metalness,
        }
    }

    // Jos map on tekstuuripolku
    const [map, normalMap, displacementMap, roughnessMap] = useTexture([
        mat.map,
        mat.normalMap,
        mat.displacementMap,
        mat.roughnessMap,
    ])

        ;[map, normalMap, displacementMap, roughnessMap].forEach(tex => {
            tex.wrapS = tex.wrapT = RepeatWrapping
            tex.repeat.set(4, 4)
        })

    return {
        map,
        normalMap,
        displacementMap,
        roughnessMap,
        normalScale: mat.normalScale,
        displacementScale: mat.displacementScale,
        roughness: mat.roughness,
        metalness: mat.metalness,
    }
}
