#!/usr/bin/env python3
import sys, os, argparse
import bpy

def parse_args():
    # Only consider args after the "--" separator
    if "--" in sys.argv:
        idx = sys.argv.index("--") + 1
        script_argv = sys.argv[idx:]
    else:
        script_argv = []

    parser = argparse.ArgumentParser(
        description="Apply a decal texture and render a glTF/GLB via Blender (headless)"
    )
    parser.add_argument(
        "--gltf", required=True,
        help="Path to input .gltf/.glb file"
    )
    parser.add_argument(
        "--image", required=True,
        help="Path to decal image (PNG/JPG)"
    )
    parser.add_argument(
        "--output", required=True,
        help="Path for output render PNG"
    )
    parser.add_argument(
        "--objname", required=False,
        help="Optional exact mesh name to target; defaults to first mesh"
    )
    return parser.parse_args(script_argv)


def import_gltf(filepath):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.abspath(filepath))
    new_objs = set(bpy.data.objects) - before
    return list(new_objs)


def apply_texture(objs, obj_name, img_path):
    # Load the decal image
    img = bpy.data.images.load(os.path.abspath(img_path))

    # Create a new material with nodes enabled
    mat = bpy.data.materials.new(name="DecalMat")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # Create an image texture node
    tex_node = nodes.new(type="ShaderNodeTexImage")
    tex_node.image = img

    # Connect it to the Principled BSDF
    bsdf = nodes.get("Principled BSDF")
    if not bsdf:
        bsdf = nodes.new(type="ShaderNodeBsdfPrincipled")
    links.new(tex_node.outputs["Color"], bsdf.inputs["Base Color"])

    # Select target object
    if obj_name:
        obj = bpy.data.objects.get(obj_name)
    else:
        meshes = [o for o in objs if o.type == "MESH"]
        obj = meshes[0] if meshes else None

    if not obj or obj.type != "MESH":
        raise RuntimeError(f"No mesh found for '{obj_name}'")

    # Assign material
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)


def setup_camera_and_light():
    # Camera setup
    cam_data = bpy.data.cameras.new(name="SceneCam")
    cam_obj = bpy.data.objects.new("SceneCam", cam_data)
    bpy.context.collection.objects.link(cam_obj)
    cam_obj.location = (5, -5, 5)
    cam_obj.rotation_euler = (1.1, 0, 0.78)
    bpy.context.scene.camera = cam_obj

    # Sun lamp setup
    light_data = bpy.data.lights.new(name="SunLight", type='SUN')
    light_obj = bpy.data.objects.new("SunLight", light_data)
    light_obj.location = (5, -5, 5)
    bpy.context.collection.objects.link(light_obj)


def render(output_path):
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.render.image_settings.file_format = 'PNG'
    scene.render.filepath = os.path.abspath(output_path)
    bpy.ops.render.render(write_still=True)


def main():
    args = parse_args()
    # Import the GLTF/GLB file
    imported_objs = import_gltf(args.gltf)
    # Apply the decal texture
    apply_texture(imported_objs, args.objname, args.image)
    # Set up camera and lighting
    setup_camera_and_light()
    # Render to PNG
    render(args.output)


if __name__ == "__main__":
    main()
