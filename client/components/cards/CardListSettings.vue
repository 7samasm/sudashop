<template>
  <v-row align="baseline">
    <v-col cols="6" sm="4" md="2" class="py-0">
      <v-select
        @change="selectDidChange"
        label="sort by"
        prependIcon="mdi-sort"
        color="purple"
        dense
        v-model="sort"
        :items="comboboxItems"
      >
        <template v-slot:item="{ item, on }">
          <v-list-item v-on="on" dense v-ripple="{ class: 'indigo--text' }">
            <v-list-item-content>
              <v-list-item-title class="caption font-weight-regular">{{
                item.text
              }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon :style="{ fontSize: '20px' }">{{ item.icon }}</v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-select>
    </v-col>

    <v-col cols="6" sm="4" md="2" class="py-0">
      <v-radio-group
        dense
        :column="false"
        v-model="order"
        :disabled="!params.sort"
        class="justtfiy-items-start"
        @change="doSort"
      >
        <v-radio color="pink" value="asc">
          <template v-slot:label>
            <v-icon color="grey">mdi-sort-descending</v-icon>
          </template>
        </v-radio>

        <v-radio color="pink" value="desc" class="mr-2" small>
          <template v-slot:label>
            <v-icon color="grey">mdi-sort-ascending</v-icon>
          </template>
        </v-radio>
      </v-radio-group>
    </v-col>

    <v-spacer class="hidden-sm-and-down" />
    <v-col class="hidden-sm-and-down">
      <span class="body-2 grey--text float-right mt-1"
        >{{ totalDocs }} items</span
      >
    </v-col>
  </v-row>
</template>
<script>
export default {
  props: ["cbPath", "totalDocs"],
  data() {
    return {
      sort: "",
      order: "",
      comboboxItems: [
        { text: "price", value: "price", icon: "mdi-sort-numeric-variant" },
        {
          text: "alphabet",
          value: "title",
          icon: "mdi-sort-alphabetical-variant",
        },
        { text: "date", value: "createdAt", icon: "mdi-alarm" },
      ],
    };
  },
  computed: {
    params() {
      return this.$route.params;
    },
  },
  methods: {
    doSort() {
      console.log(`%c ${this.sort.length}`, "color:red;");
      this.$router.push({
        name: this.cbPath.name,
        params: {
          ...this.cbPath.params,
          sort: this.sort.value || this.sort,
          order: this.order,
        },
      });
    },
    selectDidChange() {
      this.order = "asc";
      this.doSort();
    },
  },
  created() {
    this.sort = this.params.sort || "";
    this.order = this.params.order || "asc";
    console.log(`%c ${this.sort}`, "color:teal;");
  },
};
</script>

<style>
</style>
