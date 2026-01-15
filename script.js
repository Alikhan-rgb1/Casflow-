const questions = [
    {
        text: "Твой основной источник дохода на сегодня?",
        answers: [
            "Работаю в найме. Моя зарплата — это моя зона комфорта и стабильность.",
            "У меня свой бизнес или фриланс. Я сам себе хозяин (и бухгалтер, и маркетолог, и грузчик).",
            "Совмещаю работу и проекты. Пытаюсь усидеть на всех стульях сразу.",
            "В поиске новых возможностей. Или просто на удаленке от жизни."
        ]
    },
    {
        text: "Твоя главная финансовая цель на ближайший год?",
        answers: [
            "Сформировать «подушку безопасности». Чтобы спать крепче и не нервничать.",
            "Увеличить доход и начать инвестировать. Пора забирать деньги у богатых.",
            "Масштабировать бизнес / уйти из найма. Сжечь мосты и пойти ва-банк.",
            "Разобраться, куда уходят деньги. Они просто исчезают, как магия!"
        ]
    },
    {
        text: "Что ты обычно делаешь с остатком денег в конце месяца?",
        answers: [
            "Трачу на то, что давно хотел(а) купить. Я себя балую, мне можно.",
            "Оставляю на карте «до востребования». Вдруг срочно понадобится на такси.",
            "Откладываю в накопления или инвестирую. Я ответственный взрослый.",
            "Остатка обычно не бывает. Живу в моменте, YOLO."
        ]
    },
    {
        text: "Твой опыт в инвестировании?",
        answers: [
            "Новичок. Моя единственная инвестиция — это вклад под 3% годовых в банке.",
            "Теоретик. Смотрю блогеров, но еще ни разу не рисковал(а) своими кровными.",
            "Практик. Есть портфель акций/крипты/недвижки. Уже не боюсь слова «просадка».",
            "Акула. Я здесь, чтобы преподать вам всем урок, садитесь и записывайте."
        ]
    },
    {
        text: "Какую личную финансовую преграду ты хочешь преодолеть на игре?",
        answers: [
            "Страх больших денег: боюсь инвестировать. Лучше синица в руках.",
            "Стеклянный потолок: застрял на одном уровне дохода. Кажется, виноваты звезды.",
            "Отсутствие системы: не понимаю разницу между активами и пассивами в своей жизни.",
            "Поиск идей: хочу понять, в какую сторону двигаться. Волшебный пендель нужен.",
            "Дисциплина: хочу научиться вести учет. Мне лень, если честно."
        ]
    },
    {
        text: "Твой главный фокус на ближайшую игру?",
        answers: [
            "Масштабирование доходов. Хочу ногой открывать двери.",
            "Первые шаги в инвестициях. Аккуратно потрогать воду пальчиком.",
            "Поиск единомышленников и общение. Скучно дома сидеть.",
            "Проверка своей текущей жизненной стратегии на прочность. Может, я все делаю неправильно?"
        ]
    },
    {
        text: "С каким запросом ты идешь на игру в этот раз?",
        answers: [
            "Прокачать фин. мышление. Мне кажется, я гений, но пока никто не заметил.",
            "Отработать стратегию. Хочу в игре проиграть все, чтобы в жизни получилось.",
            "Нетворкинг. Ищу богатых друзей, а не вот это вот все.",
            "Выход из «крысиных бегов». Хочу работать меньше, а получать больше.",
            "Управление эмоциями. Чтобы не орать, когда сосед по столу украл мою сделку."
        ]
    },
    {
        text: "Знаком ли ты с правилами Cash Flow (Денежный поток)?",
        answers: [
            "Играл много раз. Считаю себя гуру Кийосаки.",
            "Играл 1–2 раза. Еще не понял, куда нажимать.",
            "Читал Кийосаки, но ни разу не играл. Я теоретик от бога.",
            "Впервые слышу. Думал, это настолка про монополию с котиками."
        ]
    }
];

