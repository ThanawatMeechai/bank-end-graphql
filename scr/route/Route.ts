import * as authUserService_Register from "../services/auth/authUserService";
import * as  userService from "../services/userService"
import * as authapi from "../authMiddleware"
import * as store_Service from "../services/storeService";


export const Route_user = {
    getUser: userService.getUser,
    getUsers: userService.getUsers,
    createUser: authUserService_Register.createUser,
    updateUser: userService.updateUser,
    createRandomUsers: userService.createRandomUsers,
    loginUser: authUserService_Register.loginUser,
  };

 //store
  export const Route_store = {
    createStore: store_Service.createStore,
    getStore: authapi.getStoreM
  };


      //store
  