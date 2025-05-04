import React from 'react'
import { OrbitControls } from '@react-three/drei'
import { AxesHelper } from 'three'


export default function CanvasTools({ backWallWidth, setCoords, cameraTarget, lightIntensity, showAxis}) {
  return (
    <>
      <ambientLight intensity={lightIntensity} />
      <directionalLight position={[8, 8, 8]} />
      <OrbitControls target = {cameraTarget}/>
      {showAxis && (
        <axesHelper args={[5]}/>
      )}
    </>
  )
}
