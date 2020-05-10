//import { useAuth0 } from "../../auth0/react-auth0-spa";
import {auth0ClientExternal } from "./react-auth0-spa";


export const getToken = async () => {
    const auth0Client = await auth0ClientExternal;
    const token = await auth0Client.getTokenSilently();
    return token;
}

