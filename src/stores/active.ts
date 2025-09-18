import { ref, type Ref, watch } from "vue";
import { defineStore } from "pinia";
import { useRoute, useRouter } from "vue-router";

export const useCounterStore = defineStore("counter", () => {
  const active: Ref<number> = ref(0);
  const addActive = (number: number) => {
    active.value = number;
  };

  const route = useRoute();
  const router = useRouter();

  watch(
    () => route.path,
    (newPath) => {
      if (newPath === "/attendance") {
        addActive(3);
      } else if (newPath === "/course") {
        addActive(2);
      } else if (newPath === "/group") {
        addActive(1);
      } else if (newPath === "/home") {
        addActive(0);
      } else if (newPath === "/payme") {
        addActive(4);
      } else if (newPath === "/") {
        router.push("/home"); 
      }
    },
    { immediate: true } 
  );

  return { active, addActive };
});
