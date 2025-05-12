$(document).ready(function () { 
    // Ожидаем полной загрузки DOM перед выполнением кода

    const burgerMenu = $('.burger-menu'); // Получаем элемент бургерного меню
    const overlay = $('.overlay'); // Получаем затемнённую область
    const content = $('.content'); // Основной контент страницы
    const burgerButton = $('.burger-button'); // Кнопка бургерного меню

    let startX = 0; // Переменная для хранения координаты начала касания (жесты)
    let touchInProgress = false; // Флаг, показывающий, активно ли касание

    // Открытие бургерного меню при клике на кнопку
    burgerButton.click(function () {
        burgerMenu.addClass('open'); // Добавляем класс "open", чтобы показать меню
        overlay.addClass('active'); // Активируем затемнение фона
        content.addClass('blurred'); // Делаем основной контент размытным
        burgerButton.hide(); // Скрываем бургерную кнопку, чтобы не мешала
    });

    // Закрытие меню при клике на затемнённую область
    overlay.click(function () {
        closeMenu(); // Вызываем функцию закрытия меню
    });

    // Обработка касания для закрытия меню через свайп вправо (на мобильных устройствах)
    burgerMenu.on('touchstart', function (e) {
        touchInProgress = true; // Устанавливаем флаг начала касания
        startX = e.touches[0].pageX; // Запоминаем начальную координату X
    });

    burgerMenu.on('touchmove', function (e) {
        if (!touchInProgress) return; // Если касание не активно, ничего не делаем

        const currentX = e.touches[0].pageX; // Получаем текущую X-координату пальца
        const deltaX = currentX - startX; // Рассчитываем смещение пальца

        // Смещаем бургерное меню вправо при свайпе
        if (deltaX > 0) {
            burgerMenu.css('transform', `translateX(${deltaX}px)`);
        }
    });

    burgerMenu.on('touchend', function (e) {
        touchInProgress = false; // Завершаем обработку касания

        const endX = e.changedTouches[0].pageX; // Запоминаем конечную координату
        const deltaX = endX - startX; // Рассчитываем смещение

        // Если свайп вправо больше 50px, закрываем меню
        if (deltaX > 50) {
            closeMenu();
        } else {
            // Если движение незначительное, возвращаем меню на место
            burgerMenu.css('transform', 'translateX(0)');
        }
    });

    // Функция для закрытия меню
    function closeMenu() {
        burgerMenu.removeClass('open'); // Убираем класс "open", скрывая меню
        overlay.removeClass('active'); // Убираем затемнение фона
        content.removeClass('blurred'); // Убираем размытие основного контента
        burgerButton.show(); // Показываем кнопку бургерного меню
        burgerMenu.css('transform', ''); // Сбрасываем все смещения
    }

    // Обработчик клика по кнопкам категорий
    $(".category-buttons button").on("click", function() {
        var categoryPage = $(this).data("category"); // Получаем URL страницы из data-category атрибута
        window.location.href = categoryPage; // Перенаправляем пользователя на соответствующую страницу
    });
});
