const audio1 = document.getElementById("audio1");
const audio2 = document.getElementById("audio2");
const audio3 = document.getElementById("audio3");
const canvas = document.getElementById("effectCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let blurElement;
let flashElement;
let intervalId;
let rainbowBackgroundInterval;

// Создание слоя радужного фона
const rainbowBackground = document.createElement("div");
rainbowBackground.className = "rainbow-background";
document.body.appendChild(rainbowBackground);

// Функция для рандомного изменения фона
function changeBackground() {
  // Случайное время для изменения фона (от 1.5 до 2.5 секунд)
  const changeTime = Math.random() * 1000 + 1500;

  // Таймер, который будет менять фон через случайный интервал
  rainbowBackgroundInterval = setTimeout(() => {
    // Генерация случайных радужных цветов
    const randomHue = Math.random() * 360;
    rainbowBackground.style.backgroundColor = `hsla(${randomHue}, 100%, 50%, 1)`;

    // Затем возвращаем фон обратно через 150 мс
    setTimeout(() => {
      rainbowBackground.style.backgroundColor = ""; // Возвращаем исходный фон
    }, 150);

    // Повторяем через случайный интервал
    changeBackground();
  }, changeTime);
}

// Остановка изменения фона после завершения 3-го эффекта
function stopRainbowBackground() {
  clearTimeout(rainbowBackgroundInterval);
  rainbowBackground.style.backgroundColor = ""; // Останавливаем смену фона
}

// Первый эффект: Размытие
function startBlurEffect() {
  blurElement = document.createElement("div");
  blurElement.className = "blur-effect";
  document.body.appendChild(blurElement);

  const blurInterval = setInterval(() => {
    const randomBlur = 1;
    blurElement.style.filter = `blur(${randomBlur}px)`;

    if (Math.random() < 0.1) {
      const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.4)`;
      blurElement.style.backgroundColor = randomColor;
    }
  }, 50);

  setTimeout(() => {
    clearInterval(blurInterval);
    document.body.removeChild(blurElement);
    startSecondEffect();
  }, 80); // Продолжительность первого эффекта
}

// Второй эффект: Вспышки
// Массив доступных аудиофайлов
const audioFiles = [
  "src/audio/2.mp3",
  "src/audio/2a.mp3",
  "src/audio/2b.mp3",
  "src/audio/2c.mp3",
  "src/audio/2d.mp3",
  "src/audio/2e.mp3",
  "src/audio/2f.mp3",
  "src/audio/2g.mp3",
  // "src/audio/2h.mp3",
  // "src/audio/2i.mp3",
];

// Функция для случайного выбора аудиофайла
function getRandomAudioFile() {
  const randomIndex = Math.floor(Math.random() * audioFiles.length);
  return audioFiles[randomIndex];
}

function startSecondEffect() {
  const flashElement = document.createElement("div");
  flashElement.className = "flash";
  document.body.appendChild(flashElement);

  const flashInterval = setInterval(() => {
    createFlash();
  }, 85); // Уменьшаем интервал, чтобы вспышки были более частыми и резкими

  // Случайно выбираем аудиофайл
  const randomAudioFile = getRandomAudioFile(); // Выбираем случайный файл из массива
  const audioElement = new Audio(randomAudioFile);

  audioElement.volume = 1; // Устанавливаем громкость на стандартное значение
  audioElement.play(); // Воспроизведение выбранного файла

  audioElement.addEventListener("ended", () => {
    clearInterval(flashInterval);
    document.body.removeChild(flashElement);
    startThirdEffect(); // Переход к следующему эффекту
  });
}

function createFlash() {
  const flash = document.createElement("div");
  flash.className = "flash";

  const size = 40; // Увеличиваем размер вспышек, чтобы они были более заметными
  const rows = Math.ceil(window.innerHeight / size);
  const cols = Math.ceil(window.innerWidth / size);

  const canvasFlash = document.createElement("canvas");
  canvasFlash.width = window.innerWidth;
  canvasFlash.height = window.innerHeight;

  const ctxFlash = canvasFlash.getContext("2d");

  // Используем исходные цвета, но делаем их более контрастными и насыщенными
  const colors = [
    "#00ff00", // Зеленый
    "#800080", // Фиолетовый
  ];

  // Заполняем экран более агрессивными цветами
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * size;
      const y = row * size;
      const color = colors[Math.floor(Math.random() * colors.length)];
      ctxFlash.fillStyle = color;
      ctxFlash.fillRect(x, y, size, size);
    }
  }

  // Добавляем агрессивную анимацию с более быстрым исчезновением вспышек
  flash.style.backgroundImage = `url(${canvasFlash.toDataURL()})`;
  flash.style.animation = "flashAnimation 0.2s linear"; // Быстрая анимация

  document.body.appendChild(flash);

  flash.addEventListener("animationend", () => {
    document.body.removeChild(flash);
  });
}

// CSS для анимации вспышек
const style = document.createElement("style");
style.innerHTML = `
  @keyframes flashAnimation {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  .flash {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
`;

document.head.appendChild(style);

// Третий эффект: Геометрические фигуры
function startThirdEffect() {
  audio3
    .play()
    .then(() => {
      intervalId = setInterval(animate);

      audio3.addEventListener("timeupdate", setAnimationSpeed);
      audio3.addEventListener("ended", () => {
        clearInterval(intervalId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stopRainbowBackground(); // Останавливаем радужный фон, когда 3-й эффект завершен
      });

      // Начинаем радужный фон только после начала третьего эффекта
      changeBackground();
    })
    .catch((err) =>
      console.error("Ошибка воспроизведения третьего аудио:", err)
    );
}

// Генерация случайных данных для фигур
function getRandomPosition(size) {
  return {
    x: Math.random() * (canvas.width - size),
    y: Math.random() * (canvas.height - size),
  };
}

function getRandomColor() {
  return `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  }, 0.5)`;
}

function getRandomSize() {
  // Размер фигур теперь от 150 до 375
  return 150 + Math.random() * 500;
}

function getRandomAngle() {
  return Math.random() * 360;
}

function drawShapes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const shapes = [
    {
      type: "square",
      size: getRandomSize(),
      color: getRandomColor(),
      angle: getRandomAngle(),
    },
    {
      type: "circle",
      size: getRandomSize(),
      color: getRandomColor(),
      angle: getRandomAngle(),
    },
    {
      type: "triangle",
      size: getRandomSize(),
      color: getRandomColor(),
      angle: getRandomAngle(),
    },
  ];

  shapes.forEach((shape) => {
    const { x, y } = getRandomPosition(shape.size);

    ctx.save();
    ctx.translate(x + shape.size / 2, y + shape.size / 2);
    ctx.rotate((shape.angle * Math.PI) / 180);

    if (shape.type === "square") {
      ctx.beginPath();
      ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
      ctx.fillStyle = shape.color;
      ctx.fill();
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = shape.color;
      ctx.fill();
    } else if (shape.type === "triangle") {
      ctx.beginPath();
      ctx.moveTo(-shape.size / 2, shape.size / 2);
      ctx.lineTo(0, -shape.size / 2);
      ctx.lineTo(shape.size / 2, shape.size / 2);
      ctx.closePath();
      ctx.fillStyle = shape.color;
      ctx.fill();
    }

    ctx.restore();
  });
}

// Настройка скорости анимации в зависимости от времени проигрывания звука
function setAnimationSpeed() {
  const currentTime = audio3.currentTime;
  clearInterval(intervalId);

  if (currentTime < 16) intervalId = setInterval(animate, 200);
  else if (currentTime < 25) intervalId = setInterval(animate, 120);
  else intervalId = setInterval(animate, 95);
}

function animate() {
  drawShapes();
}
// Четвёртый эффект: Мгновенные выколотые круги с увеличением
// Четвёртый эффект: Резкие растущие круги без анимации, увеличивающиеся из центра
function startFourthEffect() {
  // Создание мерцающего и искажённого фона
  const glitchBackground = document.createElement("div");
  glitchBackground.className = "glitch-background";
  document.body.appendChild(glitchBackground);

  // Стили для круга и искажения
  const style = document.createElement("style");
  style.innerHTML = `
    .hollow-circle {
      position: absolute;
      border: 10px solid rgba(0, 255, 0, 0.9); /* Фиксированный цвет */
      border-radius: 50%;
      box-shadow: 0 0 30px 10px rgba(0, 255, 0, 0.8);
      pointer-events: none;
      opacity: 1;
      z-index: 1000;
      width: 150px;
      height: 150px;
      transition: width 1.5s, height 1.5s; /* Увеличение размера за 1.5 секунды */
      transform-origin: center; /* Увеличение из центра */
    }

    .hollow-circle.static {
      width: 750px;
      height: 750px;
    }
  `;
  document.head.appendChild(style);

  let activeCircles = 0; // Счётчик активных кругов

  // Функция для создания круга
  function createGrowingCircle() {
    if (activeCircles >= 2) return; // Ограничение до 2 кругов одновременно

    activeCircles++;

    const circle = document.createElement("div");
    circle.className = "hollow-circle";

    // Случайное расположение (центр круга будет в этом месте)
    const randomX = Math.random() * (window.innerWidth - 750);
    const randomY = Math.random() * (window.innerHeight - 750);

    circle.style.top = `${randomY}px`;
    circle.style.left = `${randomX}px`;

    document.body.appendChild(circle);

    // Увеличиваем круг до 750px за 1.5 секунды
    setTimeout(() => {
      circle.classList.add("static");
    }, 10); // Начнём увеличивать почти сразу

    // Удаляем круг после завершения
    setTimeout(() => {
      document.body.removeChild(circle);
      activeCircles--;
    }, 1500); // Круг остаётся 1.5 секунды
  }

  // Запускаем круги с интервалом
  createGrowingCircle(); // Первый круг сразу
  setInterval(createGrowingCircle, 1000); // Следующий круг каждые 1 секунду

  // Аудио для 4-го эффекта
  const audio4 = new Audio("src/audio/4.mp3");
  audio4
    .play()
    .catch((err) =>
      console.error("Ошибка воспроизведения четвёртого аудио:", err)
    );

  // Завершение эффекта
  audio4.addEventListener("ended", () => {
    document.body.removeChild(glitchBackground);
    document.head.removeChild(style);
    console.log("Четвёртый эффект завершён.");
  });
}

// Переход от третьего к четвёртому эффекту
audio3.addEventListener("ended", () => {
  clearInterval(intervalId);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stopRainbowBackground(); // Останавливаем радужный фон
  startFourthEffect(); // Запуск четвёртого эффекта
});

// Запуск первого эффекта
document.body.addEventListener("click", () => {
  if (audio1.paused && audio2.paused && audio3.paused) {
    audio1
      .play()
      .then(() => startBlurEffect())
      .catch((err) =>
        console.error("Ошибка воспроизведения первого аудио:", err)
      );
  }
});
