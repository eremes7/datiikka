import { useEffect, useRef, forwardRef, useLayoutEffect, useImperativeHandle } from 'react'
import { useMaterialTextures } from './useMaterialTextures'
import { MeshStandardMaterial } from 'three'

export const ModelWorkshop = forwardRef(({ model, materialKey, attachments, position, scale, onReady, id, ...props }, ref) => {
    const attachmentPoints = useRef([])
    const groupRef = useRef()
    const mats = useMaterialTextures(materialKey)



    useLayoutEffect(() => {
        const obj = (ref && ref.current) || groupRef.current
        if (!obj || !mats) return

        obj.traverse((child) => {
            if (child.isMesh) {
                const newMat = new MeshStandardMaterial({ ...mats })
                child.material = newMat
                child.material.needsUpdate = true
            }
        })
    }, [model, mats])
    useImperativeHandle(ref, () => groupRef.current, [groupRef.current])
    useEffect(() => {
        const obj = (ref && ref.current) || groupRef.current
        if (!obj) return


        attachmentPoints.current = []
        for (const obj of model.component().props.children || []) {
            if (obj.type === 'group') {
                attachmentPoints.current.push(obj.props.position)
            }
        }

        if (typeof onReady === 'function') {
            onReady({ object: obj, attachments: attachmentPoints.current }, id)
        }
    }, [model, onReady, id, ref, position])

    const Component = model.component
    const adjustedPosition = model.isSupport ? [position[0], 0, 0] : position
    const displayAttachments = attachmentPoints.current.map(
        ([, y, z]) => [adjustedPosition[0], y, z]
    );
    //console.log("MALLI => ",model)
    //console.log("KOMPONENTTI => ",model.component)

    return (
        <group ref={groupRef} position={position} scale={scale} {...props}>
            <Component ref={groupRef} position={adjustedPosition} attachments={displayAttachments} scale={scale} {...props} />
        </group>
    )
})
