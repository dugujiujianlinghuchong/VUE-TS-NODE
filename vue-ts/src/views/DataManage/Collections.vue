<template>
  <div>
    <LazyLoad listType="mycollection" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LazyLoad from "../../components/LazyLoad.vue";

@Component({
  components: {
    LazyLoad
  }
})
export default class Collections extends Vue {}
</script>