import { useEffect, useState } from 'react'
import style from './CityInput.module.css'

function CityInput({ setNewCity }) {
  const [value, setValue] = useState('')

  const [cityPredictions, setCityPredictions] = useState([])
  const API_USERNAME = 'Anton_evol'
  const API_URL = `https://secure.geonames.org/searchJSON?username=${API_USERNAME}&lang=ru&maxRows=7&orderby=relevance&searchlang=ru&q=`

  async function getCityPredictions(cityName) {
    if (cityName.length >= 3) {
      try {
        const result = await fetch(API_URL + cityName)
        const cityPredictionsFetch = await result.json()
        let resultsArray = []
        cityPredictionsFetch.geonames.forEach((el) => {
          resultsArray.push([el.name, el.countryName])
        })
        setCityPredictions(resultsArray)
      } catch (error) {
        console.log('error.message: ', error.message)
      }
    } else {
      setCityPredictions([])
    }
  }

  const [selectedLiElement, setSelectedLiElement] = useState(-1)

  useEffect(() => {
    getCityPredictions(value)
  }, [value])

  const ul = document.getElementsByClassName(`${style.autocomplete}`)[0]

  function handleClick(e) {
    if (value.length >= 3) {
      setValue(e.target.value)
      if (e.keyCode === 13) {
        // setNewCity(value)
        setNewCity(selectedLiElement === -1 ? value : cityPredictions[selectedLiElement][0])
        setValue('')
        setSelectedLiElement(-1)
      }
      if (e.keyCode === 38) {
        e.preventDefault()
        setSelectedLiElement(selectedLiElement > -1 ? selectedLiElement - 1 : -1)
      }
      if (e.keyCode === 40) {
        e.preventDefault()
        setSelectedLiElement(
          selectedLiElement < cityPredictions.length - 1 ? selectedLiElement + 1 : cityPredictions.length - 1
        )
      }
    }
  }

  return (
    <>
      <div>
        <input
          className={style.cityNameInput}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            ul.style.display = ''
          }}
          onKeyDown={handleClick}
          onClick={handleClick}
          onMouseEnter={(e) => {
            ul.style.display = ''
          }}
          placeholder="Введите город"
        ></input>
        <ul
          className={style.autocomplete}
          onClick={(e) => {
            setNewCity(e.target.dataset.value)
            setValue('')
          }}
          onMouseLeave={(e) => {
            ul.style.display = 'none'
          }}
        >
          {cityPredictions.map((prediction, index) => {
            return (
              <li
                className={`${style.autocomplete__item} ${
                  index === selectedLiElement ? style.autocomplete__item_active : ''
                }`}
                key={index}
                data-value={prediction[0]}
              >
                {prediction[0]} ({prediction[1]})
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default CityInput
