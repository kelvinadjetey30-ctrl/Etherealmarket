import axios from 'axios'

const KEY = import.meta.env.VITE_OPENWEATHER_KEY as string
if(!KEY) console.warn('VITE_OPENWEATHER_KEY is not set')

const GEOCODING = 'https://api.openweathermap.org/geo/1.0/direct'
const ONECALL = 'https://api.openweathermap.org/data/2.5/onecall'

export async function geocodeCity(city: string){
  const { data } = await axios.get(GEOCODING, { params: { q: city, limit: 1, appid: KEY } })
  return data && data.length ? data[0] : undefined
}

export async function fetchWeatherByCoords(lat: number, lon: number, units = 'metric'){
  const { data } = await axios.get(ONECALL, { params: { lat, lon, exclude: 'minutely', units, appid: KEY } })
  return data
}
