import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

export function DollyControls({
    target = [0, 1, 0],       // kiinteä katsepiste
    sensitivityX = 0.01,      // X-akselin herkkyys
    sensitivityZ = 0.02       // Z-skaalauskerroin |x| mukaan
}) {
    const { camera, gl } = useThree()
    const dragging = useRef(false)
    const startMouse = useRef([0, 0])
    const startPos = useRef(new THREE.Vector3())
    const vecTarget = useRef(new THREE.Vector3(...target))

    // katso heti oikeaan pisteeseen
    useEffect(() => {
        camera.lookAt(vecTarget.current)
    }, [camera])

    useEffect(() => {
        const canvas = gl.domElement

        function onDown(e) {
            if (e.button !== 0) return
            dragging.current = true
            startMouse.current = [e.clientX, e.clientY]
            startPos.current.set(camera.position.x, camera.position.y, camera.position.z)
            canvas.setPointerCapture(e.pointerId)
        }

        function onUp(e) {
            if (e.button !== 0) return
            dragging.current = false
            canvas.releasePointerCapture(e.pointerId)
        }

        function onMove(e) {
            if (!dragging.current) return
            const [sx, sy] = startMouse.current
            const dx = e.clientX - sx
            const dy = e.clientY - sy

            // yhdistä oikea tai ylös => positiivinen, vasen tai alas => negatiivinen
            const deltaX = (dx - dy) * sensitivityX

            // laske ja rajoita x
            const newX = startPos.current.x + deltaX
            const clampedX = Math.max(-3.9, Math.min(3.9, newX))

            const clampedZ = 4 + Math.cos(clampedX/2)/2


            camera.position.set(clampedX, startPos.current.y, clampedZ)
            camera.lookAt(vecTarget.current)
        }

        canvas.addEventListener('pointerdown', onDown)
        canvas.addEventListener('pointermove', onMove)
        canvas.addEventListener('pointerup', onUp)

        return () => {
            canvas.removeEventListener('pointerdown', onDown)
            canvas.removeEventListener('pointermove', onMove)
            canvas.removeEventListener('pointerup', onUp)
        }
    }, [camera, gl.domElement, sensitivityX, sensitivityZ])

    return null
}
