"use strict";
// https://www.youtube.com/watch?v=H8QnlH6sou0

// Спочатку в змінну потрібно отримати всі рейтенги (масив з усіх рейтенгів)
const ratings = document.querySelectorAll(".rating");
if (ratings.length > 0) {
  initRatings();
}

function initRatings() {
  let ratingActive, ratingValue;
  // Бігаємо по всіх рейтенгах на сторінці
  for (let index = 0; index < ratings.length; index++) {
    const rating = ratings[index];
    initRating(rating);
  }
  // Ініціалізуємо конкретний рейтинг
  function initRating(rating) {
    initRatingVars(rating);

    setRatingActiveWidth();
    // якщо в обгортки є клас rating_set, тоді ми запускаємо функцію
    if (rating.classList.contains("rating_set")) {
      setRating(rating);
    }
  }
  // Ініціалізація змінних
  function initRatingVars(rating) {
    ratingActive = rating.querySelector(".rating__active");
    ratingValue = rating.querySelector(".rating__value");
  }
  // Змінюємо ширину активних зірок
  function setRatingActiveWidth(index = ratingValue.innerHTML) {
    const ratingActiveWidth = index / 0.05;
    ratingActive.style.width = `${ratingActiveWidth}%`;
  }
  // можливість вказувати оцінку
  function setRating(rating) {
    // Необхідно отримати масив з усіх радіо-кнопок, тому що ми хочемо на кожну з них повісити якусь подію. document змінюємо на rating, для того щоб ми отримували обєкти кожного конкретного рейтенгу
    const ratingItems = rating.querySelectorAll(".rating__item");
    for (let index = 0; index < ratingItems.length; index++) {
      const ratingItem = ratingItems[index];
      ratingItem.addEventListener("mouseenter", function (e) {
        // Оновлення змінних
        initRatingVars(rating);
        // Оновлення активних зірок
        setRatingActiveWidth(ratingItem.value);
      });
      ratingItem.addEventListener("mouseleave", function (E) {
        // Оновлення активних зірок
        setRatingActiveWidth();
      });
      ratingItem.addEventListener("click", function (e) {
        // Оновлення змінних
        initRatingVars(rating);

        if (rating.dataset.ajax) {
          // відправити на сервер
          setRatingValue(ratingItem.value, rating);
        } else {
          // Відправити вказану оцінку
          ratingValue.innerHTML = index + 1;
          setRatingActiveWidth();
        }
      });
    }
  }

  async function setRatingValue(value, rating) {
    if (!ratingValue.classList.contains("rating_sending")) {
      rating.classList.add("rating_sending");

      // Відправка даних (value) на сервер
      let response = await fetch("rating.json", {
        method: "GET",

        // body: JSON.stringify({
        //   userRating: value
        // }),
        // headers: {
        //   'content-type': 'application/json'
        // }
      });
      if (response.ok) {
        const result = await response.json();

        // Отримуємо новий рейтинг
        const newRating = result.newRating;

        // Вивід нового середнього результату
        ratingValue.innerHTML = newRating;

        // Обновлення активних зірок
        setRatingActiveWidth();

        rating.classList.remove("rating_sending");
      } else {
        alert("Error");

        rating.classList.remove("rating_sending");
      }
    }
  }
}
