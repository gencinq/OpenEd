import { useState, useEffect, useCallback } from 'react';

export function useApi<T>(
  fetcher: (...args: any[]) => Promise<T>,
  immediate = true,
  ...initialParams: any[]
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(immediate);

  const execute = useCallback(
    async (...params: any[]) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetcher(...params);
        setData(result);
        setIsLoading(false);
        return result;
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        setIsLoading(false);
        throw err;
      }
    },
    [fetcher]
  );

  useEffect(() => {
    if (immediate) {
      execute(...initialParams);
    }
  }, [execute, immediate]);

  return {
    data,
    error,
    isLoading,
    execute,
    setData
  };
}
export default useApi;
