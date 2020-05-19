<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    :items="items"
    item-key="id"
    show-select
    :options.sync="pagination"
    :server-items-length="totalItems"
    :loading="loading"
    :footer-props="{
      rowsPerPageText: '每页记录条数',
    }"
    class="elevation-1 my-table"
  >
    <template slot="headers" slot-scope="props">
      <tr>
        <th class="check-box">
          <v-checkbox
            :input-value="props.all"
            :indeterminate="props.indeterminate"
            primary
            hide-details
            @click.stop="toggleAll"
          ></v-checkbox>
        </th>
        <th
          v-for="header in props.headers"
          :key="header.text"
          :class="[
            'column',
            header.sortable ? 'sortable' : '',
            pagination.sortDesc ? 'desc' : 'asc',
            header.value === pagination.sortBy[0] ? 'active' : '',
          ]"
          @click="!header.sortable || changeSort(header.value)"
          :style="{ width: header.width }"
        >
          <v-icon small v-if="header.sortable">mdi-arrow_upward</v-icon>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <span v-on="on">{{ header.text }}</span>
            </template>
            <span>{{ header.tooltip || header.text }}</span>
          </v-tooltip>
        </th>
      </tr>
    </template>
    <v-progress-linear
      slot="progress"
      color="blue"
      indeterminate
    ></v-progress-linear>
    <template slot="items" slot-scope="props">
      <tr :active="props.selected">
        <td>
          <v-checkbox
            :input-value="props.selected"
            primary
            hide-details
            @click.stop="toggleItem(props)"
          ></v-checkbox>
        </td>
        <td v-if="actionColumn && actionColumnPosition === 'first'">
          <!-- <v-layout align-center justify-center row fill-height> -->
          <!-- <v-flex> -->
          <div class="action-column">
            <slot name="actions" :node="props.item"></slot>
          </div>

          <!-- </v-flex> -->
          <!-- </v-layout> -->
        </td>
        <td
          v-for="header in gridOptions.headers"
          :key="header.value"
          @click="props.expanded = !props.expanded"
        >
          {{ props.item[header.value] }}
        </td>
        <td v-if="actionColumn && actionColumnPosition === 'last'">
          <div class="action-column">
            <slot name="actions" :node="props.item"></slot>
          </div>
        </td>
      </tr>
    </template>
    <template slot="expand" slot-scope="props">
      <slot name="details" :node="props.item"></slot>
    </template>
    <template slot="pageText" slot-scope="props"
      >{{ props.pageStart }} - {{ props.pageStop }}条 共{{
        props.itemsLength
      }}条</template
    >
    <!-- <template slot="no-data">
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>-->
  </v-data-table>
</template>

<script>
import lodash from "lodash";
import objectEqual from "./utils/objectEqual";
const defaultGridOptions = {
  headers: [
    { text: "id", value: "id" },
    { text: "name", value: "name" },
  ],
  // itemKey: "id",
  // itemText: "name",
  // itemChildren: "children"
};

const defaultDataSourceOptions = {
  loadDataOnFirst: true,
  serviceInstance: null,
  serviceInstanceInputParameters: null,
  serviceInstanceOutputProcess: null,
};
const defaultPagination = {
  sortBy: ["id"],
  sortDesc: false,
  page: 1,
  itemsPerPage: 10,
};

