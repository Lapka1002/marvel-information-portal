import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService'
import setContent from '../../utils/setContent';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

    // Состояние персонажа
    const [char, setChar] = useState({});

    // Получение состояний загрузки, ошибки и функции для получения персонажа из сервиса Marvel
    const { getCharacter, clearError, process, setProcess } = useMarvelService();

    // Загрузка случайного персонажа при монтировании компонента и обновление каждые 60 секунд
    useEffect(() => {
        updateChar();  // Загрузка первого случайного персонажа
        const timerId = setInterval(updateChar, 60000); // Установка интервала для обновления каждые 60 секунд

        // Очистка интервала при размонтировании компонента
        return () => {
            clearInterval(timerId)
        }
    }, [])

    // Обработчик успешной загрузки персонажа
    const onCharLoaded = (char) => {
        setChar(char);
    }

    // Функция для обновления персонажа
    const updateChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id) // Получение данных о персонаже по его ID
            .then(onCharLoaded)
            .then(() => setProcess('confirmed')); // Обработка успешной загрузки данных о персонаже
    }

    // Отображение сообщения об ошибке, спиннера загрузки, контента (информации о персонаже) или кнопки для обновления персонажа

    return (
        <div className="randomchar">
            {setContent(process, View, char)}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br />
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
            </div>
        </div>
    )
}

// Компонент для отображения информации о персонаже
const View = ({ data }) => {

    const { name, description, homepage, wiki, thumbnail } = data;

    // Отображение описания персонажа или сообщения о его отсутствии
    const displayDescription = description !== '' ? description : 'No description available';

    // Стили для изображения персонажа в зависимости от его наличия
    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'contain' };
    }

    // Отображение информации о персонаже (изображение, имя, описание, кнопки для перехода на домашнюю страницу и википедию)
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle} />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {displayDescription}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}
export default RandomChar;