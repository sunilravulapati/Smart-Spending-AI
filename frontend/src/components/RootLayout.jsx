import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import Footer from './Footer'

const RootLayout = () => {
  return (
    <div className="root-layout">
      <NavBar />
      <main className="root-outlet">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout