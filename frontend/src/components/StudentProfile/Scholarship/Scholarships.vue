<template>
    <v-row>
        <v-col cols="6">
            <v-card>
                 <v-card-title>
                    <v-row>
                        <v-col class="font-weight-bold d-flex justify-start" cols="4">
                            Citizenship
                        </v-col>
                        <v-col class="d-flex justify-end" v-if="!isCitizenshipEdit">
                            <v-btn id="edit" color="#003366" text="Edit" variant="outlined" class="mr-1"
                                prepend-icon="mdi-pencil" @click="editCitizenship" />
                        </v-col>
                        <v-col class="d-flex justify-end" v-else>
                            <v-btn id="cancel" color="#003366" text="Cancel" variant="outlined" class="mr-1"
                                @click="isCitizenshipEdit = !isCitizenshipEdit" />
                            <v-btn id="save" color="#003366" text="Save" class="ml-1" :disabled="!isCitizenshipFormValid"
                                @click="updateCitizenship" />
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <div v-if="!isCitizenshipEdit">
                        <v-row>
                            <v-col class="header-text" cols="4">
                                Citizenship
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="mt-n4" cols="4">
                                {{ mapCitizenshipCode(student?.studentCitizenship) }}
                            </v-col>
                        </v-row>
                    </div>
                    <v-form ref="citizenshipFormRef" v-model="isCitizenshipFormValid" v-else>
                        <v-row no-gutters>
                            <v-col cols="4" class="d-flex">
                                <v-select id="citizenship" v-model="studentCopy.studentCitizenship" :items="citizenshipCodes"
                                    item-title="label" item-value="citizenshipCode" :rules="[requiredRule]" dense
                                    variant="underlined" label="Citizenship" outlined />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="6">
            <v-card class="mb-3">
                <v-card-title>
                    <v-row>
                        <v-col class="font-weight-bold d-flex justify-start" cols="4">
                            Address
                        </v-col>
                        <v-col class="d-flex justify-end" v-if="!isEdit">
                            <v-btn id="edit" color="#003366" text="Edit" variant="outlined" class="mr-1"
                                prepend-icon="mdi-pencil" @click="edit" />
                        </v-col>
                        <v-col class="d-flex justify-end" v-else>
                            <v-btn id="cancel" color="#003366" text="Cancel" variant="outlined" class="mr-1"
                                @click="isEdit = !isEdit" />
                            <v-btn id="save" color="#003366" text="Save" class="ml-1" :disabled="!isAddressFormValid"
                                @click="save" />
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text>
                    <div v-if="!isEdit">
                        <v-row>
                            <v-col class="header-text" cols="4">
                                Address line 1
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="mt-n4" cols="4">
                                {{ studentAddress?.addressLine1 }}
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="header-text mt-n2" cols="4">
                                Address line 2
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="mt-n4" cols="4">
                                {{ studentAddress?.addressLine2 }}
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="header-text mt-n2" cols="4">
                                City
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="mt-n4" cols="4">
                                {{ studentAddress?.city }}
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="header-text mt-n2" cols="4">
                                Country
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="mt-n4" cols="4">
                                {{ mapCountryCode(studentAddress?.countryCode) }}
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="header-text mt-n2" cols="4">
                                Province/State
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="mt-n4" cols="4">
                                {{ mapProvinceCode(studentAddress?.provinceStateCode) }}
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="header-text mt-n2" cols="4">
                                Postal/Zip
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col class="mt-n4" cols="4">
                                {{ studentAddress?.postalZip }}
                            </v-col>
                        </v-row>

                    </div>
                    <v-form v-else ref="addressFormRef" v-model="isAddressFormValid">

                        <v-row no-gutters>
                            <v-col cols="4">
                                <v-text-field id="mailAddressLine1" v-model="studentAddressCopy.addressLine1"
                                    variant="underlined" label="Address Line 1" :rules="[requiredRule]" :maxlength="255"
                                    class="pb-5" hide-details="auto" />
                            </v-col>
                        </v-row>

                        <v-row no-gutters>
                            <v-col cols="4">
                                <v-text-field id="addressLine2" v-model="studentAddressCopy.addressLine2"
                                    variant="underlined" label="Address Line 2" :maxlength="255" class="pb-5"
                                    hide-details="auto" />
                            </v-col>
                        </v-row>

                        <v-row no-gutters>
                            <v-col cols="4">
                                <v-text-field id="city" v-model="studentAddressCopy.city" variant="underlined"
                                    label="City" :rules="[requiredRule]" :maxlength="255" class="pb-5"
                                    hide-details="auto" />
                            </v-col>
                        </v-row>

                        <v-row no-gutters>
                            <v-col cols="4" class="d-flex">
                                <v-select id="country" v-model="studentAddressCopy.countryCode" :items="country"
                                    item-title="label" item-value="countryCode" :rules="[requiredRule]" dense
                                    variant="underlined" label="Country" outlined />
                            </v-col>
                        </v-row>

                        <v-row no-gutters v-if="studentAddressCopy.countryCode === 'CN'">
                            <v-col cols="4" class="d-flex">
                                <v-select id="province" v-model="studentAddressCopy.provinceStateCode" :items="province"
                                    item-title="label" variant="underlined" item-value="provinceCode" dense
                                    label="Province/State" outlined :rules="[requiredRule]" />
                            </v-col>
                        </v-row>

                        <v-row v-else no-gutters>
                            <v-col cols="4">
                                <v-text-field id="province" v-model="studentAddressCopy.provinceStateCode"
                                    variant="underlined" label="Province/State" :rules="[requiredRule]" :maxlength="2"
                                    class="pb-5" hide-details="auto" />
                            </v-col>
                        </v-row>

                        <v-row no-gutters>
                            <v-col cols="4">
                                <v-text-field id="postal" v-model="studentAddressCopy.postalZip" variant="underlined"
                                    label="Postal/Zip"
                                    :rules="studentAddressCopy.countryCode === 'CN' ? [requiredRule, postalCodeRule] : [requiredRule]" />
                            </v-col>
                        </v-row>
                    </v-form>

                </v-card-text>
            </v-card>
        </v-col>
    </v-row>

