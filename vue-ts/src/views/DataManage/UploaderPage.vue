<template>
  <div>
    <LazyLoad listType="uploader" />
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
export default class UploaderPage extends Vue {}
</script>