<template>
  <b-container fluid class="m-0 p-0">
    <!-- User Interface controls -->
    <b-button-toolbar
      key-nav
      aria-label="Toolbar with button groups"
      class="float-left"
    >
      <b-button-group class="mx-1">
        <b-button
          v-if="allowUpdateGradStatus && updateAllowed"
          variant="success"
          size="sm"
          @click="addMode = !addMode"
          class="float-left"
          >{{ addMode ? "Cancel" : "Add " + title }}
        </b-button>
        <b-btn
          v-if="allowUpdateGradStatus && updateAllowed"
          v-bind:class="this.quickEdit ? 'btn-primary' : 'btn-primary'"
          size="sm"
          class="float-right"
          @click="toggleQuickEdit"
          >Edit</b-btn
        >
      </b-button-group>
    </b-button-toolbar>
    <b-row>
      <b-col lg="8" class="px-0 float-left"> </b-col>
      <b-col
        sm="12"
        lg="4"
        class="my-1 table-filter p-0"
        v-if="this.showFilter"
      >
        <b-form-group
          label-for="filter-input"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          class="mb-0 form-group-label"
        >
          <b-input-group>
            <div class="filter-icon p-2 text-secondary">Filter:</div>
            <b-form-input
              debounce="500"
              :id="
                'filter-input-' + title.replace(' ', 'import-').toLowerCase()
              "
              size="md"
              v-model="filter"
              type="search"
              placeholder=""
            ></b-form-input>
            <b-input-group-append>
              <b-button
                class=""
                size=""
                variant="primary"
                :disabled="!filter"
                @click="filter = ''"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row lg="12" v-if="addMode" class="card my-4">
      <b-card :title="'Add' + title" class="mb-1 mt-1">
        <b-card-text>
          <div
            v-for="field in this.fields"
            v-bind:key="field.key"
            class="col-6"
          >
            <div
              v-if="
                field.key != 'delete' &&
                field.key != 'actions' &&
                field.key != 'more' &&
                field.editable
              "
            >
              {{ field.label }}
              <b-input v-model="itemToAdd[field.key]"></b-input>
            </div>
          </div>
          <div class="col-12 my-3">
            <b-button-toolbar
              key-nav
              aria-label="Toolbar with button groups"
              class="float-left"
            >
              <b-button
                variant="outline-primary"
                size="sm"
                @click="cancelAddItem"
                class="float-left btn-outline-primary"
                >Cancel</b-button
              >
              <b-button
                variant="success"
                size="sm"
                @click="addItem"
                class="float-left"
                ><i class="fas fa-plus" aria-hidden="true"></i> Add</b-button
              >
            </b-button-toolbar>
          </div>
        </b-card-text>
      </b-card>
    </b-row>
    <b-table
      v-if="items && items.length"
      :responsive="responsive"
      :items="items"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filter-included-fields="filterOn"
      :sort-by="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      :sort-compare-options="{ numeric: true, sensitivity: 'base' }"
      stacked="sm"
      sticky-header
      show-empty
      striped
      hover
      small
      @filtered="onFiltered"
    >
      <template
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
        </b-input>

        <template v-else-if="itemRow && itemRow[id] === item[id] && deleteMode"
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
      </template>

      <template v-slot:cell(actions)="{ item }">
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
      </template>

      <template v-for="(_, slotName) of $scopedSlots" v-slot:[slotName]="scope">
        <slot :name="slotName" v-bind="scope" />
      </template>
      <template v-slot:cell(delete)="{ item }">
        <b-btn
          v-if="deleteMode && item[disableDeletefield] != disableDeleteIfValue"
          variant="danger"
          size="sm"
          @click="deleteItem(item)"
        >
          {{ deleteLabel ? deleteLabel : "Delete" }}
        </b-btn>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
      aria-controls="my-table"
    ></b-pagination>
    <b-modal
      :id="infoModal.id"
      :title="infoModal.title"
      ok-only
      @hide="resetInfoModal"
    >
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
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
  onMounted() {
    // Set the initial number of items
    this.totalRows = this.items.length;
  },
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
@media (min-width: 992px) {
  .col-lg-4.table-filter {
    position: absolute;
    right: 0;
    top: -60px;
  }
}

@media (max-width: 768px) {
  .col-lg-4.table-filter {
    position: relative;
  }
}

.clear-button {
  background: #38598a;
}
</style>
