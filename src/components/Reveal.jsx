import { useReveal } from '../hooks/useReveal.js'

export default function Reveal({ as = 'div', className = '', delay = 0, children, ...rest }) {
  const Tag = as
  const [ref, visible] = useReveal()
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
