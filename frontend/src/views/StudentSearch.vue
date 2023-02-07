<template>
  <div class="studentlist">
    <h1>Student search</h1>
    <p>
      Search by Personal Education Number(PEN) or use the advanced search to
      look up students by other criteria.
    </p>
    <div>
      <div>
        <b-card no-body class="p-0">
          <b-tabs card>
            <b-tab id="search-tab" title="PEN search" active>
              <b-card-text>
                <form v-on:submit.prevent>
                  <div class="form-group">
                    <!-- Pen Input -->
                    <div class="search w-100">
                      <label for="search-by-pen" class="float-left w-100"
                        >Search by PEN:</label
                      >
                      <b-form-input
                        id="search-by-pen"
                        type="search"
                        maxlength="9"
                        minlength="9"
                        v-model="penInput"
                        placeholder=""
                        ref="penSearch"
                        v-on:keyup="keyHandler"
                        tabindex="1"
                        class="w-50 float-left"
                        lazy
                        trim
                      >
                      </b-form-input>
                      <button
                        id="search-submit"
                        v-if="!searchLoading"
                        v-on:click="findStudentByPen"
                        class="btn btn-primary ml-2 float-left"
                      >
                        <i class="fas fa-search" aria-hidden="true"></i> Search
                      </button>
                      <button
                        id="search-submit"
                        v-if="searchLoading"
                        class="btn btn-success ml-2 float-left"
                      >
                        <i class="fas fa-search" aria-hidden="true"></i> Search
                      </button>
                      &nbsp;&nbsp;<b-spinner
                        v-if="searchLoading"
                        label="Loading"
                        >Loading</b-spinner
                      >
                    </div>
                    <div class="search-results-message my-4 float-left">
                      <strong
                        ><span
                          id="search-results-message"
                          v-if="searchByPenMessage"
                          >{{ searchByPenMessage }}</span
                        ></strong
                      >
                    </div>
                  </div>
                </form>
                <div v-if="isEnvLocalHost()" class="sample-pens m-3">
                  Samples: V0.1.2
                  {{ isEnvLocalHost() }}
                  <div class="row col-12">
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a00dfa87ff1'
                          )
                        "
                        >Student 1</a
                      >
                      1950 NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a0b1f6b7896'
                          )
                        "
                        >Student 2</a
                      >
                      1950 NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a0bd2497bc2'
                          )
                        "
                        >Student 3</a
                      >
                      1950 NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a06f60a6439'
                          )
                        "
                        >Student 4</a
                      >
                      1950 COMPLETED 2017/08/01
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a0b10330d76'
                          )
                        "
                        >Student 5</a
                      >
                      1950 COMPLETED 2019/05/01
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a06f60a6439'
                          )
                        "
                        >Student 6</a
                      >
                      1950 COMPLETED 2012/11/01
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a1baa405960'
                          )
                        "
                        >Student 7</a
                      >
                      2004-EN NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a41d6d647fa'
                          )
                        "
                        >Student 8</a
                      >
                      2004-EN NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a1b7186023a'
                          )
                        "
                        >Student 9</a
                      >
                      2004-EN COMPLETED 2021/02/01
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a1f51581eaa'
                          )
                        "
                        >Student 10</a
                      >
                      2004-PF COMPLETED 2015/06/01
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a2e514f0fcb'
                          )
                        "
                        >Student 11</a
                      >
                      2018-EN COMPLETED 2021/01/01
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a2e6d724185'
                          )
                        "
                        >Student 13</a
                      >
                      2018-EN COMPLETED 2020/11/01
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a2e3d7130cd'
                          )
                        "
                        >Student 14</a
                      >
                      2018-EN COMPLETED 2020/06/01
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a32b43b1cc5'
                          )
                        "
                        >Student 15</a
                      >
                      2018-EN NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a3003f356c5'
                          )
                        "
                        >Student 16</a
                      >
                      2018-EN NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a33cd244fad'
                          )
                        "
                        >Student 17</a
                      >
                      2018-EN NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a32cae02ba7'
                          )
                        "
                        >Student 18</a
                      >
                      2018-PF COMPLETED 2020/06/01
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a3288dc765f'
                          )
                        "
                        >Student 19</a
                      >
                      2018-PF COMPLETED 2020/05/01
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a3288e77b17'
                          )
                        "
                        >Student 20</a
                      >
                      2018-PF COMPLETED 2020/04/01
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a3288ef7ea2'
                          )
                        "
                        >Student 21</a
                      >
                      2018-PF NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a3004627073'
                          )
                        "
                        >Student 22</a
                      >
                      2018-PF NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a338168590c'
                          )
                        "
                        >Student 23</a
                      >
                      2018-PF NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-49ffe91c03e6'
                          )
                        "
                        >Student 24</a
                      >
                      1950 NOPROG AN NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a2e225977c8'
                          )
                        "
                        >Student 25</a
                      >
                      1950 NOPROG AN NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a19919c7262'
                          )
                        "
                        >Student 26</a
                      >
                      SCCP AD NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a1f06df5d06'
                          )
                        "
                        >Student 27</a
                      >
                      SCCP AD NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a335e95483b'
                          )
                        "
                        >Student 28</a
                      >
                      SCCP AD NOT COMPLETED
                    </div>
                    <div class="px-3 col-4">
                      <a
                        href="#"
                        v-on:click="
                          findStudentByStudentIdSample(
                            'ac339d70-7649-1a2e-8176-4a335e8e44ae'
                          )
                        "
                        >Student 29</a
                      >
                      SCCP AD NOT COMPLETED
                    </div>
                  </div>
                </div>
              </b-card-text>
            </b-tab>

            <b-tab id="advanced-search-tab" title="Advanced search">
              <b-card-text>
                <form v-on:submit.prevent>
                  <!-- advanced Search -->
                  <div class="advanced-search-form">
                    <div class="row my-3">
                      <div class="advanced-search-field col-12 col-md-2">
                        <label>Legal surname</label>
                        <div
                          href="#"
                          v-on:click="
                            advancedSearchInput.legalLastName.contains =
                              !advancedSearchInput.legalLastName.contains
                          "
                          v-bind:class="{
                            active: advancedSearchInput.legalLastName.contains,
                          }"
                          class="wild-card-button"
                          v-b-tooltip.hover
                          title="Legal surname starts with"
                        >
                          [.*]
                        </div>
                        <b-input
                          id="legal-surname-input"
                          class="form__input"
                          v-model="advancedSearchInput.legalLastName.value"
                          placeholder=""
                          v-on:keyup="keyHandler"
                          tabindex="1"
                        />
                      </div>
                      <div class="advanced-search-field col-12 col-md-2">
                        <label>Legal given</label>
                        <div
                          href="#"
                          v-on:click="
                            advancedSearchInput.legalFirstName.contains =
                              !advancedSearchInput.legalFirstName.contains
                          "
                          v-bind:class="{
                            active: advancedSearchInput.legalFirstName.contains,
                          }"
                          class="wild-card-button"
                          v-b-tooltip.hover
                          title="Legal given starts with"
                        >
                          [.*]
                        </div>
                        <b-input
                          id="legal-given-input"
                          v-model="advancedSearchInput.legalFirstName.value"
                          placeholder=""
                          v-on:keyup="keyHandler"
                          tabindex="2"
                        />
                      </div>

                      <div class="advanced-search-field col-12 col-md-2">
                        <label>Legal middle</label>
                        <div
                          href="#"
                          v-on:click="
                            advancedSearchInput.legalMiddleNames.contains =
                              !advancedSearchInput.legalMiddleNames.contains
                          "
                          v-bind:class="{
                            active:
                              advancedSearchInput.legalMiddleNames.contains,
                          }"
                          class="wild-card-button"
                          v-b-tooltip.hover
                          title="Legal middle starts with"
                        >
                          [.*]
                        </div>
                        <b-input
                          id="legal-middle-input"
                          v-model="advancedSearchInput.legalMiddleNames.value"
                          placeholder=""
                          v-on:keyup="keyHandler"
                          tabindex="3"
                        />
                      </div>
                      <div class="advanced-search-field col-12 col-md-2">
                        <label>Gender</label>
                        <b-form-select
                          id="gender-select"
                          v-model="advancedSearchInput.gender.value"
                          :options="genderOptions"
                          tabindex="4"
                        ></b-form-select>
                      </div>
                      <div
                        class="form-group advanced-search-field col-12 col-md-2"
                      >
                        <label for="datepicker-birthdate-from form__label"
                          >Birthdate from</label
                        >
                        <b-input-group class="mb-3">
                          <b-form-input
                            class="form__input"
                            id="datepicker-birthdate-from"
                            @input="$v.dateObject.$touch"
                            v-model="advancedSearchInput.birthdateFrom.value"
                            type="date"
                            placeholder="YYYY-MM-DD"
                            max="9999-12-30"
                            autocomplete="off"
                            tabindex="6"
                            v-on:keyup="keyHandler"
                          ></b-form-input>
                        </b-input-group>
                        <div class="error" v-if="!$v.dateObject.maxValue">
                          Birthdate from must not be greater than today.
                        </div>
                      </div>
                      <div class="advanced-search-field col-12 col-md-2">
                        <label for="datepicker-birthdate-to"
                          >Birthdate to</label
                        >
                        <b-input-group class="mb-3">
                          <b-form-input
                            id="datepicker-birthdate-to"
                            v-model="advancedSearchInput.birthdateTo.value"
                            type="date"
                            placeholder="YYYY-MM-DD"
                            max="9999-12-30"
                            :date-format-options="{ year: '4-digit' }"
                            autocomplete="off"
                            tabindex="6"
                            v-on:keyup="keyHandler"
                          ></b-form-input>
                        </b-input-group>
                      </div>
                    </div>
                    <div class="row">
                      <div class="advanced-search-field col-12 col-md-2">
                        <label>Usual surname</label>
                        <div
                          href="#"
                          v-on:click="
                            advancedSearchInput.usualLastName.contains =
                              !advancedSearchInput.usualLastName.contains
                          "
                          v-bind:class="{
                            active: advancedSearchInput.usualLastName.contains,
                          }"
                          class="wild-card-button"
                          v-b-tooltip.hover
                          title="Usual surname starts with"
                        >
                          [.*]
                        </div>
                        <b-input
                          id="usual-surname-input"
                          v-model="advancedSearchInput.usualLastName.value"
                          placeholder=""
                          v-on:keyup="keyHandler"
                          tabindex="7"
                        />
                      </div>
                      <div class="advanced-search-field col-12 col-md-2">
                        <label>Usual given</label>
                        <div
                          href="#"
                          v-on:click="
                            advancedSearchInput.usualFirstName.contains =
                              !advancedSearchInput.usualFirstName.contains
                          "
                          v-bind:class="{
                            active: advancedSearchInput.usualFirstName.contains,
                          }"
                          class="wild-card-button"
                          v-b-tooltip.hover
                          title="Usual given starts with"
                        >
                          [.*]
                        </div>
                        <b-input
                          id="usual-given-input"
                          v-model="advancedSearchInput.usualFirstName.value"
                          placeholder=""
                          v-on:keyup="keyHandler"
                          tabindex="8"
                        />
                      </div>
                      <div class="advanced-search-field col-12 col-md-2">
                        <label>Usual middle</label>
                        <div
                          href="#"
                          v-on:click="
                            advancedSearchInput.usualMiddleNames.contains =
                              !advancedSearchInput.usualMiddleNames.contains
                          "
                          v-bind:class="{
                            active:
                              advancedSearchInput.usualMiddleNames.contains,
                          }"
                          class="wild-card-button"
                          v-b-tooltip.hover
                          title="Usual middle starts with"
                        >
                          [.*]
                        </div>
                        <b-input
                          id="usual-middle-input"
                          v-model="advancedSearchInput.usualMiddleNames.value"
                          placeholder=""
                          v-on:keyup="keyHandler"
                          tabindex="9"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="advanced-search-button">
                        <button
                          id="adv-search-submit"
                          @click="findStudentsByAdvancedSearch()"
                          v-if="!advancedSearchLoading"
                          :class="
                            !this.$v.$invalid
                              ? 'btn btn-primary'
                              : 'btn btn-secondary'
                          "
                          tabindex="12"
                        >
                          Search
                        </button>
                        <button
                          id="adv-search-submit"
                          @click="findStudentsByAdvancedSearch()"
                          v-if="advancedSearchLoading"
                          class="btn btn-success"
                          tabindex="12"
                        >
                          Search
                        </button>
                        <button
                          id="adv-search-reset-button"
                          @click="clearInput"
                          class="btn btn-outline-primary mx-2"
                        >
                          Reset
                        </button>
                        &nbsp;&nbsp;<b-spinner
                          v-if="advancedSearchLoading"
                          label="Loading"
                          >Loading</b-spinner
                        >
                      </div>
                    </div>
                  </div>
                  <div v-if="studentSearchResults" class="row">
                    <div class="search-results-message my-4 col-12 col-md-8">
                      <strong
                        ><span
                          id="adv-search-results-message"
                          v-if="advancedSearchMessage"
                          >{{ advancedSearchMessage }}
                          {{ advancedSearchAPIMessage }}</span
                        ></strong
                      >
                    </div>
                    <div class="results-option-group col-12 col-md-4">
                      <label v-if="totalPages > 1">Results per page</label>
                      <b-form-select
                        class="results-option"
                        v-if="totalPages > 1"
                        @change="findStudentsByAdvancedSearch()"
                        v-model="resultsPerPage"
                        :options="resultsPerPageOptions"
                        :value="resultsPerPage"
                      ></b-form-select>
                    </div>
                  </div>
                </form>
                <transition name="fade">
                  <div v-if="studentSearchResults" class="table-responsive">
                    <DisplayTable
                      v-if="studentSearchResults.length"
                      v-bind:items="studentSearchResults"
                      title="Student search results"
                      v-bind:fields="studentSearchResultsFields"
                      id="pen"
                      v-bind:showFilter="false"
                      v-bind:pagination="true"
                    >
                      <template #cell(pen)="data">
                        <router-link
                          :to="'/student-profile/' + data.item.studentID"
                          >{{ data.item.pen }}</router-link
                        >
                      </template>
                      <template #cell(more)="row">
                        <b-btn
                          variant="outline primary"
                          style="color: #666"
                          size="sm"
                          @click="row.toggleDetails"
                          class="more-button w-100"
                        >
                          <img
                            v-show="!row.detailsShowing"
                            src="../assets/images/icon-right.svg"
                            width="9px"
                            aria-hidden="true"
                            alt=""
                          />
                          <img
                            v-show="row.detailsShowing"
                            src="../assets/images/icon-down.svg"
                            height="5px"
                            aria-hidden="true"
                            alt=""
                          />
                        </b-btn>
                      </template>
                      <template #row-details="row">
                        <b-card>
                          <ul>
                            <li>
                              <strong>Usual given:</strong>
                              {{ row.item.usualFirstName }}
                            </li>
                            <li>
                              <strong>Usual middle:</strong>
                              {{ row.item.usualMiddleNames }}
                            </li>
                            <li>
                              <strong>Usual surname:</strong>
                              {{ row.item.usualLastName }}
                            </li>
                          </ul>
                        </b-card>
                      </template>
                    </DisplayTable>
                  </div>
                </transition>
              </b-card-text>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import StudentService from "@/services/StudentService.js";
