$(document).ready(function(){
    // Ожидаем полной загрузки DOM перед выполнением кода

    const burgerMenu = $('.burger-menu'); // Находим бургерное меню
    const overlay = $('.overlay'); // Находим затемнённую область
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

    // AJAX-запрос к XML-файлу для загрузки данных о пельменях
    $.ajax({
        url: 'Database.xml', // Путь к XML-файлу с данными
        dataType: 'xml', // Указываем тип данных — XML
        success: function(xml) { // Если загрузка успешна, выполняем этот код
            // Находим все <product> внутри категории с type="Dumplings"
            $(xml).find('Category[type="Dumplings"] > product').each(function(){
                var $product = $(this); // Получаем текущий товар
                var name = $product.find('name').text(); // Название товара
                var price = $product.find('price').text(); // Цена товара
                var amount = $product.find('amount').text(); // Доступное количество
                var image = $product.find('image').text(); // Путь к изображению товара
                var suppliers = $product.find('suppliers').text(); // Поставщик товара

                // Создаём HTML-разметку карточки товара
                var cardHtml = `
                    <div class="product-card">
                        <img src="images/${image}" alt="${name}" class="product-image">
                        <h3 class="product-name">${name}</h3>
                        <p class="product-price">${price}</p>
                        <p class="product-amount">${amount}</p>
                        <p class="product-suppliers">${suppliers}</p>
                    </div>
                `;
                // Добавляем карточку товара в контейнер на странице
                $('.products-container').append(cardHtml);
            });
        },
        error: function() {
            console.error("Не удалось загрузить файл Database.xml"); // Вывод ошибки, если файл не загружен
        }
    });
});
