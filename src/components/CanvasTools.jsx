import React from 'react'
import { OrbitControls } from '@react-three/drei'


export default function CanvasTools({ backWallWidth, showGrid, setCoords }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 8, 8]} />
      <OrbitControls />
      <axesHelper args={[5]} />
      {showGrid && <gridHelper args={[10, 20]} position={[0, 0.01, 0]} />}
    </>
  )
}
