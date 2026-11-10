import { useEffect, useState } from 'react'

// The current location hash: a section anchor on the home page, such as #contact.
export function useHash() {
  // No window in the build-time render (src/entry-server.jsx).
  const [hash, setHash] = useState(() => (typeof window === 'undefined' ? '' : window.location.hash))

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return hash
}
