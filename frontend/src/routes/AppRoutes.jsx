import ProductPage from '../pages/ProductsPage'
import {Routes,Route} from 'react-router-dom'
import Home from "../pages/Home"
import ProductDetails from "../components/product/ProductDetails"
import CollectionProducts from "../pages/CollectionProducts"

const AppRoutes =() =>
{
     
    return (
   <div>
     <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/product/:id"    element={<ProductDetails />} />
        <Route path="/collections/:name" element={<CollectionProducts />}/>
     </Routes>
   </div>
    )
}

export default AppRoutes