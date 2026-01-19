import ProductPage from '../pages/ProductsPage'
import {Routes,Route} from 'react-router-dom'
import Home from "../pages/Home"
import ProductDetails from "../components/product/ProductDetails"

const AppRoutes =() =>
{
     
    return (
   <div>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        
     </Routes>
   </div>
    )
}

export default AppRoutes