import DisplayTable from "@/components/DisplayTable";
import { maxValue } from "vuelidate/lib/validators";
import sharedMethods from "../sharedMethods";

export default {
  name: "studentSearch",
  data() {
    return {
      penSystemMessage: "",
      advancedSearchAPIMessage: "",
      studentHasProgram: true,
      resultsPerPageOptions: [
        { value: 10, text: "10" },
        { value: 25, text: "25" },
        { value: 50, text: "50" },
        { value: 100, text: "100" },
      ],
      genderOptions: [
        { value: "M", text: "Male (M)" },
        { value: "F", text: "Female (F)" },
        { value: "X", text: "Gender diverse (X)" },
        { value: "U", text: "Unknown (U)" },
      ],

      studentSearchResults: [],
      studentSearchResultsFields: [
        {
          key: "more",
          label: "",
          sortable: false,
          editable: false,
          class: "w-1",
        },
        {
          key: "pen",
          label: "PEN",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "legalLastName",
          label: "Legal surname",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "legalFirstName",
          label: "Legal given",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "legalMiddleNames",
          label: "Legal middle",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "dob",
          label: "Birthdate",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "genderCode",
          label: "Gender",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "program",
          label: "Program (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "studentGrade",
          label: "Student Grade (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecord",
          label: "School of Record (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordName",
          label: "School of Record name (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "studentStatus",
          label: "Student Status (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
        {
          key: "schoolOfRecordindependentAffiliation",
          label: "School independent affiliation (GRAD)",
          sortable: true,
          editable: false,
          class: "w-1",
        },
      ],
      totalElements: "",
      resultsPerPage: 25,
      totalPages: "",
      selectedPage: 1,
      searchByPenMessage: "",
      advancedSearchMessage: "",
      errorMessage: "",
      penInput: "",
      selectedPen: "",
      selectedId: "",
      variants: ["success"],
      searchLoading: false,
      advancedSearchLoading: false,
      showAdvancedSearchForm: false,
      advancedSearchInput: {
        legalFirstName: {
          value: "",
          contains: false,
        },
        legalLastName: {
          value: "",
          contains: false,
        },
        legalMiddleNames: {
          value: "",
          contains: false,
        },
        gender: {
          value: "",
          contains: false,
        },
        localId: {
          value: "",
          contains: false,
        },
        birthdateFrom: {
          value: "",
          contains: false,
          error: false,
        },
        birthdateTo: {
          value: "",
          contains: false,
        },
        usualFirstName: {
          value: "",
          contains: false,
        },
        usualLastName: {
          value: "",
          contains: false,
        },
        usualMiddleNames: {
          value: "",
          contains: false,
        },
      },
    };
  },
  validations: {
    dateObject: {
      maxValue: maxValue(new Date()),
    },
  },
  created() {
    this.showNotification = sharedMethods.showNotification;
    if (this.savedAdvSearchInput != "") {
      this.advancedSearchInput = this.savedAdvSearchInput;
      this.findStudentsByAdvancedSearch();
    }
  },
  components: {
    DisplayTable: DisplayTable,
  },
  computed: {
    dateObject() {
      let d = new Date(this.advancedSearchInput.birthdateFrom.value);
      return this.advancedSearchInput.birthdateFrom.value ? d : null;
    },
    ...mapGetters({
      savedAdvSearchInput: "getAdvancedSearchProps",
      profile: "student/getStudentProfile",
      courses: "student/getStudentCourses",
      exams: "student/getStudentExams",
      gradStatus: "student/getStudentGradStatus",
    }),
  },
  methods: {
    closeRecord: function () {
      this.$store.commit("student/unsetStudent");
    },
    keyHandler: function (e) {
      if (e.keyCode === 13) {
        //enter key pressed
        this.studentSearchResults = [];
        if (this.penInput) {
          this.findStudentByPen();
        } else if (this.surnameInput) {
          this.findStudentBySurname();
        }
      }
    },
    isEnvLocalHost() {
      return sharedMethods.isEnvLocalHost();
    },
    findStudentByStudentIdSample: function (studentId) {
      StudentService.getStudentPen(studentId)
        .then((response) => {
          this.penInput = response.data.pen;
          this.findStudentByPen();
        })
        .catch((error) => {
          if (error.response.status) {
            this.showNotification(
              "danger",
              "There was an error: " + error.response.status
            );
          }
        });
    },
    findStudentByPen: function () {
      if (this.penInput) {
        this.closeRecord();
        this.searchByPenMessage = "";
        this.searchLoading = true;
        this.studentSearchResults = [];
        StudentService.getStudentByPen(this.penInput)
          .then((response) => {
            if (response.data.length != 0) {
              var studentLastName = response.data[0].legalLastName;
              if (response.data[0].program == null || "") {
                this.studentHasProgram = false;
                this.searchByPenMessage =
                  "Student " +
                  studentLastName +
                  " has a PEN but does not have a GRAD system record. Use TRAX to conduct a PEN student inquiry.";
                this.searchLoading = false;
              } else {
                this.studentHasProgram = true;
                this.selectStudent(response.data);
              }
            } else {
              this.searchByPenMessage =
                "Student cannot be found on the GRAD or PEN database";
              this.searchLoading = false;
              //hides the Pen inqury message
              this.studentHasProgram = true;
            }
          })
          .catch((err) => {
            this.searchLoading = false;
            this.searchByPenMessage = "";
            this.showNotification("danger", err);
          });
        //pen input check
      }
    },
    findStudentsByAdvancedSearch: function () {
      this.advancedSearchMessage = "";
      this.message = "";
      this.errorMessage = "";
      this.$v.$touch();

      if (this.$v.$invalid) {
        this.advancedSearchMessage +=
          "Form Validation Error: please correct the form input";
      } else if (
        !this.$v.$invalid &&
        this.advancedSearchValidate(this.advancedSearchInput)
      ) {
        this.advancedSearchLoading = true;
        this.studentSearchResults = [];
        if (!this.advancedSearchInput.birthdateTo.value) {
          this.advancedSearchInput.birthdateTo.value =
            this.advancedSearchInput.birthdateFrom.value;
        }
        try {
          StudentService.getStudentsByAdvancedSearch(this.advancedSearchInput)
            .then((response) => {
              this.advancedSearchLoading = false;
              if (response.data) {
                this.searchResults = response.data;
                this.advancedSearchAPIMessage = response.data.searchMessage;
                this.studentSearchResults =
                  this.searchResults.gradSearchStudents;
                this.totalElements = this.studentSearchResults.length;
                this.totalPages = this.searchResults.totalPages;
                this.$store.dispatch(
                  "setAdvancedSearchProps",
                  this.advancedSearchInput
                );
                if (this.totalElements > 0) {
                  if (this.searchResults.totalElements == 1) {
                    this.advancedSearchMessage = "1 student record found. ";
                  } else {
                    this.advancedSearchMessage =
                      this.totalElements + " student records found. ";
                  }
                }
              } else {
                this.showNotification(
                  "warning",
                  "Please refine your search criteria"
                );
              }
            })
            .catch((err) => {
              this.advancedSearchLoading = false;
              this.advancedSearchMessage = "Student not found";
              this.errorMessage = err;
              this.showNotification(
                "danger",
                "There was an error with the web service."
              );
            });
        } catch (error) {
          this.advancedSearchLoading = false;
          this.advancedSearchMessage = "Advanced Search Error";
          this.showNotification(
            "danger",
            "There was an error with the web service."
          );
        }
      }
    },
    showAdvancedSearch: function () {
      this.showAdvancedSearchForm = true;
    },
    selectStudent: function (student) {
      this.selectedPen = student[0].pen;
      this.selectedId = student[0].studentID;
      this.$router.push({
        path: `/student-profile/${this.selectedId}`,
      });
    },

    clearInput: function () {
      this.penInput = "";
      this.studentSearchResults = "";
      for (const key in this.advancedSearchInput) {
        if (this.advancedSearchInput.hasOwnProperty(key)) {
          this.advancedSearchInput[key].value = "";
          this.advancedSearchInput[key].contains = false;
        }
      }
      this.advancedSearchInput.birthdateFrom.value = "";
      this.advancedSearchInput.birthdateTo.value = "";
    },
    advancedSearchValidate(obj) {
      //check if all inputs are empty
      let isValid = true;
      let isEmpty = true;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key].value != "") {
            isEmpty = false;
            if (key == "birthdateFrom") {
              let dateToCheck = Date.parse(obj[key].value);
              let today = new Date();
              if (dateToCheck > today) {
                this.advancedSearchMessage +=
                  "The Birthdate From must be greater than today. ";
                isValid = false;
              }
            }
          }
          //add wildcard to mincode if at least 3 digits are included
        } //mincode
      }

      if (isEmpty) {
        isValid = false;
        this.advancedSearchMessage += "Enter at least one field to search.";
      }

      return isValid;
    },
    isEmpty(obj) {
      let isEmpty = true;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] != "") {
            isEmpty = false;
          }
        }
      }
      return isEmpty;
    },
  },
};
</script>
<style scoped>
.studentlist {
  padding-left: 25px;
  padding-right: 25px;
}
.results-option-group {
  text-align: right;
  margin-top: 10px;
}
.results-option {
  width: 100px;
  margin-left: 10px;
}
.input-group-append {
  margin-left: -1px;
  position: absolute;
  right: 0;
  z-index: 99;
}
.alert,
.card,
.pen-search {
  width: 100%;
  margin-right: 9px;
  float: left;
}

