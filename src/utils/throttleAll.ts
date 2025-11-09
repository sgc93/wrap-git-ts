export async function throttleAll<T, R>(
  items: T[],
  limit: number,
  asyncFn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  let activeCount = 0;
  let currentIndex = 0;

  return new Promise((resolve, reject) => {
    const next = () => {
      if (currentIndex >= items.length && activeCount === 0) {
        return resolve(results);
      }

      while (activeCount < limit && currentIndex < items.length) {
        const i = currentIndex++;
        activeCount++;

        asyncFn(items[i], i)
          .then((res) => {
            results[i] = res;
          })
          .catch(reject)
          .finally(() => {
            activeCount--;
            next();
          });
      }
    };

    next();
  });
}
