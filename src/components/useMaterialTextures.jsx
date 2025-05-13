import { useTexture } from '@react-three/drei'
import { RepeatWrapping } from 'three'
import { materialBank } from './materialMap'

export function useMaterialTextures(materialKey) {
    const mat = materialBank[materialKey]


    if (!mat || !mat.map){
	console.warn("Ei avainta tai mat.map!!", materialKey)
	return null
    }

    const [
        map,
        normalMap,
        displacementMap,
        roughnessMap
    ] = useTexture([
        mat.map,
        mat.normalMap,
        mat.displacementMap,
        mat.roughnessMap
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
        displacementScale: mat.displacementScale,
        roughness: mat.roughness,
        metalness: mat.metalness
    }
}
export default useMaterialTextures
