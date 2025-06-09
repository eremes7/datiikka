export default function FrontPage() {
    return (
        <div
            className="
                w-full         /* leveydeksi 100% */
                h-screen       /* korkeudeksi 100vh */
                "
        >

            <h1 className="absolute top-100 left-8 text-white text-4xl font-bold">
                Etusivu
            </h1>

            <img src='/imgs/rend22.png' className="relative -top-20 w-100%" />
            <img src='/imgs/rend23.png' />

        </div>
    )
}
