// admin/lib/endpoint.ts
export const API = {
  AUTH: {
    REGISTER_C: "/api/auth/register/consumer",
    REGISTER_R: "/api/auth/register/retailer",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    CURRENT_USER: "/api/auth/current-user",
    updateProfile: "/api/consumers/:id",
  },
  ADMIN: {
    // Consumers
    CONSUMERS_LIST: "/api/admin/consumers",
    CONSUMERS_LIST_PAGINATED: "/api/admin/paginated_consumers",
    CONSUMER_BY_ID: "/api/admin/consumers/:id",
    CONSUMER_BY_USERNAME: "/api/admin/consumers/username/:username",
    CONSUMER_BY_AUTH: "/api/admin/consumers/auth/:authId",
    CONSUMER_CREATE: "/api/auth/register/consumer",
    CONSUMER_UPDATE: "/api/admin/consumers/:id",
    CONSUMER_DELETE: "/api/admin/consumers/:id",
    CONSUMER_PICTURE: "/api/admin/consumers/auth/:id/profile-picture",

    // Retailers
    RETAILERS_LIST: "/api/admin/retailers",
    RETAILER_BY_ID: "/api/admin/retailers/:id",
    RETAILER_BY_AUTH: "/api/admin/retailers/auth/:authId",
    RETAILER_BY_USERNAME: "/api/admin/retailers/username/:username",
    RETAILER_CREATE: "/api/auth/register/retailer",
    RETAILER_UPDATE: "/api/admin/retailers/:id",
    RETAILER_DELETE: "/api/admin/retailers/:id",
    RETAILER_PICTURE: "/api/admin/retailers/auth/:id/profile-picture",
  },
  Consumer: {
    // Consumers
    CONSUMER_BY_ID: "/api/consumers/:id",
    CONSUMER_BY_AUTH: "/api/consumers/auth/:authId",
    CONSUMER_UPDATE: "/api/consumers/:id",
    CONSUMER_PICTURE: "/api/consumers/:id/profile-picture",
  },

  Retailer: {
    RETAILER_BY_ID: "/api/retailers/:id",
    RETAILER_BY_AUTH: "/api/retailers/auth/:authId",
    RETAILER_UPDATE: "/api/retailers/:id",
    RETAILER_LOGO: "/api/retailers/auth/:id/profile-picture",
  },

  PRODUCTS: {
    CREATE: "/api/products",
        IS_LIKED: "/api/products/isLiked",
    IMAGE: "/api/products/:id/image",
    PAGINATED: "/api/products",
    BY_ID: "/api/products/:id",
    BY_AUTHOR: "/api/products/author/:authorId",
    LIKE: "/api/products/:id/like",
    UNLIKE: "/api/products/:id/unlike",
    DELETE:"/api/products/:id"
  },
};
