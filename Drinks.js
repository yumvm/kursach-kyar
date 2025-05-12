$(document).ready(function(){
    // Когда документ загружен полностью, выполняем код
     
    const burgerMenu = $('.burger-menu'); // Получаем элемент бургерного меню
    const overlay = $('.overlay'); // Получаем элемент затемнённой области
    const content = $('.content'); // Получаем основной контент страницы
    const burgerButton = $('.burger-button'); // Получаем кнопку бургерного меню
  
    let startX = 0; // Переменная для хранения начальной координаты касания (для жестов)
    let touchInProgress = false; // Флаг, указывающий, идет ли сейчас касание
  
    // Открытие бургерного меню при клике на кнопку
    burgerButton.click(function () {
      burgerMenu.addClass('open'); // Добавляем класс "open" для показа меню
      overlay.addClass('active'); // Активируем затемнение фона
      content.addClass('blurred'); // Делаем контент размытным
      burgerButton.hide(); // Скрываем кнопку бургерного меню
    });
  
    // Закрытие бургерного меню при клике на затемнённую область
    overlay.click(function () {
      closeMenu(); // Вызываем функцию закрытия меню
    });
  
    // Обработка касания для закрытия меню через свайп вправо
    burgerMenu.on('touchstart', function (e) {
      touchInProgress = true; // Устанавливаем флаг начала касания
      startX = e.touches[0].pageX; // Сохраняем начальную точку касания (X-координата)
    });
  
    burgerMenu.on('touchmove', function (e) {
      if (!touchInProgress) return; // Если касание не активно, прекращаем обработку
  
      const currentX = e.touches[0].pageX; // Получаем текущую X-координату касания
      const deltaX = currentX - startX; // Разница между начальной и текущей точкой касания
  
      // Двигаем меню вправо при касании
      if (deltaX > 0) {
        burgerMenu.css('transform', `translateX(${deltaX}px)`); // Смещаем меню вправо
      }
    });
  
    burgerMenu.on('touchend', function (e) {
      touchInProgress = false; // Завершаем обработку касания
  
      const endX = e.changedTouches[0].pageX; // Получаем конечную точку касания
      const deltaX = endX - startX; // Разница между начальной и конечной точкой
  
      // Если свайп вправо превышает 50px, закрываем меню
      if (deltaX > 50) {
        closeMenu(); // Закрываем меню
      } else {
        // Возвращаем меню в исходное положение
        burgerMenu.css('transform', 'translateX(0)');
      }
    });
  
    // Функция закрытия меню
    function closeMenu() {
      burgerMenu.removeClass('open'); // Убираем класс "open", скрывая меню
      overlay.removeClass('active'); // Убираем затемнение фона
      content.removeClass('blurred'); // Убираем размытие контента
      burgerButton.show(); // Возвращаем кнопку бургерного меню
      burgerMenu.css('transform', ''); // Сбрасываем трансформацию
    }

    // AJAX-запрос к XML-файлу для загрузки данных о напитках
    $.ajax({
      url: 'Database.xml', // Адрес XML-файла
      dataType: 'xml', // Тип данных, которые получаем (XML)
      success: function(xml) { // Если загрузка успешна, выполняем код ниже
        // Находим все <product> внутри категории с type="Drinks"
        $(xml).find('Category[type="Drinks"] > product').each(function(){
          var $product = $(this); // Получаем текущий товар
          var name = $product.find('name').text(); // Название товара
          var price = $product.find('price').text(); // Цена товара
          var amount = $product.find('amount').text(); // Доступное количество
          var image = $product.find('image').text(); // Изображение товара
          var suppliers = $product.find('suppliers').text(); // Поставщик товара

          // Создаем HTML-разметку карточки товара
          var cardHtml = `
            <div class="product-card">
              <img src="images/${image}" alt="${name}" class="product-image">
              <h3 class="product-name">${name}</h3>
              <p class="product-price">${price}</p>
              <p class="product-amount">${amount}</p>
              <p class="product-suppliers">${suppliers}</p>
            </div>
          `;
          // Добавляем карточку в контейнер
          $('.products-container').append(cardHtml);
        });
      },
      error: function() {
        console.error("Не удалось загрузить файл Database.xml"); // Сообщение об ошибке, если файл не загружается
      }
    });
});
