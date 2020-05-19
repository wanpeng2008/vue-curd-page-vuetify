<template>
  <v-container grid-list-md text-xs-center>
    <v-layout depressed row justify-center p-20>
      <search-panel
        ref="searchPanel"
        style="width: 100%"
        :conditions="conditions"
        @change="onConditionsChange"
      >
        <v-toolbar flat slot="header">
          <v-app-bar-nav-icon @click="onEditCode">
            <v-icon>mdi-cog</v-icon>
          </v-app-bar-nav-icon>
          <v-toolbar-title>{{ entryName }}列表</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon @click="doEntryAdd" v-on="on">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>新增{{ entryName }}项</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon @click="doEntryBatchDelete" v-on="on">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>批量删除{{ entryName }}</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon @click="doRefresh" v-on="on">
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>刷新</span>
          </v-tooltip>
        </v-toolbar>

        <v-container grid-list-md slot="form">
          <v-layout wrap>
            <slot name="formFields" v-bind:formFields="conditions"></slot>
          </v-layout>
        </v-container>
      </search-panel>
    </v-layout>

    <v-layout column justify-center mt-2>
      <curd-grid v-model="selected" :options="gridOptions" style="width: 100%">
        <template slot="actions" slot-scope="slotProps">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-2"
                @click="doEntryEdit(slotProps.node)"
                v-on="on"
                >mdi-edit</v-icon
              >
            </template>
            <span>修改{{ entryName }}项</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon
                small
                class="mr-2"
                @click="doEntryDelete(slotProps.node)"
                v-on="on"
                >mdi-delete</v-icon
              >
            </template>
            <span>删除{{ entryName }}项</span>
          </v-tooltip>
        </template>
        <template slot="details" slot-scope="slotProps">
          <entry-detail-panel :content="slotProps.node"></entry-detail-panel>
        </template>
      </curd-grid>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="entryEditFormVisible" persistent max-width="800px">
        <entry-edit-form
          ref="entryEditForm"
          @submit="closeEntryEditForm(true)"
          @cancel="closeEntryEditForm()"
        ></entry-edit-form>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import lodash from "lodash";
import SearchPanel from "./SearchPanelComponent";
import CurdGrid from "./CurdGridComponent";
import EntryEditForm from "./EntryEditForm";

function getEntrys(args) {
  return new Promise((resolve, reject) => {
    setTimeout(
      () =>
        resolve({
          items: [{ id: 1 }],
          totalCount: 1,
        }),
      1000
    );
  });
}
export default {
  name: "CurdPage",
  components: {
    SearchPanel,
    CurdGrid,
    EntryEditForm,
  },
  props: {
    options: {
      entryName: "",
      conditions: {
        type: Array,
        default: [],
      },
      fetchFunc: {
        type: Function,
        required: true,
      },
      tableHeaders: {
        type: Array,
        required: true,
      },
    },
  },
  data: function() {
    let headers = lodash.clone(this.options.tableHeaders);
    let conditions = lodash.clone(this.options.conditions);
    return {
      conditions,
      selected: [],
      entryEditFormVisible: false,
      searchParameters: {},
      gridOptions: {
        dataSource: {
          serviceInstance: getEntrys,
          serviceInstanceInputParameters: {},
        },
        grid: {
          headers,
        },
        pagination: {
          sortBy: ["displayOrder"],
        },
      },
      extendInfo: {},
    };
  },

  computed: {
    entryName() {
      let { entryName } = this.options;
      return entryName;
    },
    parentInfo() {
      let { id, name } = this.extendInfo;
      return { parentId: id, parentName: name };
    },
  },

  watch: {
    "extendInfo.id": {
      handler(val) {
        this.gridOptions.dataSource.serviceInstanceInputParameters.extendInfo = val;
      },
    },
  },

  created() {},

  methods: {
    onEditCode() {
      this.$parent.$emit("edit", true);
    },
    onConditionsChange(newConditions) {
      this.conditions = newConditions;
    },
    doSearch($event) {
      let searchParameters = $event || {};
      this.gridOptions.dataSource.serviceInstanceInputParameters = {
        extendInfo: this.extendInfo.id,
        ...searchParameters,
      };
    },
    doEntryAdd() {
      this.entryEditFormVisible = true;
      this.$nextTick(() => {
        this.$refs.entryEditForm.new({}, this.parentInfo);
      });
    },
    async doEntryBatchDelete() {},
    doRefresh() {
      let {
        extendInfo,
        ...searchParameters
      } = this.gridOptions.dataSource.serviceInstanceInputParameters;
      this.doSearch(searchParameters);
    },
    doEntryEdit(data) {},
    async doEntryDelete(data) {},
    closeEntryEditForm(needFresh) {
      this.entryEditFormVisible = false;
      if (needFresh) {
        this.doRefresh();
      }
    },
  },
};
</script>
