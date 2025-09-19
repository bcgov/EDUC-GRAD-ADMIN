<template>
    <div>
        <v-alert v-if="studentStatus === 'DEC'" type="warning" border="start" variant="tonal" density="compact"
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