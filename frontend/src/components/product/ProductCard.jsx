import React from 'react'
import { Link } from 'react-router-dom'

const BusinessModelBadge = ({ model }) => {
  const colors = {
    B2B: 'bg-blue-500',
    B2C: 'bg-green-500',
    C2C: 'bg-purple-500'
  }

  {/*return (
    <span className={`${colors[model]} text-white px-2 py-1 rounded text-xs font-semibold`}>
      {model}
    </span>
  )*/}
}

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <img 
            src={product.image || 'https://via.placeholder.com/400x300?text=Product+Image'} 
            alt={product.name}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {product.business_models?.map(model => (
              <BusinessModelBadge key={model} model={model} />
            ))}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 truncate">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.bulk_price && (
              <span className="text-sm text-blue-600">
                Bulk: ₹{product.bulk_price}
              </span>
            )}
          </div>
          
          {product.seller_name && (
            <p className="text-xs text-gray-500 mt-2">
              Sold by: {product.seller_name}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
