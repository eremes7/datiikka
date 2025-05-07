import { RepeatWrapping } from 'three'
import { useTexture } from '@react-three/drei'

export function Room({ backWallWidth }) {
  // wood floor
  const [
    woodColor,
    woodNormal,
    woodDisplacement,
    woodRoughness
  ] = useTexture([
    '/textures/Wood057/WoodFloor057_2K-JPG_Color.jpg',
    '/textures/Wood057/WoodFloor057_2K-JPG_NormalGL.jpg',
    '/textures/Wood057/WoodFloor057_2K-JPG_Displacement.jpg',
    '/textures/Wood057/WoodFloor057_2K-JPG_Roughness.jpg',
  ])
  // plaster wall
  const [
    plasterColor,
    plasterNormal,
    plasterDisplacement,
    plasterRoughness
  ] = useTexture([
    '/textures/Plaster001/Plaster001_1K-JPG_Color.jpg',
    '/textures/Plaster001/Plaster001_1K-JPG_NormalGL.jpg',
    '/textures/Plaster001/Plaster001_1K-JPG_Displacement.jpg',
    '/textures/Plaster001/Plaster001_1K-JPG_Roughness.jpg',
  ])

  // toista tekstuureja
  ;[
    woodColor, woodNormal, woodDisplacement, woodRoughness,
    plasterColor, plasterNormal, plasterDisplacement, plasterRoughness
  ].forEach(tex => {
    tex.wrapS = tex.wrapT = RepeatWrapping
    tex.repeat.set(4, 4)  // tarvittaessa säädä eri arvoiksi lattialle ja seinälle
  })

  return (
    <group>
      {/* Lattia (Wood092) */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,0]} receiveShadow> 
        <planeGeometry args={[2 + backWallWidth, 5, 64, 64]} />
        <meshStandardMaterial
          map={woodColor}
          normalMap={woodNormal}
          displacementMap={woodDisplacement}
          displacementScale={0.001}
          roughnessMap={woodRoughness}
          roughness={0.0}
          metalness={0.20}
        />
      </mesh>

      {/* Takaseinä (Plaster001) */}
      <mesh rotation={[0,0,0]} position={[0,2.5,-0.5]} receiveShadow castShadow>
        <planeGeometry args={[2 + backWallWidth, 5, 128, 128]} />
        <meshStandardMaterial
          map={plasterColor}
          normalMap={plasterNormal}
          displacementMap={plasterDisplacement}
          displacementScale={0.001}
          roughnessMap={plasterRoughness}
          roughness={0.0}
          metalness={0.20}
        />
      </mesh>

      {/* Sivu-seinät neutraalina */}
      <mesh rotation={[0, Math.PI/2, 0]} position={[-1 - backWallWidth/2, 2.5, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
      <mesh rotation={[0, -Math.PI/2, 0]} position={[1 + backWallWidth/2, 2.5, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#dddddd" />
      </mesh>
    </group>
  )
}
