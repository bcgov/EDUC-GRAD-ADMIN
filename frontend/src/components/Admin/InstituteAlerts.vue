<template>
  <div>
    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      :items-per-page-options="itemsPerPageOptions"
      :headers="alertHeaders"
      :items="instituteAlerts"
      :items-length="totalElements"
      :loading="loadingTable"
      item-value="id"
      @update:options="updateDataTable"
    >
      <template v-slot:item.createDate="{ item }">
        {{ $filters.formatTime(item.createDate) }}
      </template>

      <template v-slot:item.subject="{ item }">
        <a :href="getPassthroughURL(item)" target="_blank">{{
          getPassthroughURLText(item)
        }}</a
        >&nbsp;
        <i>{{ getInstituteEventLabel(item.event.eventType) }}</i>
      </template>

      <template v-slot:item.acknowledgeFlag="{ item }">
        <v-btn
          v-if="item.acknowledgeFlag == 'Y'"
          class="text-none pointer-events-none"
          icon="mdi-check-bold"
          color="success"
          density="comfortable"
        ></v-btn>
        <v-btn
          v-else
          class="text-none pointer-events-none"
          icon="mdi-minus-thick"
          color="primary"
          density="comfortable"
          disabled
        ></v-btn>
      </template>

      <template v-slot:item.updateUser="{ item }">
        {{ item.acknowledgeFlag == "Y" ? item.updateUser : "" }}
      </template>

      <template v-slot:item.updateDate="{ item }">
        {{
          item.acknowledgeFlag == "Y"
            ? $filters.formatTime(item.updateDate)
            : ""
        }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          v-if="item.acknowledgeFlag == 'Y'"
          class="text-none"
          color="error"
          density="comfortable"
          :disabled="!hasPermissions('ADMIN', 'updateInstituteEventMessaging')"
          @click="sendUserAcknowledge(item, 'N')"
          >Undo Acknowledge</v-btn
        >
        <v-btn
          v-else
          class="text-none"
          color="info"
          density="comfortable"
          :disabled="!hasPermissions('ADMIN', 'updateInstituteEventMessaging')"
          @click="sendUserAcknowledge(item, 'Y')"
          >Acknowledge</v-btn
        >
      </template>
    </v-data-table-server>
  </div>
</template>

<script>
import TRAXService from "../../services/TRAXService";
import { useSnackbarStore } from "@/store/modules/snackbar";

// I don't like how I'm getting the user's IDIR right now
import { useAppStore } from "@/store/modules/app";
import { useAuthStore } from "@/store/modules/auth";
import { useAccessStore } from "@/store/modules/access";
import { mapState } from "pinia";

export default {
  name: "InstituteAlerts",
  data() {
    return {
      appStore: useAppStore(),
      authStore: useAuthStore(),
      snackbarStore: useSnackbarStore(),
      currentPage: 1,
      itemsPerPage: 10,
      itemsPerPageOptions: [
        { title: "10", value: 10 },
        { title: "25", value: 25 },
        { title: "50", value: 50 },
        { title: "100", value: 100 },
      ],
      loadingTable: false,
      instituteAlerts: [],
      totalElements: 0,
      alertHeaders: [
        { key: "createDate", title: "Create Date", sortable: false },
        { key: "event.eventType", title: "Alert Event Type", sortable: false },
        { key: "subject", title: "Subject", sortable: false },
        { key: "acknowledgeFlag", title: "Acknowledge", sortable: false },
        { key: "updateUser", title: "IDIR", sortable: false },
        { key: "updateDate", title: "Acknowledge Date", sortable: false },
        { key: "actions", title: "Actions", sortable: false },
      ],
      // these should align with events defined in TRAX API:
      // https://github.com/bcgov/EDUC-GRAD-TRAX-API/blob/main/api/src/main/java/ca/bc/gov/educ/api/trax/constant/EventType.java
      instituteEvents: [
        { key: "UPDATE_SCHOOL", description: "Update School" },
        { key: "CREATE_SCHOOL", description: "New School" },
        { key: "UPDATE_DISTRICT", description: "Update District" },
        { key: "CREATE_DISTRICT", description: "Create District" },
        { key: "UPDATE_AUTHORITY", description: "Update Authority" },
        { key: "CREATE_AUTHORITY", description: "Create Authority" },
        { key: "GET_AUTHORITY", description: "Get Authority" },
        { key: "GET_PAGINATED_SCHOOLS", description: "Get Paginated Schools" },
        {
          key: "GET_PAGINATED_AUTHORITIES",
          description: "Get Paginated Authorities",
        },
        { key: "MOVE_SCHOOL", description: "Move School" },
        { key: "CREATE_SCHOOL_CONTACT", description: "Create School Contact" },
        { key: "UPDATE_SCHOOL_CONTACT", description: "Update School Contact" },
        { key: "DELETE_SCHOOL_CONTACT", description: "Delete School Contact" },
        {
          key: "CREATE_DISTRICT_CONTACT",
          description: "Create District Contact",
        },
        {
          key: "UPDATE_DISTRICT_CONTACT",
          description: "Update District Contact",
        },
        {
          key: "DELETE_DISTRICT_CONTACT",
          description: "Delete District Contact",
        },
        {
          key: "CREATE_AUTHORITY_CONTACT",
          description: "Create Authority Contact",
        },
        {
          key: "UPDATE_AUTHORITY_CONTACT",
          description: "Update Authority Contact",
        },
        {
          key: "DELETE_AUTHORITY_CONTACT",
          description: "Delete Authority Contact",
        },
      ],
    };
  },
  created() {
    //this.getInstituteAlerts(this.page, this.itemsPerPage);
  },
  computed: {
    ...mapState(useAuthStore, ["userInfoGet"]),
    ...mapState(useAccessStore, ["hasPermissions"]),
    ...mapState(useAppStore, {
      getDistrictById: "getDistrictById",
      getSchoolById: "getSchoolById",
    }),
  },
  methods: {
    //NOTE: Business does not need to see Institute updates, but it can be supported if that changes
    isDistrictActivity(activity) {
      return activity.event.eventType.includes("DISTRICT");
    },
    isSchoolActivity(activity) {
      return activity.event.eventType.includes("SCHOOL");
    },
    getInstituteEventLabel(key) {
      return this.instituteEvents.find((event) => key === event.key)
        ?.description;
    },
    getPassthroughURL(activity) {
      if (this.isDistrictActivity(activity)) {
        return `${
          this.appStore?.config?.STUDENT_ADMIN_URL
        }/api/auth/silent_idir_login?districtDetails=true&idir_guid=${this.authStore.userInfo.userGuid.toLowerCase()}&districtID=${activity.instituteId.toLowerCase()}`;
      } else if (this.isSchoolActivity(activity)) {
        return `${
          this.appStore?.config?.STUDENT_ADMIN_URL
        }/api/auth/silent_idir_login?schoolDetails=true&idir_guid=${this.authStore.userInfo.userGuid.toLowerCase()}&schoolID=${activity.instituteId.toLowerCase()}`;
      }
    },
    getPassthroughURLText(activity) {
      if (this.isDistrictActivity(activity)) {
        //get district info
        let district = this.getDistrictById(activity.instituteId);
        return `${district?.districtNumber} - ${district?.displayName}`;
      } else if (this.isSchoolActivity(activity)) {
        //get school info
        let school = this.getSchoolById(activity.instituteId);
        return `${school?.mincode} - ${school?.displayName}`;
      }
    },
    updateDataTable({ page }) {
      this.currentPage = page;
      this.getInstituteAlerts();
    },
    getInstituteAlerts: function () {
      this.loadingTable = true;
      let params = `pageNumber=${this.currentPage - 1}&pageSize=${
        this.itemsPerPage
      }`;
      // update to pass in page, itemsPerPage, and sortBy
      TRAXService.getInstituteEventHistory(params)
        .then((response) => {
          this.instituteAlerts = response.data.content;
          this.totalElements = response.data.totalElements;
        })
        .catch((error) => {
          this.errorMessage = error;
          this.snackbarStore.showSnackbar(error, "error", 5000);
        })
        .finally(() => {
          this.loadingTable = false;
        });
    },
    sendUserAcknowledge: function ({ id }, acknowledgeFlag) {
      const payload = {
        updateUser: this.userInfoGet.userName,
        id: id,
        acknowledgeFlag: acknowledgeFlag,
      };
      TRAXService.putInstituteEventHistory(payload)
        .then((response) => {
          this.getInstituteAlerts();
        })
        .catch((error) => {
          this.errorMessage = error;
          this.snackbarStore.showSnackbar(error, "error", 5000);
        });
    },
  },
};
</script>
