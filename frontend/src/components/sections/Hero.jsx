import Images from "../../assets/images";

const Hero = () => {
  return (
    <section
      className=" relative md:h-[700px] h-[800px] bg-cover bg-center"
      style={{ backgroundImage: `url(${Images.desktopHero})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10  h-full flex   items-center md:px-[50px] px-[10px] text-white">
        <div>
          <h1 className="md:text-5xl animate-slide-in  text-[20px]">House of Turtles</h1>
          <h1 className="md:text-5xl text-[20px]"> where Fashon meets </h1>
         <button  className=" border animate-slide-in  border-white mt-3">see all Products</button>
        </div>
      </div>
     
    </section>
  );
};

export default Hero;
