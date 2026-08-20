import { useState, useEffect } from 'react'

function App() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const getFormattedDate = () => {
      const date = new Date()
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const dayNumber = date.getDate()
      const year = date.getFullYear()

      return `${dayName}, ${month} ${dayNumber}, ${year}`
    }

    setCurrentDate(getFormattedDate())

    const getWeather = async () => {
      try {
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=auto:ip`)
        const data = await response.json()
        setWeather(data)
      } catch (error) {
        console.error("Error while fetching data", error)
      } finally {
        setLoading(false)
      }
    }

    getWeather()
  }, []);

  if (loading) {
    return <div className="text-white p-4">Loading...</div>
  }

  return (
    <div className='w-full min-h-screen bg-[#02012b] text-white flex flex-col items-start justify-start gap-10 p-4'>
      <nav className='w-full py-4 px-6 flex flex-row items-center justify-between border-b border-white/10'>
        <div className='flex items-center gap-3'>
          <img src="/logo.png" alt="logo" className='h-12 w-auto' />
          <p className='text-white font-bold text-xl'>Weather</p>
        </div>
        {weather && (
          <span className="text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">
            📍 {weather.location.name}, {weather.location.country}
          </span>
        )}
      </nav>

      <section className='w-full h-fit bg-transparent flex flex-col items-center justify-center'>
        <div className='flex flex-col items-center justify-center gap-10 w-full px-4 text-center'>
          <p className='text-3xl md:text-5xl font-bold'>How's the sky looking today?</p>

          {/* Input and button */}
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-2xl'>
            <label className="input w-full flex items-center gap-2 grow bg-white/10 text-white border-white/20 focus-within:border-primary">
              <svg className="h-[1em] opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" className="grow placeholder:text-gray-400" placeholder="Search for a place." />
            </label>
            <button className='btn btn-primary w-full sm:w-auto px-8'>Search</button>
          </div>

          {/* Main Container */}
          <div className='flex flex-col sm:flex-row items-stretch gap-4 w-full max-w-6xl'>

            {/* Temperature box with details */}
            <div className='bg-[#3938b8] px-6 rounded-2xl w-full sm:w-2/3 py-10 flex flex-col sm:flex-row items-center justify-between'>
              {/* Location and date */}
              <div className='flex flex-col items-start justify-center gap-1'>
                <p className='font-bold text-2xl text-left'>
                  {weather.location.name}, {weather.location.country}
                </p>
                <p className='text-slate-300 text-sm'>
                  {currentDate}
                </p>
              </div>

              {/* Temperature and icon */}
              <div className='flex flex-row items-center justify-center gap-2'>
                <img
                  src={`https:${weather.current.condition.icon}`}
                  alt={weather.current.condition.text}
                  className="w-16 h-16"
                />
                <p className='font-bold text-5xl italic'>
                  {weather.current.temp_c}°
                </p>
              </div>
            </div>

            {/* Hourly rate */}
            <div className='bg-[#3938b8] p-4 rounded-2xl w-full sm:w-1/3'>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default App;