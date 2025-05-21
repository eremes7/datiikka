import { useTexture } from '@react-three/drei'
import { materialBank } from '../utils/materialMap'

export function preloadMaterialTextures() {
  Object.values(materialBank).forEach(mat => {
    if (!mat.map) return
    useTexture.preload([
      mat.map,
      mat.normalMap,
      mat.displacementMap,
      mat.roughnessMap
    ])
  })
}