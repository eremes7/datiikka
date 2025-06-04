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
import { Selection } from "@react-three/postprocessing"
import { Select } from "@react-three/postprocessing"
import debounce from 'lodash/debounce'

import { useScreenshot } from '@react-three/drei';

function MyScene() {
  const { getCanvas } = useScreenshot({
    type: 'image/png',
    download: false,
    quality: 0.8,
  });
  
  const takeScreenshot = async () => {
    const dataURL = await getCanvas();
    // dataURL on PNG-string
  };

  return (
    <>
      {/* 3D-objektit täällä */}
      <button onClick={takeScreenshot}>Ota kuva</button>
    </>
  );
}
export function ModelSettings({ model, onClose, onUpdate, onMove, onDelete, style }) {
    return (
        <div style={style} className="absolute top-42 right-4 w-64 bg-white p-4 rounded shadow-lg z-[222220]">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >×</button>

            <h3 className="text-lg font-semibold mb-4">{model.name} Settings</h3>

            <button
                onClick={() => onMove(model.id)}
                className="flex-1 text-white py-1 rounded"
            >✂️</button>
            <button
                onClick={() => onDelete(model.id)}
                className="left-2 text-red-500 hover:text-red-700"
            >
                🗑️
            </button>
        </div>

    )
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
    const [selectedMaterial, setSelectedMaterial] = useState('wood')
    const [hoveredId, setHoveredId] = useState(null)
    const [clickPos, setClickPos] = useState(null)
    const [settingsModel, setSettingsModel] = useState(null)
    const canvasWrapper = useRef()

    useEffect(() => {
        setModels(modelList)
        preloadMaterialTextures()
    }, [])

    const debouncedSetHovered = useMemo(
        () => debounce((id) => setHoveredId(id), 50),
        []
    )
    useEffect(() => {
        return () => debouncedSetHovered.cancel()
    }, [debouncedSetHovered])

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



    function handleWrapperClick(e) {
        const rect = canvasWrapper.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setClickPos({ x, y })
    }


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
        console.log(point.x)
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
        //console.log("From handleCanvasClick!", worldAttachments)
        if (!selectedPreview.component.isSupport &&
            !isShelfSupported(lastHome, refs)) {
            console.warn('Hyllyllä ei ole tukea molemmin puolin');
            return;
        }
        console.log("HANDLE CANVAS CLICKISTA", point.x)
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
        const picked = placedModels.find(m => m.id === id)

        setSettingsModel(picked)

        /*
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
                })*/
    }
    function handleOpenSettings(model) {
        setSettingsModel(model)
    }
    function handleCloseSettings() {
        setSettingsModel(null)
    }
    function handleUpdateModel(updated) {
        setPlacedModels(prev => prev.map(m => m.id === updated.id ? updated : m))
        setSettingsModel(updated)
    }
    function handleMoveModel(id) {
        const picked = placedModels.find(x => x.id === id)
        setPlacedModels(prev => prev.filter(x => x.id !== id))
        setSelectedModel(picked)
        setSelectedPreview({
            component: picked,
            position: picked.position,
            materialKey: picked.materialKey,
            scale: picked.scale,
            id: picked.id,
            attachments: picked.attachments,
        })
        setSettingsModel(null)
    }
    function handleDeleteModel(id) {
        setPlacedModels(prev => prev.filter(x => x.id !== id))
        setSettingsModel(null)
        console.log(placedModels)
    }

    return (
        <div className="flex w-[1700px] h-[800px] bg-gray-100 left-5 mt-10 py-4">

            <div className="w-1/6">
                <ComponentPalette models={models} onSelect={handleModelSelect} />
            </div>

            <div
                ref={canvasWrapper}
                className="relative w-3/4 h-[800px]"
                onClick={handleWrapperClick}
            >
                <Canvas
                    shadows
                    gl={{ antialias: true }}
                    camera={{ position: [0, 2.22, 3.67], fov: 50 }}
                    className="relative outline left-20 top-0 max-w-5/8 max-h-4/6">

                    <Selection>
                        <Room backWallWidth={backWallWidth} />
                        <CameraCoords setCoords={setCoords} />
                        <CanvasTools
                            backWallWidth={backWallWidth}
                            setCoords={setCoords}
                            cameraTarget={[-0, 1, -2]}
                            lightIntensity={10}
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
                            onClick={pt => {
                                pt.stopPropagation?.()
                                handleCanvasClick(pt)
                            }}
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
                            <Select enabled={settingsModel?.id === model.id} key={model.id}>
                                <group
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleModelPick(model.id);
                                        debouncedSetHovered(model.id)
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
                            </Select>
                        ))}
                    </Selection>

                </Canvas>
            </div>
            {settingsModel &&
                <ModelSettings
                    style={{
                        left: clickPos.x,
                        top: clickPos.y
                    }}
                    model={settingsModel}
                    onClose={handleCloseSettings}
                    onUpdate={handleUpdateModel}
                    onMove={handleMoveModel}
                    onDelete={handleDeleteModel}
                />}

            <div className="flex p-2 bg-white/80 text-xs rounded shadow">
                <PlacedModelSidebar
                    placedModels={placedModels}
                    setPlacedModels={setPlacedModels}
                />
            </div>
                    <div>
                        <MyScene /> 
                    </div>
            <div className="absolute bottom-2 left-2 p-2 bg-white/80 text-xs rounded shadow">
                {`Camera: x: ${coords[0]}, y: ${coords[1]}, z: ${coords[2]}`}
            </div>

        </div>

    )
}
