const axios = require('axios')

class RestUtils {
  constructor(config) {
    this.config = config
  }

  async getAccessToken() {
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
      
      return response.data.access_token
    } catch (error) {
      console.error('Error fetching access token:', error.response?.data || error.message);
      throw error
    }
  }

  async getData(url, params) {
    try {
      params = this.setToken(await this.getAccessToken(), params)
      const response = await axios.get(url, params)
      return response.data
    } catch (error) {
      console.error('Error during GET:', error.response?.data || error.message);
      throw error
    }
  }

  async postData(url, data, params) {
    try {
      params = this.setToken(await this.getAccessToken(), params)
      const response = await axios.post(url, data, params)
      return response.data
    } catch (error) {
      console.error('Error during POST:', error.response?.data || error.message);
      throw error
    }
  }
  
  async putData(url, data, params) {
    try {
      params = this.setToken(await this.getAccessToken(), params)
      const response = await axios.put(url, data, params)
      return response.data
    } catch (error) {
      console.error('Error during PUT:', error.response?.data || error.message);
      throw error
    }
  }

  async deleteData(url, params) {
    try {
      params = this.setToken(await this.getAccessToken(), params)
      const response = await axios.delete(url, params)
      return response.data
    } catch (error) {
      console.error('Error during GET:', error.response?.data || error.message);
      throw error
    }
  }

  setToken(token, params) {
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
}

module.exports = RestUtils