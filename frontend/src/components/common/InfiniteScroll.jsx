import React from 'react'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import Loader from './Loader'

const InfiniteScroll = ({ 
  data, 
  fetchMore, 
  hasMore, 
  renderItem,
  containerClass = 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6'
}) => {
  const { loadMoreRef, loading } = useInfiniteScroll(fetchMore, hasMore)

  return (
    <div className="w-full">
      <div className={containerClass}>
        {data.map((item, index) => (
          <div key={item.id || index}>
            {renderItem(item)}
          </div>
        ))}
      </div>
      
      <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
        {loading && <Loader />}
        {!hasMore && data.length > 0 && (
          <p className="text-gray-500">No more products to load</p>
        )}
      </div>
    </div>
  )
}

export default InfiniteScroll
