import { Link } from '@tanstack/react-router'
import { config } from 'l/config'
import { capitalize, titleCase } from 'l/format'

const links = ['prove', 'verify'] as const

export function Header() {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link to='/'>
        <h1 className='text-xl font-bold'>{titleCase(config.appName)}</h1>
      </Link>
      {links.map((r) => (
        <Link key={r} to={`/${r}`}>
          {capitalize(r)}
        </Link>
      ))}
    </nav>
  )
}
