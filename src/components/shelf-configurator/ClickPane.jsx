import { useThree } from "@react-three/fiber"

export function ClickPlane({ onClick, onHover }) {
    const { viewport } = useThree()
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.01, 0]}
            onPointerMove={e => {
                const p = e.point.clone()
                if (p.z < -1.5) {
                    p.y = -(p.z + 1.5)
                    p.z = -1.3
                }
                onHover([p.x, p.y, p.z])
            }}
            onPointerDown={e => {
                const p = e.point.clone()
                if (p.z < -1.3) {
                    p.y = -(p.z + 1.3)
                    p.z = -1.3
                }
                onClick({ x: p.x, y: p.y, z: p.z })
            }}
        >
            <planeGeometry args={[viewport.width, viewport.height]} />
            <meshBasicMaterial visible={false} />
        </mesh>
    )
}