import { createConnector } from 'slux/react'
import facade from './stores/facade'

export type Methods = typeof facade.methods;

export default createConnector(facade)
