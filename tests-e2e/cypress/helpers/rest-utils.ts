import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from "axios";

export class RestUtils {
  config: Cypress.PluginConfigOptions;
  
  constructor(config: Cypress.PluginConfigOptions) {
    this.config = config
  }

  async getAccessToken(): Promise<string> {
    const token = this.config.env.token
    try {
      const response = await axios.post(
        token.tokenEndpoint,
        `grant_type=client_credentials`,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // Required header
          auth: {
            username: token.clientId,
            password: token.clientSecret,
          },
        }
      );
      
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching access token');
      throw error;
    }
  }

  async getData<ReturnType = unknown>(url: string, params?: AxiosRequestConfig): Promise<ReturnType> {
    try {
      params = this.setToken(await this.getAccessToken(), params);
      const response = await axios.get(url, params);
      return response.data;
    } catch (e) {
      if (isAxiosError(e)) {
        this.logApiError(e, 'getData', 'Error during GET on ' + url);
      }
      throw e;
    }
  }

  async postData<ReturnType = unknown, Data = unknown>(url: string, data: Data, params?: AxiosRequestConfig):
    Promise<ReturnType> {
    try {
      params = this.setToken(await this.getAccessToken(), params);
      const response = await axios.post<ReturnType>(url, data, params);
      return response.data;
    } catch (e) {
      if (isAxiosError(e)) {
        this.logApiError(e, 'postData', 'Error during POST on ' + url);
      }
      throw e;
    }
  }

  async putData<ReturnType = unknown, Data = unknown>(url: string, data: Data, params?: AxiosRequestConfig):
    Promise<ReturnType> {
    try {
      params = this.setToken(await this.getAccessToken(), params);
      const response = await axios.put(url, data, params);
      return response.data;
    } catch (e) {
      if (isAxiosError(e)) {
        this.logApiError(e, 'putData', 'Error during PUT on ' + url);
      }
      throw e;
    }
  }

  async deleteData(url: string, params?: AxiosRequestConfig) {
    try {
      params = this.setToken(await this.getAccessToken(), params);
      const response = await axios.delete(url, params);
      return response.data;
    } catch (e) {
      if (isAxiosError(e)) {
        this.logApiError(e, 'deleteData', 'Error during DELLETE on ' + url);
      }
      throw e;
    }
  }

  private setToken(token: string, params?: AxiosRequestConfig) {
    if (params) {
      params.headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    } else {
      params = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
    }
    return params;
  }

  private logApiError(e: AxiosError, functionName: string, message: string) {
    if (message) {
      console.log(message);
    }
    console.log(functionName, ' Error', e.stack);
    if (e.response && e.response.data) {
      console.log(JSON.stringify(e.response.data));
    }
  }
}