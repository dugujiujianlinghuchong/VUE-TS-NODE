<template>
  <div>
    <LazyLoad listType="all" />
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
export default class FormData extends Vue {}
</script>