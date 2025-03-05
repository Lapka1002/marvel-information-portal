import { useState, useCallback } from "react";

export const useHttp = () => {

    // Создаем состояния loading (загрузка) и error (ошибка) с помощью useState

    const [process, setProcess] = useState('waiting');

    // Создаем функцию request с помощью useCallback
    const request = useCallback(async (url, method = 'GET', body = null, headers = { 'Content-Type': 'application/json' }) => {

        // Устанавливаем состояние loading в true для показа процесса загрузки

        setProcess('loading');

        try {
            // Отправляем запрос на сервер с помощью функции fetch
            const response = await fetch(url, { method, body, headers });

            // Проверяем успешность ответа. Если статус не "ок", выбрасываем ошибку
            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            // Получаем данные из ответа и преобразуем их  из формата JSON в объект JavaScript
            const data = await response.json();

            // Устанавливаем состояние loading в false после успешного получения данных


            return data;

        } catch (e) {
            // В случае возникновения ошибки:

            // Устанавливаем состояние error с сообщением об ошибке
            setProcess('error');

            // Повторно выбрасываем ошибку для обработки во внешнем коде
            throw e;
        }

    }, []);

    // Создаем функцию clearError с помощью useCallback для очистки состояния error
    const clearError = useCallback(() => {
        setProcess('loading');
    }, []);

    // Возвращаем объект с состояниями loading и error, функцией request и функцией clearError
    return { request, clearError, process, setProcess };

}