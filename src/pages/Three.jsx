import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import CanvasTools from '../components/CanvasTools'
import { MaterialTool } from '../components/MaterialTool'
import { useFrame, useThree } from '@react-three/fiber'
import { ModelWorkshop } from '../components/modelWorkshop'
import { Line } from '@react-three/drei'
import { Room } from '../components/Room'
import * as THREE from 'three';
import ComponentPalette from '../components/ComponentPalette'
import { modelList } from '../components/modelMap'

function BackWallWidthControl({ backWallWidth, setBackWallWidth }) {
    return (
        <div className="absolute top-150 w-50 left-2 z-10 bg-white/80 p-2 rounded shadow text-sm">
            <label className="mr-2">Back Wall Width (m):</label>
            <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={backWallWidth}
                onChange={(e) => setBackWallWidth(parseFloat(e.target.value))}
                className="mr-2"
            />
            <span>{backWallWidth.toFixed(1)}</span>
        </div>
    )
}
function CameraCoords({ setCoords }) {
    const { camera } = useThree()
    useFrame(() => {
        setCoords(camera.position.toArray().map(val => val.toFixed(2)))
    })
    return null
}
function ClickPlane({ onClick, onHover }) {
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
export function BackWallPlane({
    backWallWidth,
    backWallHeight,
    onHover,
    onClick,
    showGrid = true,    // new prop
}) {
    return (
        <group position={[0, backWallHeight / 2, 0]}>
            <mesh
                onPointerMove={e => {
                    e.stopPropagation()
                    const { x, y, z } = e.point
                    onHover([x, y, z])
                }}
                onClick={e => {
                    e.stopPropagation()
                    const { x, y, z } = e.point
                    onClick({ x, y, z })
                }}
            >
                <planeGeometry transparent opacity={0} args={[backWallWidth, backWallHeight]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {showGrid && (
                <gridHelper
                    args={[
                        50,
                        200,
                        0x444444
                    ]}
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[0, 0, -0.2452]}
                />
            )}
        </group>
    )
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

function findNewHome(selectedPreview, worldAttachments, placedModels) {
    if (!worldAttachments.length || !placedModels.some(m => m.isSupport)) return;

    let best = {
        dist: Infinity,
        pair: null,
        place: null
    };

    for (const support of placedModels) {
        if (support.isSupport) {
            for (const point of support.attachments) {
                const dx = point[0] - worldAttachments[0];
                const dy = point[1] - worldAttachments[1];
                const dz = point[2] - worldAttachments[2];
                const d = Math.hypot(dx, dy, dz);
                if (d < best.dist) {
                    best.dist = d;
                    best.place = point;

                }
            }
        }
    }


    return best.place;
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
    const length = sign * (Math.abs(dx) < 0.9 ? 0.7 : 1.0)

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
    attachmentSet.forEach(i => i[0] = findSupportHome(placedModels, point)[0] - 0.01)

    return attachmentSet


}
function findSupportHome(placedModels, point) {
    const supports = placedModels.filter(m => m.isSupport)
    if (!placedModels.some(m => m.isSupport)) return [point.x, 0, -0.3]

    const nearest = supports.reduce((best, curr) => {
        return Math.abs(point.x - curr.position[0]) <
            Math.abs(point.x - best.position[0])
            ? curr
            : best
    }, supports[0])

    const dx = point.x - nearest.position[0]
    const sign = Math.sign(dx) || 1
    const length = sign * (Math.abs(dx) < 0.9 ? 0.75 : 1.0)
    return ([nearest.position[0] + length, 0, 0])
}
function isShelfSupported(lastHome, refs) {
    const raycaster = new THREE.Raycaster();
    const objects = Object.values(refs.current).filter(group => group instanceof THREE.Object3D);
    raycaster.set(new THREE.Vector3(lastHome[0] + 0.2, lastHome[1], lastHome[2]), new THREE.Vector3(1, 0, -0.05));
    const intersects = raycaster.intersectObjects(objects, true)
    //console.log("OSUMAT",intersects)
    return intersects.some(i => i.object.parent.parent.parent.userData.isSupport);

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
        console.log("From Three!", model, materialKey)
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
	console.log(lastHome)
        // HUOMAA, ETTÄ TÄMÄ LASKEE VAIN SUPPORTILLE OIKEIN, OLETAMME, ETTÄ EN TARVITSE HYLLY ATTACHMENTTEJÄ JATKOSSA!
	console.log(placedModels)

        const basePosition = [point.x, point.y, 0]
        const pieceDimOffset = selectedPreview.attachments || [];
        const worldAttachments = pieceDimOffset.map(off => ([
            basePosition[0] + off[0],
            basePosition[1] + off[1],
            basePosition[2] + off[2],
        ]));
        // TARKASTETAAN MOLEMMINPUOLINEN TUKI
	//
	
	console.log("ASLKDJLKSADJ", selectedPreview)
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
        <div className="relative w-[1200px] h-[800px] bg-gray-100">

            <ComponentPalette models={models} onSelect={handleModelSelect} />
            <BackWallWidthControl backWallWidth={backWallWidth} setBackWallWidth={setBackWallWidth} />
            <Canvas
                shadows
                gl={{ antialias: true }}
                camera={{ position: [0, 2.22, 3.67], fov: 50 }}
                className="relative outline top-0 left-60 right-80 max-w-4/6 max-h-4/6">
                <Room backWallWidth={backWallWidth} />
                <CameraCoords setCoords={setCoords} />
                <CanvasTools
                    backWallWidth={backWallWidth}
                    setCoords={setCoords}
                    cameraTarget={[-0, 1, -0]}
                    lightIntensity={1}
                    showAxis={false}
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
                            id={model.id}
                            model={model}
                            materialKey={model.materialKey}
                            position={model.position}
                            scale={model.scale}
                            ref={el => {
                                if (!el) return;
                                refs.current[model.id] = el;
                                el.userData.isSupport = model.isSupport;
                            }}
                        />
                    </group>
                ))}
                <MaterialTool swapMaterials={swapMaterials} placedModels={placedModels} refs={refs} />

            </Canvas>
            <button
                className="absolute top-2 right-2 z-20 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setSwapMaterials(v => !v)}
            >
                Vaihda materiaalit
            </button>
            <div className="absolute bottom-2 left-2 p-2 bg-white/80 text-xs rounded shadow">
                {`Camera: x: ${coords[0]}, y: ${coords[1]}, z: ${coords[2]}`}
            </div>

        </div>

    )
}
