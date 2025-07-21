import { memo, type KeyboardEvent } from 'react';
import { FaStar, FaCodeBranch, FaRegBookmark, FaTimes } from 'react-icons/fa';

import type { TRepository } from '../../utils/types';
import { PLACE } from '../../utils/constants';
import { Button } from '../button/button';

import styles from './repository-item.module.css';

type TRepositoryItemProps = {
  item: TRepository;
  type: string;
  openModal: (item: TRepository) => void;
  onClick: (item: TRepository) => void;
};

export const RepositoryItem = memo(
  ({ item, type, openModal, onClick }: TRepositoryItemProps) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        openModal(item);
      }
    };

    return (
      <div
        className={styles.item_area}
        onClick={() => openModal(item)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <div className={styles.item_header}>
          <h3 className={styles.item_name}>{item.name}</h3>
          <Button
            type="button"
            view="icon"
            onClick={(e) => {
              e.stopPropagation();
              onClick(item);
            }}
            onKeyDown={(e) => e.stopPropagation()}
            aria-label={type === PLACE.favorites ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            {type === PLACE.favorites ? <FaTimes /> : <FaRegBookmark />}
          </Button>
        </div>

        <p className={styles.description}>{item.description || 'Описание отсутствует'}</p>

        <div className={styles.meta}>
          <div className={styles.meta_item}>
            <FaStar className={styles.icon} />
            <span>{item.stargazers_count.toLocaleString()}</span>
          </div>

          <div className={styles.meta_item}>
            <FaCodeBranch className={styles.icon} />
            <span>{item.forks_count.toLocaleString()}</span>
          </div>

          {item.language && (
            <div className={styles.meta_item}>
              <span className={styles.language_dot}></span>
              {item.language}
            </div>
          )}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.type === nextProps.type &&
      prevProps.openModal === nextProps.openModal &&
      prevProps.onClick === nextProps.onClick
    );
  },
);
