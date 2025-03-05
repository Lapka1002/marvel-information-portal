import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

import PropTypes from 'prop-types';

const CharInfo = (props) => {

    // Состояние персонажа
    const [char, setChar] = useState(null);

    // Получение состояний загрузки, ошибки и функции для получения информации о персонаже из сервиса Marvel
    const { getCharacter, clearError, process, setProcess } = useMarvelService();

    // Загрузка информации о персонаже при изменении ID персонажа
    useEffect(() => {
        updateChar()
    }, [props.charId])

    // Функция для загрузки информации о персонаже
    const updateChar = () => {
        const { charId } = props;
        if (!charId) {
            return;
        }
        clearError(); // Очистка ошибок перед загрузкой
        getCharacter(charId)// Получение данных о персонаже
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    // Обработчик успешной загрузки данных о персонаже
    const onCharLoaded = (char) => {
        setChar(char);
    }

  
    // Отображение скелетона загрузки, сообщения об ошибке, спиннера загрузки и информации о персонаже
    // const skeleton = char || loading || error ? null : <Skeleton />;
    // const errorMessage = error ? <ErrorMessage /> : null;
    // const spinner = loading ? <Spinner /> : null;
    // const content = !(loading || error || !char) ? <View char={char} /> : null;

    return (
        <div className="char__info">
          {setContent(process, View, char)}
        </div>
    )
}

// Компонент для отображения информации о персонаже
const View = ({ data }) => {
    const { name, description, thumbnail, homepage, wiki, comics } = data;

    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'unset' };
    }

    // Отображение информации о персонаже (изображение, имя, описание, кнопки для перехода на домашнюю страницу и википедию, комиксы)
    return (
        <>
            <div className="char__basics">
                <img style={imgStyle} src={thumbnail} alt={name} />
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        const comicId = item.resourceURI.substring(43);
                        if (i < 10) {
                            return (
                                <li key={i} className="char__comics-item">
                                    <Link to={`/comics/${comicId}`}>
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        }
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;