<template>
  <v-container fluid>
    <!-- User Interface controls -->
    <v-row>
      <v-btn-toggle v-if="allowUpdateGradStatus && updateAllowed" class="float-left">
        <v-btn @click="addMode = !addMode" color="success" small>
          {{ addMode ? "Cancel" : "Add " + title }}
        </v-btn>
        <v-btn v-if="allowUpdateGradStatus && updateAllowed" @click="toggleQuickEdit" small>
          Edit
        </v-btn>
      </v-btn-toggle>

      <v-row v-if="showFilter">
        <v-col lg="8" class="px-0 float-left"></v-col>
        <v-col sm="12" lg="4" class="my-1 table-filter p-0">
          <v-row>
            <v-col cols="12">
              <v-form>
                <v-text-field
                  v-model="filter"
                  label="Filter"
                  debounce="500"
                  placeholder=""
                  append-icon="mdi-close"
                  @click:append="filter = ''"
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row v-if="addMode" class="card my-4">
        <v-card :title="'Add ' + title" class="mb-1 mt-1">
          <v-card-text>
            <!-- ... Add form fields here ... -->
            <v-btn @click="cancelAddItem" outlined color="primary" small class="float-left">
              Cancel
            </v-btn>
            <v-btn @click="addItem" color="success" small class="float-left">
              <v-icon>mdi-plus</v-icon> Add
            </v-btn>
          </v-card-text>
        </v-card>
      </v-row>

      <v-data-table
        v-if="items && items.length"
        :headers="fields"
        :items="items"
        :items-per-page="perPage"
        :search="filter"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :footer-props="{
          itemsPerPageOptions: [10, 20, 50, 100],
          showCurrentPage: true,
        }"
        @update:page="currentPage = $event"
      >
      <!-- <template
      v-for="field in editableFields"
      v-slot:[`cell(${field.key})`]="{ value, item }"
    >
      <b-input
        v-if="itemRow && itemRow[id] === item[id] && !deleteMode"
        v-on:keyup="validateInput"
        v-model="itemRow[field.key]"
        :type="field.type || 'text'"
        :key="field.key"
        :number="field.isNumber"
        style="height: auto; padding: 0px"
        class="pl-2"
      >
      </b-input> -->

      <!-- <template v-else-if="itemRow && itemRow[id] === item[id] && deleteMode"
        ><div :key="field.key">
          <del class="text-danger">{{ value }}</del>
        </div></template
      >
      <template v-else>
        <div
          v-if="quickEdit"
          class="px-2"
          @click="edit(item)"
          v-bind:key="field.key"
        >
          {{ value }}
        </div>
        <div v-if="!quickEdit" class="px-2" v-bind:key="field.key">
          {{ value }}
        </div></template
      >
    </template> -->

    <!-- <template v-slot:cell(actions)="{ item }">
      <b-button-group v-if="itemRow && itemRow[id] === item[id] && editMode">
        <b-btn
          style="width: 60px"
          variant="success"
          size="sm"
          @click="saveEdit"
        >
          Save
        </b-btn>
      </b-button-group>
    </template> -->

    <template v-for="(_, slotName) in $slots" v-slot:[slotName]="scope">
      <td>
        <!-- Use the provided template for the specified slot name -->
        <slot :name="slotName" v-bind="scope" />
      </td>
    </template>

    <!-- <template v-slot:cell(delete)="{ item }">
      <b-btn
        v-if="deleteMode && item[disableDeletefield] != disableDeleteIfValue"
        variant="danger"
        size="sm"
        @click="deleteItem(item)"
      >
        {{ deleteLabel ? deleteLabel : "Delete" }}
      </b-btn>
    </template> -->
      </v-data-table>

      <v-pagination
        v-model="currentPage"
        :length="Math.ceil(totalRows / perPage)"
        total-visible="7"
      ></v-pagination>
    </v-row>

    <v-dialog v-model="infoModal.show" max-width="600">
      <v-card>
        <v-card-title>{{ infoModal.title }}</v-card-title>
        <v-card-text>
          <pre>{{ infoModal.content }}</pre>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="resetInfoModal">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { toRaw } from "vue";
import { useAccessStore } from "../store/modules/access.js";
import { useAppStore } from "../store/modules/app.js";
import { useBatchProcessingStore } from "../store/modules/batchprocessing.js";
import { useStudentStore } from "../store/modules/student.js";
import { mapState } from "pinia";

export default {
  name: "DisplayTable",
  props: [
    "items",
    "totalitems",
    "title",
    "fields",
    "id",
    "create",
    "update",
    "delete",
    "store",
    "deleteLabel",
    "disableDeletefield",
    "disableDeleteIfValue",
    "slots",
    "showFilter",
    "pagination",
    "filterOn",
    "sortBy",
    "sortByField",
    "sortDesc",
  ],
  data() {
    return {
      actionNames: ["removeScheduledJobs"],
      responsive: true,
      quickEdit: false,
      isAdmin: false,
      updateAllowed: false,
      deleteAllowed: false,
      createAllowed: false,
      editMode: false,
      deleteMode: true,
      addMode: false,
      itemToAdd: [],
      showConfirm: false,
      checked: "false",
      itemRow: null,
      tableFields: "notloaded",
      editItem: "notloaded",
      currentPage: 1,
      perPage: 1000,
      striped: true,
      pageOptions: [
        10,
        20,
        50,
        {
          value: 100,
          text: "Show a lot",
        },
      ],
      sortDirection: "asc",
      filter: null,
      totalRows: 0,
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      stores: {
        batchprocessing: useBatchProcessingStore(),
        access: useAccessStore(),
        app: useAppStore(),
        student: useStudentStore(),
        // Add more stores here
      },
    };
  },
  computed: {
    ...mapState(useAccessStore, {
      allowUpdateGradStatus: "allowUpdateGradStatus",
    }),

    editableFields() {
      return this.fields.filter((field) => field.editable);
    },
    // totalRows: function () {
    //   if (this.items?.length) {
    //     return this.items.length;
    //   } else return this.totalRows;
    // },
    sortOptions() {
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return {
            text: f.label,
            value: f.key,
          };
        });
    },
  },
  created() {
    window.addEventListener("keyup", this.validateInput);
    if (this.pagination) {
      this.perPage = 25;
    }
    this.totalRows = this.items.length;
  },
  onBeforeMount() {
    // Now, you can use the mapped actions in the hook
    this.actionNames.forEach((actionName) => {
      this[actionName]();
    });
  },
  methods: {
    deleteItem(item) {
      const itemRaw = toRaw(item);
      const store = this.stores[this.store];
      const id = toRaw(item).id;
      if (store) {
        store[this.delete](id);
      } else {
        console.error("Store not found.");
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  
};
</script>

<style scoped>
/* Your scoped styles */
</style>