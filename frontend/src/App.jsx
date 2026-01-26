


import AppRoutes from "./routes/AppRoutes"
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'

const App = () => {
  return (
    <div>
      <Navbar />
     
    <AppRoutes />
    </div>
  )
}

export default App