</template>

<script>
import ApiService from '@/common/apiService';
import { useSnackbarStore } from '@/store/modules/snackbar';
import { cloneDeep } from 'lodash';

export default {
    name: 'Scholarships',
    components: {

    },
    mixins: [],
    props: {
        studentID: {
            type: String,
            required: true,
        },
    },
    emits: [],
    data() {
        return {
            studentAddress: {},
            studentAddressCopy: {},
            student: {},
            studentCopy: {},
            isAddressFormValid: false,
            isCitizenshipFormValid: false,
            isEdit: false,
            isCitizenshipEdit: false,
            snackbarStore: useSnackbarStore(),
            province: [],
            country: [],
            citizenshipCodes: [],
            requiredRule: (v) => !!v || 'Required',
            postalCodeRule: v => /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i.test(v) || 'Postal code must be valid'
        };
    },
    computed: {

    },
    watch: {

    },
    async created() {

    },
    async mounted() {
        this.getCountry();
        this.getProvinces();
        this.getCitizenshipCodes();
        this.getStudentAddress(this.studentID);
        this.getStudent();
    },
    methods: {
        getProvinces() {
            ApiService.apiAxios.get(`/api/scholarship/province-codes`)
                .then(response => {
                    this.province = response.data;
                }).catch(error => {
                    console.error(error);
                    this.snackbarStore.showSnackbar('An error occurred while loading provinces/states.', "error");
                })
        },
        getCitizenshipCodes() {
            ApiService.apiAxios.get(`/api/scholarship/citizenship-codes`)
                .then(response => {
                    this.citizenshipCodes = response.data;
                }).catch(error => {
                    console.error(error);
                    this.snackbarStore.showSnackbar('An error occurred while loading citizenship codes.', "error");
                })
        },
        async getStudent() {
            await ApiService.apiAxios.get(`/api/student/${this.studentID}/gradProgram/status`)
                .then((response) => {
                    this.student = response.data;
                }).catch((error) => {
                    console.error(error);
                    this.snackbarStore.showSnackbar(
                        "Error loading student citizenship.",
                        "error",
                        5000
                    );
                });
        },
        validateForm() {
            this.$refs?.addressFormRef?.validate();
        },
        validateCitizenshipForm() {
            this.$refs?.citizenshipFormRef?.validate();
        },
        getCountry() {
            ApiService.apiAxios.get(`/api/scholarship/country-codes`)
                .then(response => {
                    this.country = response.data;
                }).catch(error => {
                    console.error(error);
                    this.snackbarStore.showSnackbar('An error occurred while loading countries.', "error");
                })
        },
        async getStudentAddress(studentID) {
            await ApiService.apiAxios.get(`/api/scholarship/student/${studentID}/address`)
                .then(response => {
                    this.studentAddress = response.data;
                }).catch(error => {
                    console.error(error);
                    this.snackbarStore.showSnackbar('An error occurred while trying to get student address. Please try again later.', "error");
                })
        },
        edit() {
            this.studentAddressCopy = cloneDeep(this.studentAddress);
            this.isEdit = !this.isEdit;
        },
        save() {
            ApiService.apiAxios.put(`/api/scholarship/student/${this.studentID}/address/${this.studentAddressCopy.studentAddressId}`, this.studentAddressCopy)
                .then(() => {
                    this.snackbarStore.showSnackbar('Student address has been updated.',);
                }).catch(error => {
                    console.error(error);
                    this.snackbarStore.showSnackbar('An error occurred while trying to save student address. Please try again later.', "error");
                }).finally(() => {
                    this.isEdit = !this.isEdit;
                    this.getStudentAddress(this.studentID);
                });
        },
        mapCountryCode(code) {
            let selection = this.country.filter(cntry => code === cntry.countryCode);
            return selection ? selection[0]?.countryCode + '-' + selection[0]?.description : code + '-';
        },
        mapProvinceCode(code) {
            let selection = this.province.filter(prov => code === prov.provinceCode);
            return selection ? selection[0]?.provinceCode + '-' + selection[0]?.description : code + '-';
        },
        editCitizenship() {
            this.studentCopy = cloneDeep(this.student);
            this.isCitizenshipEdit = !this.isCitizenshipEdit;
        },
        updateCitizenship() {
            ApiService.apiAxios.post(`/api/student/${this.studentID}/gradProgram/status`, this.studentCopy)
                .then(() => {
                    this.snackbarStore.showSnackbar('Student citizenship has been updated.',);
                }).catch(error => {
                    console.error(error);
                    this.snackbarStore.showSnackbar('An error occurred while trying to save student citizenship. Please try again later.', "error");
                }).finally(() => {
                    this.isCitizenshipEdit = !this.isCitizenshipEdit;
                    this.getStudent();
                }); 
        },
        mapCitizenshipCode(code) {
            let selection = this.citizenshipCodes.filter(citz => code === citz.citizenshipCode);
            return selection ? selection[0]?.label : '';
        }
    }
};
</script>

<style scoped>
.header-text {
    color: gray;
}
</style>
