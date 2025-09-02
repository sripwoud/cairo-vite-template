import { createLazyFileRoute } from '@tanstack/react-router'
import { ProveForm as component } from 'c/ProveForm'

export const Route = createLazyFileRoute('/prove')({
  component,
})
