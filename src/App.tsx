import { useState, type ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';

import styles from './app.module.css';
import { Search } from './components/search/search';
import { getRepositories } from './utils/api';
import type { TRepository } from './utils/types';
import { SearchResult } from './components/search-result/search-result';
import { Favorites } from './components/favorites/favorites';
import { PLACE } from './utils/constants';
import { Modal } from './components/modal/modal';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TRepository[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [activeRepository, setActiveRepository] = useState<TRepository | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<TRepository[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const favoritesRef = useRef(favorites);
  useEffect(() => {
    favoritesRef.current = favorites;
  }, [favorites]);

  const handleSearch = useCallback(
    async (newPage: number = 1) => {
      if (!searchValue.trim()) return;

      const isFirstPage = newPage === 1;

      if (isFirstPage) {
        setIsLoading(true);
        setSearchResults([]);
        setFilterValue('');
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const response = await getRepositories(searchValue, newPage);

        const filteredItems = response.items.filter(
          (item) => !favoritesRef.current.some((fav) => fav.id === item.id),
        );

        if (isFirstPage) {
          setSearchResults(filteredItems);
        } else {
          setSearchResults((prev) => [...prev, ...filteredItems]);
        }

        setHasMore((response.items || []).length === 30);
        setPage(newPage);
      } catch (err) {
        let errorMessage = 'Произошла ошибка при поиске';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        setError(errorMessage);

        if (isFirstPage) {
          setSearchResults([]);
        }
      } finally {
        if (isFirstPage) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [searchValue],
  );

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const openModal = useCallback((item: TRepository) => {
    setActiveRepository(item);
    setIsModalOpen(true);
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addToFavorites = useCallback((item: TRepository) => {
    setSearchResults((prev) => prev.filter((el) => el.id !== item.id));
    setFavorites((prev) => [...prev, item]);
  }, []);

  const removeFromFavorites = useCallback((item: TRepository) => {
    setFavorites((prev) => prev.filter((el) => el.id !== item.id));
    setSearchResults((prev) => {
      if (!prev.some((el) => el.id === item.id)) {
        return [item, ...prev];
      }
      return prev;
    });
  }, []);

  const onLoadMore = useCallback(() => {
    handleSearch(page + 1);
  }, [handleSearch, page]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === PLACE.search && destination.droppableId === PLACE.favorites) {
      const item = searchResults[source.index];
      if (item) {
        setSearchResults((prev) => prev.filter((_, idx) => idx !== source.index));
        setFavorites((prev) => [...prev, item]);
      }
    }

    if (source.droppableId === PLACE.favorites && destination.droppableId === PLACE.favorites) {
      if (source.index !== destination.index) {
        setFavorites((prev) => {
          const newFavorites = [...prev];
          const [movedItem] = newFavorites.splice(source.index, 1);
          newFavorites.splice(destination.index, 0, movedItem);
          return newFavorites;
        });
      }
    }

    if (source.droppableId === PLACE.favorites && destination.droppableId === PLACE.search) {
      const item = favorites[source.index];
      if (item) {
        removeFromFavorites(item);
      }
    }
  };

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <h1>GitHub Search</h1>
        <Search
          value={searchValue}
          setValue={setSearchValue}
          handleSearch={() => handleSearch(1)}
          isLoading={isLoading}
        />
      </header>
      {error && <p className={styles.error}>{error}</p>}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.columns}>
          <SearchResult
            title="Результаты поиска"
            filterValue={filterValue}
            handleFilterChange={handleFilterChange}
            isLoading={isLoading}
            results={searchResults}
            openModal={openModal}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            favorites={favorites}
            searchValue={searchValue}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            currentPage={page}
          />
          <Favorites
            title="Избранное"
            favorites={favorites}
            openModal={openModal}
            removeFromFavorites={removeFromFavorites}
          />
        </div>
      </DragDropContext>
      {isModalOpen && activeRepository && (
        <Modal
          item={activeRepository}
          closeModal={closeModal}
          isFavorite={favorites.some((fav) => fav.id === activeRepository.id)}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
        />
      )}
    </main>
  );
}

export default App;
