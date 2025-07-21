import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './button.module.css';

type TView = 'primary' | 'close' | 'filter' | 'icon';

type TButtonProps = {
  children: ReactNode;
  className?: string;
  view: TView;
  isActive?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  className,
  view = 'primary',
  isActive,
  ...props
}: TButtonProps) => {
  const classButton = () => {
    return view === 'primary'
      ? `${className} ${styles.button} ${styles.button_primary}`
      : view === 'close'
        ? `${className} ${styles.button} ${styles.button_close}`
        : view === 'icon'
          ? `${className} ${styles.button} ${styles.button_icon}`
          : `${className} ${styles.button} ${isActive ? styles.button_filter_active : styles.button_filter}`;
  };

  return (
    <button className={classButton()} {...props}>
      {children}
    </button>
  );
};
