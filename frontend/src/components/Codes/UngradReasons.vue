<template>
  <div>
    <p>When a User "ungrads" a student (security permissions needed), the User must select an "ungrad" reason.  The list of Ungrad Reasons a User can choose from are maintained in this table. </p>
  <DisplayTable
    title="Undo Completion Reasons"
    v-bind:items="ungradReasons"
    v-bind:fields="ungradReasonsFields"
    id=""
    showFilter="true"
  >
    <template #cell(effectiveDate)="row">
      {{ row.item.effectiveDate | formatSimpleDate }}
    </template>
    <template #cell(expiryDate)="row">
      {{ row.item.expiryDate | formatSimpleDate }}
    </template>              
  </DisplayTable>
  </div>
</template>

<script>
import {
  mapGetters
} from "vuex";
import DisplayTable from "@/components/DisplayTable";
import StudentService from "@/services/StudentService.js";


export default {
  name: 'UngradReasons',
  components: {
    DisplayTable: DisplayTable,
  },
  created() {
      StudentService.getUngradReasons(this.token)
      .then((response) => {
      
        this.ungradReasons = response.data;
      })
      // eslint-disable-next-line
      .catch((error) => {
        this.$bvToast.toast("ERROR " + error.response.statusText, {
          title: "ERROR" + error.response.status,
          variant: "danger",
          noAutoHide: true,
        });
      });
  },
  data: function() {
    return {
      ungradReasons: [],
      ungradReasonsFields: [
        {
          key: "code",
          label: "Code",
          sortable: true,
          sortDirection: "desc",
        },
        {
          key: "label",
          label: "Label",
          sortable: true,
        },
        {
          key: "description",
          label: "Description",
          sortable: true,
        },
        {
          key: "effectiveDate",
          label: "Effective date",
          sortable: true,
        },
        {
          key: "expiryDate",
          label: "Expiry date",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({  
      token: "getToken",
      role: "getRoles"
    }),
  },
  methods: {
  },
};
</script>

<style>
.table th, .table td{
  border-top: none !important;

}</style>
