
function CardComponent ({name, company, price, description, ram, storage, image}) {
    return (
        <>
            <div className="component_contrainer">
                <img src={image} alt={name} />
                <div className="component_header">
                    <h2>{name}</h2>
                    <p>{company}</p>
                </div>
                <div className="component_price">
                    <p>${price}</p>
                </div>
                <div className="component_description">
                    <p>{description}</p>
                </div>
                <div className="component_specs">
                    <p>RAM: {ram}</p>
                    <p>Storage: {storage}</p>
                </div>
                <div className="component_buttons">
                    <div className="component_add-to-cart-button">
                        <button>Add to Cart</button>
                    </div>
                    <div className="component_buy-button">
                        <button>Buy Now</button>
                    </div>
                </div>

            </div>
        </>
    );
}

export default CardComponent;