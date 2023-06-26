import axios, { AxiosInstance } from 'axios'

export function getAPIClient(): AxiosInstance {
  const api = axios.create({
    baseURL: process.env.API_URL,
  })

  return api
}
