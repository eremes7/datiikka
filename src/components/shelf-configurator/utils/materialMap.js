import { Vector2 } from "three"

export const materialBank = {
  wood: {
    map: '#ffe1bf',
    normalMap: '/textures/Wood014_2K-JPG/Wood014_2K-JPG_NormalGL.jpg',
    displacementMap: '/textures/Wood014_2K-JPG/Wood014_2K-JPG_Displacement.jpg',
    roughnessMap: '/textures/Wood014_2K-JPG/Wood014_2K-JPG_Roughness.jpg',
    displacementScale: 0.000,
    displacementBias: 1,
    normalScale: new Vector2(1, 1),
    roughness: 0.7,
    metalness: 0.0,
  },
  black: {
    map: '#050402',
    normalMap: '/textures/Wood014_2K-JPG/Wood014_2K-JPG_NormalGL.jpg',
    displacementMap: '/textures/Wood014_2K-JPG/Wood014_2K-JPG_Displacement.jpg',
    roughnessMap: '/textures/Wood014_2K-JPG/Wood014_2K-JPG_Roughness.jpg',
    displacementScale: 0.000,
    displacementBias: 1,
    normalScale: new Vector2(5, 5),
    roughness: 0.7,
    metalness: 0.3,
  },
  white: {
    map: '#fffefc',
    normalMap: '/textures/Wood014_2K-JPG/Wood014_2K-JPG_NormalGL.jpg',
    displacementMap: '/textures/Wood014_2K-JPG/Wood014_2K-JPG_Displacement.jpg',
    roughnessMap: '/textures/Wood014_2K-JPG/Wood014_2K-JPG_Roughness.jpg',
    displacementScale: 0.000,
    displacementBias: 1,
    normalScale: new Vector2(5, 5),
    roughness: 0.7,
    metalness: 0.0,
  }
}

