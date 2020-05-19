<template>
  <v-card>
    <v-toolbar dark color="primary">
      <v-toolbar-title>{{ formAction == 0 ? "新增" : "修改" }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="cancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" ref="editForm">
        <v-container>
          <v-layout row wrap>
            <!-- <v-flex xs12 md6 px-2>
              <dict-select-component
                v-model="model.mailType"
                :label="label.mailType"
                dictCategory="MAIL_TYPE"
                :rules="rules.mailType"
              >
              </dict-select-component>
            </v-flex> -->
            <v-flex xs12 md6 px-2>
              <v-text-field
                v-model="model.pickupOrgId"
                :rules="rules.pickupOrgId"
                :counter="8"
                :label="label.pickupOrgId"
                append-icon="mdi-close"
                @click:append="clearPickupOrgIdInput"
                required
              ></v-text-field>
            </v-flex>
            <!-- <v-flex xs12 md6 px-2>
              <cascade-picker-component
                :label="label.county"
                v-model="model.county"
                :rules="rules.county"
                rootCode="100000"
                :data="districts"
                :fixed="1"
                :titles="districtTitles"
              ></cascade-picker-component>
            </v-flex> -->
            <!-- <v-flex xs12 md6 px-2>
              <cascade-picker-component
                :label="label.destinationDivison"
                v-model="model.destinationDivison"
                :rules="rules.destinationDivison"
                rootCode="100000"
                :data="districts"
                :titles="districtTitles"
              ></cascade-picker-component>
            </v-flex> -->
            <!-- <v-flex xs12 md6 px-2>
              <dict-select-component
                v-model="model.batchNo"
                :label="label.batchNo"
                dictCategory="BATCH_NO"
                :rules="rules.batchNo"
                >>
              </dict-select-component>
            </v-flex> -->
            <v-flex xs12 md6 px-2>
              <v-text-field
                v-model="model.batchTimePoint"
                :rules="rules.batchTimePoint"
                :counter="4"
                :label="label.batchTimePoint"
                hint="请以HH:MM时间格式录入！"
                mask="time"
                append-icon="mdi-close"
                @click:append="clearBatchTimePointInput"
                required
              ></v-text-field>
            </v-flex>
            <!-- <v-flex xs12 md6 px-2>
              <dict-select-component
                v-model="model.timeLimit"
                :label="label.timeLimit"
                dictCategory="TIME_LIMIT"
                :rules="rules.timeLimit"
              >
              </dict-select-component>
            </v-flex> -->
            <v-flex xs12 md6 px-2>
              <v-text-field
                v-model="model.countyExchangeOrg"
                :rules="rules.countyExchangeOrg"
                :counter="8"
                :label="label.countyExchangeOrg"
                append-icon="mdi-close"
                @click:append="clearCountyExchangeOrgInput"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 md6 px-2>
              <v-text-field
                v-model="model.countyInTimepoint"
                :rules="rules.countyInTimepoint"
                :counter="4"
                :label="label.countyInTimepoint"
                hint="请以HH:MM时间格式录入！"
                mask="time"
                append-icon="mdi-close"
                @click:append="clearCountyInTimepointInput"
                required
              ></v-text-field>
            </v-flex>
            <!-- <v-flex xs12 md6 px-2>
              <dict-select-component
                v-model="model.sameDayFlag"
                :label="label.sameDayFlag"
                dictCategory="YES_OR_NO"
                :rules="rules.sameDayFlag"
              >
              </dict-select-component>
            </v-flex> -->
          </v-layout>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="success darken-1" class="white--text" @click="cancel">
        <v-icon>mdi-close</v-icon>取消
      </v-btn>
      <v-btn
        color="primary darken-1"
        class="white--text"
        :loading="saveInProcess"
        @click="dataFormSubmit"
      >
        <v-icon>mdi-content-save</v-icon>保存
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import lodash from "lodash";
// import DictSelectComponent from "@/components/DictSelectComponent";
// import { getCascadeDistricts } from "@/api/base/district";
// import {getCascadeOrganizations} from "@/api/base/organization";
// import CascadePickerComponent from "@/components/CascadePickerComponent";
// import {
//   saveOrgTime,
//   getOrgTime,
//   delOrgTime
// } from "@/api/mailMonitor/pickupOrgTime";

const defaultModel = {
  mailType: "",
  pickupOrgId: "",
  pickupDivison: "330000",
  destinationDivison: "100000",
  batchNo: "",
  batchTimePoint: "",
  timeLimit: "",
  countyExchangeOrg: "",
  countyInTimepoint: "",
  sameDayFlag: "",
};

export default {
  name: "EntryEditForm",
  components: {
    // DictSelectComponent,
    // CascadePickerComponent
  },
  data: (vm) => ({
    districtTitles: ["省级", "市级", "县级"],
    districts: {},
    valid: false,
    model: {},
    label: {
      county: "机构",
      pickupOrgId: "收寄机构代码",
      pickupDivison: "收寄区县",
      destinationDivison: "寄达区县",
      batchNo: "批次号",
      batchTimePoint: "频次时点",
      timeLimit: "计划妥投时限",
      countyExchangeOrg: "处理机构代码",
      countyInTimepoint: "出口区处理机构进口时间卡点",
      sameDayFlag: "进口时间与频次卡点是否同一天",
    },
    rules: {
      mailType: [(v) => !!v || "邮件类型不能为空"],
      pickupOrgId: [
        (v) => !!v || "收寄机构代码不能为空",
        (v) => (v || "").length <= 8 || "长度不能超过8个字符",
      ],
      pickupDivison: [(v) => !!v || "收寄区县不能为空"],
      destinationDivison: [(v) => !!v || "寄达区县不能为空"],
      batchNo: [(v) => !!v || "批次号不能为空"],
      batchTimePoint: [
        (v) => !!v || "频次时点不能为空",
        (v) => (v || "").length <= 4 || "长度不能超过4个字符",
      ],
      timeLimit: [(v) => !!v || "计划妥投时限不能为空"],
      countyExchangeOrg: [
        (v) => !!v || "县处理机构代码",
        (v) => (v || "").length <= 8 || "长度不能超过8个字符",
      ],
      countyInTimepoint: [
        (v) => !!v || "出口区县处理机构进口时间卡点不能为空",
        (v) => (v || "").length <= 4 || "长度不能超过4个字符",
      ],
    },
    formAction: 0, //0 add,//1,edit
    saveInProcess: false,
  }),

  created() {
    this.model = lodash.clone(defaultModel);
    // getCascadeDistricts().then(districts => (this.districts = districts));
    //  getCascadeOrganizations().then(
    //          organizations => (this.organizations = organizations)
    //  );
  },

  methods: {
    clearPickupOrgIdInput() {
      this.model.pickupOrgId = "";
    },
    clearBatchTimePointInput() {
      this.model.batchTimePoint = "";
    },
    clearCountyExchangeOrgInput() {
      this.model.countyExchangeOrg = "";
    },
    clearCountyInTimepointInput() {
      this.model.countyInTimepoint = "";
    },
    // new(model) {
    //   this.formAction = 0;
    //   if (model) {
    //     this.model = lodash.clone(model);
    //   }
    //   this.$nextTick(() => {
    //     this.$refs.editForm.reset();
    //   });
    // },
    new(model) {
      this.formAction = 0;
      this.$refs.editForm.reset();
      this.$nextTick(() => {
        this.model = lodash.clone(model ? model : defaultModel);
      });
    },
    async edit(model) {
      this.formAction = 1;
      // this.$refs.editForm.reset();
      // this.model = {};
      // 赋初值，提升用户体验
      this.updateModel(model);
      try {
        // this.updateModel(await getOrgTime(model.id));
      } catch (e) {
        console.error(e);
      }
    },
    updateModel(model) {
      // 强制刷新所有控件: 防止某些自定义控件v-model值不变，无法触发视图更新(视图已经被reset)
      // this.model = {};
      this.$nextTick(() => {
        this.model = lodash.clone(model);
      });
    },
    submit() {
      this.$emit("submit");
    },
    cancel() {
      this.$emit("cancel");
    },
    async dataFormSubmit() {
      // if (this.$refs["editForm"].validate()) {
      //   this.saveInProcess = true;
      //   try {
      //     let saved = await saveOrgTime({
      //       ...this.model
      //     });
      //     this.model.id = saved.id;
      //     this.formAction = 1;
      //     this.submit();
      //     await this.$message.info({
      //       msg: "保存成功"
      //     });
      //     this.$refs.editForm.reset();
      //     this.model = lodash.clone(defaultModel);
      //   } catch (e) {
      //     await this.$message.alert({
      //       title: "出错了",
      //       msg: "保存失败"
      //     });
      //   }
      //   this.saveInProcess = false;
      // } else {
      //   await this.$message.alert({
      //     title: "错误",
      //     msg: "系统输入验证失败！"
      //   });
      // }
    },
    async delete(model) {
      // let { id } = model;
      // let confirm = await this.$message.confirm({
      //   title: "删除记录",
      //   msg: `确认要删除${id}吗？`,
      //   noBtnText: "取消",
      //   yesBtnText: "确认"
      // });
      // if (confirm) {
      //   try {
      //     await delOrgTime(id);
      //     await this.$message.info({
      //       msg: `删除${name}成功`
      //     });
      //     this.submit();
      //   } catch (e) {
      //     this.$message.alert({
      //       title: "出错啦",
      //       msg: `删除${id}失败`,
      //       alertBtnText: "知道了"
      //     });
      //   }
      // }
    },
  },
};
</script>
