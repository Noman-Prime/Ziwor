const CART_FIELDS = `
    id
    checkoutUrl
    totalQuantity
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
`;

const CART_RESPONSE_FIELDS = `
    userErrors {
        field
        message
    }
    warnings {
        code
        message
        target
    }
`;

export const CREATE_CART = `
    mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
            cart {
                ${CART_FIELDS}
            }
            ${CART_RESPONSE_FIELDS}
        }
    }
`;

export const ADD_CART_LINES = `
    mutation CartLinesAdd(
        $cartId: ID!
        $lines: [CartLineInput!]!
    ) {
        cartLinesAdd(
            cartId: $cartId
            lines: $lines
        ) {
            cart {
                ${CART_FIELDS}
            }
            ${CART_RESPONSE_FIELDS}
        }
    }
`;

export const UPDATE_CART_LINES = `
    mutation CartLinesUpdate(
        $cartId: ID!
        $lines: [CartLineUpdateInput!]!
    ) {
        cartLinesUpdate(
            cartId: $cartId
            lines: $lines
        ) {
            cart {
                ${CART_FIELDS}
            }
            ${CART_RESPONSE_FIELDS}
        }
    }
`;

export const REMOVE_CART_LINES = `
    mutation CartLinesRemove(
        $cartId: ID!
        $lineIds: [ID!]!
    ) {
        cartLinesRemove(
            cartId: $cartId
            lineIds: $lineIds
        ) {
            cart {
                ${CART_FIELDS}
            }
            ${CART_RESPONSE_FIELDS}
        }
    }
`;