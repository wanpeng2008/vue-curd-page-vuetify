<template>
  <v-card>
    <slot name="header"></slot>
    <v-card-text>
      <v-container fluid grid-list-md style="padding: 0px">
        <v-layout row>
          <v-flex d-flex xs11 sm11 md11>
            <v-expand-transition>
              <v-layout column v-if="conditionsFormVisible">
                <v-form ref="conditionsForm" v-model="valid">
                  <slot name="form"></slot>
                </v-form>
                <v-spacer></v-spacer>
                <v-flex>
                  <v-layout justify-end>
                    <v-btn
                      color="success"
                      class="ma-2"
                      outlined
                      @click="doReset"
                    >
                      <v-icon>mdi-restore</v-icon>重置
                    </v-btn>
                    <v-btn
                      color="primary"
                      class="ma-2"
                      outlined
                      @click="doSearch"
                    >
                      <v-icon>mdi-magnify</v-icon>搜索
                    </v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-expand-transition>
            <v-expand-transition>
              <v-layout v-if="!conditionsFormVisible" row wrap justify-start>
                <div
                  v-if="!hasNonDefaultConditions"
                  class="title grey--text text--lighten-1 font-weight-light"
                  style="align-self: center;"
                  @click="conditionsFormVisible = !conditionsFormVisible"
                >
                  ...点击展开搜索面板
                </div>
                <template v-for="(condition, i) in conditions">
                  <v-chip
                    :key="i"
                    class="ma-2"
                    v-if="isNonDefaultCondition(condition)"
                    label
                    close
                    @click:close="resetCondtionByIndex(conditions, i)"
                    >{{ condition.label }} :
                    {{ getValue(condition.value) }}</v-chip
                  >
                </template>
              </v-layout>
            </v-expand-transition>
          </v-flex>
          <v-flex d-flex xs1 sm1 md1 align-start justify-end>
            <v-icon
              large
              @click="conditionsFormVisible = !conditionsFormVisible"
              >{{
                conditionsFormVisible
                  ? "mdi-unfold-less-horizontal"
                  : "mdi-unfold-more-horizontal"
              }}</v-icon
            >
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
import lodash from "lodash";
import objectEqual from "./utils/objectEqual";
const isNonDefaultCondition = (condition) =>
  condition.value !== condition.default;
const getDefaultCondition = (condition) => {
  let newCondition = lodash.clone(condition);
  newCondition.value = newCondition.default;
  return newCondition;
};
export default {
  name: "search-panel",
  components: {},
  model: {
    prop: "conditions",
    event: "change",
  },
  props: {
    conditions: {
      type: Array,
      default: function() {
        return [];
      },
    },
  },
  data() {
    return {
      conditionsFormVisible: false,
      valid: false,
    };
  },
  created() {
    // this.updateChips();
  },
  computed: {
    getValue() {
      return (val) => {
        if (typeof val === "object" && val) {
          return val.value;
        }
        return val;
      };
    },
    hasNonDefaultConditions() {
      return this.conditions.some(isNonDefaultCondition);
    },
    nonDefaultConditions() {
      return this.conditions.filter(isNonDefaultCondition);
    },
  },
  methods: {
    isNonDefaultCondition(condition) {
      return isNonDefaultCondition(condition);
    },
    updateChips() {
      for (let key in this.conditions) {
        this.chips[key] = !(
          objectEqual(
            this.conditions[key].value,
            this.conditions[key].default
          ) ||
          this.conditions[key].value == null ||
          this.conditions[key].value == undefined
        );
      }
    },
    close() {
      this.conditionsFormVisible = false;
    },
    doReset() {
      this.$refs.conditionsForm.reset();
      for (let key in this.conditions) {
        this.conditions[key].value = lodash.clone(this.conditions[key].default);
      }
    },
    doSearch() {
      if (this.$refs.conditionsForm && this.$refs.conditionsForm.validate()) {
        this.search();
        this.close();
      }
    },
    search() {
      this.conditions;
      let searchParameters = {};
      Object.keys(this.conditions)
        .filter(
          (key) =>
            this.conditions[key]["value"] !== undefined &&
            !lodash.isEmpty(this.conditions[key]["value"])
        )
        .forEach((key) => {
          searchParameters[key] =
            this.conditions[key]["value"]["key"] == undefined
              ? this.conditions[key]["value"]
              : this.conditions[key]["value"]["key"];
        });
      this.$emit("search", searchParameters);
    },
    removeChip(item) {
      item.value = item.default;
      this.search();
    },
    resetCondtionByIndex(conditions, index) {
      let newConditions = conditions.map((condition, i) =>
        index == i ? getDefaultCondition(condition) : condition
      );
      this.$emit("change", newConditions);
    },
  },
};
</script>
