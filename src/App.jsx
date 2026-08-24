import { useState, useEffect } from 'react'
import ThemeToggle from './components/theme-toggle'

function App() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
  const [searchCity, setSearchCity] = useState('Cairo')
  const [inputVal, setInputVal] = useState('')

  useEffect(() => {
    const getFormattedDate = () => {
      const date = new Date()
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const dayNumber = date.getDate()
      const year = date.getFullYear()

      return `${dayName}, ${month} ${dayNumber}, ${year}`
    }

    setCurrentDate(getFormattedDate());
  }, []);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => {
        if (!res.ok) throw new Error('Location lookup failed');
        return res.json();
      })
      .then((data) => {
        if (data.city) {
          setSearchCity(data.city);
        }
      })
      .catch((err) => {
        console.warn('Could not auto-detect location, falling back to Cairo', err);
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController()

    const fetchWeatherData = async () => {
      setLoading(true)
      try {
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(searchCity)}?unitGroup=metric&include=hours,days,current&key=${API_KEY}&contentType=json`,
          { signal: controller.signal }
        )
        if (!response.ok) throw new Error('Failed to fetch weather data')
        const data = await response.json()
        setWeather(data)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error while fetching weather data', error);
          alert("Place not found.");
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()

    return () => controller.abort()
  }, [searchCity])

  const handleSearch = (e) => {
    e.preventDefault()
    if (inputVal.trim()) {
      setSearchCity(inputVal.trim())
    }
  }

  const getIconUrl = (iconName) => `/icons/${iconName}.svg`;
  const isClearNight = (iconName) => iconName === 'clear-night';

  if (loading && !weather) {
    return <div className="text-white p-4">Loading...</div>
  }

  const todaysHourlyForecast = weather?.days?.[0]?.hours || []

  return (
    <div className='transition-colors w-full min-h-screen dark:bg-[#02012b] bg-slate-200 text-white flex flex-col items-start justify-start gap-10 p-4'>
      <nav className='w-full py-4 px-6 flex flex-row items-center justify-between border-b border-black/10 dark:border-white/10'>
        <div className='flex items-center gap-3'>
          <img src="/logo.png" alt="logo" className='h-12 w-auto' />
          <p className='text-black dark:text-white font-bold text-xl'>Weather</p>
        </div>
        <div className='flex flex-row items-center justify-center gap-2'>
          <ThemeToggle />
          {weather?.resolvedAddress && (
            <span className="text-sm text-gray-800 dark:text-gray-300 bg-black/10 dark:bg-white/10 px-3 py-1 rounded-full flex flex-row items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <p className='flex flex-row items-center justify-center capitalize'>
                {weather.resolvedAddress}
              </p>
            </span>
          )}
        </div>
      </nav>

      <section className='w-full h-fit bg-transparent flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center justify-center gap-10 w-full px-4 text-center'>
          <p className='text-3xl md:text-5xl font-bold text-gray-800 dark:text-white'>How's the sky looking today?</p>

          <form onSubmit={handleSearch} className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-2xl'>
            <label className="input w-full flex items-center gap-2 grow bg-black/10 dark:bg-white/10 text-gray-800 dark:text-white border-black/20 dark:border-white/20 focus-within:border-primary">
              <svg className="h-[1em] opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="grow dark:placeholder:text-gray-400 placeholder:text-gray-800"
                placeholder="Search for a place."
              />
            </label>
            <button type="submit" className='btn btn-primary w-full sm:w-auto px-8'>Search</button>
          </form>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl h-fit'>

            <div className='lg:col-span-2 flex flex-col gap-6 w-full'>

              {/* Main Weather Card */}
              {weather?.currentConditions && (
                <div className='bg-[#5555c8] dark:bg-[#3938b8] px-6 rounded-xl w-full py-20 flex flex-col sm:flex-row items-center justify-between gap-4'>
                  <div className='flex flex-col items-start justify-center gap-1'>
                    <p className='font-bold text-4xl text-left capitalize'>
                      {weather.address}
                    </p>
                    <p className='text-slate-300 text-x'>
                      {currentDate}
                    </p>
                  </div>

                  <div className='flex flex-row items-center justify-center gap-10'>
                    <img
                      src={getIconUrl(weather.currentConditions.icon)}
                      alt={weather.currentConditions.conditions}
                      className={`w-16 h-16 object-contain ${isClearNight(weather.currentConditions.icon) ? 'rotate-180' : ''
                        }`}
                    />
                    <p className='font-bold text-5xl italic'>
                      {Math.round(weather.currentConditions.temp)}°
                    </p>
                  </div>
                </div>
              )}

              {weather?.currentConditions && (
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 w-full'>
                  <div className='transition-colors bg-gray-300 dark:bg-[#25253f] p-4 py-8 rounded-xl flex flex-col items-center justify-center text-center gap-2'>
                    <p className='text-gray-800 dark:text-slate-300 text-xs sm:text-sm font-medium'>Feels Like</p>
                    <p className='font-bold text-2xl sm:text-3xl text-black dark:text-white'>{Math.round(weather.currentConditions.feelslike)}°</p>
                  </div>

                  <div className='transition-colors bg-gray-300 dark:bg-[#25253f] p-4 py-8 rounded-xl flex flex-col items-center justify-center text-center gap-2'>
                    <p className='text-gray-800 dark:text-slate-300 text-xs sm:text-sm font-medium'>Humidity</p>
                    <p className='font-bold text-2xl sm:text-3xl text-black dark:text-white'>{Math.round(weather.currentConditions.humidity)}%</p>
                  </div>

                  <div className='transition-colors bg-gray-300 dark:bg-[#25253f] p-4 py-8 rounded-xl flex flex-col items-center justify-center text-center gap-2'>
                    <p className='text-gray-800 dark:text-slate-300 text-xs sm:text-sm font-medium'>Wind</p>
                    <p className='font-bold text-2xl sm:text-3xl text-black dark:text-white'>{Math.round(weather.currentConditions.windspeed)} <span className='font-medium'>kph</span></p>
                  </div>

                  <div className='transition-colors bg-gray-300 dark:bg-[#25253f] p-4 py-8 rounded-xl flex flex-col items-center justify-center text-center gap-2'>
                    <p className='text-gray-800 dark:text-slate-300 text-xs sm:text-sm font-medium'>Precipitation</p>
                    <p className='font-bold text-2xl sm:text-3xl text-black dark:text-white'>{weather.currentConditions.precip ?? 0} <span className='font-medium'>mm</span></p>
                  </div>
                </div>
              )}

              {/* 7-Day Forecast */}
              <div className='flex flex-col items-center justify-center gap-2 mt-3 w-full'>
                <div className='w-full flex items-start ml-5'>
                  <p className='font-bold text-lg text-black dark:text-white'>7-Day forecast</p>
                </div>

                <div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-4 w-full'>
                  {weather?.days?.slice(0, 7).map((dayItem, index) => {
                    const dateObj = new Date(dayItem.datetime.replace(/-/g, '/'))
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' })

                    return (
                      <div key={index} className='transition-colors bg-gray-300 dark:bg-[#25253f] py-3 px-2 rounded-xl flex flex-col items-center justify-between text-center gap-7'>
                        <p className='text-slate-800 dark:text-slate-300 text-xs sm:text-sm font-medium'>
                          {dayName}
                        </p>

                        <img
                          src={getIconUrl(dayItem.icon)}
                          alt={dayItem.conditions}
                          className={`w-12 h-12 object-contain ${isClearNight(dayItem.icon) ? 'rotate-180' : ''
                            }`}
                        />

                        <div className='w-full flex flex-row items-center justify-between px-1 text-xs sm:text-sm font-semibold'>
                          <span className='text-black dark:text-white'>{Math.round(dayItem.tempmax)}°</span>
                          <span className='text-slate-600 dark:text-slate-400 font-normal'>{Math.round(dayItem.tempmin)}°</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Hourly Forecast */}
            <div className='transition-colors bg-gray-300 dark:bg-[#25253f] p-6 rounded-xl w-full h-full flex flex-col gap-4 max-h-155 overflow-y-auto'>
              <p className='font-bold text-lg text-left text-black dark:text-white'>Hourly Forecast</p>
              <div className='flex flex-col gap-3'>
                {todaysHourlyForecast.map((hour, index) => (
                  <div key={index} className='flex flex-row items-center justify-between bg-black/5 dark:bg-white/5 p-3 rounded-lg'>
                    <div className='flex flex-row items-center justify-center gap-5'>
                      <img
                        src={getIconUrl(hour.icon)}
                        alt={hour.conditions}
                        className={`w-8 h-8 object-contain ${isClearNight(hour.icon) ? 'rotate-180' : ''
                          }`}
                      />
                      <span className='text-sm text-slate-700 dark:text-slate-200'>{hour.datetime.slice(0, 5)}</span>
                    </div>
                    <span className='font-bold text-black dark:text-white'>{Math.round(hour.temp)}°</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default App;