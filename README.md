# FreeCAD model pipeline

FreeCAD component as Part.makeCompound([])
    attachments and component parts separate "Part::Feature"
    attachments named "attach_left, attach_1, attach_top ..."

Export as gltf e.g. /CAD
run this.



FILE=Support_009; \


npx gltfjsx "$FILE.gltf" --transform -j \
    && mv "${FILE}-transformed.glb" ../public/ \
    && mkdir -p "../src/3D_objektit/$FILE" \
    && mv "${FILE}.jsx" "../src/3D_objektit/$FILE/"

