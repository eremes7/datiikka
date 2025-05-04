
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import CanvasTools from '../components/CanvasTools'


export default function TestScene() {


    return (
        <div className="relative w-[1200px] h-[800px] bg-gray-100 left-40 top-20">
            <Canvas
                camera={{ position: [0, 12.22, 12.67], fov: 100 }}
                className="relative outline top-0 left-60 right-80 max-w-4/6 top-20 max-h-4/6">

                <mesh visible userData={{ hello: 'world' }} position={[1, 2, 3]} rotation={[Math.PI / 2, 0, 0]}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshStandardMaterial color="hotpink" transparent />
                </mesh>
                <CanvasTools
                    backWallWidth={1}
                    setCoords={[1, 1, 1]}
                    cameraTarget={[6, 1, 6]}
                    lightIntensity={0.5}
                    showAxis={true}
                />


                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color="#aaaaaa" />
            </mesh>
            </Canvas>
        </div>
    )
}