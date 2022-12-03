import style from './CityUpdateInterval.module.css'

function CityUpdateInterval({ setNewUpdateInterval, updIntervalsInMinutes, defaultValue }) {
  return (
    <>
      <select
        className={style.selectUpdInterval}
        defaultValue={defaultValue}
        onChange={(e) => setNewUpdateInterval(e.target.value)}
      >
        {updIntervalsInMinutes.map((multiplier, index) => {
          return (
            <option key={index} value={1000 * 60 * +multiplier}>
              {multiplier < 1 ? +multiplier * 60 + ' секунд' : multiplier + ' минут'}
            </option>
          )
        })}
      </select>
    </>
  )
}

export default CityUpdateInterval
