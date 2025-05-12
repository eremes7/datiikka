import { useEffect, useRef, forwardRef } from 'react'
import { modelMap, modelList } from './modelMap'

export const ModelWorkshop = forwardRef(({ model, materialKey, attachments, position, scale, onReady, id, ...props }, ref) => {
    const attachmentPoints = useRef([])
    const groupRef = useRef()

    console.log(ref.current)
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


    const Component = model.component || model
    const adjustedPosition = model.isSupport ? [position[0], 0, 0] : position


    const displayAttachments = attachmentPoints.current.map(
        ([, y, z]) => [adjustedPosition[0], y, z]
    );

    return (
        <group ref={ref || groupRef}>
            <Component position={adjustedPosition} attachments={displayAttachments} scale={scale} {...props} />
        </group>
    )
})
