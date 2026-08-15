import React, { useEffect, useState } from 'react'
import { geocodeCity, fetchWeatherByCoords } from './lib/weatherApi'

function App(){
  const [query,setQuery] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState<string | null>(null)
  const [weather,setWeather] = useState<any | null>(null)
  const [locationLabel,setLocationLabel] = useState('')

  useEffect(()=>{
    // attempt geolocation on first load
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(async (pos)=>{
        try{ setLoading(true); setError(null)
          const data = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude)
          setWeather(data); setLocationLabel('Your location')
        }catch(e:any){ setError('Unable to fetch location weather') }
        finally{ setLoading(false) }
      }, ()=>{}, { enableHighAccuracy:false })
    }
  },[])

  async function handleSearch(e?:React.FormEvent){
    e?.preventDefault()
    if(!query) return
    setLoading(true); setError(null)
    try{
      const geo = await geocodeCity(query)
      if(!geo) throw new Error('Location not found')
      const data = await fetchWeatherByCoords(geo.lat, geo.lon)
      setWeather(data)
      setLocationLabel(`${geo.name}, ${geo.country}`)
    }catch(err:any){ setError(err.message || 'Failed to load weather') }
    finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold">Ethereal Weather</h1>
          <form onSubmit={handleSearch} className="mt-3 flex gap-2">
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search city name" className="flex-1 p-2 rounded bg-[#071029] border border-[#0b2b4e]" />
            <button type="submit" className="px-4 py-2 bg-[#0b3b8c] rounded">Search</button>
          </form>
        </header>

        {loading && <div className="p-6 bg-[#071029] rounded">Loading…</div>}
        {error && <div className="p-4 bg-rose-600 rounded">{error}</div>}

        {weather && (
          <main className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <section className="md:col-span-1 p-4 bg-[#071029] rounded">
              <h2 className="text-lg font-medium">{locationLabel}</h2>
              <div className="mt-2">
                <div className="text-4xl font-bold">{Math.round(weather.current.temp)}°</div>
                <div className="text-sm text-[#9aa6c3]">{weather.current.weather[0].description}</div>
                <div className="mt-3 text-sm text-[#9aa6c3]">Humidity: {weather.current.humidity}%</div>
                <div className="text-sm text-[#9aa6c3]">Wind: {weather.current.wind_speed} m/s</div>
              </div>
            </section>

            <section className="md:col-span-2 p-4 bg-[#071029] rounded">
              <h3 className="font-medium mb-2">Hourly (next 12h)</h3>
              <div className="flex overflow-x-auto gap-3 pb-2">
                {weather.hourly.slice(0,12).map((h:any, idx:number)=>(
                  <div key={idx} className="min-w-[88px] p-2 bg-[#0b1220] rounded text-center">
                    <div className="text-xs">{new Date(h.dt*1000).getHours()}:00</div>
                    <div className="text-xl font-semibold">{Math.round(h.temp)}°</div>
                    <div className="text-xs text-[#9aa6c3]">{h.weather[0].main}</div>
                  </div>
                ))}
              </div>

              <h3 className="font-medium mt-4 mb-2">Daily</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {weather.daily.slice(0,7).map((d:any, i:number)=>(
                  <div key={i} className="p-2 bg-[#0b1220] rounded flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{new Date(d.dt*1000).toLocaleDateString(undefined,{weekday:'short'})}</div>
                      <div className="text-xs text-[#9aa6c3]">{d.weather[0].description}</div>
                    </div>
                    <div className="text-right">
                      <div>{Math.round(d.temp.max)}° / {Math.round(d.temp.min)}°</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  )
}

export default App
