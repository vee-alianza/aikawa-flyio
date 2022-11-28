
const ProductList = ({ product, isSelected, onClick }) => {
    return (
        <>
            <div className={`product__list ${isSelected ? 'selected' : ''}`}>
                <img className="product__list__image"
                    src={product.photo.filename}
                    alt={`${product.name}`}
                />
                <button onClick={onClick}>{product.name}</button>
            </div>
        </>
    )
}

export default ProductList
