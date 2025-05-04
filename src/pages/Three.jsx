import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import CanvasTools from '../components/CanvasTools'
import { useFrame, useThree } from '@react-three/fiber'
import { ModelWorkshop, modelList } from '../components/modelWorkshop'
import { Mesh } from 'three'
import { Line } from '@react-three/drei'

function Room({ backWallWidth }) {
    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[2 + backWallWidth, 5]} />
                <meshStandardMaterial color="#aaaaaa" />
            </mesh>
            <mesh rotation={[0, 0, 0]} position={[0, 2.5, -0.5]}>
                <planeGeometry args={[2 + backWallWidth, 5]} />
                <meshStandardMaterial color="#cccccc" />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-1 - backWallWidth / 2, 2.5, 0]}>
                <planeGeometry args={[5, 5]} />
                <meshStandardMaterial color="#dddddd" />
            </mesh>
            <mesh rotation={[0, -Math.PI / 2, 0]} position={[1 + backWallWidth / 2, 2.5, 0]}>
                <planeGeometry args={[5, 5]} />
                <meshStandardMaterial color="#dddddd" />
            </mesh>
        </group>
    )
}
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
    showGrid = false,    // new prop
}) {
    return (
        <group position={[0, backWallHeight / 2, -0.4]}>
            {/* always-there click mesh */}
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
                <planeGeometry args={[backWallWidth, backWallHeight]} />
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
                    position={[0, 0, 0.0452]}
                />
            )}
        </group>
    )
}
function ComponentPalette({ models, onSelect }) {
    if (!models) return null
    return (
        <div className="absolute left-2 w-50 top-2 z-10 bg-white/80 p-2 rounded shadow text-sm">
            <div className="font-semibold">Palette: (Click to select)</div>
            {models.map((model, i) => (
                <div
                    key={i}
                    className="border border-black p-2 mt-2 cursor-pointer"
                    onClick={() => onSelect(model)}
                >
                    {model.name}
                </div>
            ))}
        </div>
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

function findPreviewAnchor(hoverPosition) {
    const snap = v => Math.round(v / 0.2) * 0.2
    const dx = Math.abs(hoverPosition[0] - snap(hoverPosition[0]))
    const dz = Math.abs(hoverPosition[2] - snap(hoverPosition[2]))
    if (dx < dz) {
        return [snap(hoverPosition[0]), hoverPosition[1], hoverPosition[2]]
    } else {
        return [hoverPosition[0], hoverPosition[1], snap(hoverPosition[2])]
    }
}

function findNewHome(selectedPreview, worldAttachments, placedModels) {
    if (!worldAttachments.length || !placedModels.some(m => m.isSupport)) return;

    let best = {
        dist: Infinity,
        pair: null,
        place: null
    };

    for (const pa of worldAttachments) {
        for (const model of placedModels) {
            for (const pb of model.attachments || []) {
                if (!model.isSupport) continue;

                const dx = pa[0] - pb[0];
                const dy = pa[1] - pb[1];
                const dz = pa[2] - pb[2];
                const d = Math.hypot(dx, dy, dz);

                if (d < best.dist) {
                    best.dist = d;
                    best.pair = [pa, pb];
                }
            }
        }
    }

    best.place = [best.pair[1][0] - selectedPreview.attachments[worldAttachments.indexOf(best.pair[0])][0],
    best.pair[1][1] - selectedPreview.attachments[worldAttachments.indexOf(best.pair[0])][1],
    best.pair[1][2] - selectedPreview.attachments[worldAttachments.indexOf(best.pair[0])][2]]
    //console.log(best.pair[1][0] > selectedPreview.attachments[worldAttachments.indexOf(best.pair[0])][0])
    //console.log("HYLLY", best.pair[0], "TUKI", best.pair[1])
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
        </group>
    )
}

function findSupportHome( placedModels, point ) {
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
    const length = sign * (Math.abs(dx) < 0.9 ? 0.732 : 1.0)
    return ([nearest.position[0] + length, 0, 0])
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
    const hasSupport = placedModels.some(m => m.isSupport);
    const refs = useRef({})

    useEffect(() => {
        setModels(modelList)
    }, [])


    useMemo(() => {

        if (!selectedModel || !selectedPreview?.attachments || selectedModel.isSupport || !placedModels) return;
        const pieceDimOffset = selectedPreview.attachments || [];

        const worldAttachments = pieceDimOffset.map(off => ([
            hoverPosition[0] + off[0],
            hoverPosition[1] + off[1],
            hoverPosition[2] + off[2],
        ]));
        setLastHome(findNewHome(selectedPreview, worldAttachments, placedModels))

        if (selectedPreview && selectedPreview.attachments.length && placedModels.length) {
            return lastHome
        }
        return lastHome
    }, [hoverPosition, selectedPreview, placedModels])

    async function handleModelSelect(model) {
        setSelectedModel(model)
        setSelectedPreview({
            component: model,
            position: findPreviewAnchor(hoverPosition),
            scale: [1, 1, 1],
            id: Date.now() + Math.random(),
            attachments: [],
        })
    }
    function handleCanvasClick(point) {
        if (!selectedModel || !selectedPreview?.attachments) return;

        const basePosition = [point.x, point.y, 0]
        const pieceDimOffset = selectedPreview.attachments || [];
        const worldAttachments = pieceDimOffset.map(off => ([
            basePosition[0] + off[0],
            basePosition[1] + off[1],
            basePosition[2] + off[2],
        ]));
        //position: selectedModel.isSupport ? [point.x, 0, -0.3] : findNewHome(selectedPreview, worldAttachments, placedModels),

        const newModel = {
            ...selectedModel,
            id: Date.now() + Math.random(),
            position: selectedModel.isSupport ? findSupportHome(placedModels, point) : findNewHome(selectedPreview, worldAttachments, placedModels),
            scale: [1, 1, 1],
            attachments: worldAttachments,
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
                camera={{ position: [0, 2.22, 3.67], fov: 50 }}
                className="relative outline top-0 left-60 right-80 max-w-4/6 max-h-4/6">
                <Room backWallWidth={backWallWidth} />
                <CameraCoords setCoords={setCoords} />
                <CanvasTools
                    backWallWidth={backWallWidth}
                    setCoords={setCoords}
                    cameraTarget={[-0, 1, -0]}
                    lightIntensity={0.5}
                    showAxis={false}
                />

                <BackWallPlane
                    backWallWidth={2 + backWallWidth}
                    backWallHeight={5}
                    onHover={pos => setHoverPosition(pos)}
                    onClick={pt => handleCanvasClick(pt)}
                    showGrid={!!selectedPreview}
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
                            position={model.position}
                            scale={model.scale}
                            ref={el => { if (el) refs.current[model.id] = el }}
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
