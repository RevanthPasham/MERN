import ProductPage from '../pages/ProductsPage'
import {Routes,Route} from 'react-router-dom'
import Home from "../pages/Home"

const AppRoutes =() =>
{
     
    return (
   <div>
     <Routes>
        <Route path="/" element={<Home />} />
        
     </Routes>
   </div>
    )
}

export default AppRoutes