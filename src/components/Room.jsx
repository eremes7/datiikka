import { RepeatWrapping } from 'three'
import { useTexture } from '@react-three/drei'

function Seinä({ textureProps }) {
    const { plasterColor, plasterNormal, plasterDisplacement, plasterRoughness } = textureProps;
    return (
        <meshStandardMaterial
            map={plasterColor}
            normalMap={plasterNormal}
            displacementMap={plasterDisplacement}
            displacementScale={0.001}
            roughnessMap={plasterRoughness}
            roughness={0.8}
            metalness={0.0}
        />
    )
}

export function Room({ backWallWidth }) {
    // wood floor 92
    const [
        woodColor,
        woodNormal,
        woodDisplacement,
        woodRoughness
    ] = useTexture([
        '/textures/Wood092/Wood092_1K-JPG_Color.jpg',
        '/textures/Wood092/Wood092_1K-JPG_NormalGL.jpg',
        '/textures/Wood092/Wood092_1K-JPG_Displacement.jpg',
        '/textures/Wood092/Wood092_1K-JPG_Roughness.jpg',
    ])
    // wood floor 57
    /*
    const [
        woodColor,
        woodNormal,
        woodDisplacement,
        woodRoughness
    ] = useTexture([
        '/textures/Wood057/WoodFloor057_2K-JPG_Color.jpg',
        '/textures/Wood057/WoodFloor057_2K-JPG_NormalGL.jpg',
        '/textures/Wood057/WoodFloor057_2K-JPG_Displacement.jpg',
        '/textures/Wood057/WoodFloor057_2K-JPG_Roughness.jpg',
    ])*/
    // plaster wall
    const [
        plasterColor,
        plasterNormal,
        plasterDisplacement,
        plasterRoughness
    ] = useTexture([
        '/textures/Plaster001/Plaster001_1K-JPG_Color.jpg',
        '/textures/Plaster001/Plaster001_1K-JPG_NormalGL.jpg',
        '/textures/Plaster001/Plaster001_1K-JPG_Displacement.jpg',
        '/textures/Plaster001/Plaster001_1K-JPG_Roughness.jpg',
    ])

        // toista tekstuureja
        ;[
            woodColor, woodNormal, woodDisplacement, woodRoughness,
            plasterColor, plasterNormal, plasterDisplacement, plasterRoughness
        ].forEach(tex => {
            tex.wrapS = tex.wrapT = RepeatWrapping
            tex.repeat.set(4, 4)  // tarvittaessa säädä eri arvoiksi lattialle ja seinälle
        })

    let textureProps = {
        plasterColor: plasterColor,
        plasterNormal: plasterNormal,
        plasterDisplacement: plasterDisplacement,
        plasterRoughness: plasterRoughness
    }


    return (
        <group>
            {/* Lattia (Wood092) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2.5]} receiveShadow>
                <planeGeometry args={[2 + backWallWidth, 5.5, 64, 64]} />
                <meshStandardMaterial
                    map={woodColor}
                    normalMap={woodNormal}
                    displacementMap={woodDisplacement}
                    displacementScale={0.001}
                    roughnessMap={woodRoughness}
                    roughness={0.0}
                    metalness={0.20}
                />
            </mesh>

            {/* Takaseinä (Plaster001) */}
            <mesh rotation={[0, 0, 0]} position={[0, 2.5, -0.25]} receiveShadow castShadow>
                <planeGeometry args={[2 + backWallWidth, 5, 128, 128]} />
                <Seinä textureProps={textureProps} />
            </mesh>

            {/* Takaseinä2 (Plaster001) */}
            <mesh rotation={[Math.PI, 0, 0]} position={[0, 2.5, 5]} receiveShadow castShadow>
                <planeGeometry args={[2 + backWallWidth, 5, 128, 128]} />
                <Seinä textureProps={textureProps} />
            </mesh>
            {/* OIKEA SEINÄ */}
            <mesh rotation={[0, -Math.PI / 2, 0]} position={[3, 2.5, 2.5]} receiveShadow castShadow>
                <planeGeometry args={[2 + backWallWidth, 5, 128, 128]} />
                <Seinä textureProps={textureProps} />
            </mesh>
            {/* VASEN SEINÄ */}
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-3, 2.5, 2.5]} receiveShadow castShadow>
                <planeGeometry args={[2 + backWallWidth, 5, 128, 128]} />
                <Seinä textureProps={textureProps} />
            </mesh>
            {/* KATTO */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3.5, 2.5]} receiveShadow castShadow>
                <planeGeometry args={[2 + backWallWidth, 5.5, 128, 128]} />
                <Seinä textureProps={textureProps} />
            </mesh>
        </group>
    )
}