h6 {
  font-size: 1.5rem;
}

.loading-spinner {
  float: left;
  margin-left: 10px;
}

.advanced-loading-spinner {
  margin-top: 32px;
}

.table-hover tbody tr:hover {
  background: #96c0e6;
}

.search {
  float: left;
}
div.error {
  position: absolute;
  top: 77px;
  font-size: 11px;
  color: #d93e45;
}
.sample-pens {
  float: left;
  clear: both;
  margin-top: 15px;
}
.search-results-message {
  float: left;
  clear: both;
}

.fade-enter-active {
  transition: opacity 0.8s;
}

.fade-enter,
  .fade-leave-to

  /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.table th {
  border-bottom: 2px solid #5475a7;
}

.advanced-search {
  float: left;
  clear: both;
}

.advanced-search-form {
  background-color: #fff;
}

.advanced-search-field {
  padding-right: 10px;
}

.advanced-search-field label {
  float: left;
  clear: both;
}

.advanced-search-field input {
  float: left;
  clear: both;
  padding-left: 10px;
  width: 100%;
}

.advanced-search-button {
  margin-top: 32px;
  padding-left: 15px;
}
.wild-card-button:hover {
  cursor: pointer;
}
.wild-card-button {
  color: #dee2eb;
  position: absolute;
  right: 21px;
  top: 40px;
  z-index: 10;
  text-decoration: none;
}

.wild-card-button:visited {
  color: #dee2eb;
  text-decoration: none;
}

.wild-card-button.active {
  color: green;
}
</style>
