import { SiGithub } from '@icons-pack/react-simple-icons'
import { ExternalLink } from 'c/ExternalLink'
import { config } from 'l/config'

export const Footer = () => (
  <footer className='flex justify-center items-center py-4'>
    <ExternalLink href={`https://github.com/sripwoud/${config.appName}`}>
      <SiGithub size={20} />
    </ExternalLink>
  </footer>
)
