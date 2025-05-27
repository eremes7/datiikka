import { useFrame, useThree } from '@react-three/fiber'

export function CameraCoords({ setCoords }) {
    const { camera } = useThree()
    useFrame(() => {
        setCoords(camera.position.toArray().map(val => val.toFixed(2)))
    })
    return null
}


