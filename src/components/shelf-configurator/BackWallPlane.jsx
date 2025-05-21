import * as THREE from 'three'
import { MeshBasicMaterial } from 'three'
import React from 'react'

export function BackWallPlane({
    backWallWidth,
    backWallHeight,
    onHover,
    onClick,
    showGrid = true,    // new prop
}) {
    return (
        <group position={[0, backWallHeight / 2, 0]}>
            <mesh
                onPointerMove={e => {
                    e.stopPropagation()
                    const { x, y, z } = e.point
                    onHover([x, y, z])
                }}
                onClick={e => {
                    e.stopPropagation()
                    const { x, y, z } = e.point
                    onClick({ x, y, z })
                }}
            >
                <planeGeometry transparent opacity={0} args={[backWallWidth, backWallHeight]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {showGrid && (
                <group
                    position={[10, 0, -0.2452]}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={[100, 1, 1]}         // Z-akselin skaalaksi 0: vain X-viivat
                >
                    <gridHelper
                        args={[50, 200, 0x444444, 0x444444]}
                    />
                </group>
            )}
        </group>
    )
}   