const cardEl = document.querySelector(".quiz-card");
const titleEl = document.getElementById("title");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let answered = false;
let isWelcomeScreen = true;
let isFinalForm = false;

let isAnimating = false;

function flipCardAndUpdate(updateContent) {
    if (isAnimating) {
        return;
    }
    isAnimating = true;
    nextBtn.disabled = true;

    cardEl.classList.add("flip-out");

    setTimeout(() => {
        updateContent();
        cardEl.classList.remove("flip-out");
        cardEl.classList.add("flip-in");

        setTimeout(() => {
            cardEl.classList.remove("flip-in");
            isAnimating = false;
        }, 300);
    }, 300);
}

function renderWelcome() {
    titleEl.textContent = "Cash Flow";
    questionEl.textContent = "Заполни короткую форму, чтобы мы подобрали для тебя идеальное место за игровым столом.";
    answersEl.innerHTML = "";
    resultEl.textContent = "";
    nextBtn.textContent = "Продолжить";
    nextBtn.disabled = false;
}

function renderQuestion() {
    const question = questions[currentQuestionIndex];
    titleEl.textContent = "Вопрос " + (currentQuestionIndex + 1) + " из " + questions.length;
    questionEl.textContent = question.text;
    answersEl.innerHTML = "";
    resultEl.textContent = "";
    answered = false;

    question.answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.className = "quiz-answer-btn";
        btn.textContent = answer;
        btn.addEventListener("click", () => handleAnswer(btn, index));
        answersEl.appendChild(btn);
    });

    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.textContent = "Завершить";
    } else {
        nextBtn.textContent = "Следующий вопрос";
    }
    nextBtn.disabled = true;
}

function handleAnswer(button, index) {
    const buttons = answersEl.querySelectorAll("button");

    buttons.forEach((btn) => {
        btn.classList.remove("selected");
    });

    button.classList.add("selected");
    resultEl.textContent = "";

    nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
    if (isWelcomeScreen) {
        flipCardAndUpdate(() => {
            isWelcomeScreen = false;
            currentQuestionIndex = 0;
            renderQuestion();
        });
        return;
    }

    if (isFinalForm) {
        handleSubmitForm();
        return;
    }

    if (currentQuestionIndex < questions.length - 1) {
        flipCardAndUpdate(() => {
            currentQuestionIndex += 1;
            renderQuestion();
        });
    } else {
        flipCardAndUpdate(() => {
            showFinal();
        });
    }
});

function showFinal() {
    isFinalForm = true;
    answered = false;

    titleEl.textContent = "На этом всё";
    questionEl.textContent = "Оставь свои данные, чтобы мы могли связаться с тобой.";
    answersEl.innerHTML = `
        <div class="form-field">
            <label class="form-label" for="firstName">Имя</label>
            <input class="form-input" id="firstName" type="text" placeholder="Имя">
        </div>
        <div class="form-field">
            <label class="form-label" for="phone">Номер телефона</label>
            <input class="form-input" id="phone" type="tel" placeholder="+7 ___ ___-__-__">
        </div>
    `;
    resultEl.textContent = "";
    nextBtn.style.display = "inline-block";
    nextBtn.textContent = "Отправить";
    nextBtn.disabled = false;
}

function handleSubmitForm() {
    const firstNameInput = document.getElementById("firstName");
    const phoneInput = document.getElementById("phone");

    const firstName = firstNameInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!firstName || !phone) {
        resultEl.textContent = "Пожалуйста, заполни все поля.";
        return;
    }

    firstNameInput.disabled = true;
    phoneInput.disabled = true;
    nextBtn.style.display = "none";

    titleEl.textContent = "Спасибо!";
    questionEl.textContent = "Заявка отправлена, наш менеджер свяжется с тобой в ближайшее время.";
    answersEl.innerHTML = "";
    resultEl.textContent = "";
}

renderWelcome();
