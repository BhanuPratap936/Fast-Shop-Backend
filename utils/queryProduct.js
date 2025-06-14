const categoryQuery = (products, query) => {

    return query.category
        ? products.filter(p => p.category === query.category)
        : products
}

const ratingQuery = (products, query) => {

    return query.rating
        ? products.filter(p => {
            const rating = parseInt(query.rating, 10)
            return rating <= p.rating && p.rating < rating + 1
        })
        : products
}

const priceQuery = (products, query) => {
    const {lowPrice, highPrice} = query;
    if (lowPrice !== undefined && highPrice !== undefined) {
        return products.filter(p => p.price >= lowPrice && p.price <= highPrice)
    }

    return products

}

const sortByPrice = (products, query) => {
    if (!query.sortPrice) return products

    const sorted = [...products]
    if (query.sortPrice === 'low-to-high') {
        return sorted.sort((a, b) => a.price - b.price)
    } else if (query.sortPrice === 'high-to-low') {
        return sorted.sort((a, b) => b.price - a.price)
    }

    return products;
}

const skip = (products, query) => {
    const pageNumber = parseInt(query.pageNumber, 10) || 1
    const perPage = parseInt(query.perPage, 10) || products.length
    const skipPage = (pageNumber - 1) * perPage
    return products.slice(skipPage)
}

const limit = (products, query) => {
    const perPage = parseInt(query.perPage, 10)
    if (!isNaN(perPage)) {
        return products.slice(0, perPage)
    }

    return products
}

const searchQuery = (products, query) => {
    return query.searchValue 
    ? products.filter(p => p.name.toUpperCase().includes(query.searchValue.toUpperCase()))
    : products
}
    
const getProducts = (products) => {
    return products
}

const countProducts = (products) => {
    return products.length
}



const queryProducts = (products, query) => {
    let result = products
    result = categoryQuery(result, query)
    result = ratingQuery(result, query)
    result = priceQuery(result, query)
    result = searchQuery(result, query)
    result = sortByPrice(result, query)
    result = skip(result, query)
    result = limit(result, query)

    return result
}

module.exports = {
    queryProducts,
    categoryQuery,
    ratingQuery,
    priceQuery,
    sortByPrice,
    skip,
    limit,
    getProducts,
    countProducts,
    searchQuery
}