import useSwr from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const result = await response.json();
  return result;
};

export const useFetch = (url: string) => {
  const { data, error } = useSwr(url, fetcher)

  return {
    loading: !data && !error,
    data,
    error
  }
}