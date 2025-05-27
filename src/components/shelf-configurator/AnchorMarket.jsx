import React, { useState, useEffect, useRef, useMemo } from 'react'

export function AnchorMarker({ position }) {
    const [shiny, setShiny] = useState(false)
    return (
        <mesh
            position={position}
            onPointerEnter={() => setShiny(true)}
            onPointerLeave={() => setShiny(false)}
        >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshPhongMaterial
                color={shiny ? 0xffff00 : 0xffffff}
                emissive={shiny ? 0xffff00 : 0x000000}
                shininess={100}
            />
        </mesh>
    )
}


