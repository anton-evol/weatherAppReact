import { useState } from 'react'
import style from './City.module.css'
import windIcon from '../img/icon-wind-arrow.png'

function City({ currentCity, weather, remove, update }) {
  const [predictionTime, setPredictionTime] = useState(0)
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
  return (
    <>
      <div className={style.city} name={currentCity}>
        <h3>
          {currentCity} / {weather.city.country}
        </h3>
        <p>
          Погода на дату:{' '}
          <select className={style.selectTimeSlot} onChange={(e) => setPredictionTime(e.target.value)}>
            {weather.list.map((weatherPrediction, index) => {
              return (
                <option key={index} value={index}>
                  {days[new Date(weatherPrediction.dt * 1000).getDay()] +
                    ' ' +
                    new Date(weatherPrediction.dt * 1000).getHours() +
                    ':00'}
                </option>
              )
            })}
          </select>
        </p>
        <p>
          Температура: {Math.floor(weather.list[predictionTime].main.temp)}
          °C
        </p>
        <p>
          {weather.list[predictionTime].weather[0].description.charAt(0).toUpperCase() +
            weather.list[predictionTime].weather[0].description.slice(1)}
          <img
            className={style.weatherIcon}
            src={`https://openweathermap.org/img/wn/${weather.list[predictionTime].weather[0].icon}.png`}
            alt="weather icon"
          />
        </p>
        <p>Влажность: {weather.list[predictionTime].main.humidity}%</p>
        <p>Атмосферное давление: {weather.list[predictionTime].main.pressure}гПа</p>
        <p>
          Сила и направление ветра: {weather.list[predictionTime].wind.speed}м/с
          <img
            className={style.windIcon}
            src={windIcon}
            alt="wind direction"
            style={{
              transform: `rotate(${weather.list[predictionTime].wind.deg + 90}deg)`,
            }}
          />
        </p>
        <p>Обновлено: {new Date(weather.lastUpd).toLocaleString()}</p>
        <div>
          <button className={`${style.btn} ${style.btnDelete}`} name={currentCity} onClick={remove}>
            Удалить
          </button>
          <button className={`${style.btn} ${style.btnUpdate}`} name={currentCity} onClick={update}>
            Обновить
          </button>
        </div>
      </div>
    </>
  )
}

export default City
