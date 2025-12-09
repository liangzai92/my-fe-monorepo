<script setup lang="ts">
export interface InputProps {
  modelValue?: string;
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :class="[
        'px-3 py-2 border rounded focus:outline-none focus:ring-2',
        error
          ? 'border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:ring-blue-500',
      ]"
      @input="handleInput"
    />
    <span v-if="error" class="text-sm text-red-600">{{ error }}</span>
  </div>
</template>
