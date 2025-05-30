
import { EffectComposer, Outline, N8AO, TiltShift2, ToneMapping } from "@react-three/postprocessing"
import React from 'react'

function _Effects() {
    console.log("EFEEEKTIIIIIIT !!!")
    return (
        <EffectComposer stencilBuffer disableNormalPass autoClear={false} multisampling={8}>
            <N8AO halfRes aoSamples={8} aoRadius={0.4} distanceFalloff={0.75} intensity={1} />
            <Outline
                visibleEdgeColor="white"
                hiddenEdgeColor="white"
                blur
                edgeStrength={20}
            />
            <TiltShift2 samples={6} blur={0.0001} />
            <ToneMapping />
        </EffectComposer>
    )
}

export const Effects = React.memo(_Effects)