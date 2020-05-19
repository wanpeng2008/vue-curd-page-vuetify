<template>
  <div>
    <v-tabs
      v-if="editing"
      :style="editorStyle"
      background-color="indigo"
      class="elevation-2"
      dark
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab :href="`#tab-data`">
        配置
      </v-tab>
      <v-tab :href="`#tab-style`">
        样式
      </v-tab>

      <v-tab-item value="tab-data">
        <v-card flat tile color="black">
          <codemirror v-model="data" :options="dataOptions" />
          <v-card-actions>
            <v-btn color="success" class="ma-2" outlined @click="onSave">
              <v-icon>mdi-content-save-cog</v-icon>保存
            </v-btn>
            <v-btn color="primary" class="ma-2" outlined @click="onCancel">
              <v-icon>mdi-close</v-icon>取消
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-tab-item>
      <v-tab-item value="tab-style">
        <v-card flat tile>
          <codemirror v-model="style" :options="styleOptions" />
        </v-card>
      </v-tab-item>
    </v-tabs>
    <slot ref="target" v-else v-bind:options="targetOptions"></slot>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import jsonFormat from "json-format";

// base style
import "codemirror/lib/codemirror.css";

// theme css
import "codemirror/theme/base16-dark.css";

// language
import "codemirror/mode/vue/vue.js";

// active-line.js
import "codemirror/addon/selection/active-line.js";

// styleSelectedText
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/search/searchcursor.js";

// highlightSelectionMatches
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";

// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/sublime.js";

// foldGutter
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";
import lodash from "lodash";
const JsonFormatConfig = {
  type: "space",
  size: 2,
};
function FuncStringfy(obj) {
  for (let key in obj) {
    if (typeof obj[key] == "function") {
      obj[key] = obj[key].toString();
    } else if (typeof obj[key] == "object") {
      FuncStringfy(obj[key]);
    }
  }
}
export default {
  name: "ConfigurableComponent",
  components: {
    codemirror,
  },
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  created() {
    ["data", "style"].forEach((key) => {
      if (key in this.options) {
        let option = lodash.clone(this.options[key]);
        FuncStringfy(option);
        this[key] = jsonFormat(this.options[key], JsonFormatConfig);
      }
    });
  },
  data: () => ({
    editing: false,
    data: "{}",
    style: "* {}",
    dataOptions: {
      tabSize: 4,
      mode: "application/json",
      theme: "base16-dark",
      lineNumbers: true,
      line: true,
      newlineAfterToken: function(type, content, textAfter, state) {
        // eslint-disable-next-line no-useless-escape
        return /^[\[,{]$/.test(content) || /^}/.test(textAfter);
      },
      // more CodeMirror options...
    },
    styleOptions: {
      tabSize: 4,
      mode: "text/css",
      theme: "base16-dark",
      lineNumbers: true,
      line: true,
      // more CodeMirror options...
    },
  }),
  mounted() {
    this.$on("edit", this.onEdit);
  },
  computed: {
    targetOptions() {
      return JSON.parse(this.data);
    },
    editorStyle() {
      // console.dir(this.$slots.default);
      // console.dir(this.$refs.target);
      // let [
      //   {
      //     elm: { offsetHeight: editorHeight, offsetWidth: editorWidth },
      //   },
      // ] = this.$slots.default;
      // return {
      //   "min-width": editorWidth + "px",
      //   "min-height": editorHeight + "px",
      //   "background-color": "grey",
      // };
      return {};
    },
  },
  methods: {
    onEdit() {
      this.editing = true;
    },
    onCancel() {
      this.editing = false;
    },
    onSave() {
      this.editing = false;
    },
  },
};
</script>

<style></style>
