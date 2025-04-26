import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import CanvasTools from './CanvasTools'
import { useFrame, useThree } from '@react-three/fiber'
import { ModelWorkshop } from './modelWorkshop'
import * as THREE from 'three'
import { modelList } from './modelWorkshop'
import { Line } from '@react-three/drei'


function Room({ backWallWidth }) {
    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[2 + backWallWidth, 5]} />
                <meshStandardMaterial color="#aaaaaa" />
            </mesh>
            <mesh rotation={[0, 0, 0]} position={[0, 2.5, -1.5]}>
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
function BackWallPlane({ backWallWidth, backWallHeight, onHover, onClick }) {
    return (
        <mesh
            position={[0, backWallHeight / 2, -1.3]}
            rotation={[0, 0, 0]}
            onPointerMove={e => {
                e.stopPropagation()
                const p = e.point.clone()
                onHover([p.x, p.y, p.z])
            }}
            onClick={e => {
                e.stopPropagation()
                const p = e.point.clone()
                onClick({ x: p.x, y: p.y, z: p.z })
            }}
        >
            <planeGeometry args={[backWallWidth, backWallHeight]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
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

export default function ShelfConfigurator() {
    const [backWallWidth, setBackWallWidth] = useState(5)
    const [showGrid, setShowGrid] = useState(true)
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

    for(const juttu of placedModels){
        console.log("sdfg", juttu.attachments)
        for(const piste of juttu.attachments){
            piste[0]=juttu.position[0]
            piste[2]=juttu.position[2]
        }
    }
    console.log("KAKKAA LUMELLA :DDD")

    console.log("HAHA ET OSAA :DD")
    useEffect(() => {
        updateModelAttachments()
        if (selectedPreview) {
            selectedPreview.position = hoverPosition
        }
    }, [hoverPosition])

    async function handleModelSelect(model) {
        setSelectedModel(model)
        setSelectedPreview({
            component: model,
            position: hoverPosition,
            scale: [1, 1, 1],
            id: Date.now() + Math.random(),
            attachments: [],
        })
    }
    function handleCanvasClick(point) {
        if (!selectedModel || !selectedPreview) return

        setPlacedModels((prev) => [
            ...prev,
            {
                ...selectedModel,
                id: Date.now() + Math.random(),
                position: [point.x, point.y, -1.3],
                scale: [1, 1, 1],
                attachments: selectedModel.attachments || [],
            },
        ])

        setSelectedModel(null)
        setSelectedPreview(null)
    }

    function updateModelAttachments() {
        setPlacedModels(prevModels => prevModels.map(model => {
            const modelRef = refs.current[model.id]
            console.log("ASKLÖT", modelRef.getAttachments)
            if (modelRef && modelRef.getAttachments) {

                return {
                    ...model,
                    attachments: modelRef.getAttachments()
                }
            }
            return model
        }))
    }

    return (
        <div className="relative w-[1200px] h-[800px] bg-gray-100">

            <ComponentPalette models={models} onSelect={handleModelSelect} />
            <BackWallWidthControl backWallWidth={backWallWidth} setBackWallWidth={setBackWallWidth} />
            <Canvas
                camera={{ position: [-2, 2, 3.3], fov: 50 }}
                className="relative outline top-0 left-60 right-80 max-w-4/6 max-h-4/6">
                <Room backWallWidth={backWallWidth} />
                <CameraCoords setCoords={setCoords} />
                <CanvasTools
                    backWallWidth={backWallWidth}
                    showGrid={showGrid}
                    setCoords={setCoords}
                />

                <BackWallPlane
                    backWallWidth={2 + backWallWidth}
                    backWallHeight={5}
                    onHover={pos => setHoverPosition(pos)}
                    onClick={pt => handleCanvasClick(pt)}
                />


                <ClickPlane
                    onClick={handleCanvasClick}
                    onHover={pos => setHoverPosition(pos)}
                />

                {selectedPreview && selectedModel && (

                    <ModelWorkshop
                        model={selectedPreview.component}
                        position={selectedPreview.position}
                        scale={selectedPreview.scale}
                        onReady={() => { }}
                    />
                )}
                {selectedPreview && selectedModel && (
                    <Line points={[hoverPosition, [0, 0, 0]]} lineWidth={1} color="blue" />
                )}

                {placedModels.map((model) =>
                    model.attachments && model.attachments.map((point, index) => (
                        console.log("pröööt",point),
                        <Line
                            key={`${model.id}-${index}`}
                            points={[[0, 0, 0], point]}
                            lineWidth={1}
                            color="blue"
                        />
                    ))
                )}

                {placedModels.map((model) => (
                    <ModelWorkshop
                        key={model.id}
                        id={model.id}
                        model={model}
                        position={model.position}
                        scale={model.scale}
                        ref={el => { if (el) refs.current[model.id] = el }}
                        onReady={(data) => {
                            model.attachments = data.attachments
                            updateModelAttachments()
                        }}
                    />
                ))}

            </Canvas>

            <div className="absolute bottom-2 left-2 p-2 bg-white/80 text-xs rounded shadow">
                {`Camera: x: ${coords[0]}, y: ${coords[1]}, z: ${coords[2]}`}
            </div>

        </div>

    )
}
