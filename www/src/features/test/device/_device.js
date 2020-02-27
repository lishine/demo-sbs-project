import { action, thunk } from 'easy-peasy'
import isEmpty from 'lodash/isEmpty'

import { register } from './register/_register'
import { ongoing } from './ongoing/_ongoing'

// Local

export const device = ({ path }) => {
    return {
        register: register({ path: `${path}.device` }),
        ongoing: ongoing({ path: `${path}.device` }),
    }
}
