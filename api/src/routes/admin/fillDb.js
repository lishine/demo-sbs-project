// Common
import { queryDb } from 'utils/utils'

// Local
import * as tables from './tables/index'

export const fillDb = async ({ body }) => {
    console.log('fillDB, body', body)
    return Promise.all(
        Object.values(tables).map(f => f({ queryDb: queryDb({ role: 'fill' }) }))
    )
}
