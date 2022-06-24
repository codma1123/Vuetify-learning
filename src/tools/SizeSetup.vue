<template>
  
</template>
<script>
import { useSearchStore } from '../store'
import { contentSize, urlConfig } from './divice'
import funcs from './funcs'

export default function useSizeSetup() {
  const searchStore = useSearchStore()
  
  return {
    searchStore,
    contentSize,
    urlConfig,
    funcs
  }
}
</script>