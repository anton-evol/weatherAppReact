import { useState, useEffect } from 'react'
import CityInput from './CityInput'
import CityUpdateInterval from './CityUpdateInterval'
import City from './City'
import style from './Cities.module.css'

function Cities() {
  const [newCity, setNewCity] = useState('')
  const [storedData, setStoredData] = useState(
    localStorage.getItem('storedData') !== null &&
      Object.keys(JSON.parse(localStorage.getItem('storedData'))).length > 0
      ? JSON.parse(localStorage.getItem('storedData'))
      : {}
  )

  const [updateInterval, setUpdateInterval] = useState(1000 * 60 * 60)
  const updIntervalsInMinutes = [1 / 6, 1 / 2, 5, 10, 60, 240]

  const API_KEY = 'afd7b214d53206d052ca1c1826164dc8'
  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${API_KEY}&lang=ru&units=metric&q=`

  const errorDiv = document.getElementsByClassName(style.error)[0]

  useEffect(() => {
    const interval = setInterval(() => {
      Object.keys(storedData).forEach((city) => {
        getLatestWeather(city)
      })
      setStoredData({ ...storedData })
      localStorage.setItem('storedData', JSON.stringify(storedData))
    }, updateInterval)
    return () => {
      clearInterval(interval)
    }
  })

  useEffect(() => {
    if (newCity) {
      getLatestWeather(newCity)
    }
    setNewCity('')
  }, [newCity])

  async function getLatestWeather(city) {
    try {
      const result = await fetch(API_URL + city)
      const cityWeatherLatest = await result.json()
      if (cityWeatherLatest.cod === '404') {
        showErrorDiv('НЕТ ИНФОРМАЦИИ ДЛЯ ' + city.toUpperCase())
      }
      storedData[cityWeatherLatest.city.name] = { ...cityWeatherLatest, lastUpd: new Date().getTime() }
      setStoredData({ ...storedData })
      localStorage.setItem('storedData', JSON.stringify(storedData))
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        showErrorDiv('НЕТ ОТВЕТА СЕРВЕРА')
      }
    }
  }

  function showErrorDiv(message) {
    errorDiv.innerText = message
    errorDiv.style.opacity = '1'
    errorDiv.style.zIndex = 10
    const timer = setTimeout(() => {
      errorDiv.style.opacity = '0'
      errorDiv.style.zIndex = -10
    }, 2500)
    return () => clearTimeout(timer)
  }

  function removeCity(event) {
    const cityName = event.target.getAttribute('name')
    delete storedData[cityName]
    setStoredData({ ...storedData })
    localStorage.setItem('storedData', JSON.stringify(storedData))
  }

  function updateCity(event) {
    const cityName = event.target.getAttribute('name')
    getLatestWeather(cityName)
  }

  function widget() {
    const weather = storedData
    if (Object.keys(weather).length === 0) return

    let temperature = []
    let wind = []
    let humidity = []

    Object.values(weather).forEach((weather, index) => {
      temperature.push(weather.list[0].main.temp)
      wind.push(weather.list[0].wind.speed)
      humidity.push(weather.list[0].main.humidity)
    })

    const peackValues = {
      'Минимальная температура': [
        Math.min(...temperature) + '°C',
        Object.values(weather).find((item) => item.list[0].main.temp === Math.min(...temperature)).city.name,
      ],
      'Максимальная температура': [
        Math.max(...temperature) + '°C',
        Object.values(weather).find((item) => item.list[0].main.temp === Math.max(...temperature)).city.name,
      ],
      'Минимальная скорость ветра': [
        Math.min(...wind) + 'м/с',
        Object.values(weather).find((item) => item.list[0].wind.speed === Math.min(...wind)).city.name,
      ],
      'Максимальная скорость ветра': [
        Math.max(...wind) + 'м/с',
        Object.values(weather).find((item) => item.list[0].wind.speed === Math.max(...wind)).city.name,
      ],
      'Минимальная влажность': [
        Math.min(...humidity) + '%',
        Object.values(weather).find((item) => item.list[0].main.humidity === Math.min(...humidity)).city.name,
      ],
      'Максимальная влажность': [
        Math.max(...humidity) + '%',
        Object.values(weather).find((item) => item.list[0].main.humidity === Math.max(...humidity)).city.name,
      ],
    }
    return peackValues
  }

  return (
    <>
      <div className="header-row">
        <h1>Погода</h1>
        <CityInput setNewCity={setNewCity} />
        Интервал обновления:
        <CityUpdateInterval
          setNewUpdateInterval={setUpdateInterval}
          updIntervalsInMinutes={updIntervalsInMinutes}
          defaultValue={updateInterval}
        />
      </div>
      <hr />
      <div className={style.error}>НЕТ ИНФОРМАЦИИ ПО ЭТОМУ ГОРОДУ</div>
      <div className={style.weatherCards}>
        {Object.keys(storedData).length > 0 ? (
          Object.keys(storedData).map((city, index) => {
            return (
              <City key={index} currentCity={city} weather={storedData[city]} remove={removeCity} update={updateCity} />
            )
          })
        ) : (
          <h2>Добавьте город для отслеживания</h2>
        )}
      </div>
      {Object.keys(storedData).length > 0 ? (
        <>
          <hr />
          <div className={style.widget}>
            <h2>Пиковые значения погоды:</h2>
            {Object.entries(widget()).map((key_val) => {
              return (
                <div key={key_val[0]}>
                  {key_val[0]}: {key_val[1][0]} ({key_val[1][1]})
                </div>
              )
            })}
          </div>
        </>
      ) : null}
    </>
  )
}

export default Cities
