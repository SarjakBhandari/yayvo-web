//list of backend routes

import { updateProfile } from "../actions/auth-actions";

export const API={
    AUTH:{
        REGISTER_C: '/api/auth/register/consumer',
        REGISTER_R: '/api/auth/register/retailer',
        LOGIN:'/api/auth/login',
        updateProfile:'/consumer/:id'
    }
}