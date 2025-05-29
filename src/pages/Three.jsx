import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import CanvasTools from '../components/shelf-configurator/CanvasTools'
import { preloadMaterialTextures } from '../components/shelf-configurator/utils/preloadMaterialTextures'
import { ModelWorkshop } from '../components/shelf-configurator/modelWorkshop'
import { Room } from '../components/shelf-configurator/Room'
import ComponentPalette from '../components/shelf-configurator/ComponentPalette'
import { modelList } from '../components/shelf-configurator/utils/modelMap'
import { findSupportHome } from '../components/shelf-configurator/utils/findSupportHome'
import { findNewHome } from '../components/shelf-configurator/utils/findNewHome'
import { isShelfSupported } from '../components/shelf-configurator/utils/isShelfSupport'
import { ClickPlane } from '../components/shelf-configurator/ClickPane'
import { BackWallPlane } from '../components/shelf-configurator/BackWallPlane'
import { AnchorMarker } from '../components/shelf-configurator/AnchorMarket'
import { SupportSpotAssist } from '../components/shelf-configurator/SupportSpotAssist'
import { CameraCoords } from '../components/shelf-configurator/utils/CameraCoords'
import { PlacedModelSidebar } from '../components/shelf-configurator/PlacedModelSidebar'
import { findProperHomeForAttachments } from '../components/shelf-configurator/utils/findProperHomeForAttachments'
import { Effects } from '../components/shelf-configurator/Effects'

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
                materialKey: picked.materialKey,
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
                <Effects />
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

            <PlacedModelSidebar
                placedModels={placedModels}
                setPlacedModels={setPlacedModels}
            />

            <div className="absolute bottom-2 left-2 p-2 bg-white/80 text-xs rounded shadow">
                {`Camera: x: ${coords[0]}, y: ${coords[1]}, z: ${coords[2]}`}
            </div>

        </div>

    )
}
