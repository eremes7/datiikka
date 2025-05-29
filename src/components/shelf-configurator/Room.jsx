import { RepeatWrapping, SRGBColorSpace } from 'three'
import { useTexture } from '@react-three/drei'
import { useEffect, useState } from 'react';
import { TextureLoader, Vector2 } from 'three';
import { useThree } from '@react-three/fiber';

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

function WoodFloor({ textureProps }) {
    const repeat = new Vector2(1.2222, 0.7)

    useEffect(() => {
        [textureProps.woodFloorColor, textureProps.woodFloorNormal, textureProps.woodFloorDisplacement, textureProps.woodFloorRoughness].forEach(tex => {
            tex.wrapS = RepeatWrapping
            tex.wrapT = RepeatWrapping
            tex.repeat.copy(repeat)
        })

        // Only the color map needs sRGB color space
        textureProps.woodFloorColor.colorSpace = SRGBColorSpace
    }, [textureProps])

    return (
        <meshStandardMaterial
            map={textureProps.woodFloorColor}
            normalMap={textureProps.woodFloorNormal}
            displacementMap={textureProps.woodFloorDisplacement}
            roughnessMap={textureProps.woodFloorRoughness}
            normalScale={0.0}
            displacementScale={0.000}
            displacementQuality={0.1}
            displacementSmoothing={0.1}
            displacementBias={0.00}
            roughness={0.9}
            metalness={0.1}
        />
    )
}

export function Room({ backWallWidth }) {

    // woodFloor 010
    const [
        woodFloorColor,
        woodFloorNormal,
        woodFloorDisplacement,
        woodFloorRoughness
    ] = useTexture([
        '/textures/WoodFloor010_2K-JPG/WoodFloor010_2K-JPG_Color.jpg',
        '/textures/WoodFloor010_2K-JPG/WoodFloor010_2K-JPG_NormalGL.jpg',
        '/textures/WoodFloor010_2K-JPG/WoodFloor010_2K-JPG_Displacement.jpg',
        '/textures/WoodFloor010_2K-JPG/WoodFloor010_2K-JPG_Roughness.jpg',
    ])

    let woodFloorProps = {
        woodFloorColor: woodFloorColor,
        woodFloorNormal: woodFloorNormal,
        woodFloorDisplacement: woodFloorDisplacement,
        woodFloorRoughness: woodFloorRoughness
    }


    // concrete 46
    const [
        concreteColor,
        concreteNormal,
        concreteDisplacement,
        concreteRoughness
    ] = useTexture([
        '/textures/Plaster001/Plaster001_1K-JPG_Color.jpg',
        '/textures/Plaster001/Plaster001_1K-JPG_NormalGL.jpg',
        '/textures/Plaster001/Plaster001_1K-JPG_Displacement.jpg',
        '/textures/Plaster001/Plaster001_1K-JPG_Roughness.jpg',
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
                <planeGeometry args={[14, 12, 64, 64]} />
                <WoodFloor textureProps={woodFloorProps} />
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
