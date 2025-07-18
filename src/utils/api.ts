import type { TRepository, TResponse } from './types';

const checkResponse = <T>(res: Response): Promise<T> => {
  return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
};

const URL = 'https://api.github.com/search/repositories';
const REPO_URL = 'https://api.github.com/repos';

export const getRepositories = (searchValue: string) => {
  return fetch(`${URL}?q=${searchValue}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => checkResponse<TResponse>(res));
};

export const getReposity = (login: string, name: string) => {
  return fetch(`${REPO_URL}/${login}/${name}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => checkResponse<TRepository>(res));
};
