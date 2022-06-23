<template>
  
</template>
<script>
import { useSearchStore } from '../store'
import { contentSize } from './divice'

export default function useSizeSetup() {
  const searchStore = useSearchStore()
  
  return {
    searchStore,
    contentSize
  }
}
</script>