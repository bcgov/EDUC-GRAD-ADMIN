import axios from 'axios';
import qs from 'query-string';

const apiClient = axios.create({
    // baseURL: process.env.KEY_CLOAK_AUTH_HOST,
    // withCredentials: false,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded',   
    }
});

export default {
    // login() {
    //     let requestBody={
    //           "client_id":process.env.VUE_APP_CLIENT_ID,
    //           "client_secret":process.env.VUE_APP_CLIENT_SECRET,
    //           "grant_type":process.env.VUE_APP_GRANT_TYPE,
    //           "username": process.env.VUE_APP_USER,
    //           "password": process.env.VUE_APP_PW   
    //           };

    //     let url = process.env.VUE_APP_AUTH_HOST;
    //     apiClient.post(url, qs.stringify(requestBody))
    //         .then(res => {
    //             console.log(res.data.access_token);
    //             return res.data.access_token;
    //             //router.push("/")
    //         })
    //         .catch(
    //             // error => console.log(error)
    //         );
    // },
    logout() {
        if (localStorage.getItem('jwt') != null){
            localStorage.removeItem('jwt');
            localStorage.removeItem('refresh');
        }         
    },
    // handleSubmit(id, password){   
    //     let requestBody= {
    //         "client_id":process.env.VUE_APP_CLIENT_ID,
    //         "client_secret":process.env.VUE_APP_CLIENT_SECRET,
    //         "grant_type":process.env.VUE_APP_GRANT_TYPE,
    //         "username": id,
    //         "password": password   
    //     };
    //     let url = process.env.VUE_APP_AUTH_HOST;
    //     apiClient.post(url, qs.stringify(requestBody))
    //         .then(response => {
    //             console.log(response);
    //             console.log(response.data.access_token);
    //             let token_expire_period = response.data.expires_in;
    //             let expires_in = new Date();
    //             expires_in.setSeconds(expires_in.getSeconds() + token_expire_period);
    //             console.log(expires_in);
    //             localStorage.setItem('jwt',response.data.access_token);
    //             localStorage.setItem('refresh',response.data.refresh_token);
    //             if (localStorage.getItem('jwt') != null){
    //                 console.log('loggedIn')
    //             }
    //             Router.push('/');   
    //         })
    //         .catch(
    //             // error => console.log(error)
    //         );
    // }
    handleSubmit(id, password){   
        let requestBody= {
            "client_id":process.env.VUE_APP_CLIENT_ID,
            "client_secret":process.env.VUE_APP_CLIENT_SECRET,
            "grant_type":process.env.VUE_APP_GRANT_TYPE,
            "username": id,
            "password": password   
        };



        let url = process.env.VUE_APP_AUTH_HOST;
        return apiClient.post(url, qs.stringify(requestBody));
   
    }
};