function treeNodeFilter(array, text, children) {
  return array.filter(function iter(o) {
    var temp;
    if (o.name.match(text)) {
      return true;
    }
    if (!Array.isArray(o[children])) {
      return false;
    }
    temp = o[children].filter(iter);
    if (temp.length) {
      o[children] = temp;
      return true;
    }
  });
}
export default {
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      },
    },
    options: {
      type: Object,
      default: function() {
        return {
          dataSource: {},
          grid: {},
          pagination: {},
        };
      },
    },
    actionColumn: {
      type: Boolean,
      default: true,
    },
    actionColumnPosition: {
      type: String,
      default: "last",
    },
    actionColumnWidth: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      totalItems: 0,
      loading: true,
      dialog: false,
      items: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      gridOptions: Object.assign(
        {},
        defaultGridOptions,
        this.options.grid || {}
      ),
      dataSourceOptions: Object.assign(
        {},
        defaultDataSourceOptions,
        this.options.dataSource || {}
      ),
    };
  },

  computed: {
    pagination: {
      get: function() {
        return Object.assign(
          {},
          defaultPagination,
          this.options.pagination || {}
        );
      },
      set: function(val) {
        this.options.pagination = lodash.clone(val);
      },
    },
    selected: {
      get: function() {
        return this.value;
      },
      set: function(val) {
        this.$emit("input", val);
      },
    },
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    headers() {
      let headers = [...this.options.grid.headers];
      if (this.actionColumn) {
        let actionColumnContent = {
          text: "操作",
          align: "center",
          sortable: false,
          width: this.actionColumnWidth,
        };
        switch (this.actionColumnPosition) {
          case "first":
            headers.unshift(actionColumnContent);
            break;
          case "last":
            headers.push(actionColumnContent);
            break;
        }
      }
      return headers;
    },
  },

  watch: {
    value(value) {
      this.selected = value;
    },
    "options.grid": {
      handler(newValue, oldValue) {
        this.gridOptions = Object.assign({}, newValue, this.options.grid || {});
      },
      deep: true,
    },
    "options.dataSource": {
      handler(newValue, oldValue) {
        this.dataSourceOptions = Object.assign(
          {},
          newValue,
          this.options.dataSource || {}
        );
        this.bindGrid();
      },
      deep: true,
    },
    pagination: {
      handler(newValue, oldValue) {
        for (let attr of ["sortDesc", "page", "itemsPerPage", "sortBy"]) {
          if (
            oldValue[attr] !== undefined &&
            newValue[attr] !== oldValue[attr]
          ) {
            this.bindGrid();
            break;
          }
        }
      },
    },
  },

  created() {
    if (this.dataSourceOptions.loadDataOnFirst === true) {
      this.bindGrid();
    }
  },

  methods: {
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.items.slice();
    },
    toggleItem(data) {
      data.selected = !data.selected;
    },

    changeSort(column) {
      if (this.options.pagination.sortBy[0] === column) {
        this.options.pagination.sortDesc = !this.options.pagination.sortDesc;
      } else {
        this.options.pagination.sortBy[0] = column;
        this.options.pagination.sortDesc = false;
      }
    },
    async bindGrid() {
      this.loading = true;
      try {
        let data = await this.getDataPromise();
        this.items = data.data.items || [];
        this.totalItems = data.data.totalCount || 0;
      } catch (e) {
        await this.$message.alert({
          title: "出错了",
          msg: e,
        });
      } finally {
        this.loading = false;
      }
    },
    getDataPromise() {
      let self = this;
      let mDatasourceService = this.dataSourceOptions.serviceInstance;
      if (mDatasourceService == null) {
        return new Promise(function(resolve, reject) {
          resolve({
            data: self.outputProcess([]),
          });
        });
      }

      let mDatasourceRequestParameters = this.dataSourceOptions
        .serviceInstanceInputParameters;
      var iRequestData = {};
      if (mDatasourceRequestParameters != null) {
        if (
          typeof mDatasourceRequestParameters != "object" ||
          Array.isArray(mDatasourceRequestParameters)
        ) {
          iRequestData = mDatasourceRequestParameters;
        } else {
          var parameters = {};
          if (mDatasourceRequestParameters) {
            for (var i in mDatasourceRequestParameters) {
              if (
                Object.prototype.hasOwnProperty.call(
                  mDatasourceRequestParameters,
                  i
                )
              ) {
                //filter,只输出man的私有属性
                var source = mDatasourceRequestParameters[i];
                if (typeof source == "function") {
                  parameters[i] = mDatasourceRequestParameters[i]();
                } else {
                  parameters[i] = mDatasourceRequestParameters[i];
                }
              }
            }
          }
          const { sortBy, sortDesc, page, itemsPerPage } = this.pagination;
          iRequestData = {
            ...iRequestData,
            ...parameters,
            sortBy,
            sortDesc,
            page,
            itemsPerPage,
          };
        }
      }
      return new Promise(function(resolve, reject) {
        let _self = self;
        return mDatasourceService(iRequestData).then(
          function(result) {
            resolve({
              data: _self.outputProcess(result),
            });
          },
          function(error) {
            reject(error);
          }
        );
      });
    },
    outputProcess(data) {
      return this.dataSourceOptions.serviceInstanceOutputProcess
        ? this.dataSourceOptions.serviceInstanceOutputProcess(data)
        : data;
    },
    editItem(item) {
      // this.editedIndex = this.desserts.indexOf(item);
      // this.editedItem = Object.assign({}, item);
      // this.dialog = true;
    },

    deleteItem(item) {
      // const index = this.desserts.indexOf(item);
      // confirm("Are you sure you want to delete this item?") &&
      //   this.desserts.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      // if (this.editedIndex > -1) {
      //   Object.assign(this.desserts[this.editedIndex], this.editedItem);
      // } else {
      //   this.desserts.push(this.editedItem);
      // }
      // this.close();
    },
  },
};
</script>
<style lang="scss">
.my-table {
  table-layout: fixed;
  word-break: break-all;
  word-wrap: break-word;
  table {
    th,
    td {
      border-right-style: ridge;
      border-right-width: 1px;
    }
    th {
      background-color: #f3f3f3;
      font-weight: bold !important;
      border-right-color: white;
      &.check-box {
        width: 6em;
      }
    }
    td {
      border-right-color: whitesmoke;
    }
    th:last-child,
    td:last-child {
      border: none;
    }
  }
}
.action-column {
  min-width: 5rem;
}
</style>
