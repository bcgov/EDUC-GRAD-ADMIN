<template>
    <div>

        <v-alert v-if="studentStatus === 'ARC'" type="warning" border="start" variant="tonal" density="compact"
            icon="mdi-alert-circle">
            This student is not active. Re-activate by setting their status to "CUR" if they are currently attending
            school.
        </v-alert>

        <v-alert v-else-if="studentStatus === 'TER'" type="warning" border="start" variant="tonal" density="compact"
            icon="mdi-alert-circle">
            This student has been terminated. Re-activate by setting their status to "CUR" if they are currently
            attending school.
        </v-alert>

        <v-alert v-else-if="studentStatus === 'DEC'" type="warning" border="start" variant="tonal" density="compact"
            icon="mdi-alert-circle">
            This student is showing as deceased.
        </v-alert>
    </div>
</template>

<script>
export default {
    name: 'StudentStatusAlert',
    props: {
        studentStatus: {
            type: String,
            required: true,
        },
    },
};
</script>