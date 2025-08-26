<template>

    <v-expansion-panels v-model="panel" multiple>
        <v-expansion-panel elevation="0" rounded="0" style="background-color: transparent; border: none"
            :expand="expand">
            <v-alert type="info" border="start" variant="tonal" density="compact" class="my-0 pl-4 py-0">
                <template #prepend>
                    <div class="mt-2">
                        <v-icon color="info">mdi-information</v-icon>
                    </div>
                </template>

                <v-expansion-panel-title class="d-flex align-center justify-space-between ml-0 pl-0">
                    <div class="d-flex align-center flex-grow-1">
                        <span>Instructions for calculating as blended mark</span>
                        <v-spacer />
                        <span class="text-caption text-grey-darken-1">View Instructions</span>
                    </div>
                </v-expansion-panel-title>

                <v-expansion-panel-text class="m-0 p-0">
                    <strong>Step 1: Determine if the Exam Was Required</strong>
                    <p>
                    <ul class="mb-4">
                        <li class="ml-4">Use the <router-link to="/courses/examinable-courses/" target="_blank"
                                rel="noopener noreferrer">
                                Examinable Course Table <v-icon>mdi-open-in-new</v-icon>
                            </router-link> to check the course code, level, and
                            applicable
                            graduation program.
                        </li>
                    </ul>

                    </p>

                    <strong>Step 2: Check the Timing</strong>
                    <ul class="mb-4">
                        <li class="ml-4">The school mark session date must be within <strong>36 months</strong> of the
                            exam session
                            date.</li>
                        <li class="ml-4">If not, you may enter the school mark but <strong>do not assign a final
                                mark</strong>. The course cannot appear as completed on a transcript. In such cases,
                            advise the student
                            to request a school-based transcript.</li>
                    </ul>

                    <strong>Step 3A: Adding a New School and Final Mark Session</strong>
                    <ul class="mb-4">
                        <li class="ml-4">Enter the school session date (must be within 36 months of the exam
                            session).
                        </li>
                        <li class="ml-4">Enter the new school %, the best school %, and the best exam %.</li>
                        <li class="ml-4">Use the table to find the appropriate exam and school weighting.</li>
                        <li class="ml-4">Note: Some Grade 12 courses were 50/50 weighted prior to 1996/08.</li>
                    </ul>

                    <p>
                        <strong>Final Mark Formula:</strong><br />

                    <ul>
                        <li class="ml-4">
                            Final Mark % = (Best Exam % × Exam Weight) + (Best School % × School Weight). Round to the
                            nearest whole
                            number. <em>Example:</em> SS 11 with a Best Exam of 64% and a Best School of 52%:
                            (.64 × .20) + (.52 × .80) = <strong>54% Final Mark</strong>
                        </li>
                        <li class="ml-4">
                            Assign the letter grade using the
                            <router-link to="/programs/letter-grades" target="_blank" rel="noopener noreferrer">
                                Letter Grades table <v-icon>mdi-open-in-new</v-icon>
                            </router-link>
                            under the Program tab.
                        </li>
                    </ul>
                    </p>
                    <strong>Step 3B: Updating an Existing School Mark Session</strong>
                    <ul class="mb-4">
                        <li class="ml-4">Enter the new school % and update the best school %.</li>
                        <li class="ml-4">Recalculate the final mark % using the same formula as in Step 3A.</li>
                        <li class="ml-4">Update the letter grade accordingly.</li>
                    </ul>
                </v-expansion-panel-text>
            </v-alert>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
export default {
    name: 'BlendedMarkInstructions',
    props: {
        expand: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            panel: this.expand ? [0] : [],
        };
    },
};
</script>
