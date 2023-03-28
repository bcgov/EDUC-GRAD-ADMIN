<template>
  <div>
    <b-alert show variant="warning" v-if="docWarning || paperWarning"
      >Warning: You have selected a large volume of documents to be
      printed</b-alert
    >
    {{ details }} <br />
    {{ details.what != "REGALG" && details.what != "TVRRUN" }}
    <ul>
      <li v-if="typeLabel"><strong>Run Type: </strong>{{ typeLabel }}</li>
      <li v-if="details.copies">
        <strong>Copies: </strong>{{ details.copies }}
      </li>
      <li v-if="details.who">
        <strong>Group: </strong
        >{{ details.who == "District" ? "School Category" : details.who }}
      </li>
      <li v-if="details.credential">
        <strong>Credential Type: </strong>{{ details.credential }}
      </li>
      <ul>
        <li
          v-if="
            details.gradDate &&
            details.who != 'PSI' &&
            details.who != 'Student' &&
            details.who != 'District'
          "
        >
          <strong>Select Students: </strong>{{ details.gradDate }}
        </li>
        <li v-if="details.who == 'PSI'">
          <strong>PSI: </strong>
          <ul>
            <li
              class="list-item-comma"
              v-for="item in items.psi"
              :key="item.value"
            >
              {{ item.value }}
            </li>
          </ul>
        </li>
        <ul>
          <li v-if="details.gradDateFrom">
            <strong>Grad Start Date: </strong>{{ details.gradDateFrom }}
          </li>
          <li v-if="details.gradDateTo">
            <strong>Grad End Date: </strong>{{ details.gradDateTo }}
          </li>
        </ul>
        <li v-if="details.categoryCode">
          <strong>School Category: </strong>{{ details.categoryCode }}
        </li>
        <li v-if="details.psiTransmissionMode">
          <strong>Transmission Mode: </strong>{{ details.psiTransmissionMode }}
        </li>
        <li v-if="details.psiYear && details.who == 'PSI'">
          <strong>PSI Year: </strong>{{ details.psiYear }}
        </li>
      </ul>
      <li
        v-if="
          details.where && details.what != 'REGALG' && details.what != 'TVRRUN'
        "
      >
        <strong>Where: </strong>{{ details.where }}
      </li>
    </ul>
  </div>
</template>
<script>
import sharedMethods from "../../sharedMethods.js";
export default {
  components: {},
  data: function () {
    return {
      details: "",
      typeLabel: "",
      limitWarning: false,
      docWarning: false,
      paperWarning: false,
    };
  },
  mounted() {},
  created() {
    this.showNotification = sharedMethods.showNotification;
    if (this.items) {
      this.details = this.items.details;
    } else {
      this.details = "";
    }
    this.getBatchTypeLabel();
    this.checkRunData();
  },
  methods: {
    getBatchTypeLabel() {
      for (let x in this.batchTypes) {
        if (this.details.what == this.batchTypes[x].code) {
          this.typeLabel = this.batchTypes[x].label;
        }
      }
    },
    checkRunData() {
      if (
        this.items.districts.length > 1 ||
        this.items.schools.length > 1 ||
        this.items.programs.length > 1
      ) {
        this.limitWarning = true;
      } else {
        this.limitWarning = false;
      }
      if (
        (this.typeLabel == "User Request Distribution Run" ||
          this.typeLabel == "Distribution Run Year-End") &&
        (this.details.who == "School" ||
          this.details.who == "District" ||
          this.details.who == "Program")
      ) {
        this.docWarning = true;
      } else {
        this.docWarning = false;
      }
      if (
        this.typeLabel == "PSI Run FTP / Paper" &&
        this.details.psiTransmissionMode == "PAPER"
      ) {
        this.paperWarning = true;
      } else {
        this.paperWarning = false;
      }
    },
  },
  props: ["items", "batchTypes"],
  computed: {},
};
</script>
