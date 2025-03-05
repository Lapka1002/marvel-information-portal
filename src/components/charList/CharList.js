import { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import useMarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';
import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
        case 'loading':
            return newItemLoading ? <Component/> :  <Spinner />;
        case 'confirmed':
            return <Component/>;
        case 'error':
            return <ErrorMessage />;
        default:
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    const [charList, setCharList] = useState([]); // Список персонажей
    const [newItemLoading, setNewItemLoading] = useState(false); // Загрузка нового элемента
    const [offset, setOffset] = useState(210); // Смещение для загрузки новых данных
    const [charEnded, setCharEnded] = useState(false); // Признак окончания списка персонажей

    // Получение состояний загрузки, ошибки и функции для получения всех персонажей из сервиса Marvel
    const { getAllCharacters, process, setProcess  } = useMarvelService();

    useEffect(() => {
        onRequest(offset, true); // Запрос на сервер при загрузке компонента с учетом смещения
    }, [])

    // Функция для отправки запроса на сервер
    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed'))
    }

    // Обработка успешной загрузки данных о персонажах
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        // Обновление состояний списка персонажей, загрузки нового элемента, смещения и признака окончания списка
        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    // Рефы для каждого элемента списка
    const itemRefs = useRef([]);

    // Функция для фокусировки на элементе списка
    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    // Функция для отрисовки элементов списка
    function renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            // Отображение каждого элемента списка с изображением и именем персонажа
            return (
                <CSSTransition
                    classNames="char__item"
                    timeout={500}
                    key={item.id}>
                    <li
                        className="char__item"
                        tabIndex={0}
                        ref={el => itemRefs.current[i] = el}
                        key={item.id}
                        onClick={() => {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }}
                        onKeyPress={(e) => {
                            if (e.key === ' ' || e.key === "Enter") {
                                props.onCharSelected(item.id);
                                focusOnItem(i);
                            }
                        }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });

        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }



    return (
        <div className="char__list">
            {setContent(process, () => renderItems(charList), newItemLoading)}
            <button
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

// Валидация пропсов
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;