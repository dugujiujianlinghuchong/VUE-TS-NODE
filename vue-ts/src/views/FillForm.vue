<template>
  <!-- 防止表单自动填充 -->
  <div class="hiddenInput">
    <input type="password" name="hidden1" />
    <input type="password" name="hidden2" />
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
export default class FillForm extends Vue{
  
}
</script>

<style lang="scss" scoped>
// .hiddenInput {
//   position: absolute;
//   z-index: -100000000;
//   padding-top: 1px;
//   padding-left: 2px;
//   input {
//     width: 10px;
//   }
// }
</style>