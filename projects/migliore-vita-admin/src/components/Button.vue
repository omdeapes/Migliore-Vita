<template>
  <button class="btn" :class="[type, { 'full-width': fullWidth }]" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Button',
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: (value: string) => ['primary', 'secondary', 'accent', 'text'].includes(value),
    },
    fullWidth: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped>
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn.full-width {
  width: 100%;
}

.btn.primary {
  background-color: #2A5C8A;
  color: white;
}

.btn.primary:hover {
  background-color: #1a4a72;
}

.btn.secondary {
  background-color: #F5D76E;
  color: #1A1A1A;
}

.btn.secondary:hover {
  background-color: #e6c65a;
}

.btn.accent {
  background-color: #4ECDC4;
  color: white;
}

.btn.accent:hover {
  background-color: #3aa8a0;
}

.btn.text {
  background: none;
  color: #2A5C8A;
  padding: 0.5rem 0;
}

.btn.text:hover {
  text-decoration: underline;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>