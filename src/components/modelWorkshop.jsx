import { useEffect, useRef, forwardRef } from 'react'

const modules = import.meta.glob('../3D_objektit/*/*.jsx', { eager: true })

export const modelList = []
export const modelMap = {}

for (const path in modules) {
    const match = path.match(/\/3D_objektit\/([^/]+)\/([^/]+)\.jsx$/)
    if (match) {
        const url = match[0]

        const name = match[1]
        const mod = modules[path]

        const component = mod.Model || mod.default
        const isSupport = name.toLowerCase().includes('support')

        if (component) {
            modelList.push({
                name,
                component,
                isSupport,
            })
            modelMap[name] = component
        }
    }
}

export const ModelWorkshop = forwardRef(({ model, attachments, position, scale, onReady, id, ...props }, ref) => {
    const attachmentPoints = useRef([])
    const groupRef = useRef()

    
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
      }, [model, onReady, id, ref])

    function getAttachments() {
        return [...attachmentPoints.current]
    }
    const combinedRef = ref || groupRef
    if (combinedRef) {
        combinedRef.current = {
            getAttachments,
        }
    }
    const Component = model.component || model
    const adjustedPosition = model.isSupport ? [position[0], 0, position[2]] : position

    return (
        <group ref={ref || groupRef}>
            <Component position={adjustedPosition} attachments={attachmentPoints.current} scale={scale} {...props} />
        </group>
    )
})
