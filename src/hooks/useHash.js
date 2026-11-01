import { useEffect, useState } from 'react'

// The current location hash. Blog posts live at #/blog/<slug>; every other hash is a section anchor.
export function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return hash
}
