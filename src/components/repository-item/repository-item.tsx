import { useCallback, useRef, type KeyboardEvent } from 'react';
import { useDrag } from 'react-dnd';
import { FaStar, FaCodeBranch, FaRegBookmark } from 'react-icons/fa';

import type { TRepository } from '../../utils/types';

import styles from './repository-item.module.css';

type TRepositoryItemProps = {
  item: TRepository;
  type: string;
  moveRepository: (id: number, source: string, place: string) => void;
  openModal: (item: TRepository) => void;
  addToFavorites: (item: TRepository) => void;
};

type TDropResult = {
  name: string;
};

export const RepositoryItem = ({
  item,
  type,
  moveRepository,
  openModal,
  addToFavorites,
}: TRepositoryItemProps) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'item',
    item: { id: item.id, source: type },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<TDropResult>();
      if (item && dropResult) {
        moveRepository(item.id, item.source, dropResult.name);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const ref = useRef<HTMLDivElement>(null); // Изменён тип на HTMLDivElement

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      ref.current = node;
      dragRef(node);
    },
    [dragRef],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      openModal(item);
    }
  };

  return (
    <li className={`${styles.item} ${isDragging ? styles.dragging : ''}`}>
      <div
        ref={setRef}
        role="button"
        tabIndex={0}
        className={styles.item_area}
        onClick={() => openModal(item)}
        onKeyDown={handleKeyDown}
        aria-label={`Открыть детали репозитория ${item.name}`}
      >
        <div className={styles.item_header}>
          <h3 className={styles.item_name}>{item.name}</h3>
          <button
            className={styles.add_button}
            onClick={(e) => {
              e.stopPropagation();
              addToFavorites(item);
            }}
            onKeyDown={(e) => e.stopPropagation()}
            aria-label="Добавить в избранное"
          >
            <FaRegBookmark />
          </button>
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
    </li>
  );
};
