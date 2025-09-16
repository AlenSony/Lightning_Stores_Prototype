import NavBar from '../assets/Navbar.jsx';
import '../stylings/ItemPage.css';

function ItemPage() {

  return (
    <>
    <div className="container">
      <Aurora
        colorStops={["#1F75FE", "#FFFFF3", "#1F75FE"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <NavBar />


    </div>
    </>
  )
}

export default ItemPage