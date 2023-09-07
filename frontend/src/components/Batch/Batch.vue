<template>
  <div>
    <b-alert :show="batchTypeDesc != ''" variant="info">
      {{ batchTypeDesc }}
    </b-alert>
    <b-overlay :show="processingBatch">
      <div class="row">
        <div class="col-12 col-md-3 border-right">
          <div class="m-0">
            <label class="font-weight-bold">Run Type</label>
            <b-form-select
              id="inline-form-select-type"
              class="mb-2 mr-sm-2 mb-sm-0"
              :options="batchTypes"
              value-field="code"
              text-field="label"
              :value="batch.details['what']"
              @change="editBatchJob('what', $event)"
            >
            </b-form-select>
          </div>
          <div class="mt-2" v-if="batch.details['what'] == 'DISTRUNUSER'">
            <label class="font-weight-bold">Credential Type</label>
            <b-form-select
              id="inline-form-select-audience"
              class="mb-2 mr-sm-2 mb-sm-0"
              :options="[
                { text: 'Choose...', value: '' },
                {
                  text: 'Blank certificate print',
                  value: 'Blank certificate print',
                },
                {
                  text: 'Reprint certificate – no principal signature block',
                  value: 'RC',
                },
                {
                  text: 'Original certificate (includes transcript) – with principal signature block',
                  value: 'OC',
                },
                {
                  text: 'Blank transcript print',
                  value: 'Blank transcript print',
                },
                { text: 'Transcript', value: 'OT' },
              ]"
              :value="batch.details['credential']"
              @change="editBatchJob('credential', $event)"
            ></b-form-select>
            <b-card
              v-if="batch.details['credential'] == 'Blank transcript print'"
              class="mt-3 px-0"
              header="Choose Transcript Type(s)"
            >
              <b-form-checkbox-group
                v-if="batch.details['credential'] != 'Blank transcript print'"
                multiple
                stacked
                :select-size="10"
                id="inline-form-select-audience"
                class="mb-2 mr-sm-2 mb-sm-0"
                :options="transcriptTypes"
                value-field="code"
                text-field="description"
                :value="batch.details['credentialDetails']"
                @change="editBatchJob('blankTranscriptDetails', $event)"
              ></b-form-checkbox-group>
              <b-form-checkbox-group
                v-if="batch.details['credential'] == 'Blank transcript print'"
                multiple
                stacked
                :select-size="10"
                id="inline-form-select-audience"
                class="mb-2 mr-sm-2 mb-sm-0"
                :options="blankTranscriptTypes"
                value-field="code"
                text-field="description"
                :value="batch.details['credentialDetails']"
                @change="editBatchJob('blankTranscriptDetails', $event)"
              ></b-form-checkbox-group>
            </b-card>
            <b-card
              v-if="batch.details['credential'] == 'Blank certificate print'"
              class="mt-3 px-0"
              header=""
            >
              <b-form-group
                label="Choose Certificate Type"
                v-slot="{ blankCertificateDetailsOptions }"
              >
                <b-form-checkbox-group
                  multiple
                  stacked
                  :select-size="10"
                  id="inline-form-select-audience"
                  class="mb-2 mr-sm-2 mb-sm-0"
                  value-field="code"
                  text-field="label"
                  name="blankCertificateDetailsOptions"
                  :options="certificateTypes"
                  :aria-describedby="blankCertificateDetailsOptions"
                  :value="batch.details['credentials']"
                  @change="editBatchJob('blankCertificateDetails', $event)"
                ></b-form-checkbox-group>
              </b-form-group>
            </b-card>
          </div>
        </div>
        <div class="col-12 col-md-9">
          <div
            class="p-0 mt-3"
            v-if="
              batch.details['what'] &&
              formElements[batch.details['what']] &&
              formElements[batch.details['what']].message
            "
          >
            <b-alert show variant="info">
              {{ formElements[batch.details["what"]].message }}
            </b-alert>
          </div>
          <div
            class="m-0 p-0 col-3"
            v-if="
              batch.details['what'] && formElements[batch.details['what']].group
            "
          >
            <label class="font-weight-bold pt-1">Group</label>
            <b-form-select
              id="inline-form-select-audience"
              class="mb-2 mr-sm-2 mb-sm-0"
              :options="groupFormValues(batch.details['what'])"
              :value="batch.details['who']"
              @change="editBatchJob('who', $event)"
            ></b-form-select>
          </div>

          <div
            v-if="
              batch.details['what'] != '' &&
              batch.details['who'] != 'Student' &&
              batch.details['what'] != 'DISTRUN' &&
              batch.details['what'] != 'DISTRUN_SUPP' &&
              batch.details['who'] != 'PSI' &&
              batch.details['credential'] != 'Blank transcript print' &&
              batch.details['credential'] != 'Blank certificate print'
            "
            class="p-0 mt-3"
          >
            <div
              class="p-0 mt-3 col-3"
              v-if="batch.details['who'] == 'District'"
            >
              <label class="font-weight-bold">Category</label>
              <b-form-select
                id="inline-form-select-type"
                class="col-12 my-2"
                :options="[
                  { text: 'Choose...', value: '' },
                  { text: '01 Public', value: '01' },
                  { text: '02 Independent', value: '02' },
                  { text: '03 Federally Operated Band School', value: '03' },
                  { text: '04 Yukon School', value: '04' },
                  { text: '09 Offshore', value: '09' },
                ]"
                :value="batch.districts['categoryCode']"
                @change="editBatchJob('categoryCode', $event)"
              ></b-form-select>
            </div>
            <div
              class="p-0 my-3 col-3"
              v-if="
                (batch.details['what'] != 'DISTRUN' &&
                batch.details['what'] != 'DISTRUN_SUPP') ||
                batch.details['categoryCode'] == '01'
              "
            >
              <label class="font-weight-bold p-0 m-0 row"
                >Select Students</label
              >
              <b-form-select
                id="inline-form-select-audience"
                class="mb-2 mr-sm-2 mb-sm-0 col-12"
                :options="[
                  { text: 'Current Students', value: 'Current Students' },
                  { text: 'Date Range', value: 'Date Range' },
                ]"
                :value="batch.details['gradDate']"
                @change="editBatchJob('gradDate', $event)"
              ></b-form-select>
            </div>
            <div
              class="date-ranges col-12 row"
              v-if="batch.details['gradDate'] == 'Date Range'"
            >
              <div class="float-left col-3 m-0 p-0">
                <strong><label class="pt-1">Grad Start Date</label></strong>
                <b-input-group class="mb-3">
                  <ValidationProvider
                    :rules="'validDate|lessthangraddateto:' + gradDateTo"
                    v-slot="{ errors }"
                  >
                    <b-form-input
                      id="gradDateFromInput"
                      v-model="gradDateFrom"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      autocomplete="off"
                      @input="editBatchJob('gradDateFrom', $event)"
                    ></b-form-input>
                    <ul
                      class="position-absolute form-validation-message text-danger"
                    >
                      <li v-for="error in errors" :key="error">{{ error }}</li>
                    </ul>
                  </ValidationProvider>
                  <b-input-group-append>
                    <b-form-datepicker
                      v-model="gradDateFrom"
                      button-only
                      right
                      locale="en-US"
                      @input="editBatchJob('gradDateFrom', $event)"
                    ></b-form-datepicker>
                  </b-input-group-append>
                </b-input-group>
              </div>

              <div class="float-left col-4">
                <strong><label class="pt-1">Grad End Date</label></strong>
                <b-input-group class="mb-3">
                  <ValidationProvider
                    :rules="'validDate|greaterthangraddateFrom:' + gradDateFrom"
                    v-slot="{ errors }"
                  >
                    <b-form-input
                      id="gradDateToInput"
                      v-model="gradDateTo"
                      type="text"
                      placeholder="YYYY-MM-DD"
                      autocomplete="off"
                      @input="editBatchJob('gradDateTo', $event)"
                    ></b-form-input>
                    <span
                      class="position-absolute form-validation-message text-danger"
                      >{{ errors[0] }}</span
                    >
                  </ValidationProvider>
                  <b-input-group-append>
                    <b-form-datepicker
                      v-model="gradDateTo"
                      button-only
                      right
                      locale="en-US"
                      aria-controls="example-input"
                      @input="editBatchJob('gradDateTo', $event)"
                    ></b-form-datepicker>
                  </b-input-group-append>
                </b-input-group>
              </div>
            </div>
          </div>
          <div
            class="p-0 mt-3 col-3"
            v-if="batch.details['what'] == 'DISTRUNUSER'"
          >
            <label class="font-weight-bold">Copies</label>
            <b-form-input
              type="number"
              id="inline-form-select-audience"
              class="mb-2 mr-sm-2 mb-sm-0"
              :value="1"
              @change="editBatchJob('copies', $event)"
            ></b-form-input>
          </div>
          <div
            class="mt-1 col-3 p-0"
            v-if="batch.details['what'] == 'DISTRUNUSER'"
          >
            <label class="font-weight-bold">Where</label>
            <b-form-select
              id="inline-form-select-type"
              class="mb-2 mr-sm-2 mb-sm-0"
              :value="batch.details['where']"
              :options="[
                { text: 'Download', value: 'localDownload' },
                'BC Mail',
                { text: 'User: ' + userFullName, value: 'User' },
              ]"
              :disabled="
                batch.details['who'] == 'Ministry of Advanced Education' ||
                batch.details['what'] == 'DISTRUN_YE' ||
                batch.details['what'] == 'DISTRUN' ||
                batch.details['what'] == 'DISTRUN_SUPP' ||
                batch.details['what'] == 'NONGRADRUN'
              "
              @change="editBatchJob('where', $event)"
            ></b-form-select>
          </div>
          <div v-if="batch.details['where'] == 'User'" class="pt-3">
            <b-card
              bg-variant="light"
              header="Mailing Address"
              class="overflow-hidden"
            >
              <b-card-text>
                <div>
                  Ministry of Education and Child Care<br />
                  Attn: {{ userFullName }}<br />
                  4TH FLOOR 620 SUPERIOR<br />
                  PO BOX 9886 STN PROV GOVT<br />
                  VICTORIA<br />
                  BC BRITISH COLUMBIA<br />
                  V8W9T6<br />
                </div>
              </b-card-text>
            </b-card>
          </div>

          <div
            v-if="
              batch.details['who'] == 'District' &&
              batch.details['what'] != 'DISTRUN_SUPP'
            "
            class="float-left col-12 px-0"
          >
            <div
              v-if="
                (batch.details['categoryCode'] != '01' &&
                  batch.details['what'] == 'DISTRUN_YE') ||
                (batch.details['categoryCode'] != '01' &&
                  batch.details['what'] == 'NONGRADRUN')
              "
            ></div>
            <b-card
              v-else
              class="mt-3 px-0"
              header="Include Geographic Districts"
            >
              <b-alert
                dismissible
                v-if="validationMessage"
                :show="validationMessage"
                variant="warning"
                >{{ validationMessage }}</b-alert
              >
              <b-form-checkbox
                v-if="
                  batch.details['what'] == 'DISTRUN_YE' ||
                  batch.details['what'] == 'DISTRUN_SUPP' ||
                  batch.details['what'] == 'NONGRADRUN'
                "
                name="allDistrict"
                :checked="batch.details['allDistricts']"
                @change="editBatchJob('allDistricts', $event)"
              >
                All Districts
              </b-form-checkbox>
              <div v-if="!batch.details['allDistricts']">
                <div class="row col-12">
                  <div class="col-2 p-2"><strong>District Number</strong></div>
                  <div class="col-4 p-2"><strong>District Name</strong></div>
                  <div class="col-4 p-2"><strong>Active Flag</strong></div>
                </div>
                <div
                  v-for="(district, index) in batch.districts"
                  :key="index"
                  class="row pl-3 mb-1"
                >
                  <div v-if="!district.districtName" class="row col-12">
                    <b-form-input
                      :disabled="
                        batch.details['categoryCode'] == '09' ||
                        batch.details['categoryCode'] == '04'
                      "
                      type="number"
                      v-model="district.value"
                      class="col-2"
                    />
                    <b-form-input
                      show="false"
                      disabled
                      v-model="district.districtName"
                      :ref="'districtName' + jobId + index"
                      class="col-4"
                    />
                    <b-form-input
                      show="false"
                      disabled
                      v-model="district.city"
                      :ref="'districtActiveFlag' + jobId + index"
                      class="col-4"
                    />
                    <div
                      v-if="index == batch.districts.length - 1"
                      class="col-2"
                    >
                      <b-button
                        :disabled="
                          batch.details['categoryCode'] == '09' ||
                          batch.details['categoryCode'] == '04'
                        "
                        class="btn btn-primary w-100"
                        @click="
                          addValueToTypeInBatchId(
                            jobId,
                            'districts',
                            district.value,
                            index
                          )
                        "
                      >
                        <b-spinner small v-if="validating"></b-spinner> Add
                      </b-button>
                    </div>
                  </div>
                  <div class="row col-12">
                    <div v-if="district.districtName" class="col-2">
                      {{ district.value }}
                    </div>
                    <div v-if="district.districtName" class="col-4">
                      {{ district.districtName }}
                    </div>
                    <div v-if="district.districtName" class="col-4">
                      {{ district.city }}
                    </div>

                    <div
                      v-if="index != batch.districts.length - 1"
                      class="col-2"
                    >
                      <b-button
                        :disabled="
                          batch.details['categoryCode'] == '09' ||
                          batch.details['categoryCode'] == '04'
                        "
                        class="btn btn-primary w-100"
                        @click="
                          deleteValueFromTypeInBatchId(
                            jobId,
                            'districts',
                            district.value
                          )
                        "
                      >
                        Remove
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
            </b-card>
          </div>
          <div
            v-if="batch.details['who'] == 'PSI'"
            class="float-left col-12 px-0"
          >
            <label class="font-weight-bold row mt-3 ml-0 px-0"
              >Transmission Mode</label
            >
            <b-form-select
              id="inline-form-select-type"
              class="col-3"
              :options="[
                { text: 'Choose...', value: '' },
                { text: 'Paper', value: 'PAPER' },
                { text: 'FTP', value: 'FTP' },
              ]"
              :value="batch.details['psiTransmissionMode']"
              @change="editBatchJob('psiTransmissionMode', $event)"
            ></b-form-select>
            <label class="font-weight-bold row mt-3 ml-0 px-0">PSI Year</label>
            <b-form-input
              type="number"
              :value="currentPSIYear"
              @change="editBatchJob('psiYear', $event)"
              class="col-2"
            />
            <b-card
              class="mt-3 px-0"
              header="Include Post Secondary Institutions"
            >
              <b-alert
                show
                dismissible
                v-if="validationMessage"
                variant="warning"
                >{{ validationMessage }}</b-alert
              >
              <b-form-checkbox
                name="allpsi"
                :checked="batch.details['allPsi']"
                @change="editBatchJob('allPsi', $event)"
              >
                All Post Secondary Institutes
              </b-form-checkbox>
              <div v-if="!batch.details['allPsi']">
                <div class="row col-12">
                  <div class="col-2 p-2"><strong>Code</strong></div>
                  <div class="col-4 p-2"><strong>Name</strong></div>
                </div>

                <div
                  v-for="(psi, index) in batch.psi"
                  :key="index"
                  class="row pl-3 mb-1"
                >
                  <div v-if="!psi.psiName" class="row col-12">
                    <b-form-input
                      type="text"
                      v-model="psi.value"
                      class="col-2"
                    />
                    <b-form-input
                      show="false"
                      disabled
                      v-model="psi.psiName"
                      :ref="'psiName' + jobId + index"
                      class="col-4"
                    />
                    <div v-if="index == batch.psi.length - 1" class="col-2">
                      <b-button
                        class="btn btn-primary w-100"
                        @click="
                          addValueToTypeInBatchId(
                            jobId,
                            'psi',
                            psi.value,
                            index
                          )
                        "
                      >
                        <b-spinner small v-if="validating"></b-spinner> Add
                      </b-button>
                    </div>
                  </div>
                  <div class="row col-12">
                    <div v-if="psi.psiName" class="col-2">{{ psi.value }}</div>
                    <div v-if="psi.psiName" class="col-4">
                      {{ psi.psiName }}
                    </div>

                    <div v-if="index != batch.psi.length - 1" class="col-2">
                      <b-button
                        class="btn btn-primary w-100"
                        @click="
                          deleteValueFromTypeInBatchId(jobId, 'psi', psi.value)
                        "
                      >
                        Remove
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
            </b-card>
          </div>

          <b-card
            v-if="batch.details['who'] == 'Student'"
            class="mt-3 px-0"
            header="Include Students"
          >
            <b-alert :show="validationMessage != ''" variant="warning">{{
              validationMessage
            }}</b-alert>

            <div class="row col-12 border-bottom mb-3">
              <div class="col-2"><strong>PEN</strong></div>
              <div class="col-3"><strong>Name</strong></div>
              <div class="col-1"><strong>Birthdate</strong></div>
              <div class="col-1"><strong>Status</strong></div>
              <div class="col-1"><strong>Program</strong></div>
              <div class="col-1"><strong>School of Record</strong></div>
              <div class="col-1"><strong>School at Grad</strong></div>
            </div>
            <div
              v-for="(pen, index) in batch.students"
              :key="index"
              class="row pl-3 mb-1"
            >
              <div v-if="!pen.dob" class="row col-12">
                <b-form-input type="number" v-model="pen.value" class="col-2" />
                <b-form-input
                  show="false"
                  disabled
                  v-model="pen.name"
                  :ref="'pen' + jobId + index"
                  class="col-3"
                />
                <b-form-input
                  show="false"
                  disabled
                  v-model="pen.dob"
                  :ref="'dob' + jobId + index"
                  class="col-1"
                />
                <b-form-input
                  show="false"
                  disabled
                  v-model="pen.studentStatus"
                  :ref="'student-status' + jobId + index"
                  class="col-1"
                />
                <b-form-input
                  show="false"
                  disabled
                  v-model="pen.program"
                  :ref="'program' + jobId + index"
                  class="col-1"
                />
                <b-form-input
                  show="false"
                  disabled
                  v-model="pen.schoolOfRecord"
                  :ref="'schoolOfRecord' + jobId + index"
                  class="col-1"
                />
                <b-form-input
                  show="false"
                  disabled
                  v-model="pen.schoolAtGraduation"
                  :ref="'schoolAtGraduation' + jobId + index"
                  class="col-1"
                />

                <div v-if="index == batch.students.length - 1" class="col-2">
                  <b-button
                    class="btn btn-primary w-100"
                    @click="
                      addValueToTypeInBatchId(
                        jobId,
                        'students',
                        pen.value,
                        index
                      )
                    "
                  >
                    <b-spinner small v-if="validating"></b-spinner> Add
                  </b-button>
                </div>
              </div>
              <div class="row col-12">
                <div v-if="pen.dob" class="col-2">{{ pen.value }}</div>
                <div v-if="pen.dob" class="col-3">{{ pen.name }}</div>
                <div v-if="pen.dob" class="col-1">{{ pen.dob }}</div>
                <div v-if="pen.dob" class="col-1">{{ pen.studentStatus }}</div>
                <div v-if="pen.dob" class="col-1">{{ pen.program }}</div>
                <div v-if="pen.dob" class="col-1">{{ pen.schoolOfRecord }}</div>
                <div v-if="pen.dob" class="col-1">
                  {{ pen.schoolAtGraduation }}
                </div>

                <div v-if="index != batch.students.length - 1" class="col-2">
                  <b-button
                    class="btn btn-primary w-100"
                    @click="
                      deleteValueFromTypeInBatchId(jobId, 'students', pen.value)
                    "
                  >
                    Remove
                  </b-button>
                </div>
              </div>
            </div>
          </b-card>
          <b-card
            v-if="batch.details['who'] == 'School'"
            class="mt-3 px-0"
            header="Include Schools"
          >
            <b-alert
              dismissible
              v-if="validationMessage"
              :show="validationMessage"
              variant="warning"
              >{{ validationMessage }}</b-alert
            >
            <div class="row col-12 border-bottom mb-3">
              <div class="col-2"><strong>Mincode</strong></div>
              <div class="col-4"><strong>School Name</strong></div>
              <div class="col-1 p-2">
                <strong>Transcript Eligibility</strong>
              </div>
              <div class="col-1 p-2">
                <strong>Certificate Eligibility</strong>
              </div>
              <div class="col-1 p-2"><strong>School Category</strong></div>
              <div class="col-1 p-2"><strong>TRAX reporting</strong></div>
            </div>

            <div v-for="(school, index) in batch.schools" :key="index" class="">
              <div v-if="!school.schoolName" class="mb-3">
                <ValidationObserver v-slot="{ passes, invalid }">
                  <form
                    @submit.prevent="
                      passes(
                        addValueToTypeInBatchId(
                          jobId,
                          'schools',
                          school.value,
                          index
                        )
                      )
                    "
                    class="row col-12"
                  >
                    <div class="col-2 p-0 m-0">
                      <ValidationProvider
                        name="Mincode"
                        :rules="
                          'mincodelength|validateschool:' +
                          jobId +
                          ',' +
                          index +
                          ',' +
                          batch.details['credential']
                        "
                        v-slot="{ errors }"
                      >
                        <b-form-input type="number" v-model="school.value" />
                        <span
                          class="position-absolute w-100 form-validation-message text-danger"
                          >{{ errors[0] }}</span
                        >
                      </ValidationProvider>
                    </div>
                    <b-form-input
                      show="false"
                      disabled
                      v-model="school.schoolName"
                      :ref="'schoolName' + jobId + index"
                      class="col-4"
                    />
                    <b-form-input
                      show="false"
                      disabled
                      v-model="school.transcriptEligibility"
                      :ref="'transcriptEligibility' + jobId + index"
                      class="col-1"
                    />
                    <b-form-input
                      show="false"
                      disabled
                      v-model="school.certificateEligibility"
                      :ref="'certificateEligibility' + jobId + index"
                      class="col-1"
                    />
                    <b-form-input
                      show="false"
                      disabled
                      v-model="school.schoolCategory"
                      :ref="'schoolCategory' + jobId + index"
                      class="col-1"
                    />
                    <b-form-input
                      show="false"
                      disabled
                      v-model="school.reportingFlag"
                      :ref="'reportingFlag' + jobId + index"
                      class="col-1"
                    />
                    <div v-if="index == batch.schools.length - 1" class="col-2">
                      <button :disabled="invalid" class="btn btn-primary w-100">
                        <b-spinner small v-if="validating"></b-spinner> Add
                      </button>
                    </div>
                  </form>
                </ValidationObserver>
              </div>
              <div class="row col-12 mb-2">
                <div v-if="school.schoolName" class="col-2">
                  {{ school.value }}
                </div>
                <div v-if="school.schoolName" class="col-4">
                  {{ school.schoolName }}
                </div>
                <div v-if="school.schoolName" class="col-1">
                  {{ school.transcriptEligibility }}
                </div>
                <div v-if="school.schoolName" class="col-1">
                  {{ school.certificateEligibility }}
                </div>
                <div v-if="school.schoolName" class="col-1">
                  {{ school.schoolCategory }}
                </div>
                <div v-if="school.schoolName" class="col-1">
                  {{ school.reportingFlag }}
                </div>

                <div v-if="index != batch.schools.length - 1" class="col-2">
                  <b-button
                    class="btn btn-primary w-100"
                    @click="
                      deleteValueFromTypeInBatchId(
                        jobId,
                        'schools',
                        school.value
                      )
                    "
                  >
                    Remove
                  </b-button>
                </div>
              </div>
            </div>
          </b-card>
          <b-card
            v-if="batch.details['who'] == 'Program'"
            class="mt-3 px-0"
            header="Include Programs"
          >
            <b-alert v-if="validationMessage" show variant="warning">{{
              validationMessage
            }}</b-alert>
            <b-alert
              dismissible
              v-if="validationMessage"
              :show="validationMessage"
              variant="warning"
              >{{ validationMessage }}</b-alert
            >
            <div class="row col-12 border-bottom mb-3">
              <div class="col-2"><strong>Program</strong></div>
            </div>
            <div
              v-for="(program, index) in batch.programs"
              :key="index"
              class="row pl-3 mb-1"
            >
              <div v-if="!program.value" class="row col-12">
                <b-form-select
                  id="inline-form-select-type"
                  class="col-2"
                  :options="programOptions"
                  value-field="programCode"
                  text-field="programCode"
                  v-model="program.value"
                ></b-form-select>
                <div v-if="index == batch.programs.length - 1" class="col-2">
                  <b-button
                    :disabled="validating"
                    class="btn btn-primary w-100"
                    @click="
                      addValueToTypeInBatchId(
                        jobId,
                        'programs',
                        program.value,
                        index
                      )
                    "
                  >
                    <b-spinner small v-if="validating"></b-spinner> Add
                  </b-button>
                </div>
              </div>
              <div class="row col-12">
                <div v-if="program.value" class="col-2">
                  {{ program.value }}
                </div>
                <div v-if="program.programName" class="col-3">
                  {{ program.programName }}
                </div>
                <div v-if="program.districtName" class="col-2">
                  {{ program.districtName }}
                </div>
                <div v-if="program.address" class="col-3">
                  {{ program.address }}
                </div>

                <div v-if="index != batch.programs.length - 1" class="col-2">
                  <b-button
                    class="btn btn-primary w-100 w-100"
                    @click="
                      deleteValueFromTypeInBatchId(
                        jobId,
                        'programs',
                        program.value
                      )
                    "
                  >
                    Remove
                  </b-button>
                </div>
              </div>
            </div>
          </b-card>
        </div>
      </div>
      <div class="my-2">
        <!-- Batch control buttons -->
        <b-button
          size="sm"
          variant="danger"
          class="btn btn-danger float-right col-2 p-2"
          @click="cancelBatchJob(jobId)"
        >
          Cancel
        </b-button>
        <b-button
          v-if="batch.details['where'] == 'localDownload'"
          @click="runBatch(jobId)"
          size="sm"
          variant="primary"
          class="btn btn-primary w-100 float-right col-2 p-2"
          :disabled="batch.details['who'] == '' || batch.details['who'] == null"
        >
          Download
        </b-button>
        <b-button
          v-else
          v-b-modal="'batch-modal-' + jobId"
          size="sm"
          variant="primary"
          :disabled="!batchIsValid"
          class="btn btn-primary w-100 float-right col-2 p-2"
        >
          Schedule/Run Batch
        </b-button>
        <!-- Modal Dialogs -->
        <b-modal
          :id="'batch-modal-' + jobId"
          :title="'Run  Request ' + requestId"
          @show="resetModal"
          @hidden="resetModal"
          ok-title="Confirm"
          :ok-disabled="disableConfirm()"
          @ok="runBatch(jobId)"
        >
          <BatchConfirmInfo
            :items="batch"
            :batchTypes="batchTypes"
          ></BatchConfirmInfo>
          <b-form-group label="Batch Run" v-slot="{ ariaDescribedby }">
            <b-form-radio-group v-model="batchRunTime">
              <b-form-radio
                :aria-describedby="ariaDescribedby"
                name="batch-runtime-options"
                value="Run Now"
                >Run Now</b-form-radio
              >
              <b-form-radio
                :aria-describedby="ariaDescribedby"
                name="batch-runtime-options"
                value="Run Later"
                >Run Later</b-form-radio
              >
            </b-form-radio-group>
            <b-form-group
              v-if="batchRunTime == 'Run Later'"
              label="Schedule"
              v-slot="{ ariaDescribedby }"
            >
              <b-form-radio
                v-model="batchRunSchedule"
                :aria-describedby="ariaDescribedby"
                name="schedule-options"
                value="N"
                >Tonight at 6:30PM</b-form-radio
              >
              <b-form-radio
                v-model="batchRunSchedule"
                :aria-describedby="ariaDescribedby"
                name="schedule-options"
                value="W"
                >Weekend Batch - Saturday 12:00PM</b-form-radio
              >
              <b-form-radio
                v-model="batchRunSchedule"
                :aria-describedby="ariaDescribedby"
                name="schedule-options"
                value="M"
                >Tomorrow at 6:30AM</b-form-radio
              >
              <b-form-radio
                v-model="batchRunSchedule"
                :aria-describedby="ariaDescribedby"
                name="schedule-options"
                value="Custom"
                >Custom</b-form-radio
              >
              <div class="pl-4" v-if="batchRunSchedule == 'Custom'">
                <!-- <label for="batch-datepicker">Choose a date:</label> -->

                <b-form-datepicker
                  id="batch-datepicker"
                  v-model="batchRunCustomDate"
                  class="mb-2"
                ></b-form-datepicker>
                <b-form-timepicker
                  id="timepicker-buttons"
                  v-model="batchRunCustomTime"
                  now-button
                  reset-button
                  locale="en"
                ></b-form-timepicker>
              </div>
            </b-form-group>
          </b-form-group>
        </b-modal>
        <b-modal
          :id="'DISTRUN_YE-modal-' + jobId"
          :title="'Run  Request ' + requestId"
          ok-title="Confirm"
          @ok="runBatch(jobId)"
        >
          <b-alert show variant="info">
            There will be more than 250 records processed
          </b-alert>
          You have selected to run the year end distribution, please confirm you
          want to perform this action.
        </b-modal>
      </div>
    </b-overlay>
  </div>
