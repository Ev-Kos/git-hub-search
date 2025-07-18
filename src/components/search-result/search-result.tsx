import { useState, type ChangeEvent } from 'react';

import type { TRepository } from '../../utils/types';
import { RepositoryItem } from '../repository-item/repository-item';

import styles from './search-result.module.css';

type TSearchResultProps = {
  title: string;
  filterValue: string;
  handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  results: TRepository[];
  openModal: (item: TRepository) => void;
  addToFavorites: (item: TRepository) => void;
  moveRepository: (id: number, source: string, place: string) => void;
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
  openModal,
  addToFavorites,
  moveRepository,
}: TSearchResultProps) => {
  const [sortCriteria, setSortCriteria] = useState(CRITERIA.default);
  const [sortDirection, setSortDirection] = useState(DIRECTION.desc);

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

  const filteredResults = results.filter((repo) =>
    repo.name.toLowerCase().includes(filterValue.toLowerCase()),
  );

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <div className={styles.sort_container}>
          <span className={styles.sort_label}>Сортировка:</span>
          <button
            className={`${styles.sort_button} ${sortCriteria === CRITERIA.name ? styles.active : ''}`}
            onClick={() => handleSortChange(CRITERIA.name)}
          >
            По названию {getSortIcon(CRITERIA.name)}
          </button>
          <button
            className={`${styles.sort_button} ${sortCriteria === CRITERIA.stars ? styles.active : ''}`}
            onClick={() => handleSortChange(CRITERIA.stars)}
          >
            По звёздам {getSortIcon(CRITERIA.stars)}
          </button>
        </div>
      </div>

      <div className={styles.filter_container}>
        <input
          type="text"
          value={filterValue}
          onChange={handleFilterChange}
          placeholder="Фильтровать по названию..."
          className={styles.input}
          disabled={isLoading || results.length === 0}
        />
        <span className={styles.result_count}>
          {sortedResults.length}{' '}
          {sortedResults.length === 1
            ? 'репозиторий'
            : sortedResults.length > 1 && sortedResults.length < 5
              ? 'репозитория'
              : 'репозиториев'}
        </span>
      </div>

      <ul className={styles.results_container}>
        {isLoading ? (
          <li className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Загрузка репозиториев...</p>
          </li>
        ) : results.length === 0 ? (
          <li className={styles.empty}>
            {filterValue ? 'Ничего не найдено по вашему фильтру' : 'Введите запрос для поиска'}
          </li>
        ) : sortedResults.length === 0 ? (
          <li className={styles.empty}>Ничего не найдено по вашему фильтру</li>
        ) : (
          sortedResults.map((item) => (
            <RepositoryItem
              key={item.id}
              item={item}
              openModal={openModal}
              addToFavorites={addToFavorites}
              moveRepository={moveRepository}
              type="search"
            />
          ))
        )}
      </ul>
    </div>
  );
};
