import Images from "../../assets/images";
import { IoSearchOutline, IoPersonOutline, IoBagOutline } from "react-icons/io5";

const Navbar = () => {
  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-black/80">

      <div className="h-[60px] flex justify-between items-center md:mx-[50px] mx-[10px] text-white">

        <div className="flex items-center gap-3">

          <img
            src={Images.desktopHero}
            className="h-[30px] w-[60px] object-cover rounded"
          />
           <p>Shop All</p>
           <p>Contact Us</p>
        </div>

        <div className="flex items-center gap-4">

          <IoSearchOutline size={22} />
          <IoPersonOutline size={22} />
          <IoBagOutline size={22} />

        </div>

      </div>
      
    </header>
  );
};

export default Navbar;
