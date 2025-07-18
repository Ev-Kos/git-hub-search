import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import styles from './app.module.css';
import { Search } from './components/search/search';
import { getRepositories, getReposity } from './utils/api';
import type { TRepository } from './utils/types';
import { SearchResult } from './components/search-result/search-result';

const PLACE = {
  favorites: 'favorites',
  search: 'search',
};

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TRepository[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [activeRepository, setActiveRepository] = useState<TRepository | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<TRepository[]>([]);

  console.log(activeRepository, isModalOpen);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getRepositories(searchValue);
      setSearchResults(response.items || []);
      setSearchValue('');
    } catch (err) {
      let errorMessage = 'Произошла ошибка при поиске';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const openModal = async (item: TRepository) => {
    setIsLoading(true);
    setError(null);

    try {
      // Если языки не загружены, делаем дополнительный запрос
      if (!item.language) {
        const response = await getReposity(item.owner.login, item.name);
        setActiveRepository(response);
      } else {
        setActiveRepository(item);
      }

      setIsModalOpen(true);
    } catch (err) {
      let errorMessage = 'Не удалось загрузить данные репозитория';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const moveRepository = (id: number, source: string, place: string) => {
    if (source === place) return;

    if (source === PLACE.search && place === PLACE.favorites) {
      const repoToAdd = searchResults.find((item) => item.id === id);
      if (repoToAdd && !favorites.some((item) => item.id === id)) {
        setFavorites([...favorites, repoToAdd]);
      }
    } else if (source === PLACE.favorites && place === PLACE.search) {
      setFavorites(favorites.filter((item) => item.id !== id));
    }
  };

  const addToFavorites = (item: TRepository) => {
    if (!favorites.some((el) => el.id === item.id)) {
      setFavorites([...favorites, item]);
    }
  };

  const filteredResults = searchResults.filter((item) =>
    item.name.toLowerCase().includes(filterValue.toLowerCase()),
  );

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <h1>GitHub Search</h1>
        <Search
          value={searchValue}
          setValue={setSearchValue}
          handleSearch={handleSearch}
          isLoading={isLoading}
          ref={searchRef}
        />
      </header>
      {error && <p className={styles.error}>{error}</p>}
      <DndProvider backend={HTML5Backend}>
        <div className={styles.columns}>
          <SearchResult
            title="Результаты поиска"
            filterValue={filterValue}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading}
            results={filteredResults}
            openModal={openModal}
            addToFavorites={addToFavorites}
            moveRepository={moveRepository}
          />
        </div>
      </DndProvider>
    </main>
  );
}

export default App;
