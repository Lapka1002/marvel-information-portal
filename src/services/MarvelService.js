import { useHttp } from '../hooks/http.hook';


const useMarvelService = () => {

    const { request, clearError, process, setProcess } = useHttp();

    // Устанавливаем базовый URL и ключ для доступа к API Marvel
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=e95be9998b794babefe88da3e04e9498';
    const _baseOffset = 210;

    // Функция для получения всех персонажей или комиксов с сервера Marvel
    const getAllCharacters = async (offset = _baseOffset) => {

        // Выполняем запрос к API Marvel для получения списка персонажей
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);

        // Преобразуем полученные данные и возвращаем массив преобразованных персонажей
        return res.data.results.map(_transformCharacter);
    }
	const getAllComics = async (offset = 0) => {
		const res = await request(
			`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
		);
		return res.data.results.map(_transformComics);
	};

    // Функции для получения информации о конкретном персонаже или комиксе по его идентификатору
    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	};

	const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	}

    // Функции для преобразования данных в удобный формат

    const _transformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name,
			description: char.description
				? `${char.description.slice(0, 210)}...`
				: "There is no description for this character",
			thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items,
		};
	};

    const _transformComics = (comics) => {
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} p.`
				: "No information about the number of pages",
			thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
			language: comics.textObjects[0]?.language || "en-us",
			price: comics.prices[0].price
				? `${comics.prices[0].price}$`
				: "not available",
		};
	};

    // Возвращаем объект с состояниями загрузки и ошибки, а также функциями для получения персонажей и информации о персонаже
    return {
		clearError,
		process,
		setProcess,
		getAllCharacters,
		getCharacter,
		getAllComics,
		getComic,
		getCharacterByName,
	};
}


export default useMarvelService;