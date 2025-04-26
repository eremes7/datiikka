import React from 'react'
import { OrbitControls } from '@react-three/drei'


export default function CanvasTools({ backWallWidth, setCoords }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 8, 8]} />
      <OrbitControls />
    </>
  )
}
