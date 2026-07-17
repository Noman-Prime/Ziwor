export const GET_SHOP = `
    query GetShop {
        shop {
            name
            description
            primaryDomain {
                host
                url
            }
        }
    }
`;

export const GET_COLLECTIONS = `
    query GetCollections($language: LanguageCode!)
    @inContext(language: $language) {
        collections(first: 20) {
            edges {
                node {
                    id
                    title
                    handle
                    description
                    image {
                        url
                        altText
                    }
                }
            }
        }
    }
`;

export const GET_COLLECTION_BY_HANDLE = `
    query GetCollectionByHandle($handle: String!) {
        collection(handle: $handle) {
            id
            title
            handle
            description
            image {
                url
                altText
            }
            products(first: 50) {
                edges {
                    node {
                        id
                        title
                        handle
                        description
                        availableForSale
                        featuredImage {
                            url
                            altText
                            width
                            height
                        }
                        priceRange {
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        compareAtPriceRange {
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        variants(first: 20) {
                            edges {
                                node {
                                    id
                                    title
                                    availableForSale
                                    price {
                                        amount
                                        currencyCode
                                    }
                                    compareAtPrice {
                                        amount
                                        currencyCode
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
export const GET_CART = `
    query GetCart($cartId: ID!) {
        cart(id: $cartId) {
            id
            checkoutUrl
            totalQuantity
            createdAt
            updatedAt
            cost {
                subtotalAmount {
                    amount
                    currencyCode
                }
                totalAmount {
                    amount
                    currencyCode
                }
            }
            lines(first: 100) {
                edges {
                    node {
                        id
                        quantity
                        cost {
                            totalAmount {
                                amount
                                currencyCode
                            }
                        }
                        merchandise {
                            ... on ProductVariant {
                                id
                                title
                                availableForSale
                                image {
                                    url
                                    altText
                                }
                                price {
                                    amount
                                    currencyCode
                                }
                                product {
                                    id
                                    title
                                    handle
                                    featuredImage {
                                        url
                                        altText
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
export const HERO_SLIDER_QUERY = `
    query GetHeroSliders($language: LanguageCode!)
    @inContext(language: $language) {
        metaobjects(type: "hero_slider", first: 20) {
            nodes {
                id
                handle

                title: field(key: "title") {
                    value
                }

                subtitle: field(key: "subtitle") {
                    value
                }

                desktopImage: field(key: "desktop_image") {
                    reference {
                        ... on MediaImage {
                            image {
                                url
                                altText
                                width
                                height
                            }
                        }
                    }
                }

                mobileImage: field(key: "mobile_image") {
                    reference {
                        ... on MediaImage {
                            image {
                                url
                                altText
                                width
                                height
                            }
                        }
                    }
                }

                buttonText: field(key: "button_text") {
                    value
                }

                buttonLink: field(key: "button_link") {
                    value
                }

                displayOrder: field(key: "display_order") {
                    value
                }
            }
        }
    }
`;