import React from 'react'
import { DollyControls } from './DollyControls'
import { Room } from './Room'
import { OrbitControls } from '@react-three/drei'
function RoomLights({ lightPosition, lightIntensity, lightColor }) {


    return (
        <pointLight distance={115}
            castShadow
            position={lightPosition}
            intensity={lightIntensity + Math.PI}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.5}
            shadow-camera-far={20}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
        />
    )
}

export default function CanvasTools({ backWallWidth, setCoords, cameraTarget, lightIntensity, showAxis, isDev }) {
    return (
        <>
            <RoomLights lightPosition={[-2, 2, 2]} lightIntensity={lightIntensity} />
            <RoomLights lightPosition={[2, 2, 2]} lightIntensity={lightIntensity} />
            <RoomLights lightPosition={[-3, 2, 2]} lightIntensity={lightIntensity} />
            <RoomLights lightPosition={[0, 2, 0]} lightIntensity={lightIntensity} />
            {isDev ? (
                <OrbitControls 
                    target={cameraTarget}
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                />
            ) : (
                <DollyControls
                    radius={3}
                    height={2.5}
                    target={cameraTarget}
                    sensitivity={0.007}
                />
            )}
            {showAxis && (
                <axesHelper args={[5]} />
            )}
        </>
    )
}
