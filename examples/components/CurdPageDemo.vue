<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Vue Curd Page Demo
        </h1>
      </v-col>
    </v-row>

    <configurable-component :options="configurableOptions">
      <template v-slot:default="{ options }">
        <curd-page :options="options"
          >Loading...
          <template v-slot:formFields="{ formFields }">
            <v-flex xs12 sm6 md4>
              <v-text-field
                :label="formFields[0].label"
                v-model="formFields[0].value"
                :rules="formFields[0].rule"
                :counter="10"
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-select
                :label="formFields[1].label"
                v-model="formFields[1].value"
                :items="formFields[1].options"
                item-text="value"
                item-value="key"
                returnObject
              ></v-select>
            </v-flex>
          </template>
        </curd-page>
      </template>
    </configurable-component>
  </v-container>
</template>

<script>
let curdPageOptions = {
  entryName: "我的客户",
  conditions: [
    {
      key: "name",
      label: "姓名",
      value: "",
      default: "",
      rule: [(v) => (v || "").length <= 10 || "姓名长度不能超过10"],
    },
    {
      key: "sex",
      label: "性别",
      value: "",
      default: "",
      options: [
        {
          key: "0",
          value: "男",
        },
        {
          key: "1",
          value: "女",
        },
      ],
    },
  ],
  fetchFunc: () => [],
  tableHeaders: [
    { text: "id", align: "center", value: "key" },
    { text: "姓名", align: "center", value: "content" },
    { text: "性别", align: "center", value: "content2" },
  ],
};

export default {
  name: "CurdPageDemo",
  data: () => ({
    configurableOptions: {
      data: curdPageOptions,
      style: {},
    },
  }),
  computed: {},
};
</script>
