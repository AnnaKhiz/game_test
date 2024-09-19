import { ref, watch } from 'vue';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const storedValue = localStorage.getItem(key);
  const value = ref<T>(storedValue ? JSON.parse(storedValue) : initialValue);

  watch(value, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });

  window.addEventListener('storage', (event) => {
    if (event.key === key) {
      value.value = event.newValue ? JSON.parse(event.newValue) : initialValue;
    }
  });

  return value;
}
