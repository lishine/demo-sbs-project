export const rTableToHasura = ({ columns, sortBy, filters, pageIndex, pageSize }) => {
    let orderBy = []
    sortBy.forEach(column => {
        const { id: fieldName, desc } = column
        orderBy.push({ [fieldName]: desc ? 'desc' : 'asc' })
    })
    console.log('filters', filters)
    let filterBy = []
    Object.entries(filters).forEach(([fieldName, filter]) => {
        if (filter) {
            const { filterProperties } =
                columns.find(column => (column.id || column.accessor) === fieldName) || {}
            const { kind } = filterProperties
            if (kind === 'textBeginning') {
                filterBy.push({ [fieldName]: { _ilike: `${filter}%` } })
            } else if (kind === 'textContains') {
                filterBy.push({ [fieldName]: { _ilike: `%${filter}%` } })
            }
        }
    })

    const limit = pageSize
    const offset = pageIndex * pageSize

    console.log('{ orderBy, filterBy }', { orderBy, filterBy })
    return { orderBy, filterBy, limit, offset }
}
