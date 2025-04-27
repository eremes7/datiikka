import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import CanvasTools from './CanvasTools'
import { useFrame, useThree } from '@react-three/fiber'
import { ModelWorkshop, modelList } from './modelWorkshop'
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


function findClosestAttachment(selectedPreview, placedModels) {
    let closestPoint = null
    let closestDistance = Infinity
    if (!selectedPreview?.attachments) return [3, 4, 5];

    for (const model of placedModels) {
        for (const point of model.attachments) {
            const dx = selectedPreview.attachments[0] - point[0]
            const dy = selectedPreview.attachments[1] - point[1]
            const dz = selectedPreview.attachments[2] - point[2]
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

            if (distance < closestDistance) {
                closestDistance = distance
                closestPoint = point
            }
        }
    }

    return closestPoint
}



function PlacementGrid() {
    return (
        <gridHelper args={[50, 200]} />
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
    let best = {
        dist: Infinity,
        pair: null,
        place: null
    };

    for (const pa of worldAttachments) {
        for (const model of placedModels) {
            for (const pb of model.attachments || []) {
                console.log("JA TÄMÄN :", model)
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

    best.place = [best.pair[1][0] + selectedPreview.attachments[worldAttachments.indexOf(best.pair[0])][0], best.pair[1][1], best.pair[1][2] - selectedPreview.attachments[worldAttachments.indexOf(best.pair[0])][2]]
    console.log(best.place)

    console.log("tuen piste", best.pair[1], " ja uuden piste ", best.pair[0])
    return best.place;
}
export default function ShelfConfigurator() {
    const [backWallWidth, setBackWallWidth] = useState(5)
    const [coords, setCoords] = useState([0, 0, 0])
    const [models, setModels] = useState()
    const [placedModels, setPlacedModels] = useState([])
    const [selectedModel, setSelectedModel] = useState(null)
    const [hoverPosition, setHoverPosition] = useState([0, 0.05, 0])
    const [selectedPreview, setSelectedPreview] = useState(null)
    const refs = useRef({})

    useEffect(() => {
        setModels(modelList)
    }, [])

    /*

    useEffect(() => {
        if (!selectedPreview?.attachments) return;

        setSelectedPreview(prev => ({
            ...prev,
            attachments: prev.attachments.map(offset => ([
                prev.position[0] + offset[0],
                prev.position[1] + offset[1],
                prev.position[2] + offset[2],
            ])),
        }));
    }, [hoverPosition]);

    useEffect(() => {
        if (selectedPreview) {
            setSelectedPreview(prevState => ({ ...prevState, position: findPreviewAnchor(hoverPosition) }))
        }
    }, [hoverPosition])
*/
    /*
    useEffect(() => {
        setPlacedModels(prev => {
            const updatedModels = prev.map(juttu => {
                const updatedAttachments = juttu.attachments.map(piste => ([
                    juttu.position[0] + piste[0],
                    piste[1],
                    juttu.position[2]
                ]))
                console.log(juttu)
                return { ...juttu, attachments: updatedAttachments }
            })
            
            return updatedModels
        })
    }, [placedModels.length])
*/



    const closestAttachment = React.useMemo(() => {
        if (!selectedPreview) return null
        return findClosestAttachment(selectedPreview, placedModels)
    }, [hoverPosition, placedModels, selectedPreview])




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

        const basePosition = selectedModel.isSupport
            ? [point.x, point.y, -0.3]
            : hoverPosition
        //closestAttachment || findPreviewAnchor(hoverPosition);


        const pieceDimOffset = selectedPreview.attachments || [];

        const worldAttachments = pieceDimOffset.map(off => ([
            basePosition[0] + off[0],
            basePosition[1] + off[1],
            basePosition[2] + off[2],
        ]));



        const newModel = {
            ...selectedModel,
            id: Date.now() + Math.random(),
            position: selectedModel.isSupport ? [point.x, point.y, -0.3] : findNewHome(selectedPreview, worldAttachments, placedModels),
            scale: [1, 1, 1],
            attachments: worldAttachments,
        };

        setPlacedModels(prev => [...prev, newModel]);
        setSelectedModel(null);
        setSelectedPreview(null);
    }

    /*function updateModelAttachments() {
        console.log("olenko se minä muahaha")
        setPlacedModels(prevModels => prevModels.map(model => {
            const modelRef = refs.current[model.id]
            if (modelRef && modelRef.getAttachments) {

                return {
                    ...model,
                    attachments: modelRef.getAttachments()
                }
            }
            return model
        }))
    }*/

    return (
        <div className="relative w-[1200px] h-[800px] bg-gray-100">

            <ComponentPalette models={models} onSelect={handleModelSelect} />
            <BackWallWidthControl backWallWidth={backWallWidth} setBackWallWidth={setBackWallWidth} />
            <Canvas
                camera={{ position: [-2, 2.5, 3.3], fov: 50 }}
                className="relative outline top-0 left-60 right-80 max-w-4/6 max-h-4/6">
                <Room backWallWidth={backWallWidth} />
                <CameraCoords setCoords={setCoords} />
                <CanvasTools
                    backWallWidth={backWallWidth}
                    setCoords={setCoords}
                />

                <BackWallPlane
                    backWallWidth={2 + backWallWidth}
                    backWallHeight={5}
                    onHover={pos => setHoverPosition(pos)}
                    onClick={pt => handleCanvasClick(pt)}
                    showGrid={!!(selectedPreview && selectedModel)}
                />

                <ClickPlane
                    onClick={handleCanvasClick}
                    onHover={pos => setHoverPosition(pos)}
                />

                {/*selectedPreview && selectedModel && <PlacementGrid />}
                {selectedPreview && selectedModel && <Line points={[[0, 0, 0], findClosestPreviewAttachment(selectedPreview)]} lineWidth={1} color="blue" />*/}

                {/*selectedPreview && selectedModel && (
                    <Line points={[hoverPosition, [0, 0, 0]]} lineWidth={1} color="blue" />
                )*/}

                {(() => {
                    const pts = findClosestPreviewAttachment(selectedPreview, placedModels);
                    return (Array.isArray(pts) && pts.length === 2)
                        ? <Line points={pts} color="green" lineWidth={2} />
                        : null;
                })()}

                {/*placedModels.map((model) =>
                    model.attachments && model.attachments.map((point, index) => (
                        <Line
                            key={`${model.id}-${index}`}
                            points={[[0, 0, 0], point]}
                            lineWidth={1}
                            color="blue"
                        />
                    ))
                )*/}

                {selectedPreview && selectedModel && (
                    <ModelWorkshop
                        model={selectedPreview.component}
                        position={hoverPosition}
                        scale={selectedPreview.scale}
                        onReady={({ attachments }, id) => {
                            setSelectedPreview(prev =>
                                prev.id === id
                                    ? { ...prev, attachments }
                                    : prev
                            )
                        }}
                        id={selectedPreview.id}
                    />
                )}
                {placedModels.map((model) => (
                    <ModelWorkshop
                        key={model.id}
                        id={model.id}
                        model={model}
                        position={model.position}
                        scale={model.scale}
                        ref={el => { if (el) refs.current[model.id] = el }}
                    //onReady={(data) => {
                    //  model.attachments = data.attachments
                    //   //updateModelAttachments()
                    //}}
                    />
                ))}

            </Canvas>

            <div className="absolute bottom-2 left-2 p-2 bg-white/80 text-xs rounded shadow">
                {`Camera: x: ${coords[0]}, y: ${coords[1]}, z: ${coords[2]}`}
            </div>

        </div>

    )
}