</template>
<script>
import { ValidationProvider, ValidationObserver, extend } from "vee-validate";
import TRAXService from "@/services/TRAXService.js";
import SchoolService from "@/services/SchoolService.js";
import StudentService from "@/services/StudentService.js";
import GraduationReportService from "@/services/GraduationReportService.js";
import BatchProcessingService from "@/services/BatchProcessingService.js";
import BatchConfirmInfo from "@/components/Batch/BatchConfimInfo.vue";
import { mapGetters } from "vuex";

extend("minmax", {
  validate(value, { min, max }) {
    return value.length >= min && value.length <= max;
  },
  params: ["min", "max"],
  message:
    "The {_field_} field must have at least {min} characters and {max} characters at most",
});
extend("validDate", {
  validate(value) {
    if ((value.match(/-/g) || []).length != 2) {
      return false;
    } else return true;
  },
  params: ["gradDateFrom"],
  message: "Format: YYYY-MM-DD",
});
extend("mincodelength", {
  validate(value) {
    return value.length == 8;
  },
  message: "Minimum 8 characters",
});
extend("lessthangraddateto", {
  validate(value, { gradDateTo }) {
    const date1 = new Date(value);
    const date2 = new Date(gradDateTo);
    if (gradDateTo) {
      return date1 < date2;
    } else return true;
  },
  params: ["gradDateTo"],
  message: "The Grad Start Date field must be less than {gradDateTo}",
});
extend("greaterthangraddateFrom", {
  validate(value, { gradDateFrom }) {
    const date1 = new Date(gradDateFrom);
    const date2 = new Date(value);
    if (gradDateFrom) {
      return date1 < date2;
    } else return true;
  },
  params: ["gradDateFrom"],
  message: "The Grad End Date field must be less than {gradDateFrom}",
});
extend("adultdogwoodpublicrestrictedtoministryofadvancededgroup", {
  validate(value, args) {
    // eslint-disable-next-line

    if (
      value == "Ministry of Advanced Education" &&
      args[0] == "Blank certificate print"
    ) {
      return "You can only print for public Adult Dogwood for Ministry of Advanced Education";
    } else return true;
  },
});

