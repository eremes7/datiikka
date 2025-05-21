import { materialBank } from "./utils/materialMap"

export function ComponentPalette({ models, onSelect }) {
    if (!models) return null

    const materials = [
        { key: "wood", img: materialBank.wood.map },
        { key: "black", img: materialBank.black.map },
        { key: "white", img: materialBank.white.map },
    ]

    return (
        <div className="absolute left-2 top-2 z-10 bg-white/80 p-2 rounded shadow text-sm w-70">
            <div className="font-semibold mb-2">Palette: (Click a material)</div>

            {models.map((model, i) => (
                <div
                    key={i}
                    className="flex items-center border border-black h-11 w-63 p-2 mb-2 bg-white"
                >
                    {model.name}
                    <div
                        className="w-16 h-16 bg-center bg-contain bg-no-repeat"
                        style={{ backgroundImage: `url(${materialBank.shelf})` }}
                    />

                    {/* Materiaalinapit */}
                    <div className="flex space-x-2 ml-auto">
                        {materials.map(({ key, img }) => (
                            <button
                                key={key}
                                onClick={() => onSelect(model, key)}
                                className="w-5 h-5 bg-center bg-cover rounded border border-gray-300"
                                style={{ backgroundImage: `url(${img})` }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ComponentPalette
