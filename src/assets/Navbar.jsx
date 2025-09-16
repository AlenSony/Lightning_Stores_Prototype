import './Navbar.css';

function NavBar() {
    return(
        <div className="navbar">
            <img src="/logo.svg" alt="Logo" />
            <div className="search-bar">
                <input type="text" placeholder="Search for products..." />
                <button><i className="fa-solid fa-magnifying-glass"></i> Search</button>
            </div>
        </div>
    )
}

export default NavBar;