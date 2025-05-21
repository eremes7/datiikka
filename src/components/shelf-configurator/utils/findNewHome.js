export function findNewHome(selectedPreview, worldAttachments, placedModels) {
    if (!worldAttachments.length || !placedModels.some(m => m.isSupport)) return;

    let best = {
        dist: Infinity,
        pair: null,
        place: null
    };

    for (const support of placedModels) {
        if (support.isSupport) {
            for (const point of support.attachments) {
                const dx = point[0] - worldAttachments[0];
                const dy = point[1] - worldAttachments[1];
                const dz = point[2] - worldAttachments[2];
                const d = Math.hypot(dx, dy, dz);
                if (d < best.dist) {
                    best.dist = d;
                    best.place = point;

                }
            }
        }
    }


    return best.place;
}