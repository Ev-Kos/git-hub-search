import { Draggable, Droppable } from '@hello-pangea/dnd';

import type { TRepository } from '../../utils/types';
import { PLACE } from '../../utils/constants';
import { RepositoryItem } from '../repository-item/repository-item';

import styles from './favorites.module.css';

type TFavoritesProps = {
  title: string;
  favorites: TRepository[];
  openModal: (item: TRepository) => void;
  removeFromFavorites: (item: TRepository) => void;
};

export const Favorites = ({
  title,
  favorites,
  openModal,
  removeFromFavorites,
}: TFavoritesProps) => {
  return (
    <div className={styles.favorites}>
      <h2 className={styles.favorites_title}>
        {title} <span className={styles.badge}>{favorites.length}</span>
      </h2>
      <Droppable droppableId={PLACE.favorites} isDropDisabled={false}>
        {(provided, snapshot) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${styles.favorites_container} ${snapshot.isDraggingOver ? styles.over : ''}`}
          >
            {favorites.length === 0 ? (
              <div className={styles.empty}>
                <p>Перетащите сюда репозитории из результатов поиска</p>
              </div>
            ) : (
              favorites.map((item, index) => (
                <Draggable key={`fav-${item.id}`} draggableId={`fav-${item.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      aria-label={`Открыть детали репозитория ${item.name}`}
                    >
                      <RepositoryItem
                        item={item}
                        openModal={openModal}
                        onClick={removeFromFavorites}
                        type={PLACE.favorites}
                      />
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
};
