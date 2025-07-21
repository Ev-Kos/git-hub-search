import { useEffect } from 'react';
import { FaStar, FaCodeBranch, FaEye, FaLink, FaTimes } from 'react-icons/fa';
import { createPortal } from 'react-dom';

import type { TRepository } from '../../utils/types';
import { Button } from '../button/button';

import styles from './modal.module.css';

type TModal = {
  item: TRepository;
  closeModal: VoidFunction;
  isFavorite: boolean;
  addToFavorites: (item: TRepository) => void;
  removeFromFavorites: (item: TRepository) => void;
};

const modalRoot = document.getElementById('modal') as HTMLElement;

export const Modal = ({
  item,
  closeModal,
  isFavorite,
  addToFavorites,
  removeFromFavorites,
}: TModal) => {
  useEffect(() => {
    const closeEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', closeEsc);

    return () => {
      document.removeEventListener('keydown', closeEsc);
    };
  }, [closeModal]);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return createPortal(
    <div className={styles.modal_overlay} onClick={closeModal}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <Button type="button" view="close" onClick={closeModal} aria-label="Закрыть модальное окно">
          <FaTimes />
        </Button>
        <div className={styles.modal_header}>
          <div className={styles.info}>
            <h2 id="modal-title" className={styles.name}>
              {item.name}
            </h2>
            <p className={styles.owner}>
              <a
                href={item.owner.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.owner_link}
              >
                {item.owner.login}
              </a>
            </p>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat_item}>
              <FaStar className={styles.stat_icon} />
              <span>{item.stargazers_count.toLocaleString()}</span>
            </div>

            <div className={styles.stat_item}>
              <FaCodeBranch className={styles.stat_icon} />
              <span>{item.forks_count.toLocaleString()}</span>
            </div>

            <div className={styles.stat_item}>
              <FaEye className={styles.stat_icon} />
              <span>{item.watchers_count.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className={styles.modal_body}>
          <div className={styles.section}>
            <h3>Описание</h3>
            <p className={styles.description}>{item.description || 'Описание отсутствует'}</p>
          </div>

          <div className={styles.details}>
            <div className={styles.detail_item}>
              <h4>Создан</h4>
              <p>{formatDate(item.created_at)}</p>
            </div>

            <div className={styles.detail_item}>
              <h4>Последнее обновление</h4>
              <p>{formatDate(item.updated_at)}</p>
            </div>

            {item.language && (
              <div className={styles.detail_item}>
                <h4>Основной язык</h4>
                <p>
                  <span className={styles.language_dot}></span>
                  {item.language}
                </p>
              </div>
            )}

            <div className={styles.detail_item}>
              <h4>Лицензия</h4>
              <p>{item.license?.name || 'Не указана'}</p>
            </div>
          </div>

          {item.homepage && (
            <div className={styles.section}>
              <h3>Домашняя страница</h3>
              <a
                href={item.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.homepage_link}
              >
                <FaLink className={styles.linkIcon} />
                {item.homepage}
              </a>
            </div>
          )}

          <div className={styles.section}>
            <h3>Темы</h3>
            <div className={styles.topics}>
              {item.topics && item.topics.length > 0 ? (
                item.topics.map((topic) => (
                  <span key={topic} className={styles.topic}>
                    {topic}
                  </span>
                ))
              ) : (
                <p>Темы не указаны</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.modal_footer}>
          <a
            href={item.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.repo_link}
          >
            Открыть на GitHub
          </a>
          <Button
            type="button"
            view="primary"
            onClick={(e) => {
              e.stopPropagation();
              if (isFavorite) {
                removeFromFavorites(item);
              } else {
                addToFavorites(item);
              }
            }}
          >
            {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          </Button>
        </div>
      </div>
    </div>,
    modalRoot,
  );
};
