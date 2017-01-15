import { createDispatcherWithCommands } from 'slux'
import store from './store'
import {
  checkout,
  addToCart,
  loadProducts
} from './store/updaters'

export const { dispatcher, commands } = createDispatcherWithCommands(store, to => ({
  checkout: to(checkout),
  addToCart: to(addToCart),
  loadProducts: to(loadProducts),
}))
