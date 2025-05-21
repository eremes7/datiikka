import { RepeatWrapping, SRGBColorSpace} from 'three'
import { useTexture } from '@react-three/drei'
import { useEffect } from 'react';


function Seinä({ textureProps }) {
    
    return (
        <meshStandardMaterial
            //map={textureProps}
            normalMap={textureProps.concreteNormal}
            displacementMap={textureProps.concreteDisplacement}
            displacementScale={0.01}
            roughnessMap={textureProps.concreteRoughness}
            roughness={1.0}
            metalness={0.0}
        />
    )
}

export function Room({ backWallWidth }) {

    // concrete 46
    const [
        concreteColor,
        concreteNormal,
        concreteDisplacement,
        concreteRoughness
    ] = useTexture([
        '/textures/Concrete046/Concrete046_2K-JPG_Color.jpg',
        '/textures/Concrete046/Concrete046_2K-JPG_NormalGL.jpg',
        '/textures/Concrete046/Concrete046_2K-JPG_Displacement.jpg',
        '/textures/Concrete046/Concrete046_2K-JPG_Roughness.jpg',
    ])

    let textureProps = {
        concreteColor: concreteColor,
        concreteNormal: concreteNormal,
        concreteDisplacement: concreteDisplacement,
        concreteRoughness: concreteRoughness
    }
    
    return (
        <group>
            {/* Lattia (Wood092) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2.5]} receiveShadow>
                <planeGeometry args={[22 + backWallWidth, 5.5, 64, 64]} />
                <Seinä textureProps={textureProps} />
            </mesh>

            {/* Takaseinä (Plaster001) */}
            <mesh rotation={[0, 0, 0]} position={[0, 2.5, -0.26]} receiveShadow castShadow>
                <planeGeometry args={[22 + backWallWidth, 5, 128, 128]} />
                <Seinä textureProps={textureProps} />
            </mesh>

            {/* Takaseinä2 (Plaster001) */}
            <mesh rotation={[Math.PI, 0, 0]} position={[0, 2.5, 5]} receiveShadow castShadow>
                <planeGeometry args={[22 + backWallWidth, 5, 128, 128]} />
                <Seinä textureProps={textureProps} />
            </mesh>
            {/* OIKEA SEINÄ */}
            <mesh rotation={[0, -Math.PI / 2, 0]} position={[4, 2.5, 2.5]} receiveShadow castShadow>
                <planeGeometry args={[2 + backWallWidth, 5, 128, 128]} />
                <Seinä textureProps={textureProps} />
            </mesh>
            {/* VASEN SEINÄ */}
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-4, 2.5, 2.5]} receiveShadow castShadow>
                <planeGeometry args={[2 + backWallWidth, 5, 128, 128]} />
                <Seinä textureProps={textureProps} />
            </mesh>
            {/* KATTO */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, 2.5]} receiveShadow castShadow>
                <planeGeometry args={[22 + backWallWidth, 5.5, 128, 128]} />
                <Seinä textureProps={textureProps} />
            </mesh>
        </group>
    )
}
