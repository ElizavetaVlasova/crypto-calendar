import React, { useState, useEffect } from "react";
import "./App.css";

const KryptoniteEvents = () => {
  const [events, setEvents] = useState(null); // JSON с событиями
  const [selectedDay, setSelectedDay] = useState("01"); // Выбранный день
  const [selectedMonth, setSelectedMonth] = useState("01"); // Выбранный месяц
  const today = new Date(); // Сегодняшняя дата
  const todayFormatted = `${String(today.getDate()).padStart(2, "0")}.${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`; // Форматируем сегодняшнюю дату в DD.MM

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    // Загружаем данные о событиях
    fetch("/crypto_events.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const formattedEvents = {};
        // Преобразуем ключи JSON в формат DD.MM
        Object.keys(data).forEach((key) => {
          const [month, day] = key.split("-");
          const newKey = `${day}.${month}`; // Формат DD.MM
          formattedEvents[newKey] = data[key];
        });
        setEvents(formattedEvents); // Сохраняем преобразованные данные
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  if (!events) {
    return <p className="loading">🔄 Loading crypto events...</p>;
  }

  // Формируем выбранную дату
  const selectedDate = `${selectedDay}.${selectedMonth}`;
  const todayEvents = events[todayFormatted] || [];
  const selectedDayEvents = events[selectedDate] || [];

  return (
    <div className="app-container">
      {/* Заголовок */}
      <header className="header">
        <h1>📅 Today is {todayFormatted}</h1>
        <h2>✨ Events on this day:</h2>
        <div className="events-list">
          {todayEvents.length > 0 ? (
            todayEvents.map((event, index) => (
              <p key={index}>
                🔸 <strong>{event.year}</strong>: {event.event}
              </p>
            ))
          ) : (
            <p>No events for today.</p>
          )}
        </div>
      </header>

      {/* Выбор дня и месяца */}
      <div className="dropdown-container">
        <div className="dropdown">
          <label htmlFor="day">Day:</label>
          <select
            id="day"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="dropdown-select"
          >
            {Array.from({ length: 31 }, (_, i) => {
              const day = String(i + 1).padStart(2, "0");
              return (
                <option key={day} value={day}>
                  {day}
                </option>
              );
            })}
          </select>
        </div>
        <div className="dropdown">
          <label htmlFor="month">Month:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(String(months.indexOf(e.target.value) + 1).padStart(2, "0"))
            }
            className="dropdown-select"
          >
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* События выбранной даты */}
      <div className="selected-day-events">
        <h2>📜 Events on {selectedDay}.{selectedMonth}:</h2>
        <div className="events-list">
          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.map((event, index) => (
              <p key={index}>
                🔹 <strong>{event.year}</strong>: {event.event}
              </p>
            ))
          ) : (
            <p>No events for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default KryptoniteEvents;
