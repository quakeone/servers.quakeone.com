<template lang="pug">
.connection {{connectionString}}
  FontAwesome.copy-icon(@click.prevent.stop="onCopy" :icon="['far', 'clone']"
  v-tippy='{ trigger : "click"}' content="Copied to clipboard")
  
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

function copyTextToClipboard(text: string) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if the element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a
  // flash, so some of these are just precautions. However in
  // Internet Explorer the element is visible whilst the popup
  // box asking the user for permission for the web page to
  // copy to the clipboard.
  //

  // Place in the top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = '0px';
  textArea.style.left = '0px';

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = '0px';

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of the white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    return document.execCommand('copy');
  } catch (err) {
    return false
  } finally {
    document.body.removeChild(textArea);
  }
}

export default defineComponent({
  props: {
    address: {
      type: String,
      required: true
    },
    port: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const connectionString = computed(() => `${props.address}:${props.port}`)
    return {
      connectionString,
      onCopy: () => {
        copyTextToClipboard(connectionString.value)
      }
    }
  },
})
</script>
<style lang="scss">
.copy-icon {
  font-size: .7rem;
  margin-left: .4rem;
  cursor: pointer;
}
</style>