import { Link } from "react-router-dom";


export function Products() {
    const products = [
        { name: "Eetu-Hylly", title: "Eetu-Hylly", description: "Kuvaus Eetu-Hyllystä", image: "/imgs/kuva_001.png" },

    ];

    return (
        <div>
            <h3 className="text-left ml-20 font-bold text-6xl pt-16">Tuotteet</h3>
            <div className="ml-20 mt-2 mb-8 w-48 h-1 bg-black"></div>

            <div className="overflow-x-auto ml-20 pt-10 whitespace-nowrap px-8 space-x-6 flex pb-4">                {products.map((product) => (
                <Link
                    key={product.name}
                    to={`/products/${product.name}`}
                    className="inline-block min-w-[340px] flex-shrink-0 border rounded-lg shadow hover:shadow-lg transition-transform duration-200 transform hover:scale-105"
                >
                    <img src={product.image} alt={product.title} className="w-full h-64 object-cover rounded-t-lg" />
                    <div className="p-4">
                        <h4 className="text-lg font-bold">{product.title}</h4>
                        <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                </Link>
            ))}
            </div>
        </div>
    );
}
export default Products