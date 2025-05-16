export default function FrontPage() {
    return (
      <div
        className="
          relative
          top-5 
          w-full         /* leveydeksi 100% */
          h-screen       /* korkeudeksi 100vh */
          bg-[url('/imgs/rend3.png')] /* JIT-arbitrary taustakuva */
          bg-center      /* keskitä kuva */
          bg-cover       /* skaalaa niin, että täyttää elementin */
          bg-no-repeat   /* ei toisteta */
        "
      >
        <h1 className="absolute top-100 left-8 text-white text-4xl font-bold">
          Etusivu
        </h1>
      </div>
    )
  }