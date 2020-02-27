import { action, thunk } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'

import { device } from './device/_device'

export const test = () => ({ device: device({ path: 'test' }) })
