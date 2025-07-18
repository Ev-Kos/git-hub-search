import { useState } from 'react';
import styles from './app.module.css';
import { Search } from './components/search/search';
import { getRepositories } from './utils/api';
import type { TRepository } from './utils/types';

function App() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<TRepository[]>([]);

  console.log(error, searchResults)

  const handleSearch = async () => {
    if (!searchValue.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getRepositories(searchValue)
      
      setSearchResults(response.items || []);
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

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <h1>GitHub Search</h1>
        <Search value={searchValue} setValue={setSearchValue} handleSearch={handleSearch} isLoading={isLoading} />
      </header>
    </main>
  );
}

export default App;
