<template>
  <v-container fluid>
    <!-- User Interface controls -->
    <v-row>
      <slot name="create"></slot>
      <v-row v-if="showFilter" id="filter">
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

      <v-data-table
        v-if="items && items.length"
        :headers="fields"
        :items="items"
        :item-value="id"
        :items-per-page="perPage"
        :search="filter"
        :show-expand="showExpand"
        :footer-props="{
          itemsPerPageOptions: [10, 20, 50, 100],
          showCurrentPage: true,
        }"
        :expanded="expanded"
        @update:page="currentPage = $event"
      >
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]="scope">
          <!-- Use the provided template for the specified slot name -->
          <slot :name="slotName" v-bind="scope" />
        </template>

        <template v-slot:item.delete="{ item }">
          <v-btn
            v-if="!disableDelete(item.columns)"
            variant="danger"
            size="sm"
            @click="openDeleteConfirmationDialog(item.columns)"
          >
            {{ this.delete.label ? this.delete.label : "Delete" }}
          </v-btn>
        </template>
      </v-data-table>
      <v-dialog v-model="deleteConfirmationDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete this item?
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="deleteItemAndCloseDialog">Yes</v-btn>
            <v-btn @click="closeDeleteConfirmationDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
    "sortDesc",
    "showxpand",
    "hideDefaultFooter",
  ],
  data() {
    return {
      deleteConfirmationDialog: false,
      itemToDelete: null,
      expanded: [],
      showExpand: false,
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
    // this.actionNames.forEach((actionName) => {
    //   this[actionName]();
    // });
  },
  methods: {
    disableDelete(item) {
      const { disable } = this.delete;

      if (disable && disable.condition && disable.criteria) {
        if (disable.condition === "AND") {
          return this.checkAllCriteria(item, disable.criteria);
        } else if (disable.condition === "OR") {
          return this.checkAnyCriterion(item, disable.criteria);
        }
      }

      return true; // Enable delete if no conditions are specified
    },

    checkAllCriteria(item, criteria) {
      for (const criterion of criteria) {
        if (!this.checkCriterion(item, criterion)) {
          return false; // Disable delete if any criterion is not met
        }
      }
      return true; // Enable delete if all criteria are met
    },
    checkAnyCriterion(item, criteria) {
      let disable = false;
      for (const criterion of criteria) {
        if (this.checkCriterion(item, criterion)) {
          disable = true; // Enable delete if any criterion is met
        }
      }
      return disable; // Disable delete if none of the criteria are met
    },
    checkCriterion(item, criterion) {
      const { field, value } = criterion;

      // Implement logic to check the criterion for the given item
      // For simplicity, assuming direct field comparison
      return item[field] === value;
    },
    deleteItem(item) {
      const itemRaw = toRaw(item);
      const store = this.stores[this.store];
      const itemId = itemRaw[this.id];
      if (store) {
        store[this.delete](itemId);
      } else {
        console.error("Store not found.");
      }
    },
    openDeleteConfirmationDialog(columns) {
      this.itemToDelete = columns;
      this.deleteConfirmationDialog = true;
    },
    closeDeleteConfirmationDialog() {
      this.deleteConfirmationDialog = false;
    },
    deleteItemAndCloseDialog() {
      // Call your deleteItem method here with this.itemToDelete
      this.deleteItem(this.itemToDelete);

      // Close the confirmation dialog
      this.closeDeleteConfirmationDialog();
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
.table-filter {
  /* position: absolute;
  top: -15px;
  right: 0; */
}
</style>
