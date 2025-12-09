<script lang="ts">
  export let value: string = '';
  export let label: string | undefined = undefined;
  export let error: string | undefined = undefined;
  export let type: string = 'text';
  export let placeholder: string | undefined = undefined;

  $: inputClass = `px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
    error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-blue-500'
  }`;
</script>

<div class="flex flex-col gap-1">
  {#if label}
    <label class="text-sm font-medium text-gray-700">
      {label}
    </label>
  {/if}
  <input
    bind:value
    {type}
    {placeholder}
    class={inputClass}
    {...$$restProps}
  />
  {#if error}
    <span class="text-sm text-red-600">{error}</span>
  {/if}
</div>
