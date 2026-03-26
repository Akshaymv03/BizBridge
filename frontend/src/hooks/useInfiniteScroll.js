import { useState, useEffect, useCallback, useRef } from 'react'

export const useInfiniteScroll = (fetchMore, hasMore) => {
  const [loading, setLoading] = useState(false)
  const observerRef = useRef(null)
  const loadMoreRef = useRef(null)

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !loading) {
        setLoading(true)
        fetchMore().finally(() => setLoading(false))
      }
    },
    [fetchMore, hasMore, loading]
  )

  useEffect(() => {
    const element = loadMoreRef.current
    const option = { threshold: 0.5 }

    observerRef.current = new IntersectionObserver(handleObserver, option)
    
    if (element) {
      observerRef.current.observe(element)
    }

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element)
      }
    }
  }, [handleObserver])

  return { loadMoreRef, loading }
}
