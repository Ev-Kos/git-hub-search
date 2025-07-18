import type { TResponse } from "./types";

const checkResponse = <T>(res: Response): Promise<T> => {
	return res.ok ? res.json() : res.json().then((err) => Promise.reject(err));
};

const URL = 'https://api.github.com/search/repositories';

export const getRepositories = (searchValue: string) => {
  return fetch(`${URL}?q=${searchValue}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TResponse>(res));
}
