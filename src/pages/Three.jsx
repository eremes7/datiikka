import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import CanvasTools from '../components/shelf-configurator/CanvasTools'
import { preloadMaterialTextures } from '../components/shelf-configurator/utils/preloadMaterialTextures'
import { useFrame, useThree } from '@react-three/fiber'
import { ModelWorkshop } from '../components/shelf-configurator/modelWorkshop'
import { Line } from '@react-three/drei'
import { Room } from '../components/shelf-configurator/Room'
import * as THREE from 'three';
import ComponentPalette from '../components/shelf-configurator/ComponentPalette'
import { modelList } from '../components/shelf-configurator/utils/modelMap'
import { findSupportHome } from '../components/shelf-configurator/utils/findSupportHome'
import { findNewHome } from '../components/shelf-configurator/utils/findNewHome'
import { isShelfSupported } from '../components/shelf-configurator/utils/isShelfSupport'
import { ClickPlane } from '../components/shelf-configurator/ClickPane'
import { BackWallPlane } from '../components/shelf-configurator/BackWallPlane'



function CameraCoords({ setCoords }) {
    const { camera } = useThree()
    useFrame(() => {
        setCoords(camera.position.toArray().map(val => val.toFixed(2)))
    })
    return null
}



function AnchorMarker({ position }) {
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


export function SupportSpotAssist({ placedModels, hoverPosition }) {
    const supports = placedModels.filter(m => m.isSupport)
    if (!supports.length) return null

    const nearest = supports.reduce((best, curr) => {
        return Math.abs(hoverPosition[0] - curr.position[0]) <
            Math.abs(hoverPosition[0] - best.position[0])
            ? curr
            : best
    }, supports[0])

    const dx = hoverPosition[0] - nearest.position[0]
    const sign = Math.sign(dx) || 1
    //const length = sign * (Math.abs(dx) < 0.9 ? 0.7 : 1.0)
    const length = sign * 0.7

    return (
        <group>
            <Line
                points={[[nearest.position[0], 0, 0], [nearest.position[0] + length, 0, 0]]}
                lineWidth={7}
            />
            {supports.map(support => (

                <Line
                    key={support.id}
                    points={[
                        [support.position[0], 0, 0],  // alku Z=0
                        [support.position[0], 0, 5]   // loppu Z=5
                    ]}
                    lineWidth={1}          // ohut viiva
                    color="red"            // punainen
                />
            ))}
        </group>
    )
}
function findProperHomeForAttachments(placedModels, point, selectedPreview) {
    const attachmentSet = selectedPreview.attachments
    console.log("asgdsagdasgd", attachmentSet)
    attachmentSet.forEach(i => {
        i.x = findSupportHome(placedModels, point)[0] - 0.01
    });
    const asArray = attachmentSet.map(vec => [vec.x, vec.y, vec.z])
    return asArray
}


export default function ShelfConfigurator() {
    const [backWallWidth, setBackWallWidth] = useState(5)
    const [coords, setCoords] = useState([0, 0, 0])
    const [models, setModels] = useState()
    const [placedModels, setPlacedModels] = useState([])
    const [selectedModel, setSelectedModel] = useState(null)
    const [hoverPosition, setHoverPosition] = useState([0, 0.05, 0])
    const [selectedPreview, setSelectedPreview] = useState(null)
    const [lastHome, setLastHome] = useState([])
    const refs = useRef({})
    const [swapMaterials, setSwapMaterials] = useState(false)
    const [selectedMaterial, setSelectedMaterial] = useState('wood')

    useEffect(() => {
        setModels(modelList)
        preloadMaterialTextures()
    }, [])


    useEffect(() => {
        if (
            !selectedModel ||
            !selectedPreview?.attachments?.length ||
            selectedModel.isSupport ||
            !placedModels.length
        ) return;
        const newHome = findNewHome(selectedPreview, hoverPosition, placedModels)
        setLastHome(newHome)
    }, [hoverPosition, selectedModel, selectedPreview, placedModels])



    async function handleModelSelect(model, materialKey) {
        console.log("From Three, handleModelSelect!, ", model, materialKey)
        setSelectedModel(model)
        setSelectedMaterial(materialKey)
        setSelectedPreview({
            component: model,
            materialKey: materialKey,
            position: hoverPosition,
            scale: [1, 1, 1],
            id: Date.now() + Math.random(),
            attachments: [],
        })
    }
    function handleCanvasClick(point) {
        if (!selectedModel || !selectedPreview?.attachments) return;
        //console.log(lastHome)
        // HUOMAA, ETTÄ TÄMÄ LASKEE VAIN SUPPORTILLE OIKEIN, OLETAMME, ETTÄ EN TARVITSE HYLLY ATTACHMENTTEJÄ JATKOSSA!
        console.log("selectedPreview, handleCanvasClick:, ", selectedPreview)

        const basePosition = [point.x, point.y, 0]
        const pieceDimOffset = selectedPreview.attachments || [];
        const worldAttachments = pieceDimOffset.map(off => ([
            basePosition[0] + off.x,
            basePosition[1] + off.y,
            basePosition[2] + off.z,
        ]));
        // TARKASTETAAN MOLEMMINPUOLINEN TUKI
        //
        console.log("From handleCanvasClick!", worldAttachments)
        if (!selectedPreview.component.isSupport &&
            !isShelfSupported(lastHome, refs)) {
            console.warn('Hyllyllä ei ole tukea molemmin puolin');
            return;
        }

        const newModel = {
            ...selectedModel,
            id: Date.now() + Math.random(),
            materialKey: selectedPreview.materialKey,
            position: selectedModel.isSupport ? findSupportHome(placedModels, point) : findNewHome(selectedPreview, hoverPosition, placedModels),

            scale: [1, 1, 1],
            attachments: selectedModel.isSupport ? findProperHomeForAttachments(placedModels, point, selectedPreview) : worldAttachments,
        };
        console.log("Uusi malli!: ", newModel)
        setPlacedModels(prev => [...prev, newModel]);
        setSelectedModel(null);
        setSelectedPreview(null);
    }

    function handleModelPick(id) {
        setPlacedModels(prev => {
            const picked = prev.find(m => m.id === id)
            const rest = prev.filter(m => m.id !== id)
            // Laita sama malli preview-tilaan
            setSelectedModel(picked)
            setSelectedPreview({
                component: picked,
                position: picked.position,
                scale: picked.scale,
                id: picked.id,
                attachments: picked.attachments,
            })
            return rest
        })
    }
    return (
        <div className="relative w-[1200px] h-[800px] bg-gray-100 left-35 top-20 py-4">

            <ComponentPalette models={models} onSelect={handleModelSelect} />
            <Canvas
                shadows
                gl={{ antialias: true }}
                camera={{ position: [0, 2.22, 3.67], fov: 50 }}
                className="relative outline top-0 left-80 right-80 max-w-4/6 max-h-4/6">
                <Room backWallWidth={backWallWidth} />
                <CameraCoords setCoords={setCoords} />
                <CanvasTools
                    backWallWidth={backWallWidth}
                    setCoords={setCoords}
                    cameraTarget={[-0, 1, -2]}
                    lightIntensity={1}
                    showAxis={false}
                    isDev={true}
                />

                <BackWallPlane
                    backWallWidth={2 + backWallWidth}
                    backWallHeight={5}
                    onHover={pos => setHoverPosition(pos)}
                    onClick={pt => handleCanvasClick(pt)}
                //showGrid={!!selectedPreview}
                />
                <ClickPlane
                    onClick={handleCanvasClick}
                    onHover={pos => setHoverPosition(pos)}
                />
                {selectedPreview && lastHome && (
                    <AnchorMarker position={lastHome} />
                )}
                {selectedPreview && placedModels.some(m => m.isSupport) && (
                    <SupportSpotAssist
                        placedModels={placedModels}
                        hoverPosition={hoverPosition}
                    />
                )}

                {selectedPreview && selectedModel && (
                    <ModelWorkshop
                        model={selectedPreview.component}
                        materialKey={selectedPreview.materialKey}
                        position={hoverPosition}
                        scale={selectedPreview.scale}
                        id={selectedPreview.id}
                        onReady={({ attachments }, id) => {
                            setSelectedPreview(prev =>
                                prev.id === id
                                    ? { ...prev, attachments }
                                    : prev
                            )
                        }}
                    />
                )}

                {placedModels.map(model => (
                    <group
                        key={model.id}
                        onPointerDown={e => {
                            e.stopPropagation()
                        }}
                        onClick={e => {
                            if (selectedPreview) { return }
                            e.stopPropagation()
                            handleModelPick(model.id)
                        }}
                        cursor="pointer"
                    >
                        <ModelWorkshop
                            ref={el => { if (el) refs.current[model.id] = el }}
                            model={model}
                            materialKey={model.materialKey}
                            position={model.position}
                            scale={model.scale}
                            id={model.id}
                        />
                    </group>
                ))}

            </Canvas>

            <div className="absolute bottom-2 left-2 p-2 bg-white/80 text-xs rounded shadow">
                {`Camera: x: ${coords[0]}, y: ${coords[1]}, z: ${coords[2]}`}
            </div>

        </div>

    )
}
