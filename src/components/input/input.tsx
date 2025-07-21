import { type InputHTMLAttributes } from 'react';
import { MdClear } from 'react-icons/md';

import styles from './input.module.css';

type TInputProps = {
  className: string;
  handleClear: VoidFunction;
  sizeButton: number;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, handleClear, sizeButton, ...props }: TInputProps) => {
  return (
    <label className={styles.input_label}>
      <input className={`${styles.input} ${className}`} {...props} />
      {props.value && (
        <button
          type="button"
          className={styles.clear_button}
          onClick={handleClear}
          aria-label="Очистить"
        >
          <MdClear size={sizeButton} />
        </button>
      )}
    </label>
  );
};
