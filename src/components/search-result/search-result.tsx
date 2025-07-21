import { useMemo, useState, type ChangeEvent } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { MdClear } from 'react-icons/md';

import type { TRepository } from '../../utils/types';
import { RepositoryItem } from '../repository-item/repository-item';
import { PLACE } from '../../utils/constants';
import { Input } from '../input/input';
import { Button } from '../button/button';
import { useDebounce } from '../../utils/hooks/useDebounce';

import styles from './search-result.module.css';

type TSearchResultProps = {
  title: string;
  filterValue: string;
  handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  results: TRepository[];
  favorites: TRepository[];
  openModal: (item: TRepository) => void;
  addToFavorites: (item: TRepository) => void;
  searchValue: string;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  currentPage: number;
  removeFromFavorites: (item: TRepository) => void;
};

const CRITERIA = {
  default: 'default',
  name: 'name',
  stars: 'stars',
};

const DIRECTION = {
  asc: 'asc',
  desc: 'desc',
};

export const SearchResult = ({
  title,
  filterValue,
  handleFilterChange,
  isLoading,
  results,
  favorites,
  openModal,
  addToFavorites,
  searchValue,
  onLoadMore,
  hasMore,
  isLoadingMore,
  currentPage,
  removeFromFavorites,
}: TSearchResultProps) => {
  const [sortCriteria, setSortCriteria] = useState(CRITERIA.default);
  const [sortDirection, setSortDirection] = useState(DIRECTION.desc);

  const debouncedFilterValue = useDebounce(filterValue, 300);

  const handleSortChange = (criteria: string) => {
    if (sortCriteria === criteria) {
      setSortDirection(sortDirection === DIRECTION.asc ? DIRECTION.desc : DIRECTION.asc);
    } else {
      setSortCriteria(criteria);
      setSortDirection(criteria === CRITERIA.name ? DIRECTION.asc : DIRECTION.desc);
    }
  };

  const getSortIcon = (criteria: string) => {
    if (sortCriteria !== criteria) return null;

    return sortDirection === DIRECTION.asc ? '↑' : '↓';
  };

  const filteredResults = useMemo(() => {
    return results.filter((item) =>
      item.name.toLowerCase().includes(debouncedFilterValue.toLowerCase()),
    );
  }, [results, debouncedFilterValue]);

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortCriteria === CRITERIA.name) {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortDirection === DIRECTION.asc
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }

    if (sortCriteria === CRITERIA.stars) {
      return sortDirection === DIRECTION.asc
        ? a.stargazers_count - b.stargazers_count
        : b.stargazers_count - a.stargazers_count;
    }

    return 0;
  });

  const clearInput = () => {
    handleFilterChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>);
  };

  const resetSorting = () => {
    setSortCriteria(CRITERIA.default);
    setSortDirection(DIRECTION.desc);
  };

  const resetAll = () => {
    clearInput();
    resetSorting();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <div className={styles.sort_container}>
          <span className={styles.sort_label}>Сортировка:</span>
          <Button
            type="button"
            view="filter"
            onClick={() => handleSortChange(CRITERIA.name)}
            isActive={sortCriteria === CRITERIA.name}
          >
            По названию {getSortIcon(CRITERIA.name)}
          </Button>
          <Button
            type="button"
            view="filter"
            onClick={() => handleSortChange(CRITERIA.stars)}
            isActive={sortCriteria === CRITERIA.stars}
          >
            По звёздам {getSortIcon(CRITERIA.stars)}
          </Button>
        </div>
      </div>

      <div className={styles.filter_container}>
        <div className={styles.input_wrapper}>
          <Input
            value={filterValue}
            onChange={handleFilterChange}
            placeholder="Фильтровать по названию..."
            className={styles.input_filter}
            disabled={isLoading || results.length === 0}
            handleClear={clearInput}
            sizeButton={16}
          />
        </div>

        <div className={styles.actions_wrapper}>
          {(filterValue || sortCriteria !== CRITERIA.default) && (
            <Button type="button" view="filter" onClick={resetAll}>
              Сбросить всё
              <MdClear size={18} />
            </Button>
          )}
          <span className={styles.result_count}>
            {sortedResults.length}{' '}
            {sortedResults.length === 1
              ? 'репозиторий'
              : sortedResults.length > 1 && sortedResults.length < 5
                ? 'репозитория'
                : 'репозиториев'}
          </span>
        </div>
      </div>
      <div className={styles.results_container}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Загрузка репозиториев...</p>
          </div>
        ) : results.length === 0 ? (
          <div className={styles.empty}>
            {filterValue
              ? 'Ничего не найдено по вашему фильтру'
              : searchValue
                ? 'Ничего не найдено'
                : 'Введите запрос для поиска'}
          </div>
        ) : sortedResults.length === 0 ? (
          <div className={styles.empty}>Ничего не найдено по вашему фильтру</div>
        ) : (
          <Droppable droppableId={PLACE.search} isDropDisabled={false}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={styles.results_list}
              >
                {sortedResults.map((item, index) => {
                  const isFav = favorites.some((fav) => fav.id === item.id);
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={`search-${item.id}`}
                      index={index}
                      isDragDisabled={isFav}
                    >
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
                            onClick={isFav ? removeFromFavorites : addToFavorites}
                            type={PLACE.search}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </div>
      <div className={styles.pagination}>
        {!isLoading && !isLoadingMore && hasMore && (
          <Button
            type="button"
            onClick={onLoadMore}
            view="primary"
            disabled={!hasMore && currentPage > 1}
          >
            {!hasMore && currentPage > 1 ? 'Больше ничего нет' : 'Показать ещё'}
          </Button>
        )}
        {isLoadingMore && (
          <div className={styles.loading_more}>
            <div className={styles.spinner}></div>
            Загрузка...
          </div>
        )}
      </div>
    </div>
  );
};
