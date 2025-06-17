import { materialBank } from './utils/materialMap'
import React, { useRef, useState } from 'react'
import { modelMap } from './utils/modelMap'
import { useCart } from '../../context/CartContext';

function GiveModelsPretty({ placedModels }) {
    // Rakennetaan ryhmittely: { name: { total: x, materials: { materialKey: y } } }
    const countMap = placedModels.reduce((acc, model) => {
        const { name, materialKey } = model;
        if (!acc[name]) {
            acc[name] = { total: 0, materials: {} };
        }
        acc[name].total += 1;
        acc[name].materials[materialKey] = (acc[name].materials[materialKey] || 0) + 1;
        return acc;
    }, {});

    return (
        <ul>
            {Object.entries(countMap).map(([name, data]) => (
                <li key={name} className='p-5'>
                    {data.total}x {name}
                    <ul className='p-3'>
                        {Object.entries(data.materials).map(([material, count]) => (
                            <li key={material}>.....{count}x {material}</li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
}

// Hydraa importoidut mallit = lisää component
function hydrateImportedModels(importedList) {
    return importedList.map(raw => ({
        ...raw,
        component: modelMap[raw.name] ?? null,
        id: Date.now() + Math.random(),
    }))
}

function PlacedModelImportExport({ placedModels, addPlacedModel }) {
    // Export state
    const [exportString, setExportString] = useState('');
    const [copied, setCopied] = useState(false);
    const exportInputRef = useRef(null);

    // Import state
    const [importString, setImportString] = useState('');

    // Export (create serializable string)
    function handleExport() {
        const serializable = placedModels.map(({ component, ...rest }) => rest);
        const raw = JSON.stringify(serializable);
        setExportString(raw);
        setCopied(false);
    }

    // Copy to clipboard
    function handleCopy() {
        if (exportInputRef.current) {
            exportInputRef.current.select();
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        }
    }

    // Import (parse and hydrate)
    function handleImport() {
        try {
            const importedList = JSON.parse(importString);
            if (!Array.isArray(importedList)) {
                alert("Invalid format");
                return;
            }
            const hydrated = hydrateImportedModels(importedList);
            hydrated.forEach(model => addPlacedModel(model));
            setImportString('');
        } catch (e) {
            alert("Failed to parse JSON");
        }
    }

    return (
        <div className="mt-4 bottom space-y-5">

            {/* Export */}
            <div className="w-full max-w-sm">
                <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Export placed models</span>
                </div>
                <div className="flex items-center">
                    <button
                        className="shrink-102 z-10 inline-flex items-center py-1 px-4 text-sm font-medium text-white bg-blue-700 border hover:bg-blue-800 rounded-s-lg border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                        onClick={handleExport}
                        type="button"
                    >
                        Export
                    </button>
                    <div className="relative w-full">
                        <input
                            ref={exportInputRef}
                            type="text"
                            className="bg-gray-50 border border-e-0 border-gray-300 text-gray-500 text-sm border-s-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                            value={exportString}
                            readOnly
                            disabled
                        />
                    </div>
                    <button
                        className="shrink-0 z-10 inline-flex items-center py-1 px-4 text-sm font-medium text-gray-500 hover:text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
                        type="button"
                        onClick={handleCopy}
                        disabled={!exportString}
                    >
                        {/* Clipboard icon */}
                        {!copied ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                            </svg>
                        ) : (
                            // Checkmark icon when copied
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
                            </svg>
                        )}
                    </button>
                </div>

            </div>

            {/* Import */}
            <div className="w-full max-w-sm">
                <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Import placed models</span>
                </div>
                <div className="flex items-center">
                    <div className="relative w-full">
                        <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1"
                            value={importString}
                            onChange={e => setImportString(e.target.value)}
                            placeholder="Paste exported string here"
                        />
                    </div>
                    <button
                        className="shrink-0 z-10 inline-flex items-center py-1 px-4 text-sm font-medium text-white bg-green-700 border hover:bg-green-800 rounded-e-lg border-green-700 focus:ring-4 focus:outline-none focus:ring-green-300"
                        type="button"
                        onClick={handleImport}
                        disabled={!importString}
                    >
                        Import
                    </button>
                </div>
            </div>
        </div>
    );
}

// Huom! addPlacedModel joko yksittäiselle mallille TAI listalle!
export function PlacedModelSidebar({ placedModels, addPlacedModel }) {
    const { addItem } = useCart();

    const handleSendAllToCart = () => {
        placedModels.forEach(m =>
            addItem({
                id: `${m.id}-${m.materialKey}`,          // unikoodi koriin
                name: `${m.name} (${m.materialKey})`,
                price: m.price ?? 0                      // jos hinta saatavilla
            })
        );
    };
    return (
        <aside className="flex flex-col h-full p-4 bg-white shadow-inner">
            {/* Otsikko */}
            <h3 className="font-semibold mb-2">Placed Components</h3>

            {/* Lista – vie kaikki ylimääräinen tila, saa skrollata */}
            <div className="flex-1 overflow-y-auto">
                <ul className="space-y-2">
                    <GiveModelsPretty placedModels={placedModels} />
                    {placedModels.length === 0 && (
                        <li className="text-gray-500">No models placed</li>
                    )}
                </ul>
            </div>

            <button
                onClick={handleSendAllToCart}
                disabled={placedModels.length === 0}
                className="mt-4 w-full py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
                Vie ostoskoriin
            </button>

            {/* Import / Export – aina alareunassa */}
            <div className="mt-auto">
                <PlacedModelImportExport
                    placedModels={placedModels}
                    addPlacedModel={addPlacedModel}
                />
            </div>
        </aside>
    );
}

export default PlacedModelSidebar
