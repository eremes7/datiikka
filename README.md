# FreeCAD model pipeline

FreeCAD component as Part.makeCompound([])
    attachments and component parts separate "Part::Feature"
    attachments named "attach_left, attach_1, attach_top ..."

Export as gltf e.g. /CAD

Load files to Blender. Select all from model -> Edit -> Smart UV transform -> export as glb to /CAD

run this.

cd ~/hooli/CAD

FILE=CutSupport_001; \


npx gltfjsx "$FILE.glb" --transform -j \
    && mv "${FILE}-transformed.glb" ../public/ \
    && mkdir -p "../src/3D_objektit/$FILE" \
    && mv "${FILE}.jsx" "../src/3D_objektit/$FILE/"

