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

                product: field(key: "product") {
                    reference {
                        ... on Product {
                            id
                            title
                            handle
                            availableForSale

                            featuredImage {
                                url
                                altText
                            }

                            selectedOrFirstAvailableVariant {
                                id
                                availableForSale
                            }
                        }
                    }
                }

                displayOrder: field(key: "display_order") {
                    value
                }
            }
        }
    }
`;
export const HOMEPAGE_PROMOTIONS_QUERY = `
  query HomepagePromotions($language: LanguageCode!)
  @inContext(language: $language) {
    metaobjects(type: "homepage_promotion", first: 50) {
      nodes {
        id
        handle

        title: field(key: "title") {
          value
        }

        promotionType: field(key: "promotion_type") {
          value
        }

        enabled: field(key: "enabled") {
          value
        }

        displayLocation: field(key: "display_location") {
          value
        }

        position: field(key: "position") {
          value
        }

        heading: field(key: "heading") {
          value
        }

        description: field(key: "description") {
          value
        }

        image: field(key: "image") {
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

        collection: field(key: "collection") {
          reference {
            ... on Collection {
              id
              title
              handle

              image {
                url
                altText
                width
                height
              }
            }
          }
        }

        product: field(key: "product") {
          reference {
            ... on Product {
              id
              title
              handle
              availableForSale

              featuredImage {
                url
                altText
                width
                height
              }

              selectedOrFirstAvailableVariant {
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

                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }

        startDate: field(key: "start_date") {
          value
        }

        endDate: field(key: "end_date") {
          value
        }

        backgroundColor: field(key: "background_color") {
          value
        }
      }
    }
  }
`;

export const WHATSAPP_BANNER_QUERY = `
  query WhatsAppBanner($language: LanguageCode!)
  @inContext(language: $language) {
    metaobjects(type: "whatsapp_banner", first: 10) {
      edges {
        node {
          id
          handle

          showBanner: field(key: "show_banner") {
            value
          }

          heading: field(key: "heading") {
            value
          }

          description: field(key: "description") {
            value
          }

          whatsappNumber: field(key: "whatsapp_number") {
            value
          }

          buttonText: field(key: "button_text") {
            value
          }

          backgroundColor: field(key: "background_color") {
            value
          }
        }
      }
    }
  }
`;

export const BRAND_LOGO_QUERY = `
    query BrandLogo($language: LanguageCode!)
    @inContext(language: $language) {
        metaobjects(
            type: "brand_logo"
            first: 10
        ) {
            edges {
                node {
                    id
                    handle

                    fields {
                        key
                        value

                        reference {
                            ... on MediaImage {
                                image {
                                    url
                                    altText
                                    width
                                    height
                                }
                            }

                            ... on GenericFile {
                                url
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const SOCIAL_MEDIA_QUERY = `
    query SocialMedia($language: LanguageCode!)
    @inContext(language: $language) {
        metaobjects(type: "social_media", first: 20) {
            edges {
                node {
                    id
                    handle

                    showSocialMedia: field(key: "show_socail_media") {
                        value
                    }

                    name: field(key: "name") {
                        value
                    }

                    image: field(key: "image") {
                        reference {
                            ... on MediaImage {
                                image {
                                    url
                                    altText
                                    width
                                    height
                                }
                            }

                            ... on GenericFile {
                                url
                            }
                        }
                    }

                    link: field(key: "link") {
                        value
                    }
                }
            }
        }
    }
`;

export const FOOTER_CONTACT_QUERY = `
    query FooterContact($language: LanguageCode!)
    @inContext(language: $language) {
        metaobjects(type: "footer_contact", first: 1) {
            edges {
                node {
                    id
                    handle

                    email: field(key: "email") {
                        value
                    }

                    whatsappNumber: field(key: "whatsapp_number") {
                        value
                    }

                    whatsappMessage: field(key: "whatsapp_message") {
                        value
                    }

                    address: field(key: "address") {
                        value
                    }
                }
            }
        }
    }
`;