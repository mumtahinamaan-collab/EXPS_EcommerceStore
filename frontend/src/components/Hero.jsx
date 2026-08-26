import heroImage from "../assets/heroimg.png"
export default function Hero() {
  return (
     <div
      className=" flex items-center w-full h-[400px]  bg-cover bg-center "
      style={{ backgroundImage: `url(${heroImage })` }}
    >
      <div className="max-w- pl-6 md:pl-14">  
  <h1 className="text- md:text- font-extrabold leading-[1.1] text-6xl mb-3">
    Shop Smart. <br /> Live Better
  </h1>
  <p className=" leading-[1.5] mb-6 text-2xl max-w-">
    Explore the latest products at prices you'll love<br></br> Easy shopping, secure payments, and fast delivery
  </p>
  <div className="flex items-center gap-3">
    <button className="bg-black text-white text- px-5 py-2.5 rounded-md flex items-center gap-2">
      Shop Now <span>→</span>
    </button>
    
  </div>

</div>
    </div>
  )
}