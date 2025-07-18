import type { Dispatch, FormEvent, SetStateAction } from 'react';
import styles from './search.module.css';

type TSearchProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  handleSearch: VoidFunction;
  isLoading: boolean;
}

export const Search = ({ value, setValue, handleSearch, isLoading }: TSearchProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.input_wrap}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Введите ключевое слово для поиска..."
          className={styles.input}
        />
        <button 
          type="submit" 
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Поиск...' : 'Найти'}
        </button>
      </div>
    </form>
  )
}