export default {
  components: {
    ValidationProvider: ValidationProvider,
    ValidationObserver: ValidationObserver,
    BatchConfirmInfo: BatchConfirmInfo,
  },
  data: function () {
    return {
      batchIsValid: false,
      batchTypes: [],
      batchRunDetails: "",
      cronTime: "",
      batchRunTime: "Run Now",
      batchRunCustomDate: "",
      batchRunCustomTime: "",
      batchRunSchedule: "",
      processingBatch: false,
      vv: "",
      validationMessage: "",
      validating: false,
      certificateTypes: [],
      transcriptTypes: [],
      blankTranscriptTypes: [],
      gradDateFrom: "",
      gradDateTo: "",
      batchTypeDesc: "",
      disableButton: false,
      formElements: {
        PSIRUN: {
          group: [
            { text: "", value: null },
            { text: "Student - N/A", value: "Student", disabled: true },
            { text: "School - N/A", value: "School", disabled: true },
            {
              text: "School Category - N/A",
              value: "Geographic District",
              disabled: true,
            },
            { text: "Program - N/A", value: "Program", disabled: true },
            { text: "PSI", value: "PSI" },
          ],
          psiYear: true,
          psiTransmissionMode: true,
        },
        DISTRUN_SUPP: {
          copies: true,
          where: true,
        },
        NONGRADRUN: {
          group: [{ text: "School Category", value: "District" }],
          copies: true,
          where: true,
        },
        DISTRUN: {
          copies: true,
          where: true,
        },
        DISTRUNUSER: {
          group: [
            { text: "", value: null },
            "Student",
            "School",
            { text: "School Category", value: "District" },
            "Program",
          ],
          copies: true,
          where: true,
        },
        TVRRUN: {
          group: [
            { text: "", value: null },
            "Student",
            "School",
            { text: "School Category", value: "District" },
            "Program",
          ],
        },
        REGALG: {
          group: [
            { text: "", value: null },
            "Student",
            "School",
            { text: "School Category", value: "District" },
            "Program",
          ],
        },
        DISTRUN_YE: {
          group: [{ text: "School Category", value: "District" }],
          copies: true,
          where: true,
        },
      },
    };
  },
  mounted() {
    extend(
      "validateschool",
      (value, refValues) => {
        return SchoolService.getSchoolInfo(value)
          .then((response) => {
            let credential = refValues[2];
            if (
              (credential == "Blank certificate print" || credential == "OT") &&
              response.data.transcriptEligibility == "N"
            ) {
              return "This school is not eligible for trasncripts.";
            }
            if (
              (credential == "Blank certificate print" ||
                credential == "OC" ||
                credential == "RC") &&
              response.data.certificateEligibility == "N"
            ) {
              return "This school is not eligible for certificates.";
            }
            if (response.data.minCode) {
              this.$refs[
                "schoolName" + refValues[0] + refValues[1]
              ][0].placeholder = response.data.schoolName;
              this.$refs[
                "transcriptEligibility" + refValues[0] + refValues[1]
              ][0].placeholder = response.data.transcriptEligibility;

              this.$refs[
                "certificateEligibility" + refValues[0] + refValues[1]
              ][0].placeholder = response.data.certificateEligibility;

              this.$refs[
                "schoolCategory" + refValues[0] + refValues[1]
              ][0].placeholder = response.data.schoolCategory;
              this.$refs[
                "reportingFlag" + refValues[0] + refValues[1]
              ][0].placeholder = response.data.reportingFlag;
              return { valid: true };
            } else {
              return {
                valid: false,
              };
            }
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(error);
            return {
              valid: false,
            };
          });
      },
      {
        immediate: false,
      }
    );
  },
  created() {
    this.formElements = Object.assign({}, this.formElements);
    this.transcriptTypes = this.getTranscriptTypes();
    this.certificateTypes = this.getCertificateTypes();
    this.batchTypes = this.getBatchJobTypes();
  },

  methods: {
    validBatch() {
      if (
        this.batch.details["what"] != "DISTRUN_YE" &&
        this.batch.details["what"] != "DISTRUN" &&
        this.batch.details["what"] != "DISTRUN_SUPP" &&
        this.batch.details["what"] != "NONGRADRUN"
      ) {
        if (
          this.batch.details["who"] == "" ||
          this.batch.details["who"] == null
        ) {
          this.batchIsValid = false;
          return;
        }
      }
      if (
        (this.batch.students.length == 1 &&
          this.batch.details["who"] == "Student") ||
        (this.batch.schools.length == 1 &&
          this.batch.details["who"] == "School") ||
        (this.batch.programs.length == 1 &&
          this.batch.details["who"] == "Program") ||
        (this.batch.districts.length == 1 &&
          this.batch.details["who"] == "District") ||
        (this.batch.psi.length == 1 &&
          this.batch.details["who"] == "PSI" &&
          !this.batch.details["allPsi"])
      ) {
        this.batchIsValid = false;
        return;
      }
      if (
        this.batch.details["who"] == "District" &&
        !this.batch.details["categoryCode"]
      ) {
        this.batchIsValid = false;
        return;
      }
      if (this.batch.details["what"] == "PSIRUN") {
        if (
          this.batch.details.psiTransmissionMode == "" ||
          this.batch.details.psiYear == ""
        ) {
          this.batchIsValid = false;
          return;
        }
      }
      if (
        this.batch.details["what"] == "DISTRUNUSER" &&
        this.batch.details["credential"] == ""
      ) {
        this.batchIsValid = false;
        return;
      }
      if (
        this.batch.details["what"] == "DISTRUNUSER" &&
        this.batch.details["where"] == "BC Mail" &&
        this.batch.details["credential"] == "Blank certificate print" &&
        this.batch.details["blankCertificateDetails"].length == 0
      ) {
        this.batchIsValid = false;
        return;
      }
      if (
        this.batch.details["what"] == "DISTRUNUSER" &&
        this.batch.details["where"] == "BC Mail" &&
        this.batch.details["credential"] == "Blank transcript print" &&
        this.batch.details["blankTranscriptDetails"].length == 0
      ) {
        this.batchIsValid = false;
        return;
      }
      this.batchIsValid = true;
    },
    getBatchJobTypes() {
      BatchProcessingService.getBatchJobTypes()
        .then((response) => {
          this.batchTypes = response.data;
          if (!this.allowRunDistrunYE)
            this.batchTypes = this.batchTypes.filter(
              (type) => type.code != "DISTRUN_YE"
            );
          if (!this.allowRunDistrunMonthly)
            this.batchTypes = this.batchTypes.filter(
              (type) => type.code != "DISTRUN"
            );
          if (!this.allowRunPSI)
            this.batchTypes = this.batchTypes.filter(
              (type) => type.code != "PSIRUN"
            );
          if (!this.allowRunDistrunSupplemental)
            this.batchTypes = this.batchTypes.filter(
              (type) => type.code != "DISTRUN_SUPP"
            );
          if (!this.allowRunNonGradRun)
            this.batchTypes = this.batchTypes.filter(
              (type) => type.code != "NONGRADRUN"
            );
        })
        .catch((error) => {
          this.$bvToast.toast("ERROR " + error.response.statusText, {
            title: "ERROR" + error.response.status,
            variant: "danger",
            noAutoHide: true,
          });
        });
    },
    groupFormValues(runType) {
      if (runType == "") {
        return;
      }
      if (
        this.batch.details["credential"] != "Blank certificate print" &&
        this.batch.details["credential"] != "Blank transcript print"
      ) {
        if (this.allowSelectCategoryCodeGroup && this.allowSelectProgramGroup) {
          return this.formElements[runType].group;
        } else {
          return [
            { text: "School", value: "School" },
            {
              text: "Student",
              value: "Student",
            },
          ];
        }
      } else if (
        this.batch.details["credential"] == "Blank certificate print" &&
        this.batch.details["blankCertificateDetails"] &&
        this.batch.details["blankCertificateDetails"].length == 1 &&
        this.batch.details["blankCertificateDetails"][0] == "A"
      ) {
        return [
          { text: "Choose...", value: "" },
          { text: "School", value: "School" },
          {
            text: "Ministry of Advanced Education",
            value: "Ministry of Advanced Education",
          },
        ];
      }
      if (
        this.batch.details["credential"] == "Blank certificate print" ||
        this.batch.details["credential"] == "Blank transcript print"
      ) {
        return [
          { text: "Choose...", value: "" },
          { text: "School", value: "School" },
          {
            text: "Ministry of Advanced Education - Select only Adult Dogwood (Public)",
            disabled: true,
          },
        ];
      }
    },
    hasFormElement(runType, inputName) {
      if (
        runType in this.formElements &&
        inputName in this.formElements[runType]
      ) {
        return this.formElements[runType][inputName];
      } else {
        return false;
      }
    },
    onSubmit(values) {
      alert(JSON.stringify(values, null, 2));
    },
    disableConfirm() {
      if (this.batchRunTime == "Run Now") {
        return false;
      } else {
        if (this.batchRunSchedule && this.batchRunSchedule == "Custom") {
          if (this.batchRunTime && this.batchRunCustomDate) {
            return false;
          } else {
            return true;
          }
        }
      }
    },
    resetModal() {
      this.batchRunSchedule = "";
      this.cronTime = "";
      this.batchRunTime = "Run Now";
      this.batchRunCustomDate = "";
      this.batchRunCustomTime = "";
    },
    runBatch(id) {
      if (this.batchRunTime == "Run Later") {
        this.cronTime = this.getCronTime();
        this.$emit("runbatch", id, this.cronTime);
      } else {
        this.$emit("runbatch", id);
      }
    },
    getCronTime() {
      if (this.batchRunSchedule == "N") {
        let today = new Date();
        return (
          "0 30 18 " + today.getDate() + " " + (today.getMonth() + 1) + " *"
        );
      } else if (this.batchRunSchedule == "W") {
        const today = new Date();
        const first = today.getDate() - today.getDay() + 1;
        const sixth = first + 5;
        const saturday = new Date(today.setDate(sixth));
        return (
          "0 30 18 " +
          saturday.getDate() +
          " " +
          (saturday.getMonth() + 1) +
          " *"
        );
      } else if (this.batchRunSchedule == "M") {
        const today = new Date();
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return (
          "0 30 18 " +
          tomorrow.getDate() +
          " " +
          (tomorrow.getMonth() + 1) +
          " *"
        );
      } else if (this.batchRunSchedule == "Custom") {
        let dateTime = new Date(
          this.batchRunCustomDate + "T" + this.batchRunCustomTime
        );
        return (
          dateTime.getSeconds() +
          " " +
          dateTime.getMinutes() +
          " " +
          dateTime.getHours() +
          " " +
          dateTime.getDate() +
          " " +
          (dateTime.getMonth() + 1) +
          " *"
        );
      } else {
        return null;
      }
    },
    cancelBatchJob(id) {
      //Use the parents method to close and clear a batch job by ID
      this.$emit("cancelBatchJob", id);
    },
    async addValueToTypeInBatchId(id, type, value, valueIndex) {
      this.validationMessage = "";
      if (type == "schools") {
        this.validating = true;
        if (value) {
          SchoolService.getSchoolInfo(value)
            .then((response) => {
              if (response.data.minCode) {
                this.$store.commit("batchprocessing/addValueToTypeInBatchId", {
                  id,
                  type,
                  value,
                });
                this.$refs["schoolName" + id + valueIndex][0].updateValue(
                  response.data.schoolName
                );
                this.$refs[
                  "transcriptEligibility" + id + valueIndex
                ][0].updateValue(response.data.transcriptEligibility);
                this.$refs[
                  "certificateEligibility" + id + valueIndex
                ][0].updateValue(response.data.certificateEligibility);
                this.$refs["schoolCategory" + id + valueIndex][0].updateValue(
                  response.data.schoolCategory
                );
                this.$refs["reportingFlag" + id + valueIndex][0].updateValue(
                  response.data.reportingFlag
                );
              } else {
                this.validationMessage = value + " is not a valid School.";
                this.deleteValueFromTypeInBatchId(id, type, value, false);
              }
              this.$forceUpdate();
              this.validBatch();
              this.validating = false;
            })
            .catch((error) => {
              if (error.response.statusText) {
                this.makeToast("ERROR " + error.response.statusText, "danger");
              } else {
                this.makeToast("ERROR " + "error with webservervice", "danger");
              }
              this.$forceUpdate();
            });
        } else {
          this.makeToast("ERROR Please enter a valid School", "danger");
        }

        this.validating = false;
      }
      if (type == "students") {
        //remove duplicates
        this.validating = true;
        if (value) {
          let student = await StudentService.getStudentByPen(value);
          if (student.data.length == 0) {
            this.validationMessage = value + " is not a valid PEN";
            this.deleteValueFromTypeInBatchId(id, type, value, false);
          } else if (student.data[0].studentStatus == "MER") {
            this.validationMessage =
              value + " is a merged student and not permitted";
          } else {
            //check if student has a gradStatus
            let studentGradStatus = await StudentService.getGraduationStatus(
              student.data[0].studentID
            );
            if (studentGradStatus) {
              //student is in grad system

              if (
                this.batch.details["what"] == "DISTRUNUSER" &&
                (this.batch.details["credential"] == "RC" ||
                  this.batch.details["credential"] == "OC")
              ) {
                let certificate =
                  await GraduationReportService.getStudentCertificates(
                    student.data[0].studentID
                  );
                if (certificate.data.length) {
                  //check that certificate has does nto have a null distribution date
                  if (this.batch.details["credential"] == "RC") {
                    for (let cert of certificate.data) {
                      if (!cert.distributionDate) {
                        this.validationMessage =
                          "Warning: This students' certificate distribution date is null.  Their original certificate has not been distributed.";
                        this.validating = false;
                      } else {
                        this.validationMessage = "";
                      }
                    }
                  }
                } else {
                  //student has a gradstatus but does not have a certificate
                  if (this.batch.details["credential"] == "RC") {
                    this.validationMessage =
                      "Cannot reprint certificate for this student.";
                  }
                  if (this.batch.details["credential"] == "OC") {
                    this.validationMessage =
                      "Cannot print certificate for this student,this student does not have a certificate.";
                  }
                  this.$forceUpdate();
                  this.validating = false;
                  return;
                }
              }
              this.$store.dispatch("batchprocessing/addValueToTypeInBatchId", {
                id,
                type,
                value,
              });
              this.$refs["pen" + id + valueIndex][0].updateValue(
                student.data[0].legalLastName +
                  ", " +
                  student.data[0].legalFirstName +
                  " " +
                  (student.data[0].legalMiddleNames
                    ? student.data[0].legalMiddleNames + " "
                    : "")
              );
              this.$refs["dob" + id + valueIndex][0].updateValue(
                student.data[0].dob
              );
              this.$refs["schoolOfRecord" + id + valueIndex][0].updateValue(
                student.data[0].schoolOfRecord
              );
              this.$refs["student-status" + id + valueIndex][0].updateValue(
                student.data[0].studentStatus
              );
              this.$refs["schoolAtGraduation" + id + valueIndex][0].updateValue(
                student.data[0].schoolAtGrad
              );
              this.$refs["program" + id + valueIndex][0].updateValue(
                student.data[0].program
              );
              this.$forceUpdate();
              this.validBatch();
              this.validating = false;
            } else {
              this.validationMessage = value + " is not a valid PEN in GRAD";
            }
          }
        } else {
          this.makeToast("ERROR Please enter a valid PEN", "danger");
        }
        this.validating = false;
      }
      if (type == "districts") {
        //remove duplicates
        this.validating = true;
        if (value) {
          TRAXService.getDistrict(value)
            .then((response) => {
              if (response.data) {
                this.$store.commit("batchprocessing/addValueToTypeInBatchId", {
                  id,
                  type,
                  value,
                });
                this.$refs["districtName" + id + valueIndex][0].updateValue(
                  response.data.districtName
                );
                this.$refs[
                  "districtActiveFlag" + id + valueIndex
                ][0].updateValue(response.data.activeFlag);
              } else {
                this.validationMessage = value + " is not a valid District";
                this.deleteValueFromTypeInBatchId(id, type, value, false);
              }
              this.$forceUpdate();
              this.validBatch();
              this.validating = false;
            })
            .catch((error) => {
              // eslint-disable-next-line
              console.log(error);
              this.validating = false;
            });
        } else {
          this.makeToast("ERROR Please enter a valid District", "danger");
        }
        this.validating = false;
      }
      if (type == "psi") {
        //remove duplicates
        this.validating = true;

        if (value && value.length == 3) {
          TRAXService.getPSIByAdvanceSearch("psiCode=" + value)
            .then((response) => {
              if (response.data.length) {
                this.$store.commit("batchprocessing/addValueToTypeInBatchId", {
                  id,
                  type,
                  value,
                });
                this.$refs["psiName" + id + valueIndex][0].updateValue(
                  response.data[0].psiName
                );
              } else {
                this.validationMessage = value + " is not a valid PSI";
                this.deleteValueFromTypeInBatchId(id, type, value, false);
              }
              this.$forceUpdate();
              this.validBatch();
              this.validating = false;
            })
            .catch((error) => {
              if (error.response.statusText) {
                this.makeToast("ERROR " + error.response.statusText, "danger");
              } else {
                this.makeToast("ERROR " + "error with webservervice", "danger");
              }
              this.validating = false;
            });
        } else {
          this.makeToast(
            "ERROR Please enter a valid 3 digit PSI code",
            "danger"
          );
          this.validating = false;
        }
      }
      if (type == "programs") {
        this.validating = true;
        if (value) {
          this.$store.commit("batchprocessing/addValueToTypeInBatchId", {
            id,
            type,
            value,
          });
        } else {
          this.validationMessage = "Select a program";
        }
        this.$forceUpdate();
        this.validBatch();
        this.validating = false;
      }
    },
    addTypeToBatchId(id, type) {
      this.$store.commit("batchprocessing/addTypeToBatchId", { type, id });
      this.$forceUpdate();
    },

    deleteValueFromTypeInBatchId(id, type, value, valid = true) {
      this.$store.commit("batchprocessing/deleteValueFromTypeInBatchId", {
        id,
        type,
        value,
        valid,
      });
      this.validBatch();
      this.$forceUpdate();
    },
    deleteBatch(id) {
      this.$store.commit("deleteStudentBatch", id);
    },
    clearBatchDetails: function (id) {
      this.$store.commit("batchprocessing/clearBatchDetails", id);
      this.batchIsValid = false;
    },
    clearBatchGroupDetails: function (id) {
      this.$store.commit("batchprocessing/clearBatchGroupDetails", id);
    },
    editBatchJob(type, event) {
      this.$nextTick(() => {
        let id = this.jobId;
        let batchDetail = this.batch;
        //change the value
        if (type == "what" && batchDetail.details[type] != event) {
          for (const batchType of this.batchTypes) {
            if (batchType.code == event) {
              this.batchTypeDesc = batchType.description;
            }
          }
          this.clearBatchDetails(id);
          if (event == "PSIRUN") {
            batchDetail.details["who"] = "PSI";
          }
          if (event == "DISTRUN_YE") {
            batchDetail.details["who"] = "District";
          }
          if (event == "DISTRUN_SUPP") {
            batchDetail.details["who"] = "District";
            batchDetail.details["categoryCode"] = "all";

            this.batch.districts = [
              {
                value: "all",
                districtName: "ALL DISTRICTS IN SCHOOL CATEGORY",
                city: "Y",
              },
              {},
            ];
          }
          if (event == "NONGRADRUN") {
            batchDetail.details["who"] = "District";
          }
        }
        if(type == "gradDate"){
          if(event == "Current Students"){
            this.editBatchJob('gradDateFrom', '')
            this.editBatchJob('gradDateTo', '')
          }
        }
        if (type == "categoryCode") {
          if (event != "04" || event != "09") {
            this.clearBatchGroupDetails(id);
          }

          if (event == "04") {
            this.batch.districts = [
              { value: "098", districtName: "YUKON TERRITORIES", city: "Y" },
              {},
            ];
          } else if (event == "09") {
            this.batch.districts = [
              { value: "103", districtName: "OFFSHORE INDEPENDENT", city: "Y" },
              {},
            ];
          } else if (
            this.batch.details["what"] == "DISTRUN_YE" ||
            this.batch.details["what"] == "NONGRADRUN"
          ) {
            if (event == "02" || event == "03") {
              this.batch.districts = [
                {
                  value: "all",
                  districtName: "ALL DISTRICTS IN SCHOOL CATEGORY",
                  city: "Y",
                },
                {},
              ];
            }
          }
        }
        if (type == "who" && batchDetail.details[type] != event) {
          this.clearBatchGroupDetails(id);
        }
        if (type == "who" && event == "Ministry of Advanced Education") {
          this.batch.details["where"] = "User";
          batchDetail.details["where"] = "User";
        }
        if (type == "credential" && batchDetail.details[type] != event) {
          batchDetail.details["blankCertificateDetails"] = [];
          batchDetail.details["blankTranscriptDetails"] = [];
        }
        if (type == "allPsi" && event) {
          batchDetail.psi = [{ value: "all", psiName: "ALL" }, {}];
          this.$store.commit("batchprocessing/editBatchDetails", {
            batchDetail,
            id,
          });
        } else if (type == "allPsi" && !event) {
          batchDetail.psi = [{}];
          this.$store.commit("batchprocessing/editBatchDetails", {
            batchDetail,
            id,
          });
        }
        if (type == "allDistricts" && event) {
          batchDetail.districts = [{ value: "all", districtName: "ALL" }, {}];
          this.$store.commit("batchprocessing/editBatchDetails", {
            batchDetail,
            id,
          });
        } else if (type == "allDistricts" && !event) {
          batchDetail.districts = [{}];
          this.$store.commit("batchprocessing/editBatchDetails", {
            batchDetail,
            id,
          });
        }
        batchDetail.details[type] = event;
        this.$store.commit("batchprocessing/editBatchDetails", {
          batchDetail,
          id,
        });
        this.validBatch();
        this.$forceUpdate();
      });
    },
    getCertificateTypes() {
      GraduationReportService.getCertificateTypes()
        .then((response) => {
          this.certificateTypes = response.data;
        })
        // eslint-disable-next-line
        .catch((error) => {
          if (error.response.statusText) {
            this.makeToast("ERROR " + error.response.statusText, "danger");
          } else {
            this.makeToast("ERROR " + "error with webservervice", "danger");
          }
        });
    },
    getTranscriptTypes() {
      GraduationReportService.getTranscriptTypes()
        .then((response) => {
          this.transcriptTypes = response.data;
          for (let transcriptType of this.transcriptTypes) {
            if (
              !["SCCP-FR", "BC1996-IND", "BC1986-IND"].includes(
                transcriptType.code
              )
            ) {
              this.blankTranscriptTypes.push(transcriptType);
            }
          }
        })
        // eslint-disable-next-line
        .catch((error) => {
          if (error.response.statusText) {
            this.makeToast("ERROR " + error.response.statusText, "danger");
          } else {
            this.makeToast("ERROR " + "error with webservervice", "danger");
          }
        });
    },
    makeToast(message, variant) {
      this.$bvToast.toast(message, {
        title: message,
        variant: variant,
        noAutoHide: true,
      });
    },
  },
  props: {
    jobId: String,
    currentPSIYear: String,
  },
  computed: {
    ...mapGetters({
      tabContent: "batchprocessing/getBatchDetails",
      programOptions: "app/getProgramOptions",
      userFullName: "auth/userFullName",
      allowRunDistrunYE: "useraccess/allowRunDistrunYE",
      allowRunDistrunSupplemental: "useraccess/allowRunDistrunSupplemental",
      allowRunNonGradRun: "useraccess/allowRunNonGradRun",
      allowRunDistrunMonthly: "useraccess/allowRunDistrunMonthly",
      allowSelectProgramGroup: "useraccess/allowSelectProgramGroup",
      allowSelectCategoryCodeGroup: "useraccess/allowSelectCategoryCodeGroup",
      allowRunPSI: "useraccess/allowRunPSI",
    }),

    batch() {
      return this.tabContent[this.jobId];
    },
    requestId() {
      return this.jobId.replace("job-", "");
    },
  },
};
</script>
<style scoped>
input {
  border-radius: 0px;
}
</style>
