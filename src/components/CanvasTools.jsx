import React from 'react'
import { OrbitControls } from '@react-three/drei'
import { AxesHelper } from 'three'


export default function CanvasTools({ backWallWidth, setCoords, cameraTarget, lightIntensity, showAxis }) {
    return (
        <>
            <pointLight distance={115} 
                castShadow
                position={[0, 2, 2]}
                intensity={lightIntensity+ Math.PI}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-near={0.5}
                shadow-camera-far={20}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            <OrbitControls target={cameraTarget} />
            {showAxis && (
                <axesHelper args={[5]} />
            )}
        </>
    )
}
