import { type Dispatch, type FormEvent, type SetStateAction } from 'react';

import { Input } from '../input/input';
import { Button } from '../button/button';

import styles from './search.module.css';

type TSearchProps = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  handleSearch: VoidFunction;
  isLoading: boolean;
};

export const Search = ({ value, setValue, handleSearch, isLoading }: TSearchProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

  const handleClear = () => {
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.input_wrap}>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Введите ключевое слово для поиска..."
          className={styles.input_search}
          handleClear={handleClear}
          sizeButton={20}
        />
        <Button view="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Поиск' : 'Найти'}
        </Button>
      </div>
    </form>
  );
};
