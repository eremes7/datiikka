
export function findSupportHome(placedModels, point) {
    const supports = placedModels.filter(m => m.isSupport)
    if (!placedModels.some(m => m.isSupport)) return [point.x, 0, -0.3]

    const nearest = supports.reduce((best, curr) => {
        return Math.abs(point.x - curr.position[0]) <
            Math.abs(point.x - best.position[0])
            ? curr
            : best
    }, supports[0])

    const dx = point.x - nearest.position[0]
    const sign = Math.sign(dx) || 1
    //const length = sign * (Math.abs(dx) < 0.9 ? 0.75 : 1.0)
    const length = sign * 0.77
    return ([nearest.position[0] + length, 0, 0])
}
