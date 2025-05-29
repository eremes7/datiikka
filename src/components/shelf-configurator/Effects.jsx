
import { EffectComposer, Outline, N8AO, TiltShift2, ToneMapping } from "@react-three/postprocessing"
import { useThree } from "@react-three/fiber"

export function Effects() {
    const { size } = useThree()
    return (
      <EffectComposer stencilBuffer disableNormalPass autoClear={false} multisampling={8}>
        <N8AO halfRes aoSamples={8} aoRadius={0.4} distanceFalloff={0.75} intensity={1} />
        <Outline visibleEdgeColor="white" hiddenEdgeColor="white" blur width={size.width * 1.25} edgeStrength={10} />
        <TiltShift2 samples={6} blur={0.0001} />
        <ToneMapping />
      </EffectComposer>
    )
  }