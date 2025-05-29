import React, { useState, useEffect, useRef, useMemo } from 'react'
import { findSupportHome } from './findSupportHome'

export function findProperHomeForAttachments(placedModels, point, selectedPreview) {
    const attachmentSet = selectedPreview.attachments
    attachmentSet.forEach(i => {
        i.x = findSupportHome(placedModels, point)[0]
    });
    const asArray = attachmentSet.map(vec => [vec.x, vec.y, vec.z])
    return asArray
}

