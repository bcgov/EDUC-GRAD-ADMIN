<template>
  <div class="programs-all">
    <h1>Programs</h1>

    <div>
      <b-card title="Program Management" no-body>
        <b-card-header header-tag="nav" class="px-3">
          <b-nav card-header tabs>
            <b-nav-item
              to="/programs/algorithm-rules"
              :active="tab === 1"
              @click="tab = 1"
              >Algorithm Rules</b-nav-item
            >
            <b-nav-item-dropdown
              id="programs-dropdown"
              text="Programs"
              ref="programs-dropdown"
              toggle-class="nav-link-programs"
              left
            >
              <b-nav-item
                to="/programs/programs"
                :active="tab === 2"
                @click="
                  tab = 2;
                  closeDropdown('programs-dropdown');
                "
                >Programs</b-nav-item
              >
              <b-nav-item
                to="/programs/program-rules"
                :active="tab === 2"
                @click="
                  tab = 2;
                  closeDropdown('programs-dropdown');
                "
                >Program Rules</b-nav-item
              >
              <b-nav-item
                to="/programs/transcript-message"
                :active="tab === 2"
                @click="
                  tab = 2;
                  closeDropdown('programs-dropdown');
                "
                >Transcript Messaging</b-nav-item
              >
            </b-nav-item-dropdown>

            <b-nav-item-dropdown
              id="optional-programs-dropdown"
              text="Optional Programs"
              toggle-class="nav-link-optional-programs"
              left
              ref="optional-programs-dropdown"
              active
            >
              <b-nav-item
                to="/programs/optional-programs"
                :active="tab === 3"
                @click="
                  tab = 3;
                  closeDropdown('optional-programs-dropdown');
                "
                >Optional Programs</b-nav-item
              >
              <b-nav-item
                to="/programs/optional-program-rules"
                :active="tab === 3"
                @click="
                  tab = 3;
                  closeDropdown('optional-programs-dropdown');
                "
                >Optional Program Rules</b-nav-item
              >
            </b-nav-item-dropdown>
            <b-nav-item
              to="/programs/letter-grades"
              :active="tab === 4"
              @click="tab = 4"
              >Letter Grades</b-nav-item
            >
            <b-nav-item
              to="/programs/special-cases"
              :active="tab === 5"
              @click="tab = 5"
              >Assessment Special Case Codes</b-nav-item
            >
            <b-nav-item
              to="/programs/requirement-types"
              :active="tab === 6"
              @click="tab = 6"
              >Requirement Type Code</b-nav-item
            >
          </b-nav>
        </b-card-header>
        <b-card-body>
          <b-card-text>
            <router-view v-bind:key="$route.fullPath"></router-view>
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "graduationPrograms",
  components: {},
  data() {
    return {
      tab: 1,
      show: false,
      opened: [],
      displayMessage: null,
    };
  },
  computed: {},
  created() {
    //Load student Data into studentInfo:
  },
  methods: {
    closeDropdown(dropdown) {
      this.$refs[dropdown].visible = false;
    },
  },
};
</script>

<style scoped>
.programs-all {
  padding-left: 25px;
  padding-right: 25px;
}
.close-record {
  float: right;
}
.tab-loading {
  color: green !important;
}
.profile-name {
  padding-bottom: 10px;
}

.nav-link-programs {
  color: blue;
}
.nav-item a {
  border-radius: 0px !important;
}
</style>
