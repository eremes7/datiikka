import { useEffect, useRef, forwardRef, useLayoutEffect, useImperativeHandle } from 'react'
import { useMaterialTextures } from './useMaterialTextures'
import { MeshStandardMaterial } from 'three'
import React from 'react'


export const ModelWorkshop = forwardRef(({ model, materialKey, attachments, position, scale, onReady, id, ...props }, ref) => {
    const attachmentPoints = useRef([])
    const groupRef = useRef()
    const mats = useMaterialTextures(materialKey)
    const prevMatsRef = useRef(null)
    useImperativeHandle(ref, () => groupRef.current, [groupRef.current])

    useLayoutEffect(() => {
        if (!mats || prevMatsRef.current === mats) return
        prevMatsRef.current = mats

        console.log("ÄLÄMÖÄDSÄÖHD",model)
        
        const obj = (ref && ref.current) || groupRef.current
        if (!obj || !mats) return
        if (obj.isMesh) {
            const newMat = new MeshStandardMaterial({ ...mats })
            obj.material = newMat
            obj.material.needsUpdate = true
            return
        }
        obj.traverse((child) => {
            if (child.isMesh) {
                const newMat = new MeshStandardMaterial({ ...mats })
                child.material = newMat

                child.material.needsUpdate = true
            }
        })
    }, [model])


    
    useEffect(() => {
        const obj = (ref && ref.current) || groupRef.current
        if (!obj.children[0].children) return
        console.log("iik minut ajettiin")
        attachmentPoints.current = []

        for (const obj2 of obj.children[0].children) {
            if (!obj2) return
            attachmentPoints.current.push(obj2.position)
        }

        if (typeof onReady === 'function') {
            onReady({ object: obj, attachments: attachmentPoints.current }, id)
        }
    }, [model, onReady, id])






    const Component = model.component
    const adjustedPosition = model.isSupport ? [position[0], 0, 0] : position
    const displayAttachments = attachmentPoints.current.map(vec => [
        adjustedPosition[0], // override x
        vec.y,
        vec.z
    ]);

    console.log("MALLI => ",model)
    console.log("KOMPONENTTI => ",model.component)
    console.log(model.isSupport)
    return (
        <group ref={groupRef} userData={model.isSupport}>
            <Component position={adjustedPosition} attachments={displayAttachments} scale={scale} {...props} />
        </group>
    )
})
