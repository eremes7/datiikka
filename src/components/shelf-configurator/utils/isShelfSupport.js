import * as THREE from 'three';

export function isShelfSupported(lastHome, refs) {
    console.log("REFS", refs)
    const raycaster = new THREE.Raycaster();
    const objects = Object.values(refs.current).filter(group => group instanceof THREE.Object3D);
    console.log("TEsTIIII", objects)
    // piupiu
    raycaster.set(new THREE.Vector3(lastHome[0] + 0.2, lastHome[1], lastHome[2]), new THREE.Vector3(1, 0, -0.05));


    const intersects = raycaster.intersectObjects(objects, true)
    console.log("OSUMAT", intersects)
    console.log("OSUMAT2", intersects.some(i => i.object.parent.parent.parent.parent.userData))
    return intersects.some(i => i.object.parent.parent.parent.parent.userData);
}