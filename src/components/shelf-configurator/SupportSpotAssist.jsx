
import { Line } from '@react-three/drei'


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
    //const length = sign * (Math.abs(dx) < 0.9 ? 0.7 : 1.0)
    const length = sign * 0.7

    return (
        <group>
            <Line
                points={[[nearest.position[0], 0, 0], [nearest.position[0] + length, 0, 0]]}
                lineWidth={7}
            />
            {supports.map(support => (

                <Line
                    key={support.id}
                    points={[
                        [support.position[0], 0, 0],  // alku Z=0
                        [support.position[0], 0, 5]   // loppu Z=5
                    ]}
                    lineWidth={1}          // ohut viiva
                    color="red"            // punainen
                />
            ))}
        </group>
    )
}

